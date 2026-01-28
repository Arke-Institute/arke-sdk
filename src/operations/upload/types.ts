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
    | 'creating' // Creating folder + file entities
    | 'backlinking' // Updating parents with contains relationships (tree now browsable!)
    | 'uploading' // Uploading file content to storage
    | 'complete'
    | 'error';

  /** Current phase index (0=creating, 1=backlinking, 2=uploading) */
  phaseIndex: number;

  /** Total number of phases (3, excluding complete/error) */
  phaseCount: number;

  /** Progress within current phase (0-100) */
  phasePercent: number;

  /** Total number of entities (files + folders) */
  totalEntities: number;

  /** Number of entities completed */
  completedEntities: number;

  /** Total number of parents to backlink */
  totalParents: number;

  /** Number of parents backlinked */
  completedParents: number;

  /** Current item being processed */
  currentItem?: string;

  /** Error message if phase is 'error' */
  error?: string;

  /** Bytes uploaded so far */
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

  /** Maximum bytes in flight during file content upload (default: 200 MB) */
  maxBytesInFlight?: number;

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
export interface CreatedFile extends UploadFile {
  /** Created entity ID */
  id: string;

  /** Created entity CID */
  entityCid: string;
}
