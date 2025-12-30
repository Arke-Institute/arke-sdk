import { describe, it, expect } from 'vitest';
import { computeCid, verifyCid, buildUploadTree, getMimeType } from '../src/operations/upload/index.js';

describe('CID Computation', () => {
  it('computes CID for simple string content', async () => {
    const content = new TextEncoder().encode('hello world');
    const cid = await computeCid(content);

    // CIDv1 with raw codec starts with 'bafkrei'
    expect(cid).toMatch(/^bafkrei/);
    expect(cid.length).toBeGreaterThan(50);
  });

  it('computes consistent CID for same content', async () => {
    const content1 = new TextEncoder().encode('test content');
    const content2 = new TextEncoder().encode('test content');

    const cid1 = await computeCid(content1);
    const cid2 = await computeCid(content2);

    expect(cid1).toBe(cid2);
  });

  it('computes different CIDs for different content', async () => {
    const content1 = new TextEncoder().encode('content A');
    const content2 = new TextEncoder().encode('content B');

    const cid1 = await computeCid(content1);
    const cid2 = await computeCid(content2);

    expect(cid1).not.toBe(cid2);
  });

  it('handles ArrayBuffer input', async () => {
    const buffer = new ArrayBuffer(5);
    const view = new Uint8Array(buffer);
    view.set([1, 2, 3, 4, 5]);

    const cid = await computeCid(buffer);
    expect(cid).toMatch(/^bafkrei/);
  });

  it('handles Uint8Array input', async () => {
    const arr = new Uint8Array([1, 2, 3, 4, 5]);
    const cid = await computeCid(arr);
    expect(cid).toMatch(/^bafkrei/);
  });

  it('handles Blob input', async () => {
    const blob = new Blob(['hello blob']);
    const cid = await computeCid(blob);
    expect(cid).toMatch(/^bafkrei/);
  });
});

describe('verifyCid', () => {
  it('returns true for matching CID', async () => {
    const content = new TextEncoder().encode('verify me');
    const cid = await computeCid(content);

    const isValid = await verifyCid(content, cid);
    expect(isValid).toBe(true);
  });

  it('returns false for non-matching CID', async () => {
    const content = new TextEncoder().encode('original');
    const fakeCid = 'bafkreifake123456789';

    const isValid = await verifyCid(content, fakeCid);
    expect(isValid).toBe(false);
  });
});

describe('getMimeType', () => {
  it('detects common image types', () => {
    expect(getMimeType('photo.jpg')).toBe('image/jpeg');
    expect(getMimeType('photo.jpeg')).toBe('image/jpeg');
    expect(getMimeType('image.png')).toBe('image/png');
    expect(getMimeType('animation.gif')).toBe('image/gif');
    expect(getMimeType('icon.svg')).toBe('image/svg+xml');
  });

  it('detects document types', () => {
    expect(getMimeType('report.pdf')).toBe('application/pdf');
    expect(getMimeType('document.docx')).toBe(
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
  });

  it('detects code/text types', () => {
    expect(getMimeType('script.js')).toBe('text/javascript');
    expect(getMimeType('styles.css')).toBe('text/css');
    expect(getMimeType('data.json')).toBe('application/json');
    expect(getMimeType('readme.md')).toBe('text/markdown');
  });

  it('returns octet-stream for unknown types', () => {
    expect(getMimeType('unknown.xyz')).toBe('application/octet-stream');
    expect(getMimeType('no-extension')).toBe('application/octet-stream');
  });

  it('is case insensitive', () => {
    expect(getMimeType('PHOTO.JPG')).toBe('image/jpeg');
    expect(getMimeType('Document.PDF')).toBe('application/pdf');
  });
});

describe('buildUploadTree', () => {
  it('builds tree from flat file list', () => {
    const tree = buildUploadTree([
      { path: 'readme.md', data: new Blob(['# Hello']) },
      { path: 'docs/guide.md', data: new Blob(['# Guide']) },
      { path: 'docs/images/logo.png', data: new Blob(['PNG data']) },
    ]);

    expect(tree.files).toHaveLength(3);
    expect(tree.folders).toHaveLength(2);

    // Check folder paths are correct and sorted by depth
    expect(tree.folders[0]?.relativePath).toBe('docs');
    expect(tree.folders[1]?.relativePath).toBe('docs/images');

    // Check file info
    const readme = tree.files.find((f) => f.relativePath === 'readme.md');
    expect(readme?.name).toBe('readme.md');
    expect(readme?.mimeType).toBe('text/markdown');
  });

  it('auto-detects MIME types', () => {
    const tree = buildUploadTree([
      { path: 'image.png', data: new Blob(['data']) },
      { path: 'doc.pdf', data: new Blob(['data']) },
      { path: 'unknown.xyz', data: new Blob(['data']) },
    ]);

    expect(tree.files[0]?.mimeType).toBe('image/png');
    expect(tree.files[1]?.mimeType).toBe('application/pdf');
    expect(tree.files[2]?.mimeType).toBe('application/octet-stream');
  });

  it('respects custom MIME types', () => {
    const tree = buildUploadTree([{ path: 'custom.bin', data: new Blob(['data']), mimeType: 'application/custom' }]);

    expect(tree.files[0]?.mimeType).toBe('application/custom');
  });

  it('handles deeply nested structures', () => {
    const tree = buildUploadTree([{ path: 'a/b/c/d/e/file.txt', data: new Blob(['deep']) }]);

    expect(tree.folders).toHaveLength(5);
    expect(tree.folders.map((f) => f.relativePath)).toEqual(['a', 'a/b', 'a/b/c', 'a/b/c/d', 'a/b/c/d/e']);
  });

  it('handles root-level files only', () => {
    const tree = buildUploadTree([
      { path: 'file1.txt', data: new Blob(['1']) },
      { path: 'file2.txt', data: new Blob(['2']) },
    ]);

    expect(tree.files).toHaveLength(2);
    expect(tree.folders).toHaveLength(0);
  });

  it('calculates sizes correctly', () => {
    const blobData = new Blob(['12345']);
    const arrayData = new ArrayBuffer(10);
    const uint8Data = new Uint8Array([1, 2, 3]);

    const tree = buildUploadTree([
      { path: 'blob.bin', data: blobData },
      { path: 'array.bin', data: arrayData },
      { path: 'uint8.bin', data: uint8Data },
    ]);

    expect(tree.files[0]?.size).toBe(5);
    expect(tree.files[1]?.size).toBe(10);
    expect(tree.files[2]?.size).toBe(3);
  });

  it('getData returns the original data', async () => {
    const originalData = new Blob(['test content']);
    const tree = buildUploadTree([{ path: 'test.txt', data: originalData }]);

    const retrievedData = await tree.files[0]?.getData();
    expect(retrievedData).toBe(originalData);
  });
});
