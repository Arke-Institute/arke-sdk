/**
 * Upload to Entity Helper
 *
 * Upload one or more files to an existing entity.
 * Handles presigned URL flow with parallel uploads and sequential CAS completion.
 */

import type { ArkeClient } from '../../client/ArkeClient.js';
import { computeCid } from './cid.js';
import { getMimeType } from './scanners.js';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A single file to upload to an entity.
 */
export interface UploadItem {
  /** Content key. Defaults to filename without extension, or "file_{cid_hash}" if no filename. */
  key?: string;
  /** File data */
  data: File | Blob | ArrayBuffer | Uint8Array;
  /** MIME type (auto-detected from filename if not provided) */
  contentType?: string;
  /** Original filename for Content-Disposition on download */
  filename?: string;
}

/**
 * Progress information during upload to entity.
 */
export interface UploadToEntityProgress {
  /** Current phase */
  phase: 'preparing' | 'uploading' | 'completing';
  /** Total bytes across all files */
  totalBytes: number;
  /** Bytes uploaded so far */
  uploadedBytes: number;
  /** Number of files completed */
  completedFiles: number;
  /** Total number of files */
  totalFiles: number;
}

/**
 * Options for uploading to an entity.
 */
export interface UploadToEntityOptions {
  /** Progress callback */
  onProgress?: (progress: UploadToEntityProgress) => void;
}

/**
 * Result for a single uploaded file.
 */
export interface UploadContentResult {
  /** Content version key */
  key: string;
  /** Content CID */
  cid: string;
  /** File size in bytes */
  size: number;
  /** MIME type */
  contentType: string;
  /** Original filename */
  filename?: string;
}

/**
 * Result of uploading to an entity.
 */
export interface UploadToEntityResult {
  /** Entity ID */
  id: string;
  /** Final entity CID after all uploads */
  cid: string;
  /** Entity CID before first upload */
  prevCid: string;
  /** Results for each uploaded file */
  contents: UploadContentResult[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Internal Types
// ─────────────────────────────────────────────────────────────────────────────

interface PreparedItem {
  key: string;
  bytes: ArrayBuffer;
  size: number;
  contentType: string;
  filename?: string;
  cid: string;
}

interface UploadedItem extends PreparedItem {
  uploadUrl: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const MAX_CAS_RETRIES = 3;

// ─────────────────────────────────────────────────────────────────────────────
// Main Function
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Upload one or more files to an existing entity.
 *
 * Files are uploaded in parallel for speed, then metadata is committed
 * sequentially with CAS protection to ensure consistency.
 *
 * @example
 * ```typescript
 * // Single file
 * const result = await uploadToEntity(client, entityId, [
 *   { key: 'v1', data: file }
 * ]);
 *
 * // Multiple files (e.g., original + thumbnail)
 * const result = await uploadToEntity(client, entityId, [
 *   { key: 'original', data: originalFile },
 *   { key: 'thumbnail', data: thumbnailBlob },
 *   { key: 'preview', data: previewBlob },
 * ]);
 *
 * // With progress tracking
 * const result = await uploadToEntity(client, entityId, items, {
 *   onProgress: (p) => console.log(`${p.phase}: ${p.uploadedBytes}/${p.totalBytes}`),
 * });
 * ```
 */
export async function uploadToEntity(
  client: ArkeClient,
  entityId: string,
  items: UploadItem[],
  options: UploadToEntityOptions = {}
): Promise<UploadToEntityResult> {
  if (items.length === 0) {
    throw new Error('At least one upload item is required');
  }

  const { onProgress } = options;

  // Progress state
  let progressState: UploadToEntityProgress = {
    phase: 'preparing',
    totalBytes: 0,
    uploadedBytes: 0,
    completedFiles: 0,
    totalFiles: items.length,
  };

  const reportProgress = (update: Partial<UploadToEntityProgress>) => {
    progressState = { ...progressState, ...update };
    onProgress?.(progressState);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // PHASE 1: Prepare all files (parallel)
  // - Convert to ArrayBuffer
  // - Determine size, contentType, filename
  // - Compute CID
  // ─────────────────────────────────────────────────────────────────────────
  reportProgress({ phase: 'preparing' });

  const prepared: PreparedItem[] = await Promise.all(
    items.map((item) => prepareItem(item))
  );

  const totalBytes = prepared.reduce((sum, p) => sum + p.size, 0);
  reportProgress({ totalBytes });

  // ─────────────────────────────────────────────────────────────────────────
  // PHASE 2: Get presigned URLs (parallel, no tip needed)
  // ─────────────────────────────────────────────────────────────────────────
  const uploadInfos: UploadedItem[] = await Promise.all(
    prepared.map(async (item) => {
      const { data: presigned, error } = await client.api.POST(
        '/entities/{id}/content/upload-url',
        {
          params: { path: { id: entityId } },
          body: {
            cid: item.cid,
            content_type: item.contentType,
            size: item.size,
          },
        }
      );

      if (error || !presigned) {
        throw new Error(
          `Failed to get upload URL for ${item.key}: ${JSON.stringify(error)}`
        );
      }

      return {
        ...item,
        uploadUrl: presigned.upload_url,
      };
    })
  );

  // ─────────────────────────────────────────────────────────────────────────
  // PHASE 3: Upload to R2 (parallel - the slow part)
  // ─────────────────────────────────────────────────────────────────────────
  reportProgress({ phase: 'uploading', uploadedBytes: 0 });

  let uploadedBytes = 0;
  await Promise.all(
    uploadInfos.map(async (item) => {
      const response = await fetch(item.uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': item.contentType },
        body: item.bytes,
      });

      if (!response.ok) {
        throw new Error(
          `Upload to R2 failed for ${item.key}: ${response.statusText}`
        );
      }

      uploadedBytes += item.size;
      reportProgress({ uploadedBytes });
    })
  );

  // ─────────────────────────────────────────────────────────────────────────
  // PHASE 4: Get current tip
  // ─────────────────────────────────────────────────────────────────────────
  const { data: tipData, error: tipError } = await client.api.GET(
    '/entities/{id}/tip',
    { params: { path: { id: entityId } } }
  );

  if (tipError || !tipData) {
    throw new Error(`Failed to get entity tip: ${JSON.stringify(tipError)}`);
  }

  const prevCid = tipData.cid;
  let currentTip = prevCid;

  // ─────────────────────────────────────────────────────────────────────────
  // PHASE 5: Complete uploads (sequential with CAS retry)
  // ─────────────────────────────────────────────────────────────────────────
  reportProgress({ phase: 'completing', completedFiles: 0 });

  const contents: UploadContentResult[] = [];
  let finalCid = currentTip;

  for (let i = 0; i < uploadInfos.length; i++) {
    const item = uploadInfos[i]!;
    const result = await completeWithRetry(client, entityId, item, currentTip);

    currentTip = result.cid; // Use new tip for next complete
    finalCid = result.cid;

    contents.push({
      key: item.key,
      cid: result.contentCid,
      size: item.size,
      contentType: item.contentType,
      filename: item.filename,
    });

    reportProgress({ completedFiles: i + 1 });
  }

  return {
    id: entityId,
    cid: finalCid,
    prevCid,
    contents,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Prepare an upload item: convert to bytes, detect metadata, compute CID.
 */
async function prepareItem(item: UploadItem): Promise<PreparedItem> {
  const { data } = item;

  // Convert to ArrayBuffer
  let bytes: ArrayBuffer;
  if (data instanceof Blob) {
    bytes = await data.arrayBuffer();
  } else if (data instanceof ArrayBuffer) {
    bytes = data;
  } else {
    // Uint8Array - copy to handle SharedArrayBuffer
    const buffer = new ArrayBuffer(data.byteLength);
    new Uint8Array(buffer).set(data);
    bytes = buffer;
  }

  // Determine properties
  const size = bytes.byteLength;
  let filename = item.filename;
  let contentType = item.contentType;

  if (data instanceof File) {
    filename = filename ?? data.name;
    contentType = contentType ?? (data.type || getMimeType(data.name));
  }

  contentType = contentType ?? 'application/octet-stream';
  if (contentType === 'application/octet-stream' && filename) {
    contentType = getMimeType(filename);
  }

  // Compute CID
  const cid = await computeCid(new Uint8Array(bytes));

  // Determine key: explicit > filename without extension > cid-based
  let key = item.key;
  if (!key && filename) {
    // Strip extension: "document.pdf" -> "document"
    const lastDot = filename.lastIndexOf('.');
    key = lastDot > 0 ? filename.substring(0, lastDot) : filename;
  }
  if (!key) {
    // Use last 8 chars of CID for uniqueness
    key = `file_${cid.slice(-8)}`;
  }

  return { key, bytes, size, contentType, filename, cid };
}

/**
 * Complete an upload with CAS retry on conflict.
 */
async function completeWithRetry(
  client: ArkeClient,
  entityId: string,
  item: UploadedItem,
  expectTip: string
): Promise<{ cid: string; contentCid: string }> {
  let tip = expectTip;

  for (let attempt = 0; attempt < MAX_CAS_RETRIES; attempt++) {
    const { data, error, response } = await client.api.POST(
      '/entities/{id}/content/complete',
      {
        params: { path: { id: entityId } },
        body: {
          key: item.key,
          cid: item.cid,
          size: item.size,
          content_type: item.contentType,
          filename: item.filename,
          expect_tip: tip,
        },
      }
    );

    if (data) {
      return { cid: data.cid, contentCid: data.content.cid };
    }

    // Check for CAS conflict (409)
    if (response?.status === 409) {
      // Refresh tip and retry
      const { data: freshTip, error: tipError } = await client.api.GET(
        '/entities/{id}/tip',
        { params: { path: { id: entityId } } }
      );

      if (tipError || !freshTip) {
        throw new Error(`Failed to refresh tip: ${JSON.stringify(tipError)}`);
      }

      tip = freshTip.cid;
      continue;
    }

    // Other error - throw immediately
    throw new Error(
      `Failed to complete upload for ${item.key}: ${JSON.stringify(error)}`
    );
  }

  throw new Error(`Max CAS retries exceeded for ${item.key}`);
}
