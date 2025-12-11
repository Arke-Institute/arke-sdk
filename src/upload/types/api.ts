/**
 * API request and response types matching the Arke Ingest Worker API
 * @see API.md for full specification
 */

import type { ProcessingConfig } from './processing.js';
import type { CustomPrompts } from './config.js';

// ============================================================================
// Request Types
// ============================================================================

export interface InitBatchRequest {
  uploader: string;
  root_path: string;
  parent_pi: string;
  file_count: number;
  total_size: number;
  metadata?: Record<string, any>;
  custom_prompts?: CustomPrompts;
}

export interface StartFileUploadRequest {
  file_name: string;
  file_size: number;
  logical_path: string;
  content_type: string;
  cid?: string;
  processing_config: ProcessingConfig;
}

export interface CompleteFileUploadRequest {
  r2_key: string;
  upload_id?: string;
  parts?: PartInfo[];
}

export interface PartInfo {
  part_number: number;
  etag: string;
}

// ============================================================================
// Response Types
// ============================================================================

export interface InitBatchResponse {
  batch_id: string;
  session_id: string;
}

export interface StartFileUploadResponse {
  r2_key: string;
  upload_type: 'simple' | 'multipart';
  presigned_url?: string;
  upload_id?: string;
  part_size?: number;
  presigned_urls?: PresignedUrlInfo[];
}

export interface PresignedUrlInfo {
  part_number: number;
  url: string;
}

export interface CompleteFileUploadResponse {
  success: boolean;
}

export interface FinalizeBatchResponse {
  batch_id: string;
  status: 'discovery' | 'preprocessing' | 'enqueued';
  files_uploaded: number;
  total_bytes: number;
  r2_prefix: string;
  /** Root PI - available immediately for small batches (sync discovery) */
  root_pi?: string;
  /** Discovery progress - only present when status is 'discovery' */
  discovery_progress?: {
    total: number;
    published: number;
  };
}

export type BatchStatus = 'uploading' | 'discovery' | 'preprocessing' | 'enqueued' | 'processing' | 'completed' | 'failed';

export interface BatchStatusResponse {
  batch_id: string;
  session_id: string;
  status: BatchStatus;
  uploader: string;
  root_path: string;
  parent_pi: string;
  file_count: number;
  files_uploaded: number;
  total_size: number;
  total_bytes_uploaded: number;
  created_at: string;
  enqueued_at?: string;
  /** Root PI - available after discovery completes */
  root_pi?: string;
  /** Discovery progress - only present during discovery phase */
  discovery_progress?: {
    total: number;
    published: number;
    phase?: string;
  };
}

// ============================================================================
// Error Response
// ============================================================================

export interface ErrorResponse {
  error: string;
  details?: any;
  incomplete?: string[];
}
