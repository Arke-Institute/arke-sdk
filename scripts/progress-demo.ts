/**
 * Demo showing real-time progress updates
 */
import { ArkeClient } from '../src/client/ArkeClient.js';
import { uploadTree, buildUploadTree } from '../src/operations/upload/index.js';
import { loadConfig, createTestUser, createJWT, registerUser } from '../tests/e2e/setup.js';

async function main() {
  const config = loadConfig();
  const testUser = createTestUser();
  const token = await createJWT(testUser, config);
  await registerUser(token, config);

  const client = new ArkeClient({
    baseUrl: config.baseUrl,
    authToken: token,
  });

  // Create a test tree with 10 files
  const files = Array.from({ length: 10 }, (_, i) => ({
    path: `file${i + 1}.txt`,
    data: new Blob([`Content for file ${i + 1}`]),
    mimeType: 'text/plain',
  }));
  const tree = buildUploadTree(files);

  console.log('Uploading 10 files...\n');

  let updateCount = 0;
  await uploadTree(client, tree, {
    target: {
      createCollection: { label: `Progress Demo ${Date.now()}` },
    },
    onProgress: (p) => {
      updateCount++;

      // Show every update with new phase metadata
      console.log(
        `[${updateCount.toString().padStart(3)}] ` +
        `Phase ${p.phaseIndex + 1}/${p.phaseCount} ${p.phase.padEnd(15)} ` +
        `${p.phasePercent.toString().padStart(3)}% ` +
        `(${p.completedEntities}/${p.totalEntities} entities, ` +
        `${p.completedParents}/${p.totalParents} parents) ` +
        `${p.currentItem || ''}`
      );
    },
  });

  console.log(`\nTotal progress updates: ${updateCount}`);
}

main().catch(console.error);
