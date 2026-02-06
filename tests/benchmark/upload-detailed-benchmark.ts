/**
 * Detailed Upload Phase Benchmark
 *
 * Instruments the upload phase to identify bottlenecks:
 * - getData() call time (reading file data)
 * - Blob creation time
 * - HTTP POST time
 * - Request overhead vs transfer time
 */

import { ArkeClient } from '../../src/client/ArkeClient.js';
import { buildUploadTree, type UploadTree, type UploadFile } from '../../src/operations/upload/index.js';
import { loadConfig, createTestUser, createJWT, registerUser, hasApiKey, type E2EConfig } from '../e2e/setup.js';

// =============================================================================
// Types
// =============================================================================

interface UploadTiming {
  fileSize: number;
  getDataMs: number;
  blobCreateMs: number;
  httpPostMs: number;
  totalMs: number;
}

// =============================================================================
// Instrumented Upload
// =============================================================================

async function instrumentedUploadFile(
  client: ArkeClient,
  fileId: string,
  file: UploadFile
): Promise<UploadTiming> {
  const timing: UploadTiming = {
    fileSize: file.size,
    getDataMs: 0,
    blobCreateMs: 0,
    httpPostMs: 0,
    totalMs: 0,
  };

  const totalStart = performance.now();

  // Time getData()
  const getDataStart = performance.now();
  const fileData = await file.getData();
  timing.getDataMs = performance.now() - getDataStart;

  // Time Blob creation
  const blobStart = performance.now();
  let body: Blob;
  if (fileData instanceof Blob) {
    body = fileData;
  } else if (fileData instanceof Uint8Array) {
    const arrayBuffer = new ArrayBuffer(fileData.byteLength);
    new Uint8Array(arrayBuffer).set(fileData);
    body = new Blob([arrayBuffer], { type: file.mimeType });
  } else {
    body = new Blob([fileData], { type: file.mimeType });
  }
  timing.blobCreateMs = performance.now() - blobStart;

  // Time HTTP POST
  const httpStart = performance.now();
  const { error } = await client.api.POST('/entities/{id}/content', {
    params: { path: { id: fileId }, query: { key: 'v1', filename: file.name } },
    body: body as unknown as Record<string, never>,
    bodySerializer: (b: unknown) => b as BodyInit,
    headers: { 'Content-Type': file.mimeType },
  } as Parameters<typeof client.api.POST>[1]);
  timing.httpPostMs = performance.now() - httpStart;

  if (error) {
    throw new Error(`Upload failed: ${JSON.stringify(error)}`);
  }

  timing.totalMs = performance.now() - totalStart;
  return timing;
}

// =============================================================================
// Test Scenarios
// =============================================================================

function generateRandomData(size: number): Uint8Array {
  const data = new Uint8Array(size);
  for (let i = 0; i < size; i++) {
    data[i] = Math.floor(Math.random() * 256);
  }
  return data;
}

interface TestScenario {
  name: string;
  files: Array<{ name: string; sizeMB: number }>;
}

const SCENARIOS: TestScenario[] = [
  {
    name: 'single-1mb',
    files: [{ name: 'file-1mb.bin', sizeMB: 1 }],
  },
  {
    name: 'single-10mb',
    files: [{ name: 'file-10mb.bin', sizeMB: 10 }],
  },
  {
    name: 'single-50mb',
    files: [{ name: 'file-50mb.bin', sizeMB: 50 }],
  },
  {
    name: 'single-100mb',
    files: [{ name: 'file-100mb.bin', sizeMB: 100 }],
  },
  {
    name: 'parallel-5x10mb',
    files: [
      { name: 'file-1.bin', sizeMB: 10 },
      { name: 'file-2.bin', sizeMB: 10 },
      { name: 'file-3.bin', sizeMB: 10 },
      { name: 'file-4.bin', sizeMB: 10 },
      { name: 'file-5.bin', sizeMB: 10 },
    ],
  },
  {
    name: 'parallel-10x10mb',
    files: Array.from({ length: 10 }, (_, i) => ({
      name: `file-${i}.bin`,
      sizeMB: 10,
    })),
  },
];

// =============================================================================
// Main
// =============================================================================

async function main() {
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║       DETAILED UPLOAD PHASE BENCHMARK                        ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');
  console.log();

  // Parse args
  const args = process.argv.slice(2);
  const selectedScenarios = args.filter((a) => !a.startsWith('--'));
  const runAll = args.includes('--all') || selectedScenarios.length === 0;

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
    console.log('\nAvailable scenarios:');
    SCENARIOS.forEach((s) => console.log(`  - ${s.name}`));
    process.exit(1);
  }

  // Run scenarios
  for (const scenario of scenariosToRun) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Scenario: ${scenario.name}`);
    console.log('='.repeat(60));

    // Generate test data
    console.log('Generating test data...');
    const files: Array<{ file: UploadFile; sizeMB: number }> = [];
    for (const spec of scenario.files) {
      const sizeBytes = spec.sizeMB * 1024 * 1024;
      const data = generateRandomData(sizeBytes);
      const tree = buildUploadTree([
        {
          path: spec.name,
          data: data,
          mimeType: 'application/octet-stream',
        },
      ]);
      files.push({ file: tree.files[0]!, sizeMB: spec.sizeMB });
    }

    const totalMB = files.reduce((sum, f) => sum + f.sizeMB, 0);
    console.log(`Files: ${files.length}, Total: ${totalMB} MB`);

    // Create collection
    console.log('Creating collection...');
    const { data: collection, error: collError } = await client.api.POST('/collections', {
      body: {
        label: `Benchmark Detail - ${scenario.name} - ${Date.now()}`,
      },
    });

    if (collError || !collection) {
      console.error('Failed to create collection:', collError);
      continue;
    }

    // Create file entities
    console.log('Creating file entities...');
    const fileEntities: Array<{ id: string; file: UploadFile; sizeMB: number }> = [];

    for (const { file, sizeMB } of files) {
      const { data, error } = await client.api.POST('/entities', {
        body: {
          type: 'file',
          properties: {
            label: file.name,
            filename: file.name,
            content_type: file.mimeType,
            size: file.size,
          },
          collection: collection.id,
        },
      });

      if (error || !data) {
        console.error(`Failed to create entity for ${file.name}:`, error);
        continue;
      }

      fileEntities.push({ id: data.id, file, sizeMB });
    }

    // Upload files and collect timing
    console.log('\nUploading with detailed timing...');
    const timings: UploadTiming[] = [];

    if (fileEntities.length === 1) {
      // Sequential for single file
      const { id, file, sizeMB } = fileEntities[0]!;
      console.log(`  Uploading ${file.name} (${sizeMB} MB)...`);
      const timing = await instrumentedUploadFile(client, id, file);
      timings.push(timing);
      console.log(`  Done in ${(timing.totalMs / 1000).toFixed(2)}s`);
    } else {
      // Parallel for multiple files
      const startTime = performance.now();
      const results = await Promise.all(
        fileEntities.map(async ({ id, file, sizeMB }) => {
          const timing = await instrumentedUploadFile(client, id, file);
          console.log(`  ${file.name}: ${(timing.httpPostMs / 1000).toFixed(2)}s HTTP, ${(timing.fileSize / 1024 / 1024 / (timing.httpPostMs / 1000)).toFixed(2)} MB/s`);
          return timing;
        })
      );
      timings.push(...results);
      const wallTime = performance.now() - startTime;
      console.log(`  Wall clock time: ${(wallTime / 1000).toFixed(2)}s`);
      console.log(`  Effective throughput: ${(totalMB / (wallTime / 1000)).toFixed(2)} MB/s`);
    }

    // Analyze timing breakdown
    console.log('\nTiming Breakdown:');
    console.log('-'.repeat(60));

    for (const timing of timings) {
      const sizeMB = timing.fileSize / 1024 / 1024;
      const httpSeconds = timing.httpPostMs / 1000;
      const mbps = sizeMB / httpSeconds;

      console.log(`File: ${sizeMB.toFixed(1)} MB`);
      console.log(`  getData():    ${timing.getDataMs.toFixed(1)}ms (${((timing.getDataMs / timing.totalMs) * 100).toFixed(1)}%)`);
      console.log(`  Blob create:  ${timing.blobCreateMs.toFixed(1)}ms (${((timing.blobCreateMs / timing.totalMs) * 100).toFixed(1)}%)`);
      console.log(`  HTTP POST:    ${timing.httpPostMs.toFixed(1)}ms (${((timing.httpPostMs / timing.totalMs) * 100).toFixed(1)}%)`);
      console.log(`  Total:        ${timing.totalMs.toFixed(1)}ms`);
      console.log(`  HTTP speed:   ${mbps.toFixed(2)} MB/s`);
      console.log();
    }

    // Aggregate stats
    if (timings.length > 1) {
      const avgHttpMs = timings.reduce((sum, t) => sum + t.httpPostMs, 0) / timings.length;
      const avgMbps = timings.reduce((sum, t) => sum + (t.fileSize / 1024 / 1024) / (t.httpPostMs / 1000), 0) / timings.length;
      console.log('Aggregate (parallel):');
      console.log(`  Avg HTTP time: ${(avgHttpMs / 1000).toFixed(2)}s`);
      console.log(`  Avg per-file speed: ${avgMbps.toFixed(2)} MB/s`);
    }
  }

  console.log('\nDone!');
}

main().catch((err) => {
  console.error('Benchmark failed:', err);
  process.exit(1);
});
