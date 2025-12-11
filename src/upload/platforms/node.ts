/**
 * Node.js platform adapter for file scanning
 */

import fs from 'fs/promises';
import path from 'path';
import type { FileInfo } from '../types/file.js';
import { ScanError } from '../utils/errors.js';
import { validateFileSize, validateLogicalPath, validateRefJson } from '../lib/validation.js';
import { computeFileCID } from '../utils/hash.js';
import { DEFAULT_PROCESSING_CONFIG, type ProcessingConfig } from '../types/processing.js';
import type { PlatformScanner, PlatformScanOptions } from './common.js';
import { normalizePath, getMimeType } from './common.js';

/**
 * Node.js file scanner implementation
 */
export class NodeScanner implements PlatformScanner {
  /**
   * Scan directory recursively and collect file metadata
   */
  async scanFiles(
    source: string | string[],
    options: PlatformScanOptions
  ): Promise<FileInfo[]> {
    const dirPath = Array.isArray(source) ? source[0] : source;

    if (!dirPath || typeof dirPath !== 'string') {
      throw new ScanError('Node.js scanner requires a directory path', '');
    }

    const files: FileInfo[] = [];

    // Validate directory exists
    try {
      const stats = await fs.stat(dirPath);
      if (!stats.isDirectory()) {
        throw new ScanError(`Path is not a directory: ${dirPath}`, dirPath);
      }
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        throw new ScanError(`Directory not found: ${dirPath}`, dirPath);
      }
      throw new ScanError(`Cannot access directory: ${error.message}`, dirPath);
    }

    // Validate logical path
    validateLogicalPath(options.rootPath);

    const globalProcessingConfig = options.defaultProcessingConfig || DEFAULT_PROCESSING_CONFIG;

    /**
     * Load processing config from directory
     */
    async function loadDirectoryProcessingConfig(
      dirPath: string
    ): Promise<ProcessingConfig | null> {
      const configPath = path.join(dirPath, '.arke-process.json');
      try {
        const content = await fs.readFile(configPath, 'utf-8');
        return JSON.parse(content);
      } catch (error: any) {
        if (error.code !== 'ENOENT') {
          console.warn(`Error reading processing config ${configPath}: ${error.message}`);
        }
        return null;
      }
    }

    /**
     * Merge configs
     */
    function mergeProcessingConfig(
      defaults: ProcessingConfig,
      override: Partial<ProcessingConfig> | null
    ): ProcessingConfig {
      if (!override) return defaults;
      return {
        ocr: override.ocr ?? defaults.ocr,
        describe: override.describe ?? defaults.describe,
        pinax: override.pinax ?? defaults.pinax,
      };
    }

    /**
     * Recursive walker
     */
    async function walk(currentPath: string, relativePath: string = ''): Promise<void> {
      const dirConfigOverride = await loadDirectoryProcessingConfig(currentPath);
      const currentProcessingConfig = mergeProcessingConfig(
        globalProcessingConfig,
        dirConfigOverride
      );

      let entries;
      try {
        entries = await fs.readdir(currentPath, { withFileTypes: true });
      } catch (error: any) {
        console.warn(`Cannot read directory: ${currentPath}`, error.message);
        return;
      }

      for (const entry of entries) {
        const fullPath = path.join(currentPath, entry.name);
        const relPath = path.join(relativePath, entry.name);

        try {
          // Handle symlinks
          if (entry.isSymbolicLink()) {
            if (!options.followSymlinks) {
              continue;
            }

            const stats = await fs.stat(fullPath);
            if (stats.isDirectory()) {
              await walk(fullPath, relPath);
            } else if (stats.isFile()) {
              await processFile(fullPath, relPath, stats.size, currentProcessingConfig);
            }
            continue;
          }

          // Handle directories
          if (entry.isDirectory()) {
            await walk(fullPath, relPath);
            continue;
          }

          // Handle regular files
          if (entry.isFile()) {
            const stats = await fs.stat(fullPath);
            await processFile(fullPath, relPath, stats.size, currentProcessingConfig);
          }
        } catch (error: any) {
          if (error instanceof ScanError && error.message.includes('.ref.json')) {
            throw error;
          }
          console.warn(`Error processing ${fullPath}: ${error.message}`);
          continue;
        }
      }
    }

    /**
     * Process single file
     */
    async function processFile(
      fullPath: string,
      relativePath: string,
      size: number,
      processingConfig: ProcessingConfig
    ): Promise<void> {
      const fileName = path.basename(fullPath);

      // Skip processing config files
      if (fileName === '.arke-process.json') {
        return;
      }

      // Validate .ref.json files
      if (fileName.endsWith('.ref.json')) {
        try {
          const content = await fs.readFile(fullPath, 'utf-8');
          validateRefJson(content, fileName, console);
        } catch (error: any) {
          throw new ScanError(
            `Invalid .ref.json file: ${fileName} - ${error.message}`,
            fullPath
          );
        }
      }

      // Validate file size
      try {
        validateFileSize(size);
      } catch (error: any) {
        console.warn(`Skipping file that exceeds size limit: ${fileName}`, error.message);
        return;
      }

      // Construct logical path
      const normalizedRelPath = normalizePath(relativePath);
      const logicalPath = path.posix.join(options.rootPath, normalizedRelPath);

      // Validate logical path
      try {
        validateLogicalPath(logicalPath);
      } catch (error: any) {
        console.warn(`Skipping file with invalid logical path: ${logicalPath}`, error.message);
        return;
      }

      // Determine content type
      const contentType = getMimeType(fileName);

      // Check if file is readable
      try {
        await fs.access(fullPath, fs.constants.R_OK);
      } catch (error) {
        console.warn(`Skipping unreadable file: ${fullPath}`);
        return;
      }

      // Compute CID (optional - continue without if computation fails)
      let cid: string | undefined;
      try {
        cid = await computeFileCID(fullPath);
      } catch (error: any) {
        console.warn(`Warning: CID computation failed for ${fullPath}, continuing without CID:`, error.message);
        cid = undefined;
      }

      // Add to results
      files.push({
        localPath: fullPath,
        logicalPath,
        fileName,
        size,
        contentType,
        cid,
        processingConfig,
      });
    }

    // Start scan
    await walk(dirPath);

    // Sort by size (smallest first)
    files.sort((a, b) => a.size - b.size);

    return files;
  }

  /**
   * Read file contents as ArrayBuffer
   */
  async readFile(file: FileInfo): Promise<ArrayBuffer> {
    const buffer = await fs.readFile(file.localPath);
    return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
  }
}
