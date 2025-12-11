# upload package

HTTP client for file upload operations. Business logic in Ingest Worker.

Depends on: `collections` package (to register new collection roots)

## API

```typescript
// Create new collection from files (anyone authenticated)
await arke.upload.createCollection({
  files: './photos',
  collectionMetadata: { title: 'My Archive', slug: 'my-archive' },
  onProgress: (p) => console.log(p),
});

// Add to existing collection (requires membership)
await arke.upload.addToCollection({
  files: './more-photos',
  parentPi: 'pi:existing-root',
});
```

## Permission Model

| Operation | Permission |
|-----------|------------|
| `createCollection()` | Anyone authenticated |
| `addToCollection()` | Owner/editor of collection |

## Gateway Routes

```
POST /ingest/init-batch
POST /ingest/upload
POST /ingest/finalize
GET  /ingest/status/:batchId
```

## Types

```typescript
interface CreateCollectionUploadOptions {
  files: File[] | string;
  collectionMetadata: { title: string; slug: string; description?: string; visibility?: 'public' | 'private' };
  onProgress?: (progress: UploadProgress) => void;
}

interface AddToCollectionOptions {
  files: File[] | string;
  parentPi: string;
  onProgress?: (progress: UploadProgress) => void;
}

interface UploadProgress {
  phase: 'uploading' | 'processing' | 'complete';
  filesUploaded: number;
  totalFiles: number;
}
```

## Migration from Existing SDK

Location: `ingest-pipeline/arke-upload-sdk/`

1. Update HTTP client to use gateway (`/ingest/*` prefix)
2. Add auth header to requests
3. Implement two operations instead of one
4. Add dependency on collections package
