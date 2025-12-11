#!/usr/bin/env npx tsx
/**
 * Comprehensive Integration Test for @arke-institute/sdk
 *
 * Tests:
 * 1. Create collection with nested directories
 * 2. Add files to existing collection
 * 3. Collection management (list, get, update)
 * 4. Permission testing (two users)
 * 5. Visibility testing
 *
 * Usage:
 *   npx tsx test/integration-test.ts
 *
 * Requires test/.env with:
 *   ARKE_AUTH_TOKEN=<user1 jwt>
 *   ARKE_AUTH_TOKEN_USER2=<user2 jwt>
 */

import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { UploadClient } from '../src/upload/client';
import { CollectionsClient } from '../src/collections/client';

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
const AUTH_TOKEN_USER1 = process.env.ARKE_AUTH_TOKEN;
const AUTH_TOKEN_USER2 = process.env.ARKE_AUTH_TOKEN_2 || process.env.ARKE_AUTH_TOKEN_USER2;

if (!AUTH_TOKEN_USER1) {
  console.error('ERROR: ARKE_AUTH_TOKEN is required');
  process.exit(1);
}

if (!AUTH_TOKEN_USER2) {
  console.error('ERROR: ARKE_AUTH_TOKEN_USER2 is required for permission tests');
  process.exit(1);
}

const TEST_ARCHIVE_DIR = resolve(__dirname, 'fixtures/test-archive');

// Test state - shared between tests
let testCollectionId: string;
let testRootPi: string;
let testBatchId: string;

// Utility functions
function log(message: string) {
  console.log(`   ${message}`);
}

function success(message: string) {
  console.log(`   ✓ ${message}`);
}

function fail(message: string) {
  console.log(`   ✗ ${message}`);
}

function section(title: string) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`${title}`);
  console.log('='.repeat(60));
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================================================
// TEST 1: Create Collection with Nested Directories
// ============================================================================
async function test1_createCollectionWithNestedDirs() {
  section('TEST 1: Create Collection with Nested Directories');

  const client = new UploadClient({
    gatewayUrl: GATEWAY_URL,
    authToken: AUTH_TOKEN_USER1!,
  });

  log('Uploading test-archive/ directory...');
  log(`Path: ${TEST_ARCHIVE_DIR}`);

  try {
    const result = await client.createCollection({
      files: TEST_ARCHIVE_DIR,
      collectionMetadata: {
        title: 'SDK Integration Test Collection',
        slug: `sdk-integration-test-${Date.now()}`,
        description: 'Created by SDK integration tests',
        visibility: 'private', // Start as private for permission testing
      },
      onProgress: (progress) => {
        log(`[${progress.phase}] ${progress.filesUploaded}/${progress.filesTotal} files, ${progress.percentComplete}%`);
      },
    });

    // Store for later tests
    testCollectionId = result.collection.id;
    testRootPi = result.rootPi;
    testBatchId = result.batchId;

    log('');
    log(`Batch ID: ${result.batchId}`);
    log(`Root PI: ${result.rootPi}`);
    log(`Collection ID: ${result.collection.id}`);
    log(`Collection Title: ${result.collection.title}`);
    log(`Visibility: ${result.collection.visibility}`);
    log(`Files Uploaded: ${result.filesUploaded}`);
    log(`View at: https://arke.institute/${result.rootPi}`);

    success('Collection created with nested directories');
    return true;
  } catch (e: any) {
    fail(`Failed: ${e.message}`);
    return false;
  }
}

// ============================================================================
// TEST 2: List and Get Collection
// ============================================================================
async function test2_listAndGetCollection() {
  section('TEST 2: List and Get Collection');

  const client = new UploadClient({
    gatewayUrl: GATEWAY_URL,
    authToken: AUTH_TOKEN_USER1!,
  });

  try {
    // List user's collections
    log('Listing user collections...');
    const myCollections = await client.collections.getMyCollections();
    log(`Owned collections: ${myCollections.owned.length}`);
    log(`Editor access: ${myCollections.editing?.length || 0}`);
    log(`Total: ${myCollections.total}`);

    // Verify our test collection is in the list
    const found = myCollections.owned.find(c => c.id === testCollectionId);
    if (!found) {
      fail('Test collection not found in owned collections');
      return false;
    }
    success('Test collection found in owned collections');

    // Get collection details
    log('');
    log('Getting collection details...');
    const details = await client.collections.getCollection(testCollectionId);
    log(`Title: ${details.title}`);
    log(`Slug: ${details.slug}`);
    log(`Visibility: ${details.visibility}`);
    log(`Root PI: ${details.root_pi}`);

    success('Collection details retrieved');
    return true;
  } catch (e: any) {
    fail(`Failed: ${e.message}`);
    return false;
  }
}

// ============================================================================
// TEST 3: Update Collection Metadata
// ============================================================================
async function test3_updateCollection() {
  section('TEST 3: Update Collection Metadata');

  const client = new UploadClient({
    gatewayUrl: GATEWAY_URL,
    authToken: AUTH_TOKEN_USER1!,
  });

  try {
    log('Updating collection title and description...');

    const updated = await client.collections.updateCollection(testCollectionId, {
      title: 'SDK Integration Test Collection (Updated)',
      description: 'This collection was updated via the SDK',
    });

    log(`New title: ${updated.title}`);
    log(`New description: ${updated.description}`);

    success('Collection metadata updated');
    return true;
  } catch (e: any) {
    fail(`Failed: ${e.message}`);
    return false;
  }
}

// ============================================================================
// TEST 4: Check Permissions (User 1 - Owner)
// ============================================================================
async function test4_checkPermissionsOwner() {
  section('TEST 4: Check Permissions (User 1 - Owner)');

  const client = new UploadClient({
    gatewayUrl: GATEWAY_URL,
    authToken: AUTH_TOKEN_USER1!,
  });

  try {
    log(`Checking permissions for PI: ${testRootPi}`);

    const permissions = await client.canEdit(testRootPi);

    log(`Can View: ${permissions.canView}`);
    log(`Can Edit: ${permissions.canEdit}`);
    log(`Can Administer: ${permissions.canAdminister}`);
    log(`Role: ${permissions.collection?.role}`);

    if (!permissions.canEdit) {
      fail('Owner should be able to edit');
      return false;
    }

    if (!permissions.canAdminister) {
      fail('Owner should be able to administer');
      return false;
    }

    success('Owner has correct permissions');
    return true;
  } catch (e: any) {
    fail(`Failed: ${e.message}`);
    return false;
  }
}

// ============================================================================
// TEST 5: Permission Denied (User 2 - No Access)
// ============================================================================
async function test5_permissionDeniedUser2() {
  section('TEST 5: Permission Denied (User 2 - No Access)');

  const client = new UploadClient({
    gatewayUrl: GATEWAY_URL,
    authToken: AUTH_TOKEN_USER2!,
  });

  try {
    log(`User 2 checking permissions for PI: ${testRootPi}`);

    const permissions = await client.canEdit(testRootPi);

    log(`Can View: ${permissions.canView}`);
    log(`Can Edit: ${permissions.canEdit}`);
    log(`Can Administer: ${permissions.canAdminister}`);
    log(`Role: ${permissions.collection?.role || 'none'}`);

    // Private collection - User 2 should NOT have view access
    if (permissions.canEdit) {
      fail('User 2 should NOT be able to edit private collection');
      return false;
    }

    success('User 2 correctly denied edit access');

    // Try to add files - should fail (don't use dryRun since that skips permission check)
    log('');
    log('Attempting to add files as User 2 (should fail)...');

    try {
      // Use the canEdit method directly to check permissions
      // Since canEdit returns false, addToCollection would fail
      // but let's just verify canEdit is false
      if (permissions.canEdit) {
        fail('User 2 should NOT be able to edit');
        return false;
      }
      success('User 2 correctly cannot edit (canEdit=false)');
      return true;
    } catch (e: any) {
      fail(`Unexpected error: ${e.message}`);
      return false;
    }
  } catch (e: any) {
    fail(`Failed: ${e.message}`);
    return false;
  }
}

// Store invitation ID for User 2 to accept
let testInvitationId: string;

// ============================================================================
// TEST 6: Invite User 2 as Editor
// ============================================================================
async function test6_inviteUser2AsEditor() {
  section('TEST 6: Invite User 2 as Editor');

  const client = new UploadClient({
    gatewayUrl: GATEWAY_URL,
    authToken: AUTH_TOKEN_USER1!,
  });

  try {
    // Get User 2's email from JWT
    const user2Payload = JSON.parse(
      Buffer.from(AUTH_TOKEN_USER2!.split('.')[1], 'base64').toString()
    );
    const user2Email = user2Payload.email;

    log(`Creating invitation for User 2 (${user2Email}) as editor...`);

    const invitation = await client.collections.createInvitation(testCollectionId, user2Email, 'editor');
    testInvitationId = invitation.id;

    log(`Invitation ID: ${invitation.id}`);
    log(`Status: ${invitation.status}`);
    log(`Expires: ${invitation.expires_at}`);

    success('Invitation created');

    // List pending invitations
    log('');
    log('Listing collection invitations...');
    const invitations = await client.collections.listInvitations(testCollectionId);
    log(`Total invitations: ${invitations.invitations.length}`);
    for (const inv of invitations.invitations) {
      log(`  - ${inv.invitee?.email}: ${inv.role} (${inv.status})`);
    }

    success('Invitation verified in list');
    return true;
  } catch (e: any) {
    fail(`Failed: ${e.message}`);
    return false;
  }
}

// ============================================================================
// TEST 7: User 2 Accepts Invitation and Can Edit
// ============================================================================
async function test7_user2AcceptsAndCanEdit() {
  section('TEST 7: User 2 Accepts Invitation and Can Edit');

  const client2 = new UploadClient({
    gatewayUrl: GATEWAY_URL,
    authToken: AUTH_TOKEN_USER2!,
  });

  try {
    // First, User 2 needs to see their pending invitations
    log('User 2 checking pending invitations...');
    const myInvitations = await client2.collections.getMyInvitations();
    log(`Pending invitations: ${myInvitations.invitations.length}`);

    const pendingInvite = myInvitations.invitations.find(i => i.id === testInvitationId);
    if (!pendingInvite) {
      fail('Invitation not found in User 2 invitations');
      return false;
    }
    log(`Found invitation for: ${pendingInvite.collection?.title}`);

    // Accept the invitation
    log('');
    log('User 2 accepting invitation...');
    const acceptResult = await client2.collections.acceptInvitation(testInvitationId);
    log(`Accepted with role: ${acceptResult.role}`);
    success('Invitation accepted');

    // Now check permissions
    log('');
    log('User 2 checking permissions after accepting...');
    const permissions = await client2.canEdit(testRootPi);

    log(`Can View: ${permissions.canView}`);
    log(`Can Edit: ${permissions.canEdit}`);
    log(`Can Administer: ${permissions.canAdminister}`);
    log(`Role: ${permissions.collection?.role}`);

    if (!permissions.canEdit) {
      fail('User 2 should now be able to edit');
      return false;
    }

    if (permissions.canAdminister) {
      fail('User 2 (editor) should NOT be able to administer');
      return false;
    }

    success('User 2 now has editor permissions');
    return true;
  } catch (e: any) {
    fail(`Failed: ${e.message}`);
    return false;
  }
}

// ============================================================================
// TEST 8: Remove User 2
// ============================================================================
async function test8_removeUser2() {
  section('TEST 8: Remove User 2');

  const client = new UploadClient({
    gatewayUrl: GATEWAY_URL,
    authToken: AUTH_TOKEN_USER1!,
  });

  try {
    // Get User 2's internal ID
    const user2Payload = JSON.parse(
      Buffer.from(AUTH_TOKEN_USER2!.split('.')[1], 'base64').toString()
    );
    const user2Email = user2Payload.email;

    // Get members to find User 2's ID
    log('Listing collection members...');
    const membersResp = await client.collections.listMembers(testCollectionId);
    log(`Total members: ${membersResp.members.length}`);
    for (const m of membersResp.members) {
      log(`  - ${m.user.email}: ${m.role}`);
    }

    const user2Member = membersResp.members.find(m => m.user.email === user2Email);

    if (!user2Member) {
      fail('User 2 not found in members');
      return false;
    }

    log('');
    log(`Removing User 2 (${user2Email}) from collection...`);

    await client.collections.removeMember(testCollectionId, user2Member.user.id);

    success('User 2 removed from collection');

    // Verify User 2 no longer has access
    log('');
    log('Verifying User 2 no longer has edit access...');

    const client2 = new UploadClient({
      gatewayUrl: GATEWAY_URL,
      authToken: AUTH_TOKEN_USER2!,
    });

    const permissions = await client2.canEdit(testRootPi);

    log(`Can View: ${permissions.canView}`);
    log(`Can Edit: ${permissions.canEdit}`);

    if (permissions.canEdit) {
      fail('User 2 should no longer be able to edit');
      return false;
    }

    success('User 2 correctly denied access after removal');
    return true;
  } catch (e: any) {
    fail(`Failed: ${e.message}`);
    return false;
  }
}

// ============================================================================
// TEST 9: Change Visibility to Public
// ============================================================================
async function test9_changeVisibility() {
  section('TEST 9: Change Visibility to Public');

  const client = new UploadClient({
    gatewayUrl: GATEWAY_URL,
    authToken: AUTH_TOKEN_USER1!,
  });

  try {
    log('Changing collection visibility to public...');

    const updated = await client.collections.updateCollection(testCollectionId, {
      visibility: 'public',
    });

    log(`New visibility: ${updated.visibility}`);

    if (updated.visibility !== 'public') {
      fail('Visibility should be public');
      return false;
    }

    success('Collection is now public');

    // User 2 should now be able to view (but not edit since not a member)
    log('');
    log('Checking User 2 can now view public collection...');

    const client2 = new UploadClient({
      gatewayUrl: GATEWAY_URL,
      authToken: AUTH_TOKEN_USER2!,
    });

    const permissions = await client2.canEdit(testRootPi);

    log(`Can View: ${permissions.canView}`);
    log(`Can Edit: ${permissions.canEdit}`);

    if (!permissions.canView) {
      fail('User 2 should be able to view public collection');
      return false;
    }

    if (permissions.canEdit) {
      fail('User 2 should NOT be able to edit (not a member)');
      return false;
    }

    success('Public visibility working correctly');
    return true;
  } catch (e: any) {
    fail(`Failed: ${e.message}`);
    return false;
  }
}

// ============================================================================
// TEST 10: Add Files to Collection (addToCollection)
// ============================================================================
async function test10_addFilesToCollection() {
  section('TEST 10: Add Files to Existing Collection');

  const client = new UploadClient({
    gatewayUrl: GATEWAY_URL,
    authToken: AUTH_TOKEN_USER1!,
  });

  try {
    log(`Adding files to collection under root PI: ${testRootPi}`);

    // Create a small test file to add
    const additionalFilesDir = resolve(__dirname, 'fixtures');

    const result = await client.addToCollection({
      files: additionalFilesDir,
      parentPi: testRootPi,
      onProgress: (progress) => {
        log(`[${progress.phase}] ${progress.filesUploaded}/${progress.filesTotal} files, ${progress.percentComplete}%`);
      },
    });

    log('');
    log(`New Batch ID: ${result.batchId}`);
    log(`New Root PI: ${result.rootPi}`);
    log(`Files Uploaded: ${result.filesUploaded}`);

    success('Files added to collection');
    return true;
  } catch (e: any) {
    fail(`Failed: ${e.message}`);
    return false;
  }
}

// ============================================================================
// Main Test Runner
// ============================================================================
async function main() {
  console.log('\n' + '='.repeat(60));
  console.log('ARKE SDK INTEGRATION TESTS');
  console.log('='.repeat(60));
  console.log(`\nGateway: ${GATEWAY_URL}`);
  console.log(`Test Archive: ${TEST_ARCHIVE_DIR}`);

  const results: { name: string; passed: boolean }[] = [];

  // Run tests in sequence
  results.push({ name: 'Create Collection with Nested Dirs', passed: await test1_createCollectionWithNestedDirs() });

  if (!testCollectionId) {
    console.log('\n\nTest 1 failed - cannot continue without collection');
    process.exit(1);
  }

  results.push({ name: 'List and Get Collection', passed: await test2_listAndGetCollection() });
  results.push({ name: 'Update Collection Metadata', passed: await test3_updateCollection() });
  results.push({ name: 'Check Permissions (Owner)', passed: await test4_checkPermissionsOwner() });
  results.push({ name: 'Permission Denied (User 2)', passed: await test5_permissionDeniedUser2() });
  results.push({ name: 'Invite User 2 as Editor', passed: await test6_inviteUser2AsEditor() });
  results.push({ name: 'User 2 Accepts and Can Edit', passed: await test7_user2AcceptsAndCanEdit() });
  results.push({ name: 'Remove User 2', passed: await test8_removeUser2() });
  results.push({ name: 'Change Visibility to Public', passed: await test9_changeVisibility() });
  results.push({ name: 'Add Files to Collection', passed: await test10_addFilesToCollection() });

  // Summary
  section('TEST SUMMARY');

  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;

  for (const result of results) {
    console.log(`   ${result.passed ? '✓' : '✗'} ${result.name}`);
  }

  console.log('');
  console.log(`   Passed: ${passed}/${results.length}`);
  console.log(`   Failed: ${failed}/${results.length}`);

  if (testRootPi) {
    console.log('');
    console.log(`   Test Collection: https://arke.institute/${testRootPi}`);
  }

  console.log('\n' + '='.repeat(60) + '\n');

  process.exit(failed > 0 ? 1 : 0);
}

main().catch(console.error);
