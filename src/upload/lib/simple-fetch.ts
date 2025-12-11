/**
 * Simple upload logic for files < 5 MB (fetch-based)
 */

import { UploadError } from '../utils/errors.js';
import { retryWithBackoff } from '../utils/retry.js';

export interface SimpleUploadOptions {
  maxRetries?: number;
  retryInitialDelay?: number;
  retryMaxDelay?: number;
  retryJitter?: boolean;
}

/**
 * Upload file data using simple PUT to presigned URL
 */
export async function uploadSimple(
  fileData: ArrayBuffer,
  presignedUrl: string,
  contentType?: string,
  options: SimpleUploadOptions = {}
): Promise<void> {
  const { maxRetries = 3, retryInitialDelay, retryMaxDelay, retryJitter } = options;

  await retryWithBackoff(
    async () => {
      let response: Response;
      try {
        response = await fetch(presignedUrl, {
          method: 'PUT',
          body: fileData,
          headers: {
            ...(contentType ? { 'Content-Type': contentType } : {}),
          },
        });
      } catch (error: any) {
        // Network-level errors (connection refused, timeout, etc.)
        throw new UploadError(`Upload failed: ${error.message}`, undefined, undefined, error);
      }

      if (!response.ok) {
        // Extract Retry-After header for 429 responses
        const retryAfter = response.headers.get('retry-after');
        const error = new UploadError(
          `Upload failed with status ${response.status}: ${response.statusText}`,
          undefined,
          response.status
        );

        // Attach retry-after if present (convert to seconds)
        if (retryAfter && response.status === 429) {
          (error as any).retryAfter = parseInt(retryAfter, 10);
        }

        throw error;
      }
    },
    {
      maxRetries,
      initialDelay: retryInitialDelay,
      maxDelay: retryMaxDelay,
      jitter: retryJitter,
    }
  );
}
