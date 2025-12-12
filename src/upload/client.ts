/**
 * Upload Client with Collections Integration
 * Provides high-level upload operations with permission checks
 */

import type {
  UploaderConfig,
  UploadOptions,
  UploadProgress,
  BatchResult,
  CustomPrompts,
} from './types/config';
import type { ProcessingConfig } from './types/processing';
import { ArkeUploader } from './uploader';
import { CollectionsClient, type CollectionsClientConfig } from '../collections/client';
import type { CreateCollectionPayload, Collection, PiPermissions } from '../collections/types';

export interface UploadClientConfig {
  /**
   * Gateway base URL (e.g., https://api.arke.institute)
   */
  gatewayUrl: string;
  /**
   * Bearer token for authentication
   */
  authToken: string;
  /**
   * Name of person/service uploading files (defaults to user ID from JWT)
   */
  uploader?: string;
  /**
   * Custom fetch implementation (optional, for testing)
   */
  fetchImpl?: typeof fetch;
}

/**
 * Extract user ID from JWT token (without verification)
 */
function getUserIdFromToken(token: string): string | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    // Decode base64url payload
    const payload = parts[1]
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    // Handle browser vs Node.js
    let decoded: string;
    if (typeof atob === 'function') {
      decoded = atob(payload);
    } else {
      decoded = Buffer.from(payload, 'base64').toString('utf-8');
    }

    const data = JSON.parse(decoded);
    return data.sub || null;
  } catch {
    return null;
  }
}

export interface CreateCollectionUploadOptions {
  /**
   * Files to upload - directory path (Node.js) or File[]/FileList (browser)
   */
  files: string | File[] | FileList;
  /**
   * Collection metadata
   */
  collectionMetadata: CreateCollectionPayload;
  /**
   * Custom prompts for AI processing
   */
  customPrompts?: CustomPrompts;
  /**
   * Processing options (OCR, IIIF, etc.)
   */
  processing?: ProcessingConfig;
  /**
   * Progress callback
   */
  onProgress?: (progress: UploadProgress) => void;
  /**
   * Dry run mode
   */
  dryRun?: boolean;
}

export interface AddToCollectionOptions {
  /**
   * Files to upload - directory path (Node.js) or File[]/FileList (browser)
   */
  files: string | File[] | FileList;
  /**
   * Parent PI to add files under (must be within a collection you can edit)
   */
  parentPi: string;
  /**
   * Custom prompts for AI processing
   */
  customPrompts?: CustomPrompts;
  /**
   * Processing options (OCR, IIIF, etc.)
   */
  processing?: ProcessingConfig;
  /**
   * Progress callback
   */
  onProgress?: (progress: UploadProgress) => void;
  /**
   * Dry run mode
   */
  dryRun?: boolean;
}

export interface CreateCollectionUploadResult extends BatchResult {
  /**
   * The created collection
   */
  collection: Collection & { rootPi: string };
}

/**
 * High-level upload client with collections integration
 *
 * @example
 * ```typescript
 * import { UploadClient } from '@arke-institute/sdk';
 *
 * const client = new UploadClient({
 *   gatewayUrl: 'https://api.arke.institute',
 *   authToken: 'your-jwt-token',
 *   uploader: 'my-app',
 * });
 *
 * // Create a new collection from files
 * const result = await client.createCollection({
 *   files: './photos',
 *   collectionMetadata: { title: 'My Archive', slug: 'my-archive' },
 * });
 *
 * // Add files to an existing collection
 * await client.addToCollection({
 *   files: './more-photos',
 *   parentPi: result.collection.rootPi,
 * });
 * ```
 */
export class UploadClient {
  private config: UploadClientConfig & { uploader: string };
  private collectionsClient: CollectionsClient;

  constructor(config: UploadClientConfig) {
    // Default uploader to user ID from JWT if not provided
    const uploader = config.uploader || getUserIdFromToken(config.authToken) || 'unknown';

    this.config = { ...config, uploader };
    this.collectionsClient = new CollectionsClient({
      gatewayUrl: config.gatewayUrl,
      authToken: config.authToken,
      fetchImpl: config.fetchImpl,
    });
  }

  /**
   * Update the auth token (e.g., after token refresh)
   */
  setAuthToken(token: string) {
    this.config = { ...this.config, authToken: token };
    this.collectionsClient.setAuthToken(token);
  }

  /**
   * Create a new collection and upload files to it
   *
   * Anyone authenticated can create a new collection.
   * The root PI of the uploaded files becomes the collection's root.
   */
  async createCollection(
    options: CreateCollectionUploadOptions
  ): Promise<CreateCollectionUploadResult> {
    const { files, collectionMetadata, customPrompts, processing, onProgress, dryRun } = options;

    // Default visibility to 'public' if not specified
    const metadata = {
      ...collectionMetadata,
      visibility: collectionMetadata.visibility || 'public',
    };

    // Create uploader for the batch
    const uploader = new ArkeUploader({
      gatewayUrl: this.config.gatewayUrl,
      authToken: this.config.authToken,
      uploader: this.config.uploader,
      customPrompts,
      processing,
    });

    // Upload the files first
    const batchResult = await uploader.uploadBatch(files as any, {
      onProgress,
      dryRun,
    });

    if (dryRun) {
      return {
        ...batchResult,
        collection: {
          id: 'dry-run',
          title: metadata.title,
          slug: metadata.slug,
          description: metadata.description,
          visibility: metadata.visibility,
          rootPi: 'dry-run',
        },
      };
    }

    // Register the root PI as a collection
    // The uploader returns the real rootPi after discovery completes
    const collection = await this.collectionsClient.registerRoot({
      ...metadata,
      rootPi: batchResult.rootPi,
    });

    return {
      ...batchResult,
      collection,
    };
  }

  /**
   * Add files to an existing collection
   *
   * Requires owner or editor role on the collection containing the parent PI.
   * Use this to add a folder or files to an existing collection hierarchy.
   *
   * Note: Permission checks are enforced server-side by the ingest worker.
   * The server will return 403 if the user lacks edit access to the parent PI.
   */
  async addToCollection(options: AddToCollectionOptions): Promise<BatchResult> {
    const { files, parentPi, customPrompts, processing, onProgress, dryRun } = options;

    // Create uploader with the parent PI
    const uploader = new ArkeUploader({
      gatewayUrl: this.config.gatewayUrl,
      authToken: this.config.authToken,
      uploader: this.config.uploader,
      parentPi,
      customPrompts,
      processing,
    });

    // Upload the files
    return uploader.uploadBatch(files as any, {
      onProgress,
      dryRun,
    });
  }

  /**
   * Check if you can edit a specific PI (i.e., add files to its collection)
   */
  async canEdit(pi: string): Promise<PiPermissions> {
    return this.collectionsClient.getPiPermissions(pi);
  }

  /**
   * Get access to the underlying collections client for other operations
   */
  get collections(): CollectionsClient {
    return this.collectionsClient;
  }
}
