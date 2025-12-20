#!/usr/bin/env npx tsx
/**
 * Example: Upload first chapters of Moby Dick using the Arke SDK
 *
 * Usage:
 *   ARKE_AUTH_TOKEN=your-token npx tsx examples/upload-moby-dick.ts
 *
 * Or build first and run:
 *   npm run build
 *   ARKE_AUTH_TOKEN=your-token node examples/upload-moby-dick.mjs
 */

import { ArkeUploader, type UploadProgress, type BatchResult } from '../dist/index.js';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';

const MOBY_DICK_URL = 'https://www.gutenberg.org/cache/epub/2701/pg2701.txt';
const GATEWAY_URL = process.env.ARKE_GATEWAY_URL || 'https://gateway.arke.institute';
const AUTH_TOKEN = process.env.ARKE_AUTH_TOKEN;

async function fetchMobyDick(): Promise<string> {
  console.log('📚 Fetching Moby Dick from Project Gutenberg...');
  const response = await fetch(MOBY_DICK_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
  }
  return response.text();
}

function extractContent(text: string, maxChars: number = 150000): string {
  // Find "Call me Ishmael" - the actual start of Chapter 1 content
  const contentStart = text.indexOf('Call me Ishmael');
  if (contentStart === -1) {
    throw new Error('Could not find start of Moby Dick content');
  }

  // Back up to include "CHAPTER 1. Loomings." header
  const chapterHeader = text.lastIndexOf('CHAPTER 1', contentStart);
  const startIndex = chapterHeader !== -1 ? chapterHeader : contentStart;

  return text.slice(startIndex, startIndex + maxChars).trim();
}

function splitIntoChunks(text: string, numChunks: number = 12): string[] {
  const chunkSize = Math.ceil(text.length / numChunks);
  const chunks: string[] = [];

  for (let i = 0; i < numChunks; i++) {
    const start = i * chunkSize;
    let end = start + chunkSize;

    // Try to break at a paragraph boundary (double newline)
    if (i < numChunks - 1 && end < text.length) {
      const paragraphBreak = text.indexOf('\n\n', end - 200);
      if (paragraphBreak !== -1 && paragraphBreak < end + 200) {
        end = paragraphBreak;
      }
    }

    const chunk = text.slice(start, end).trim();
    if (chunk.length > 0) {
      chunks.push(chunk);
    }
  }

  return chunks;
}

function formatProgress(progress: UploadProgress): string {
  const phases: Record<string, string> = {
    scanning: '🔍 Scanning',
    uploading: '⬆️  Uploading',
    finalizing: '✅ Finalizing',
    discovery: '🔎 Processing',
    complete: '🎉 Complete',
  };

  const phase = phases[progress.phase] || progress.phase;
  const percent = `${progress.percentComplete}%`;

  if (progress.phase === 'uploading') {
    const mb = (progress.bytesUploaded / 1024 / 1024).toFixed(2);
    return `${phase} ${percent} (${mb} MB)`;
  }

  return `${phase} ${percent}`;
}

async function main() {
  if (!AUTH_TOKEN) {
    console.error('❌ Error: ARKE_AUTH_TOKEN environment variable is required');
    console.error('   Get your token from https://arke.institute');
    process.exit(1);
  }

  // Create temp directory for the upload
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'arke-moby-'));
  console.log(`📁 Created temp directory: ${tempDir}`);

  try {
    // Fetch and extract content
    const fullText = await fetchMobyDick();
    const content = extractContent(fullText, 150000); // ~150KB of text
    console.log(`📖 Extracted ${content.length} characters`);

    // Split into 12 chunks
    const chunks = splitIntoChunks(content, 12);
    console.log(`📄 Split into ${chunks.length} files`);

    // Save each chunk as a separate file
    for (let i = 0; i < chunks.length; i++) {
      const fileName = `moby-dick-part-${String(i + 1).padStart(2, '0')}.txt`;
      const filePath = path.join(tempDir, fileName);
      await fs.writeFile(filePath, chunks[i], 'utf-8');
    }
    console.log(`💾 Saved to: ${tempDir}`);

    // Create uploader
    const uploader = new ArkeUploader({
      gatewayUrl: GATEWAY_URL,
      authToken: AUTH_TOKEN,
      uploader: 'arke-sdk-example',
      rootPath: '/moby-dick',
    });

    console.log('\n🚀 Starting upload...\n');

    // Upload the file
    const result: BatchResult = await uploader.uploadBatch(tempDir, {
      onProgress: (progress) => {
        process.stdout.write(`\r${formatProgress(progress)}`.padEnd(60));
      },
    });

    console.log('\n\n✨ Upload complete!\n');
    console.log('   Batch ID:', result.batchId);
    console.log('   Root PI: ', result.rootPi);
    console.log('   Files:   ', result.filesUploaded);
    console.log('   Size:    ', (result.bytesUploaded / 1024).toFixed(2), 'KB');
    console.log('   Duration:', (result.durationMs / 1000).toFixed(2), 's');
    console.log(`\n   View at: https://arke.institute/entity/${result.rootPi}`);

  } finally {
    // Cleanup temp directory
    await fs.rm(tempDir, { recursive: true, force: true });
    console.log('\n🧹 Cleaned up temp files');
  }
}

main().catch((err) => {
  console.error('\n❌ Error:', err.message);
  if (err.statusCode) {
    console.error('   Status:', err.statusCode);
  }
  if (err.details) {
    console.error('   Details:', JSON.stringify(err.details, null, 2));
  }
  process.exit(1);
});
