import {
  GraphError,
  GraphEntityNotFoundError,
  NetworkError,
} from './errors.js';
import type {
  GraphEntity,
  EntityWithRelationships,
  Relationship,
  Path,
  PathOptions,
  ReachableOptions,
  ListFromPiOptions,
  EntityQueryResponse,
  EntitiesWithRelationshipsResponse,
  PathsResponse,
  LineageResponse,
} from './types.js';

/**
 * Configuration for GraphClient
 */
export interface GraphClientConfig {
  /**
   * Gateway base URL (e.g., https://gateway.arke.institute).
   * The client will call /graphdb/* endpoints for GraphDB Gateway.
   */
  gatewayUrl: string;
  /**
   * Optional custom fetch implementation (useful for testing).
   */
  fetchImpl?: typeof fetch;
}

type JsonBody = Record<string, unknown>;

/**
 * Client for querying entity relationships from the Arke knowledge graph.
 *
 * All endpoints are public and do not require authentication.
 *
 * @example
 * ```typescript
 * const graph = new GraphClient({
 *   gatewayUrl: 'https://gateway.arke.institute',
 * });
 *
 * // Get entity by ID
 * const entity = await graph.getEntity('uuid-123');
 *
 * // Find entities by code
 * const results = await graph.queryByCode('person_john');
 *
 * // Get entities with relationships from a PI
 * const entities = await graph.getEntitiesWithRelationships('01K75HQQXNTDG7BBP7PS9AWYAN');
 *
 * // Find paths between entities
 * const paths = await graph.findPaths(['uuid-1'], ['uuid-2'], { max_depth: 4 });
 * ```
 */
export class GraphClient {
  private baseUrl: string;
  private fetchImpl: typeof fetch;

  constructor(config: GraphClientConfig) {
    this.baseUrl = config.gatewayUrl.replace(/\/$/, '');
    this.fetchImpl = config.fetchImpl ?? fetch;
  }

  // ---------------------------------------------------------------------------
  // Request helpers
  // ---------------------------------------------------------------------------

  private buildUrl(path: string, query?: Record<string, string | number | boolean | undefined>) {
    const url = new URL(`${this.baseUrl}${path}`);
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.set(key, String(value));
        }
      });
    }
    return url.toString();
  }

  private async request<T>(
    path: string,
    options: RequestInit & {
      query?: Record<string, string | number | boolean | undefined>;
    } = {}
  ): Promise<T> {
    const url = this.buildUrl(path, options.query);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    if (options.headers) {
      Object.entries(options.headers).forEach(([k, v]) => {
        if (v !== undefined) headers.set(k, v as string);
      });
    }

    let response: Response;
    try {
      response = await this.fetchImpl(url, { ...options, headers });
    } catch (err) {
      throw new NetworkError(
        err instanceof Error ? err.message : 'Network request failed'
      );
    }

    if (response.ok) {
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        return (await response.json()) as T;
      }
      return (await response.text()) as unknown as T;
    }

    let body: unknown;
    const text = await response.text();
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }

    // Handle 404 specifically
    if (response.status === 404) {
      throw new GraphError(
        (body as JsonBody)?.message as string || 'Not found',
        'NOT_FOUND',
        body
      );
    }

    const message =
      (body as JsonBody)?.error && typeof (body as JsonBody).error === 'string'
        ? ((body as JsonBody).error as string)
        : (body as JsonBody)?.message && typeof (body as JsonBody).message === 'string'
          ? ((body as JsonBody).message as string)
          : `Request failed with status ${response.status}`;

    throw new GraphError(message, 'HTTP_ERROR', {
      status: response.status,
      body,
    });
  }

  // ---------------------------------------------------------------------------
  // Entity Operations
  // ---------------------------------------------------------------------------

  /**
   * Get an entity by its canonical ID.
   *
   * @param canonicalId - Entity UUID
   * @returns Entity data
   * @throws GraphEntityNotFoundError if the entity doesn't exist
   *
   * @example
   * ```typescript
   * const entity = await graph.getEntity('uuid-123');
   * console.log('Entity:', entity.label, entity.type);
   * ```
   */
  async getEntity(canonicalId: string): Promise<GraphEntity> {
    const response = await this.request<{ found: boolean; entity?: GraphEntity }>(
      `/graphdb/entity/${encodeURIComponent(canonicalId)}`
    );

    if (!response.found || !response.entity) {
      throw new GraphEntityNotFoundError(canonicalId);
    }

    return response.entity;
  }

  /**
   * Check if an entity exists by its canonical ID.
   *
   * @param canonicalId - Entity UUID
   * @returns True if entity exists
   *
   * @example
   * ```typescript
   * if (await graph.entityExists('uuid-123')) {
   *   console.log('Entity exists');
   * }
   * ```
   */
  async entityExists(canonicalId: string): Promise<boolean> {
    const response = await this.request<{ exists: boolean }>(
      `/graphdb/entity/exists/${encodeURIComponent(canonicalId)}`
    );
    return response.exists;
  }

  /**
   * Query entities by code with optional type filter.
   *
   * @param code - Entity code to search for
   * @param type - Optional entity type filter
   * @returns Matching entities
   *
   * @example
   * ```typescript
   * // Find by code
   * const entities = await graph.queryByCode('person_john');
   *
   * // With type filter
   * const people = await graph.queryByCode('john', 'person');
   * ```
   */
  async queryByCode(code: string, type?: string): Promise<GraphEntity[]> {
    const response = await this.request<EntityQueryResponse>(
      '/graphdb/entity/query',
      {
        method: 'POST',
        body: JSON.stringify({ code, type }),
      }
    );

    if (!response.found || !response.entity) {
      return [];
    }

    return [response.entity];
  }

  /**
   * Look up entities by code across all PIs.
   *
   * @param code - Entity code to search for
   * @param type - Optional entity type filter
   * @returns Matching entities
   *
   * @example
   * ```typescript
   * const entities = await graph.lookupByCode('alice_austen', 'person');
   * ```
   */
  async lookupByCode(code: string, type?: string): Promise<GraphEntity[]> {
    const response = await this.request<{ entities: GraphEntity[] }>(
      '/graphdb/entities/lookup-by-code',
      {
        method: 'POST',
        body: JSON.stringify({ code, type }),
      }
    );
    return response.entities || [];
  }

  // ---------------------------------------------------------------------------
  // PI-based Operations
  // ---------------------------------------------------------------------------

  /**
   * List entities from a specific PI or multiple PIs.
   *
   * @param pi - Single PI or array of PIs
   * @param options - Filter options
   * @returns Entities from the PI(s)
   *
   * @example
   * ```typescript
   * // From single PI
   * const entities = await graph.listEntitiesFromPi('01K75HQQXNTDG7BBP7PS9AWYAN');
   *
   * // With type filter
   * const people = await graph.listEntitiesFromPi('01K75HQQXNTDG7BBP7PS9AWYAN', { type: 'person' });
   *
   * // From multiple PIs
   * const all = await graph.listEntitiesFromPi(['pi-1', 'pi-2']);
   * ```
   */
  async listEntitiesFromPi(
    pi: string | string[],
    options: ListFromPiOptions = {}
  ): Promise<GraphEntity[]> {
    const pis = Array.isArray(pi) ? pi : [pi];
    const response = await this.request<{ entities: GraphEntity[] }>(
      '/graphdb/entities/list',
      {
        method: 'POST',
        body: JSON.stringify({
          pis,
          type: options.type,
        }),
      }
    );
    return response.entities || [];
  }

  /**
   * Get entities with their relationships from a PI.
   *
   * This is an optimized query that returns entities along with all their
   * relationship data in a single request.
   *
   * @param pi - Persistent Identifier
   * @param type - Optional entity type filter
   * @returns Entities with relationships
   *
   * @example
   * ```typescript
   * const entities = await graph.getEntitiesWithRelationships('01K75HQQXNTDG7BBP7PS9AWYAN');
   * entities.forEach(e => {
   *   console.log(`${e.label} has ${e.relationships.length} relationships`);
   * });
   * ```
   */
  async getEntitiesWithRelationships(
    pi: string,
    type?: string
  ): Promise<EntityWithRelationships[]> {
    const response = await this.request<EntitiesWithRelationshipsResponse>(
      '/graphdb/pi/entities-with-relationships',
      {
        method: 'POST',
        body: JSON.stringify({ pi, type }),
      }
    );
    return response.entities || [];
  }

  /**
   * Get the lineage (ancestors and/or descendants) of a PI.
   *
   * @param pi - Source PI
   * @param direction - 'ancestors', 'descendants', or 'both'
   * @returns Lineage data
   *
   * @example
   * ```typescript
   * // Get ancestors
   * const lineage = await graph.getLineage('01K75HQQXNTDG7BBP7PS9AWYAN', 'ancestors');
   *
   * // Get both directions
   * const full = await graph.getLineage('01K75HQQXNTDG7BBP7PS9AWYAN', 'both');
   * ```
   */
  async getLineage(
    pi: string,
    direction: 'ancestors' | 'descendants' | 'both' = 'both',
    maxHops: number = 10
  ): Promise<LineageResponse> {
    return this.request<LineageResponse>('/graphdb/pi/lineage', {
      method: 'POST',
      body: JSON.stringify({ sourcePi: pi, direction, maxHops }),
    });
  }

  // ---------------------------------------------------------------------------
  // Relationship Operations
  // ---------------------------------------------------------------------------

  /**
   * Get all relationships for an entity.
   *
   * @param canonicalId - Entity UUID
   * @returns Array of relationships
   *
   * @example
   * ```typescript
   * const relationships = await graph.getRelationships('uuid-123');
   * relationships.forEach(r => {
   *   console.log(`${r.direction}: ${r.predicate} -> ${r.target_label}`);
   * });
   * ```
   */
  async getRelationships(canonicalId: string): Promise<Relationship[]> {
    const response = await this.request<{
      found: boolean;
      canonical_id?: string;
      relationships?: Array<{
        direction: 'outgoing' | 'incoming';
        predicate: string;
        target_id: string;
        target_code?: string;
        target_label: string;
        target_type: string;
        properties?: Record<string, unknown>;
        source_pi?: string;
        created_at?: string;
      }>;
    }>(`/graphdb/relationships/${encodeURIComponent(canonicalId)}`);

    if (!response.found || !response.relationships) {
      return [];
    }

    return response.relationships.map(rel => ({
      direction: rel.direction,
      predicate: rel.predicate,
      target_id: rel.target_id,
      target_code: rel.target_code || '',
      target_label: rel.target_label,
      target_type: rel.target_type,
      properties: rel.properties,
      source_pi: rel.source_pi,
      created_at: rel.created_at,
    }));
  }

  // ---------------------------------------------------------------------------
  // Path Finding
  // ---------------------------------------------------------------------------

  /**
   * Find shortest paths between sets of entities.
   *
   * @param sourceIds - Starting entity IDs
   * @param targetIds - Target entity IDs
   * @param options - Path finding options
   * @returns Found paths
   *
   * @example
   * ```typescript
   * const paths = await graph.findPaths(
   *   ['uuid-alice'],
   *   ['uuid-bob'],
   *   { max_depth: 4, direction: 'both' }
   * );
   *
   * paths.forEach(path => {
   *   console.log(`Path of length ${path.length}:`);
   *   path.edges.forEach(e => {
   *     console.log(`  ${e.subject_label} -[${e.predicate}]-> ${e.object_label}`);
   *   });
   * });
   * ```
   */
  async findPaths(
    sourceIds: string[],
    targetIds: string[],
    options: PathOptions = {}
  ): Promise<Path[]> {
    const response = await this.request<PathsResponse>('/graphdb/paths/between', {
      method: 'POST',
      body: JSON.stringify({
        source_ids: sourceIds,
        target_ids: targetIds,
        max_depth: options.max_depth,
        direction: options.direction,
        limit: options.limit,
      }),
    });
    return response.paths || [];
  }

  /**
   * Find entities of a specific type reachable from starting entities.
   *
   * @param startIds - Starting entity IDs
   * @param targetType - Type of entities to find
   * @param options - Search options
   * @returns Reachable entities of the specified type
   *
   * @example
   * ```typescript
   * // Find all people reachable from an event
   * const people = await graph.findReachable(
   *   ['uuid-event'],
   *   'person',
   *   { max_depth: 3 }
   * );
   * ```
   */
  async findReachable(
    startIds: string[],
    targetType: string,
    options: ReachableOptions = {}
  ): Promise<GraphEntity[]> {
    const response = await this.request<{ entities: GraphEntity[] }>(
      '/graphdb/paths/reachable',
      {
        method: 'POST',
        body: JSON.stringify({
          start_ids: startIds,
          target_type: targetType,
          max_depth: options.max_depth,
          direction: options.direction,
          limit: options.limit,
        }),
      }
    );
    return response.entities || [];
  }

  /**
   * Check the health of the graph service.
   *
   * @returns Health status
   */
  async health(): Promise<{ status: string; service: string; version: string }> {
    return this.request('/graphdb/health', { method: 'GET' });
  }
}
