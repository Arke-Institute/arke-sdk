/**
 * Folder Operations (Legacy)
 *
 * @deprecated Use the new upload module instead:
 * ```typescript
 * import { uploadTree, scanDirectory } from '@arke-institute/sdk/operations';
 *
 * const tree = await scanDirectory('/path/to/folder');
 * const result = await uploadTree(client, tree, {
 *   target: { collectionId: '...' },
 * });
 * ```
 */

import type { ArkeClient } from '../client/ArkeClient.js';
import { uploadTree, scanDirectory, type UploadResult } from './upload/index.js';

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
 * @deprecated Use uploadTree and scanDirectory functions instead:
 * ```typescript
 * import { uploadTree, scanDirectory } from '@arke-institute/sdk/operations';
 *
 * const tree = await scanDirectory('/path/to/folder');
 * const result = await uploadTree(client, tree, {
 *   target: { collectionId: '...' },
 *   onProgress: (p) => console.log(`${p.completedFiles}/${p.totalFiles} files`),
 * });
 * ```
 */
export class FolderOperations {
  constructor(private client: ArkeClient) {}

  /**
   * Upload a local directory to Arke
   *
   * @deprecated Use uploadTree and scanDirectory instead
   */
  async uploadDirectory(
    localPath: string,
    options: UploadDirectoryOptions
  ): Promise<UploadDirectoryResult> {
    // Use the new implementation
    const tree = await scanDirectory(localPath);

    const result: UploadResult = await uploadTree(this.client, tree, {
      target: {
        collectionId: options.collectionId,
        parentId: options.parentFolderId,
      },
      concurrency: options.concurrency,
      onProgress: options.onProgress
        ? (p) => {
            // Map new progress to old format
            options.onProgress!({
              phase:
                p.phase === 'computing-cids'
                  ? 'creating-folders'
                  : p.phase === 'creating'
                    ? 'uploading-files'
                    : p.phase === 'backlinking'
                      ? 'linking'
                      : p.phase === 'complete'
                        ? 'complete'
                        : 'scanning',
              totalFiles: p.totalEntities,
              completedFiles: p.completedEntities,
              totalFolders: p.totalParents,
              completedFolders: p.completedParents,
              currentFile: p.currentItem,
            });
          }
        : undefined,
    });

    return {
      rootFolder: result.folders[0] || null,
      folders: result.folders,
      files: result.files,
    };
  }
}
