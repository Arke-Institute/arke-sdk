/**
 * Graph package for the Arke SDK
 *
 * Provides read-only access to the GraphDB Gateway service, which is an indexed
 * mirror of entity data stored in IPFS.
 *
 * Use GraphClient for:
 * - **Bidirectional relationship queries** (IPFS only stores outbound)
 * - **Path finding** between entities
 * - **PI lineage queries** (ancestors/descendants)
 * - **Code-based lookups** (indexed for fast search)
 *
 * For entity CRUD operations, use ContentClient or EditClient (IPFS source of truth).
 *
 * @example
 * ```typescript
 * import { GraphClient } from '@arke-institute/sdk/graph';
 *
 * const graph = new GraphClient({
 *   gatewayUrl: 'https://gateway.arke.institute',
 * });
 *
 * // Get ALL relationships (both directions - only GraphDB has inbound)
 * const allRels = await graph.getRelationships('01K75HQQXNTDG7BBP7PS9AWYAN');
 *
 * // Get only inbound relationships ("who references this entity?")
 * const incoming = await graph.getRelationships('01K75HQQXNTDG7BBP7PS9AWYAN', 'incoming');
 *
 * // Find paths between entities
 * const paths = await graph.findPaths(['entity-1'], ['entity-2']);
 *
 * // Get PI lineage (ancestors/descendants)
 * const lineage = await graph.getLineage('01K75HQQXNTDG7BBP7PS9AWYAN', 'ancestors');
 * ```
 */

export { GraphClient, type GraphClientConfig } from './client.js';
export * from './types.js';
export * from './errors.js';
