/**
 * Main Arke SDK Client
 *
 * Provides type-safe access to the Arke API using openapi-fetch.
 */

import createClient, { type Client } from 'openapi-fetch';
import type { paths, components } from '../generated/types.js';
import { ArkeClientConfig, DEFAULT_CONFIG } from './config.js';
import { createRetryFetch } from './retry.js';

export type ArkeApiClient = Client<paths>;

/**
 * Check if a token is an API key (starts with 'ak_' or 'uk_')
 */
export function isApiKey(token: string): boolean {
  return token.startsWith('ak_') || token.startsWith('uk_');
}

/**
 * Get the appropriate Authorization header value for a token
 * - API keys (ak_*, uk_*) use: ApiKey {token}
 * - JWT tokens use: Bearer {token}
 */
export function getAuthorizationHeader(token: string): string {
  if (isApiKey(token)) {
    return `ApiKey ${token}`;
  }
  return `Bearer ${token}`;
}

/**
 * Type-safe client for the Arke API
 *
 * @example
 * ```typescript
 * // With JWT token
 * const arke = new ArkeClient({ authToken: 'your-jwt-token' });
 *
 * // With API key (agent or user)
 * const arke = new ArkeClient({ authToken: 'ak_your-agent-api-key' });
 * const arke = new ArkeClient({ authToken: 'uk_your-user-api-key' });
 *
 * // Create an entity
 * const { data, error } = await arke.api.POST('/entities', {
 *   body: {
 *     collection_id: '01ABC...',
 *     type: 'document',
 *     properties: { title: 'My Document' }
 *   }
 * });
 *
 * // Get an entity
 * const { data } = await arke.api.GET('/entities/{id}', {
 *   params: { path: { id: '01XYZ...' } }
 * });
 * ```
 */
export class ArkeClient {
  /**
   * The underlying openapi-fetch client with full type safety
   * Use this for all API calls: arke.api.GET, arke.api.POST, etc.
   */
  public api: ArkeApiClient;

  private config: ArkeClientConfig;

  constructor(config: ArkeClientConfig = {}) {
    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
    };

    this.api = this.createClient();
  }

  private createClient(): ArkeApiClient {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...this.config.headers,
    };

    if (this.config.authToken) {
      headers['Authorization'] = getAuthorizationHeader(this.config.authToken);
    }

    if (this.config.network === 'test') {
      headers['X-Arke-Network'] = 'test';
    }

    // Create retry-enabled fetch if retry config is not explicitly disabled
    const customFetch =
      this.config.retry === false
        ? undefined
        : createRetryFetch(this.config.retry ?? {});

    return createClient<paths>({
      baseUrl: this.config.baseUrl ?? DEFAULT_CONFIG.baseUrl,
      headers,
      ...(customFetch && { fetch: customFetch }),
    });
  }

  /**
   * Update the authentication token
   * Recreates the underlying client with new headers
   */
  setAuthToken(token: string): void {
    this.config.authToken = token;
    this.api = this.createClient();
  }

  /**
   * Clear the authentication token
   */
  clearAuthToken(): void {
    this.config.authToken = undefined;
    this.api = this.createClient();
  }

  /**
   * Get the current configuration
   */
  getConfig(): Readonly<ArkeClientConfig> {
    return { ...this.config };
  }

  /**
   * Get the base URL
   */
  get baseUrl(): string {
    return this.config.baseUrl ?? DEFAULT_CONFIG.baseUrl;
  }

  /**
   * Check if client is authenticated
   */
  get isAuthenticated(): boolean {
    return !!this.config.authToken;
  }

  /**
   * Get entity content as a Blob
   *
   * This is a convenience method that handles the binary response parsing
   * that openapi-fetch doesn't handle automatically.
   *
   * @param entityId - The entity ID
   * @param key - Optional content version key (e.g., "v1", "original", "thumbnail"). Defaults to entity's current content key.
   *
   * @example
   * ```typescript
   * const { data, error } = await arke.getEntityContent('01ABC...');
   * // or with specific key
   * const { data, error } = await arke.getEntityContent('01ABC...', 'thumbnail');
   * if (data) {
   *   const text = await data.text();
   * }
   * ```
   */
  async getEntityContent(
    entityId: string,
    key?: string
  ): Promise<{ data: Blob | undefined; error: unknown }> {
    const { data, error } = await this.api.GET('/entities/{id}/content', {
      params: { path: { id: entityId }, query: key ? { key } : {} },
      parseAs: 'blob',
    });
    return { data: data as Blob | undefined, error };
  }

  /**
   * Get entity content as an ArrayBuffer
   *
   * This is a convenience method that handles the binary response parsing
   * that openapi-fetch doesn't handle automatically.
   *
   * @param entityId - The entity ID
   * @param key - Content version key (e.g., "v1", "original", "thumbnail")
   *
   * @example
   * ```typescript
   * const { data, error } = await arke.getEntityContentAsArrayBuffer('01ABC...', 'v1');
   * if (data) {
   *   const bytes = new Uint8Array(data);
   * }
   * ```
   */
  async getEntityContentAsArrayBuffer(
    entityId: string,
    key?: string
  ): Promise<{ data: ArrayBuffer | undefined; error: unknown }> {
    const { data, error } = await this.api.GET('/entities/{id}/content', {
      params: { path: { id: entityId }, query: key ? { key } : {} },
      parseAs: 'arrayBuffer',
    });
    return { data: data as ArrayBuffer | undefined, error };
  }

  /**
   * Get entity content as a ReadableStream
   *
   * This is a convenience method for streaming large files.
   *
   * @param entityId - The entity ID
   * @param key - Content version key (e.g., "v1", "original", "thumbnail")
   *
   * @example
   * ```typescript
   * const { data, error } = await arke.getEntityContentAsStream('01ABC...', 'v1');
   * if (data) {
   *   const reader = data.getReader();
   *   // Process chunks...
   * }
   * ```
   */
  async getEntityContentAsStream(
    entityId: string,
    key?: string
  ): Promise<{ data: ReadableStream<Uint8Array> | null | undefined; error: unknown }> {
    const { data, error } = await this.api.GET('/entities/{id}/content', {
      params: { path: { id: entityId }, query: key ? { key } : {} },
      parseAs: 'stream',
    });
    return { data: data as ReadableStream<Uint8Array> | null | undefined, error };
  }

  /**
   * Upload content to an entity
   *
   * This is a convenience method that handles the binary body serialization
   * that openapi-fetch doesn't handle automatically for non-JSON bodies.
   *
   * @param entityId - The entity ID
   * @param key - Content version key (e.g., "v1", "original", "thumbnail")
   * @param content - The content to upload
   * @param contentType - MIME type of the content
   * @param filename - Optional filename for Content-Disposition header on download
   *
   * @example
   * ```typescript
   * // Upload from a Blob
   * const blob = new Blob(['Hello, world!'], { type: 'text/plain' });
   * const { data, error } = await arke.uploadEntityContent('01ABC...', 'v1', blob, 'text/plain');
   *
   * // Upload from an ArrayBuffer
   * const buffer = new TextEncoder().encode('Hello, world!').buffer;
   * const { data, error } = await arke.uploadEntityContent('01ABC...', 'v1', buffer, 'text/plain');
   *
   * // Upload from a Uint8Array with filename
   * const bytes = new TextEncoder().encode('Hello, world!');
   * const { data, error } = await arke.uploadEntityContent('01ABC...', 'v1', bytes, 'text/plain', 'hello.txt');
   * ```
   */
  async uploadEntityContent(
    entityId: string,
    key: string,
    content: Blob | ArrayBuffer | Uint8Array,
    contentType: string,
    filename?: string
  ): Promise<{
    data: components['schemas']['UploadContentResponse'] | undefined;
    error: unknown;
  }> {
    // Convert to Blob if needed
    let body: Blob;
    if (content instanceof Blob) {
      body = content;
    } else if (content instanceof Uint8Array) {
      // Copy to a new ArrayBuffer to handle SharedArrayBuffer compatibility
      const buffer = new ArrayBuffer(content.byteLength);
      new Uint8Array(buffer).set(content);
      body = new Blob([buffer], { type: contentType });
    } else {
      // ArrayBuffer
      body = new Blob([content], { type: contentType });
    }

    const { data, error } = await this.api.POST('/entities/{id}/content', {
      params: { path: { id: entityId }, query: { key, filename } },
      body: body as unknown as Record<string, never>,
      bodySerializer: (b: unknown) => b as BodyInit,
      headers: { 'Content-Type': contentType },
    } as Parameters<typeof this.api.POST>[1]);

    return { data: data as components['schemas']['UploadContentResponse'] | undefined, error };
  }
}

/**
 * Create a new ArkeClient instance
 * Convenience function for those who prefer functional style
 */
export function createArkeClient(config?: ArkeClientConfig): ArkeClient {
  return new ArkeClient(config);
}

// Re-export types and errors
export type { ArkeClientConfig, RetryConfig } from './config.js';
export * from './errors.js';
