/**
 * EditClient - Complete API client for Arke edit operations
 *
 * Provides full access to IPFS Wrapper write operations:
 * - Entity CRUD (create, read, update, delete)
 * - Version management
 * - Hierarchy operations
 * - Merge/unmerge operations
 * - Content upload
 * - Reprocessing
 *
 * Routes through the gateway:
 * - /api/* -> IPFS Wrapper (entities, content, uploads)
 * - /reprocess/* -> Reprocess API
 */

import type {
  Network,
  Entity,
  CreateEntityRequest,
  CreateEntityResponse,
  UpdateEntityRequest,
  UpdateEntityResponse,
  ListEntitiesOptions,
  ListEntitiesResponse,
  ListVersionsOptions,
  ListVersionsResponse,
  ResolveResponse,
  UpdateHierarchyRequest,
  UpdateHierarchyResponse,
  MergeEntityRequest,
  MergeEntityResponse,
  UnmergeEntityRequest,
  UnmergeEntityResponse,
  DeleteEntityRequest,
  DeleteEntityResponse,
  UndeleteEntityRequest,
  UndeleteEntityResponse,
  UploadResponse,
  ReprocessRequest,
  ReprocessResult,
  ReprocessStatus,
  RetryConfig,
} from './types.js';
import { DEFAULT_RETRY_CONFIG } from './types.js';
import {
  EditError,
  EntityNotFoundError,
  EntityExistsError,
  CASConflictError,
  MergeError,
  UnmergeError,
  DeleteError,
  UndeleteError,
  ReprocessError,
  PermissionError,
  ValidationError,
  NetworkError,
  ContentNotFoundError,
  IPFSError,
  BackendError,
} from './errors.js';

/** Configuration for EditClient */
export interface EditClientConfig {
  /** Gateway URL (e.g., https://gateway.arke.io) or direct API URL */
  gatewayUrl: string;
  /** JWT auth token */
  authToken?: string;
  /** Network to use (default: 'main') */
  network?: Network;
  /** User ID for permission checks */
  userId?: string;
  /** Retry configuration */
  retryConfig?: Partial<RetryConfig>;
  /** Optional transform for status URLs (e.g., for CORS proxy) */
  statusUrlTransform?: (url: string) => string;
  /**
   * API prefix for IPFS wrapper routes (default: '/api').
   * Set to '' (empty string) when using direct API URL like https://api.arke.institute
   */
  apiPrefix?: string;
}

/** Retry status codes */
const RETRYABLE_STATUS_CODES = [409, 503];

/** Retry error messages */
const RETRYABLE_ERRORS = ['ECONNRESET', 'ETIMEDOUT', 'fetch failed'];

export class EditClient {
  private gatewayUrl: string;
  private authToken?: string;
  private network: Network;
  private userId?: string;
  private retryConfig: RetryConfig;
  private statusUrlTransform?: (url: string) => string;
  private apiPrefix: string;

  constructor(config: EditClientConfig) {
    this.gatewayUrl = config.gatewayUrl.replace(/\/$/, '');
    this.authToken = config.authToken;
    this.network = config.network || 'main';
    this.userId = config.userId;
    this.retryConfig = { ...DEFAULT_RETRY_CONFIG, ...config.retryConfig };
    this.statusUrlTransform = config.statusUrlTransform;
    this.apiPrefix = config.apiPrefix ?? '/api';
  }

  // ===========================================================================
  // Configuration Methods
  // ===========================================================================

  /**
   * Update the auth token (useful for token refresh)
   */
  setAuthToken(token: string): void {
    this.authToken = token;
  }

  /**
   * Set the network (main or test)
   */
  setNetwork(network: Network): void {
    this.network = network;
  }

  /**
   * Set the user ID for permission checks
   */
  setUserId(userId: string): void {
    this.userId = userId;
  }

  // ===========================================================================
  // Internal Helpers
  // ===========================================================================

  /**
   * Build URL with API prefix
   */
  private buildUrl(path: string): string {
    return `${this.gatewayUrl}${this.apiPrefix}${path}`;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private getHeaders(contentType: string | null = 'application/json'): HeadersInit {
    const headers: HeadersInit = {};
    if (contentType) {
      headers['Content-Type'] = contentType;
    }
    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }
    headers['X-Arke-Network'] = this.network;
    if (this.userId) {
      headers['X-User-Id'] = this.userId;
    }
    return headers;
  }

  private calculateDelay(attempt: number): number {
    const { baseDelay, maxDelay, jitterFactor } = this.retryConfig;
    const exponentialDelay = baseDelay * Math.pow(2, attempt);
    const cappedDelay = Math.min(exponentialDelay, maxDelay);
    const jitter = cappedDelay * jitterFactor * (Math.random() * 2 - 1);
    return Math.max(0, cappedDelay + jitter);
  }

  private isRetryableStatus(status: number): boolean {
    return RETRYABLE_STATUS_CODES.includes(status);
  }

  private isRetryableError(error: Error): boolean {
    const message = error.message.toLowerCase();
    return RETRYABLE_ERRORS.some((e) => message.includes(e.toLowerCase()));
  }

  /**
   * Execute a fetch with exponential backoff retry on transient errors
   */
  private async fetchWithRetry(
    url: string,
    options: RequestInit,
    context: string
  ): Promise<Response> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= this.retryConfig.maxRetries; attempt++) {
      try {
        const response = await fetch(url, options);

        // Check for retryable status codes
        if (this.isRetryableStatus(response.status) && attempt < this.retryConfig.maxRetries) {
          const delay = this.calculateDelay(attempt);
          lastError = new Error(`${context}: ${response.status} ${response.statusText}`);
          await this.sleep(delay);
          continue;
        }

        return response;
      } catch (error) {
        lastError = error as Error;
        if (this.isRetryableError(lastError) && attempt < this.retryConfig.maxRetries) {
          const delay = this.calculateDelay(attempt);
          await this.sleep(delay);
          continue;
        }
        throw new NetworkError(lastError.message);
      }
    }

    throw lastError || new NetworkError('Request failed after retries');
  }

  /**
   * Handle common error responses and throw appropriate error types
   */
  private async handleErrorResponse(response: Response, context: string): Promise<never> {
    let errorData: { error?: string; message?: string; details?: unknown } = {};
    try {
      errorData = await response.json();
    } catch {
      // Response may not be JSON
    }

    const message = errorData.message || `${context}: ${response.statusText}`;
    const errorCode = errorData.error || '';

    switch (response.status) {
      case 400:
        throw new ValidationError(message);
      case 403:
        throw new PermissionError(message);
      case 404:
        throw new EntityNotFoundError(message);
      case 409:
        if (errorCode === 'CAS_FAILURE') {
          const details = errorData.details as { actual?: string; expect?: string } | undefined;
          throw new CASConflictError(
            context,
            details?.expect || 'unknown',
            details?.actual || 'unknown'
          );
        }
        if (errorCode === 'CONFLICT') {
          throw new EntityExistsError(message);
        }
        throw new EditError(message, errorCode, errorData.details);
      case 503:
        if (errorCode === 'IPFS_ERROR') {
          throw new IPFSError(message);
        }
        if (errorCode === 'BACKEND_ERROR') {
          throw new BackendError(message);
        }
        throw new NetworkError(message, response.status);
      default:
        throw new EditError(message, errorCode || 'API_ERROR', { status: response.status });
    }
  }

  // ===========================================================================
  // Entity CRUD Operations
  // ===========================================================================

  /**
   * Create a new entity
   */
  async createEntity(request: CreateEntityRequest): Promise<CreateEntityResponse> {
    const url = this.buildUrl('/entities');
    const response = await this.fetchWithRetry(
      url,
      {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(request),
      },
      'Create entity'
    );

    if (!response.ok) {
      await this.handleErrorResponse(response, 'Create entity');
    }

    return response.json();
  }

  /**
   * Get an entity by ID
   */
  async getEntity(id: string): Promise<Entity> {
    const url = this.buildUrl(`/entities/${encodeURIComponent(id)}`);
    const response = await this.fetchWithRetry(
      url,
      { headers: this.getHeaders() },
      `Get entity ${id}`
    );

    if (!response.ok) {
      await this.handleErrorResponse(response, `Get entity ${id}`);
    }

    return response.json();
  }

  /**
   * List entities with pagination
   */
  async listEntities(options: ListEntitiesOptions = {}): Promise<ListEntitiesResponse> {
    const params = new URLSearchParams();
    if (options.limit) params.set('limit', options.limit.toString());
    if (options.cursor) params.set('cursor', options.cursor);
    if (options.include_metadata) params.set('include_metadata', 'true');

    const queryString = params.toString();
    const url = this.buildUrl(`/entities${queryString ? `?${queryString}` : ''}`);

    const response = await this.fetchWithRetry(url, { headers: this.getHeaders() }, 'List entities');

    if (!response.ok) {
      await this.handleErrorResponse(response, 'List entities');
    }

    return response.json();
  }

  /**
   * Update an entity (append new version)
   */
  async updateEntity(id: string, update: UpdateEntityRequest): Promise<UpdateEntityResponse> {
    const url = this.buildUrl(`/entities/${encodeURIComponent(id)}/versions`);
    const response = await this.fetchWithRetry(
      url,
      {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(update),
      },
      `Update entity ${id}`
    );

    if (!response.ok) {
      await this.handleErrorResponse(response, `Update entity ${id}`);
    }

    return response.json();
  }

  // ===========================================================================
  // Version Operations
  // ===========================================================================

  /**
   * List version history for an entity
   */
  async listVersions(id: string, options: ListVersionsOptions = {}): Promise<ListVersionsResponse> {
    const params = new URLSearchParams();
    if (options.limit) params.set('limit', options.limit.toString());
    if (options.cursor) params.set('cursor', options.cursor);

    const queryString = params.toString();
    const url = this.buildUrl(`/entities/${encodeURIComponent(id)}/versions${queryString ? `?${queryString}` : ''}`);

    const response = await this.fetchWithRetry(url, { headers: this.getHeaders() }, `List versions for ${id}`);

    if (!response.ok) {
      await this.handleErrorResponse(response, `List versions for ${id}`);
    }

    return response.json();
  }

  /**
   * Get a specific version of an entity
   */
  async getVersion(id: string, selector: string): Promise<Entity> {
    const url = this.buildUrl(`/entities/${encodeURIComponent(id)}/versions/${encodeURIComponent(selector)}`);
    const response = await this.fetchWithRetry(
      url,
      { headers: this.getHeaders() },
      `Get version ${selector} for ${id}`
    );

    if (!response.ok) {
      await this.handleErrorResponse(response, `Get version ${selector} for ${id}`);
    }

    return response.json();
  }

  /**
   * Resolve an entity ID to its current tip CID (fast lookup)
   */
  async resolve(id: string): Promise<ResolveResponse> {
    const url = this.buildUrl(`/resolve/${encodeURIComponent(id)}`);
    const response = await this.fetchWithRetry(
      url,
      { headers: this.getHeaders() },
      `Resolve ${id}`
    );

    if (!response.ok) {
      await this.handleErrorResponse(response, `Resolve ${id}`);
    }

    return response.json();
  }

  // ===========================================================================
  // Hierarchy Operations
  // ===========================================================================

  /**
   * Update parent-child hierarchy relationships
   */
  async updateHierarchy(request: UpdateHierarchyRequest): Promise<UpdateHierarchyResponse> {
    const apiRequest = {
      parent_pi: request.parent_id,
      expect_tip: request.expect_tip,
      add_children: request.add_children,
      remove_children: request.remove_children,
      note: request.note,
    };

    const url = this.buildUrl('/hierarchy');
    const response = await this.fetchWithRetry(
      url,
      {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(apiRequest),
      },
      `Update hierarchy for ${request.parent_id}`
    );

    if (!response.ok) {
      await this.handleErrorResponse(response, `Update hierarchy for ${request.parent_id}`);
    }

    return response.json();
  }

  // ===========================================================================
  // Merge Operations
  // ===========================================================================

  /**
   * Merge source entity into target entity
   */
  async mergeEntity(sourceId: string, request: MergeEntityRequest): Promise<MergeEntityResponse> {
    const url = this.buildUrl(`/entities/${encodeURIComponent(sourceId)}/merge`);
    const response = await this.fetchWithRetry(
      url,
      {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(request),
      },
      `Merge ${sourceId} into ${request.target_id}`
    );

    if (!response.ok) {
      try {
        const error = await response.json();
        throw new MergeError(
          error.message || `Merge failed: ${response.statusText}`,
          sourceId,
          request.target_id
        );
      } catch (e) {
        if (e instanceof MergeError) throw e;
        await this.handleErrorResponse(response, `Merge ${sourceId}`);
      }
    }

    return response.json();
  }

  /**
   * Unmerge (restore) a previously merged entity
   */
  async unmergeEntity(sourceId: string, request: UnmergeEntityRequest): Promise<UnmergeEntityResponse> {
    const url = this.buildUrl(`/entities/${encodeURIComponent(sourceId)}/unmerge`);
    const response = await this.fetchWithRetry(
      url,
      {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(request),
      },
      `Unmerge ${sourceId}`
    );

    if (!response.ok) {
      try {
        const error = await response.json();
        throw new UnmergeError(
          error.message || `Unmerge failed: ${response.statusText}`,
          sourceId,
          request.target_id
        );
      } catch (e) {
        if (e instanceof UnmergeError) throw e;
        await this.handleErrorResponse(response, `Unmerge ${sourceId}`);
      }
    }

    return response.json();
  }

  // ===========================================================================
  // Delete Operations
  // ===========================================================================

  /**
   * Soft delete an entity (creates tombstone, preserves history)
   */
  async deleteEntity(id: string, request: DeleteEntityRequest): Promise<DeleteEntityResponse> {
    const url = this.buildUrl(`/entities/${encodeURIComponent(id)}/delete`);
    const response = await this.fetchWithRetry(
      url,
      {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(request),
      },
      `Delete ${id}`
    );

    if (!response.ok) {
      try {
        const error = await response.json();
        throw new DeleteError(error.message || `Delete failed: ${response.statusText}`, id);
      } catch (e) {
        if (e instanceof DeleteError) throw e;
        await this.handleErrorResponse(response, `Delete ${id}`);
      }
    }

    return response.json();
  }

  /**
   * Restore a deleted entity
   */
  async undeleteEntity(id: string, request: UndeleteEntityRequest): Promise<UndeleteEntityResponse> {
    const url = this.buildUrl(`/entities/${encodeURIComponent(id)}/undelete`);
    const response = await this.fetchWithRetry(
      url,
      {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(request),
      },
      `Undelete ${id}`
    );

    if (!response.ok) {
      try {
        const error = await response.json();
        throw new UndeleteError(error.message || `Undelete failed: ${response.statusText}`, id);
      } catch (e) {
        if (e instanceof UndeleteError) throw e;
        await this.handleErrorResponse(response, `Undelete ${id}`);
      }
    }

    return response.json();
  }

  // ===========================================================================
  // Content Operations
  // ===========================================================================

  /**
   * Upload files to IPFS
   */
  async upload(files: File | Blob | File[] | Blob[] | FormData): Promise<UploadResponse[]> {
    let formData: FormData;

    if (files instanceof FormData) {
      formData = files;
    } else {
      formData = new FormData();
      const fileArray = Array.isArray(files) ? files : [files];
      for (const file of fileArray) {
        if (file instanceof File) {
          formData.append('file', file, file.name);
        } else {
          formData.append('file', file, 'file');
        }
      }
    }

    const url = this.buildUrl('/upload');
    const response = await this.fetchWithRetry(
      url,
      {
        method: 'POST',
        headers: this.getHeaders(null), // No Content-Type for multipart
        body: formData,
      },
      'Upload files'
    );

    if (!response.ok) {
      await this.handleErrorResponse(response, 'Upload files');
    }

    return response.json();
  }

  /**
   * Upload text content and return CID
   */
  async uploadContent(content: string, filename: string): Promise<string> {
    const blob = new Blob([content], { type: 'text/plain' });
    const file = new File([blob], filename, { type: 'text/plain' });
    const [result] = await this.upload(file);
    return result.cid;
  }

  /**
   * Download file content by CID
   */
  async getContent(cid: string): Promise<string> {
    const url = this.buildUrl(`/cat/${encodeURIComponent(cid)}`);
    const response = await this.fetchWithRetry(
      url,
      { headers: this.getHeaders() },
      `Get content ${cid}`
    );

    if (response.status === 404) {
      throw new ContentNotFoundError(cid);
    }

    if (!response.ok) {
      await this.handleErrorResponse(response, `Get content ${cid}`);
    }

    return response.text();
  }

  /**
   * Download a DAG node (JSON) by CID
   */
  async getDag<T = unknown>(cid: string): Promise<T> {
    const url = this.buildUrl(`/dag/${encodeURIComponent(cid)}`);
    const response = await this.fetchWithRetry(
      url,
      { headers: this.getHeaders() },
      `Get DAG ${cid}`
    );

    if (response.status === 404) {
      throw new ContentNotFoundError(cid);
    }

    if (!response.ok) {
      await this.handleErrorResponse(response, `Get DAG ${cid}`);
    }

    return response.json();
  }

  // ===========================================================================
  // Arke Origin Operations
  // ===========================================================================

  /**
   * Get the Arke origin block (genesis entity)
   */
  async getArke(): Promise<Entity> {
    const url = this.buildUrl('/arke');
    const response = await this.fetchWithRetry(
      url,
      { headers: this.getHeaders() },
      'Get Arke'
    );

    if (!response.ok) {
      await this.handleErrorResponse(response, 'Get Arke');
    }

    return response.json();
  }

  /**
   * Initialize the Arke origin block (creates if doesn't exist)
   */
  async initArke(): Promise<CreateEntityResponse> {
    const url = this.buildUrl('/arke/init');
    const response = await this.fetchWithRetry(
      url,
      {
        method: 'POST',
        headers: this.getHeaders(),
      },
      'Init Arke'
    );

    if (!response.ok) {
      await this.handleErrorResponse(response, 'Init Arke');
    }

    return response.json();
  }

  // ===========================================================================
  // Reprocess API Operations (via /reprocess/*)
  // ===========================================================================

  /**
   * Trigger reprocessing for an entity
   */
  async reprocess(request: ReprocessRequest): Promise<ReprocessResult> {
    const response = await this.fetchWithRetry(
      `${this.gatewayUrl}/reprocess/reprocess`,
      {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          pi: request.pi,
          phases: request.phases,
          cascade: request.cascade,
          options: request.options,
        }),
      },
      `Reprocess ${request.pi}`
    );

    if (response.status === 403) {
      const error = await response.json().catch(() => ({}));
      throw new PermissionError(
        error.message || `Permission denied to reprocess ${request.pi}`,
        request.pi
      );
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new ReprocessError(error.message || `Reprocess failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get reprocessing status by batch ID
   */
  async getReprocessStatus(statusUrl: string, isFirstPoll = false): Promise<ReprocessStatus> {
    const fetchUrl = this.statusUrlTransform ? this.statusUrlTransform(statusUrl) : statusUrl;

    const delay = isFirstPoll ? 3000 : this.retryConfig.baseDelay;
    if (isFirstPoll) {
      await this.sleep(delay);
    }

    const response = await this.fetchWithRetry(
      fetchUrl,
      { headers: this.getHeaders() },
      'Get reprocess status'
    );

    if (!response.ok) {
      throw new EditError(
        `Failed to fetch reprocess status: ${response.statusText}`,
        'STATUS_ERROR',
        { status: response.status }
      );
    }

    return response.json();
  }

  // ===========================================================================
  // Utility Methods
  // ===========================================================================

  /**
   * Execute an operation with automatic CAS retry
   */
  async withCAS<T>(
    id: string,
    operation: (entity: Entity) => Promise<T>,
    maxRetries = 3
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const entity = await this.getEntity(id);
        return await operation(entity);
      } catch (error) {
        if (error instanceof CASConflictError && attempt < maxRetries - 1) {
          lastError = error;
          const delay = this.calculateDelay(attempt);
          await this.sleep(delay);
          continue;
        }
        throw error;
      }
    }

    throw lastError || new EditError('withCAS failed after retries');
  }
}
