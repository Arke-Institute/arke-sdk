/**
 * Browser platform adapter for file handling
 */

import type { FileInfo } from '../types/file.js';
import { ScanError } from '../utils/errors.js';
import { validateFileSize, validateLogicalPath } from '../lib/validation.js';
import { computeCIDFromBuffer } from '../utils/hash.js';
import { DEFAULT_PROCESSING_CONFIG } from '../types/processing.js';
import type { PlatformScanner, PlatformScanOptions } from './common.js';
import { normalizePath, getMimeType } from './common.js';

/**
 * Browser file scanner implementation
 */
export class BrowserScanner implements PlatformScanner {
  /**
   * Scan files from File or FileList
   */
  async scanFiles(
    source: File | File[],
    options: PlatformScanOptions
  ): Promise<FileInfo[]> {
    const fileList = Array.isArray(source) ? source : [source];

    if (fileList.length === 0) {
      throw new ScanError('No files provided', '');
    }

    // Validate logical path
    validateLogicalPath(options.rootPath);

    const globalProcessingConfig = options.defaultProcessingConfig || DEFAULT_PROCESSING_CONFIG;
    const files: FileInfo[] = [];

    for (const file of fileList) {
      try {
        const fileInfo = await this.processFile(file, options.rootPath, globalProcessingConfig);
        if (fileInfo) {
          files.push(fileInfo);
        }
      } catch (error: any) {
        console.warn(`Error processing ${file.name}: ${error.message}`);
        continue;
      }
    }

    // Sort by size (smallest first)
    files.sort((a, b) => a.size - b.size);

    return files;
  }

  /**
   * Process a single File object
   */
  private async processFile(
    file: File,
    rootPath: string,
    processingConfig: any
  ): Promise<FileInfo | null> {
    const fileName = file.name;
    const size = file.size;

    // Skip hidden files (starting with .) - includes .DS_Store, .gitignore, etc.
    // These often have permission issues or are constantly modified by the OS
    if (fileName.startsWith('.')) {
      return null;
    }

    // Skip common system/temp files that shouldn't be uploaded
    const skipFiles = ['Thumbs.db', 'desktop.ini', '__MACOSX'];
    if (skipFiles.includes(fileName)) {
      return null;
    }

    // Skip processing config files
    if (fileName === '.arke-process.json') {
      return null;
    }

    // Validate file size
    try {
      validateFileSize(size);
    } catch (error: any) {
      console.warn(`Skipping file that exceeds size limit: ${fileName}`, error.message);
      return null;
    }

    // Extract relative path from file.webkitRelativePath or use just the filename
    let relativePath = '';
    if ('webkitRelativePath' in file && file.webkitRelativePath) {
      // For directory uploads, extract relative path
      const parts = file.webkitRelativePath.split('/');
      // Remove the first part (directory name) and join the rest
      if (parts.length > 1) {
        relativePath = parts.slice(1).join('/');
      } else {
        relativePath = fileName;
      }
    } else {
      relativePath = fileName;
    }

    // Construct logical path
    const normalizedRelPath = normalizePath(relativePath);
    const logicalPath = `${rootPath}/${normalizedRelPath}`.replace(/\/+/g, '/');

    // Validate logical path
    try {
      validateLogicalPath(logicalPath);
    } catch (error: any) {
      console.warn(`Skipping file with invalid logical path: ${logicalPath}`, error.message);
      return null;
    }

    // Determine content type
    const contentType = file.type || getMimeType(fileName);

    // Compute CID (optional - continue without if computation fails)
    let cid: string | undefined;
    try {
      const buffer = await file.arrayBuffer();
      cid = await computeCIDFromBuffer(new Uint8Array(buffer));
    } catch (error: any) {
      console.warn(`Warning: CID computation failed for ${fileName}, continuing without CID:`, error.message);
      cid = undefined;
    }

    // For browser files, we store the File object itself as a special marker
    // The actual File object will be passed separately during upload
    return {
      localPath: `__browser_file__${fileName}`, // Special marker for browser files
      logicalPath,
      fileName,
      size,
      contentType,
      cid,
      processingConfig,
    };
  }

  /**
   * Read file contents as ArrayBuffer
   * Note: In browser context, the File object should be passed directly
   */
  async readFile(file: FileInfo): Promise<ArrayBuffer> {
    throw new Error('Browser scanner requires File objects to be provided directly during upload');
  }
}
