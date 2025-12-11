/**
 * Multipart upload logic for files ≥ 5 MB (fetch-based)
 */

import type { PartInfo } from '../types/api.js';
import { UploadError } from '../utils/errors.js';
import { retryWithBackoff } from '../utils/retry.js';

const DEFAULT_PART_SIZE = 10 * 1024 * 1024; // 10 MB

export interface MultipartUploadOptions {
  maxRetries?: number;
  retryInitialDelay?: number;
  retryMaxDelay?: number;
  retryJitter?: boolean;
}

/**
 * Upload file data using multipart upload with presigned URLs
 * @param fileData - File data as ArrayBuffer
 * @param presignedUrls - Array of presigned URLs for each part
 * @param concurrency - Number of parts to upload in parallel
 * @param options - Upload retry options
 * @returns Array of PartInfo with ETags
 */
export async function uploadMultipart(
  fileData: ArrayBuffer,
  presignedUrls: string[],
  concurrency: number = 3,
  options: MultipartUploadOptions = {}
): Promise<PartInfo[]> {
  const totalSize = fileData.byteLength;
  const partSize = Math.ceil(totalSize / presignedUrls.length);

  // Create upload tasks for each part
  const parts: PartInfo[] = [];
  const queue: Array<() => Promise<void>> = [];

  const { maxRetries = 3, retryInitialDelay, retryMaxDelay, retryJitter } = options;

  for (let i = 0; i < presignedUrls.length; i++) {
    const partNumber = i + 1;
    const start = i * partSize;
    const end = Math.min(start + partSize, totalSize);
    const partData = fileData.slice(start, end);
    const url = presignedUrls[i];

    queue.push(async () => {
      const etag = await uploadPart(partData, url, partNumber, maxRetries, {
        initialDelay: retryInitialDelay,
        maxDelay: retryMaxDelay,
        jitter: retryJitter,
      });
      parts.push({ part_number: partNumber, etag });
    });
  }

  // Execute uploads with concurrency control
  await executeWithConcurrency(queue, concurrency);

  // Sort parts by part number
  parts.sort((a, b) => a.part_number - b.part_number);

  return parts;
}

/**
 * Upload a single part
 */
async function uploadPart(
  partData: ArrayBuffer,
  presignedUrl: string,
  partNumber: number,
  maxRetries: number = 3,
  retryOptions: { initialDelay?: number; maxDelay?: number; jitter?: boolean } = {}
): Promise<string> {
  return retryWithBackoff(
    async () => {
      let response: Response;
      try {
        response = await fetch(presignedUrl, {
          method: 'PUT',
          body: partData,
        });
      } catch (error: any) {
        // Network-level errors (connection refused, timeout, etc.)
        throw new UploadError(
          `Part ${partNumber} upload failed: ${error.message}`,
          undefined,
          undefined,
          error
        );
      }

      if (!response.ok) {
        // Extract Retry-After header for 429 responses
        const retryAfter = response.headers.get('retry-after');
        const error = new UploadError(
          `Part ${partNumber} upload failed with status ${response.status}: ${response.statusText}`,
          undefined,
          response.status
        );

        // Attach retry-after if present (convert to seconds)
        if (retryAfter && response.status === 429) {
          (error as any).retryAfter = parseInt(retryAfter, 10);
        }

        throw error;
      }

      // Get ETag from response headers
      const etag = response.headers.get('etag');
      if (!etag) {
        throw new UploadError(
          `Part ${partNumber} upload succeeded but no ETag returned`,
          undefined,
          response.status
        );
      }

      // Clean ETag (remove quotes if present)
      return etag.replace(/"/g, '');
    },
    {
      maxRetries,
      initialDelay: retryOptions.initialDelay,
      maxDelay: retryOptions.maxDelay,
      jitter: retryOptions.jitter,
    }
  );
}

/**
 * Execute tasks with controlled concurrency
 */
async function executeWithConcurrency(
  tasks: Array<() => Promise<void>>,
  concurrency: number
): Promise<void> {
  const queue = [...tasks];
  const workers: Promise<void>[] = [];

  const processNext = async () => {
    while (queue.length > 0) {
      const task = queue.shift()!;
      await task();
    }
  };

  // Start concurrent workers
  for (let i = 0; i < Math.min(concurrency, tasks.length); i++) {
    workers.push(processNext());
  }

  await Promise.all(workers);
}
