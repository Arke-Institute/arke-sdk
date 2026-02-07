/**
 * Upload Module
 *
 * High-level operations for uploading files to Arke.
 *
 * ## Upload to Existing Entity
 *
 * Use `uploadToEntity` for uploading one or more files to an existing entity.
 * Files are uploaded in parallel, metadata committed sequentially with CAS.
 *
 * @example
 * ```typescript
 * import { ArkeClient } from '@arke-institute/sdk';
 * import { uploadToEntity } from '@arke-institute/sdk/operations';
 *
 * // Single file
 * const result = await uploadToEntity(client, entityId, [
 *   { key: 'v1', data: file }
 * ]);
 *
 * // Multiple files (e.g., original + thumbnail)
 * const result = await uploadToEntity(client, entityId, [
 *   { key: 'original', data: originalFile },
 *   { key: 'thumbnail', data: thumbnailBlob },
 * ]);
 * ```
 *
 * ## Folder/Tree Upload
 *
 * Use `uploadTree` for uploading folder structures with multiple entities.
 *
 * @example
 * ```typescript
 * import { ArkeClient } from '@arke-institute/sdk';
 * import { uploadTree, buildUploadTree } from '@arke-institute/sdk/operations';
 *
 * const tree = buildUploadTree([
 *   { path: 'docs/readme.md', data: readmeBuffer },
 *   { path: 'images/logo.png', data: logoBlob },
 * ]);
 *
 * const result = await uploadTree(client, tree, {
 *   target: { createCollection: { label: 'My Upload' } },
 * });
 * ```
 */

// Types
export type {
  UploadFile,
  UploadFolder,
  UploadTree,
  UploadTarget,
  UploadProgress,
  UploadOptions,
  UploadResult,
  CreatedEntity,
} from './types.js';

// Core engine
export { uploadTree } from './engine.js';

// Upload to existing entity
export {
  uploadToEntity,
  type UploadItem,
  type UploadToEntityProgress,
  type UploadToEntityOptions,
  type UploadContentResult,
  type UploadToEntityResult,
} from './single.js';

// CID utilities
export { computeCid, verifyCid } from './cid.js';

// Scanners and utilities
export {
  scanFileSystemEntries,
  scanFileList,
  buildUploadTree,
  getMimeType,
} from './scanners.js';
