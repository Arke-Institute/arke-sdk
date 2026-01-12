/**
 * Upload Module
 *
 * High-level operations for uploading folders and files to Arke.
 *
 * @example
 * ```typescript
 * import { ArkeClient } from '@arke-institute/sdk';
 * import { uploadTree, buildUploadTree } from '@arke-institute/sdk/operations';
 *
 * const client = new ArkeClient({ authToken: 'your-token' });
 *
 * // Build upload tree from file data (works in browser and Node.js)
 * const tree = buildUploadTree([
 *   { path: 'docs/readme.md', data: readmeBuffer },
 *   { path: 'images/logo.png', data: logoBlob },
 * ]);
 *
 * // Upload to a new collection
 * const result = await uploadTree(client, tree, {
 *   target: {
 *     createCollection: {
 *       label: 'My Upload',
 *       description: 'Uploaded folder contents',
 *     },
 *   },
 *   onProgress: (p) => console.log(`${p.phase}: ${p.phasePercent}%`),
 * });
 *
 * console.log('Created collection:', result.collection.id);
 * console.log('Uploaded files:', result.files.length);
 * ```
 */

// Types
export type {
  UploadFile,
  UploadFolder,
  UploadTree,
  UploadTarget,
  UploadProgress,
  UploadOptions,
  UploadResult,
  CreatedEntity,
} from './types.js';

// Core engine
export { uploadTree } from './engine.js';

// CID utilities
export { computeCid, verifyCid } from './cid.js';

// Scanners and utilities
export {
  scanFileSystemEntries,
  scanFileList,
  buildUploadTree,
  getMimeType,
} from './scanners.js';
