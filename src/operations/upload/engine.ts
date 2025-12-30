/**
 * Upload Engine
 *
 * Core upload implementation that handles the multi-phase upload process:
 * 1. Create collection (if needed)
 * 2. Compute CIDs for all files
 * 3. Create all entities (folders + files) in parallel
 * 4. Upload file content to presigned URLs
 * 5. Bulk link children to their parents
 */

import type { ArkeClient } from '../../client/ArkeClient.js';
import type { components } from '../../generated/types.js';
import { computeCid } from './cid.js';
import type {
  UploadTree,
  UploadOptions,
  UploadResult,
  UploadProgress,
  UploadFile,
  UploadFolder,
  PreparedFile,
  CreatedFolder,
  CreatedFile,
  CreatedEntity,
} from './types.js';

type CreateCollectionRequest = components['schemas']['CreateCollectionRequest'];
type CreateFolderRequest = components['schemas']['CreateFolderRequest'];
type CreateFileRequest = components['schemas']['CreateFileRequest'];
type BulkAddChildrenRequest = components['schemas']['BulkAddChildrenRequest'];

/**
 * Simple concurrency limiter for parallel operations.
 */
async function parallelLimit<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const results: R[] = [];
  let index = 0;

  async function worker(): Promise<void> {
    while (index < items.length) {
      const currentIndex = index++;
      const item = items[currentIndex]!;
      results[currentIndex] = await fn(item, currentIndex);
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, items.length) }, () => worker());
  await Promise.all(workers);

  return results;
}

/**
 * Parse folder path to get parent path.
 * e.g., "docs/images/photos" -> "docs/images"
 */
function getParentPath(relativePath: string): string | null {
  const lastSlash = relativePath.lastIndexOf('/');
  if (lastSlash === -1) return null;
  return relativePath.slice(0, lastSlash);
}

/**
 * Get the immediate children paths for a given parent path.
 */
function getImmediateChildren(
  parentPath: string | null,
  folders: UploadFolder[],
  files: PreparedFile[]
): { folders: UploadFolder[]; files: PreparedFile[] } {
  const childFolders = folders.filter((f) => getParentPath(f.relativePath) === parentPath);
  const childFiles = files.filter((f) => getParentPath(f.relativePath) === parentPath);
  return { folders: childFolders, files: childFiles };
}

/**
 * Main upload function.
 * Orchestrates the entire upload process.
 */
export async function uploadTree(
  client: ArkeClient,
  tree: UploadTree,
  options: UploadOptions
): Promise<UploadResult> {
  const { target, onProgress, concurrency = 5, continueOnError = false, note } = options;

  const errors: Array<{ path: string; error: string }> = [];
  const createdFolders: CreatedFolder[] = [];
  const createdFiles: CreatedFile[] = [];

  // Helper to report progress
  const reportProgress = (progress: Partial<UploadProgress>) => {
    if (onProgress) {
      onProgress({
        phase: 'scanning',
        totalFiles: tree.files.length,
        completedFiles: 0,
        totalFolders: tree.folders.length,
        completedFolders: 0,
        ...progress,
      } as UploadProgress);
    }
  };

  try {
    // ─────────────────────────────────────────────────────────────────────────
    // PHASE 1: Resolve or create collection
    // ─────────────────────────────────────────────────────────────────────────
    let collectionId: string;
    let collectionCid: string;
    let collectionCreated = false;

    if (target.createCollection) {
      reportProgress({ phase: 'scanning', currentFolder: 'Creating collection...' });

      const collectionBody: CreateCollectionRequest = {
        label: target.createCollection.label,
        description: target.createCollection.description,
        roles: target.createCollection.roles,
        note,
      };

      const { data, error } = await client.api.POST('/collections', {
        body: collectionBody,
      });

      if (error || !data) {
        throw new Error(`Failed to create collection: ${JSON.stringify(error)}`);
      }

      collectionId = data.id;
      collectionCid = data.cid;
      collectionCreated = true;
    } else if (target.collectionId) {
      collectionId = target.collectionId;

      // Fetch collection to get current CID
      const { data, error } = await client.api.GET('/collections/{id}', {
        params: { path: { id: collectionId } },
      });

      if (error || !data) {
        throw new Error(`Failed to fetch collection: ${JSON.stringify(error)}`);
      }

      collectionCid = data.cid;
    } else {
      throw new Error('Must provide either collectionId or createCollection in target');
    }

    // Determine the parent for root-level items
    const rootParentId = target.parentId ?? collectionId;

    // ─────────────────────────────────────────────────────────────────────────
    // PHASE 2: Compute CIDs for all files
    // ─────────────────────────────────────────────────────────────────────────
    reportProgress({
      phase: 'computing-cids',
      totalFiles: tree.files.length,
      completedFiles: 0,
    });

    const preparedFiles: PreparedFile[] = [];
    let cidProgress = 0;

    await parallelLimit(tree.files, concurrency, async (file) => {
      try {
        const data = await file.getData();
        const cid = await computeCid(data);

        preparedFiles.push({
          ...file,
          cid,
        });

        cidProgress++;
        reportProgress({
          phase: 'computing-cids',
          completedFiles: cidProgress,
          currentFile: file.relativePath,
        });
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        if (continueOnError) {
          errors.push({ path: file.relativePath, error: `CID computation failed: ${errorMsg}` });
        } else {
          throw new Error(`Failed to compute CID for ${file.relativePath}: ${errorMsg}`);
        }
      }
    });

    // ─────────────────────────────────────────────────────────────────────────
    // PHASE 3: Create all folder entities
    // ─────────────────────────────────────────────────────────────────────────
    reportProgress({
      phase: 'creating-folders',
      totalFolders: tree.folders.length,
      completedFolders: 0,
    });

    // Sort folders by depth (parents first)
    const sortedFolders = [...tree.folders].sort(
      (a, b) => a.relativePath.split('/').length - b.relativePath.split('/').length
    );

    // Create folders sequentially to ensure parents exist first
    // (We don't set parent relationships here - we'll do that in the linking phase)
    for (let i = 0; i < sortedFolders.length; i++) {
      const folder = sortedFolders[i]!;

      try {
        const folderBody: CreateFolderRequest = {
          label: folder.name,
          collection: collectionId,
          note,
        };

        const { data, error } = await client.api.POST('/folders', {
          body: folderBody,
        });

        if (error || !data) {
          throw new Error(JSON.stringify(error));
        }

        createdFolders.push({
          name: folder.name,
          relativePath: folder.relativePath,
          id: data.id,
          entityCid: data.cid,
        });

        reportProgress({
          phase: 'creating-folders',
          completedFolders: i + 1,
          currentFolder: folder.relativePath,
        });
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        if (continueOnError) {
          errors.push({ path: folder.relativePath, error: `Folder creation failed: ${errorMsg}` });
        } else {
          throw new Error(`Failed to create folder ${folder.relativePath}: ${errorMsg}`);
        }
      }
    }

    // Build folder path -> entity map for linking phase
    const folderPathToEntity = new Map<string, CreatedFolder>();
    for (const folder of createdFolders) {
      folderPathToEntity.set(folder.relativePath, folder);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PHASE 4: Create all file entities (parallel)
    // ─────────────────────────────────────────────────────────────────────────
    reportProgress({
      phase: 'creating-files',
      totalFiles: preparedFiles.length,
      completedFiles: 0,
    });

    let fileCreateProgress = 0;

    await parallelLimit(preparedFiles, concurrency, async (file) => {
      try {
        const fileBody: CreateFileRequest = {
          key: file.cid, // Use CID as storage key (best practice)
          filename: file.name,
          content_type: file.mimeType,
          size: file.size,
          cid: file.cid,
          collection: collectionId,
        };

        const { data, error } = await client.api.POST('/files', {
          body: fileBody,
        });

        if (error || !data) {
          throw new Error(JSON.stringify(error));
        }

        createdFiles.push({
          ...file,
          id: data.id,
          entityCid: data.cid,
          uploadUrl: data.upload_url,
          uploadExpiresAt: data.upload_expires_at,
        });

        fileCreateProgress++;
        reportProgress({
          phase: 'creating-files',
          completedFiles: fileCreateProgress,
          currentFile: file.relativePath,
        });
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        if (continueOnError) {
          errors.push({ path: file.relativePath, error: `File creation failed: ${errorMsg}` });
        } else {
          throw new Error(`Failed to create file ${file.relativePath}: ${errorMsg}`);
        }
      }
    });

    // ─────────────────────────────────────────────────────────────────────────
    // PHASE 5: Upload file content to presigned URLs
    // ─────────────────────────────────────────────────────────────────────────
    const totalBytes = createdFiles.reduce((sum, f) => sum + f.size, 0);
    let bytesUploaded = 0;

    reportProgress({
      phase: 'uploading-content',
      totalFiles: createdFiles.length,
      completedFiles: 0,
      totalBytes,
      bytesUploaded: 0,
    });

    let uploadProgress = 0;

    await parallelLimit(createdFiles, concurrency, async (file) => {
      try {
        // Get the file data again for upload
        const data = await file.getData();

        // Convert to appropriate format for fetch
        let body: Blob;
        if (data instanceof Blob) {
          body = data;
        } else if (data instanceof Uint8Array) {
          // Convert Uint8Array to Blob - copy to new ArrayBuffer to handle SharedArrayBuffer case
          const arrayBuffer = new ArrayBuffer(data.byteLength);
          new Uint8Array(arrayBuffer).set(data);
          body = new Blob([arrayBuffer], { type: file.mimeType });
        } else {
          // ArrayBuffer
          body = new Blob([data], { type: file.mimeType });
        }

        // Upload to presigned URL
        const response = await fetch(file.uploadUrl, {
          method: 'PUT',
          body,
          headers: {
            'Content-Type': file.mimeType,
          },
        });

        if (!response.ok) {
          throw new Error(`Upload failed with status ${response.status}`);
        }

        bytesUploaded += file.size;
        uploadProgress++;

        reportProgress({
          phase: 'uploading-content',
          completedFiles: uploadProgress,
          currentFile: file.relativePath,
          bytesUploaded,
          totalBytes,
        });
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        if (continueOnError) {
          errors.push({ path: file.relativePath, error: `Upload failed: ${errorMsg}` });
        } else {
          throw new Error(`Failed to upload ${file.relativePath}: ${errorMsg}`);
        }
      }
    });

    // ─────────────────────────────────────────────────────────────────────────
    // PHASE 6: Link children to parents using bulk operations
    // ─────────────────────────────────────────────────────────────────────────
    reportProgress({ phase: 'linking' });

    // Build file path -> entity map
    const filePathToEntity = new Map<string, CreatedFile>();
    for (const file of createdFiles) {
      filePathToEntity.set(file.relativePath, file);
    }

    // Group items by their parent path
    // For root items (no parent path), parent is rootParentId (collection or specified folder)
    const parentGroups = new Map<string, { folderId: string; children: { id: string }[] }>();

    // Add folders to their parent groups
    for (const folder of createdFolders) {
      const parentPath = getParentPath(folder.relativePath);
      let parentId: string;

      if (parentPath === null) {
        // Root level folder - parent is the target
        parentId = rootParentId;
      } else {
        // Nested folder - find parent folder entity
        const parentFolder = folderPathToEntity.get(parentPath);
        if (!parentFolder) {
          errors.push({
            path: folder.relativePath,
            error: `Parent folder not found: ${parentPath}`,
          });
          continue;
        }
        parentId = parentFolder.id;
      }

      if (!parentGroups.has(parentId)) {
        parentGroups.set(parentId, { folderId: parentId, children: [] });
      }
      parentGroups.get(parentId)!.children.push({ id: folder.id });
    }

    // Add files to their parent groups
    for (const file of createdFiles) {
      const parentPath = getParentPath(file.relativePath);
      let parentId: string;

      if (parentPath === null) {
        // Root level file - parent is the target
        parentId = rootParentId;
      } else {
        // Nested file - find parent folder entity
        const parentFolder = folderPathToEntity.get(parentPath);
        if (!parentFolder) {
          errors.push({
            path: file.relativePath,
            error: `Parent folder not found: ${parentPath}`,
          });
          continue;
        }
        parentId = parentFolder.id;
      }

      if (!parentGroups.has(parentId)) {
        parentGroups.set(parentId, { folderId: parentId, children: [] });
      }
      parentGroups.get(parentId)!.children.push({ id: file.id });
    }

    // Execute bulk add children for each parent
    // We need to get current CID for each parent before linking
    // Batch large groups to avoid API limits (max 50 children per request)
    const BATCH_SIZE = 50;

    for (const [parentId, group] of parentGroups) {
      if (group.children.length === 0) continue;

      // Split children into batches
      const batches: Array<{ id: string }[]> = [];
      for (let i = 0; i < group.children.length; i += BATCH_SIZE) {
        batches.push(group.children.slice(i, i + BATCH_SIZE));
      }

      try {
        // Process each batch sequentially (need updated CID after each)
        for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
          const batch = batches[batchIndex]!;

          // Get current parent CID (refetch each time as it changes after each batch)
          let expectTip: string;

          if (parentId === collectionId) {
            const { data, error } = await client.api.GET('/collections/{id}', {
              params: { path: { id: collectionId } },
            });
            if (error || !data) {
              throw new Error(`Failed to fetch collection CID: ${JSON.stringify(error)}`);
            }
            expectTip = data.cid;
          } else {
            const { data, error } = await client.api.GET('/folders/{id}', {
              params: { path: { id: parentId } },
            });
            if (error || !data) {
              throw new Error(`Failed to fetch folder CID: ${JSON.stringify(error)}`);
            }
            expectTip = data.cid;
          }

          // Bulk add this batch of children
          const bulkBody: BulkAddChildrenRequest = {
            expect_tip: expectTip,
            children: batch,
            note: batches.length > 1 ? `${note || 'Upload'} (batch ${batchIndex + 1}/${batches.length})` : note,
          };

          const { error } = await client.api.POST('/folders/{id}/children/bulk', {
            params: { path: { id: parentId } },
            body: bulkBody,
          });

          if (error) {
            throw new Error(JSON.stringify(error));
          }
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        if (continueOnError) {
          errors.push({
            path: `parent:${parentId}`,
            error: `Bulk linking failed: ${errorMsg}`,
          });
        } else {
          throw new Error(`Failed to link children to ${parentId}: ${errorMsg}`);
        }
      }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Complete!
    // ─────────────────────────────────────────────────────────────────────────
    reportProgress({ phase: 'complete' });

    // Build result
    const resultFolders: CreatedEntity[] = createdFolders.map((f) => ({
      id: f.id,
      cid: f.entityCid,
      type: 'folder' as const,
      relativePath: f.relativePath,
    }));

    const resultFiles: CreatedEntity[] = createdFiles.map((f) => ({
      id: f.id,
      cid: f.entityCid,
      type: 'file' as const,
      relativePath: f.relativePath,
    }));

    return {
      success: errors.length === 0,
      collection: {
        id: collectionId,
        cid: collectionCid,
        created: collectionCreated,
      },
      folders: resultFolders,
      files: resultFiles,
      errors,
    };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);

    reportProgress({
      phase: 'error',
      error: errorMsg,
    });

    return {
      success: false,
      collection: {
        id: target.collectionId ?? '',
        cid: '',
        created: false,
      },
      folders: createdFolders.map((f) => ({
        id: f.id,
        cid: f.entityCid,
        type: 'folder' as const,
        relativePath: f.relativePath,
      })),
      files: createdFiles.map((f) => ({
        id: f.id,
        cid: f.entityCid,
        type: 'file' as const,
        relativePath: f.relativePath,
      })),
      errors: [...errors, { path: '', error: errorMsg }],
    };
  }
}
