/**
 * Platform-specific Scanners
 *
 * Helpers to build UploadTree from different input sources.
 * These are optional utilities - users can also build UploadTree manually.
 */

/// <reference lib="dom" />

import type { UploadTree, UploadFile, UploadFolder } from './types.js';

/**
 * Detect MIME type from filename.
 * Falls back to 'application/octet-stream' if unknown.
 */
export function getMimeType(filename: string): string {
  const ext = filename.toLowerCase().split('.').pop() || '';

  const mimeTypes: Record<string, string> = {
    // Images
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    ico: 'image/x-icon',
    bmp: 'image/bmp',
    tiff: 'image/tiff',
    tif: 'image/tiff',

    // Documents
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ppt: 'application/vnd.ms-powerpoint',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    odt: 'application/vnd.oasis.opendocument.text',
    ods: 'application/vnd.oasis.opendocument.spreadsheet',
    odp: 'application/vnd.oasis.opendocument.presentation',

    // Text
    txt: 'text/plain',
    md: 'text/markdown',
    csv: 'text/csv',
    html: 'text/html',
    htm: 'text/html',
    css: 'text/css',
    xml: 'text/xml',
    rtf: 'application/rtf',

    // Code
    js: 'text/javascript',
    mjs: 'text/javascript',
    ts: 'text/typescript',
    jsx: 'text/javascript',
    tsx: 'text/typescript',
    json: 'application/json',
    yaml: 'text/yaml',
    yml: 'text/yaml',

    // Archives
    zip: 'application/zip',
    tar: 'application/x-tar',
    gz: 'application/gzip',
    rar: 'application/vnd.rar',
    '7z': 'application/x-7z-compressed',

    // Audio
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    ogg: 'audio/ogg',
    m4a: 'audio/mp4',
    flac: 'audio/flac',

    // Video
    mp4: 'video/mp4',
    webm: 'video/webm',
    avi: 'video/x-msvideo',
    mov: 'video/quicktime',
    mkv: 'video/x-matroska',

    // Fonts
    woff: 'font/woff',
    woff2: 'font/woff2',
    ttf: 'font/ttf',
    otf: 'font/otf',

    // Other
    wasm: 'application/wasm',
  };

  return mimeTypes[ext] || 'application/octet-stream';
}

// ─────────────────────────────────────────────────────────────────────────────
// Browser Scanners
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Scan browser FileSystemEntry objects (from drag-drop or showDirectoryPicker).
 *
 * **Browser only** - uses FileSystemEntry API.
 *
 * @param entries - FileSystemEntry array from DataTransferItem.webkitGetAsEntry()
 * @returns UploadTree ready for upload
 *
 * @example
 * ```typescript
 * // In a drop handler
 * dropzone.ondrop = async (e) => {
 *   const entries = Array.from(e.dataTransfer.items)
 *     .map(item => item.webkitGetAsEntry())
 *     .filter(Boolean);
 *
 *   const tree = await scanFileSystemEntries(entries);
 *   const result = await uploadTree(client, tree, { target: { collectionId: '...' } });
 * };
 * ```
 */
export async function scanFileSystemEntries(
  entries: FileSystemEntry[],
  options: {
    /** Patterns to ignore */
    ignore?: string[];
  } = {}
): Promise<UploadTree> {
  const { ignore = ['node_modules', '.git', '.DS_Store'] } = options;

  const files: UploadFile[] = [];
  const folders: UploadFolder[] = [];

  async function processEntry(entry: FileSystemEntry, parentPath: string): Promise<void> {
    const name = entry.name;

    // Skip ignored patterns
    if (ignore.some((pattern) => name === pattern)) {
      return;
    }

    const relativePath = parentPath ? `${parentPath}/${name}` : name;

    if (entry.isFile) {
      const fileEntry = entry as FileSystemFileEntry;

      // Get File object from FileSystemFileEntry
      const file = await new Promise<File>((resolve, reject) => {
        fileEntry.file(resolve, reject);
      });

      files.push({
        name,
        relativePath,
        size: file.size,
        mimeType: file.type || getMimeType(name),
        getData: async () => file.arrayBuffer(),
      });
    } else if (entry.isDirectory) {
      const dirEntry = entry as FileSystemDirectoryEntry;

      folders.push({
        name,
        relativePath,
      });

      // Read directory contents
      const reader = dirEntry.createReader();
      const childEntries = await new Promise<FileSystemEntry[]>((resolve, reject) => {
        const allEntries: FileSystemEntry[] = [];

        function readEntries() {
          reader.readEntries((entries) => {
            if (entries.length === 0) {
              resolve(allEntries);
            } else {
              allEntries.push(...entries);
              readEntries(); // Continue reading (readEntries returns max 100 at a time)
            }
          }, reject);
        }

        readEntries();
      });

      // Process children
      for (const childEntry of childEntries) {
        await processEntry(childEntry, relativePath);
      }
    }
  }

  // Process all root entries
  for (const entry of entries) {
    if (entry) {
      await processEntry(entry, '');
    }
  }

  // Sort folders by depth
  folders.sort((a, b) => a.relativePath.split('/').length - b.relativePath.split('/').length);

  return { files, folders };
}

/**
 * Build UploadTree from a FileList (from <input type="file"> with webkitdirectory).
 *
 * **Browser only** - uses File API.
 *
 * @param fileList - FileList from input element
 * @returns UploadTree ready for upload
 *
 * @example
 * ```typescript
 * <input type="file" webkitdirectory multiple onChange={async (e) => {
 *   const tree = await scanFileList(e.target.files);
 *   const result = await uploadTree(client, tree, { target: { collectionId: '...' } });
 * }} />
 * ```
 */
export async function scanFileList(
  fileList: FileList,
  options: {
    /** Patterns to ignore */
    ignore?: string[];
  } = {}
): Promise<UploadTree> {
  const { ignore = ['node_modules', '.git', '.DS_Store'] } = options;

  const files: UploadFile[] = [];
  const folderPaths = new Set<string>();

  for (let i = 0; i < fileList.length; i++) {
    const file = fileList[i];
    if (!file) continue;

    // webkitRelativePath gives us the path including the root folder
    const relativePath = file.webkitRelativePath || file.name;
    const name = file.name;

    // Skip ignored patterns (check each path segment)
    const pathSegments = relativePath.split('/');
    if (pathSegments.some((segment: string) => ignore.includes(segment))) {
      continue;
    }

    // Extract folder paths
    const pathParts = relativePath.split('/');
    for (let j = 1; j < pathParts.length; j++) {
      const folderPath = pathParts.slice(0, j).join('/');
      folderPaths.add(folderPath);
    }

    // Capture file reference for closure
    const fileRef = file;
    files.push({
      name,
      relativePath,
      size: fileRef.size,
      mimeType: fileRef.type || getMimeType(name),
      getData: async () => fileRef.arrayBuffer(),
    });
  }

  // Convert folder paths to UploadFolder objects
  const folders: UploadFolder[] = Array.from(folderPaths)
    .map((path) => ({
      name: path.split('/').pop()!,
      relativePath: path,
    }))
    .sort((a, b) => a.relativePath.split('/').length - b.relativePath.split('/').length);

  return { files, folders };
}

// ─────────────────────────────────────────────────────────────────────────────
// Utility: Build tree from flat file list
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Build an UploadTree from a flat array of files with paths.
 *
 * Useful for programmatically constructing uploads without filesystem access.
 *
 * @param items - Array of file items with path, data, and optional metadata
 * @returns UploadTree ready for upload
 *
 * @example
 * ```typescript
 * const tree = buildUploadTree([
 *   { path: 'docs/readme.md', data: new Blob(['# Hello']) },
 *   { path: 'docs/images/logo.png', data: logoBlob },
 * ]);
 * ```
 */
export function buildUploadTree(
  items: Array<{
    /** Relative path (e.g., "docs/readme.md") */
    path: string;
    /** File data */
    data: Blob | ArrayBuffer | Uint8Array;
    /** MIME type (auto-detected if not provided) */
    mimeType?: string;
  }>
): UploadTree {
  const files: UploadFile[] = [];
  const folderPaths = new Set<string>();

  for (const item of items) {
    const pathParts = item.path.split('/');
    const name = pathParts.pop()!;

    // Extract folder paths
    for (let i = 1; i <= pathParts.length; i++) {
      folderPaths.add(pathParts.slice(0, i).join('/'));
    }

    // Determine size
    let size: number;
    if (item.data instanceof Blob) {
      size = item.data.size;
    } else if (item.data instanceof ArrayBuffer) {
      size = item.data.byteLength;
    } else {
      size = item.data.length;
    }

    files.push({
      name,
      relativePath: item.path,
      size,
      mimeType: item.mimeType || getMimeType(name),
      getData: async () => item.data,
    });
  }

  const folders: UploadFolder[] = Array.from(folderPaths)
    .map((path) => ({
      name: path.split('/').pop()!,
      relativePath: path,
    }))
    .sort((a, b) => a.relativePath.split('/').length - b.relativePath.split('/').length);

  return { files, folders };
}
