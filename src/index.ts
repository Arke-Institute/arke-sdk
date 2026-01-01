/**
 * @arke-institute/sdk
 *
 * TypeScript SDK for the Arke API - auto-generated from OpenAPI spec.
 *
 * @example
 * ```typescript
 * import { ArkeClient } from '@arke-institute/sdk';
 *
 * const arke = new ArkeClient({ authToken: 'your-jwt-token' });
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
 * if (error) {
 *   console.error('Failed to create entity:', error);
 * } else {
 *   console.log('Created entity:', data.id);
 * }
 * ```
 */

// Main client
export {
  ArkeClient,
  createArkeClient,
  isApiKey,
  getAuthorizationHeader,
  type ArkeApiClient,
} from './client/ArkeClient.js';

// Configuration
export { type ArkeClientConfig, DEFAULT_CONFIG } from './client/config.js';

// Errors
export {
  ArkeError,
  CASConflictError,
  NotFoundError,
  ValidationError,
  AuthenticationError,
  ForbiddenError,
  parseApiError,
} from './client/errors.js';

// Generated types
export type { paths, components, operations } from './generated/index.js';

// High-level operations (TODO: implement)
export {
  FolderOperations,
  BatchOperations,
  CryptoOperations,
  type UploadProgress,
  type UploadDirectoryOptions,
  type UploadDirectoryResult,
  type BatchCreateOptions,
  type BatchResult,
  type KeyPair,
  type SignedPayload,
} from './operations/index.js';
