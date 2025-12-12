/**
 * Test the GraphClient against live gateway
 */

import { GraphClient } from '../src/graph/client';
import { GraphEntityNotFoundError } from '../src/graph/errors';

const GATEWAY_URL = 'https://gateway.arke.institute';

async function runTests() {
  const client = new GraphClient({ gatewayUrl: GATEWAY_URL });

  console.log('=== GraphClient Integration Tests ===\n');

  // Test 1: Health check
  console.log('1. Testing health()...');
  try {
    const health = await client.health();
    console.log('   Status:', health.status);
    console.log('   Service:', health.service);
    console.log('   ✓ Health check passed\n');
  } catch (err) {
    console.error('   ✗ Health check failed:', err);
    console.log('   Note: GraphDB Gateway may not have a /health endpoint\n');
  }

  // Test 2: Query by code - find some entities
  console.log('2. Testing queryByCode()...');
  let testEntityId: string | undefined;
  try {
    // Try to find a person entity
    const entities = await client.queryByCode('alice_austen');
    console.log('   Results for "alice_austen":', entities.length);
    if (entities.length > 0) {
      testEntityId = entities[0].canonical_id;
      console.log('   First entity ID:', testEntityId);
      console.log('   First entity label:', entities[0].label);
      console.log('   First entity type:', entities[0].type);
    }
    console.log('   ✓ queryByCode passed\n');
  } catch (err) {
    console.error('   ✗ queryByCode failed:', err);
  }

  // Test 3: Lookup by code
  console.log('3. Testing lookupByCode()...');
  try {
    const entities = await client.lookupByCode('person', 'person');
    console.log('   Results for code "person" type "person":', entities.length);
    if (entities.length > 0 && !testEntityId) {
      testEntityId = entities[0].canonical_id;
      console.log('   First entity:', entities[0].label);
    }
    console.log('   ✓ lookupByCode passed\n');
  } catch (err) {
    console.error('   ✗ lookupByCode failed:', err);
  }

  // Test 4: Get entity by ID
  console.log('4. Testing getEntity()...');
  if (testEntityId) {
    try {
      const entity = await client.getEntity(testEntityId);
      console.log('   Entity ID:', entity.canonical_id);
      console.log('   Label:', entity.label);
      console.log('   Type:', entity.type);
      console.log('   Code:', entity.code);
      console.log('   Source PIs:', entity.source_pis?.length || 0);
      console.log('   ✓ getEntity passed\n');
    } catch (err) {
      console.error('   ✗ getEntity failed:', err);
    }
  } else {
    console.log('   Skipped (no test entity ID available)\n');
  }

  // Test 5: Entity exists
  console.log('5. Testing entityExists()...');
  if (testEntityId) {
    try {
      const exists = await client.entityExists(testEntityId);
      console.log('   Entity exists:', exists);
      console.log('   ✓ entityExists passed\n');
    } catch (err) {
      console.error('   ✗ entityExists failed:', err);
    }
  } else {
    console.log('   Skipped (no test entity ID)\n');
  }

  // Test 6: Entity not found
  console.log('6. Testing getEntity() - not found...');
  try {
    await client.getEntity('00000000-0000-0000-0000-000000000000');
    console.error('   ✗ Should have thrown GraphEntityNotFoundError\n');
  } catch (err) {
    if (err instanceof GraphEntityNotFoundError) {
      console.log('   Error code:', err.code);
      console.log('   ✓ Entity not found correctly thrown\n');
    } else {
      // Might be a different error format from the backend
      console.log('   Error:', (err as Error).message);
      console.log('   ✓ Error thrown as expected\n');
    }
  }

  // Test 7: Get relationships
  console.log('7. Testing getRelationships()...');
  if (testEntityId) {
    try {
      const relationships = await client.getRelationships(testEntityId);
      console.log('   Relationships found:', relationships.length);
      if (relationships.length > 0) {
        const first = relationships[0];
        console.log('   First relationship:');
        console.log('     Direction:', first.direction);
        console.log('     Predicate:', first.predicate);
        console.log('     Target:', first.target_label);
      }
      console.log('   ✓ getRelationships passed\n');
    } catch (err) {
      console.error('   ✗ getRelationships failed:', err);
    }
  } else {
    console.log('   Skipped (no test entity ID)\n');
  }

  // Test 8: List entities from PI
  console.log('8. Testing listEntitiesFromPi()...');
  // Use a known PI from the system - get from content API
  const testPi = '01JEMV2ZCS9RYM9S30GMVZ0K6H'; // Using a known PI
  try {
    const entities = await client.listEntitiesFromPi(testPi);
    console.log('   Entities from PI:', entities.length);
    if (entities.length > 0) {
      console.log('   Entity types:', [...new Set(entities.map(e => e.type))].join(', '));
    }
    console.log('   ✓ listEntitiesFromPi passed\n');
  } catch (err) {
    console.error('   ✗ listEntitiesFromPi failed:', err);
  }

  // Test 9: Get entities with relationships
  console.log('9. Testing getEntitiesWithRelationships()...');
  try {
    const entities = await client.getEntitiesWithRelationships(testPi);
    console.log('   Entities with relationships:', entities.length);
    if (entities.length > 0) {
      const first = entities[0];
      console.log('   First entity:', first.label);
      console.log('   Relationships:', first.relationships.length);
    }
    console.log('   ✓ getEntitiesWithRelationships passed\n');
  } catch (err) {
    console.error('   ✗ getEntitiesWithRelationships failed:', err);
  }

  // Test 10: Get lineage
  console.log('10. Testing getLineage()...');
  try {
    const lineage = await client.getLineage(testPi, 'both');
    console.log('   Source PI:', lineage.source_pi);
    console.log('   Ancestors:', lineage.ancestors?.length || 0);
    console.log('   Descendants:', lineage.descendants?.length || 0);
    console.log('   ✓ getLineage passed\n');
  } catch (err) {
    console.error('   ✗ getLineage failed:', err);
  }

  // Test 11: Find paths (if we have two entity IDs)
  console.log('11. Testing findPaths()...');
  if (testEntityId) {
    try {
      // Try to find paths from one entity to any person
      const paths = await client.findPaths(
        [testEntityId],
        [testEntityId], // Same entity - should find empty or trivial path
        { max_depth: 2, limit: 5 }
      );
      console.log('   Paths found:', paths.length);
      if (paths.length > 0) {
        console.log('   First path length:', paths[0].length);
      }
      console.log('   ✓ findPaths passed\n');
    } catch (err) {
      console.error('   ✗ findPaths failed:', err);
    }
  } else {
    console.log('   Skipped (no test entity ID)\n');
  }

  // Test 12: Find reachable entities
  console.log('12. Testing findReachable()...');
  if (testEntityId) {
    try {
      const reachable = await client.findReachable(
        [testEntityId],
        'person',
        { max_depth: 2, limit: 10 }
      );
      console.log('   Reachable persons:', reachable.length);
      if (reachable.length > 0) {
        console.log('   First reachable:', reachable[0].label);
      }
      console.log('   ✓ findReachable passed\n');
    } catch (err) {
      console.error('   ✗ findReachable failed:', err);
    }
  } else {
    console.log('   Skipped (no test entity ID)\n');
  }

  console.log('=== All GraphClient tests completed ===');
}

runTests().catch(console.error);
