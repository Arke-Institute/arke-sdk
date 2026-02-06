/**
 * Upload Benchmark Suite
 *
 * Measures upload performance across various scenarios to identify bottlenecks.
 * Run against local arke_v1 or production.
 *
 * Usage: npm run benchmark
 */

import { ArkeClient } from '../../src/client/ArkeClient.js';
import { uploadTree, buildUploadTree, type UploadTree, type UploadProgress } from '../../src/operations/upload/index.js';
import { loadConfig, createTestUser, createJWT, registerUser, hasApiKey, type E2EConfig } from '../e2e/setup.js';

// =============================================================================
// Types
// =============================================================================

interface PhaseTimings {
  setup: number;
  creating: number;
  backlinking: number;
  uploading: number;
  total: number;
}

interface BenchmarkResult {
  scenario: string;
  fileCount: number;
  folderCount: number;
  totalBytes: number;
  timing: PhaseTimings;
  throughput: {
    entitiesPerSecond: number;
    bytesPerSecond: number;
    mbPerSecond: number;
  };
  success: boolean;
  errors: string[];
}

interface BenchmarkScenario {
  name: string;
  description: string;
  createTree: () => UploadTree;
}

// =============================================================================
// Test Data Generators
// =============================================================================

function generateRandomData(size: number): Uint8Array {
  const data = new Uint8Array(size);
  for (let i = 0; i < size; i++) {
    data[i] = Math.floor(Math.random() * 256);
  }
  return data;
}

function createManySmallFilesTree(count: number, sizeBytes: number = 1024): UploadTree {
  const files = [];
  for (let i = 0; i < count; i++) {
    files.push({
      path: `small-files/file-${String(i).padStart(5, '0')}.bin`,
      data: generateRandomData(sizeBytes),
      mimeType: 'application/octet-stream',
    });
  }
  return buildUploadTree(files);
}

function createFewLargeFilesTree(count: number, sizeMB: number): UploadTree {
  const sizeBytes = sizeMB * 1024 * 1024;
  const files = [];
  for (let i = 0; i < count; i++) {
    files.push({
      path: `large-files/large-${i + 1}.bin`,
      data: generateRandomData(sizeBytes),
      mimeType: 'application/octet-stream',
    });
  }
  return buildUploadTree(files);
}

function createMixedFilesTree(): UploadTree {
  const files = [];

  // 50 small files (1KB each)
  for (let i = 0; i < 50; i++) {
    files.push({
      path: `mixed/small/file-${i}.txt`,
      data: generateRandomData(1024),
      mimeType: 'text/plain',
    });
  }

  // 30 medium files (100KB each)
  for (let i = 0; i < 30; i++) {
    files.push({
      path: `mixed/medium/file-${i}.json`,
      data: generateRandomData(100 * 1024),
      mimeType: 'application/json',
    });
  }

  // 10 large files (1MB each)
  for (let i = 0; i < 10; i++) {
    files.push({
      path: `mixed/large/file-${i}.bin`,
      data: generateRandomData(1024 * 1024),
      mimeType: 'application/octet-stream',
    });
  }

  // 5 very large files (5MB each)
  for (let i = 0; i < 5; i++) {
    files.push({
      path: `mixed/xlarge/file-${i}.dat`,
      data: generateRandomData(5 * 1024 * 1024),
      mimeType: 'application/octet-stream',
    });
  }

  return buildUploadTree(files);
}

function createSingleHugeFileTree(sizeMB: number): UploadTree {
  const sizeBytes = sizeMB * 1024 * 1024;
  return buildUploadTree([
    {
      path: `huge-file-${sizeMB}mb.bin`,
      data: generateRandomData(sizeBytes),
      mimeType: 'application/octet-stream',
    },
  ]);
}

function createDeeplyNestedTree(depth: number, filesPerFolder: number): UploadTree {
  const files = [];
  let path = '';

  for (let d = 0; d < depth; d++) {
    path = path ? `${path}/level-${d}` : `level-${d}`;
    for (let f = 0; f < filesPerFolder; f++) {
      files.push({
        path: `${path}/file-${f}.txt`,
        data: generateRandomData(1024),
        mimeType: 'text/plain',
      });
    }
  }

  return buildUploadTree(files);
}

// =============================================================================
// Benchmark Scenarios
// =============================================================================

const SCENARIOS: BenchmarkScenario[] = [
  {
    name: 'small-files-100',
    description: '100 small files (1KB each) - tests entity creation overhead',
    createTree: () => createManySmallFilesTree(100, 1024),
  },
  {
    name: 'small-files-500',
    description: '500 small files (1KB each) - tests concurrency at scale',
    createTree: () => createManySmallFilesTree(500, 1024),
  },
  {
    name: 'large-files-5x10mb',
    description: '5 large files (10MB each) - tests upload bandwidth',
    createTree: () => createFewLargeFilesTree(5, 10),
  },
  {
    name: 'large-files-5x50mb',
    description: '5 large files (50MB each) - tests large file handling',
    createTree: () => createFewLargeFilesTree(5, 50),
  },
  {
    name: 'mixed-realistic',
    description: '95 mixed files (1KB-5MB) - realistic workload',
    createTree: () => createMixedFilesTree(),
  },
  {
    name: 'single-100mb',
    description: 'Single 100MB file - tests single large upload',
    createTree: () => createSingleHugeFileTree(100),
  },
  {
    name: 'deep-nested-10x5',
    description: '10 levels deep, 5 files per level - tests folder creation',
    createTree: () => createDeeplyNestedTree(10, 5),
  },
];

// =============================================================================
// Benchmark Runner
// =============================================================================

async function runBenchmark(
  client: ArkeClient,
  scenario: BenchmarkScenario
): Promise<BenchmarkResult> {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Running: ${scenario.name}`);
  console.log(`  ${scenario.description}`);
  console.log('='.repeat(60));

  // Generate test data
  console.log('  Generating test data...');
  const dataGenStart = performance.now();
  const tree = scenario.createTree();
  const dataGenTime = performance.now() - dataGenStart;
  console.log(`  Data generated in ${dataGenTime.toFixed(0)}ms`);

  const totalBytes = tree.files.reduce((sum, f) => sum + f.size, 0);
  console.log(`  Files: ${tree.files.length}, Folders: ${tree.folders.length}`);
  console.log(`  Total size: ${(totalBytes / 1024 / 1024).toFixed(2)} MB`);

  // Track phase timings
  const phaseStartTimes: Record<string, number> = {};
  const phaseDurations: Record<string, number> = {};
  let currentPhase = '';
  const startTime = performance.now();

  // Run upload
  console.log('\n  Uploading...');
  const result = await uploadTree(client, tree, {
    target: {
      createCollection: {
        label: `Benchmark - ${scenario.name} - ${Date.now()}`,
        description: `Benchmark run: ${scenario.description}`,
      },
    },
    onProgress: (progress: UploadProgress) => {
      const now = performance.now();

      // Track phase transitions
      if (progress.phase !== currentPhase) {
        // End previous phase
        if (currentPhase && phaseStartTimes[currentPhase]) {
          phaseDurations[currentPhase] = now - phaseStartTimes[currentPhase];
        }

        // Start new phase
        currentPhase = progress.phase;
        phaseStartTimes[currentPhase] = now;

        // Log phase transition
        const elapsed = ((now - startTime) / 1000).toFixed(1);
        console.log(`  [${elapsed}s] Phase: ${progress.phase} (${progress.phasePercent}%)`);
      }

      // Periodic progress for long phases
      if (progress.phase === 'uploading' && progress.bytesUploaded && progress.totalBytes) {
        const pct = Math.floor((progress.bytesUploaded / progress.totalBytes) * 100);
        if (pct % 25 === 0 && pct > 0) {
          const mbUploaded = (progress.bytesUploaded / 1024 / 1024).toFixed(1);
          const mbTotal = (progress.totalBytes / 1024 / 1024).toFixed(1);
          console.log(`    Uploaded: ${mbUploaded}/${mbTotal} MB (${pct}%)`);
        }
      }
    },
  });

  const endTime = performance.now();
  const totalTime = endTime - startTime;

  // Finalize phase timing for last phase
  if (currentPhase && phaseStartTimes[currentPhase] && !phaseDurations[currentPhase]) {
    phaseDurations[currentPhase] = endTime - phaseStartTimes[currentPhase];
  }

  // Build timing object
  const timing: PhaseTimings = {
    setup: phaseDurations['setup'] || 0,
    creating: phaseDurations['creating'] || 0,
    backlinking: phaseDurations['backlinking'] || 0,
    uploading: phaseDurations['uploading'] || 0,
    total: totalTime,
  };

  // Calculate throughput
  const totalEntities = tree.files.length + tree.folders.length;
  const throughput = {
    entitiesPerSecond: totalEntities / (totalTime / 1000),
    bytesPerSecond: totalBytes / (totalTime / 1000),
    mbPerSecond: (totalBytes / 1024 / 1024) / (totalTime / 1000),
  };

  // Log results
  console.log('\n  Results:');
  console.log(`    Success: ${result.success}`);
  console.log(`    Total time: ${(totalTime / 1000).toFixed(2)}s`);
  console.log(`    Phase breakdown:`);
  console.log(`      - Creating:    ${(timing.creating / 1000).toFixed(2)}s (${((timing.creating / totalTime) * 100).toFixed(1)}%)`);
  console.log(`      - Backlinking: ${(timing.backlinking / 1000).toFixed(2)}s (${((timing.backlinking / totalTime) * 100).toFixed(1)}%)`);
  console.log(`      - Uploading:   ${(timing.uploading / 1000).toFixed(2)}s (${((timing.uploading / totalTime) * 100).toFixed(1)}%)`);
  console.log(`    Throughput:`);
  console.log(`      - ${throughput.entitiesPerSecond.toFixed(1)} entities/sec`);
  console.log(`      - ${throughput.mbPerSecond.toFixed(2)} MB/sec`);

  if (result.errors.length > 0) {
    console.log(`    Errors: ${result.errors.length}`);
    result.errors.slice(0, 3).forEach((e) => console.log(`      - ${e.path}: ${e.error}`));
  }

  return {
    scenario: scenario.name,
    fileCount: tree.files.length,
    folderCount: tree.folders.length,
    totalBytes,
    timing,
    throughput,
    success: result.success,
    errors: result.errors.map((e) => `${e.path}: ${e.error}`),
  };
}

// =============================================================================
// Main
// =============================================================================

async function main() {
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║          ARKE SDK UPLOAD BENCHMARK SUITE                     ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');
  console.log();

  // Parse args
  const args = process.argv.slice(2);
  const selectedScenarios = args.filter((a) => !a.startsWith('--'));
  const runAll = args.includes('--all') || selectedScenarios.length === 0;
  const outputJson = args.includes('--json');

  // Setup client
  console.log('Setting up client...');
  const config: E2EConfig = loadConfig();
  let client: ArkeClient;

  if (hasApiKey(config)) {
    console.log(`Using API key auth against ${config.baseUrl}`);
    client = new ArkeClient({
      baseUrl: config.baseUrl,
      authToken: config.apiKey,
    });
  } else {
    console.log(`Using JWT auth against ${config.baseUrl}`);
    const testUser = createTestUser();
    const token = await createJWT(testUser, config);
    await registerUser(token, config);
    client = new ArkeClient({
      baseUrl: config.baseUrl,
      authToken: token,
    });
  }

  // Filter scenarios
  const scenariosToRun = runAll
    ? SCENARIOS
    : SCENARIOS.filter((s) => selectedScenarios.includes(s.name));

  if (scenariosToRun.length === 0) {
    console.log('\nNo matching scenarios. Available scenarios:');
    SCENARIOS.forEach((s) => console.log(`  - ${s.name}: ${s.description}`));
    console.log('\nUsage: npm run benchmark [scenario-name...] [--all] [--json]');
    process.exit(1);
  }

  console.log(`\nRunning ${scenariosToRun.length} scenario(s):`);
  scenariosToRun.forEach((s) => console.log(`  - ${s.name}`));

  // Run benchmarks
  const results: BenchmarkResult[] = [];

  for (const scenario of scenariosToRun) {
    try {
      const result = await runBenchmark(client, scenario);
      results.push(result);
    } catch (error) {
      console.error(`\nError running ${scenario.name}:`, error);
      results.push({
        scenario: scenario.name,
        fileCount: 0,
        folderCount: 0,
        totalBytes: 0,
        timing: { setup: 0, creating: 0, backlinking: 0, uploading: 0, total: 0 },
        throughput: { entitiesPerSecond: 0, bytesPerSecond: 0, mbPerSecond: 0 },
        success: false,
        errors: [String(error)],
      });
    }
  }

  // Summary
  console.log('\n' + '═'.repeat(60));
  console.log('BENCHMARK SUMMARY');
  console.log('═'.repeat(60));
  console.log();
  console.log('Scenario                  | Files | Size (MB) | Time (s) | MB/s   | Ent/s');
  console.log('-'.repeat(80));

  for (const r of results) {
    const name = r.scenario.padEnd(25);
    const files = String(r.fileCount).padStart(5);
    const size = (r.totalBytes / 1024 / 1024).toFixed(1).padStart(9);
    const time = (r.timing.total / 1000).toFixed(2).padStart(8);
    const mbps = r.throughput.mbPerSecond.toFixed(2).padStart(6);
    const eps = r.throughput.entitiesPerSecond.toFixed(1).padStart(6);
    const status = r.success ? '' : ' ❌';
    console.log(`${name} | ${files} | ${size} | ${time} | ${mbps} | ${eps}${status}`);
  }

  console.log();

  // Phase breakdown summary
  console.log('Phase Breakdown (% of total time):');
  console.log('-'.repeat(80));
  console.log('Scenario                  | Creating | Backlink | Upload  ');
  console.log('-'.repeat(80));

  for (const r of results) {
    if (r.timing.total === 0) continue;
    const name = r.scenario.padEnd(25);
    const creating = ((r.timing.creating / r.timing.total) * 100).toFixed(1).padStart(7) + '%';
    const backlink = ((r.timing.backlinking / r.timing.total) * 100).toFixed(1).padStart(7) + '%';
    const upload = ((r.timing.uploading / r.timing.total) * 100).toFixed(1).padStart(7) + '%';
    console.log(`${name} | ${creating} | ${backlink} | ${upload}`);
  }

  // Output JSON if requested
  if (outputJson) {
    const outputPath = `benchmark-results-${Date.now()}.json`;
    const fs = await import('fs');
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    console.log(`\nResults written to ${outputPath}`);
  }

  console.log();
}

main().catch((err) => {
  console.error('Benchmark failed:', err);
  process.exit(1);
});
