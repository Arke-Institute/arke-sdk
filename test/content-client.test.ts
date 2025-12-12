/**
 * Test the ContentClient against live gateway
 */

import { ContentClient } from '../src/content/client';
import { EntityNotFoundError, ContentNotFoundError, ComponentNotFoundError } from '../src/content/errors';

const GATEWAY_URL = 'https://gateway.arke.institute';

async function runTests() {
  const client = new ContentClient({ gatewayUrl: GATEWAY_URL });

  console.log('=== ContentClient Integration Tests ===\n');

  // Test 1: Get Arke origin
  console.log('1. Testing arke() - Get origin block...');
  let arkeEntity: any;
  try {
    arkeEntity = await client.arke();
    console.log('   PI:', arkeEntity.pi);
    console.log('   Version:', arkeEntity.ver);
    console.log('   Components:', Object.keys(arkeEntity.components));
    console.log('   ✓ Arke origin passed\n');
  } catch (err) {
    console.error('   ✗ Arke origin failed:', err);
    return;
  }

  // Test 2: List entities
  console.log('2. Testing list() - List entities...');
  let firstEntityPi: string | undefined;
  try {
    const list = await client.list({ limit: 5, include_metadata: true });
    console.log('   Entities returned:', list.entities.length);
    console.log('   Limit:', list.limit);
    console.log('   Has next page:', list.next_cursor !== null);
    if (list.entities.length > 0) {
      firstEntityPi = list.entities[0].pi;
      console.log('   First entity PI:', firstEntityPi);
      console.log('   First entity version:', list.entities[0].ver);
    }
    console.log('   ✓ List entities passed\n');
  } catch (err) {
    console.error('   ✗ List entities failed:', err);
  }

  // Test 3: Get entity by PI
  console.log('3. Testing get() - Get entity by PI...');
  let testEntity: any;
  const testPi = firstEntityPi || arkeEntity.pi;
  try {
    testEntity = await client.get(testPi);
    console.log('   PI:', testEntity.pi);
    console.log('   Version:', testEntity.ver);
    console.log('   Manifest CID:', testEntity.manifest_cid);
    console.log('   Components:', Object.keys(testEntity.components));
    console.log('   Children count:', testEntity.children_pi?.length || 0);
    console.log('   ✓ Get entity passed\n');
  } catch (err) {
    console.error('   ✗ Get entity failed:', err);
  }

  // Test 4: Get entity - not found
  console.log('4. Testing get() - Entity not found...');
  try {
    await client.get('INVALID_PI_THAT_DOES_NOT_EXIST');
    console.error('   ✗ Should have thrown EntityNotFoundError\n');
  } catch (err) {
    if (err instanceof EntityNotFoundError) {
      console.log('   Error code:', err.code);
      console.log('   Error message:', err.message);
      console.log('   ✓ Entity not found correctly thrown\n');
    } else {
      console.error('   ✗ Unexpected error type:', err);
    }
  }

  // Test 5: Resolve PI
  console.log('5. Testing resolve() - Resolve PI to CID...');
  try {
    const resolved = await client.resolve(testPi);
    console.log('   PI:', resolved.pi);
    console.log('   Tip CID:', resolved.tip);
    console.log('   ✓ Resolve passed\n');
  } catch (err) {
    console.error('   ✗ Resolve failed:', err);
  }

  // Test 6: Get versions
  console.log('6. Testing versions() - Get version history...');
  try {
    const versions = await client.versions(testPi, { limit: 5 });
    console.log('   Versions returned:', versions.items.length);
    console.log('   Has more:', versions.next_cursor !== null);
    if (versions.items.length > 0) {
      console.log('   Latest version:', versions.items[0].ver);
      console.log('   Latest CID:', versions.items[0].cid);
    }
    console.log('   ✓ Versions passed\n');
  } catch (err) {
    console.error('   ✗ Versions failed:', err);
  }

  // Test 7: Get children (PI list)
  console.log('7. Testing children() - Get child PI list...');
  try {
    const childPis = await client.children(arkeEntity.pi);
    console.log('   Children count:', childPis.length);
    if (childPis.length > 0) {
      console.log('   First child PI:', childPis[0]);
    }
    console.log('   ✓ Children passed\n');
  } catch (err) {
    console.error('   ✗ Children failed:', err);
  }

  // Test 8: Get URL
  console.log('8. Testing getUrl() - Build content URL...');
  if (testEntity && Object.keys(testEntity.components).length > 0) {
    const componentName = Object.keys(testEntity.components)[0];
    const cid = testEntity.components[componentName];
    const url = client.getUrl(cid);
    console.log('   Component:', componentName);
    console.log('   CID:', cid);
    console.log('   URL:', url);
    console.log('   ✓ getUrl passed\n');
  } else {
    console.log('   Skipped (no components)\n');
  }

  // Test 9: Download content
  console.log('9. Testing download() - Download content by CID...');
  if (testEntity && Object.keys(testEntity.components).length > 0) {
    const componentName = Object.keys(testEntity.components)[0];
    const cid = testEntity.components[componentName];
    try {
      const content = await client.download(cid);
      const size = content instanceof Buffer ? content.length : (content as Blob).size;
      console.log('   CID:', cid);
      console.log('   Content type:', content instanceof Buffer ? 'Buffer' : 'Blob');
      console.log('   Size:', size, 'bytes');
      console.log('   ✓ Download passed\n');
    } catch (err) {
      console.error('   ✗ Download failed:', err);
    }
  } else {
    console.log('   Skipped (no components)\n');
  }

  // Test 10: Download - not found
  console.log('10. Testing download() - Content not found...');
  try {
    await client.download('bafybeihkoviema7g3gxyt6la7vd5ho32jywf7b4c4z3qtwcabpjqxwsumu');
    console.error('   ✗ Should have thrown ContentNotFoundError\n');
  } catch (err) {
    if (err instanceof ContentNotFoundError) {
      console.log('   Error code:', err.code);
      console.log('   ✓ Content not found correctly thrown\n');
    } else {
      // May be a different error depending on gateway response
      console.log('   Error:', (err as Error).message);
      console.log('   ✓ Error thrown as expected\n');
    }
  }

  // Test 11: Get component
  console.log('11. Testing getComponent() - Get component content...');
  if (testEntity && Object.keys(testEntity.components).length > 0) {
    const componentName = Object.keys(testEntity.components)[0];
    try {
      const content = await client.getComponent(testEntity, componentName);
      const size = content instanceof Buffer ? content.length : (content as Blob).size;
      console.log('   Component:', componentName);
      console.log('   Size:', size, 'bytes');
      console.log('   ✓ getComponent passed\n');
    } catch (err) {
      console.error('   ✗ getComponent failed:', err);
    }
  } else {
    console.log('   Skipped (no components)\n');
  }

  // Test 12: Get component - not found
  console.log('12. Testing getComponent() - Component not found...');
  try {
    await client.getComponent(testEntity, 'nonexistent_component_xyz');
    console.error('   ✗ Should have thrown ComponentNotFoundError\n');
  } catch (err) {
    if (err instanceof ComponentNotFoundError) {
      console.log('   Error code:', err.code);
      console.log('   Error message:', err.message);
      console.log('   ✓ Component not found correctly thrown\n');
    } else {
      console.error('   ✗ Unexpected error:', err);
    }
  }

  // Test 13: Stream content
  console.log('13. Testing stream() - Stream content...');
  if (testEntity && Object.keys(testEntity.components).length > 0) {
    const componentName = Object.keys(testEntity.components)[0];
    const cid = testEntity.components[componentName];
    try {
      const stream = await client.stream(cid);
      const reader = stream.getReader();
      let totalBytes = 0;
      let chunks = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        totalBytes += value.length;
        chunks++;
      }
      console.log('   CID:', cid);
      console.log('   Total bytes:', totalBytes);
      console.log('   Chunks read:', chunks);
      console.log('   ✓ Stream passed\n');
    } catch (err) {
      console.error('   ✗ Stream failed:', err);
    }
  } else {
    console.log('   Skipped (no components)\n');
  }

  console.log('=== All ContentClient tests completed ===');
}

runTests().catch(console.error);
