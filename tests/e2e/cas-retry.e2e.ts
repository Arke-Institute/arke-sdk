/**
 * CAS Retry Integration Test
 *
 * Tests the withCasRetry utility under real concurrent load.
 * Run with: npx tsx tests/e2e/cas-retry.e2e.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { ArkeClient } from '../../src/client/ArkeClient.js';
import { withCasRetry, CasRetryExhaustedError } from '../../src/operations/cas.js';

// =============================================================================
// Configuration
// =============================================================================

const CONCURRENCY_LEVELS = [10, 50, 100, 500, 1000];
const DEFAULT_CONCURRENCY = 100;

// Load .env file
function loadEnv(): Record<string, string> {
  const envPath = path.resolve(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) {
    throw new Error('.env file not found. Copy .env.example to .env and add your API key.');
  }
  const content = fs.readFileSync(envPath, 'utf-8');
  const vars: Record<string, string> = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIndex = line.indexOf('=');
    if (eqIndex > 0) {
      const key = line.slice(0, eqIndex).trim();
      const value = line.slice(eqIndex + 1).trim();
      vars[key] = value;
    }
  }
  return vars;
}

const env = loadEnv();
const API_KEY = process.env.ARKE_API_KEY || env.ARKE_API_KEY;
const BASE_URL = process.env.ARKE_BASE_URL || env.ARKE_BASE_URL || 'https://api.arke.institute';

if (!API_KEY) {
  throw new Error('ARKE_API_KEY not set. Add it to .env or set as environment variable.');
}

// =============================================================================
// Test Helpers
// =============================================================================

interface TestResult {
  concurrency: number;
  successes: number;
  failures: number;
  totalAttempts: number;
  avgAttempts: number;
  maxAttempts: number;
  minAttempts: number;
  durationMs: number;
  retriesPerSuccess: number;
}

async function runConcurrencyTest(
  client: ArkeClient,
  folderId: string,
  concurrency: number
): Promise<TestResult> {
  console.log(`\n🚀 Testing with ${concurrency} concurrent requests...`);

  const attempts: number[] = [];
  let failures = 0;
  const startTime = Date.now();

  // Create N concurrent update promises
  const promises = Array.from({ length: concurrency }, async (_, i) => {
    const childLabel = `child-${Date.now()}-${i}`;

    try {
      const result = await withCasRetry(
        {
          getTip: async () => {
            // Use lightweight tip endpoint - single DO lookup, no manifest fetch
            const { data, error } = await client.api.GET('/entities/{id}/tip', {
              params: { path: { id: folderId } },
            });
            if (error || !data) {
              throw new Error(`Failed to get tip: ${JSON.stringify(error)}`);
            }
            return data.cid;
          },
          update: async (tip) => {
            // Each request tries to update the folder's note with a unique value
            // This is an "additive" operation - we don't care about other updates
            return client.api.PUT('/folders/{id}', {
              params: { path: { id: folderId } },
              body: {
                expect_tip: tip,
                note: `Updated by request ${i} at ${Date.now()}`,
              },
            });
          },
        },
        {
          concurrency,
          onRetry: (attempt, err, delay) => {
            // Uncomment for verbose logging:
            // console.log(`  [${i}] Retry ${attempt}, delay ${delay}ms`);
          },
        }
      );

      attempts.push(result.attempts);
      return { success: true, attempts: result.attempts };
    } catch (error) {
      if (error instanceof CasRetryExhaustedError) {
        console.log(`  ❌ Request ${i} exhausted retries after ${error.attempts} attempts`);
        attempts.push(error.attempts);
        failures++;
        return { success: false, attempts: error.attempts };
      }
      throw error;
    }
  });

  // Wait for all to complete
  await Promise.all(promises);

  const durationMs = Date.now() - startTime;
  const successes = concurrency - failures;
  const totalAttempts = attempts.reduce((a, b) => a + b, 0);

  const result: TestResult = {
    concurrency,
    successes,
    failures,
    totalAttempts,
    avgAttempts: totalAttempts / concurrency,
    maxAttempts: Math.max(...attempts),
    minAttempts: Math.min(...attempts),
    durationMs,
    retriesPerSuccess: successes > 0 ? (totalAttempts - successes) / successes : 0,
  };

  console.log(`  ✅ Successes: ${successes}/${concurrency} (${((successes / concurrency) * 100).toFixed(1)}%)`);
  console.log(`  📊 Attempts: avg=${result.avgAttempts.toFixed(1)}, min=${result.minAttempts}, max=${result.maxAttempts}`);
  console.log(`  ⏱️  Duration: ${durationMs}ms`);
  console.log(`  🔄 Retries per success: ${result.retriesPerSuccess.toFixed(2)}`);

  return result;
}

// =============================================================================
// Main
// =============================================================================

async function main() {
  console.log('='.repeat(60));
  console.log('CAS Retry Integration Test');
  console.log('='.repeat(60));

  // Parse args
  const args = process.argv.slice(2);
  const concurrencyArg = args.find((a) => a.startsWith('--concurrency='));
  const runAll = args.includes('--all');

  let concurrencyLevels: number[];
  if (runAll) {
    concurrencyLevels = CONCURRENCY_LEVELS;
  } else if (concurrencyArg) {
    concurrencyLevels = [parseInt(concurrencyArg.split('=')[1], 10)];
  } else {
    concurrencyLevels = [DEFAULT_CONCURRENCY];
  }

  console.log(`\nConcurrency levels to test: ${concurrencyLevels.join(', ')}`);

  // Setup
  console.log(`\n📡 Using API: ${BASE_URL}`);
  console.log(`🔑 Using API key: ${API_KEY.slice(0, 10)}...`);

  // Create client on test network
  const client = new ArkeClient({
    baseUrl: BASE_URL,
    authToken: API_KEY,
    network: 'test',
  });

  // Create a collection for our test
  console.log('\n📁 Creating test collection...');
  const { data: collection, error: collError } = await client.api.POST('/collections', {
    body: {
      label: `CAS Test ${Date.now()}`,
      note: 'Created for CAS retry integration testing',
    },
  });

  if (collError || !collection) {
    throw new Error(`Failed to create collection: ${JSON.stringify(collError)}`);
  }
  console.log(`   Collection ID: ${collection.id}`);

  // Create a folder to test concurrent updates on
  console.log('\n📁 Creating test folder...');
  const { data: folder, error: folderError } = await client.api.POST('/folders', {
    body: {
      label: `CAS Test Folder ${Date.now()}`,
      collection: collection.id,
    },
  });

  if (folderError || !folder) {
    throw new Error(`Failed to create folder: ${JSON.stringify(folderError)}`);
  }
  console.log(`   Folder ID: ${folder.id}`);

  // Run tests
  const results: TestResult[] = [];
  for (const concurrency of concurrencyLevels) {
    const result = await runConcurrencyTest(client, folder.id, concurrency);
    results.push(result);

    // Small delay between tests
    if (concurrencyLevels.length > 1) {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY');
  console.log('='.repeat(60));
  console.log('\n| Concurrency | Success Rate | Avg Attempts | Max Attempts | Duration |');
  console.log('|-------------|--------------|--------------|--------------|----------|');
  for (const r of results) {
    const successRate = ((r.successes / r.concurrency) * 100).toFixed(1);
    console.log(
      `| ${r.concurrency.toString().padStart(11)} | ${successRate.padStart(11)}% | ${r.avgAttempts.toFixed(1).padStart(12)} | ${r.maxAttempts.toString().padStart(12)} | ${(r.durationMs + 'ms').padStart(8)} |`
    );
  }

  // Cleanup - delete the collection (which cascades)
  console.log('\n🧹 Cleaning up...');
  // Note: We'd need to delete the folder and collection, but for test network this is fine
  // The test network entities auto-expire

  console.log('\n✅ Test complete!');

  // Exit with error if any failures at low concurrency
  const lowConcurrencyResult = results.find((r) => r.concurrency <= 100);
  if (lowConcurrencyResult && lowConcurrencyResult.failures > 0) {
    console.error('\n⚠️  Unexpected failures at low concurrency - this may indicate a bug');
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('\n❌ Test failed:', err);
  process.exit(1);
});
