/**
 * SDK configuration types
 */

export interface ArkeClientConfig {
  /**
   * Base URL for the Arke API
   * @default 'https://arke-v1.arke.institute'
   */
  baseUrl?: string;

  /**
   * Authentication token (JWT or API key)
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
}

export const DEFAULT_CONFIG: Required<Pick<ArkeClientConfig, 'baseUrl' | 'network'>> = {
  baseUrl: 'https://arke-v1.arke.institute',
  network: 'main',
};
