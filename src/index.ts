/**
 * @arke/sdk - TypeScript SDK for building applications on the Arke platform
 *
 * @example
 * ```typescript
 * import { CollectionsClient } from '@arke/sdk';
 *
 * const client = new CollectionsClient({
 *   gatewayUrl: 'https://api.arke.institute',
 *   authToken: 'your-jwt-token',
 * });
 *
 * const collections = await client.listCollections();
 * ```
 */

// Collections
export {
  CollectionsClient,
  type CollectionsClientConfig,
} from './collections/client';
export { CollectionsError } from './collections/errors';
export type {
  Collection,
  CollectionDetails,
  CollectionRole,
  CollectionVisibility,
  CreateCollectionPayload,
  UpdateCollectionPayload,
  RegisterRootPayload,
  ChangeRootPayload,
  ChangeRootResponse,
  Member,
  MemberUser,
  MembersResponse,
  Invitation,
  InvitationUser,
  InvitationsResponse,
  MyAccessResponse,
  MyCollectionsResponse,
  PaginatedCollections,
  PiPermissions,
  RootResponse,
  SuccessResponse,
} from './collections/types';
