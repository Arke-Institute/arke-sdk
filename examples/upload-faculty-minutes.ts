#!/usr/bin/env npx tsx
/**
 * Upload Faculty Minutes TIFF archive
 */

import { ArkeUploader, type BatchResult } from '../dist/index.js';

const SOURCE_DIR = '/Users/chim/Downloads/FACULTY_MINUTES';
const GATEWAY_URL = 'https://gateway.arke.institute';
const AUTH_TOKEN = process.env.ARKE_AUTH_TOKEN;

async function main() {
  if (!AUTH_TOKEN) {
    console.error('ARKE_AUTH_TOKEN required');
    process.exit(1);
  }

  console.log('📁 Uploading Faculty Minutes archive...');
  console.log(`   Source: ${SOURCE_DIR}`);
  console.log('   This may take a while (9.4GB, 209 files)\n');

  const uploader = new ArkeUploader({
    gatewayUrl: GATEWAY_URL,
    authToken: AUTH_TOKEN,
    uploader: 'arke-sdk-example',
    rootPath: '/faculty-minutes',
    parallelUploads: 3, // Lower parallelism for large files
  });

  const startTime = Date.now();

  console.log('🚀 Starting upload...\n');
  const result: BatchResult = await uploader.uploadBatch(SOURCE_DIR, {
    onProgress: (p) => {
      const elapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
      const mb = (p.bytesUploaded / 1024 / 1024).toFixed(0);
      const totalMb = (p.bytesTotal / 1024 / 1024).toFixed(0);
      process.stdout.write(
        `\r${p.phase} ${p.percentComplete}% | ${p.filesUploaded}/${p.filesTotal} files | ${mb}/${totalMb} MB | ${elapsed}min`.padEnd(80)
      );
    },
  });

  const durationMin = (result.durationMs / 1000 / 60).toFixed(1);

  console.log('\n\n✨ Upload complete!\n');
  console.log('   Batch ID:', result.batchId);
  console.log('   Root PI: ', result.rootPi);
  console.log('   Files:   ', result.filesUploaded);
  console.log('   Size:    ', (result.bytesUploaded / 1024 / 1024 / 1024).toFixed(2), 'GB');
  console.log('   Duration:', durationMin, 'minutes');
  console.log(`\n   View at: https://arke.institute/entity/${result.rootPi}`);
}

main().catch(e => {
  console.error('\n\nError:', e.message);
  if (e.statusCode) console.error('Status:', e.statusCode);
  process.exit(1);
});
