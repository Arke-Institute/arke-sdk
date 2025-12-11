/**
 * Common platform types and utilities
 */

import type { FileInfo } from '../types/file.js';
import type { ProcessingConfig } from '../types/processing.js';

/**
 * Platform-specific file source
 * Can be a path string (Node.js) or File object (Browser)
 */
export type FileSource = string | File;

/**
 * Platform-specific scanner interface
 */
export interface PlatformScanner {
  /**
   * Scan files from the provided source
   * @param source - File source (path for Node.js, File[] for browser)
   * @param options - Scan options
   */
  scanFiles(
    source: FileSource | FileSource[],
    options: PlatformScanOptions
  ): Promise<FileInfo[]>;

  /**
   * Read file contents as ArrayBuffer
   * @param file - FileInfo with platform-specific localPath
   */
  readFile(file: FileInfo): Promise<ArrayBuffer>;
}

/**
 * Options for platform scanning
 */
export interface PlatformScanOptions {
  /**
   * Logical root path for the batch
   */
  rootPath: string;

  /**
   * Follow symbolic links (Node.js only)
   */
  followSymlinks?: boolean;

  /**
   * Default processing configuration
   */
  defaultProcessingConfig?: ProcessingConfig;
}

/**
 * Detect current runtime platform
 */
export function detectPlatform(): 'node' | 'browser' | 'unknown' {
  // Check for Node.js
  if (
    typeof process !== 'undefined' &&
    process.versions != null &&
    process.versions.node != null
  ) {
    return 'node';
  }

  // Check for browser
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    return 'browser';
  }

  return 'unknown';
}

/**
 * Normalize path separators to forward slashes
 */
export function normalizePath(p: string): string {
  return p.replace(/\\/g, '/');
}

/**
 * Get file extension from filename
 */
export function getExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.');
  return lastDot === -1 ? '' : filename.slice(lastDot + 1).toLowerCase();
}

/**
 * Get MIME type from filename
 */
export function getMimeType(filename: string): string {
  const ext = getExtension(filename);

  // Basic MIME type mapping
  const mimeTypes: Record<string, string> = {
    // Images
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'tif': 'image/tiff',
    'tiff': 'image/tiff',
    'bmp': 'image/bmp',
    'svg': 'image/svg+xml',

    // Documents
    'pdf': 'application/pdf',
    'txt': 'text/plain',
    'json': 'application/json',
    'xml': 'application/xml',
    'html': 'text/html',
    'htm': 'text/html',
    'css': 'text/css',
    'js': 'application/javascript',

    // Archives
    'zip': 'application/zip',
    'tar': 'application/x-tar',
    'gz': 'application/gzip',

    // Audio
    'mp3': 'audio/mpeg',
    'wav': 'audio/wav',
    'ogg': 'audio/ogg',

    // Video
    'mp4': 'video/mp4',
    'webm': 'video/webm',
    'mov': 'video/quicktime',
  };

  return mimeTypes[ext] || 'application/octet-stream';
}
