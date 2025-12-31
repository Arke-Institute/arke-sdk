# Concurrency Analysis

## Raw Data

### Small Files (alexander_docs: 125 files, 0.53MB, avg 4.2KB/file)
| Concurrency | Total (s) | Creating (s) | Throughput (MB/s) |
|-------------|-----------|--------------|-------------------|
| 10 | 7.39 | 6.12 | 0.07 |
| 15 | 6.51 | 5.45 | 0.08 |
| 20 | 5.08 | 4.01 | 0.10 |
| 25 | 6.10 | 4.89 | 0.09 |
| 30 | 5.30 | 4.08 | 0.10 |
| 40 | 4.43 | 3.51 | 0.12 |
| 50 | 10.02 | 8.46 | 0.05 |

### Large Files (Morgan: 27 files, 1GB, avg 37MB/file)
| Concurrency | Effective (large) | Total (s) | Creating (s) | Throughput (MB/s) |
|-------------|-------------------|-----------|--------------|-------------------|
| 5 | 3 | 38.00 | 36.35 | 26.32 |
| 10 | 3 | 34.08 | 32.03 | 29.34 |
| 15 | 5 | 35.02 | 33.30 | 28.55 |
| 20 | 6 | 31.84 | 30.03 | 31.41 |
| 30 | 10 | 37.88 | 36.06 | 26.40 |

## Key Observations

### Small Files - Latency Bound
- Per-file overhead: ~32ms at optimal (creating: 4.01s / 125 files)
- This includes: POST /files + S3 PUT + network latency
- Bottleneck: IPFS entity creation, not bandwidth
- Optimal: ~40 concurrent (but variable due to backend load)

### Large Files - Bandwidth Bound
- Peak throughput: ~31 MB/s (250 Mbps)
- Optimal effective concurrency: 6 large files
- At 37MB avg: 6 * 37MB = 222MB in flight
- Bottleneck: Network bandwidth saturation

## Hypotheses for Dynamic Concurrency

### Option 1: Bandwidth Budget
Target a fixed "bandwidth budget" (e.g., 200MB in flight):
```
max_concurrent = bandwidth_budget / avg_file_size
```
- For 4KB files: 200MB / 4KB = 50,000 (cap at reasonable max)
- For 37MB files: 200MB / 37MB = 5.4 ≈ 6
- For 1GB files: 200MB / 1GB = 0.2 → minimum 1

### Option 2: Tiered Approach
```
if file_size < 1MB: concurrency = 50
elif file_size < 10MB: concurrency = 20
elif file_size < 100MB: concurrency = 6
else: concurrency = 3
```

### Option 3: Volume-Based Batching
Instead of "N files at once", think "X MB at once":
```
target_batch_volume = 200MB
batch = []
while batch_size < target_batch_volume:
    add next file to batch
upload batch with Promise.all()
```

### Option 4: Adaptive
Start aggressive, back off on errors/slowdowns:
```
concurrency = estimate_from_file_sizes()
if (error_rate > threshold): concurrency *= 0.8
if (throughput < expected): concurrency *= 0.9
```

## Extrapolations

### Tiny Files (1KB each, 1000 files)
- Latency-bound: ~32ms per file minimum
- At concurrency 100: 1000/100 = 10 batches * 32ms = 320ms theoretical
- Reality: API rate limits kick in, probably 2-5s

### Huge Files (1GB each, 10 files)
- Bandwidth-bound at ~31 MB/s
- 10GB total / 31 MB/s = 322s = 5.4 minutes
- Concurrency: 1-2 (200MB budget / 1GB = 0.2, min 1)
- Single file at 31 MB/s: 1GB / 31 MB/s = 32s per file

## Updated Test Results (Small Files - Extreme Concurrency)

| Concurrency | Total (s) | Notes |
|-------------|-----------|-------|
| 40 | 4.43 | Previous "optimal" |
| 125 | 4.63-5.20 | All 125 at once, variable |
| 200 | 5.10 | Still works fine |

**Key insight**: For small files, high concurrency works great!

## Refined Formula: Bandwidth Budget Approach

The unified concept is **target bytes in flight**:

```typescript
const BANDWIDTH_BUDGET_BYTES = 200 * 1024 * 1024; // 200MB in flight
const MIN_CONCURRENCY = 3;
const MAX_CONCURRENCY_SMALL = 100; // Cap for small files (API limits)
const SMALL_FILE_THRESHOLD = 1 * 1024 * 1024; // 1MB

function calculateConcurrency(files: File[]): number {
  const totalSize = files.reduce((sum, f) => sum + f.size, 0);
  const avgSize = totalSize / files.length;

  if (avgSize < SMALL_FILE_THRESHOLD) {
    // Small files: latency-bound
    // Use high concurrency, capped to avoid overwhelming API
    return Math.min(MAX_CONCURRENCY_SMALL, files.length);
  }

  // Large files: bandwidth-bound
  // Calculate based on bandwidth budget
  const concurrent = Math.floor(BANDWIDTH_BUDGET_BYTES / avgSize);
  return Math.max(MIN_CONCURRENCY, Math.min(concurrent, files.length));
}
```

## Extrapolation Table

| Avg File Size | Calculated Concurrency | Reasoning |
|---------------|------------------------|-----------|
| 1KB | 100 (capped) | Latency-bound, blast them |
| 10KB | 100 (capped) | Latency-bound |
| 100KB | 100 (capped) | Latency-bound |
| 1MB | 100 (capped) | Borderline, still latency-bound |
| 10MB | 20 | 200MB / 10MB = 20 |
| 37MB | 5 | 200MB / 37MB = 5.4 |
| 100MB | 2 | 200MB / 100MB = 2 |
| 500MB | 3 (min) | 200MB / 500MB = 0.4 → min 3 |
| 1GB | 3 (min) | 200MB / 1GB = 0.2 → min 3 |

## Alternative: Per-Batch Dynamic Concurrency

Instead of one concurrency for all files, adjust per batch:

```typescript
async function uploadWithDynamicConcurrency(files: File[]) {
  const TARGET_BATCH_BYTES = 200 * 1024 * 1024; // 200MB per batch

  // Sort files by size (largest first for better packing)
  const sorted = [...files].sort((a, b) => b.size - a.size);

  let pending = [...sorted];

  while (pending.length > 0) {
    // Build a batch up to TARGET_BATCH_BYTES
    const batch: File[] = [];
    let batchSize = 0;

    while (pending.length > 0 && batchSize < TARGET_BATCH_BYTES) {
      const file = pending.shift()!;
      batch.push(file);
      batchSize += file.size;
    }

    // Upload entire batch in parallel
    await Promise.all(batch.map(f => uploadFile(f)));
  }
}
```

This approach:
- For 125 small files (0.53MB total): 1 batch, all parallel
- For 27 large files (1GB total): ~5 batches of ~200MB each
- Mixed sizes: Naturally groups by bandwidth budget
