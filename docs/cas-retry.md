# CAS Retry Best Practices

The `withCasRetry` utility handles concurrent updates to Arke entities using Compare-And-Swap (CAS) semantics with automatic retry, backoff, and jitter.

## When to Use

Use `withCasRetry` when:
- Multiple clients may update the same entity simultaneously
- Your update is **additive** (doesn't depend on current state)
- Examples: adding relationships, appending to a list, updating a timestamp

Don't use when:
- You need to read-modify-write (your update depends on current values)
- Only one client ever updates the entity

## Basic Usage

```typescript
import { ArkeClient, withCasRetry } from '@arke-institute/sdk';

const client = new ArkeClient({ authToken: 'xxx' });

const { data, attempts } = await withCasRetry({
  getTip: async () => {
    // Use the lightweight tip endpoint - single DO lookup, no manifest fetch
    const { data, error } = await client.api.GET('/entities/{id}/tip', {
      params: { path: { id: entityId } }
    });
    if (error || !data) throw new Error('Failed to get tip');
    return data.cid;
  },
  update: async (tip) => {
    return client.api.PUT('/entities/{id}', {
      params: { path: { id: entityId } },
      body: {
        expect_tip: tip,
        relationships_add: [
          { predicate: 'references', peer: otherEntityId, direction: 'outgoing' }
        ]
      }
    });
  }
}, { concurrency: 100 });
```

## Setting Concurrency

The `concurrency` option tells the utility how many concurrent writers to expect. This affects:
- **Initial spread**: Requests are staggered over `concurrency * 100ms` to reduce collisions
- **Max attempts**: Higher concurrency = more retry headroom

```typescript
// Low concurrency (default) - quick retries
await withCasRetry(callbacks, { concurrency: 10 });

// High concurrency - more spread, more attempts
await withCasRetry(callbacks, { concurrency: 500 });
```

| Concurrency | Initial Spread | Max Attempts | Typical Avg Attempts |
|-------------|----------------|--------------|----------------------|
| 10          | 0-1s           | ~14          | ~5                   |
| 100         | 0-10s          | ~28          | ~10                  |
| 500         | 0-50s          | ~41          | ~16                  |

## Key Guidelines

### 1. Always use the lightweight `/entities/{id}/tip` endpoint

```typescript
// Good - single DO lookup, no manifest fetch, no auth required
const { data } = await client.api.GET('/entities/{id}/tip', {
  params: { path: { id: entityId } }
});
return data.cid;

// Avoid - fetches full entity with manifest
const { data } = await client.api.GET('/entities/{id}', {
  params: { path: { id: entityId } }
});
return data.cid;
```

### 2. Set concurrency based on your actual load

If you're spawning 100 parallel updates, set `concurrency: 100`. Under-estimating causes more collisions; over-estimating adds unnecessary initial delay.

### 3. Use for additive operations only

```typescript
// Good - adding a relationship doesn't depend on existing relationships
body: {
  expect_tip: tip,
  relationships_add: [{ predicate: 'contains', peer: childId }]
}

// Bad - if you need to check existing value first, don't use withCasRetry
// Instead, implement your own retry loop with read-modify-write
```

### 4. Monitor with onRetry callback

```typescript
await withCasRetry(callbacks, {
  concurrency: 500,
  onRetry: (attempt, error, delayMs) => {
    console.log(`Retry ${attempt}, waiting ${delayMs}ms`);
    metrics.increment('cas_retries');
  }
});
```

## Configuration Options

```typescript
interface CasRetryOptions {
  concurrency?: number;      // Expected concurrent writers (default: 10)
  maxAttempts?: number;      // Override calculated max attempts
  baseDelayMs?: number;      // Base retry delay (default: 50)
  maxDelayMs?: number;       // Max retry delay cap (default: 10000)
  spreadInitial?: boolean;   // Stagger first attempts (default: true)
  onRetry?: (attempt, error, delayMs) => void;
}
```

## Error Handling

```typescript
import { withCasRetry, CasRetryExhaustedError } from '@arke-institute/sdk';

try {
  const { data } = await withCasRetry(callbacks, { concurrency: 500 });
} catch (error) {
  if (error instanceof CasRetryExhaustedError) {
    console.error(`Failed after ${error.attempts} attempts`);
    console.error(`Last tip mismatch: expected ${error.lastError.expectedTip}`);
  } else {
    // Non-CAS error (400, 404, 500, etc.) - thrown immediately, not retried
    throw error;
  }
}
```

## Performance Tips

1. **Batch when possible**: Instead of 100 separate `withCasRetry` calls, use batch endpoints if available

2. **Disable initial spread for sequential operations**: If you're intentionally serializing updates, disable the initial spread:
   ```typescript
   await withCasRetry(callbacks, { spreadInitial: false });
   ```

3. **Lower concurrency for lighter load**: If actual concurrency is lower than estimated, you'll see faster completion with lower `concurrency` values
