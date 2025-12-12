/**
 * Graph package for the Arke SDK
 *
 * Provides read-only access to entity relationships from the GraphDB Gateway service.
 *
 * @example
 * ```typescript
 * import { GraphClient } from '@arke-institute/sdk/graph';
 *
 * const graph = new GraphClient({
 *   gatewayUrl: 'https://gateway.arke.institute',
 * });
 *
 * // Get entity by ID
 * const entity = await graph.getEntity('uuid-123');
 *
 * // Get entities with relationships from a PI
 * const entities = await graph.getEntitiesWithRelationships('01K75HQQXNTDG7BBP7PS9AWYAN');
 *
 * // Find paths between entities
 * const paths = await graph.findPaths(['uuid-1'], ['uuid-2']);
 * ```
 */

export { GraphClient, type GraphClientConfig } from './client.js';
export * from './types.js';
export * from './errors.js';
