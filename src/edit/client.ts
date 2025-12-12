/**
 * EditClient - Low-level API client for Arke edit operations
 *
 * Routes through the gateway:
 * - /api/* -> IPFS Wrapper (entities, content, uploads)
 * - /reprocess/* -> Reprocess API
 */

import type {
  Entity,
  EntityUpdate,
  EntityVersion,
  ReprocessRequest,
  ReprocessResult,
  ReprocessStatus,
} from './types';
import {
  EditError,
  EntityNotFoundError,
  CASConflictError,
  ReprocessError,
  PermissionError,
} from './errors';

/** Configuration for EditClient */
export interface EditClientConfig {
  /** Gateway URL (e.g., https://gateway.arke.io) */
  gatewayUrl: string;
  /** JWT auth token */
  authToken?: string;
  /** Optional transform for status URLs (e.g., for CORS proxy) */
  statusUrlTransform?: (url: string) => string;
}

/** Default retry options for status polling */
const DEFAULT_RETRY_OPTIONS = {
  maxRetries: 5,
  initialDelayMs: 2000,  // Start with 2s delay (orchestrator needs time to initialize)
  maxDelayMs: 30000,     // Cap at 30s
  backoffMultiplier: 2,  // Double each retry
};

export class EditClient {
  private gatewayUrl: string;
  private authToken?: string;
  private statusUrlTransform?: (url: string) => string;

  constructor(config: EditClientConfig) {
    this.gatewayUrl = config.gatewayUrl.replace(/\/$/, '');
    this.authToken = config.authToken;
    this.statusUrlTransform = config.statusUrlTransform;
  }

  /**
   * Update the auth token (useful for token refresh)
   */
  setAuthToken(token: string): void {
    this.authToken = token;
  }

  /**
   * Sleep for a given number of milliseconds
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Execute a fetch with exponential backoff retry on transient errors
   */
  private async fetchWithRetry(
    url: string,
    options: RequestInit,
    retryOptions = DEFAULT_RETRY_OPTIONS
  ): Promise<Response> {
    let lastError: Error | null = null;
    let delay = retryOptions.initialDelayMs;

    for (let attempt = 0; attempt <= retryOptions.maxRetries; attempt++) {
      try {
        const response = await fetch(url, options);

        // Retry on 5xx errors (server errors)
        if (response.status >= 500 && attempt < retryOptions.maxRetries) {
          lastError = new Error(`Server error: ${response.status} ${response.statusText}`);
          await this.sleep(delay);
          delay = Math.min(delay * retryOptions.backoffMultiplier, retryOptions.maxDelayMs);
          continue;
        }

        return response;
      } catch (error) {
        // Network errors - retry
        lastError = error as Error;
        if (attempt < retryOptions.maxRetries) {
          await this.sleep(delay);
          delay = Math.min(delay * retryOptions.backoffMultiplier, retryOptions.maxDelayMs);
        }
      }
    }

    throw lastError || new Error('Request failed after retries');
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }
    return headers;
  }

  /**
   * Handle common error responses
   */
  private handleErrorResponse(response: Response, context: string): never {
    if (response.status === 403) {
      throw new PermissionError(`Permission denied: ${context}`);
    }
    throw new EditError(
      `${context}: ${response.statusText}`,
      'API_ERROR',
      { status: response.status }
    );
  }

  // ===========================================================================
  // IPFS Wrapper Operations (via /api/*)
  // ===========================================================================

  /**
   * Fetch an entity by PI
   */
  async getEntity(pi: string): Promise<Entity> {
    const response = await fetch(`${this.gatewayUrl}/api/entities/${pi}`, {
      headers: this.getHeaders(),
    });

    if (response.status === 404) {
      throw new EntityNotFoundError(pi);
    }

    if (!response.ok) {
      this.handleErrorResponse(response, `Failed to fetch entity ${pi}`);
    }

    return response.json();
  }

  /**
   * Fetch content by CID
   */
  async getContent(cid: string): Promise<string> {
    const response = await fetch(`${this.gatewayUrl}/api/cat/${cid}`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      this.handleErrorResponse(response, `Failed to fetch content ${cid}`);
    }

    return response.text();
  }

  /**
   * Upload content and get CID
   */
  async uploadContent(content: string, filename: string): Promise<string> {
    const formData = new FormData();
    const blob = new Blob([content], { type: 'text/plain' });
    formData.append('file', blob, filename);

    const headers: HeadersInit = {};
    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    const response = await fetch(`${this.gatewayUrl}/api/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      this.handleErrorResponse(response, 'Failed to upload content');
    }

    const result = await response.json();
    // Response format: [{ cid, name, size }]
    return result[0].cid;
  }

  /**
   * Update an entity with new components
   */
  async updateEntity(pi: string, update: EntityUpdate): Promise<EntityVersion> {
    const response = await fetch(`${this.gatewayUrl}/api/entities/${pi}/versions`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        expect_tip: update.expect_tip,
        components: update.components,
        components_remove: update.components_remove,
        note: update.note,
      }),
    });

    if (response.status === 409) {
      // CAS conflict - entity was modified
      const entity = await this.getEntity(pi);
      throw new CASConflictError(
        pi,
        update.expect_tip,
        entity.manifest_cid
      );
    }

    if (!response.ok) {
      this.handleErrorResponse(response, `Failed to update entity ${pi}`);
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
    const response = await fetch(`${this.gatewayUrl}/reprocess/reprocess`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        pi: request.pi,
        phases: request.phases,
        cascade: request.cascade,
        options: request.options,
      }),
    });

    if (response.status === 403) {
      const error = await response.json().catch(() => ({}));
      throw new PermissionError(
        error.message || `Permission denied to reprocess ${request.pi}`,
        request.pi
      );
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new ReprocessError(
        error.message || `Reprocess failed: ${response.statusText}`,
        undefined
      );
    }

    return response.json();
  }

  /**
   * Get reprocessing status by batch ID
   *
   * Uses exponential backoff retry to handle transient 500 errors
   * that occur when the orchestrator is initializing.
   *
   * @param statusUrl - The status URL returned from reprocess()
   * @param isFirstPoll - If true, uses a longer initial delay (orchestrator warmup)
   */
  async getReprocessStatus(statusUrl: string, isFirstPoll = false): Promise<ReprocessStatus> {
    // Use longer initial delay for first poll after triggering reprocess
    const retryOptions = isFirstPoll
      ? { ...DEFAULT_RETRY_OPTIONS, initialDelayMs: 3000 }
      : DEFAULT_RETRY_OPTIONS;

    // Apply URL transform if configured (for CORS proxy)
    const fetchUrl = this.statusUrlTransform ? this.statusUrlTransform(statusUrl) : statusUrl;

    const response = await this.fetchWithRetry(
      fetchUrl,
      { headers: this.getHeaders() },
      retryOptions
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
}
