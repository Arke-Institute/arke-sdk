/**
 * Batch Creation Diagnostic
 *
 * Tests the batch endpoint directly with detailed timing to identify bottlenecks.
 */

import { ArkeClient } from '../../src/client/ArkeClient.js';
import { loadConfig, hasApiKey } from '../e2e/setup.js';

const config = loadConfig();
if (!hasApiKey(config)) {
  throw new Error('API key required');
}

const client = new ArkeClient({
  baseUrl: config.baseUrl,
  authToken: config.apiKey,
  network: 'test',
});

console.log('╔══════════════════════════════════════════════════════════════╗');
console.log('║     BATCH CREATION DIAGNOSTIC                                ║');
console.log('╚══════════════════════════════════════════════════════════════╝\n');

// Create a test collection first
console.log('Creating test collection...');
const collStart = performance.now();
const { data: collection, error: collError } = await client.api.POST('/collections', {
  body: { label: `Batch Diagnostic ${Date.now()}` },
});
console.log(`  Collection created in ${(performance.now() - collStart).toFixed(0)}ms`);
console.log(`  ID: ${collection?.id}\n`);

if (collError || !collection) {
  throw new Error(`Failed to create collection: ${JSON.stringify(collError)}`);
}

const collectionId = collection.id;

// Test 1: Single batch of 100 entities
console.log('─'.repeat(60));
console.log('TEST 1: Single batch of 100 entities');
console.log('─'.repeat(60));

const entities100 = Array.from({ length: 100 }, (_, i) => ({
  type: 'file',
  properties: {
    label: `test_file_${i}.txt`,
    filename: `test_file_${i}.txt`,
    content_type: 'text/plain',
    size: 1024,
  },
  relationships: [{ predicate: 'in', peer: collectionId, peer_type: 'collection' }],
}));

const start100 = performance.now();
const { data: result100, error: error100 } = await client.api.POST('/entities/batch', {
  body: { default_collection: collectionId, entities: entities100 },
});
const time100 = performance.now() - start100;

console.log(`  Time: ${time100.toFixed(0)}ms`);
console.log(`  Success: ${result100?.summary.succeeded}/${result100?.summary.total}`);
console.log(`  Per entity: ${(time100 / 100).toFixed(1)}ms\n`);

// Test 2: 5 sequential batches of 100
console.log('─'.repeat(60));
console.log('TEST 2: 5 sequential batches of 100 (500 total)');
console.log('─'.repeat(60));

const seqTimes: number[] = [];
for (let batch = 0; batch < 5; batch++) {
  const entities = Array.from({ length: 100 }, (_, i) => ({
    type: 'file',
    properties: {
      label: `seq_batch${batch}_file_${i}.txt`,
      filename: `seq_batch${batch}_file_${i}.txt`,
      content_type: 'text/plain',
      size: 1024,
    },
    relationships: [{ predicate: 'in', peer: collectionId, peer_type: 'collection' }],
  }));

  const batchStart = performance.now();
  const { data, error } = await client.api.POST('/entities/batch', {
    body: { default_collection: collectionId, entities },
  });
  const batchTime = performance.now() - batchStart;
  seqTimes.push(batchTime);
  console.log(`  Batch ${batch + 1}: ${batchTime.toFixed(0)}ms (${data?.summary.succeeded} succeeded)`);
}
console.log(`  Total: ${seqTimes.reduce((a, b) => a + b, 0).toFixed(0)}ms`);
console.log(`  Average per batch: ${(seqTimes.reduce((a, b) => a + b, 0) / 5).toFixed(0)}ms\n`);

// Test 3: 5 parallel batches of 100
console.log('─'.repeat(60));
console.log('TEST 3: 5 parallel batches of 100 (500 total)');
console.log('─'.repeat(60));

const parallelStart = performance.now();
const parallelPromises = Array.from({ length: 5 }, (_, batch) => {
  const entities = Array.from({ length: 100 }, (_, i) => ({
    type: 'file',
    properties: {
      label: `par_batch${batch}_file_${i}.txt`,
      filename: `par_batch${batch}_file_${i}.txt`,
      content_type: 'text/plain',
      size: 1024,
    },
    relationships: [{ predicate: 'in', peer: collectionId, peer_type: 'collection' }],
  }));

  const batchStart = performance.now();
  return client.api.POST('/entities/batch', {
    body: { default_collection: collectionId, entities },
  }).then(({ data, error }) => ({
    batch,
    time: performance.now() - batchStart,
    succeeded: data?.summary.succeeded ?? 0,
    error,
  }));
});

const parallelResults = await Promise.all(parallelPromises);
const parallelTotal = performance.now() - parallelStart;

for (const r of parallelResults.sort((a, b) => a.batch - b.batch)) {
  console.log(`  Batch ${r.batch + 1}: ${r.time.toFixed(0)}ms (${r.succeeded} succeeded)`);
}
console.log(`  Wall clock: ${parallelTotal.toFixed(0)}ms`);
console.log(`  Speedup vs sequential: ${(seqTimes.reduce((a, b) => a + b, 0) / parallelTotal).toFixed(2)}x\n`);

// Test 4: 25 parallel batches of 20 (same 500 entities, more parallelism)
console.log('─'.repeat(60));
console.log('TEST 4: 25 parallel batches of 20 (500 total, higher parallelism)');
console.log('─'.repeat(60));

const parallel25Start = performance.now();
const parallel25Promises = Array.from({ length: 25 }, (_, batch) => {
  const entities = Array.from({ length: 20 }, (_, i) => ({
    type: 'file',
    properties: {
      label: `par25_batch${batch}_file_${i}.txt`,
      filename: `par25_batch${batch}_file_${i}.txt`,
      content_type: 'text/plain',
      size: 1024,
    },
    relationships: [{ predicate: 'in', peer: collectionId, peer_type: 'collection' }],
  }));

  const batchStart = performance.now();
  return client.api.POST('/entities/batch', {
    body: { default_collection: collectionId, entities },
  }).then(({ data, error }) => ({
    batch,
    time: performance.now() - batchStart,
    succeeded: data?.summary.succeeded ?? 0,
    error,
  }));
});

const parallel25Results = await Promise.all(parallel25Promises);
const parallel25Total = performance.now() - parallel25Start;

const times25 = parallel25Results.map(r => r.time);
console.log(`  Min batch time: ${Math.min(...times25).toFixed(0)}ms`);
console.log(`  Max batch time: ${Math.max(...times25).toFixed(0)}ms`);
console.log(`  Avg batch time: ${(times25.reduce((a, b) => a + b, 0) / 25).toFixed(0)}ms`);
console.log(`  Wall clock: ${parallel25Total.toFixed(0)}ms`);
console.log(`  Succeeded: ${parallel25Results.reduce((a, r) => a + r.succeeded, 0)}\n`);

// Test 5: Folder depth simulation (sequential depths, parallel within depth)
console.log('─'.repeat(60));
console.log('TEST 5: Folder depth simulation (3 depths, 20 folders each)');
console.log('─'.repeat(60));

const folderIds: string[] = [];
let depthTotal = 0;

for (let depth = 0; depth < 3; depth++) {
  const depthStart = performance.now();

  const folders = Array.from({ length: 20 }, (_, i) => ({
    type: 'folder',
    properties: { label: `depth${depth}_folder_${i}` },
    relationships: depth === 0
      ? [{ predicate: 'in', peer: collectionId, peer_type: 'collection' }]
      : [{ predicate: 'in', peer: folderIds[Math.floor(Math.random() * folderIds.length)], peer_type: 'folder' }],
  }));

  const { data, error } = await client.api.POST('/entities/batch', {
    body: { default_collection: collectionId, entities: folders },
  });

  const depthTime = performance.now() - depthStart;
  depthTotal += depthTime;

  // Collect folder IDs for next depth
  if (data) {
    for (const result of data.results) {
      if (result.success) {
        folderIds.push(result.id);
      }
    }
  }

  console.log(`  Depth ${depth}: ${depthTime.toFixed(0)}ms (${data?.summary.succeeded} folders)`);
}
console.log(`  Total: ${depthTotal.toFixed(0)}ms\n`);

// Summary
console.log('═'.repeat(60));
console.log('SUMMARY');
console.log('═'.repeat(60));
console.log(`
Single batch (100):     ${time100.toFixed(0)}ms
5 sequential (500):     ${seqTimes.reduce((a, b) => a + b, 0).toFixed(0)}ms
5 parallel (500):       ${parallelTotal.toFixed(0)}ms
25 parallel (500):      ${parallel25Total.toFixed(0)}ms
3 depth folders (60):   ${depthTotal.toFixed(0)}ms
`);

console.log('Analysis:');
if (parallelTotal < seqTimes.reduce((a, b) => a + b, 0) * 0.5) {
  console.log('  ✓ Parallel batches provide good speedup');
} else {
  console.log('  ⚠ Parallel batches not scaling well - possible rate limiting or contention');
}

const avgBatch = time100;
if (avgBatch > 3000) {
  console.log(`  ⚠ Single batch is slow (${avgBatch.toFixed(0)}ms) - API/DO overhead`);
} else {
  console.log(`  ✓ Single batch timing is reasonable (${avgBatch.toFixed(0)}ms)`);
}

console.log('\nTest collection ID:', collectionId);
console.log('(on test network - can be deleted)');
