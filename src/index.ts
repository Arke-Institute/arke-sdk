/**
 * @arke-institute/sdk - TypeScript SDK for building applications on the Arke platform
 *
 * @example
 * ```typescript
 * import {
 *   CollectionsClient,
 *   UploadClient,
 *   QueryClient,
 *   EditClient,
 *   ContentClient,
 *   GraphClient
 * } from '@arke-institute/sdk';
 *
 * // Collections management
 * const collections = new CollectionsClient({
 *   gatewayUrl: 'https://gateway.arke.institute',
 *   authToken: 'your-jwt-token',
 * });
 *
 * // Upload with collections integration
 * const upload = new UploadClient({
 *   gatewayUrl: 'https://gateway.arke.institute',
 *   authToken: 'your-jwt-token',
 *   uploader: 'my-app',
 * });
 *
 * // Query the knowledge graph (no auth required)
 * const query = new QueryClient({
 *   gatewayUrl: 'https://gateway.arke.institute',
 * });
 *
 * // Content access (no auth required)
 * const content = new ContentClient({
 *   gatewayUrl: 'https://gateway.arke.institute',
 * });
 *
 * // Graph relationships (no auth required)
 * const graph = new GraphClient({
 *   gatewayUrl: 'https://gateway.arke.institute',
 * });
 *
 * // Get an entity and its content
 * const entity = await content.get('01K75HQQXNTDG7BBP7PS9AWYAN');
 * const imageBlob = await content.download(entity.components.source);
 *
 * // Get entities with relationships from the knowledge graph
 * const entities = await graph.getEntitiesWithRelationships(entity.pi);
 *
 * // Execute a path query
 * const results = await query.path('"alice austen" -[*]{,4}-> type:person');
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

// Query
export { QueryClient, type QueryClientConfig } from './query/client';
export { QueryError } from './query/errors';
export type {
  // Request types
  LineageFilter,
  PathQueryOptions,
  NaturalQueryOptions,
  // Response types
  EnrichedContent,
  Entity,
  PathStep,
  QueryResultItem,
  LineageMetadata,
  QueryMetadata,
  QueryResult,
  TranslationInfo,
  NaturalQueryResult,
  TranslateResult,
  // Parse types
  ASTNodeType,
  EntryAST,
  FilterAST,
  HopAST,
  PathAST,
  ParseResult,
  ParseError,
  // Syntax documentation types
  EntryPointDoc,
  EdgeTypeDoc,
  VariableDepthDoc,
  FilterTypeDoc,
  ParameterDoc,
  ExampleDoc,
  SyntaxDocumentation,
} from './query/types';

// Edit
export { EditClient, type EditClientConfig } from './edit/client';
export { EditSession } from './edit/session';
export { EditError, PermissionError } from './edit/errors';
export type {
  EditMode,
  EditSessionConfig,
  EditScope,
  RegeneratableComponent,
  EditResult,
  EditStatus,
  EditPhase,
  ReprocessResult,
  ReprocessStatus,
} from './edit/types';

// Content
export { ContentClient, type ContentClientConfig } from './content/client';
export {
  ContentError,
  EntityNotFoundError,
  ContentNotFoundError,
  ComponentNotFoundError,
  VersionNotFoundError,
  NetworkError as ContentNetworkError,
} from './content/errors';
export type {
  Entity as ContentEntity,
  EntitySummary,
  EntityVersion,
  ListOptions,
  ListResponse,
  VersionsOptions,
  VersionsResponse,
  ResolveResponse,
} from './content/types';

// Graph
export { GraphClient, type GraphClientConfig } from './graph/client';
export {
  GraphError,
  GraphEntityNotFoundError,
  NoPathFoundError,
  NetworkError as GraphNetworkError,
} from './graph/errors';
export type {
  GraphEntity,
  Relationship,
  EntityWithRelationships,
  PathEdge,
  Path,
  PathOptions,
  ReachableOptions,
  ListFromPiOptions,
  EntityQueryResponse,
  EntitiesWithRelationshipsResponse,
  PathsResponse,
  LineagePiEntry,
  LineageResultSet,
  LineageResponse,
} from './graph/types';
