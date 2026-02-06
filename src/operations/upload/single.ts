/**
 * Single File Upload Helper
 *
 * Simplified upload for a single file to an existing entity.
 * Automatically handles direct vs presigned upload based on file size.
 */

import { ArkeClient, getAuthorizationHeader } from '../../client/ArkeClient.js';
import { computeCid } from './cid.js';
import { getMimeType } from './scanners.js';

/**
 * Build auth headers for raw fetch requests.
 */
function buildAuthHeaders(client: ArkeClient): Record<string, string> {
  const config = client.getConfig();
  const headers: Record<string, string> = {};

  if (config.authToken) {
    headers['Authorization'] = getAuthorizationHeader(config.authToken);
  }

  if (config.network === 'test') {
    headers['X-Arke-Network'] = 'test';
  }

  return headers;
}

/** Threshold for using presigned URLs (5MB) */
const PRESIGNED_THRESHOLD = 5 * 1024 * 1024;

/**
 * Options for uploading to an entity.
 */
export interface UploadToEntityOptions {
  /**
   * Version key for the content (default: "v1").
   * Use different keys for multiple versions: "original", "thumbnail", etc.
   */
  key?: string;

  /**
   * MIME type of the content.
   * Auto-detected from filename if not provided.
   */
  contentType?: string;

  /**
   * Original filename (for Content-Disposition on download).
   * Uses the file's name if a File object is provided.
   */
  filename?: string;

  /**
   * Progress callback for large files (presigned uploads only).
   * Called with bytes uploaded and total bytes.
   */
  onProgress?: (uploaded: number, total: number) => void;

  /**
   * Force presigned upload even for small files.
   * Useful for testing or when you want client-side CID computation.
   */
  forcePresigned?: boolean;
}

/**
 * Result of uploading to an entity.
 */
export interface UploadToEntityResult {
  /** Entity ID */
  id: string;

  /** New entity CID after upload */
  cid: string;

  /** Previous entity CID */
  prevCid: string;

  /** Content metadata */
  content: {
    key: string;
    cid: string;
    size: number;
    contentType: string;
    filename?: string;
  };

  /** Whether presigned upload was used */
  usedPresigned: boolean;
}

/**
 * Upload a file to an existing entity.
 *
 * Automatically chooses the optimal upload method:
 * - **Direct upload** (< 5MB): Streams through API, server computes CID
 * - **Presigned upload** (>= 5MB): Direct to R2, client computes CID
 *
 * @example
 * ```typescript
 * // Browser: From drag-drop or file input
 * const file = event.dataTransfer.files[0];
 * const result = await uploadToEntity(client, entityId, file);
 *
 * // Browser: From Blob
 * const blob = new Blob([data], { type: 'application/json' });
 * const result = await uploadToEntity(client, entityId, blob, {
 *   filename: 'data.json',
 * });
 *
 * // Node.js: From Buffer
 * const buffer = await fs.readFile('document.pdf');
 * const result = await uploadToEntity(client, entityId, buffer, {
 *   filename: 'document.pdf',
 *   contentType: 'application/pdf',
 * });
 * ```
 */
export async function uploadToEntity(
  client: ArkeClient,
  entityId: string,
  data: File | Blob | ArrayBuffer | Uint8Array,
  options: UploadToEntityOptions = {}
): Promise<UploadToEntityResult> {
  const {
    key = 'v1',
    forcePresigned = false,
    onProgress,
  } = options;

  // Determine file properties
  let size: number;
  let filename: string | undefined = options.filename;
  let contentType: string | undefined = options.contentType;

  if (data instanceof File) {
    size = data.size;
    filename = filename ?? data.name;
    contentType = contentType ?? (data.type || getMimeType(data.name));
  } else if (data instanceof Blob) {
    size = data.size;
    contentType = contentType ?? (data.type || 'application/octet-stream');
  } else if (data instanceof ArrayBuffer) {
    size = data.byteLength;
    contentType = contentType ?? 'application/octet-stream';
  } else {
    // Uint8Array
    size = data.length;
    contentType = contentType ?? 'application/octet-stream';
  }

  // Auto-detect content type from filename if still not set
  if (contentType === 'application/octet-stream' && filename) {
    contentType = getMimeType(filename);
  }

  // Decide upload method
  const usePresigned = forcePresigned || size >= PRESIGNED_THRESHOLD;

  if (usePresigned) {
    return uploadPresigned(client, entityId, data, {
      key,
      size,
      filename,
      contentType,
      onProgress,
    });
  } else {
    return uploadDirect(client, entityId, data, {
      key,
      size,
      filename,
      contentType,
    });
  }
}

/**
 * Direct upload - streams through API worker.
 * Best for small files (< 5MB).
 */
async function uploadDirect(
  client: ArkeClient,
  entityId: string,
  data: File | Blob | ArrayBuffer | Uint8Array,
  params: {
    key: string;
    size: number;
    filename?: string;
    contentType: string;
  }
): Promise<UploadToEntityResult> {
  // Convert to Blob for fetch body
  let body: Blob;
  if (data instanceof Blob) {
    body = data;
  } else if (data instanceof ArrayBuffer) {
    body = new Blob([data], { type: params.contentType });
  } else {
    // Uint8Array - copy to regular ArrayBuffer to handle SharedArrayBuffer
    const buffer = new ArrayBuffer(data.byteLength);
    new Uint8Array(buffer).set(data);
    body = new Blob([buffer], { type: params.contentType });
  }

  // Use raw fetch for binary upload (openapi-fetch doesn't handle raw binary well)
  const url = new URL(`/entities/${entityId}/content`, client.baseUrl);
  url.searchParams.set('key', params.key);
  if (params.filename) {
    url.searchParams.set('filename', params.filename);
  }

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': params.contentType,
      'Content-Length': params.size.toString(),
      ...buildAuthHeaders(client),
    },
    body,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(`Upload failed: ${error.error || response.statusText}`);
  }

  const result = await response.json();

  return {
    id: result.id,
    cid: result.cid,
    prevCid: result.prev_cid,
    content: {
      key: params.key,
      cid: result.content.cid,
      size: result.content.size,
      contentType: result.content.content_type,
      filename: result.content.filename,
    },
    usedPresigned: false,
  };
}

/**
 * Presigned upload - direct to R2 storage.
 * Best for large files (>= 5MB).
 */
async function uploadPresigned(
  client: ArkeClient,
  entityId: string,
  data: File | Blob | ArrayBuffer | Uint8Array,
  params: {
    key: string;
    size: number;
    filename?: string;
    contentType: string;
    onProgress?: (uploaded: number, total: number) => void;
  }
): Promise<UploadToEntityResult> {
  // Step 1: Get current entity tip for CAS
  const { data: entity, error: getError } = await client.api.GET('/entities/{id}/tip', {
    params: { path: { id: entityId } },
  });

  if (getError || !entity) {
    throw new Error(`Failed to get entity: ${JSON.stringify(getError)}`);
  }

  const expectTip = entity.cid;

  // Step 2: Get presigned URL
  const { data: presigned, error: urlError } = await client.api.POST(
    '/entities/{id}/content/upload-url',
    {
      params: { path: { id: entityId } },
      body: {
        key: params.key,
        content_type: params.contentType,
        size: params.size,
        filename: params.filename,
      },
    }
  );

  if (urlError || !presigned) {
    throw new Error(`Failed to get upload URL: ${JSON.stringify(urlError)}`);
  }

  // Step 3: Compute CID (required for presigned flow)
  let bytes: ArrayBuffer;
  if (data instanceof Blob) {
    bytes = await data.arrayBuffer();
  } else if (data instanceof ArrayBuffer) {
    bytes = data;
  } else {
    // Uint8Array - copy to regular ArrayBuffer to handle SharedArrayBuffer
    const buffer = new ArrayBuffer(data.byteLength);
    new Uint8Array(buffer).set(data);
    bytes = buffer;
  }

  const contentCid = await computeCid(new Uint8Array(bytes));

  // Step 4: Upload to presigned URL
  if (params.onProgress && typeof XMLHttpRequest !== 'undefined') {
    // Browser with progress tracking
    await uploadWithProgress(presigned.upload_url, bytes, params.contentType, params.onProgress);
  } else {
    // Simple fetch upload (Node.js or browser without progress)
    const uploadResponse = await fetch(presigned.upload_url, {
      method: 'PUT',
      headers: {
        'Content-Type': params.contentType,
      },
      body: bytes,
    });

    if (!uploadResponse.ok) {
      throw new Error(`Upload to R2 failed: ${uploadResponse.statusText}`);
    }
  }

  // Step 5: Complete upload
  const { data: complete, error: completeError } = await client.api.POST(
    '/entities/{id}/content/complete',
    {
      params: { path: { id: entityId } },
      body: {
        key: params.key,
        cid: contentCid,
        size: params.size,
        content_type: params.contentType,
        filename: params.filename,
        expect_tip: expectTip,
      },
    }
  );

  if (completeError || !complete) {
    throw new Error(`Failed to complete upload: ${JSON.stringify(completeError)}`);
  }

  return {
    id: complete.id,
    cid: complete.cid,
    prevCid: complete.prev_cid,
    content: {
      key: params.key,
      cid: complete.content.cid,
      size: complete.content.size,
      contentType: complete.content.content_type,
      filename: complete.content.filename,
    },
    usedPresigned: true,
  };
}

/**
 * Upload with progress tracking using XMLHttpRequest.
 * Only available in browser environments.
 */
function uploadWithProgress(
  url: string,
  data: ArrayBuffer,
  contentType: string,
  onProgress: (uploaded: number, total: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', url, true);
    xhr.setRequestHeader('Content-Type', contentType);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(event.loaded, event.total);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(`Upload failed: ${xhr.statusText}`));
      }
    };

    xhr.onerror = () => reject(new Error('Upload failed: network error'));
    xhr.onabort = () => reject(new Error('Upload aborted'));

    xhr.send(data);
  });
}
