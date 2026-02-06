/**
 * Upload Engine
 *
 * Core upload implementation optimized for fast tree visibility:
 * 1. Create folders by depth (with unidirectional 'in' → parent)
 * 2. Create file entities (metadata only, high parallelism)
 * 3. Backlink parents with 'contains' relationships
 *    → Tree is now browsable! Users can explore structure immediately.
 * 4. Upload file content via POST /files/{id}/content (byte-based pool, ~200MB in flight)
 *    - Direct upload to API endpoint
 *    - API streams to R2, computes CID, updates entity atomically
 *
 * Byte-based pool (for uploads):
 * - Maintains ~200MB of data in flight at all times
 * - When a file completes, next file starts immediately (no gaps)
 * - Small files: Many upload in parallel
 * - Large files: Fewer upload in parallel (bandwidth-limited)
 * - Single file > 200MB: Uploads alone when pool is empty
 *
 * This minimizes time-to-browse by:
 * - Creating all entities before uploading content
 * - Using unidirectional 'in' relationship on entity creation
 * - Adding all 'contains' relationships in a single PUT per parent
 */

import type { ArkeClient } from '../../client/ArkeClient.js';
import { getAuthorizationHeader } from '../../client/ArkeClient.js';
import type { components } from '../../generated/types.js';
import { computeCid } from './cid.js';
import type {
  UploadTree,
  UploadOptions,
  UploadResult,
  UploadProgress,
  CreatedFolder,
  CreatedFile,
  CreatedEntity,
  UploadFolder,
} from './types.js';

type CreateCollectionRequest = components['schemas']['CreateCollectionRequest'];
type CreateEntityRequest = components['schemas']['CreateEntityRequest'];
type UpdateEntityRequest = components['schemas']['UpdateEntityRequest'];
type UpdateCollectionRequest = components['schemas']['UpdateCollectionRequest'];

// Phase constants
const PHASE_COUNT = 3; // creating, backlinking, uploading (excluding complete/error)
const PHASE_INDEX: Record<string, number> = {
  creating: 0,
  backlinking: 1,
  uploading: 2,
  complete: 3,
  error: -1,
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

// =============================================================================
// Byte-Based Pool
// =============================================================================

/** Target bytes in flight (~200MB) */
const TARGET_BYTES_IN_FLIGHT = 200 * 1024 * 1024;

/** Threshold for using presigned URLs (5MB) - larger files bypass API worker */
const PRESIGNED_URL_THRESHOLD = 5 * 1024 * 1024;

/**
 * Pool that maintains a target number of bytes in flight.
 *
 * When a file completes, its bytes are released and the next
 * waiting file can start immediately. This keeps the pipeline full.
 *
 * - Small files: Many run in parallel (up to ~200MB worth)
 * - Large files: Fewer run in parallel
 * - Single file > 200MB: Runs alone (allowed when pool is empty)
 */
class BytePool {
  private bytesInFlight = 0;
  private waitQueue: Array<() => void> = [];

  constructor(private targetBytes: number = TARGET_BYTES_IN_FLIGHT) {}

  async run<T>(size: number, fn: () => Promise<T>): Promise<T> {
    // Wait until we have room
    // Exception: if pool is empty, always allow (handles files > targetBytes)
    while (this.bytesInFlight > 0 && this.bytesInFlight + size > this.targetBytes) {
      await new Promise<void>((resolve) => this.waitQueue.push(resolve));
    }

    this.bytesInFlight += size;
    try {
      return await fn();
    } finally {
      this.bytesInFlight -= size;
      // Wake ALL waiting tasks so they can re-evaluate the condition.
      // wake-one is incorrect here: if a large file finishes, multiple
      // smaller files may now fit but only the first waiter would check.
      const queue = this.waitQueue.splice(0);
      for (const resolve of queue) resolve();
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
  const { target, onProgress, concurrency = 10, continueOnError = false, maxBytesInFlight, note } = options;

  const errors: Array<{ path: string; error: string }> = [];
  const createdFolders: CreatedFolder[] = [];
  const createdFiles: CreatedFile[] = [];

  // Maps for tracking (include label for peer_label in relationships)
  const foldersByPath = new Map<string, { id: string; cid: string; label: string }>();

  // Calculate totals
  const totalEntities = tree.files.length + tree.folders.length;
  const totalBytes = tree.files.reduce((sum, f) => sum + f.size, 0);
  let completedEntities = 0;
  let bytesUploaded = 0;

  // Helper to report progress
  const reportProgress = (progress: Partial<UploadProgress>) => {
    if (onProgress) {
      const phase = progress.phase || 'creating';
      const phaseIndex = PHASE_INDEX[phase] ?? -1;

      // Calculate phase percent based on current phase
      let phasePercent = 0;
      if (phase === 'creating') {
        // Creating phase: progress is based on entities created
        const done = progress.completedEntities ?? completedEntities;
        phasePercent = totalEntities > 0 ? Math.round((done / totalEntities) * 100) : 100;
      } else if (phase === 'backlinking') {
        // Backlinking phase: progress is based on parents updated
        const done = progress.completedParents ?? 0;
        const total = progress.totalParents ?? 0;
        phasePercent = total > 0 ? Math.round((done / total) * 100) : 100;
      } else if (phase === 'uploading') {
        // Uploading phase: progress is based on bytes uploaded
        const done = progress.bytesUploaded ?? bytesUploaded;
        phasePercent = totalBytes > 0 ? Math.round((done / totalBytes) * 100) : 100;
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
    let collectionLabel: string;
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
      collectionLabel = target.createCollection.label;
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
      collectionLabel = (data.properties?.label as string) ?? collectionId;
    } else {
      throw new Error('Must provide either collectionId or createCollection in target');
    }

    // Determine the parent for root-level items
    const rootParentId = target.parentId ?? collectionId;
    let rootParentLabel = collectionLabel;
    let rootParentType: 'collection' | 'folder' = 'collection';

    // If a specific parent folder is provided, fetch its label
    if (target.parentId && target.parentId !== collectionId) {
      const { data: parentData, error: parentError } = await client.api.GET('/entities/{id}', {
        params: { path: { id: target.parentId } },
      });
      if (parentError || !parentData) {
        throw new Error(`Failed to fetch parent folder: ${JSON.stringify(parentError)}`);
      }
      rootParentLabel = (parentData.properties?.label as string) ?? target.parentId;
      rootParentType = 'folder';
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PHASE 1: Create entities (folders by depth, then files)
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
            const parentInfo = parentPath ? foldersByPath.get(parentPath)! : null;
            const parentId = parentInfo ? parentInfo.id : rootParentId;
            const parentType = parentInfo ? 'folder' : rootParentType;
            const parentLabel = parentInfo ? parentInfo.label : rootParentLabel;

            const folderBody: CreateEntityRequest = {
              type: 'folder',
              properties: { label: folder.name },
              collection: collectionId,
              note,
              relationships: [{ predicate: 'in', peer: parentId, peer_type: parentType, peer_label: parentLabel }],
            };

            const { data, error } = await client.api.POST('/entities', {
              body: folderBody,
            });

            if (error || !data) {
              throw new Error(JSON.stringify(error));
            }

            // Track folder (include label for peer_label in child relationships)
            foldersByPath.set(folder.relativePath, { id: data.id, cid: data.cid, label: folder.name });
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

    // Create file entities (metadata only, no content upload yet)
    // Use simple concurrency limit for API calls
    const FILE_CREATION_CONCURRENCY = 50;

    await parallelLimit(tree.files, FILE_CREATION_CONCURRENCY, async (file) => {
      try {
        const parentPath = getParentPath(file.relativePath);
        const parentInfo = parentPath ? foldersByPath.get(parentPath)! : null;
        const parentId = parentInfo ? parentInfo.id : rootParentId;
        const parentType = parentInfo ? 'folder' : rootParentType;
        const parentLabel = parentInfo ? parentInfo.label : rootParentLabel;

        // Create file entity with 'in' relationship (include peer_label for display)
        // Server computes CID when content is uploaded
        const fileBody: CreateEntityRequest = {
          type: 'file',
          properties: {
            label: file.name,
            filename: file.name,
            content_type: file.mimeType,
            size: file.size,
          },
          collection: collectionId,
          note,
          relationships: [{ predicate: 'in', peer: parentId, peer_type: parentType, peer_label: parentLabel }],
        };

        const { data, error } = await client.api.POST('/entities', {
          body: fileBody,
        });

        if (error || !data) {
          throw new Error(`Entity creation failed: ${JSON.stringify(error)}`);
        }

        // Track file for later upload
        createdFiles.push({
          ...file,
          id: data.id,
          entityCid: data.cid,
        });

        completedEntities++;
        reportProgress({
          phase: 'creating',
          completedEntities,
          currentItem: file.relativePath,
        });
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        if (continueOnError) {
          errors.push({ path: file.relativePath, error: errorMsg });
          completedEntities++;
        } else {
          throw new Error(`Failed to create file ${file.relativePath}: ${errorMsg}`);
        }
      }
    });

    // ─────────────────────────────────────────────────────────────────────────
    // PHASE 2: Backlink - Update each parent with 'contains' relationships
    // ─────────────────────────────────────────────────────────────────────────

    // Build parent -> children map (include label for peer_label)
    const childrenByParent = new Map<string, Array<{ id: string; type: 'file' | 'folder'; label: string }>>();

    // Add folders as children of their parents
    for (const folder of createdFolders) {
      const parentPath = getParentPath(folder.relativePath);
      const parentId = parentPath ? foldersByPath.get(parentPath)!.id : rootParentId;

      if (!childrenByParent.has(parentId)) childrenByParent.set(parentId, []);
      childrenByParent.get(parentId)!.push({ id: folder.id, type: 'folder', label: folder.name });
    }

    // Add files as children of their parents
    for (const file of createdFiles) {
      const parentPath = getParentPath(file.relativePath);
      const parentId = parentPath ? foldersByPath.get(parentPath)!.id : rootParentId;

      if (!childrenByParent.has(parentId)) childrenByParent.set(parentId, []);
      childrenByParent.get(parentId)!.push({ id: file.id, type: 'file', label: file.name });
    }

    const totalParents = childrenByParent.size;
    let completedParents = 0;

    reportProgress({ phase: 'backlinking', totalParents, completedParents: 0 });

    // Update all parents in parallel - each parent gets one PUT with all its children
    const parentEntries = [...childrenByParent.entries()];

    await parallelLimit(parentEntries, concurrency, async ([parentId, children]) => {
      try {
        const isCollection = parentId === collectionId;

        // Build relationships_add array with all children (include peer_label for display)
        const relationshipsAdd = children.map((child) => ({
          predicate: 'contains' as const,
          peer: child.id,
          peer_type: child.type,
          peer_label: child.label,
        }));

        if (isCollection) {
          // Get current collection CID for CAS
          const { data: collData, error: getError } = await client.api.GET('/collections/{id}', {
            params: { path: { id: parentId } },
          });
          if (getError || !collData) {
            throw new Error(`Failed to fetch collection: ${JSON.stringify(getError)}`);
          }

          // Update collection with relationships_add
          const updateBody: UpdateCollectionRequest = {
            expect_tip: collData.cid,
            relationships_add: relationshipsAdd,
            note: note ? `${note} (backlink)` : 'Upload backlink',
          };

          const { error } = await client.api.PUT('/collections/{id}', {
            params: { path: { id: parentId } },
            body: updateBody,
          });

          if (error) {
            throw new Error(JSON.stringify(error));
          }
        } else {
          // Get current folder CID for CAS
          const { data: folderData, error: getError } = await client.api.GET('/entities/{id}', {
            params: { path: { id: parentId } },
          });
          if (getError || !folderData) {
            throw new Error(`Failed to fetch folder: ${JSON.stringify(getError)}`);
          }

          // Update folder with relationships_add
          const updateBody: UpdateEntityRequest = {
            expect_tip: folderData.cid,
            relationships_add: relationshipsAdd,
            note: note ? `${note} (backlink)` : 'Upload backlink',
          };

          const { error } = await client.api.PUT('/entities/{id}', {
            params: { path: { id: parentId } },
            body: updateBody,
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
    });

    // ─────────────────────────────────────────────────────────────────────────
    // PHASE 3: Upload file content
    // Tree is now browsable! Users can explore while content uploads.
    //
    // Two paths based on file size:
    // - Small files (<5MB): Direct upload through API (simple, CID computed server-side)
    // - Large files (>=5MB): Presigned URL to R2 (fast, CID computed client-side)
    // ─────────────────────────────────────────────────────────────────────────
    reportProgress({ phase: 'uploading', bytesUploaded: 0 });

    // Use byte-based pool to maintain target bytes in flight
    const pool = new BytePool(maxBytesInFlight);

    await Promise.all(
      createdFiles.map(async (file) => {
        await pool.run(file.size, async () => {
          try {
            // Get file data
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

            if (file.size >= PRESIGNED_URL_THRESHOLD) {
              // ─────────────────────────────────────────────────────────────
              // LARGE FILE: Presigned URL flow (bypasses API worker)
              // ─────────────────────────────────────────────────────────────

              // 1. Compute CID client-side
              const fileCid = await computeCid(fileData);

              // 2. Get presigned URL from API
              const { data: urlData, error: urlError } = await client.api.POST(
                '/entities/{id}/content/upload-url',
                {
                  params: { path: { id: file.id } },
                  body: {
                    content_type: file.mimeType,
                    size: file.size,
                    key: 'v1',
                  },
                }
              );

              if (urlError || !urlData) {
                throw new Error(`Failed to get presigned URL: ${JSON.stringify(urlError)}`);
              }

              // 3. PUT directly to R2 (fast!)
              const r2Response = await fetch(urlData.upload_url, {
                method: 'PUT',
                headers: { 'Content-Type': file.mimeType },
                body: body,
              });

              if (!r2Response.ok) {
                const errorText = await r2Response.text();
                throw new Error(`R2 upload failed: ${r2Response.status} ${errorText}`);
              }

              // 4. Complete upload by updating entity metadata
              const { error: completeError } = await client.api.POST(
                '/entities/{id}/content/complete',
                {
                  params: { path: { id: file.id } },
                  body: {
                    key: 'v1',
                    cid: fileCid,
                    size: file.size,
                    content_type: file.mimeType,
                    filename: file.name,
                    expect_tip: file.entityCid,
                  },
                }
              );

              if (completeError) {
                throw new Error(`Failed to complete upload: ${JSON.stringify(completeError)}`);
              }
            } else {
              // ─────────────────────────────────────────────────────────────
              // SMALL FILE: Direct upload through API
              // ─────────────────────────────────────────────────────────────

              const { error: uploadError } = await client.api.POST('/entities/{id}/content', {
                params: { path: { id: file.id }, query: { key: 'v1', filename: file.name } },
                body: body as unknown as Record<string, never>,
                bodySerializer: (b: unknown) => b as BodyInit,
                headers: { 'Content-Type': file.mimeType },
              } as Parameters<typeof client.api.POST>[1]);

              if (uploadError) {
                throw new Error(`Upload failed: ${JSON.stringify(uploadError)}`);
              }
            }

            bytesUploaded += file.size;
            reportProgress({
              phase: 'uploading',
              bytesUploaded,
              currentItem: file.relativePath,
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
      })
    );

    // ─────────────────────────────────────────────────────────────────────────
    // Complete!
    // ─────────────────────────────────────────────────────────────────────────
    reportProgress({ phase: 'complete', totalParents, completedParents, bytesUploaded });

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
