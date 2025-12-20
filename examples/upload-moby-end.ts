#!/usr/bin/env npx tsx
/**
 * Upload final section of Moby Dick (Chapter 100 to Epilogue - the climax)
 */

import { ArkeUploader, type BatchResult } from '../dist/index.js';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';

const MOBY_DICK_URL = 'https://www.gutenberg.org/cache/epub/2701/pg2701.txt';
const GATEWAY_URL = 'https://gateway.arke.institute';
const AUTH_TOKEN = process.env.ARKE_AUTH_TOKEN;

async function main() {
  if (!AUTH_TOKEN) {
    console.error('ARKE_AUTH_TOKEN required');
    process.exit(1);
  }

  console.log('📚 Fetching Moby Dick...');
  const response = await fetch(MOBY_DICK_URL);
  const text = await response.text();

  // Find chapter 100 "Leg and Arm" - beginning of the final act
  const startMarker = 'CHAPTER 100. Leg and Arm.';
  const startIdx = text.lastIndexOf(startMarker);
  if (startIdx === -1) throw new Error('Could not find Chapter 100');

  // Extract from chapter 100 to the end (includes the chase and epilogue)
  const content = text.slice(startIdx).trim();

  // Remove Project Gutenberg footer if present
  const footerIdx = content.indexOf('*** END OF THE PROJECT GUTENBERG');
  const cleanContent = footerIdx > 0 ? content.slice(0, footerIdx).trim() : content;

  console.log(`📖 Extracted ${cleanContent.length} chars (Chapter 100 to Epilogue)`);

  // Split into 12 chunks
  const chunkSize = Math.ceil(cleanContent.length / 12);
  const chunks: string[] = [];
  for (let i = 0; i < 12; i++) {
    const start = i * chunkSize;
    const chunk = cleanContent.slice(start, start + chunkSize).trim();
    if (chunk) chunks.push(chunk);
  }
  console.log(`📄 Split into ${chunks.length} files`);

  // Create temp dir and save files
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'arke-moby-end-'));
  for (let i = 0; i < chunks.length; i++) {
    await fs.writeFile(
      path.join(tempDir, `moby-dick-finale-${String(i + 1).padStart(2, '0')}.txt`),
      chunks[i]
    );
  }
  console.log(`💾 Saved to: ${tempDir}`);

  // Upload
  const uploader = new ArkeUploader({
    gatewayUrl: GATEWAY_URL,
    authToken: AUTH_TOKEN,
    uploader: 'arke-sdk-example',
    rootPath: '/moby-dick-finale',
  });

  console.log('\n🚀 Starting upload...\n');
  const result: BatchResult = await uploader.uploadBatch(tempDir, {
    onProgress: (p) => process.stdout.write(`\r${p.phase} ${p.percentComplete}%`.padEnd(40)),
  });

  console.log('\n\n✨ Upload complete!\n');
  console.log('   Batch ID:', result.batchId);
  console.log('   Root PI: ', result.rootPi);
  console.log('   Files:   ', result.filesUploaded);
  console.log('   Size:    ', (result.bytesUploaded / 1024).toFixed(2), 'KB');
  console.log(`\n   View at: https://arke.institute/entity/${result.rootPi}`);

  await fs.rm(tempDir, { recursive: true, force: true });
  console.log('\n🧹 Cleaned up');
}

main().catch(e => { console.error('Error:', e.message); process.exit(1); });
