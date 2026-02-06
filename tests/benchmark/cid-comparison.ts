/**
 * CID Computation Location Comparison Test
 *
 * Compares upload speed with:
 * 1. Server-side CID computation (current)
 * 2. Client-side CID computation (new)
 */

import { ArkeClient, getAuthorizationHeader } from '../../src/client/ArkeClient.js';
import { computeCid } from '../../src/operations/upload/cid.js';
import { loadConfig, hasApiKey, type E2EConfig } from '../e2e/setup.js';

function generateRandomData(sizeMB: number): Uint8Array {
  const size = sizeMB * 1024 * 1024;
  const data = new Uint8Array(size);
  for (let i = 0; i < size; i++) {
    data[i] = Math.floor(Math.random() * 256);
  }
  return data;
}

async function runTest(client: ArkeClient, sizeMB: number) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Testing with ${sizeMB} MB file`);
  console.log('='.repeat(60));

  // Generate test data
  console.log('Generating test data...');
  const data = generateRandomData(sizeMB);
  const blob = new Blob([data], { type: 'application/octet-stream' });
  console.log(`Data size: ${(data.length / 1024 / 1024).toFixed(2)} MB`);

  // Create a collection for the test
  const { data: collection, error: collError } = await client.api.POST('/collections', {
    body: { label: `CID Test ${Date.now()}` },
  });
  if (collError || !collection) {
    throw new Error(`Failed to create collection: ${JSON.stringify(collError)}`);
  }
  console.log(`Created collection: ${collection.id}`);

  // ─────────────────────────────────────────────────────────────────────────
  // Test 1: Server-side CID computation (current approach)
  // ─────────────────────────────────────────────────────────────────────────
  console.log('\n--- Test 1: Server-side CID computation ---');

  // Create file entity
  const { data: file1, error: file1Error } = await client.api.POST('/entities', {
    body: {
      type: 'file',
      properties: { label: 'server-cid-test.bin', filename: 'server-cid-test.bin', size: data.length },
      collection: collection.id,
    },
  });
  if (file1Error || !file1) {
    throw new Error(`Failed to create file entity: ${JSON.stringify(file1Error)}`);
  }

  // Upload with server-side CID
  const serverStart = performance.now();
  const { error: upload1Error } = await client.api.POST('/entities/{id}/content', {
    params: { path: { id: file1.id }, query: { key: 'v1', filename: 'server-cid-test.bin' } },
    body: blob as unknown as Record<string, never>,
    bodySerializer: (b: unknown) => b as BodyInit,
    headers: { 'Content-Type': 'application/octet-stream' },
  } as Parameters<typeof client.api.POST>[1]);
  const serverTime = performance.now() - serverStart;

  if (upload1Error) {
    throw new Error(`Server-side upload failed: ${JSON.stringify(upload1Error)}`);
  }

  const serverSpeed = sizeMB / (serverTime / 1000);
  console.log(`  Time: ${(serverTime / 1000).toFixed(2)}s`);
  console.log(`  Speed: ${serverSpeed.toFixed(2)} MB/s`);

  // ─────────────────────────────────────────────────────────────────────────
  // Test 2: Client-side CID computation (new approach)
  // ─────────────────────────────────────────────────────────────────────────
  console.log('\n--- Test 2: Client-side CID computation ---');

  // Create another file entity
  const { data: file2, error: file2Error } = await client.api.POST('/entities', {
    body: {
      type: 'file',
      properties: { label: 'client-cid-test.bin', filename: 'client-cid-test.bin', size: data.length },
      collection: collection.id,
    },
  });
  if (file2Error || !file2) {
    throw new Error(`Failed to create file entity: ${JSON.stringify(file2Error)}`);
  }

  // Compute CID client-side first
  console.log('  Computing CID client-side...');
  const cidStart = performance.now();
  const clientCid = await computeCid(data);
  const cidTime = performance.now() - cidStart;
  console.log(`  CID computation: ${(cidTime / 1000).toFixed(3)}s`);
  console.log(`  CID: ${clientCid.slice(0, 20)}...`);

  // Upload with client-side CID (skip server computation)
  const clientStart = performance.now();

  // Use fetch directly to have full control over the request
  // Access client internals for auth token
  const clientAny = client as unknown as { config: { baseUrl: string; authToken: string } };
  const uploadUrl = `${clientAny.config.baseUrl}/entities/${file2.id}/content?key=v1&filename=client-cid-test.bin&compute_cid=false`;
  const response = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      'Authorization': getAuthorizationHeader(clientAny.config.authToken),
      'Content-Type': 'application/octet-stream',
      'X-Content-CID': clientCid,
    },
    body: blob,
  });
  const clientUploadTime = performance.now() - clientStart;

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Client-side upload failed: ${response.status} ${errorText}`);
  }

  const totalClientTime = cidTime + clientUploadTime;
  const clientUploadSpeed = sizeMB / (clientUploadTime / 1000);
  const clientTotalSpeed = sizeMB / (totalClientTime / 1000);

  console.log(`  Upload time: ${(clientUploadTime / 1000).toFixed(2)}s`);
  console.log(`  Upload speed: ${clientUploadSpeed.toFixed(2)} MB/s`);
  console.log(`  Total time (CID + upload): ${(totalClientTime / 1000).toFixed(2)}s`);
  console.log(`  Total speed: ${clientTotalSpeed.toFixed(2)} MB/s`);

  // ─────────────────────────────────────────────────────────────────────────
  // Comparison
  // ─────────────────────────────────────────────────────────────────────────
  console.log('\n--- Comparison ---');
  console.log(`  Server-side: ${(serverTime / 1000).toFixed(2)}s @ ${serverSpeed.toFixed(2)} MB/s`);
  console.log(`  Client-side: ${(totalClientTime / 1000).toFixed(2)}s @ ${clientTotalSpeed.toFixed(2)} MB/s`);

  const speedup = serverTime / totalClientTime;
  const uploadSpeedup = serverTime / clientUploadTime;
  console.log(`  Upload speedup (no CID): ${uploadSpeedup.toFixed(2)}x`);
  console.log(`  Total speedup (with client CID): ${speedup.toFixed(2)}x`);

  return {
    sizeMB,
    serverTime,
    serverSpeed,
    clientCidTime: cidTime,
    clientUploadTime,
    clientTotalTime: totalClientTime,
    clientUploadSpeed,
    clientTotalSpeed,
    uploadSpeedup,
    totalSpeedup: speedup,
  };
}

async function main() {
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║     CID COMPUTATION LOCATION COMPARISON                      ║');
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

  // Run tests for different sizes
  const sizes = [10, 50];  // MB
  const results = [];

  for (const size of sizes) {
    try {
      const result = await runTest(client, size);
      results.push(result);
    } catch (error) {
      console.error(`\nError testing ${size}MB:`, error);
    }
  }

  // Summary
  console.log('\n' + '═'.repeat(60));
  console.log('SUMMARY');
  console.log('═'.repeat(60));
  console.log('\nSize (MB) | Server (s) | Client (s) | Speedup');
  console.log('-'.repeat(50));
  for (const r of results) {
    console.log(
      `${r.sizeMB.toString().padStart(8)} | ` +
      `${(r.serverTime / 1000).toFixed(2).padStart(10)} | ` +
      `${(r.clientTotalTime / 1000).toFixed(2).padStart(10)} | ` +
      `${r.totalSpeedup.toFixed(2)}x`
    );
  }

  console.log('\nDone!');
}

main().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
