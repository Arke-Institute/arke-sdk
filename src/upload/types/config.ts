/**
 * SDK Configuration Types
 */

import type { ProcessingConfig } from './processing.js';

/**
 * Custom prompts for AI services in the ingest pipeline
 * All fields are optional. Prompts are appended to base system prompts.
 */
export interface CustomPrompts {
  /**
   * Applied to all AI service calls across all phases
   * @example "All content is from 18th century manuscripts. Use period-appropriate terminology."
   */
  general?: string;

  /**
   * Phase-specific: file reorganization
   * @example "Group documents by subject matter (astronomy, biology, chemistry, physics)."
   */
  reorganization?: string;

  /**
   * Phase-specific: PINAX metadata extraction
   * @example "Focus on extracting dates, locations, and institutional affiliations. Use Library of Congress Subject Headings."
   */
  pinax?: string;

  /**
   * Phase-specific: description generation
   * @example "Write descriptions in scholarly, academic tone with focus on historical context."
   */
  description?: string;

  /**
   * Phase-specific: knowledge graph extraction
   * @example "Focus on extracting people, institutions, and their relationships."
   */
  cheimarros?: string;
}

/**
 * Configuration for the ArkeUploader SDK
 */
export interface UploaderConfig {
  /**
   * Gateway base URL (e.g., https://api.arke.institute)
   * All requests route through /ingest/* endpoints
   * @example 'https://api.arke.institute'
   */
  gatewayUrl: string;

  /**
   * Bearer token for authentication (required for all upload operations)
   */
  authToken: string;

  /**
   * Name of person/service uploading files
   */
  uploader: string;

  /**
   * Root path in the archive hierarchy
   * @default '/'
   */
  rootPath?: string;

  /**
   * Parent persistent identifier (for hierarchical archives)
   */
  parentPi?: string;

  /**
   * Custom metadata to attach to batch
   */
  metadata?: Record<string, unknown>;

  /**
   * Custom prompts for AI services in the ingest pipeline
   */
  customPrompts?: CustomPrompts;

  /**
   * Processing options (OCR, IIIF, etc.)
   */
  processing?: ProcessingConfig;

  /**
   * Number of files to upload in parallel
   * @default 5
   */
  parallelUploads?: number;

  /**
   * Number of parts to upload in parallel for multipart uploads
   * @default 3
   */
  parallelParts?: number;

  /**
   * Maximum number of retry attempts for failed requests
   * @default 3
   */
  maxRetries?: number;

  /**
   * Initial delay between retries in milliseconds
   * @default 1000
   */
  retryInitialDelay?: number;

  /**
   * Maximum delay between retries in milliseconds
   * @default 30000
   */
  retryMaxDelay?: number;

  /**
   * Add random jitter to retry delays to prevent thundering herd
   * @default true
   */
  retryJitter?: boolean;

  /**
   * Timeout for API requests in milliseconds
   * @default 30000
   */
  timeout?: number;
}

/**
 * Options for batch upload operation
 */
export interface UploadOptions {
  /**
   * Progress callback for upload tracking
   */
  onProgress?: (progress: UploadProgress) => void;

  /**
   * Dry run mode - validate without uploading
   * @default false
   */
  dryRun?: boolean;
}

/**
 * Progress information during upload
 */
export interface UploadProgress {
  /**
   * Current phase of upload
   */
  phase: 'scanning' | 'uploading' | 'finalizing' | 'discovery' | 'complete';

  /**
   * Total number of files to upload
   */
  filesTotal: number;

  /**
   * Number of files uploaded so far
   */
  filesUploaded: number;

  /**
   * Total bytes to upload
   */
  bytesTotal: number;

  /**
   * Bytes uploaded so far
   */
  bytesUploaded: number;

  /**
   * Current file being processed
   */
  currentFile?: string;

  /**
   * Percentage complete (0-100)
   */
  percentComplete: number;
}

/**
 * Result of batch upload
 */
export interface BatchResult {
  /**
   * Batch ID assigned by worker
   */
  batchId: string;

  /**
   * Root PI of the uploaded content (entity identifier)
   * This is the canonical identifier for the uploaded collection.
   */
  rootPi: string;

  /**
   * Number of files uploaded
   */
  filesUploaded: number;

  /**
   * Total bytes uploaded
   */
  bytesUploaded: number;

  /**
   * Upload duration in milliseconds
   */
  durationMs: number;
}
