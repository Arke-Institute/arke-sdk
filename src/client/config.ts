/**
 * SDK configuration types
 */

import type { RetryConfig } from './retry.js';

export type { RetryConfig } from './retry.js';

export interface ArkeClientConfig {
  /**
   * Base URL for the Arke API
   * @default 'https://api.arke.institute'
   */
  baseUrl?: string;

  /**
   * Authentication token - accepts either:
   * - JWT token from Supabase auth (sent as Bearer)
   * - Agent API key with 'ak_' prefix (sent as ApiKey)
   * - User API key with 'uk_' prefix (sent as ApiKey)
   *
   * The correct Authorization header format is auto-detected from the token prefix.
   */
  authToken?: string;

  /**
   * Network to use ('main' or 'test')
   * Test network uses 'II' prefixed IDs and isolated data
   * @default 'main'
   */
  network?: 'main' | 'test';

  /**
   * Callback to refresh auth token when expired
   * Called automatically on 401 responses
   */
  onTokenRefresh?: () => Promise<string>;

  /**
   * Custom headers to include in all requests
   */
  headers?: Record<string, string>;

  /**
   * Retry configuration for transient errors
   *
   * Set to `false` to disable retries entirely.
   * If not specified, uses default retry behavior (3 retries with exponential backoff).
   *
   * CAS conflicts (409) are never retried - they are returned immediately.
   *
   * @example
   * ```typescript
   * const arke = new ArkeClient({
   *   authToken: 'ak_...',
   *   retry: {
   *     maxRetries: 5,
   *     initialDelay: 200,
   *     onRetry: (attempt, error, delay) => {
   *       console.log(`Retry ${attempt} after ${delay}ms`);
   *     }
   *   }
   * });
   * ```
   */
  retry?: RetryConfig | false;
}

export const DEFAULT_CONFIG: Required<Pick<ArkeClientConfig, 'baseUrl' | 'network'>> = {
  baseUrl: 'https://api.arke.institute',
  network: 'main',
};
