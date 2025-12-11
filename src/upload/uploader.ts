/**
 * Main ArkeUploader SDK class
 */

import type {
  UploaderConfig,
  UploadOptions,
  UploadProgress,
  BatchResult,
} from './types/config.js';
import type { FileInfo } from './types/file.js';
import { WorkerClient } from './lib/worker-client-fetch.js';
import { detectPlatform, type PlatformScanner, type FileSource } from './platforms/common.js';
import { uploadSimple } from './lib/simple-fetch.js';
import { uploadMultipart } from './lib/multipart-fetch.js';
import { ValidationError } from './utils/errors.js';
import { validateBatchSize, validateCustomPrompts, validateCustomPromptsLocation } from './lib/validation.js';

const MULTIPART_THRESHOLD = 5 * 1024 * 1024; // 5 MB

/**
 * Upload client for Arke Institute's ingest service
 * Works in Node.js, browsers, and other JavaScript runtimes
 */
export class ArkeUploader {
  private config: UploaderConfig;
  private workerClient: WorkerClient;
  private scanner: PlatformScanner | null = null;
  private platform: 'node' | 'browser' | 'unknown';

  constructor(config: UploaderConfig) {
    // Validate that customPrompts is not incorrectly placed in processing config
    validateCustomPromptsLocation(config.processing);

    this.config = {
      rootPath: '/uploads',  // Must have at least one segment (not just '/')
      parallelUploads: 5,
      parallelParts: 3,
      ...config,
    };

    this.workerClient = new WorkerClient({
      baseUrl: config.gatewayUrl,
      authToken: config.authToken,
      timeout: config.timeout,
      maxRetries: config.maxRetries,
      retryInitialDelay: config.retryInitialDelay,
      retryMaxDelay: config.retryMaxDelay,
      retryJitter: config.retryJitter,
      debug: false,
    });

    this.platform = detectPlatform();
  }

  /**
   * Get platform-specific scanner
   */
  private async getScanner(): Promise<PlatformScanner> {
    if (this.scanner) {
      return this.scanner;
    }

    if (this.platform === 'node') {
      const { NodeScanner } = await import('./platforms/node.js');
      this.scanner = new NodeScanner();
    } else if (this.platform === 'browser') {
      const { BrowserScanner } = await import('./platforms/browser.js');
      this.scanner = new BrowserScanner();
    } else {
      throw new ValidationError('Unsupported platform');
    }

    return this.scanner;
  }

  /**
   * Upload a batch of files
   * @param source - Directory path (Node.js) or File[]/FileList (browser)
   * @param options - Upload options
   */
  async uploadBatch(
    source: FileSource | FileSource[],
    options: UploadOptions = {}
  ): Promise<BatchResult> {
    const startTime = Date.now();
    const { onProgress, dryRun = false } = options;

    // Phase 1: Scanning
    this.reportProgress(onProgress, {
      phase: 'scanning',
      filesTotal: 0,
      filesUploaded: 0,
      bytesTotal: 0,
      bytesUploaded: 0,
      percentComplete: 0,
    });

    const scanner = await this.getScanner();
    const files = await scanner.scanFiles(source, {
      rootPath: this.config.rootPath || '/',
      followSymlinks: true,
      defaultProcessingConfig: this.config.processing,
    });

    if (files.length === 0) {
      throw new ValidationError('No files found to upload');
    }

    const totalSize = files.reduce((sum, f) => sum + f.size, 0);
    validateBatchSize(totalSize);

    // Validate custom prompts if provided
    if (this.config.customPrompts) {
      validateCustomPrompts(this.config.customPrompts);

      // Log which custom prompts are being used
      const promptFields = Object.keys(this.config.customPrompts).filter(
        key => this.config.customPrompts![key as keyof typeof this.config.customPrompts]
      );
      console.log(`[Arke Upload SDK] Custom prompts configured: ${promptFields.join(', ')}`);
    }

    if (dryRun) {
      return {
        batchId: 'dry-run',
        rootPi: 'dry-run',
        filesUploaded: files.length,
        bytesUploaded: totalSize,
        durationMs: Date.now() - startTime,
      };
    }

    // Phase 2: Initialize batch
    const { batch_id } = await this.workerClient.initBatch({
      uploader: this.config.uploader,
      root_path: this.config.rootPath || '/',
      parent_pi: this.config.parentPi || '',
      metadata: this.config.metadata,
      file_count: files.length,
      total_size: totalSize,
      custom_prompts: this.config.customPrompts,
    });

    // Confirm custom prompts were sent
    if (this.config.customPrompts) {
      console.log(`[Arke Upload SDK] Custom prompts sent to worker for batch ${batch_id}`);
    }

    // Phase 3: Upload files
    this.reportProgress(onProgress, {
      phase: 'uploading',
      filesTotal: files.length,
      filesUploaded: 0,
      bytesTotal: totalSize,
      bytesUploaded: 0,
      percentComplete: 0,
    });

    let filesUploaded = 0;
    let bytesUploaded = 0;

    // Upload files with concurrency control
    const { failedFiles } = await this.uploadFilesWithConcurrency(
      batch_id,
      files,
      source,
      this.config.parallelUploads || 5,
      (file, bytes) => {
        filesUploaded++;
        bytesUploaded += bytes;

        this.reportProgress(onProgress, {
          phase: 'uploading',
          filesTotal: files.length,
          filesUploaded,
          bytesTotal: totalSize,
          bytesUploaded,
          currentFile: file.fileName,
          percentComplete: Math.round((bytesUploaded / totalSize) * 100),
        });
      }
    );

    // Check if all files failed
    if (failedFiles.length === files.length) {
      throw new ValidationError(
        `All ${files.length} files failed to upload. First error: ${failedFiles[0]?.error || 'Unknown'}`
      );
    }

    // Log warning if some files failed but continue with finalization
    if (failedFiles.length > 0) {
      console.warn(
        `Warning: ${failedFiles.length} of ${files.length} files failed to upload:`,
        failedFiles.map(f => `${f.file.fileName}: ${f.error}`).join(', ')
      );
    }

    // Phase 4: Finalize and get root_pi
    this.reportProgress(onProgress, {
      phase: 'finalizing',
      filesTotal: files.length,
      filesUploaded,
      bytesTotal: totalSize,
      bytesUploaded,
      percentComplete: 95,
    });

    const finalizeResult = await this.workerClient.finalizeBatch(batch_id);

    // Get root_pi - either immediately (sync discovery) or via polling (async discovery)
    let rootPi: string;

    if (finalizeResult.root_pi) {
      // Sync path - root_pi available immediately
      rootPi = finalizeResult.root_pi;
    } else if (finalizeResult.status === 'discovery') {
      // Async path - poll until discovery completes
      this.reportProgress(onProgress, {
        phase: 'discovery',
        filesTotal: files.length,
        filesUploaded,
        bytesTotal: totalSize,
        bytesUploaded,
        percentComplete: 97,
      });

      rootPi = await this.pollForRootPi(batch_id, onProgress, files.length, totalSize, bytesUploaded);
    } else {
      // Unexpected state - this shouldn't happen but handle gracefully
      throw new ValidationError(
        `Finalization returned unexpected status: ${finalizeResult.status} without root_pi`
      );
    }

    // Complete
    this.reportProgress(onProgress, {
      phase: 'complete',
      filesTotal: files.length,
      filesUploaded,
      bytesTotal: totalSize,
      bytesUploaded,
      percentComplete: 100,
    });

    return {
      batchId: batch_id,
      rootPi,
      filesUploaded,
      bytesUploaded,
      durationMs: Date.now() - startTime,
    };
  }

  /**
   * Poll for root_pi during async discovery
   */
  private async pollForRootPi(
    batchId: string,
    onProgress: ((progress: UploadProgress) => void) | undefined,
    filesTotal: number,
    bytesTotal: number,
    bytesUploaded: number
  ): Promise<string> {
    const POLL_INTERVAL_MS = 2000;
    const MAX_POLL_TIME_MS = 30 * 60 * 1000; // 30 minutes
    const startTime = Date.now();

    while (Date.now() - startTime < MAX_POLL_TIME_MS) {
      const status = await this.workerClient.getBatchStatus(batchId);

      if (status.root_pi) {
        return status.root_pi;
      }

      if (status.status === 'failed') {
        throw new ValidationError(`Batch discovery failed`);
      }

      // Report discovery progress if available
      if (status.discovery_progress && onProgress) {
        const { total, published } = status.discovery_progress;
        const discoveryPercent = total > 0 ? Math.round((published / total) * 100) : 0;
        this.reportProgress(onProgress, {
          phase: 'discovery',
          filesTotal,
          filesUploaded: filesTotal,
          bytesTotal,
          bytesUploaded,
          percentComplete: 95 + Math.round(discoveryPercent * 0.04), // 95-99%
        });
      }

      // Wait before polling again
      await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL_MS));
    }

    throw new ValidationError(`Discovery timed out after ${MAX_POLL_TIME_MS / 1000} seconds`);
  }

  /**
   * Upload files with controlled concurrency
   */
  private async uploadFilesWithConcurrency(
    batchId: string,
    files: FileInfo[],
    source: FileSource | FileSource[],
    concurrency: number,
    onFileComplete: (file: FileInfo, bytes: number) => void
  ): Promise<{ failedFiles: Array<{ file: FileInfo; error: string }> }> {
    const queue = [...files];
    const workers: Promise<void>[] = [];
    const failedFiles: Array<{ file: FileInfo; error: string }> = [];

    const processNext = async () => {
      while (queue.length > 0) {
        const file = queue.shift()!;
        try {
          await this.uploadSingleFile(batchId, file, source);
          onFileComplete(file, file.size);
        } catch (error: any) {
          // Log the error but continue with other files
          const errorMessage = error.message || 'Unknown error';
          console.error(`Failed to upload ${file.fileName}: ${errorMessage}`);
          failedFiles.push({ file, error: errorMessage });
          // Don't re-throw - continue processing other files
        }
      }
    };

    // Start concurrent workers
    for (let i = 0; i < Math.min(concurrency, files.length); i++) {
      workers.push(processNext());
    }

    await Promise.all(workers);
    return { failedFiles };
  }

  /**
   * Upload a single file
   */
  private async uploadSingleFile(
    batchId: string,
    file: FileInfo,
    source: FileSource | FileSource[]
  ): Promise<void> {
    // Request presigned URL(s)
    const uploadInfo = await this.workerClient.startFileUpload(batchId, {
      file_name: file.fileName,
      file_size: file.size,
      logical_path: file.logicalPath,
      content_type: file.contentType,
      cid: file.cid,
      processing_config: file.processingConfig,
    });

    // Get file data
    const fileData = await this.getFileData(file, source);

    // Prepare retry options
    const retryOptions = {
      maxRetries: this.config.maxRetries,
      retryInitialDelay: this.config.retryInitialDelay,
      retryMaxDelay: this.config.retryMaxDelay,
      retryJitter: this.config.retryJitter,
    };

    // Upload to R2
    if (uploadInfo.upload_type === 'simple') {
      await uploadSimple(fileData, uploadInfo.presigned_url!, file.contentType, retryOptions);
    } else {
      // Multipart upload - map presigned URLs to array of URL strings
      const partUrls = uploadInfo.presigned_urls!.map((p) => p.url);
      const parts = await uploadMultipart(
        fileData,
        partUrls,
        this.config.parallelParts || 3,
        retryOptions
      );

      // Complete multipart upload
      await this.workerClient.completeFileUpload(batchId, {
        r2_key: uploadInfo.r2_key,
        upload_id: uploadInfo.upload_id!,
        parts,
      });

      return;
    }

    // Complete simple upload
    await this.workerClient.completeFileUpload(batchId, {
      r2_key: uploadInfo.r2_key,
    });
  }

  /**
   * Get file data based on platform
   */
  private async getFileData(
    file: FileInfo,
    source: FileSource | FileSource[]
  ): Promise<ArrayBuffer> {
    if (this.platform === 'node') {
      // Read from filesystem
      const fs = await import('fs/promises');
      const buffer = await fs.readFile(file.localPath);
      return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
    } else if (this.platform === 'browser') {
      // Find the File object from source
      const files = Array.isArray(source) ? source : [source];
      const browserFile = files.find(
        (f) => f instanceof File && f.name === file.fileName
      ) as File | undefined;

      if (!browserFile) {
        throw new Error(`Could not find browser File object for ${file.fileName}`);
      }

      return browserFile.arrayBuffer();
    }

    throw new Error('Unsupported platform for file reading');
  }

  /**
   * Report progress to callback
   */
  private reportProgress(
    callback: ((progress: UploadProgress) => void) | undefined,
    progress: UploadProgress
  ): void {
    if (callback) {
      callback(progress);
    }
  }
}
