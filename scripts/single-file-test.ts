/**
 * Test uploading a single large file
 */
import { ArkeClient } from '../src/client/ArkeClient.js';
import { uploadTree, buildUploadTree } from '../src/operations/upload/index.js';
import { loadConfig, createTestUser, createJWT, registerUser } from '../tests/e2e/setup.js';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error('Usage: npx tsx scripts/single-file-test.ts <file-path>');
    process.exit(1);
  }

  const stats = fs.statSync(filePath);
  const sizeMB = stats.size / (1024 * 1024);
  console.log(`File: ${path.basename(filePath)}`);
  console.log(`Size: ${sizeMB.toFixed(2)} MB`);

  // Setup client
  console.log('\nSetting up client...');
  const config = loadConfig();
  const testUser = createTestUser();
  const token = await createJWT(testUser, config);
  await registerUser(token, config);

  const client = new ArkeClient({
    baseUrl: config.baseUrl,
    authToken: token,
  });

  // Build tree with single file
  const fileBuffer = fs.readFileSync(filePath);
  const tree = buildUploadTree([{
    path: path.basename(filePath),
    data: new Blob([fileBuffer]),
    mimeType: 'application/zip',
  }]);

  console.log(`\nUploading to ${config.baseUrl}...`);
  const start = performance.now();
  let lastProgress = 0;

  try {
    const result = await uploadTree(client, tree, {
      target: {
        createCollection: { label: `Large File Test - ${Date.now()}` },
      },
      onProgress: (p) => {
        const now = performance.now();
        if (now - lastProgress > 1000 || p.phase === 'complete' || p.phase === 'error') {
          lastProgress = now;
          const elapsed = ((now - start) / 1000).toFixed(1);
          const bytes = p.bytesUploaded || 0;
          const pct = stats.size > 0 ? ((bytes / stats.size) * 100).toFixed(1) : '0';
          const speed = bytes > 0 ? ((bytes / 1024 / 1024) / (now - start) * 1000).toFixed(2) : '0';
          console.log(`[${elapsed}s] ${p.phase} - ${pct}% (${speed} MB/s)`);
        }
      },
    });

    const elapsed = (performance.now() - start) / 1000;
    console.log(`\n=== Result ===`);
    console.log(`Success: ${result.success}`);
    console.log(`Collection: ${result.collection.id}`);
    console.log(`Time: ${elapsed.toFixed(2)}s`);
    console.log(`Throughput: ${(sizeMB / elapsed).toFixed(2)} MB/s`);

    if (result.errors.length > 0) {
      console.log(`\nErrors:`);
      result.errors.forEach(e => console.log(`  - ${e.path}: ${e.error}`));
    }
  } catch (err) {
    const elapsed = (performance.now() - start) / 1000;
    console.error(`\n=== FAILED after ${elapsed.toFixed(2)}s ===`);
    console.error(err);
  }
}

main().catch(console.error);
