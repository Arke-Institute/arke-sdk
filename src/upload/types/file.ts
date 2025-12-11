/**
 * File metadata and upload tracking types
 */

import { ProcessingConfig } from './processing.js';

export interface FileInfo {
  /** Absolute path on local filesystem */
  localPath: string;

  /** Logical path within the batch (e.g., /series_1/box_7/page_001.tiff) */
  logicalPath: string;

  /** File name only */
  fileName: string;

  /** File size in bytes */
  size: number;

  /** MIME type */
  contentType: string;

  /** IPFS CID v1 (base32) - optional, may be undefined if computation failed */
  cid?: string;

  /** Processing configuration for this file */
  processingConfig: ProcessingConfig;
}

export interface UploadTask extends FileInfo {
  /** Current status of the upload */
  status: 'pending' | 'uploading' | 'completed' | 'failed';

  /** R2 key assigned by worker */
  r2Key?: string;

  /** Upload type determined by worker */
  uploadType?: 'simple' | 'multipart';

  /** Multipart upload ID (if applicable) */
  uploadId?: string;

  /** Completed parts for multipart uploads */
  completedParts?: Array<{ part_number: number; etag: string }>;

  /** Error message if failed */
  error?: string;

  /** Bytes uploaded so far */
  bytesUploaded?: number;

  /** Timestamp when upload started */
  startedAt?: Date;

  /** Timestamp when upload completed */
  completedAt?: Date;
}

export interface ScanResult {
  files: FileInfo[];
  totalSize: number;
  totalFiles: number;
  largestFile: number;
  smallestFile: number;
}
