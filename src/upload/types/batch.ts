/**
 * Batch upload state and configuration types
 */

import { UploadTask } from './file.js';
import { ProcessingConfig } from './processing.js';

export interface BatchContext {
  /** Batch ID from worker */
  batchId: string;

  /** Session ID from worker */
  sessionId: string;

  /** Worker API base URL */
  workerUrl: string;

  /** Name of the person uploading */
  uploader: string;

  /** Logical root path */
  rootPath: string;

  /** Parent PI to attach collection to */
  parentPi: string;

  /** Optional metadata */
  metadata?: Record<string, any>;

  /** All files to upload */
  tasks: UploadTask[];

  /** Total size of all files */
  totalSize: number;

  /** Timestamp when batch was created */
  createdAt: Date;

  /** Timestamp when batch was finalized */
  finalizedAt?: Date;
}

export interface UploadConfig {
  /** Worker API base URL */
  workerUrl: string;

  /** Name of the person uploading */
  uploader: string;

  /** Logical root path for files */
  rootPath: string;

  /** Parent PI to attach collection to (defaults to origin block) */
  parentPi: string;

  /** Directory to scan and upload */
  directory: string;

  /** Optional batch metadata */
  metadata?: Record<string, any>;

  /** Number of concurrent file uploads */
  parallelUploads: number;

  /** Number of concurrent parts per multipart upload */
  parallelParts: number;

  /** Default processing configuration */
  processing?: ProcessingConfig;

  /** Enable debug logging */
  debug: boolean;

  /** Dry run mode (scan only, no upload) */
  dryRun: boolean;

  /** Resume from checkpoint */
  resume: boolean;

  /** Log file path */
  logFile?: string;
}

export interface UploadProgress {
  /** Number of files completed */
  filesCompleted: number;

  /** Number of files failed */
  filesFailed: number;

  /** Total bytes uploaded */
  bytesUploaded: number;

  /** Total bytes to upload */
  totalBytes: number;

  /** Current upload speed in bytes/sec */
  speed: number;

  /** Estimated time remaining in seconds */
  eta: number;

  /** Currently uploading file */
  currentFile?: string;
}

export interface CheckpointData {
  batchId: string;
  sessionId: string;
  workerUrl: string;
  directory: string;
  rootPath: string;
  completedFiles: Array<{
    logicalPath: string;
    r2Key: string;
    size: number;
  }>;
  inProgressFile?: {
    logicalPath: string;
    r2Key: string;
    uploadId?: string;
    completedParts?: Array<{ part_number: number; etag: string }>;
  };
  createdAt: string;
  lastUpdated: string;
}
