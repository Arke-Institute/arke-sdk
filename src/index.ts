/**
 * @arke-institute/sdk - TypeScript SDK for building applications on the Arke platform
 *
 * @example
 * ```typescript
 * import { CollectionsClient, UploadClient, QueryClient, EditClient, EditSession } from '@arke-institute/sdk';
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
 * // Execute a path query
 * const results = await query.path('"alice austen" -[*]{,4}-> type:person');
 *
 * // Natural language query
 * const nlResults = await query.natural('Find photographers connected to Alice Austen');
 *
 * // Edit entities with AI-powered regeneration
 * const editClient = new EditClient({
 *   gatewayUrl: 'https://gateway.arke.institute',
 *   authToken: 'your-jwt-token',
 * });
 * const session = new EditSession(editClient, 'PI_HERE', { mode: 'ai-prompt' });
 * await session.load();
 * session.setPrompt('general', 'Fix OCR errors');
 * session.setScope({ components: ['description'], cascade: true });
 * const result = await session.submit('Fix OCR errors');
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
