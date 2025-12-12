/**
 * Test the QueryClient against live gateway
 */

import { QueryClient } from '../src/query/client';

const GATEWAY_URL = 'https://gateway.arke.institute';

async function runTests() {
  const client = new QueryClient({ gatewayUrl: GATEWAY_URL });

  console.log('=== QueryClient Integration Tests ===\n');

  // Test 1: Health check
  console.log('1. Testing /query/health...');
  try {
    const health = await client.health();
    console.log('   Health:', health);
    console.log('   ✓ Health check passed\n');
  } catch (err) {
    console.error('   ✗ Health check failed:', err);
  }

  // Test 2: Syntax documentation
  console.log('2. Testing /query/syntax...');
  try {
    const syntax = await client.syntax();
    console.log('   Version:', syntax.version);
    console.log('   Entry point types:', syntax.entryPoints.types.length);
    console.log('   Entity types:', syntax.entityTypes.join(', '));
    console.log('   Examples:', syntax.examples.length);
    console.log('   ✓ Syntax endpoint passed\n');
  } catch (err) {
    console.error('   ✗ Syntax endpoint failed:', err);
  }

  // Test 3: Parse valid query
  console.log('3. Testing /query/parse (valid query)...');
  try {
    const parseResult = await client.parse('"test" type:person');
    console.log('   AST entry type:', parseResult.ast.entry.type);
    console.log('   Entry filter:', parseResult.ast.entry_filter?.type);
    console.log('   ✓ Parse (valid) passed\n');
  } catch (err) {
    console.error('   ✗ Parse (valid) failed:', err);
  }

  // Test 4: Parse invalid query
  console.log('4. Testing /query/parse (invalid query)...');
  try {
    await client.parse('invalid query syntax >>>');
    console.error('   ✗ Should have thrown an error\n');
  } catch (err: any) {
    if (err.code === 'PARSE_ERROR') {
      console.log('   Error message:', err.message);
      console.log('   ✓ Parse (invalid) correctly threw error\n');
    } else {
      console.error('   ✗ Unexpected error:', err);
    }
  }

  // Test 5: Path query
  console.log('5. Testing /query/path...');
  try {
    const results = await client.path('"alice austen" type:person', { k: 3 });
    console.log('   Results count:', results.results.length);
    console.log('   Execution time:', results.metadata.execution_time_ms, 'ms');
    if (results.results.length > 0) {
      console.log('   First result:', results.results[0].entity.label);
    }
    console.log('   ✓ Path query passed\n');
  } catch (err) {
    console.error('   ✗ Path query failed:', err);
  }

  // Test 6: Path query with traversal
  console.log('6. Testing /query/path (multi-hop)...');
  try {
    const results = await client.path('"alice austen" -[*]{,2}-> type:person', { k: 3 });
    console.log('   Results count:', results.results.length);
    console.log('   Hops:', results.metadata.hops);
    console.log('   Execution time:', results.metadata.execution_time_ms, 'ms');
    if (results.results.length > 0) {
      const firstPath = results.results[0].path;
      console.log('   Path length:', firstPath.length, 'steps');
    }
    console.log('   ✓ Multi-hop query passed\n');
  } catch (err) {
    console.error('   ✗ Multi-hop query failed:', err);
  }

  // Test 7: Translate only
  console.log('7. Testing /query/translate...');
  try {
    const result = await client.translate('Find photographers connected to Alice Austen');
    console.log('   Generated path:', result.path);
    console.log('   Explanation:', result.explanation);
    console.log('   Tokens used:', result.tokens_used);
    console.log('   ✓ Translate passed\n');
  } catch (err) {
    console.error('   ✗ Translate failed:', err);
  }

  // Test 8: Natural language query
  console.log('8. Testing /query/natural...');
  try {
    const results = await client.natural('Find people named Washington', { k: 3 });
    console.log('   Generated path:', results.translation.path);
    console.log('   Results count:', results.results.length);
    console.log('   Execution time:', results.metadata.execution_time_ms, 'ms');
    if (results.results.length > 0) {
      console.log('   First result:', results.results[0].entity.label);
    }
    console.log('   ✓ Natural query passed\n');
  } catch (err) {
    console.error('   ✗ Natural query failed:', err);
  }

  console.log('=== All tests completed ===');
}

runTests().catch(console.error);
