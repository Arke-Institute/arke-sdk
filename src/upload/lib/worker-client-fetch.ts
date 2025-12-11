/**
 * API client for communicating with the Arke Ingest Worker (fetch-based)
 */

import type {
  InitBatchRequest,
  InitBatchResponse,
  StartFileUploadRequest,
  StartFileUploadResponse,
  CompleteFileUploadRequest,
  CompleteFileUploadResponse,
  FinalizeBatchResponse,
  BatchStatusResponse,
  ErrorResponse,
} from '../types/api.js';
import { WorkerAPIError, NetworkError } from '../utils/errors.js';
import { retryWithBackoff } from '../utils/retry.js';

export interface WorkerClientConfig {
  baseUrl: string;
  authToken?: string;
  timeout?: number;
  maxRetries?: number;
  retryInitialDelay?: number;
  retryMaxDelay?: number;
  retryJitter?: boolean;
  debug?: boolean;
}

export class WorkerClient {
  private baseUrl: string;
  private authToken?: string;
  private timeout: number;
  private maxRetries: number;
  private retryInitialDelay: number;
  private retryMaxDelay: number;
  private retryJitter: boolean;
  private debug: boolean;

  constructor(config: WorkerClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '');
    this.authToken = config.authToken;
    this.timeout = config.timeout ?? 30000; // 30 seconds
    this.maxRetries = config.maxRetries ?? 3;
    this.retryInitialDelay = config.retryInitialDelay ?? 1000; // 1 second
    this.retryMaxDelay = config.retryMaxDelay ?? 30000; // 30 seconds
    this.retryJitter = config.retryJitter ?? true;
    this.debug = config.debug ?? false;
  }

  setAuthToken(token?: string) {
    this.authToken = token;
  }

  /**
   * Make HTTP request with fetch
   */
  private async request<T>(
    method: string,
    path: string,
    body?: unknown
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;

    if (this.debug) {
      console.log(`HTTP Request: ${method} ${url}`, body);
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (this.authToken) {
        headers['Authorization'] = `Bearer ${this.authToken}`;
      }

      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (this.debug) {
        console.log(`HTTP Response: ${response.status}`, data);
      }

      if (!response.ok) {
        const errorData = data as ErrorResponse;
        throw new WorkerAPIError(
          errorData.error || 'Request failed',
          response.status,
          errorData.details
        );
      }

      return data as T;
    } catch (error: any) {
      if (error instanceof WorkerAPIError) {
        throw error;
      }

      if (error.name === 'AbortError') {
        throw new NetworkError(`Request timeout after ${this.timeout}ms`);
      }

      throw new NetworkError(`Network request failed: ${error.message}`);
    }
  }

  /**
   * Initialize a new batch upload
   */
  async initBatch(params: InitBatchRequest): Promise<InitBatchResponse> {
    return retryWithBackoff(
      () => this.request<InitBatchResponse>('POST', '/ingest/batches/init', params),
      {
        maxRetries: this.maxRetries,
        initialDelay: this.retryInitialDelay,
        maxDelay: this.retryMaxDelay,
        jitter: this.retryJitter,
      }
    );
  }

  /**
   * Request presigned URLs for a file upload
   */
  async startFileUpload(
    batchId: string,
    params: StartFileUploadRequest
  ): Promise<StartFileUploadResponse> {
    return retryWithBackoff(
      () =>
        this.request<StartFileUploadResponse>(
          'POST',
          `/ingest/batches/${batchId}/files/start`,
          params
        ),
      {
        maxRetries: this.maxRetries,
        initialDelay: this.retryInitialDelay,
        maxDelay: this.retryMaxDelay,
        jitter: this.retryJitter,
      }
    );
  }

  /**
   * Mark a file upload as complete
   */
  async completeFileUpload(
    batchId: string,
    params: CompleteFileUploadRequest
  ): Promise<CompleteFileUploadResponse> {
    return retryWithBackoff(
      () =>
        this.request<CompleteFileUploadResponse>(
          'POST',
          `/ingest/batches/${batchId}/files/complete`,
          params
        ),
      {
        maxRetries: this.maxRetries,
        initialDelay: this.retryInitialDelay,
        maxDelay: this.retryMaxDelay,
        jitter: this.retryJitter,
      }
    );
  }

  /**
   * Finalize the batch after all files are uploaded
   * Returns root_pi immediately for small batches, or status='discovery' for large batches
   */
  async finalizeBatch(batchId: string): Promise<FinalizeBatchResponse> {
    return retryWithBackoff(
      () =>
        this.request<FinalizeBatchResponse>(
          'POST',
          `/ingest/batches/${batchId}/finalize`,
          {}
        ),
      {
        maxRetries: this.maxRetries,
        initialDelay: this.retryInitialDelay,
        maxDelay: this.retryMaxDelay,
        jitter: this.retryJitter,
      }
    );
  }

  /**
   * Get current batch status (used for polling during async discovery)
   */
  async getBatchStatus(batchId: string): Promise<BatchStatusResponse> {
    return retryWithBackoff(
      () =>
        this.request<BatchStatusResponse>(
          'GET',
          `/ingest/batches/${batchId}/status`
        ),
      {
        maxRetries: this.maxRetries,
        initialDelay: this.retryInitialDelay,
        maxDelay: this.retryMaxDelay,
        jitter: this.retryJitter,
      }
    );
  }
}
