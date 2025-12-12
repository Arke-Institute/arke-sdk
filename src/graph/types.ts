/**
 * Graph package types for the Arke SDK
 *
 * Types for interacting with entity relationships from the GraphDB Gateway service.
 */

// ---------------------------------------------------------------------------
// Entity types (from GraphDB Gateway)
// ---------------------------------------------------------------------------

/**
 * Entity from the knowledge graph
 */
export interface GraphEntity {
  /** Unique identifier (UUID) */
  canonical_id: string;
  /** Entity code (e.g., 'person_john', 'event_123') */
  code: string;
  /** Human-readable label */
  label: string;
  /** Entity type (e.g., 'person', 'event', 'date', 'organization') */
  type: string;
  /** Additional entity properties */
  properties?: Record<string, unknown>;
  /** PI that created this entity */
  created_by_pi?: string;
  /** All PIs that contributed to this entity */
  source_pis?: string[];
}

/**
 * Relationship between entities
 */
export interface Relationship {
  /** Direction of the relationship relative to the queried entity */
  direction: 'outgoing' | 'incoming';
  /** Relationship type/predicate (e.g., 'affiliated_with', 'authored', 'located_at') */
  predicate: string;
  /** Canonical ID of the related entity */
  target_id: string;
  /** Code of the related entity */
  target_code: string;
  /** Label of the related entity */
  target_label: string;
  /** Type of the related entity */
  target_type: string;
  /** Additional relationship properties */
  properties?: Record<string, unknown>;
  /** PI that created this relationship */
  source_pi?: string;
  /** When the relationship was created */
  created_at?: string;
}

/**
 * Entity with its relationships
 */
export interface EntityWithRelationships extends GraphEntity {
  /** All relationships for this entity */
  relationships: Relationship[];
}

// ---------------------------------------------------------------------------
// Path finding types
// ---------------------------------------------------------------------------

/**
 * An edge in a path between entities
 */
export interface PathEdge {
  /** Subject entity ID */
  subject_id: string;
  /** Subject entity label */
  subject_label: string;
  /** Subject entity type */
  subject_type: string;
  /** Relationship predicate */
  predicate: string;
  /** Object entity ID */
  object_id: string;
  /** Object entity label */
  object_label: string;
  /** Object entity type */
  object_type: string;
  /** PI that contributed this edge */
  source_pi?: string;
}

/**
 * A path between two entities
 */
export interface Path {
  /** Starting entity ID */
  source_id: string;
  /** Ending entity ID */
  target_id: string;
  /** Number of hops in the path */
  length: number;
  /** Edges in the path */
  edges: PathEdge[];
}

// ---------------------------------------------------------------------------
// Request option types
// ---------------------------------------------------------------------------

/**
 * Options for finding paths between entities
 */
export interface PathOptions {
  /** Maximum traversal depth (default: 3) */
  max_depth?: number;
  /** Direction of traversal */
  direction?: 'outgoing' | 'incoming' | 'both';
  /** Maximum number of paths to return */
  limit?: number;
}

/**
 * Options for finding reachable entities
 */
export interface ReachableOptions {
  /** Maximum traversal depth */
  max_depth?: number;
  /** Direction of traversal */
  direction?: 'outgoing' | 'incoming' | 'both';
  /** Maximum entities to return */
  limit?: number;
}

/**
 * Options for listing entities from a PI
 */
export interface ListFromPiOptions {
  /** Filter by entity type */
  type?: string;
}

// ---------------------------------------------------------------------------
// Response types
// ---------------------------------------------------------------------------

/**
 * Response from entity query by code
 */
export interface EntityQueryResponse {
  /** Whether entity was found */
  found: boolean;
  /** The entity (if found) */
  entity?: GraphEntity;
  /** Relationships (if found) */
  relationships?: {
    outgoing: Array<{
      predicate: string;
      target_id: string;
      target_label: string;
      target_type: string;
    }>;
    incoming: Array<{
      predicate: string;
      source_id: string;
      source_label: string;
      source_type: string;
    }>;
  };
}

/**
 * Response from entities with relationships query
 */
export interface EntitiesWithRelationshipsResponse {
  /** PI that was queried */
  pi: string;
  /** Entities with their relationships */
  entities: EntityWithRelationships[];
  /** Total count of entities */
  total_count: number;
}

/**
 * Response from path finding
 */
export interface PathsResponse {
  /** Found paths */
  paths: Path[];
  /** Whether results were truncated */
  truncated: boolean;
}

/**
 * Lineage PI entry
 */
export interface LineagePiEntry {
  /** PI ID */
  id: string;
  /** Number of hops from source */
  hops: number;
  /** When the PI was created */
  created_at?: string;
}

/**
 * Lineage result set (ancestors or descendants)
 */
export interface LineageResultSet {
  /** List of PIs */
  pis: LineagePiEntry[];
  /** Total count */
  count: number;
  /** Whether results were truncated */
  truncated: boolean;
}

/**
 * Response from lineage query
 */
export interface LineageResponse {
  /** Source PI */
  sourcePi: string;
  /** Ancestor PIs (if requested) */
  ancestors?: LineageResultSet;
  /** Descendant PIs (if requested) */
  descendants?: LineageResultSet;
}
