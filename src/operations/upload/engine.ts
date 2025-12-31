/**
 * Upload Engine
 *
 * Core upload implementation using optimized relationship strategy:
 * 1. Compute CIDs for all files
 * 2. Create folders by depth (with unidirectional 'in' → parent)
 * 3. Create files with pipelined S3 upload (with unidirectional 'in' → parent)
 * 4. Update each parent once with all 'contains' → children relationships
 *
 * This minimizes API calls by:
 * - Using unidirectional 'in' relationship on entity creation
 * - Batching all 'contains' relationships into a single PUT per parent
 */

import type { ArkeClient } from '../../client/ArkeClient.js';
import type { components } from '../../generated/types.js';
import { computeCid } from './cid.js';
import type {
  UploadTree,
  UploadOptions,
  UploadResult,
  UploadProgress,
  PreparedFile,
  CreatedFolder,
  CreatedFile,
  CreatedEntity,
  UploadFolder,
} from './types.js';

type CreateCollectionRequest = components['schemas']['CreateCollectionRequest'];
type CreateFolderRequest = components['schemas']['CreateFolderRequest'];
type CreateFileRequest = components['schemas']['CreateFileRequest'];
type BulkAddChildrenRequest = components['schemas']['BulkAddChildrenRequest'];

// Phase constants
const PHASE_COUNT = 3; // computing-cids, creating, backlinking (excluding complete/error)
const PHASE_INDEX: Record<string, number> = {
  'computing-cids': 0,
  'creating': 1,
  'backlinking': 2,
  'complete': 3,
  'error': -1,
};

// =============================================================================
// Concurrency Utilities
// =============================================================================

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
 * Dynamic concurrency pool that adjusts based on item size.
 */
class DynamicConcurrencyPool {
  private activeCount = 0;
  private waitQueue: Array<() => void> = [];

  constructor(
    private maxConcurrency: number,
    private maxConcurrencyLargeFiles: number,
    private largeFileThreshold: number
  ) {}

  async run<T>(size: number, fn: () => Promise<T>): Promise<T> {
    const effectiveLimit = size > this.largeFileThreshold ? this.maxConcurrencyLargeFiles : this.maxConcurrency;

    while (this.activeCount >= effectiveLimit) {
      await new Promise<void>((resolve) => this.waitQueue.push(resolve));
    }

    this.activeCount++;
    try {
      return await fn();
    } finally {
      this.activeCount--;
      const next = this.waitQueue.shift();
      if (next) next();
    }
  }
}

// =============================================================================
// Helper Functions
// =============================================================================

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
 * Group folders by depth level.
 */
function groupFoldersByDepth(folders: UploadFolder[]): Map<number, UploadFolder[]> {
  const byDepth = new Map<number, UploadFolder[]>();

  for (const folder of folders) {
    const depth = folder.relativePath.split('/').length - 1;
    if (!byDepth.has(depth)) byDepth.set(depth, []);
    byDepth.get(depth)!.push(folder);
  }

  return byDepth;
}

// =============================================================================
// Main Upload Function
// =============================================================================

/**
 * Main upload function.
 * Orchestrates the entire upload process with optimized relationship strategy.
 */
export async function uploadTree(
  client: ArkeClient,
  tree: UploadTree,
  options: UploadOptions
): Promise<UploadResult> {
  const { target, onProgress, concurrency = 10, continueOnError = false, note } = options;

  const errors: Array<{ path: string; error: string }> = [];
  const createdFolders: CreatedFolder[] = [];
  const createdFiles: CreatedFile[] = [];

  // Maps for tracking
  const foldersByPath = new Map<string, { id: string; cid: string }>();

  // Calculate totals
  const totalEntities = tree.files.length + tree.folders.length;
  const totalBytes = tree.files.reduce((sum, f) => sum + f.size, 0);
  let completedEntities = 0;
  let bytesUploaded = 0;

  // Helper to report progress
  const reportProgress = (progress: Partial<UploadProgress>) => {
    if (onProgress) {
      const phase = progress.phase || 'computing-cids';
      const phaseIndex = PHASE_INDEX[phase] ?? -1;

      // Calculate phase percent based on current phase
      let phasePercent = 0;
      if (phase === 'computing-cids') {
        // CID phase: progress is based on files processed
        const done = progress.completedEntities ?? completedEntities;
        phasePercent = tree.files.length > 0 ? Math.round((done / tree.files.length) * 100) : 100;
      } else if (phase === 'creating') {
        // Creating phase: progress is based on entities created
        const done = progress.completedEntities ?? completedEntities;
        phasePercent = totalEntities > 0 ? Math.round((done / totalEntities) * 100) : 100;
      } else if (phase === 'backlinking') {
        // Backlinking phase: progress is based on parents updated
        const done = progress.completedParents ?? 0;
        const total = progress.totalParents ?? 0;
        phasePercent = total > 0 ? Math.round((done / total) * 100) : 100;
      } else if (phase === 'complete') {
        phasePercent = 100;
      }

      onProgress({
        phase,
        phaseIndex,
        phaseCount: PHASE_COUNT,
        phasePercent,
        totalEntities,
        completedEntities,
        totalParents: 0,
        completedParents: 0,
        totalBytes,
        bytesUploaded,
        ...progress,
      } as UploadProgress);
    }
  };

  try {
    // ─────────────────────────────────────────────────────────────────────────
    // SETUP: Resolve or create collection
    // ─────────────────────────────────────────────────────────────────────────
    let collectionId: string;
    let collectionCid: string;
    let collectionCreated = false;

    if (target.createCollection) {
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
    // PHASE 1: Compute CIDs for all files
    // ─────────────────────────────────────────────────────────────────────────
    reportProgress({ phase: 'computing-cids', completedEntities: 0 });

    const preparedFiles: PreparedFile[] = [];
    let cidProgress = 0;

    await parallelLimit(tree.files, Math.max(concurrency, 20), async (file) => {
      try {
        const data = await file.getData();
        const cid = await computeCid(data);

        preparedFiles.push({ ...file, cid });

        cidProgress++;
        reportProgress({
          phase: 'computing-cids',
          completedEntities: cidProgress,
          currentItem: file.relativePath,
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
    // PHASE 2: Create entities (folders by depth, then files)
    // ─────────────────────────────────────────────────────────────────────────
    reportProgress({ phase: 'creating', completedEntities: 0 });

    // Group folders by depth
    const foldersByDepth = groupFoldersByDepth(tree.folders);
    const sortedDepths = [...foldersByDepth.keys()].sort((a, b) => a - b);

    // Create folders depth by depth (parents before children)
    for (const depth of sortedDepths) {
      const foldersAtDepth = foldersByDepth.get(depth)!;

      await Promise.all(
        foldersAtDepth.map(async (folder) => {
          try {
            const parentPath = getParentPath(folder.relativePath);
            const parentId = parentPath ? foldersByPath.get(parentPath)!.id : rootParentId;
            const parentType = parentPath ? 'folder' : parentId === collectionId ? 'collection' : 'folder';

            const folderBody: CreateFolderRequest = {
              label: folder.name,
              collection: collectionId,
              note,
              relationships: [{ predicate: 'in', peer: parentId, peer_type: parentType }],
            };

            const { data, error } = await client.api.POST('/folders', {
              body: folderBody,
            });

            if (error || !data) {
              throw new Error(JSON.stringify(error));
            }

            // Track folder
            foldersByPath.set(folder.relativePath, { id: data.id, cid: data.cid });
            createdFolders.push({
              name: folder.name,
              relativePath: folder.relativePath,
              id: data.id,
              entityCid: data.cid,
            });

            completedEntities++;
            reportProgress({
              phase: 'creating',
              completedEntities,
              currentItem: folder.relativePath,
            });
          } catch (err) {
            const errorMsg = err instanceof Error ? err.message : String(err);
            if (continueOnError) {
              errors.push({ path: folder.relativePath, error: `Folder creation failed: ${errorMsg}` });
              completedEntities++;
            } else {
              throw new Error(`Failed to create folder ${folder.relativePath}: ${errorMsg}`);
            }
          }
        })
      );
    }

    // Create files with pipelined S3 upload
    const LARGE_FILE_THRESHOLD = 10 * 1024 * 1024; // 10MB
    const pool = new DynamicConcurrencyPool(
      concurrency,
      Math.max(3, Math.floor(concurrency / 3)),
      LARGE_FILE_THRESHOLD
    );

    await Promise.all(
      preparedFiles.map(async (file) => {
        await pool.run(file.size, async () => {
          try {
            const parentPath = getParentPath(file.relativePath);
            const parentId = parentPath ? foldersByPath.get(parentPath)!.id : rootParentId;
            const parentType = parentPath ? 'folder' : parentId === collectionId ? 'collection' : 'folder';

            // Create file entity with 'in' relationship
            const fileBody: CreateFileRequest = {
              key: file.cid,
              filename: file.name,
              content_type: file.mimeType,
              size: file.size,
              cid: file.cid,
              collection: collectionId,
              relationships: [{ predicate: 'in', peer: parentId, peer_type: parentType }],
            };

            const { data, error } = await client.api.POST('/files', {
              body: fileBody,
            });

            if (error || !data) {
              throw new Error(`Entity creation failed: ${JSON.stringify(error)}`);
            }

            // Immediately upload to S3
            const fileData = await file.getData();

            let body: Blob;
            if (fileData instanceof Blob) {
              body = fileData;
            } else if (fileData instanceof Uint8Array) {
              const arrayBuffer = new ArrayBuffer(fileData.byteLength);
              new Uint8Array(arrayBuffer).set(fileData);
              body = new Blob([arrayBuffer], { type: file.mimeType });
            } else {
              body = new Blob([fileData], { type: file.mimeType });
            }

            const uploadResponse = await fetch(data.upload_url, {
              method: 'PUT',
              body,
              headers: { 'Content-Type': file.mimeType },
            });

            if (!uploadResponse.ok) {
              throw new Error(`S3 upload failed with status ${uploadResponse.status}`);
            }

            // Track file
            createdFiles.push({
              ...file,
              id: data.id,
              entityCid: data.cid,
              uploadUrl: data.upload_url,
              uploadExpiresAt: data.upload_expires_at,
            });

            bytesUploaded += file.size;
            completedEntities++;

            reportProgress({
              phase: 'creating',
              completedEntities,
              currentItem: file.relativePath,
              bytesUploaded,
            });
          } catch (err) {
            const errorMsg = err instanceof Error ? err.message : String(err);
            if (continueOnError) {
              errors.push({ path: file.relativePath, error: errorMsg });
              completedEntities++;
            } else {
              throw new Error(`Failed to process ${file.relativePath}: ${errorMsg}`);
            }
          }
        });
      })
    );

    // ─────────────────────────────────────────────────────────────────────────
    // PHASE 3: Backlink - Update each parent with 'contains' relationships
    // ─────────────────────────────────────────────────────────────────────────

    // Build parent -> children map
    const childrenByParent = new Map<string, Array<{ id: string; type: 'file' | 'folder' }>>();

    // Add folders as children of their parents
    for (const folder of createdFolders) {
      const parentPath = getParentPath(folder.relativePath);
      const parentId = parentPath ? foldersByPath.get(parentPath)!.id : rootParentId;

      if (!childrenByParent.has(parentId)) childrenByParent.set(parentId, []);
      childrenByParent.get(parentId)!.push({ id: folder.id, type: 'folder' });
    }

    // Add files as children of their parents
    for (const file of createdFiles) {
      const parentPath = getParentPath(file.relativePath);
      const parentId = parentPath ? foldersByPath.get(parentPath)!.id : rootParentId;

      if (!childrenByParent.has(parentId)) childrenByParent.set(parentId, []);
      childrenByParent.get(parentId)!.push({ id: file.id, type: 'file' });
    }

    const totalParents = childrenByParent.size;
    let completedParents = 0;

    reportProgress({ phase: 'backlinking', totalParents, completedParents: 0 });

    // Update all parents sequentially
    // Note: We use the bulk children endpoint because relationships_add doesn't work for 'contains'
    // The bulk endpoint has a limit of 50 children per call, so we batch if needed
    const BATCH_SIZE = 50;

    for (const [parentId, children] of childrenByParent.entries()) {
      try {
        const isCollection = parentId === collectionId;

        // Split children into batches
        const batches: Array<{ id: string }[]> = [];
        for (let i = 0; i < children.length; i += BATCH_SIZE) {
          batches.push(children.slice(i, i + BATCH_SIZE).map((c) => ({ id: c.id })));
        }

        // Process each batch sequentially (CID changes after each batch)
        for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
          const batch = batches[batchIndex]!;

          // Get current CID (must refetch after each batch since it changes)
          let currentCid: string;
          if (isCollection) {
            const { data, error } = await client.api.GET('/collections/{id}', {
              params: { path: { id: parentId } },
            });
            if (error || !data) {
              throw new Error(`Failed to fetch collection: ${JSON.stringify(error)}`);
            }
            currentCid = data.cid;
          } else {
            const { data, error } = await client.api.GET('/folders/{id}', {
              params: { path: { id: parentId } },
            });
            if (error || !data) {
              throw new Error(`Failed to fetch folder: ${JSON.stringify(error)}`);
            }
            currentCid = data.cid;
          }

          // Use bulk children endpoint to add contains relationships
          const bulkBody: BulkAddChildrenRequest = {
            expect_tip: currentCid,
            children: batch,
            note:
              batches.length > 1
                ? `${note || 'Upload'} (batch ${batchIndex + 1}/${batches.length})`
                : note
                  ? `${note} (backlink)`
                  : 'Upload backlink',
          };

          const { error } = await client.api.POST('/folders/{id}/children/bulk', {
            params: { path: { id: parentId } },
            body: bulkBody,
          });

          if (error) {
            throw new Error(JSON.stringify(error));
          }
        }

        completedParents++;
        reportProgress({
          phase: 'backlinking',
          totalParents,
          completedParents,
          currentItem: `parent:${parentId}`,
        });
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        if (continueOnError) {
          errors.push({ path: `parent:${parentId}`, error: `Backlink failed: ${errorMsg}` });
          completedParents++;
        } else {
          throw new Error(`Failed to backlink parent ${parentId}: ${errorMsg}`);
        }
      }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Complete!
    // ─────────────────────────────────────────────────────────────────────────
    reportProgress({ phase: 'complete', totalParents, completedParents });

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
