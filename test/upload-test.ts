#!/usr/bin/env npx tsx
/**
 * Real upload test for @arke-institute/sdk
 *
 * Tests actual file upload through the gateway.
 *
 * Usage:
 *   npx tsx test/upload-test.ts
 */

import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { UploadClient } from '../src/upload/client';

// Load .env file from test directory
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '.env');
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      process.env[key.trim()] = valueParts.join('=').trim();
    }
  }
}

const GATEWAY_URL = process.env.ARKE_GATEWAY_URL || 'https://gateway.arke.institute';
const AUTH_TOKEN = process.env.ARKE_AUTH_TOKEN;

if (!AUTH_TOKEN) {
  console.error('ERROR: ARKE_AUTH_TOKEN is required for upload tests');
  console.error('Set it in test/.env or as an environment variable');
  process.exit(1);
}

const FIXTURES_DIR = resolve(__dirname, 'fixtures');

async function main() {
  console.log('=== @arke-institute/sdk Upload Test ===\n');
  console.log(`Gateway: ${GATEWAY_URL}`);
  console.log(`Fixtures: ${FIXTURES_DIR}\n`);

  const upload = new UploadClient({
    gatewayUrl: GATEWAY_URL,
    authToken: AUTH_TOKEN,
    // uploader defaults to user ID from JWT
  });

  // Test 1: Create a new collection with files (dry run first)
  console.log('1. Testing createCollection() with dry run...');
  try {
    const dryRunResult = await upload.createCollection({
      files: FIXTURES_DIR,
      collectionMetadata: {
        title: 'SDK Test Collection',
        slug: `sdk-test-${Date.now()}`,
        description: 'Created by SDK upload test',
        // visibility defaults to 'public'
      },
      dryRun: true,
    });

    console.log('   Dry run result:');
    console.log(`   - Batch ID: ${dryRunResult.batchId}`);
    console.log(`   - Root PI: ${dryRunResult.rootPi}`);
    console.log(`   - Files Uploaded: ${dryRunResult.filesUploaded}`);
    console.log('   ✓ Dry run completed successfully\n');
  } catch (e: any) {
    console.log(`   ✗ Dry run failed: ${e.message}\n`);
    // Continue to try real upload
  }

  // Test 2: Actually create a collection with files
  console.log('2. Testing createCollection() with real upload...');
  try {
    const result = await upload.createCollection({
      files: FIXTURES_DIR,
      collectionMetadata: {
        title: 'SDK Test Collection',
        slug: `sdk-test-${Date.now()}`,
        description: 'Created by SDK upload test',
        // visibility defaults to 'public'
      },
      onProgress: (progress) => {
        console.log(`   [Progress] ${progress.phase}: ${progress.filesUploaded}/${progress.filesTotal} files, ${progress.percentComplete}%`);
      },
    });

    console.log('   Upload result:');
    console.log(`   - Batch ID: ${result.batchId}`);
    console.log(`   - Root PI: ${result.rootPi}`);
    console.log(`   - Collection ID: ${result.collection?.id || 'N/A'}`);
    console.log(`   - Collection Title: ${result.collection?.title || 'N/A'}`);
    console.log(`   - Collection Root PI: ${result.collection?.rootPi || 'N/A'}`);
    console.log(`   - Files Uploaded: ${result.filesUploaded}`);
    console.log(`   - View at: https://arke.institute/${result.rootPi}`);
    console.log('   ✓ Upload completed successfully!\n');

    // If we got a collection, try to verify it exists
    if (result.collection?.id) {
      console.log('3. Verifying collection was created...');
      const collections = upload.collections;
      const details = await collections.getCollection(result.collection.id);
      console.log(`   ✓ Collection verified: "${details.title}" (${details.visibility})\n`);
    }
  } catch (e: any) {
    console.log(`   ✗ Upload failed: ${e.message}`);
    if (e.details) {
      console.log(`   Details: ${JSON.stringify(e.details, null, 2)}`);
    }
    console.log('');

    // Try to diagnose the issue
    console.log('Diagnosing issue...');

    // Check if it's an auth issue
    try {
      const myCollections = await upload.collections.getMyCollections();
      console.log(`   Auth working - you have ${myCollections.owned.length} owned collections`);
    } catch (authError: any) {
      console.log(`   Auth issue: ${authError.message}`);
    }
  }

  console.log('=== Upload Test Complete ===');
}

main().catch(console.error);
