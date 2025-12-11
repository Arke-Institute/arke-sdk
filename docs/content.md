# content package

HTTP client for read-only entity and content access. Business logic in IPFS Wrapper worker.

Independent (no dependencies on other packages).

## API

```typescript
// Entity operations
const entity = await arke.content.get('pi:abc123');
const entities = await arke.content.list({ type: 'photograph', limit: 20 });
const versions = await arke.content.versions('pi:abc123');
const resolved = await arke.content.resolve('pi:abc123');
const children = await arke.content.children('pi:parent');

// Content download
const blob = await arke.content.download(cid);  // Blob in browser, Buffer in Node
const url = arke.content.getUrl(cid);           // Direct URL
const stream = await arke.content.stream(cid);  // ReadableStream

// Get component
const pinax = await arke.content.getComponent(entity, 'pinax');

// Arke origin
const origin = await arke.content.arke();
```

## Gateway Routes

All public (no auth required):

```
GET /api/entities              # List entities
GET /api/entities/:pi          # Get entity
GET /api/entities/:pi/versions # Version history
GET /api/entities/:pi/resolve  # Resolve PI to CID
GET /api/cat/:cid              # Download content
GET /api/arke                  # Arke origin block
```

## Types

```typescript
interface Entity {
  pi: string;
  version: number;
  manifest_cid: string;
  entity_type: string;
  components: {
    pinax?: ComponentRef;
    description?: ComponentRef;
    source?: ComponentRef;
  };
}

interface ComponentRef {
  cid: string;
  size?: number;
  mediaType?: string;
}

interface EntityVersion {
  version: number;
  manifest_cid: string;
  created_at: string;
}

interface ListOptions {
  type?: string;
  limit?: number;
  offset?: number;
  parent?: string;
}
```

## Platform Support

Works in both Node.js and browsers:
- `download()`: Returns `Blob` (browser) or `Buffer` (Node)
- `stream()`: Returns `ReadableStream` (both)
- `getUrl()`: Returns URL string (both)
