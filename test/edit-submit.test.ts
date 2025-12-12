#!/usr/bin/env npx tsx
/**
 * Edit Submit Test - Actually triggers a reprocess
 *
 * This test WILL make changes to the entity. Use with caution.
 *
 * Usage:
 *   npx tsx test/edit-submit.test.ts
 */

import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { EditClient, EditSession } from '../src/edit/index';
import { CollectionsClient } from '../src/collections/index';

// Load .env
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
  console.error('ERROR: ARKE_AUTH_TOKEN is required');
  process.exit(1);
}

function log(message: string) {
  console.log(`   ${message}`);
}

async function main() {
  console.log('\n' + '='.repeat(60));
  console.log('EDIT SUBMIT TEST - WILL MAKE REAL CHANGES');
  console.log('='.repeat(60));
  console.log(`\nGateway: ${GATEWAY_URL}`);

  // Find a test entity
  const collectionsClient = new CollectionsClient({
    gatewayUrl: GATEWAY_URL,
    authToken: AUTH_TOKEN!,
  });

  log('Finding test collection...');
  const myCollections = await collectionsClient.getMyCollections();

  // Use Permission Test Collection
  const collection = myCollections.owned.find(
    (c) => c.title === 'Permission Test Collection'
  );

  if (!collection) {
    console.error('Permission Test Collection not found');
    process.exit(1);
  }

  const rootInfo = await collectionsClient.getCollectionRoot(collection.id);
  const testPi = rootInfo.rootPi;

  log(`Using PI: ${testPi}`);
  log(`Collection: ${collection.title}`);

  // Create edit client and session
  const client = new EditClient({
    gatewayUrl: GATEWAY_URL,
    authToken: AUTH_TOKEN!,
  });

  const session = new EditSession(client, testPi, {
    mode: 'ai-prompt',
  });

  log('');
  log('Loading entity...');
  await session.load();

  const entity = session.getEntity();
  log(`Current version: ${entity.ver}`);

  // Configure the edit
  log('');
  log('Configuring edit...');
  session.setPrompt('general', 'Ensure the description accurately reflects the contents of this archive directory.');
  session.setScope({
    components: ['description'],
    cascade: false,  // Don't cascade for this test
  });

  // Get summary
  const summary = session.getChangeSummary();
  log(`Will regenerate: ${summary.willRegenerate.join(', ')}`);
  log(`Will cascade: ${summary.willCascade}`);

  // Submit
  log('');
  log('Submitting edit...');
  const result = await session.submit('SDK Edit Test');

  log('');
  log('Submit result:');
  if (result.saved) {
    log(`  Saved - New version: ${result.saved.newVersion}`);
    log(`  New tip: ${result.saved.newTip}`);
  } else {
    log('  No manual edits to save');
  }

  if (result.reprocess) {
    log(`  Reprocess batch: ${result.reprocess.batch_id}`);
    log(`  Entities queued: ${result.reprocess.entities_queued}`);
    log(`  Status URL: ${result.reprocess.status_url}`);
  }

  // Wait for completion
  log('');
  log('Waiting for reprocessing to complete...');
  log('(This may take a few minutes)');

  const status = await session.waitForCompletion({
    intervalMs: 3000,
    timeoutMs: 300000, // 5 minutes
    onProgress: (s) => {
      if (s.reprocessStatus) {
        log(`  Status: ${s.reprocessStatus.status}`);
        if (s.reprocessStatus.progress) {
          const p = s.reprocessStatus.progress;
          log(`    Progress: ${p.directories_description_complete}/${p.directories_total} descriptions`);
        }
      }
    },
  });

  log('');
  log('Final status:');
  log(`  Phase: ${status.phase}`);
  log(`  Save complete: ${status.saveComplete}`);
  if (status.error) {
    log(`  Error: ${status.error}`);
  }
  if (status.reprocessStatus) {
    log(`  Reprocess status: ${status.reprocessStatus.status}`);
    if (status.reprocessStatus.completed_at) {
      log(`  Completed at: ${status.reprocessStatus.completed_at}`);
    }
  }

  if (status.phase === 'complete') {
    console.log('\n   ✓ Edit completed successfully!');
  } else if (status.phase === 'error') {
    console.log('\n   ✗ Edit failed');
  }

  console.log('\n' + '='.repeat(60) + '\n');
}

main().catch(console.error);
