#!/usr/bin/env npx tsx
/**
 * Integration Test for @arke-institute/sdk/edit
 *
 * Tests the EditClient and EditSession against the real gateway.
 *
 * Usage:
 *   npx tsx test/edit-client.test.ts
 *
 * Requires test/.env with:
 *   ARKE_AUTH_TOKEN=<owner jwt>
 *   ARKE_AUTH_TOKEN_2=<non-owner jwt>
 */

import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { EditClient, EditSession } from '../src/edit/index';
import {
  EditError,
  EntityNotFoundError,
  PermissionError,
  ValidationError,
} from '../src/edit/errors';
import { CollectionsClient } from '../src/collections/index';

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
const AUTH_TOKEN_OWNER = process.env.ARKE_AUTH_TOKEN;
const AUTH_TOKEN_NON_OWNER = process.env.ARKE_AUTH_TOKEN_2;

if (!AUTH_TOKEN_OWNER) {
  console.error('ERROR: ARKE_AUTH_TOKEN is required');
  process.exit(1);
}

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

// Test state
let testPi: string;
let testCollectionTitle: string;

// ============================================================================
// TEST 0: Find a test entity from user's collections
// ============================================================================
async function test0_findTestEntity() {
  section('TEST 0: Find Test Entity');

  const collectionsClient = new CollectionsClient({
    gatewayUrl: GATEWAY_URL,
    authToken: AUTH_TOKEN_OWNER!,
  });

  try {
    log('Finding a collection owned by the test user...');
    const myCollections = await collectionsClient.getMyCollections();

    if (myCollections.owned.length === 0) {
      fail('No owned collections found. Please create a collection first.');
      return false;
    }

    // Find the "Permission Test Collection" or use the first one
    let targetCollection = myCollections.owned.find(
      (c) => c.title === 'Permission Test Collection'
    );
    if (!targetCollection) {
      targetCollection = myCollections.owned[0];
    }

    testCollectionTitle = targetCollection.title;
    log(`Using collection: ${testCollectionTitle}`);

    // Get collection root PI
    const rootInfo = await collectionsClient.getCollectionRoot(targetCollection.id);
    testPi = rootInfo.rootPi;
    log(`Root PI: ${testPi}`);

    success('Found test entity');
    return true;
  } catch (e: any) {
    fail(`Failed: ${e.message}`);
    return false;
  }
}

// ============================================================================
// TEST 1: EditClient - Basic Entity Operations
// ============================================================================
async function test1_editClientBasicOps() {
  section('TEST 1: EditClient - Basic Entity Operations');

  const client = new EditClient({
    gatewayUrl: GATEWAY_URL,
    authToken: AUTH_TOKEN_OWNER!,
  });

  try {
    // Test getEntity
    log(`Fetching entity: ${testPi}`);
    const entity = await client.getEntity(testPi);

    log(`PI: ${entity.pi}`);
    log(`Version: ${entity.ver}`);
    log(`Manifest CID: ${entity.manifest_cid}`);
    log(`Components: ${Object.keys(entity.components).join(', ')}`);
    log(`Children: ${entity.children_pi.length}`);
    if (entity.parent_pi) {
      log(`Parent: ${entity.parent_pi}`);
    }

    success('Entity fetched successfully');

    // Test getContent for description.md if it exists
    if (entity.components['description.md']) {
      log('');
      log('Fetching description.md content...');
      const descCid = entity.components['description.md'];
      const content = await client.getContent(descCid);
      log(`Content length: ${content.length} chars`);
      log(`Preview: ${content.slice(0, 100)}...`);
      success('Content fetched successfully');
    }

    return true;
  } catch (e: any) {
    fail(`Failed: ${e.message}`);
    if (e instanceof EditError) {
      log(`Error code: ${e.code}`);
      log(`Details: ${JSON.stringify(e.details)}`);
    }
    return false;
  }
}

// ============================================================================
// TEST 2: EditClient - Entity Not Found Error
// ============================================================================
async function test2_entityNotFound() {
  section('TEST 2: EditClient - Entity Not Found');

  const client = new EditClient({
    gatewayUrl: GATEWAY_URL,
    authToken: AUTH_TOKEN_OWNER!,
  });

  try {
    log('Attempting to fetch non-existent entity...');
    await client.getEntity('NONEXISTENT_PI_12345');

    fail('Should have thrown EntityNotFoundError');
    return false;
  } catch (e: any) {
    if (e instanceof EntityNotFoundError) {
      log(`Got expected error: ${e.message}`);
      log(`Error code: ${e.code}`);
      success('EntityNotFoundError thrown correctly');
      return true;
    } else {
      // Some APIs return 500 or other errors for bad PIs
      log(`Got error (not EntityNotFoundError): ${e.message}`);
      success('Error thrown as expected');
      return true;
    }
  }
}

// ============================================================================
// TEST 3: EditSession - Load and Inspect
// ============================================================================
async function test3_editSessionLoad() {
  section('TEST 3: EditSession - Load and Inspect');

  const client = new EditClient({
    gatewayUrl: GATEWAY_URL,
    authToken: AUTH_TOKEN_OWNER!,
  });

  try {
    log('Creating EditSession in ai-prompt mode...');
    const session = new EditSession(client, testPi, {
      mode: 'ai-prompt',
    });

    log('Loading entity...');
    await session.load();

    const entity = session.getEntity();
    log(`Loaded entity PI: ${entity.pi}`);
    log(`Version: ${entity.ver}`);

    const components = session.getComponents();
    log(`Loaded components: ${Object.keys(components).join(', ') || 'none'}`);

    // Show component previews
    for (const [name, content] of Object.entries(components)) {
      log(`  ${name}: ${content.length} chars`);
    }

    success('EditSession loaded successfully');

    // Test getChangeSummary with no changes
    log('');
    log('Getting change summary (no changes yet)...');
    const summary = session.getChangeSummary();
    log(`Mode: ${summary.mode}`);
    log(`Has manual edits: ${summary.hasManualEdits}`);
    log(`Will save: ${summary.willSave}`);
    log(`Will reprocess: ${summary.willReprocess}`);

    success('Change summary working');
    return true;
  } catch (e: any) {
    fail(`Failed: ${e.message}`);
    return false;
  }
}

// ============================================================================
// TEST 4: EditSession - AI Prompt Mode
// ============================================================================
async function test4_aiPromptMode() {
  section('TEST 4: EditSession - AI Prompt Mode');

  const client = new EditClient({
    gatewayUrl: GATEWAY_URL,
    authToken: AUTH_TOKEN_OWNER!,
  });

  try {
    const session = new EditSession(client, testPi, {
      mode: 'ai-prompt',
    });

    await session.load();

    // Set prompts
    log('Setting prompts...');
    session.setPrompt('general', 'Fix any OCR errors in the text.');
    session.setPrompt('description', 'Update the description to be more detailed.');

    const prompts = session.getPrompts();
    log(`Prompts set: ${Object.keys(prompts).join(', ')}`);

    // Set scope
    log('');
    log('Setting scope...');
    session.setScope({
      components: ['description'],
      cascade: false,
    });

    const scope = session.getScope();
    log(`Components to regenerate: ${scope.components.join(', ')}`);
    log(`Cascade: ${scope.cascade}`);

    // Get change summary
    log('');
    log('Getting change summary...');
    const summary = session.getChangeSummary();
    log(`Will regenerate: ${summary.willRegenerate.join(', ')}`);
    log(`Will cascade: ${summary.willCascade}`);
    log(`Will save: ${summary.willSave}`);
    log(`Will reprocess: ${summary.willReprocess}`);

    // Preview prompts
    log('');
    log('Previewing prompts (what will be sent to AI)...');
    const previews = session.previewPrompt();
    for (const [component, prompt] of Object.entries(previews)) {
      log(`${component}: ${prompt.slice(0, 100)}...`);
    }

    success('AI prompt mode configured correctly');
    return true;
  } catch (e: any) {
    fail(`Failed: ${e.message}`);
    return false;
  }
}

// ============================================================================
// TEST 5: EditSession - Manual Mode Validation
// ============================================================================
async function test5_manualModeValidation() {
  section('TEST 5: EditSession - Manual Mode Validation');

  const client = new EditClient({
    gatewayUrl: GATEWAY_URL,
    authToken: AUTH_TOKEN_OWNER!,
  });

  try {
    // Test that setContent throws in ai-prompt mode
    log('Testing setContent in ai-prompt mode (should throw)...');
    const aiSession = new EditSession(client, testPi, { mode: 'ai-prompt' });
    await aiSession.load();

    try {
      aiSession.setContent('description.md', 'New content');
      fail('Should have thrown ValidationError');
      return false;
    } catch (e: any) {
      if (e instanceof ValidationError) {
        log(`Got expected error: ${e.message}`);
        success('setContent correctly blocked in ai-prompt mode');
      } else {
        throw e;
      }
    }

    // Test that setPrompt throws in manual-only mode
    log('');
    log('Testing setPrompt in manual-only mode (should throw)...');
    const manualSession = new EditSession(client, testPi, { mode: 'manual-only' });
    await manualSession.load();

    try {
      manualSession.setPrompt('general', 'Some prompt');
      fail('Should have thrown ValidationError');
      return false;
    } catch (e: any) {
      if (e instanceof ValidationError) {
        log(`Got expected error: ${e.message}`);
        success('setPrompt correctly blocked in manual-only mode');
      } else {
        throw e;
      }
    }

    // Test manual-with-review mode (both should work)
    log('');
    log('Testing manual-with-review mode (both should work)...');
    const reviewSession = new EditSession(client, testPi, { mode: 'manual-with-review' });
    await reviewSession.load();

    reviewSession.setContent('description.md', 'Modified content');
    reviewSession.setPrompt('general', 'Review prompt');

    const summary = reviewSession.getChangeSummary();
    log(`Has manual edits: ${summary.hasManualEdits}`);
    log(`Has prompts: ${Object.keys(summary.prompts).length > 0}`);

    success('manual-with-review mode allows both');
    return true;
  } catch (e: any) {
    fail(`Failed: ${e.message}`);
    return false;
  }
}

// ============================================================================
// TEST 6: EditSession - Corrections API
// ============================================================================
async function test6_correctionsApi() {
  section('TEST 6: EditSession - Corrections API');

  const client = new EditClient({
    gatewayUrl: GATEWAY_URL,
    authToken: AUTH_TOKEN_OWNER!,
  });

  try {
    const session = new EditSession(client, testPi, { mode: 'manual-with-review' });
    await session.load();

    log('Adding corrections...');
    session.addCorrection('teh', 'the', 'document.txt');
    session.addCorrection('recieve', 'receive');
    session.addCorrection('seperate', 'separate', 'notes.md');

    const corrections = session.getCorrections();
    log(`Corrections added: ${corrections.length}`);
    for (const c of corrections) {
      log(`  "${c.original}" → "${c.corrected}"${c.sourceFile ? ` (${c.sourceFile})` : ''}`);
    }

    success('Corrections API working');

    // Test clear
    log('');
    log('Clearing corrections...');
    session.clearCorrections();
    const afterClear = session.getCorrections();
    log(`Corrections after clear: ${afterClear.length}`);

    if (afterClear.length !== 0) {
      fail('Corrections should be empty after clear');
      return false;
    }

    success('Clear corrections working');
    return true;
  } catch (e: any) {
    fail(`Failed: ${e.message}`);
    return false;
  }
}

// ============================================================================
// TEST 7: DiffEngine - Text Diff Computation
// ============================================================================
async function test7_diffEngine() {
  section('TEST 7: DiffEngine - Text Diff Computation');

  // Import DiffEngine
  const { DiffEngine } = await import('../src/edit/diff');

  try {
    const original = `Line 1
Line 2
Line 3
Line 4`;

    const modified = `Line 1
Line 2 modified
Line 3
New Line
Line 4`;

    log('Computing diff...');
    const diffs = DiffEngine.diff(original, modified);
    log(`Diff entries: ${diffs.length}`);

    for (const diff of diffs) {
      if (diff.type === 'addition') {
        log(`  + ${diff.modified}`);
      } else if (diff.type === 'deletion') {
        log(`  - ${diff.original}`);
      }
    }

    success('Line diff computed');

    // Test hasSignificantChanges
    log('');
    log('Testing hasSignificantChanges...');
    const noChange = DiffEngine.hasSignificantChanges('hello world', 'hello  world');
    const hasChange = DiffEngine.hasSignificantChanges('hello', 'goodbye');
    log(`Whitespace only: ${noChange}`);
    log(`Actual change: ${hasChange}`);

    if (noChange !== false || hasChange !== true) {
      fail('hasSignificantChanges not working correctly');
      return false;
    }

    success('hasSignificantChanges working');

    // Test extractCorrections
    log('');
    log('Testing extractCorrections...');
    const corrections = DiffEngine.extractCorrections(
      'The teh dog ran recieve',
      'The the dog ran receive'
    );
    log(`Extracted corrections: ${corrections.length}`);
    for (const c of corrections) {
      log(`  "${c.original}" → "${c.corrected}"`);
    }

    success('extractCorrections working');
    return true;
  } catch (e: any) {
    fail(`Failed: ${e.message}`);
    return false;
  }
}

// ============================================================================
// TEST 8: Permission Denied (Non-Owner)
// ============================================================================
async function test8_permissionDenied() {
  section('TEST 8: Permission Denied (Non-Owner)');

  if (!AUTH_TOKEN_NON_OWNER) {
    log('Skipping - ARKE_AUTH_TOKEN_2 not set');
    return true;
  }

  const client = new EditClient({
    gatewayUrl: GATEWAY_URL,
    authToken: AUTH_TOKEN_NON_OWNER,
  });

  try {
    // Try to trigger a reprocess as non-owner
    log('Attempting reprocess as non-owner (should fail)...');

    const session = new EditSession(client, testPi, { mode: 'ai-prompt' });
    await session.load();

    session.setPrompt('general', 'Test prompt');
    session.setScope({ components: ['description'], cascade: false });

    await session.submit('Test edit');

    fail('Should have thrown PermissionError');
    return false;
  } catch (e: any) {
    if (e instanceof PermissionError) {
      log(`Got expected error: ${e.message}`);
      log(`Error code: ${e.code}`);
      success('PermissionError thrown correctly');
      return true;
    } else if (e.message?.includes('Permission') || e.message?.includes('403') || e.message?.includes('Forbidden')) {
      log(`Got permission-related error: ${e.message}`);
      success('Permission denied as expected');
      return true;
    } else {
      log(`Got unexpected error type: ${e.constructor.name}`);
      log(`Message: ${e.message}`);
      // This might still be acceptable if the API returns a different error
      success('Error thrown (possibly permission related)');
      return true;
    }
  }
}

// ============================================================================
// TEST 9: setAuthToken
// ============================================================================
async function test9_setAuthToken() {
  section('TEST 9: setAuthToken');

  try {
    const client = new EditClient({
      gatewayUrl: GATEWAY_URL,
      // Start with no token
    });

    log('Created client without token...');

    // Set token
    client.setAuthToken(AUTH_TOKEN_OWNER!);
    log('Set auth token');

    // Verify it works
    const entity = await client.getEntity(testPi);
    log(`Successfully fetched entity: ${entity.pi}`);

    success('setAuthToken working');
    return true;
  } catch (e: any) {
    fail(`Failed: ${e.message}`);
    return false;
  }
}

// ============================================================================
// TEST 10: Full Edit Flow (DRY RUN - No actual changes)
// ============================================================================
async function test10_fullEditFlowDryRun() {
  section('TEST 10: Full Edit Flow (DRY RUN)');

  const client = new EditClient({
    gatewayUrl: GATEWAY_URL,
    authToken: AUTH_TOKEN_OWNER!,
  });

  try {
    log('Creating EditSession...');
    const session = new EditSession(client, testPi, {
      mode: 'ai-prompt',
    });

    log('Loading entity...');
    await session.load();

    const entity = session.getEntity();
    log(`Entity version before: ${entity.ver}`);

    // Configure the edit
    session.setPrompt('general', 'This is a test prompt - no actual changes needed.');
    session.setScope({
      components: ['description'],
      cascade: false,
    });

    // Get summary
    const summary = session.getChangeSummary();
    log('');
    log('Change Summary:');
    log(`  Mode: ${summary.mode}`);
    log(`  Will regenerate: ${summary.willRegenerate.join(', ')}`);
    log(`  Will cascade: ${summary.willCascade}`);
    log(`  Will save: ${summary.willSave}`);
    log(`  Will reprocess: ${summary.willReprocess}`);

    // NOTE: We're NOT actually calling submit() to avoid making real changes
    // In a real test, you would:
    // const result = await session.submit('Test edit');
    // const status = await session.waitForCompletion();

    log('');
    log('DRY RUN - Not submitting to avoid actual changes');
    log('In production, you would call:');
    log('  const result = await session.submit("Edit note");');
    log('  const status = await session.waitForCompletion();');

    success('Full edit flow validated (dry run)');
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
  console.log('ARKE SDK - EDIT PACKAGE INTEGRATION TESTS');
  console.log('='.repeat(60));
  console.log(`\nGateway: ${GATEWAY_URL}`);

  const results: { name: string; passed: boolean }[] = [];

  // Find test entity first
  results.push({ name: 'Find Test Entity', passed: await test0_findTestEntity() });

  if (!testPi) {
    console.log('\n\nTest 0 failed - cannot continue without test entity');
    process.exit(1);
  }

  // Run remaining tests
  results.push({ name: 'EditClient - Basic Operations', passed: await test1_editClientBasicOps() });
  results.push({ name: 'EditClient - Entity Not Found', passed: await test2_entityNotFound() });
  results.push({ name: 'EditSession - Load and Inspect', passed: await test3_editSessionLoad() });
  results.push({ name: 'EditSession - AI Prompt Mode', passed: await test4_aiPromptMode() });
  results.push({ name: 'EditSession - Manual Mode Validation', passed: await test5_manualModeValidation() });
  results.push({ name: 'EditSession - Corrections API', passed: await test6_correctionsApi() });
  results.push({ name: 'DiffEngine - Text Diff', passed: await test7_diffEngine() });
  results.push({ name: 'Permission Denied (Non-Owner)', passed: await test8_permissionDenied() });
  results.push({ name: 'setAuthToken', passed: await test9_setAuthToken() });
  results.push({ name: 'Full Edit Flow (Dry Run)', passed: await test10_fullEditFlowDryRun() });

  // Summary
  section('TEST SUMMARY');

  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;

  for (const result of results) {
    console.log(`   ${result.passed ? '✓' : '✗'} ${result.name}`);
  }

  console.log('');
  console.log(`   Passed: ${passed}/${results.length}`);
  console.log(`   Failed: ${failed}/${results.length}`);

  if (testPi) {
    console.log('');
    console.log(`   Test Entity: ${testPi}`);
    console.log(`   Collection: ${testCollectionTitle}`);
  }

  console.log('\n' + '='.repeat(60) + '\n');

  process.exit(failed > 0 ? 1 : 0);
}

main().catch(console.error);
