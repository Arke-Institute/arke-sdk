/**
 * Content package types for the Arke SDK
 *
 * Types for interacting with entities and content from the IPFS Wrapper service.
 * Based on the arke/eidos@v1 schema.
 */

// ---------------------------------------------------------------------------
// Entity types (from IPFS Wrapper - arke/eidos@v1 schema)
// ---------------------------------------------------------------------------

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
  /** Whether this entity has been merged into another (deprecated/superseded) */
  merged?: boolean;
  /** ID of entity this was merged into (if merged=true) */
  merged_into?: string;
  /** Timestamp when the merge occurred */
  merged_at?: string;
}

// ---------------------------------------------------------------------------
// Merge chain types
// ---------------------------------------------------------------------------

/**
 * Entry in a merge chain, representing one hop in the redirect path
 */
export interface MergeChainEntry {
  /** ID of the merged (deprecated) entity */
  id: string;
  /** ID of the entity it was merged into */
  merged_into: string;
  /** When the merge occurred */
  merged_at?: string;
  /** Optional note about the merge */
  note?: string;
}

/**
 * Options for the get() method
 */
export interface GetOptions {
  /** Follow merge chain to find the canonical entity (default: false) */
  followMerges?: boolean;
  /** Maximum merge hops to follow (default: 10) */
  maxMergeHops?: number;
}

/**
 * Response when fetching an entity with followMerges: true
 */
export interface EntityWithMergeChain {
  /** The final (canonical) entity after following any merges */
  entity: Entity;
  /** The merge chain traversed (empty array if no merges were followed) */
  mergeChain: MergeChainEntry[];
  /** The original ID that was requested */
  originalId: string;
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
export interface EntityVersion {
  /** Version number */
  ver: number;
  /** CID of this version's manifest */
  cid: string;
  /** Timestamp when this version was created */
  ts: string;
  /** Change note for this version */
  note?: string;
}

// ---------------------------------------------------------------------------
// Request option types
// ---------------------------------------------------------------------------

/**
 * Options for listing entities
 */
export interface ListOptions {
  /** Maximum entities to return (1-1000, default: 100) */
  limit?: number;
  /** Cursor for pagination (CID, base32 starting with 'b') */
  cursor?: string;
  /** Whether to include full metadata for each entity */
  include_metadata?: boolean;
}

/**
 * Options for listing versions
 */
export interface VersionsOptions {
  /** Maximum versions to return (default: 20) */
  limit?: number;
  /** Cursor for pagination (CID to start from) */
  cursor?: string;
}

// ---------------------------------------------------------------------------
// Response types
// ---------------------------------------------------------------------------

/**
 * Response from listing entities
 */
export interface ListResponse {
  /** List of entity summaries */
  entities: EntitySummary[];
  /** Number of entities returned (matches limit) */
  limit: number;
  /** Cursor for next page (null if no more) */
  next_cursor: string | null;
}

/**
 * Response from listing versions
 */
export interface VersionsResponse {
  /** List of versions (newest first) */
  items: EntityVersion[];
  /** Cursor for next page (null if reached genesis) */
  next_cursor: string | null;
}

/**
 * Response from resolving a PI
 */
export interface ResolveResponse {
  /** Entity identifier */
  id: string;
  /** Tip CID (latest manifest) */
  tip: string;
}

// ---------------------------------------------------------------------------
// Relationship types (arke/relationships@v1 schema)
// ---------------------------------------------------------------------------

/**
 * A single relationship edge in the semantic graph.
 *
 * Represents a typed, directional relationship from the source entity
 * to a target entity or PI.
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

/**
 * Relationships component stored in IPFS (arke/relationships@v1 schema).
 *
 * Contains the semantic graph relationships for an entity.
 */
export interface RelationshipsComponent {
  /** Schema identifier */
  schema: 'arke/relationships@v1';
  /** Array of relationships */
  relationships: Relationship[];
  /** ISO 8601 timestamp when this component was created/updated */
  timestamp: string;
  /** Optional note about changes */
  note?: string;
}

/**
 * Properties component stored in IPFS.
 *
 * Contains arbitrary metadata properties for an entity.
 */
export interface PropertiesComponent {
  /** Arbitrary key-value properties */
  [key: string]: unknown;
}
