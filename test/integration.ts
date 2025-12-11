#!/usr/bin/env npx ts-node
/**
 * Integration test script for @arke-institute/sdk
 *
 * This script tests the SDK against real gateway endpoints.
 *
 * Usage:
 *   # Set your auth token in test/.env or as environment variable
 *   # Then run:
 *   npx tsx test/integration.ts
 */

import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { CollectionsClient, UploadClient } from '../src/index';

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

// Use the custom domain for gateway - the .workers.dev subdomain has routing issues
const GATEWAY_URL = process.env.ARKE_GATEWAY_URL || 'https://gateway.arke.institute';
const AUTH_TOKEN = process.env.ARKE_AUTH_TOKEN;

// Known test PI from the collections worker (from previous session)
const TEST_PI = '01K9CS5NRH39ZVD3JRTQ1EP398';

async function main() {
  console.log('=== @arke-institute/sdk Integration Test ===\n');

  if (!AUTH_TOKEN) {
    console.log('No ARKE_AUTH_TOKEN set - running unauthenticated tests only\n');
  }

  // Test 1: CollectionsClient - List collections (public)
  console.log('1. Testing CollectionsClient.listCollections()...');
  const collections = new CollectionsClient({
    gatewayUrl: GATEWAY_URL,
    authToken: AUTH_TOKEN,
  });

  try {
    const result = await collections.listCollections({ limit: 5 });
    console.log(`   ✓ Listed ${result.collections.length} collections`);
    if (result.collections.length > 0) {
      console.log(`   First collection: "${result.collections[0].title}" (${result.collections[0].slug})`);
    }
  } catch (e: any) {
    console.log(`   ✗ Error: ${e.message}`);
  }

  // Test 2: CollectionsClient - Get PI permissions (public)
  console.log('\n2. Testing CollectionsClient.getPiPermissions()...');
  try {
    const perms = await collections.getPiPermissions(TEST_PI);
    console.log(`   ✓ Got permissions for PI ${TEST_PI}`);
    console.log(`   canView: ${perms.canView}, canEdit: ${perms.canEdit}, canAdminister: ${perms.canAdminister}`);
    if (perms.collection) {
      console.log(`   Collection: "${perms.collection.title}" (role: ${perms.collection.role || 'none'})`);
    } else {
      console.log(`   Not part of any collection`);
    }
  } catch (e: any) {
    console.log(`   ✗ Error: ${e.message}`);
  }

  // Test 3: UploadClient - canEdit check
  console.log('\n3. Testing UploadClient.canEdit()...');
  const upload = new UploadClient({
    gatewayUrl: GATEWAY_URL,
    authToken: AUTH_TOKEN || 'no-token',
    uploader: 'integration-test',
  });

  try {
    const perms = await upload.canEdit(TEST_PI);
    console.log(`   ✓ canEdit check for PI ${TEST_PI}`);
    console.log(`   Result: canEdit=${perms.canEdit}`);
  } catch (e: any) {
    console.log(`   ✗ Error: ${e.message}`);
  }

  // Test 4: UploadClient - Permission denied test
  console.log('\n4. Testing UploadClient.addToCollection() permission check...');
  try {
    // This should fail with permission error if we don't have edit rights
    // Note: TEST_PI may or may not be in a collection
    await upload.addToCollection({
      files: '/tmp/nonexistent', // File won't exist but permission check comes first
      parentPi: TEST_PI,
    });
    console.log('   ✗ Expected permission error but got success');
  } catch (e: any) {
    if (e.message.includes('you need editor or owner role') ||
        e.message.includes('not part of any collection')) {
      console.log(`   ✓ Permission check working: "${e.message.slice(0, 60)}..."`);
    } else if (e.message.includes('No files found') ||
               e.message.includes('ENOENT') ||
               e.message.includes('Directory not found')) {
      // Permission check passed (either canEdit=true or PI not in collection but canEdit=true)
      // Then failed on file scan which is expected
      console.log(`   ✓ Permission check passed, failed on file scan (expected): "${e.message.slice(0, 50)}..."`);
    } else {
      console.log(`   ? Unexpected error: ${e.message}`);
    }
  }

  // Test 5: Authenticated tests (if token provided)
  if (AUTH_TOKEN) {
    console.log('\n5. Testing authenticated operations...');

    // Test getMyCollections
    try {
      const myColls = await collections.getMyCollections();
      console.log(`   ✓ getMyCollections(): ${myColls.total} collections (${myColls.owned.length} owned, ${myColls.editing.length} editing)`);
    } catch (e: any) {
      console.log(`   ✗ getMyCollections error: ${e.message}`);
    }

    // Test getMyInvitations
    try {
      const invites = await collections.getMyInvitations();
      console.log(`   ✓ getMyInvitations(): ${invites.invitations.length} pending invitations`);
    } catch (e: any) {
      console.log(`   ✗ getMyInvitations error: ${e.message}`);
    }
  } else {
    console.log('\n5. Skipping authenticated tests (no token)\n');
  }

  console.log('\n=== Integration Test Complete ===');
}

main().catch(console.error);
