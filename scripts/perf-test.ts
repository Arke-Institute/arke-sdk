/**
 * Performance Test Script
 *
 * Tests upload performance with real folders.
 * Usage: npx tsx scripts/perf-test.ts <path1> [path2] ...
 */
import { ArkeClient } from '../src/client/ArkeClient.js';
import { uploadTree, scanDirectory } from '../src/operations/upload/index.js';
import { loadConfig, createTestUser, createJWT, registerUser, type E2EConfig } from '../tests/e2e/setup.js';

async function testUpload(targetPath: string, client: ArkeClient) {
  console.log(`\n=== Testing: ${targetPath} ===`);

  // Scan
  const scanStart = performance.now();
  const tree = await scanDirectory(targetPath);
  const scanTime = performance.now() - scanStart;

  console.log(`Scan: ${tree.files.length} files, ${tree.folders.length} folders (${scanTime.toFixed(0)}ms)`);
  const totalSize = tree.files.reduce((sum, f) => sum + f.size, 0);
  console.log(`Total size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);

  // Upload with timing
  const uploadStart = performance.now();
  let lastPhase = '';
  const phaseTimings: Record<string, number> = {};
  let phaseStart = uploadStart;

  const result = await uploadTree(client, tree, {
    target: {
      createCollection: {
        label: `Perf Test - ${targetPath.split('/').pop()} - ${Date.now()}`,
      },
    },
    onProgress: (p) => {
      if (p.phase !== lastPhase) {
        if (lastPhase) {
          phaseTimings[lastPhase] = performance.now() - phaseStart;
        }
        phaseStart = performance.now();
        lastPhase = p.phase;
        console.log(`  Phase: ${p.phase} (${p.completedEntities}/${p.totalEntities} entities, ${p.completedParents}/${p.totalParents} parents)`);
      }
    },
  });

  if (lastPhase) {
    phaseTimings[lastPhase] = performance.now() - phaseStart;
  }

  const totalTime = performance.now() - uploadStart;

  console.log(`\nResult: ${result.success ? 'SUCCESS' : 'FAILED'}`);
  console.log(`Collection: ${result.collection.id}`);
  console.log(`Files: ${result.files.length}, Folders: ${result.folders.length}`);
  if (result.errors.length > 0) {
    console.log(`Errors: ${result.errors.length}`);
    result.errors.slice(0, 3).forEach((e) => console.log(`  - ${e.path}: ${e.error}`));
  }

  console.log(`\n--- Timings ---`);
  for (const [phase, time] of Object.entries(phaseTimings)) {
    console.log(`  ${phase}: ${(time / 1000).toFixed(2)}s`);
  }
  console.log(`  TOTAL: ${(totalTime / 1000).toFixed(2)}s`);
  console.log(`  Throughput: ${(totalSize / 1024 / 1024 / (totalTime / 1000)).toFixed(2)} MB/s`);

  return { success: result.success, totalTime, totalSize, files: result.files.length };
}

async function main() {
  const paths = process.argv.slice(2);
  if (paths.length === 0) {
    console.error('Usage: npx tsx scripts/perf-test.ts <path1> [path2] ...');
    process.exit(1);
  }

  // Setup authenticated client
  console.log('Setting up authenticated client...');
  const config = loadConfig();
  const testUser = createTestUser();
  const token = await createJWT(testUser, config);
  await registerUser(token, config);

  const client = new ArkeClient({
    baseUrl: config.baseUrl,
    authToken: token,
  });

  console.log(`Connected to: ${config.baseUrl}`);

  // Run tests
  for (const p of paths) {
    await testUpload(p, client);
  }
}

main().catch(console.error);
