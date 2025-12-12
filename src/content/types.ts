/**
 * Content package types for the Arke SDK
 *
 * Types for interacting with entities and content from the IPFS Wrapper service.
 */

// ---------------------------------------------------------------------------
// Entity types (from IPFS Wrapper)
// ---------------------------------------------------------------------------

/**
 * Full entity manifest from IPFS Wrapper
 */
export interface Entity {
  /** Persistent Identifier (ULID or test PI with II prefix) */
  pi: string;
  /** Version number */
  ver: number;
  /** Timestamp when this version was created */
  ts: string;
  /** CID of this manifest */
  manifest_cid: string;
  /** CID of the previous version (undefined for version 1) */
  prev_cid?: string;
  /** Map of component names to their CIDs */
  components: Record<string, string>;
  /** PIs of child entities */
  children_pi?: string[];
  /** PI of parent entity */
  parent_pi?: string;
  /** Change note for this version */
  note?: string;
}

/**
 * Summary entity info returned when listing entities
 */
export interface EntitySummary {
  /** Persistent Identifier */
  pi: string;
  /** Tip CID (latest manifest) */
  tip: string;
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
  /** Persistent Identifier */
  pi: string;
  /** Tip CID (latest manifest) */
  tip: string;
}
