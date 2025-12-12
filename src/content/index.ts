/**
 * Content package for the Arke SDK
 *
 * Provides read-only access to entities and content from the IPFS Wrapper service.
 *
 * @example
 * ```typescript
 * import { ContentClient } from '@arke-institute/sdk/content';
 *
 * const content = new ContentClient({
 *   gatewayUrl: 'https://gateway.arke.institute',
 * });
 *
 * // Get an entity
 * const entity = await content.get('01K75HQQXNTDG7BBP7PS9AWYAN');
 *
 * // List entities
 * const { entities, next_cursor } = await content.list({ limit: 20 });
 *
 * // Download content
 * const blob = await content.download(entity.components.source);
 * ```
 */

export { ContentClient, type ContentClientConfig } from './client.js';
export * from './types.js';
export * from './errors.js';
