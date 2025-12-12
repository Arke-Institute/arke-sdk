/**
 * Query package types for the Arke SDK
 */

// ---------------------------------------------------------------------------
// Request types
// ---------------------------------------------------------------------------

/**
 * Lineage filter to scope queries to a PI hierarchy
 */
export interface LineageFilter {
  /** The PI to start lineage resolution from */
  sourcePi: string;
  /** Direction to resolve the lineage */
  direction: 'ancestors' | 'descendants' | 'both';
}

/**
 * Options for path query execution
 */
export interface PathQueryOptions {
  /** Number of final results to return (default: 5) */
  k?: number;
  /** Beam width for exploration (default: k * 3) */
  k_explore?: number;
  /** Scope query to PI hierarchy */
  lineage?: LineageFilter;
  /** Fetch content for PI and File entities (default: false) */
  enrich?: boolean;
  /** Max characters per enriched entity (default: 2000) */
  enrich_limit?: number;
}

/**
 * Options for natural language query
 */
export interface NaturalQueryOptions extends PathQueryOptions {
  /** Additional instructions for the LLM translator */
  custom_instructions?: string;
}

// ---------------------------------------------------------------------------
// Response types
// ---------------------------------------------------------------------------

/**
 * Enriched content from File or PI entities
 */
export interface EnrichedContent {
  text?: string;
  data?: unknown;
  format?: string;
  truncated?: boolean;
}

/**
 * Entity returned in query results
 */
export interface Entity {
  canonical_id: string;
  code?: string;
  label: string;
  type: string;
  properties: Record<string, unknown>;
  created_by_pi?: string;
  source_pis: string[];
  content?: EnrichedContent;
}

/**
 * A step in the traversal path
 */
export interface PathStep {
  /** Entity canonical_id (for entity steps) */
  entity?: string;
  /** Human-readable label */
  label?: string;
  /** Entity type */
  type?: string;
  /** Edge predicate (for edge steps) */
  edge?: string;
  /** Edge direction */
  direction?: 'outgoing' | 'incoming';
  /** Score for this step */
  score?: number;
}

/**
 * A single result with entity, path, and score
 */
export interface QueryResultItem {
  entity: Entity;
  path: PathStep[];
  score: number;
}

/**
 * Metadata about lineage filtering
 */
export interface LineageMetadata {
  sourcePi: string;
  direction: 'ancestors' | 'descendants' | 'both';
  piCount: number;
  truncated: boolean;
}

/**
 * Metadata about query execution
 */
export interface QueryMetadata {
  /** The executed path query */
  query: string;
  /** Number of hops in the query */
  hops: number;
  /** Results requested */
  k: number;
  /** Beam width used */
  k_explore: number;
  /** Total candidates explored */
  total_candidates_explored: number;
  /** Execution time in milliseconds */
  execution_time_ms: number;
  /** Error code if query failed */
  error?: string;
  /** Error reason if query failed */
  reason?: string;
  /** Lineage filter metadata */
  lineage?: LineageMetadata;
  /** Partial path if traversal stopped early */
  partial_path?: PathStep[];
  /** Hop number where traversal stopped */
  stopped_at_hop?: number;
}

/**
 * Result from a path query
 */
export interface QueryResult {
  results: QueryResultItem[];
  metadata: QueryMetadata;
}

/**
 * Translation details from NL query
 */
export interface TranslationInfo {
  /** Generated path query */
  path: string;
  /** Explanation of what the query does */
  explanation: string;
  /** LLM tokens used */
  tokens_used: number;
  /** Estimated cost in USD */
  cost_usd: number;
  /** Number of translation attempts */
  attempts?: number;
  /** Validation errors encountered */
  validation_errors?: Array<{ path: string; error: string; position?: number }>;
}

/**
 * Result from a natural language query (includes translation info)
 */
export interface NaturalQueryResult extends QueryResult {
  translation: TranslationInfo;
}

/**
 * Result from translate-only endpoint
 */
export interface TranslateResult {
  /** Generated path query */
  path: string;
  /** Explanation of what the query does */
  explanation: string;
  /** LLM tokens used */
  tokens_used: number;
  /** Estimated cost in USD */
  cost_usd: number;
}

/**
 * AST node types
 */
export type ASTNodeType =
  | 'semantic_search'
  | 'exact_entity'
  | 'type_filter'
  | 'combined_filter';

/**
 * Entry point AST node
 */
export interface EntryAST {
  type: ASTNodeType;
  text?: string;
  id?: string;
  values?: string[];
  semantic?: { text: string };
}

/**
 * Filter AST node
 */
export interface FilterAST {
  type: ASTNodeType;
  text?: string;
  id?: string;
  values?: string[];
  semantic?: { text: string };
}

/**
 * Hop AST node
 */
export interface HopAST {
  edge: {
    direction: 'outgoing' | 'incoming' | 'bidirectional';
    relation: { type: 'wildcard' } | { type: 'terms'; terms: string[] };
    depth?: { min: number; max: number };
  };
  filter: FilterAST;
}

/**
 * Parsed path query AST
 */
export interface PathAST {
  entry: EntryAST;
  entry_filter?: FilterAST;
  hops: HopAST[];
}

/**
 * Result from parse endpoint
 */
export interface ParseResult {
  ast: PathAST;
}

/**
 * Parse error response
 */
export interface ParseError {
  error: string;
  message: string;
  position?: number;
}

// ---------------------------------------------------------------------------
// Syntax documentation types
// ---------------------------------------------------------------------------

/**
 * Entry point type documentation
 */
export interface EntryPointDoc {
  syntax: string;
  name: string;
  description: string;
  example: string;
  supportsHops: boolean;
}

/**
 * Edge type documentation
 */
export interface EdgeTypeDoc {
  syntax: string;
  description: string;
}

/**
 * Variable depth syntax documentation
 */
export interface VariableDepthDoc {
  pattern: string;
  description: string;
}

/**
 * Filter type documentation
 */
export interface FilterTypeDoc {
  syntax: string;
  description: string;
  example?: string;
}

/**
 * Parameter documentation
 */
export interface ParameterDoc {
  name: string;
  type: string;
  required?: boolean;
  default?: unknown;
  description: string;
  enum?: string[];
}

/**
 * Example query documentation
 */
export interface ExampleDoc {
  description: string;
  query: string;
}

/**
 * Full syntax documentation returned by /query/syntax
 */
export interface SyntaxDocumentation {
  version: string;
  description: string;
  entryPoints: {
    description: string;
    types: EntryPointDoc[];
  };
  edgeTraversal: {
    description: string;
    types: EdgeTypeDoc[];
    variableDepth: {
      description: string;
      syntax: VariableDepthDoc[];
    };
  };
  filters: {
    description: string;
    types: FilterTypeDoc[];
  };
  entityTypes: string[];
  parameters: {
    description: string;
    fields: ParameterDoc[];
    lineage: {
      description: string;
      fields: ParameterDoc[];
    };
  };
  examples: ExampleDoc[];
  constraints: string[];
  errors: Record<string, string>;
}
