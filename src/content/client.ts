import {
  ContentError,
  EntityNotFoundError,
  ContentNotFoundError,
  ComponentNotFoundError,
  NetworkError,
} from './errors.js';
import type {
  Entity,
  EntityVersion,
  ListOptions,
  ListResponse,
  VersionsOptions,
  VersionsResponse,
  ResolveResponse,
  RelationshipsComponent,
  PropertiesComponent,
  GetOptions,
  EntityWithMergeChain,
  MergeChainEntry,
} from './types.js';

/**
 * Configuration for ContentClient
 */
export interface ContentClientConfig {
  /**
   * Gateway base URL (e.g., https://gateway.arke.institute).
   * The client will call /api/* endpoints for IPFS Wrapper.
   */
  gatewayUrl: string;
  /**
   * Optional custom fetch implementation (useful for testing).
   */
  fetchImpl?: typeof fetch;
}

type JsonBody = Record<string, unknown>;

/**
 * Client for accessing entities and content from the Arke archive.
 *
 * All endpoints are public and do not require authentication.
 *
 * @example
 * ```typescript
 * const content = new ContentClient({
 *   gatewayUrl: 'https://gateway.arke.institute',
 * });
 *
 * // Get an entity
 * const entity = await content.get('01K75HQQXNTDG7BBP7PS9AWYAN');
 *
 * // Download content by CID
 * const blob = await content.download('bafybeihkoviema7g3gxyt6la7vd5ho32jywf7b4c4z3qtwcabpjqxwsumu');
 *
 * // Get component content
 * const pinax = await content.getComponent(entity, 'pinax');
 * ```
 */
export class ContentClient {
  private baseUrl: string;
  private fetchImpl: typeof fetch;

  constructor(config: ContentClientConfig) {
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
      const errorCode = (body as JsonBody)?.error;
      if (errorCode === 'NOT_FOUND' || errorCode === 'ENTITY_NOT_FOUND') {
        throw new ContentError(
          (body as JsonBody)?.message as string || 'Not found',
          'NOT_FOUND',
          body
        );
      }
    }

    const message =
      (body as JsonBody)?.error && typeof (body as JsonBody).error === 'string'
        ? ((body as JsonBody).error as string)
        : (body as JsonBody)?.message && typeof (body as JsonBody).message === 'string'
          ? ((body as JsonBody).message as string)
          : `Request failed with status ${response.status}`;

    throw new ContentError(message, 'HTTP_ERROR', {
      status: response.status,
      body,
    });
  }

  // ---------------------------------------------------------------------------
  // Entity Operations
  // ---------------------------------------------------------------------------

  /** Default maximum merge chain hops */
  private static readonly DEFAULT_MAX_MERGE_HOPS = 10;

  /**
   * Get an entity by its Persistent Identifier (PI).
   *
   * @param pi - Persistent Identifier (ULID or test PI with II prefix)
   * @returns Full entity manifest
   * @throws EntityNotFoundError if the entity doesn't exist
   *
   * @example
   * ```typescript
   * const entity = await content.get('01K75HQQXNTDG7BBP7PS9AWYAN');
   * console.log('Version:', entity.ver);
   * console.log('Components:', Object.keys(entity.components));
   * ```
   */
  async get(pi: string): Promise<Entity>;

  /**
   * Get an entity by its Persistent Identifier (PI), optionally following merge chains.
   *
   * When `followMerges: true`, if the entity has been merged into another,
   * the method will follow the chain and return the canonical entity along
   * with the merge chain that was traversed.
   *
   * @param pi - Persistent Identifier (ULID or test PI with II prefix)
   * @param options - Options including followMerges and maxMergeHops
   * @returns Entity with merge chain info when followMerges is true
   * @throws EntityNotFoundError if the entity doesn't exist
   * @throws ContentError if merge chain exceeds maxMergeHops
   *
   * @example
   * ```typescript
   * // Follow merge chain to get canonical entity
   * const result = await content.get('01K75HQQXNTDG7BBP7PS9AWYAN', { followMerges: true });
   * console.log('Canonical entity:', result.entity.id);
   * if (result.mergeChain.length > 0) {
   *   console.log('Original was merged, chain:', result.mergeChain);
   * }
   * ```
   */
  async get(pi: string, options: GetOptions & { followMerges: true }): Promise<EntityWithMergeChain>;

  /**
   * Get an entity by its Persistent Identifier (PI), with optional merge chain following.
   */
  async get(pi: string, options?: GetOptions): Promise<Entity | EntityWithMergeChain>;

  async get(pi: string, options?: GetOptions): Promise<Entity | EntityWithMergeChain> {
    if (options?.followMerges) {
      return this.getWithMergeChain(pi, options.maxMergeHops);
    }

    try {
      return await this.request<Entity>(`/api/entities/${encodeURIComponent(pi)}`);
    } catch (err) {
      if (err instanceof ContentError && err.code === 'NOT_FOUND') {
        throw new EntityNotFoundError(pi);
      }
      throw err;
    }
  }

  /**
   * Internal method to fetch an entity following merge chains.
   */
  private async getWithMergeChain(
    pi: string,
    maxHops: number = ContentClient.DEFAULT_MAX_MERGE_HOPS
  ): Promise<EntityWithMergeChain> {
    const mergeChain: MergeChainEntry[] = [];
    let currentId = pi;

    for (let hop = 0; hop < maxHops; hop++) {
      let entity: Entity;
      try {
        entity = await this.request<Entity>(`/api/entities/${encodeURIComponent(currentId)}`);
      } catch (err) {
        if (err instanceof ContentError && err.code === 'NOT_FOUND') {
          throw new EntityNotFoundError(currentId);
        }
        throw err;
      }

      // Check if this entity is merged into another
      if (entity.merged && entity.merged_into) {
        mergeChain.push({
          id: currentId,
          merged_into: entity.merged_into,
          merged_at: entity.merged_at,
          note: entity.note,
        });
        currentId = entity.merged_into;
        continue;
      }

      // Not merged - this is the final entity
      return {
        entity,
        mergeChain,
        originalId: pi,
      };
    }

    // Exceeded max hops
    throw new ContentError(
      `Merge chain exceeded ${maxHops} hops`,
      'MERGE_CHAIN_TOO_LONG',
      { originalId: pi, hops: maxHops, chain: mergeChain }
    );
  }

  /**
   * List entities with pagination.
   *
   * @param options - Pagination and metadata options
   * @returns Paginated list of entity summaries
   *
   * @example
   * ```typescript
   * // Get first page
   * const page1 = await content.list({ limit: 20, include_metadata: true });
   *
   * // Get next page
   * if (page1.next_cursor) {
   *   const page2 = await content.list({ cursor: page1.next_cursor });
   * }
   * ```
   */
  async list(options: ListOptions = {}): Promise<ListResponse> {
    return this.request<ListResponse>('/api/entities', {
      query: {
        limit: options.limit,
        cursor: options.cursor,
        include_metadata: options.include_metadata,
      },
    });
  }

  /**
   * Get version history for an entity.
   *
   * @param pi - Persistent Identifier
   * @param options - Pagination options
   * @returns Version history (newest first)
   *
   * @example
   * ```typescript
   * const history = await content.versions('01K75HQQXNTDG7BBP7PS9AWYAN');
   * console.log('Total versions:', history.items.length);
   * history.items.forEach(v => {
   *   console.log(`v${v.ver}: ${v.ts} - ${v.note || 'no note'}`);
   * });
   * ```
   */
  async versions(pi: string, options: VersionsOptions = {}): Promise<VersionsResponse> {
    try {
      return await this.request<VersionsResponse>(
        `/api/entities/${encodeURIComponent(pi)}/versions`,
        {
          query: {
            limit: options.limit,
            cursor: options.cursor,
          },
        }
      );
    } catch (err) {
      if (err instanceof ContentError && err.code === 'NOT_FOUND') {
        throw new EntityNotFoundError(pi);
      }
      throw err;
    }
  }

  /**
   * Get a specific version of an entity.
   *
   * @param pi - Persistent Identifier
   * @param selector - Version selector: 'ver:N' for version number or 'cid:...' for CID
   * @returns Entity manifest for the specified version
   *
   * @example
   * ```typescript
   * // Get version 2
   * const v2 = await content.getVersion('01K75HQQXNTDG7BBP7PS9AWYAN', 'ver:2');
   *
   * // Get by CID
   * const vByCid = await content.getVersion('01K75HQQXNTDG7BBP7PS9AWYAN', 'cid:bafybeih...');
   * ```
   */
  async getVersion(pi: string, selector: string): Promise<Entity> {
    try {
      return await this.request<Entity>(
        `/api/entities/${encodeURIComponent(pi)}/versions/${encodeURIComponent(selector)}`
      );
    } catch (err) {
      if (err instanceof ContentError && err.code === 'NOT_FOUND') {
        throw new EntityNotFoundError(pi);
      }
      throw err;
    }
  }

  /**
   * Resolve a PI to its tip CID (fast lookup without fetching manifest).
   *
   * @param pi - Persistent Identifier
   * @returns PI and tip CID
   *
   * @example
   * ```typescript
   * const { tip } = await content.resolve('01K75HQQXNTDG7BBP7PS9AWYAN');
   * console.log('Latest manifest CID:', tip);
   * ```
   */
  async resolve(pi: string): Promise<ResolveResponse> {
    try {
      return await this.request<ResolveResponse>(`/api/resolve/${encodeURIComponent(pi)}`);
    } catch (err) {
      if (err instanceof ContentError && err.code === 'NOT_FOUND') {
        throw new EntityNotFoundError(pi);
      }
      throw err;
    }
  }

  /**
   * Get the list of child PIs for an entity (fast, returns only PIs).
   *
   * @param pi - Persistent Identifier of parent entity
   * @returns Array of child PIs
   *
   * @example
   * ```typescript
   * const childPis = await content.children('01K75HQQXNTDG7BBP7PS9AWYAN');
   * console.log('Children:', childPis);
   * ```
   */
  async children(pi: string): Promise<string[]> {
    const entity = await this.get(pi);
    return entity.children_pi || [];
  }

  /**
   * Get all child entities for a parent (fetches full entity for each child).
   *
   * @param pi - Persistent Identifier of parent entity
   * @returns Array of child entities
   *
   * @example
   * ```typescript
   * const childEntities = await content.childrenEntities('01K75HQQXNTDG7BBP7PS9AWYAN');
   * childEntities.forEach(child => {
   *   console.log(`${child.pi}: v${child.ver}`);
   * });
   * ```
   */
  async childrenEntities(pi: string): Promise<Entity[]> {
    const childPis = await this.children(pi);
    if (childPis.length === 0) {
      return [];
    }

    // Fetch all children in parallel
    const results = await Promise.allSettled(
      childPis.map(childPi => this.get(childPi))
    );

    // Return only successful fetches
    return results
      .filter((r): r is PromiseFulfilledResult<Entity> => r.status === 'fulfilled')
      .map(r => r.value);
  }

  /**
   * Get the Arke origin block (root of the archive tree).
   *
   * @returns Arke origin entity
   *
   * @example
   * ```typescript
   * const origin = await content.arke();
   * console.log('Arke origin:', origin.pi);
   * ```
   */
  async arke(): Promise<Entity> {
    return this.request<Entity>('/api/arke');
  }

  // ---------------------------------------------------------------------------
  // Content Download
  // ---------------------------------------------------------------------------

  /**
   * Download content by CID.
   *
   * Returns Blob in browser environments, Buffer in Node.js.
   *
   * @param cid - Content Identifier
   * @returns Content as Blob (browser) or Buffer (Node)
   * @throws ContentNotFoundError if the content doesn't exist
   *
   * @example
   * ```typescript
   * const content = await client.download('bafybeih...');
   *
   * // In browser
   * const url = URL.createObjectURL(content as Blob);
   *
   * // In Node.js
   * fs.writeFileSync('output.bin', content as Buffer);
   * ```
   */
  async download(cid: string): Promise<Blob | Buffer> {
    const url = this.buildUrl(`/api/cat/${encodeURIComponent(cid)}`);

    let response: Response;
    try {
      response = await this.fetchImpl(url);
    } catch (err) {
      throw new NetworkError(
        err instanceof Error ? err.message : 'Network request failed'
      );
    }

    if (!response.ok) {
      if (response.status === 404) {
        throw new ContentNotFoundError(cid);
      }
      throw new ContentError(
        `Failed to download content: ${response.status}`,
        'DOWNLOAD_ERROR',
        { status: response.status }
      );
    }

    // Platform-aware response handling
    if (typeof window !== 'undefined') {
      // Browser environment
      return response.blob();
    } else {
      // Node.js environment
      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
    }
  }

  /**
   * Get a direct URL for content by CID.
   *
   * This is useful for embedding in img tags or for direct downloads.
   *
   * @param cid - Content Identifier
   * @returns URL string
   *
   * @example
   * ```typescript
   * const url = content.getUrl('bafybeih...');
   * // Use in img tag: <img src={url} />
   * ```
   */
  getUrl(cid: string): string {
    return `${this.baseUrl}/api/cat/${encodeURIComponent(cid)}`;
  }

  /**
   * Stream content by CID.
   *
   * @param cid - Content Identifier
   * @returns ReadableStream of the content
   * @throws ContentNotFoundError if the content doesn't exist
   *
   * @example
   * ```typescript
   * const stream = await content.stream('bafybeih...');
   * const reader = stream.getReader();
   * while (true) {
   *   const { done, value } = await reader.read();
   *   if (done) break;
   *   // Process chunk
   * }
   * ```
   */
  async stream(cid: string): Promise<ReadableStream<Uint8Array>> {
    const url = this.buildUrl(`/api/cat/${encodeURIComponent(cid)}`);

    let response: Response;
    try {
      response = await this.fetchImpl(url);
    } catch (err) {
      throw new NetworkError(
        err instanceof Error ? err.message : 'Network request failed'
      );
    }

    if (!response.ok) {
      if (response.status === 404) {
        throw new ContentNotFoundError(cid);
      }
      throw new ContentError(
        `Failed to stream content: ${response.status}`,
        'STREAM_ERROR',
        { status: response.status }
      );
    }

    if (!response.body) {
      throw new ContentError('Response body is not available', 'STREAM_ERROR');
    }

    return response.body;
  }

  /**
   * Download a DAG node (JSON) by CID.
   *
   * Use this to fetch JSON components like properties and relationships.
   *
   * @param cid - Content Identifier of the DAG node
   * @returns Parsed JSON object
   * @throws ContentNotFoundError if the content doesn't exist
   *
   * @example
   * ```typescript
   * const relationships = await content.getDag<RelationshipsComponent>(
   *   entity.components.relationships
   * );
   * console.log('Relationships:', relationships.relationships);
   * ```
   */
  async getDag<T = unknown>(cid: string): Promise<T> {
    const url = this.buildUrl(`/api/dag/${encodeURIComponent(cid)}`);

    let response: Response;
    try {
      response = await this.fetchImpl(url);
    } catch (err) {
      throw new NetworkError(
        err instanceof Error ? err.message : 'Network request failed'
      );
    }

    if (!response.ok) {
      if (response.status === 404) {
        throw new ContentNotFoundError(cid);
      }
      throw new ContentError(
        `Failed to fetch DAG node: ${response.status}`,
        'DAG_ERROR',
        { status: response.status }
      );
    }

    return (await response.json()) as T;
  }

  // ---------------------------------------------------------------------------
  // Component Helpers
  // ---------------------------------------------------------------------------

  /**
   * Download a component from an entity.
   *
   * @param entity - Entity containing the component
   * @param componentName - Name of the component (e.g., 'pinax', 'description', 'source')
   * @returns Component content as Blob (browser) or Buffer (Node)
   * @throws ComponentNotFoundError if the component doesn't exist
   *
   * @example
   * ```typescript
   * const entity = await content.get('01K75HQQXNTDG7BBP7PS9AWYAN');
   * const pinax = await content.getComponent(entity, 'pinax');
   * ```
   */
  async getComponent(entity: Entity, componentName: string): Promise<Blob | Buffer> {
    const cid = entity.components[componentName];
    if (!cid) {
      throw new ComponentNotFoundError(entity.id, componentName);
    }
    return this.download(cid);
  }

  /**
   * Get the URL for a component from an entity.
   *
   * @param entity - Entity containing the component
   * @param componentName - Name of the component
   * @returns URL string
   * @throws ComponentNotFoundError if the component doesn't exist
   *
   * @example
   * ```typescript
   * const entity = await content.get('01K75HQQXNTDG7BBP7PS9AWYAN');
   * const imageUrl = content.getComponentUrl(entity, 'source');
   * // Use in img tag: <img src={imageUrl} />
   * ```
   */
  getComponentUrl(entity: Entity, componentName: string): string {
    const cid = entity.components[componentName];
    if (!cid) {
      throw new ComponentNotFoundError(entity.id, componentName);
    }
    return this.getUrl(cid);
  }

  /**
   * Get the properties component for an entity.
   *
   * @param entity - Entity containing the properties component
   * @returns Properties object, or null if no properties component exists
   *
   * @example
   * ```typescript
   * const entity = await content.get('01K75HQQXNTDG7BBP7PS9AWYAN');
   * const props = await content.getProperties(entity);
   * if (props) {
   *   console.log('Title:', props.title);
   * }
   * ```
   */
  async getProperties(entity: Entity): Promise<PropertiesComponent | null> {
    const cid = entity.components.properties;
    if (!cid) {
      return null;
    }
    return this.getDag<PropertiesComponent>(cid);
  }

  /**
   * Get the relationships component for an entity.
   *
   * @param entity - Entity containing the relationships component
   * @returns Relationships component, or null if no relationships exist
   *
   * @example
   * ```typescript
   * const entity = await content.get('01K75HQQXNTDG7BBP7PS9AWYAN');
   * const rels = await content.getRelationships(entity);
   * if (rels) {
   *   rels.relationships.forEach(r => {
   *     console.log(`${r.predicate} -> ${r.target_label}`);
   *   });
   * }
   * ```
   */
  async getRelationships(entity: Entity): Promise<RelationshipsComponent | null> {
    const cid = entity.components.relationships;
    if (!cid) {
      return null;
    }
    return this.getDag<RelationshipsComponent>(cid);
  }
}
