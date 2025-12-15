/**
 * Arke SDK - Edit Package Type Definitions
 *
 * Types for write operations against the IPFS Wrapper API.
 * Based on the arke/eidos@v1 schema.
 */

// ============================================================================
// Network Types
// ============================================================================

/** Network type for API requests */
export type Network = 'main' | 'test';

// ============================================================================
// Entity Types (arke/eidos@v1 aligned)
// ============================================================================

/**
 * Full entity manifest from IPFS Wrapper
 */
export interface Entity {
  /** Entity identifier (ULID or test ID with II prefix) */
  id: string;
  /** Entity type (e.g., "PI", "person", "place", "concept", "document") */
  type: string;
  /** Creation timestamp (immutable, set at v1) */
  created_at: string;
  /** Display name */
  label?: string;
  /** Human-readable description */
  description?: string;
  /** Version number */
  ver: number;
  /** Timestamp when this version was created */
  ts: string;
  /** CID of this manifest */
  manifest_cid: string;
  /** CID of the previous version (null for version 1) */
  prev_cid: string | null;
  /** Map of component names to their CIDs */
  components: Record<string, string>;
  /** IDs of child entities */
  children_pi?: string[];
  /** ID of parent entity */
  parent_pi?: string;
  /** Provenance: which PI extracted this entity */
  source_pi?: string;
  /** IDs of entities that have been merged into this one */
  merged_entities?: string[];
  /** Change note for this version */
  note?: string;
}

/**
 * Summary entity info returned when listing entities
 */
export interface EntitySummary {
  /** Entity identifier */
  id: string;
  /** Tip CID (latest manifest) */
  tip: string;
  /** Entity type (if include_metadata=true) */
  type?: string;
  /** Display name (if include_metadata=true) */
  label?: string;
  /** Version number (if include_metadata=true) */
  ver?: number;
  /** Timestamp (if include_metadata=true) */
  ts?: string;
  /** Change note (if include_metadata=true) */
  note?: string;
  /** Number of components (if include_metadata=true) */
  component_count?: number;
  /** Number of children (if include_metadata=true) */
  children_count?: number;
}

/**
 * Version entry in version history
 */
export interface VersionHistoryItem {
  /** Version number */
  ver: number;
  /** CID of this version's manifest */
  cid: string;
  /** Timestamp when this version was created */
  ts: string;
  /** Change note for this version */
  note?: string;
}

// ============================================================================
// Relationship Types (arke/relationships@v1)
// ============================================================================

/**
 * A single relationship edge in the semantic graph
 */
export interface Relationship {
  /** Relationship predicate (e.g., "authored_by", "mentions", "located_in") */
  predicate: string;
  /** Type of target */
  target_type: 'pi' | 'entity';
  /** Target entity identifier */
  target_id: string;
  /** Display label for the target (e.g., "Alice Austen") */
  target_label: string;
  /** Target entity type (e.g., "person", "place") - only if target is entity */
  target_entity_type?: string;
  /** Optional metadata on the relationship edge */
  properties?: Record<string, unknown>;
}

// ============================================================================
// Create Entity
// ============================================================================

/**
 * Request to create a new entity
 */
export interface CreateEntityRequest {
  /** Entity ID (optional - server generates ULID if omitted) */
  id?: string;
  /** Entity type (required, e.g., "PI", "person", "place") */
  type: string;
  /** Components map: label → CID */
  components: Record<string, string>;
  /** Display name */
  label?: string;
  /** Human-readable description */
  description?: string;
  /** Parent entity ID (auto-updates parent's children_pi) */
  parent_pi?: string;
  /** Child entity IDs */
  children_pi?: string[];
  /** Provenance: which PI extracted this entity */
  source_pi?: string;
  /** Initial properties (will be stored as component) */
  properties?: Record<string, unknown>;
  /** Initial relationships (will be stored as component) */
  relationships?: Relationship[];
  /** Change note */
  note?: string;
}

/**
 * Response from creating an entity
 */
export interface CreateEntityResponse {
  /** Entity identifier */
  id: string;
  /** Entity type */
  type: string;
  /** Version number (always 1 for new entities) */
  ver: number;
  /** CID of the manifest */
  manifest_cid: string;
  /** Tip CID (same as manifest_cid for new entities) */
  tip: string;
}

// ============================================================================
// Update Entity (Append Version)
// ============================================================================

/**
 * Request to append a new version to an entity
 */
export interface UpdateEntityRequest {
  /** Current tip CID (CAS guard - required) */
  expect_tip: string;
  /** Change entity type */
  type?: string;
  /** Update display name */
  label?: string;
  /** Update description */
  description?: string;
  /** Components to add/update: label → CID */
  components?: Record<string, string>;
  /** Component labels to remove */
  components_remove?: string[];
  /** Child IDs to add (max 100, auto-updates children's parent_pi) */
  children_pi_add?: string[];
  /** Child IDs to remove (max 100, auto-updates children's parent_pi) */
  children_pi_remove?: string[];
  /** Replace entire properties object */
  properties?: Record<string, unknown>;
  /** Replace entire relationships array */
  relationships?: Relationship[];
  /** Change note */
  note?: string;
}

/**
 * Response from updating an entity
 */
export interface UpdateEntityResponse {
  /** Entity identifier */
  id: string;
  /** Entity type */
  type: string;
  /** New version number */
  ver: number;
  /** CID of the new manifest */
  manifest_cid: string;
  /** New tip CID */
  tip: string;
}

// ============================================================================
// List Entities
// ============================================================================

/**
 * Options for listing entities
 */
export interface ListEntitiesOptions {
  /** Maximum entities to return (1-1000, default: 100) */
  limit?: number;
  /** Pagination cursor from next_cursor */
  cursor?: string;
  /** Include full metadata for each entity */
  include_metadata?: boolean;
}

/**
 * Response from listing entities
 */
export interface ListEntitiesResponse {
  /** List of entity summaries */
  entities: EntitySummary[];
  /** Limit used */
  limit: number;
  /** Cursor for next page (null if no more) */
  next_cursor: string | null;
}

// ============================================================================
// Version Operations
// ============================================================================

/**
 * Options for listing versions
 */
export interface ListVersionsOptions {
  /** Maximum versions to return (1-1000, default: 50) */
  limit?: number;
  /** Pagination cursor (manifest CID) */
  cursor?: string;
}

/**
 * Response from listing versions
 */
export interface ListVersionsResponse {
  /** List of versions (newest first) */
  items: VersionHistoryItem[];
  /** Cursor for next page (null if reached genesis) */
  next_cursor: string | null;
}

/**
 * Response from resolving an ID to tip
 */
export interface ResolveResponse {
  /** Entity identifier */
  id: string;
  /** Tip CID (latest manifest) */
  tip: string;
}

// ============================================================================
// Hierarchy Operations
// ============================================================================

/**
 * Request to update parent-child hierarchy
 */
export interface UpdateHierarchyRequest {
  /** Parent entity ID */
  parent_id: string;
  /** Current parent tip CID (CAS guard) */
  expect_tip: string;
  /** Child IDs to add (max 100) */
  add_children?: string[];
  /** Child IDs to remove (max 100) */
  remove_children?: string[];
  /** Change note */
  note?: string;
}

/**
 * Response from updating hierarchy
 */
export interface UpdateHierarchyResponse {
  /** Parent entity ID */
  parent_pi: string;
  /** New parent version */
  parent_ver: number;
  /** New parent tip CID */
  parent_tip: string;
  /** Number of children successfully updated */
  children_updated: number;
  /** Number of children that failed to update */
  children_failed: number;
}

// ============================================================================
// Merge Operations
// ============================================================================

/**
 * Request to merge source entity into target
 */
export interface MergeEntityRequest {
  /** Target entity ID (entity to merge into) */
  target_id: string;
  /** Current target tip CID (CAS guard) */
  expect_target_tip: string;
  /** Reason for merge */
  note?: string;
  /** Skip index-sync callback (internal use) */
  skip_sync?: boolean;
}

/**
 * Response from merging entities
 */
export interface MergeEntityResponse {
  /** Source entity ID (now a tombstone) */
  source_id: string;
  /** Target entity ID */
  target_id: string;
  /** New target version */
  target_ver: number;
  /** New target tip CID */
  target_tip: string;
  /** CID of the tombstone manifest */
  tombstone_cid: string;
}

/**
 * Request to unmerge (restore) a previously merged entity
 */
export interface UnmergeEntityRequest {
  /** Target entity ID (entity it was merged into) */
  target_id: string;
  /** Current target tip CID (CAS guard) */
  expect_target_tip: string;
  /** Reason for unmerge */
  note?: string;
  /** Skip index-sync callback (internal use) */
  skip_sync?: boolean;
}

/**
 * Response from unmerging entity
 */
export interface UnmergeEntityResponse {
  /** Restored source entity ID */
  source_id: string;
  /** New source version */
  source_ver: number;
  /** New source tip CID */
  source_tip: string;
  /** Target entity ID */
  target_id: string;
  /** New target version */
  target_ver: number;
  /** New target tip CID */
  target_tip: string;
}

// ============================================================================
// Delete Operations
// ============================================================================

/**
 * Request to soft delete an entity
 */
export interface DeleteEntityRequest {
  /** Current tip CID (CAS guard) */
  expect_tip: string;
  /** Reason for deletion */
  note?: string;
}

/**
 * Response from deleting an entity
 */
export interface DeleteEntityResponse {
  /** Entity ID */
  id: string;
  /** Version number of the tombstone */
  deleted_ver: number;
  /** Timestamp of deletion */
  deleted_at: string;
  /** CID of the tombstone manifest */
  deleted_manifest_cid: string;
  /** Previous version number (before deletion) */
  previous_ver: number;
  /** CID of the previous manifest */
  prev_cid: string;
}

/**
 * Request to restore a deleted entity
 */
export interface UndeleteEntityRequest {
  /** Current tip CID (tombstone CID, CAS guard) */
  expect_tip: string;
  /** Reason for restoration */
  note?: string;
}

/**
 * Response from restoring a deleted entity
 */
export interface UndeleteEntityResponse {
  /** Entity ID */
  id: string;
  /** New version number after restoration */
  restored_ver: number;
  /** Version number that was restored from */
  restored_from_ver: number;
  /** CID of the new manifest */
  new_manifest_cid: string;
}

// ============================================================================
// Upload Operations
// ============================================================================

/**
 * Response from uploading files
 */
export interface UploadResponse {
  /** Original filename */
  name: string;
  /** CID of the uploaded content */
  cid: string;
  /** Size in bytes */
  size: number;
}

// ============================================================================
// Configuration
// ============================================================================

export type EditMode = 'ai-prompt' | 'manual-with-review' | 'manual-only';

export interface EditSessionConfig {
  mode: EditMode;
  aiReviewEnabled?: boolean; // Default: true for manual modes
}

// ============================================================================
// Edit Types (for UI/workflow)
// ============================================================================

export type RegeneratableComponent = 'pinax' | 'description' | 'cheimarros';

export interface EditScope {
  components: RegeneratableComponent[]; // Which components to regenerate
  cascade: boolean; // Propagate changes up the tree?
  stopAtPi?: string; // Stop cascade at this ancestor PI
}

export interface Correction {
  original: string;
  corrected: string;
  sourceFile?: string;
  context?: string; // Surrounding text for context
}

// ============================================================================
// Diff Types
// ============================================================================

export type DiffType = 'addition' | 'deletion' | 'change' | 'unchanged';

export interface TextDiff {
  type: DiffType;
  original?: string;
  modified?: string;
  lineNumber?: number;
  context?: string;
}

export interface ComponentDiff {
  componentName: string;
  diffs: TextDiff[];
  summary: string; // Human-readable summary
  hasChanges: boolean;
}

// ============================================================================
// Prompt Types
// ============================================================================

export type PromptTarget = RegeneratableComponent | 'general' | 'reorganization';

export interface EntityContext {
  pi: string;
  ver: number;
  parentPi?: string;
  childrenCount: number;
  currentContent: Record<string, string>;
}

export interface CascadeContext {
  path: string[]; // PIs from current to root
  depth: number;
  stopAtPi?: string;
}

// ============================================================================
// Reprocess Types
// ============================================================================

export interface CustomPrompts {
  general?: string;
  pinax?: string;
  description?: string;
  cheimarros?: string;
  reorganization?: string;
}

export interface ReprocessRequest {
  pi: string;
  phases: RegeneratableComponent[];
  cascade: boolean;
  options?: {
    stop_at_pi?: string;
    custom_prompts?: CustomPrompts;
    custom_note?: string; // Custom version note (overrides default phase notes)
  };
}

export interface ReprocessResult {
  batch_id: string;
  entities_queued: number;
  entity_pis: string[];
  status_url: string;
}

export type ReprocessPhase =
  | 'QUEUED'
  | 'DISCOVERY'
  | 'OCR_IN_PROGRESS'
  | 'REORGANIZATION'
  | 'PINAX_EXTRACTION'
  | 'CHEIMARROS_EXTRACTION'
  | 'DESCRIPTION'
  | 'DONE'
  | 'ERROR';

export interface ReprocessProgress {
  directories_total: number;
  directories_pinax_complete: number;
  directories_cheimarros_complete: number;
  directories_description_complete: number;
}

export interface ReprocessStatus {
  batch_id: string;
  status: ReprocessPhase;
  progress: ReprocessProgress;
  root_pi?: string;
  error?: string;
  started_at?: string;
  completed_at?: string;
}

// ============================================================================
// Result Types
// ============================================================================

export interface SaveResult {
  pi: string;
  newVersion: number;
  newTip: string;
}

export interface EditResult {
  // Phase 1: Save results (if manual edits were made)
  saved?: SaveResult;

  // Phase 2: Reprocess results (if regeneration requested)
  reprocess?: ReprocessResult;
}

export type EditPhase = 'idle' | 'saving' | 'reprocessing' | 'complete' | 'error';

export interface EditStatus {
  phase: EditPhase;
  saveComplete: boolean;
  reprocessStatus?: ReprocessStatus;
  error?: string;
}

export interface PollOptions {
  intervalMs?: number; // Default: 2000
  timeoutMs?: number; // Default: 300000 (5 min)
  onProgress?: (status: EditStatus) => void;
}

// ============================================================================
// Change Summary
// ============================================================================

export interface ChangeSummary {
  mode: EditMode;
  hasManualEdits: boolean;
  editedComponents: string[];
  corrections: Correction[];
  prompts: Record<string, string>;
  scope: EditScope;
  willRegenerate: RegeneratableComponent[];
  willCascade: boolean;
  willSave: boolean;
  willReprocess: boolean;
}

// ============================================================================
// Retry Configuration
// ============================================================================

/**
 * Configuration for retry behavior on transient errors
 */
export interface RetryConfig {
  /** Maximum retry attempts (default: 10) */
  maxRetries: number;
  /** Base delay in ms (default: 100) */
  baseDelay: number;
  /** Maximum delay in ms (default: 5000) */
  maxDelay: number;
  /** Jitter factor 0-1 (default: 0.3) */
  jitterFactor: number;
}

/**
 * Default retry configuration based on API spec recommendations
 */
export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 10,
  baseDelay: 100,
  maxDelay: 5000,
  jitterFactor: 0.3,
};
