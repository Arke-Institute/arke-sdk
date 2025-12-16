/**
 * Arke SDK - Edit Package
 *
 * Provides full write access to the IPFS Wrapper API:
 * - Entity CRUD (create, read, update, delete)
 * - Version management
 * - Hierarchy operations (parent-child relationships)
 * - Merge/unmerge operations
 * - Content upload
 * - Reprocessing (AI regeneration)
 *
 * @example
 * ```typescript
 * import { EditClient } from '@arke-institute/sdk/edit';
 *
 * const client = new EditClient({
 *   gatewayUrl: 'https://gateway.arke.io',
 *   authToken: 'your-jwt-token',
 * });
 *
 * // Create an entity
 * const [metadataCid] = await client.upload(metadataBlob);
 * const result = await client.createEntity({
 *   type: 'PI',
 *   components: { metadata: metadataCid },
 *   label: 'My Collection',
 * });
 *
 * // Update with CAS protection
 * await client.withCAS(result.id, async (entity) => {
 *   return client.updateEntity(entity.id, {
 *     expect_tip: entity.manifest_cid,
 *     label: 'Updated Name',
 *     note: 'Changed label',
 *   });
 * });
 *
 * // Merge duplicates
 * const target = await client.getEntity('01TARGET...');
 * await client.mergeEntity('01SOURCE...', {
 *   target_id: target.id,
 *   expect_target_tip: target.manifest_cid,
 *   note: 'Duplicate entry',
 * });
 * ```
 */

// Client
export { EditClient, type EditClientConfig } from './client.js';

// Session (for AI-assisted editing workflows)
export { EditSession } from './session.js';

// Types - Network
export type { Network } from './types.js';

// Types - Entity
export type {
  Entity,
  EntitySummary,
  VersionHistoryItem,
  Relationship,
} from './types.js';

// Types - Create
export type { CreateEntityRequest, CreateEntityResponse } from './types.js';

// Types - Update
export type { UpdateEntityRequest, UpdateEntityResponse } from './types.js';

// Types - List
export type { ListEntitiesOptions, ListEntitiesResponse } from './types.js';

// Types - Versions
export type {
  ListVersionsOptions,
  ListVersionsResponse,
  ResolveResponse,
} from './types.js';

// Types - Hierarchy
export type { UpdateHierarchyRequest, UpdateHierarchyResponse } from './types.js';

// Types - Merge
export type {
  MergeEntityRequest,
  MergeEntityResponse,
  UnmergeEntityRequest,
  UnmergeEntityResponse,
} from './types.js';

// Types - Delete
export type {
  DeleteEntityRequest,
  DeleteEntityResponse,
  UndeleteEntityRequest,
  UndeleteEntityResponse,
} from './types.js';

// Types - Upload
export type { UploadResponse } from './types.js';

// Types - Configuration
export type { EditMode, EditSessionConfig, RetryConfig } from './types.js';
export { DEFAULT_RETRY_CONFIG } from './types.js';

// Types - Edit workflow
export type {
  RegeneratableComponent,
  EditScope,
  Correction,
} from './types.js';

// Types - Diff
export type { DiffType, TextDiff, ComponentDiff } from './types.js';

// Types - Prompt
export type { PromptTarget, EntityContext, CascadeContext } from './types.js';

// Types - Reprocess
export type {
  CustomPrompts,
  ReprocessRequest,
  ReprocessResult,
  ReprocessPhase,
  ReprocessProgress,
  ReprocessStatus,
} from './types.js';

// Types - Results
export type {
  SaveResult,
  EditResult,
  EditPhase,
  EditStatus,
  PollOptions,
} from './types.js';

// Types - Summary
export type { ChangeSummary } from './types.js';

// Errors
export {
  EditError,
  EntityNotFoundError,
  EntityExistsError,
  CASConflictError,
  MergeError,
  UnmergeError,
  DeleteError,
  UndeleteError,
  ReprocessError,
  ValidationError,
  PermissionError,
  NetworkError,
  ContentNotFoundError,
  IPFSError,
  BackendError,
} from './errors.js';

// Utilities (for advanced use cases)
export { DiffEngine } from './diff.js';
export { PromptBuilder } from './prompts.js';
