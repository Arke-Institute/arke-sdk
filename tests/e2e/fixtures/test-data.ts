/**
 * Test Data Generator
 *
 * Creates in-memory test data for upload testing.
 * Includes various file types, nested folders, and edge cases.
 */

import { buildUploadTree, type UploadTree } from '../../../src/operations/upload/index.js';

/**
 * Create a simple test tree with a few files
 */
export function createSimpleTestTree(): UploadTree {
  return buildUploadTree([
    {
      path: 'readme.txt',
      data: new Blob(['# Test Upload\n\nThis is a test file uploaded via the Arke SDK.\n']),
      mimeType: 'text/plain',
    },
    {
      path: 'data.json',
      data: new Blob([JSON.stringify({ name: 'test', version: 1, items: [1, 2, 3] }, null, 2)]),
      mimeType: 'application/json',
    },
  ]);
}

/**
 * Create a test tree with nested folders
 */
export function createNestedTestTree(): UploadTree {
  const now = new Date().toISOString();

  return buildUploadTree([
    // Root level files
    {
      path: 'README.md',
      data: new Blob([`# Test Project\n\nCreated: ${now}\n\nThis is a test upload with nested folders.\n`]),
      mimeType: 'text/markdown',
    },
    {
      path: 'config.json',
      data: new Blob([JSON.stringify({ name: 'test-project', version: '1.0.0' }, null, 2)]),
      mimeType: 'application/json',
    },

    // docs folder
    {
      path: 'docs/guide.md',
      data: new Blob(['# User Guide\n\nThis is the user guide.\n']),
      mimeType: 'text/markdown',
    },
    {
      path: 'docs/api.md',
      data: new Blob(['# API Reference\n\nThis is the API reference.\n']),
      mimeType: 'text/markdown',
    },

    // docs/images folder (nested)
    {
      path: 'docs/images/logo.svg',
      data: new Blob([
        '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><circle cx="50" cy="50" r="40" fill="blue"/></svg>',
      ]),
      mimeType: 'image/svg+xml',
    },

    // src folder
    {
      path: 'src/index.ts',
      data: new Blob(['export const hello = () => console.log("Hello from test!");\n']),
      mimeType: 'text/typescript',
    },
    {
      path: 'src/utils.ts',
      data: new Blob(['export const add = (a: number, b: number) => a + b;\n']),
      mimeType: 'text/typescript',
    },

    // src/components folder (nested)
    {
      path: 'src/components/Button.tsx',
      data: new Blob(['export const Button = ({ label }: { label: string }) => <button>{label}</button>;\n']),
      mimeType: 'text/typescript',
    },

    // data folder with binary-ish content
    {
      path: 'data/sample.csv',
      data: new Blob(['id,name,value\n1,foo,100\n2,bar,200\n3,baz,300\n']),
      mimeType: 'text/csv',
    },
  ]);
}

/**
 * Create a test tree with binary files
 */
export function createBinaryTestTree(): UploadTree {
  // Create some binary data
  const binaryData = new Uint8Array(256);
  for (let i = 0; i < 256; i++) {
    binaryData[i] = i;
  }

  // Create a "PNG-like" header (not a real PNG, but binary)
  const pngLikeData = new Uint8Array([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, // PNG signature
    ...Array(100).fill(0x42), // Dummy data
  ]);

  return buildUploadTree([
    {
      path: 'binary/raw.bin',
      data: binaryData,
      mimeType: 'application/octet-stream',
    },
    {
      path: 'binary/fake-image.png',
      data: pngLikeData,
      mimeType: 'image/png',
    },
    {
      path: 'text/unicode.txt',
      data: new Blob(['Hello 世界! 🌍 Привет мир! مرحبا بالعالم\n']),
      mimeType: 'text/plain',
    },
  ]);
}

/**
 * Create a deeply nested test tree
 */
export function createDeeplyNestedTree(): UploadTree {
  return buildUploadTree([
    { path: 'a/file.txt', data: new Blob(['Level 1']) },
    { path: 'a/b/file.txt', data: new Blob(['Level 2']) },
    { path: 'a/b/c/file.txt', data: new Blob(['Level 3']) },
    { path: 'a/b/c/d/file.txt', data: new Blob(['Level 4']) },
    { path: 'a/b/c/d/e/file.txt', data: new Blob(['Level 5']) },
  ]);
}

/**
 * Create a flat test tree (files only, no folders)
 */
export function createFlatTestTree(): UploadTree {
  return buildUploadTree([
    { path: 'file1.txt', data: new Blob(['File 1 content']) },
    { path: 'file2.txt', data: new Blob(['File 2 content']) },
    { path: 'file3.json', data: new Blob(['{"key": "value"}']) },
  ]);
}

/**
 * Summary of a test tree for logging
 */
export function summarizeTree(tree: UploadTree): string {
  const totalSize = tree.files.reduce((sum, f) => sum + f.size, 0);
  return `${tree.files.length} files, ${tree.folders.length} folders, ${totalSize} bytes total`;
}
