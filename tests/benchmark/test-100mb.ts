import { ArkeClient } from '../../src/client/ArkeClient.js';
import { uploadTree, buildUploadTree } from '../../src/operations/upload/index.js';
import { loadConfig } from '../e2e/setup.js';

const sizeMB = 100;
const size = sizeMB * 1024 * 1024;
console.log('Generating 100MB of random data...');
const data = new Uint8Array(size);
for (let i = 0; i < size; i++) data[i] = Math.floor(Math.random() * 256);

const config = loadConfig();
const client = new ArkeClient({ baseUrl: config.baseUrl, authToken: config.apiKey });

const tree = buildUploadTree([{ path: 'test-100mb.bin', data, mimeType: 'application/octet-stream' }]);

console.log('Uploading 100MB file via presigned URL...');
const start = performance.now();
const result = await uploadTree(client, tree, {
  target: { createCollection: { label: 'Test 100MB ' + Date.now() } },
  onProgress: (p) => {
    if (p.phase === 'uploading' && p.phasePercent && p.phasePercent % 10 === 0) {
      process.stdout.write(p.phasePercent + '% ');
    }
    if (p.phase === 'complete') console.log('done!');
  }
});
const elapsed = (performance.now() - start) / 1000;
console.log('\nTime: ' + elapsed.toFixed(2) + 's');
console.log('Speed: ' + (sizeMB / elapsed).toFixed(2) + ' MB/s');
console.log('Success: ' + result.success);
if (!result.success) console.log('Errors:', result.errors);
