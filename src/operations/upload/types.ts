/**
 * Upload Types
 *
 * Type definitions for the folder/file upload system.
 */

/**
 * Represents a file to be uploaded.
 * Platform-agnostic - works with browser File API or Node.js buffers.
 */
export interface UploadFile {
  /** Filename (e.g., "document.pdf") */
  name: string;

  /** Relative path from upload root (e.g., "docs/reports/document.pdf") */
  relativePath: string;

  /** File size in bytes */
  size: number;

  /** MIME type (e.g., "application/pdf") */
  mimeType: string;

  /**
   * Function to retrieve the file data.
   * Called during upload phase.
   */
  getData: () => Promise<ArrayBuffer | Blob | Uint8Array>;
}

/**
 * Represents a folder in the upload tree.
 */
export interface UploadFolder {
  /** Folder name (e.g., "reports") */
  name: string;

  /** Relative path from upload root (e.g., "docs/reports") */
  relativePath: string;
}

/**
 * Complete tree structure to upload.
 * Built by platform-specific scanners.
 */
export interface UploadTree {
  /** All files to upload */
  files: UploadFile[];

  /** All folders to create (sorted by depth for correct ordering) */
  folders: UploadFolder[];
}

/**
 * Target specification for upload.
 * Determines where items will be placed.
 */
export interface UploadTarget {
  /**
   * Collection ID - required for permissions.
   * If not provided and createCollection is not set, upload will fail.
   */
  collectionId?: string;

  /**
   * Parent folder/collection ID where items will be added.
   * If not provided, items go to collection root.
   * Can be the same as collectionId (collection acts as folder).
   */
  parentId?: string;

  /**
   * Create a new collection for this upload.
   * If set, collectionId is ignored.
   */
  createCollection?: {
    /** Collection display name (required) */
    label: string;

    /** Collection description */
    description?: string;

    /** Custom roles (uses defaults if not provided) */
    roles?: Record<string, string[]>;
  };
}

/**
 * Upload progress tracking.
 */
export interface UploadProgress {
  /** Current phase of the upload */
  phase:
    | 'scanning'
    | 'computing-cids'
    | 'creating-folders'
    | 'creating-files'
    | 'uploading-content'
    | 'linking'
    | 'complete'
    | 'error';

  /** Total number of files to upload */
  totalFiles: number;

  /** Number of files completed */
  completedFiles: number;

  /** Total number of folders to create */
  totalFolders: number;

  /** Number of folders completed */
  completedFolders: number;

  /** Current file being processed */
  currentFile?: string;

  /** Current folder being processed */
  currentFolder?: string;

  /** Error message if phase is 'error' */
  error?: string;

  /** Bytes uploaded so far (for content upload phase) */
  bytesUploaded?: number;

  /** Total bytes to upload */
  totalBytes?: number;
}

/**
 * Configuration options for upload.
 */
export interface UploadOptions {
  /** Where to upload */
  target: UploadTarget;

  /** Progress callback */
  onProgress?: (progress: UploadProgress) => void;

  /** Maximum concurrent operations (default: 5) */
  concurrency?: number;

  /** Continue uploading even if some files fail (default: false) */
  continueOnError?: boolean;

  /** Custom note to add to created entities */
  note?: string;
}

/**
 * Information about a created entity.
 */
export interface CreatedEntity {
  /** Entity ID (ULID) */
  id: string;

  /** Entity CID */
  cid: string;

  /** Entity type */
  type: 'file' | 'folder' | 'collection';

  /** Original path in upload tree */
  relativePath: string;
}

/**
 * Result of an upload operation.
 */
export interface UploadResult {
  /** Whether upload completed successfully */
  success: boolean;

  /** Collection used or created */
  collection: {
    id: string;
    cid: string;
    created: boolean;
  };

  /** Created folder entities */
  folders: CreatedEntity[];

  /** Created file entities */
  files: CreatedEntity[];

  /** Errors encountered (if continueOnError was true) */
  errors: Array<{
    path: string;
    error: string;
  }>;
}

/**
 * Internal type for tracking file with computed CID.
 */
export interface PreparedFile extends UploadFile {
  /** Computed CID for content-addressable storage */
  cid: string;
}

/**
 * Internal type for folder with created entity info.
 */
export interface CreatedFolder extends UploadFolder {
  /** Created entity ID */
  id: string;

  /** Created entity CID */
  entityCid: string;
}

/**
 * Internal type for file with created entity info.
 */
export interface CreatedFile extends PreparedFile {
  /** Created entity ID */
  id: string;

  /** Created entity CID */
  entityCid: string;

  /** Presigned upload URL */
  uploadUrl: string;

  /** Upload URL expiration */
  uploadExpiresAt: string;
}
