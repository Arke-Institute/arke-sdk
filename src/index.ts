/**
 * @arke-institute/sdk - TypeScript SDK for building applications on the Arke platform
 *
 * @example
 * ```typescript
 * import { CollectionsClient, UploadClient } from '@arke-institute/sdk';
 *
 * // Collections management
 * const collections = new CollectionsClient({
 *   gatewayUrl: 'https://api.arke.institute',
 *   authToken: 'your-jwt-token',
 * });
 *
 * // Upload with collections integration
 * const upload = new UploadClient({
 *   gatewayUrl: 'https://api.arke.institute',
 *   authToken: 'your-jwt-token',
 *   uploader: 'my-app',
 * });
 *
 * // Create a new collection from files
 * const result = await upload.createCollection({
 *   files: './photos',
 *   collectionMetadata: { title: 'My Archive', slug: 'my-archive' },
 * });
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

// Upload
export {
  UploadClient,
  type UploadClientConfig,
  type CreateCollectionUploadOptions,
  type AddToCollectionOptions,
  type CreateCollectionUploadResult,
} from './upload/client';
export { ArkeUploader } from './upload/uploader';
export type {
  UploaderConfig,
  UploadOptions,
  UploadProgress,
  BatchResult,
  CustomPrompts,
  ProcessingConfig,
  FileInfo,
} from './upload/types/index';
export {
  ValidationError,
  ScanError,
  WorkerAPIError,
  NetworkError,
  UploadError,
} from './upload/utils/errors';
