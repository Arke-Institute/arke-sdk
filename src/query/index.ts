export { QueryClient, type QueryClientConfig } from './client';
export { QueryError } from './errors';
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
  // Collection search types
  CollectionSearchOptions,
  CollectionSearchResult,
  CollectionSearchResponse,
} from './types';
