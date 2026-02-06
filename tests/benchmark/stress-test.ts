/**
 * Upload Stress Test
 *
 * Tests the batch upload optimizations with large numbers of files/folders.
 * Runs on the TEST NETWORK to avoid polluting production data.
 *
 * Usage:
 *   npm run benchmark:stress              # Run default scenario (500 files, 50 folders)
 *   npm run benchmark:stress -- --small   # 100 files, 10 folders
 *   npm run benchmark:stress -- --medium  # 500 files, 50 folders
 *   npm run benchmark:stress -- --large   # 2000 files, 200 folders
 *   npm run benchmark:stress -- --extreme # 5000 files, 500 folders
 */

import { ArkeClient } from '../../src/client/ArkeClient.js';
import { uploadTree, buildUploadTree } from '../../src/operations/upload/index.js';
import { loadConfig, hasApiKey, type E2EConfig } from '../e2e/setup.js';

// =============================================================================
// Test Scenarios
// =============================================================================

interface Scenario {
  name: string;
  fileCount: number;
  folderCount: number;
  folderDepth: number;
  fileSizeRange: [number, number]; // [min, max] in bytes
}

const SCENARIOS: Record<string, Scenario> = {
  small: {
    name: 'Small',
    fileCount: 100,
    folderCount: 10,
    folderDepth: 2,
    fileSizeRange: [1024, 10 * 1024], // 1KB - 10KB
  },
  medium: {
    name: 'Medium',
    fileCount: 500,
    folderCount: 50,
    folderDepth: 3,
    fileSizeRange: [1024, 50 * 1024], // 1KB - 50KB
  },
  large: {
    name: 'Large',
    fileCount: 2000,
    folderCount: 200,
    folderDepth: 4,
    fileSizeRange: [1024, 100 * 1024], // 1KB - 100KB
  },
  extreme: {
    name: 'Extreme',
    fileCount: 5000,
    folderCount: 500,
    folderDepth: 5,
    fileSizeRange: [512, 50 * 1024], // 512B - 50KB
  },
};

// =============================================================================
// Data Generation
// =============================================================================

function generateRandomData(size: number): Uint8Array {
  const data = new Uint8Array(size);
  for (let i = 0; i < size; i++) {
    data[i] = Math.floor(Math.random() * 256);
  }
  return data;
}

interface GeneratedTree {
  folders: Array<{ relativePath: string; name: string }>;
  files: Array<{
    relativePath: string;
    name: string;
    data: Uint8Array;
    mimeType: string;
    size: number;
  }>;
  totalBytes: number;
}

function generateTree(scenario: Scenario): GeneratedTree {
  const folders: Array<{ relativePath: string; name: string }> = [];
  const files: Array<{
    relativePath: string;
    name: string;
    data: Uint8Array;
    mimeType: string;
    size: number;
  }> = [];
  let totalBytes = 0;

  // Generate folder structure
  // Create folders at each depth level
  const foldersPerDepth = Math.ceil(scenario.folderCount / scenario.folderDepth);
  const folderPaths: string[] = [];

  for (let depth = 0; depth < scenario.folderDepth; depth++) {
    const foldersAtThisDepth = Math.min(
      foldersPerDepth,
      scenario.folderCount - folders.length
    );

    for (let i = 0; i < foldersAtThisDepth; i++) {
      let path: string;
      if (depth === 0) {
        path = `folder_${i}`;
      } else {
        // Pick a random parent from previous depth
        const parentCandidates = folderPaths.filter(
          (p) => p.split('/').length === depth
        );
        const parent =
          parentCandidates[Math.floor(Math.random() * parentCandidates.length)];
        path = `${parent}/subfolder_${i}`;
      }

      folders.push({ relativePath: path, name: path.split('/').pop()! });
      folderPaths.push(path);
    }
  }

  // Generate files distributed across folders
  const [minSize, maxSize] = scenario.fileSizeRange;

  for (let i = 0; i < scenario.fileCount; i++) {
    // Pick a random folder (or root)
    const useRoot = folderPaths.length === 0 || Math.random() < 0.1;
    const folderPath = useRoot
      ? ''
      : folderPaths[Math.floor(Math.random() * folderPaths.length)];

    const fileName = `file_${i}.bin`;
    const relativePath = folderPath ? `${folderPath}/${fileName}` : fileName;

    const size = Math.floor(Math.random() * (maxSize - minSize)) + minSize;
    const data = generateRandomData(size);
    totalBytes += size;

    files.push({
      relativePath,
      name: fileName,
      data,
      mimeType: 'application/octet-stream',
      size,
    });
  }

  return { folders, files, totalBytes };
}

// =============================================================================
// Timing Helpers
// =============================================================================

interface PhaseTimings {
  setup: number;
  creating: number;
  backlinking: number;
  uploading: number;
  total: number;
}

// =============================================================================
// Main Test
// =============================================================================

async function runStressTest(scenarioKey: string): Promise<void> {
  const scenario = SCENARIOS[scenarioKey];
  if (!scenario) {
    console.error(`Unknown scenario: ${scenarioKey}`);
    console.error(`Available: ${Object.keys(SCENARIOS).join(', ')}`);
    process.exit(1);
  }

  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║     UPLOAD STRESS TEST (TEST NETWORK)                        ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');
  console.log();

  // Setup client with TEST NETWORK
  const config: E2EConfig = loadConfig();

  if (!hasApiKey(config)) {
    throw new Error('API key required for stress test. Set ARKE_API_KEY in .env.e2e');
  }

  console.log(`Using API key auth against ${config.baseUrl}`);
  console.log('Network: TEST (entities will have II-prefixed IDs)\n');

  const client = new ArkeClient({
    baseUrl: config.baseUrl,
    authToken: config.apiKey,
    network: 'test', // USE TEST NETWORK
  });

  // Generate test data
  console.log(`Scenario: ${scenario.name}`);
  console.log(`  Files: ${scenario.fileCount}`);
  console.log(`  Folders: ${scenario.folderCount}`);
  console.log(`  Max depth: ${scenario.folderDepth}`);
  console.log(`  File sizes: ${scenario.fileSizeRange[0]}B - ${scenario.fileSizeRange[1]}B`);
  console.log();

  console.log('Generating test data...');
  const genStart = performance.now();
  const generatedTree = generateTree(scenario);
  const genTime = performance.now() - genStart;
  console.log(`  Generated in ${(genTime / 1000).toFixed(2)}s`);
  console.log(`  Total bytes: ${(generatedTree.totalBytes / 1024 / 1024).toFixed(2)} MB`);
  console.log();

  // Build upload tree
  const tree = buildUploadTree(
    generatedTree.files.map((f) => ({
      path: f.relativePath,
      data: f.data,
      mimeType: f.mimeType,
    }))
  );

  console.log(`Upload tree built:`);
  console.log(`  Files: ${tree.files.length}`);
  console.log(`  Folders: ${tree.folders.length}`);
  console.log();

  // Track phase timings
  const timings: PhaseTimings = {
    setup: 0,
    creating: 0,
    backlinking: 0,
    uploading: 0,
    total: 0,
  };

  let phaseStart = performance.now();
  let currentPhase = 'setup';
  let lastProgress = '';

  // Run upload
  console.log('Starting upload...');
  console.log('─'.repeat(60));

  const totalStart = performance.now();

  const result = await uploadTree(client, tree, {
    target: {
      createCollection: {
        label: `Stress Test ${scenario.name} - ${new Date().toISOString()}`,
      },
    },
    onProgress: (p) => {
      // Track phase transitions
      if (p.phase !== currentPhase) {
        const elapsed = performance.now() - phaseStart;
        if (currentPhase === 'creating') timings.creating = elapsed;
        else if (currentPhase === 'backlinking') timings.backlinking = elapsed;
        else if (currentPhase === 'uploading') timings.uploading = elapsed;

        phaseStart = performance.now();
        currentPhase = p.phase;
      }

      // Progress display
      const progress = `${p.phase}: ${p.phasePercent}%`;
      if (progress !== lastProgress) {
        process.stdout.write(`\r  ${progress.padEnd(30)}`);
        lastProgress = progress;
      }
    },
  });

  timings.total = performance.now() - totalStart;

  // Final phase timing
  if (currentPhase === 'uploading') {
    timings.uploading = performance.now() - phaseStart;
  }

  console.log('\r' + ' '.repeat(40) + '\r');
  console.log('─'.repeat(60));
  console.log();

  // Results
  console.log('═'.repeat(60));
  console.log('RESULTS');
  console.log('═'.repeat(60));
  console.log();

  console.log(`Success: ${result.success}`);
  console.log(`Collection: ${result.collection.id}`);
  console.log(`Files created: ${result.files.length}`);
  console.log(`Folders created: ${result.folders.length}`);
  console.log(`Errors: ${result.errors.length}`);
  console.log();

  if (result.errors.length > 0) {
    console.log('Errors:');
    result.errors.slice(0, 10).forEach((e) => {
      console.log(`  - ${e.path}: ${e.error}`);
    });
    if (result.errors.length > 10) {
      console.log(`  ... and ${result.errors.length - 10} more`);
    }
    console.log();
  }

  console.log('Timings:');
  console.log(`  Creating:    ${(timings.creating / 1000).toFixed(2)}s`);
  console.log(`  Backlinking: ${(timings.backlinking / 1000).toFixed(2)}s`);
  console.log(`  Uploading:   ${(timings.uploading / 1000).toFixed(2)}s`);
  console.log(`  Total:       ${(timings.total / 1000).toFixed(2)}s`);
  console.log();

  // Throughput
  const entitiesTotal = result.files.length + result.folders.length;
  const entitiesPerSec = entitiesTotal / (timings.total / 1000);
  const mbPerSec = (generatedTree.totalBytes / 1024 / 1024) / (timings.total / 1000);

  console.log('Throughput:');
  console.log(`  Entities/sec: ${entitiesPerSec.toFixed(1)}`);
  console.log(`  MB/sec:       ${mbPerSec.toFixed(2)}`);
  console.log();

  // Batch efficiency
  const folderBatches = Math.ceil(scenario.folderCount / 100);
  const fileBatches = Math.ceil(scenario.fileCount / 100);
  const totalBatches = folderBatches + fileBatches;
  const oldApiCalls = scenario.folderCount + scenario.fileCount + (scenario.folderCount + 1) * 2; // old: individual creates + GET+PUT per parent

  console.log('API Efficiency:');
  console.log(`  Batch requests (create): ~${totalBatches} (vs ${scenario.folderCount + scenario.fileCount} individual)`);
  console.log(`  Backlink PUTs: ~${scenario.folderCount + 1} (no GETs with cached CIDs)`);
  console.log(`  Estimated old API calls: ~${oldApiCalls}`);
  console.log(`  Estimated new API calls: ~${totalBatches + scenario.folderCount + 1}`);
  console.log();

  console.log('═'.repeat(60));
}

// =============================================================================
// CLI
// =============================================================================

const args = process.argv.slice(2);
let scenarioKey = 'medium'; // default

for (const arg of args) {
  if (arg.startsWith('--')) {
    const key = arg.slice(2);
    if (SCENARIOS[key]) {
      scenarioKey = key;
    }
  }
}

runStressTest(scenarioKey).catch((err) => {
  console.error('Stress test failed:', err);
  process.exit(1);
});
