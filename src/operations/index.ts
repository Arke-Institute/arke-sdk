/**
 * High-level operations built on top of the generated API client
 *
 * These provide convenience methods for common multi-step workflows.
 */

// Upload operations (primary folder/file upload functionality)
export {
  uploadTree,
  computeCid,
  verifyCid,
  scanFileSystemEntries,
  scanFileList,
  buildUploadTree,
  getMimeType,
  type UploadFile,
  type UploadFolder,
  type UploadTree,
  type UploadTarget,
  type UploadProgress,
  type UploadOptions,
  type UploadResult,
  type CreatedEntity,
} from './upload/index.js';

// Legacy FolderOperations class (deprecated - use uploadTree instead)
export { FolderOperations, type UploadDirectoryOptions, type UploadDirectoryResult } from './folders.js';

// Batch operations (placeholder)
export { BatchOperations, type BatchCreateOptions, type BatchResult } from './batch.js';

// Crypto operations (placeholder)
export { CryptoOperations, type KeyPair, type SignedPayload } from './crypto.js';
