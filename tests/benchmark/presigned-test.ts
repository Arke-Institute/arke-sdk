/**
 * Presigned URL Upload Test
 *
 * Tests the new presigned URL flow for large files.
 */

import { ArkeClient } from '../../src/client/ArkeClient.js';
import { uploadTree, buildUploadTree } from '../../src/operations/upload/index.js';
import { loadConfig, hasApiKey, type E2EConfig } from '../e2e/setup.js';

function generateRandomData(sizeMB: number): Uint8Array {
  const size = sizeMB * 1024 * 1024;
  const data = new Uint8Array(size);
  for (let i = 0; i < size; i++) {
    data[i] = Math.floor(Math.random() * 256);
  }
  return data;
}

async function main() {
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║     PRESIGNED URL UPLOAD TEST                                ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');

  // Setup client
  const config: E2EConfig = loadConfig();
  let client: ArkeClient;

  if (hasApiKey(config)) {
    console.log(`\nUsing API key auth against ${config.baseUrl}`);
    client = new ArkeClient({
      baseUrl: config.baseUrl,
      authToken: config.apiKey,
    });
  } else {
    throw new Error('API key required for this test');
  }

  // Test different file sizes
  const testSizes = [
    { sizeMB: 3, expectedPath: 'direct' },    // Below threshold - direct upload
    { sizeMB: 10, expectedPath: 'presigned' }, // Above threshold - presigned URL
    { sizeMB: 50, expectedPath: 'presigned' }, // Large file - presigned URL
  ];

  for (const { sizeMB, expectedPath } of testSizes) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Testing ${sizeMB} MB file (expected: ${expectedPath})`);
    console.log('='.repeat(60));

    // Generate test data
    console.log('Generating test data...');
    const data = generateRandomData(sizeMB);

    // Build upload tree
    const tree = buildUploadTree([
      {
        path: `test-${sizeMB}mb.bin`,
        data: data,
        mimeType: 'application/octet-stream',
      },
    ]);

    console.log(`File size: ${(data.length / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Threshold: 5 MB (files >= 5MB use presigned URLs)`);

    // Upload with timing
    const startTime = performance.now();
    let currentPhase = '';

    const result = await uploadTree(client, tree, {
      target: {
        createCollection: {
          label: `Presigned Test ${sizeMB}MB - ${Date.now()}`,
        },
      },
      onProgress: (p) => {
        if (p.phase !== currentPhase) {
          const elapsed = ((performance.now() - startTime) / 1000).toFixed(1);
          console.log(`  [${elapsed}s] Phase: ${p.phase}`);
          currentPhase = p.phase;
        }
      },
    });

    const totalTime = performance.now() - startTime;
    const speed = sizeMB / (totalTime / 1000);

    console.log(`\nResults:`);
    console.log(`  Success: ${result.success}`);
    console.log(`  Time: ${(totalTime / 1000).toFixed(2)}s`);
    console.log(`  Speed: ${speed.toFixed(2)} MB/s`);
    console.log(`  Collection: ${result.collection.id}`);

    if (result.errors.length > 0) {
      console.log(`  Errors:`);
      result.errors.forEach((e) => console.log(`    - ${e.path}: ${e.error}`));
    }

    // Verify file was uploaded correctly
    if (result.success && result.files.length > 0) {
      const fileId = result.files[0]!.id;
      const { data: entity, error } = await client.api.GET('/entities/{id}', {
        params: { path: { id: fileId } },
      });

      if (entity) {
        const content = entity.properties?.content as { cid?: string; size?: number } | undefined;
        console.log(`  Verification:`);
        console.log(`    - Entity ID: ${entity.id}`);
        console.log(`    - Content CID: ${content?.cid?.slice(0, 30)}...`);
        console.log(`    - Content size: ${content?.size} bytes`);
      }
    }
  }

  console.log('\n' + '═'.repeat(60));
  console.log('DONE');
  console.log('═'.repeat(60));
}

main().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
