# edit package

HTTP client for entity editing. Business logic in IPFS Wrapper and Reprocess API workers.

Depends on: `collections` package (for changing collection roots)

## API

```typescript
// Edit session
const session = await arke.edit.createSession('pi:abc123');
session.setPrompt('Update the description');
session.updateField('title', 'New Title');
await session.submit();

// AI regeneration
await arke.edit.regenerate('pi:abc123', {
  prompt: 'Add more detail about the people',
});
const status = await arke.edit.getRegenerateStatus(jobId);

// Change collection root (uses collections package)
await arke.edit.changeCollectionRoot(collectionId, 'pi:new-root');
```

## Permission Model

All edit operations require collection membership (owner or editor).

## Gateway Routes

```
GET  /api/entities/:pi              # Get entity (for edit session)
POST /api/entities/:pi/versions     # Create new version
POST /reprocess/reprocess           # Trigger AI regeneration
GET  /reprocess/status/:id          # Check status
```

## Types

```typescript
interface EditSession {
  pi: string;
  setPrompt(prompt: string): void;
  updateField(field: string, value: unknown): void;
  submit(): Promise<EditResult>;
}

interface RegenerateOptions {
  prompt?: string;
  fields?: string[];
}

interface RegenerateStatus {
  jobId: string;
  status: 'pending' | 'processing' | 'complete' | 'failed';
  progress?: number;
}
```

## Migration from Existing SDK

Location: `arke-edit-sdk/`

1. Update reprocess URL to use gateway (`/reprocess/*` prefix)
2. Add auth header to requests
3. Add dependency on collections package
