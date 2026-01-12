/**
 * Folder Operations (Legacy)
 *
 * @deprecated Use the new upload module instead:
 * ```typescript
 * import { uploadTree, buildUploadTree } from '@arke-institute/sdk/operations';
 *
 * const tree = buildUploadTree([
 *   { path: 'docs/readme.md', data: readmeBuffer },
 *   { path: 'images/logo.png', data: logoBlob },
 * ]);
 * const result = await uploadTree(client, tree, {
 *   target: { collectionId: '...' },
 * });
 * ```
 */

import type { ArkeClient } from '../client/ArkeClient.js';

/**
 * @deprecated Use UploadProgress from upload module
 */
export interface UploadProgress {
  phase: 'scanning' | 'creating-folders' | 'uploading-files' | 'linking' | 'complete';
  totalFiles: number;
  completedFiles: number;
  totalFolders: number;
  completedFolders: number;
  currentFile?: string;
}

/**
 * @deprecated Use UploadOptions from upload module
 */
export interface UploadDirectoryOptions {
  /** Collection to upload into */
  collectionId: string;
  /** Parent folder ID (optional - creates at root if not provided) */
  parentFolderId?: string;
  /** Progress callback */
  onProgress?: (progress: UploadProgress) => void;
  /** Max concurrent uploads */
  concurrency?: number;
}

/**
 * @deprecated Use UploadResult from upload module
 */
export interface UploadDirectoryResult {
  /** Root folder entity */
  rootFolder: unknown;
  /** All created folder entities */
  folders: unknown[];
  /** All created file entities */
  files: unknown[];
}

/**
 * Folder operations helper
 *
 * @deprecated Use uploadTree and buildUploadTree functions instead:
 * ```typescript
 * import { uploadTree, buildUploadTree } from '@arke-institute/sdk/operations';
 *
 * const tree = buildUploadTree([
 *   { path: 'docs/readme.md', data: readmeBuffer },
 * ]);
 * const result = await uploadTree(client, tree, {
 *   target: { collectionId: '...' },
 * });
 * ```
 */
export class FolderOperations {
  constructor(private client: ArkeClient) {
    void client; // Suppress unused warning
  }

  /**
   * Upload a local directory to Arke
   *
   * @deprecated This method has been removed. Use uploadTree and buildUploadTree instead.
   */
  async uploadDirectory(
    _localPath: string,
    _options: UploadDirectoryOptions
  ): Promise<UploadDirectoryResult> {
    throw new Error(
      'FolderOperations.uploadDirectory has been removed. ' +
        'Use uploadTree() with buildUploadTree() instead. ' +
        'See: https://github.com/arke-institute/arke-sdk#upload-module'
    );
  }
}
