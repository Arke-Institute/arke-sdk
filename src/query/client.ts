import { QueryError } from './errors';
import type {
  PathQueryOptions,
  NaturalQueryOptions,
  QueryResult,
  NaturalQueryResult,
  TranslateResult,
  ParseResult,
  ParseError,
  SyntaxDocumentation,
  SemanticSearchOptions,
  SemanticSearchResponse,
  CollectionSearchOptions,
  CollectionSearchResponse,
} from './types';

/**
 * Configuration for QueryClient
 */
export interface QueryClientConfig {
  /**
   * Gateway base URL (e.g., https://gateway.arke.institute).
   * The client will call /query/* endpoints.
   */
  gatewayUrl: string;
  /**
   * Optional custom fetch implementation (useful for testing).
   */
  fetchImpl?: typeof fetch;
}

type JsonBody = Record<string, unknown>;

/**
 * Client for querying the Arke knowledge graph.
 *
 * All query endpoints are public and do not require authentication.
 *
 * @example
 * ```typescript
 * const query = new QueryClient({
 *   gatewayUrl: 'https://gateway.arke.institute',
 * });
 *
 * // Direct path query
 * const results = await query.path('"alice austen" -[*]{,4}-> type:person');
 *
 * // Natural language query
 * const nlResults = await query.natural('Find photographers connected to Alice Austen');
 *
 * // Get syntax documentation
 * const syntax = await query.syntax();
 * ```
 */
export class QueryClient {
  private baseUrl: string;
  private fetchImpl: typeof fetch;

  constructor(config: QueryClientConfig) {
    this.baseUrl = config.gatewayUrl.replace(/\/$/, '');
    this.fetchImpl = config.fetchImpl ?? fetch;
  }

  // ---------------------------------------------------------------------------
  // Request helpers
  // ---------------------------------------------------------------------------

  private buildUrl(path: string, query?: Record<string, string | undefined>) {
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
      query?: Record<string, string | undefined>;
    } = {}
  ): Promise<T> {
    const url = this.buildUrl(path, options.query);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    if (options.headers) {
      Object.entries(options.headers).forEach(([k, v]) => {
        if (v !== undefined) headers.set(k, v as string);
      });
    }

    const response = await this.fetchImpl(url, { ...options, headers });

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

    const message =
      (body as JsonBody)?.error && typeof (body as JsonBody).error === 'string'
        ? ((body as JsonBody).error as string)
        : (body as JsonBody)?.message && typeof (body as JsonBody).message === 'string'
          ? ((body as JsonBody).message as string)
          : `Request failed with status ${response.status}`;

    throw new QueryError(message, 'HTTP_ERROR', {
      status: response.status,
      body,
    });
  }

  // ---------------------------------------------------------------------------
  // Query methods
  // ---------------------------------------------------------------------------

  /**
   * Execute a path query against the knowledge graph.
   *
   * @param pathQuery - The path query string (e.g., '"alice austen" -[*]{,4}-> type:person')
   * @param options - Query options (k, k_explore, lineage, enrich, etc.)
   * @returns Query results with entities, paths, and metadata
   *
   * @example
   * ```typescript
   * // Simple semantic search
   * const results = await query.path('"Washington" type:person');
   *
   * // Multi-hop traversal
   * const results = await query.path('"alice austen" -[*]{,4}-> type:person ~ "photographer"');
   *
   * // With lineage filtering (collection scope)
   * const results = await query.path('"letters" type:document', {
   *   lineage: { sourcePi: 'arke:my_collection', direction: 'descendants' },
   *   k: 10,
   * });
   * ```
   */
  async path(pathQuery: string, options: PathQueryOptions = {}): Promise<QueryResult> {
    return this.request<QueryResult>('/query/path', {
      method: 'POST',
      body: JSON.stringify({
        path: pathQuery,
        ...options,
      }),
    });
  }

  /**
   * Execute a natural language query.
   *
   * The query is translated to a path query using an LLM, then executed.
   *
   * @param question - Natural language question
   * @param options - Query options including custom_instructions for the LLM
   * @returns Query results with translation info
   *
   * @example
   * ```typescript
   * const results = await query.natural('Find photographers connected to Alice Austen');
   * console.log('Generated query:', results.translation.path);
   * console.log('Explanation:', results.translation.explanation);
   * ```
   */
  async natural(question: string, options: NaturalQueryOptions = {}): Promise<NaturalQueryResult> {
    const { custom_instructions, ...queryOptions } = options;
    return this.request<NaturalQueryResult>('/query/natural', {
      method: 'POST',
      body: JSON.stringify({
        query: question,
        custom_instructions,
        ...queryOptions,
      }),
    });
  }

  /**
   * Translate a natural language question to a path query without executing it.
   *
   * Useful for understanding how questions are translated or for manual execution later.
   *
   * @param question - Natural language question
   * @param customInstructions - Optional additional instructions for the LLM
   * @returns Translation result with path query and explanation
   *
   * @example
   * ```typescript
   * const result = await query.translate('Who wrote letters from Philadelphia?');
   * console.log('Path query:', result.path);
   * // '"letters" <-[authored, wrote]- type:person -[located]-> "Philadelphia"'
   * ```
   */
  async translate(question: string, customInstructions?: string): Promise<TranslateResult> {
    return this.request<TranslateResult>('/query/translate', {
      method: 'POST',
      body: JSON.stringify({
        query: question,
        custom_instructions: customInstructions,
      }),
    });
  }

  /**
   * Parse and validate a path query without executing it.
   *
   * Returns the AST (Abstract Syntax Tree) if valid, or throws an error.
   *
   * @param pathQuery - The path query to parse
   * @returns Parsed AST
   * @throws QueryError if the query has syntax errors
   *
   * @example
   * ```typescript
   * try {
   *   const result = await query.parse('"test" -[*]-> type:person');
   *   console.log('Valid query, AST:', result.ast);
   * } catch (err) {
   *   console.error('Invalid query:', err.message);
   * }
   * ```
   */
  async parse(pathQuery: string): Promise<ParseResult> {
    const url = this.buildUrl('/query/parse', { path: pathQuery });
    const response = await this.fetchImpl(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const body = await response.json() as ParseResult | ParseError;

    // Check if it's an error response (parse errors return 400)
    if ('error' in body && body.error === 'Parse error') {
      throw new QueryError(
        (body as ParseError).message,
        'PARSE_ERROR',
        { position: (body as ParseError).position }
      );
    }

    if (!response.ok) {
      throw new QueryError(
        (body as any).error || `Request failed with status ${response.status}`,
        'HTTP_ERROR',
        { status: response.status, body }
      );
    }

    return body as ParseResult;
  }

  /**
   * Get the path query syntax documentation.
   *
   * Returns comprehensive documentation including entry points, edge traversal,
   * filters, examples, and constraints.
   *
   * @returns Syntax documentation
   *
   * @example
   * ```typescript
   * const syntax = await query.syntax();
   *
   * // List all entry point types
   * syntax.entryPoints.types.forEach(ep => {
   *   console.log(`${ep.syntax} - ${ep.description}`);
   * });
   *
   * // Show examples
   * syntax.examples.forEach(ex => {
   *   console.log(`${ex.description}: ${ex.query}`);
   * });
   * ```
   */
  async syntax(): Promise<SyntaxDocumentation> {
    return this.request<SyntaxDocumentation>('/query/syntax', {
      method: 'GET',
    });
  }

  /**
   * Check the health of the query service.
   *
   * @returns Health status
   */
  async health(): Promise<{ status: string; service: string; version: string }> {
    return this.request('/query/health', { method: 'GET' });
  }

  /**
   * Direct semantic search against the vector index.
   *
   * This bypasses the path query syntax and directly queries Pinecone for
   * semantically similar entities. Useful for:
   * - Simple semantic searches without graph traversal
   * - Scoped searches filtered by source_pi (collection scope)
   * - Type-filtered semantic searches
   *
   * For graph traversal and path-based queries, use `path()` instead.
   *
   * @param text - Search query text
   * @param options - Search options (namespace, filters, top_k)
   * @returns Matching entities with similarity scores
   *
   * @example
   * ```typescript
   * // Simple semantic search
   * const results = await query.semanticSearch('photographers from New York');
   *
   * // Scoped to a specific PI (collection)
   * const scoped = await query.semanticSearch('portraits', {
   *   filter: { source_pi: '01K75HQQXNTDG7BBP7PS9AWYAN' },
   *   top_k: 20,
   * });
   *
   * // Filter by type
   * const people = await query.semanticSearch('artists', {
   *   filter: { type: 'person' },
   * });
   *
   * // Search across merged entities from multiple source PIs
   * const merged = await query.semanticSearch('historical documents', {
   *   filter: { merged_entities_source_pis: ['pi-1', 'pi-2'] },
   * });
   * ```
   */
  async semanticSearch(
    text: string,
    options: SemanticSearchOptions = {}
  ): Promise<SemanticSearchResponse> {
    // Build Pinecone-compatible filter from our typed filter
    let pineconeFilter: Record<string, unknown> | undefined;

    if (options.filter) {
      pineconeFilter = {};

      if (options.filter.type) {
        const types = Array.isArray(options.filter.type)
          ? options.filter.type
          : [options.filter.type];
        pineconeFilter.type = types.length === 1
          ? { $eq: types[0] }
          : { $in: types };
      }

      if (options.filter.source_pi) {
        const pis = Array.isArray(options.filter.source_pi)
          ? options.filter.source_pi
          : [options.filter.source_pi];
        pineconeFilter.source_pi = pis.length === 1
          ? { $eq: pis[0] }
          : { $in: pis };
      }

      if (options.filter.merged_entities_source_pis) {
        const pis = Array.isArray(options.filter.merged_entities_source_pis)
          ? options.filter.merged_entities_source_pis
          : [options.filter.merged_entities_source_pis];
        // Use $in for array field matching (any of the provided PIs)
        pineconeFilter.merged_entities_source_pis = { $in: pis };
      }

      // If no filters were actually set, clear the object
      if (Object.keys(pineconeFilter).length === 0) {
        pineconeFilter = undefined;
      }
    }

    return this.request<SemanticSearchResponse>('/query/search/semantic', {
      method: 'POST',
      body: JSON.stringify({
        text,
        namespace: options.namespace,
        filter: pineconeFilter,
        top_k: options.top_k,
      }),
    });
  }

  /**
   * Search for collections by semantic similarity.
   *
   * Searches the dedicated collections index for fast semantic matching.
   *
   * @param query - Search query text
   * @param options - Search options (limit, visibility filter)
   * @returns Matching collections with similarity scores
   *
   * @example
   * ```typescript
   * // Search for photography-related collections
   * const results = await query.searchCollections('photography');
   * console.log(results.collections[0].title);
   *
   * // Search only public collections
   * const publicResults = await query.searchCollections('history', {
   *   visibility: 'public',
   *   limit: 20,
   * });
   * ```
   */
  async searchCollections(
    query: string,
    options: CollectionSearchOptions = {}
  ): Promise<CollectionSearchResponse> {
    return this.request<CollectionSearchResponse>('/query/search/collections', {
      method: 'GET',
      query: {
        q: query,
        limit: options.limit?.toString(),
        visibility: options.visibility,
      },
    });
  }
}
