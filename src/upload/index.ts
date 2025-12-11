/**
 * Arke Upload SDK
 * Upload client with collections integration for Arke Institute's ingest service
 */

// Main client class (recommended)
export {
  UploadClient,
  type UploadClientConfig,
  type CreateCollectionUploadOptions,
  type AddToCollectionOptions,
  type CreateCollectionUploadResult,
} from './client';

// Low-level uploader (for advanced use)
export { ArkeUploader } from './uploader';

// Type exports
export type {
  // Config types
  UploaderConfig,
  UploadOptions,
  UploadProgress,
  BatchResult,
  CustomPrompts,

  // Worker API types
  InitBatchRequest,
  InitBatchResponse,
  StartFileUploadRequest,
  StartFileUploadResponse,
  PresignedUrlInfo,
  PartInfo,
  CompleteFileUploadRequest,
  CompleteFileUploadResponse,
  FinalizeBatchResponse,

  // Batch types
  BatchContext,
  UploadConfig,
  CheckpointData,

  // File types
  FileInfo,
  ScanResult,
  UploadTask,

  // Processing types
  ProcessingConfig,
} from './types/index';

// Error classes
export {
  ValidationError,
  ScanError,
  WorkerAPIError,
  NetworkError,
  UploadError,
} from './utils/errors';
