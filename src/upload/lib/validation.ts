/**
 * Validation utilities for paths, files, and configuration
 */

import { ValidationError } from '../utils/errors.js';
import type { CustomPrompts } from '../types/config.js';

// Size limits per API spec
const MAX_FILE_SIZE = 5 * 1024 * 1024 * 1024; // 5 GB
const MAX_BATCH_SIZE = 100 * 1024 * 1024 * 1024; // 100 GB

// Invalid path characters
const INVALID_PATH_CHARS = /[<>:"|?*\x00-\x1f]/;

// Image MIME types that will be processed by OCR
const OCR_PROCESSABLE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
];

/**
 * Get file extension (including the dot)
 */
export function getFileExtension(fileName: string): string {
  const match = fileName.match(/\.[^.]+$/);
  return match ? match[0] : '';
}

/**
 * Validate file size
 */
export function validateFileSize(size: number): void {
  if (size <= 0) {
    throw new ValidationError('File size must be greater than 0');
  }
  if (size > MAX_FILE_SIZE) {
    throw new ValidationError(
      `File size (${formatBytes(size)}) exceeds maximum allowed size (${formatBytes(MAX_FILE_SIZE)})`
    );
  }
}

/**
 * Validate batch size
 */
export function validateBatchSize(totalSize: number): void {
  if (totalSize > MAX_BATCH_SIZE) {
    throw new ValidationError(
      `Total batch size (${formatBytes(totalSize)}) exceeds maximum allowed size (${formatBytes(MAX_BATCH_SIZE)})`
    );
  }
}

/**
 * Validate logical path format
 */
export function validateLogicalPath(path: string): void {
  // Must start with /
  if (!path.startsWith('/')) {
    throw new ValidationError('Logical path must start with /', 'path');
  }

  // No invalid characters
  if (INVALID_PATH_CHARS.test(path)) {
    throw new ValidationError(
      'Logical path contains invalid characters',
      'path'
    );
  }

  // Allow "/" as root path, otherwise require at least one segment
  const segments = path.split('/').filter((s) => s.length > 0);
  if (segments.length === 0 && path !== '/') {
    throw new ValidationError('Logical path cannot be empty', 'path');
  }

  // No . or .. segments (directory traversal)
  for (const segment of segments) {
    if (segment === '.' || segment === '..') {
      throw new ValidationError(
        'Logical path cannot contain . or .. segments',
        'path'
      );
    }
  }
}

/**
 * Validate worker URL
 */
export function validateWorkerUrl(url: string): void {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      throw new Error('Protocol must be http or https');
    }
  } catch (error: any) {
    throw new ValidationError(`Invalid worker URL: ${error.message}`, 'workerUrl');
  }
}

/**
 * Validate uploader name
 */
export function validateUploader(uploader: string): void {
  if (!uploader || uploader.trim().length === 0) {
    throw new ValidationError('Uploader name cannot be empty', 'uploader');
  }
}

/**
 * Validate parent PI format
 * Note: Existence validation happens at worker level
 */
export function validateParentPi(pi: string): void {
  // PI must be exactly 26 characters (ULID format)
  if (pi.length !== 26) {
    throw new ValidationError(
      'parent_pi must be exactly 26 characters',
      'parent_pi'
    );
  }

  // PI must be alphanumeric (case-insensitive)
  if (!/^[0-9A-Z]{26}$/i.test(pi)) {
    throw new ValidationError(
      'parent_pi must contain only alphanumeric characters (0-9, A-Z)',
      'parent_pi'
    );
  }
}

/**
 * Validate metadata JSON
 */
export function validateMetadata(metadata: string): Record<string, any> {
  try {
    const parsed = JSON.parse(metadata);
    if (typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new Error('Metadata must be a JSON object');
    }
    return parsed;
  } catch (error: any) {
    throw new ValidationError(`Invalid metadata JSON: ${error.message}`, 'metadata');
  }
}

/**
 * Validate .ref.json file content
 *
 * Required fields:
 * - url: Publicly accessible HTTP(S) URL to the referenced resource
 *
 * Optional fields:
 * - type: MIME type (e.g., 'image/jpeg', 'application/pdf')
 * - size: File size in bytes
 * - filename: Original filename for display
 * - ocr: Pre-existing OCR text (if already processed)
 *
 * Note: All other fields are allowed and will be passed through to the worker.
 */
export function validateRefJson(content: string, fileName: string, logger?: any): void {
  let parsed: any;

  // Parse JSON
  try {
    parsed = JSON.parse(content);
  } catch (error: any) {
    throw new ValidationError(
      `Invalid JSON in ${fileName}: ${error.message}`,
      'ref'
    );
  }

  // Must be an object
  if (typeof parsed !== 'object' || Array.isArray(parsed) || parsed === null) {
    throw new ValidationError(
      `${fileName} must contain a JSON object`,
      'ref'
    );
  }

  // Required field: url
  if (!parsed.url || typeof parsed.url !== 'string') {
    throw new ValidationError(
      `${fileName} must contain a 'url' field with a string value`,
      'ref'
    );
  }

  // Validate URL format
  try {
    const url = new URL(parsed.url);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      throw new Error('URL must use HTTP or HTTPS protocol');
    }
  } catch (error: any) {
    throw new ValidationError(
      `Invalid URL in ${fileName}: ${error.message}`,
      'ref'
    );
  }

  // Warn if type field is missing
  if (!parsed.type) {
    if (logger) {
      logger.warn(`${fileName}: Missing 'type' field (optional but recommended)`);
    }
  }

  // Warn if type is OCR-processable but extension not in filename
  if (parsed.type && OCR_PROCESSABLE_TYPES.includes(parsed.type)) {
    const typeToExt: { [key: string]: string } = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/webp': '.webp',
    };

    const expectedExt = typeToExt[parsed.type];
    if (expectedExt && !fileName.includes(`${expectedExt}.ref.json`)) {
      if (logger) {
        logger.warn(
          `${fileName}: Type is '${parsed.type}' but filename doesn't include '${expectedExt}.ref.json' pattern. ` +
          `This file may not be processed by OCR. Consider renaming to include the extension (e.g., 'photo${expectedExt}.ref.json').`
        );
      }
    }
  }
}

/**
 * Format bytes to human-readable string
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

/**
 * Normalize path to POSIX format (forward slashes)
 */
export function normalizePath(path: string): string {
  return path.replace(/\\/g, '/');
}

/**
 * Validate TIFF quality (for future preprocessor configuration)
 */
export function validateTiffQuality(quality: number): void {
  if (isNaN(quality) || quality < 1 || quality > 100) {
    throw new ValidationError(
      'TIFF quality must be a number between 1 and 100',
      'tiffQuality'
    );
  }
}

/**
 * Validate custom prompts
 */
export function validateCustomPrompts(prompts?: CustomPrompts): void {
  if (!prompts) return;

  const MAX_LENGTH = 50000;      // 50KB per field - supports metadata file uploads
  const MAX_TOTAL_LENGTH = 75000; // 75KB total - stays under 128KB queue message limit
  const fields: Array<keyof CustomPrompts> = [
    'general',
    'reorganization',
    'pinax',
    'description',
    'cheimarros',
  ];

  let totalLength = 0;

  for (const field of fields) {
    const value = prompts[field];
    if (value) {
      if (value.length > MAX_LENGTH) {
        throw new ValidationError(
          `Custom prompt '${field}' exceeds maximum length of ${MAX_LENGTH} characters (current: ${value.length})`,
          'customPrompts'
        );
      }
      totalLength += value.length;
    }
  }

  if (totalLength > MAX_TOTAL_LENGTH) {
    throw new ValidationError(
      `Total custom prompts length (${totalLength}) exceeds maximum of ${MAX_TOTAL_LENGTH} characters`,
      'customPrompts'
    );
  }
}

/**
 * Validate that customPrompts is not incorrectly placed in processing config
 */
export function validateCustomPromptsLocation(processingConfig?: any): void {
  if (!processingConfig) return;

  // Check if customPrompts was incorrectly placed inside processing config
  if ('customPrompts' in processingConfig) {
    throw new ValidationError(
      'customPrompts must be a top-level field in UploaderConfig, not inside the processing config. ' +
      'Use: new ArkeUploader({ customPrompts: {...}, processing: {...} }) ' +
      'NOT: new ArkeUploader({ processing: { customPrompts: {...} } })',
      'processing'
    );
  }
}
