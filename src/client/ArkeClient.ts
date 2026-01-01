/**
 * Main Arke SDK Client
 *
 * Provides type-safe access to the Arke API using openapi-fetch.
 */

import createClient, { type Client } from 'openapi-fetch';
import type { paths } from '../generated/types.js';
import { ArkeClientConfig, DEFAULT_CONFIG } from './config.js';

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

    return createClient<paths>({
      baseUrl: this.config.baseUrl ?? DEFAULT_CONFIG.baseUrl,
      headers,
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
}

/**
 * Create a new ArkeClient instance
 * Convenience function for those who prefer functional style
 */
export function createArkeClient(config?: ArkeClientConfig): ArkeClient {
  return new ArkeClient(config);
}

// Re-export types and errors
export type { ArkeClientConfig } from './config.js';
export * from './errors.js';
