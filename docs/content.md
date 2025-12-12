# content package

HTTP client for read-only entity and content access from IPFS Wrapper service.

Independent (no dependencies on other packages).

## API

```typescript
import { ContentClient } from '@arke-institute/sdk/content';

const content = new ContentClient({
  gatewayUrl: 'https://gateway.arke.institute',
});

// Entity operations
const entity = await content.get('01K75HQQXNTDG7BBP7PS9AWYAN');
const entities = await content.list({ limit: 20, include_metadata: true });
const versions = await content.versions('01K75HQQXNTDG7BBP7PS9AWYAN');
const resolved = await content.resolve('01K75HQQXNTDG7BBP7PS9AWYAN');
const childPis = await content.children('01K75HQQXNTDG7BBP7PS9AWYAN');
const childEntities = await content.childrenEntities('01K75HQQXNTDG7BBP7PS9AWYAN');

// Content download
const blob = await content.download(cid);  // Blob in browser, Buffer in Node
const url = content.getUrl(cid);           // Direct URL
const stream = await content.stream(cid);  // ReadableStream

// Get component
const pinax = await content.getComponent(entity, 'pinax');
const pinaxUrl = content.getComponentUrl(entity, 'pinax');

// Arke origin
const origin = await content.arke();
```

## Gateway Routes

All public (no auth required):

```
GET /api/entities              # List entities
GET /api/entities/:pi          # Get entity
GET /api/entities/:pi/versions # Version history
GET /api/resolve/:pi           # Resolve PI to CID
GET /api/cat/:cid              # Download content
GET /api/arke                  # Arke origin block
```

## Types

```typescript
interface Entity {
  pi: string;
  ver: number;
  ts: string;
  manifest_cid: string;
  prev_cid?: string;
  components: Record<string, string>;
  children_pi?: string[];
  parent_pi?: string;
  note?: string;
}

interface EntitySummary {
  pi: string;
  tip: string;
  ver?: number;
  ts?: string;
  note?: string;
  component_count?: number;
  children_count?: number;
}

interface EntityVersion {
  ver: number;
  cid: string;
  ts: string;
  note?: string;
}

interface ListOptions {
  limit?: number;
  cursor?: string;
  include_metadata?: boolean;
}

interface ListResponse {
  entities: EntitySummary[];
  limit: number;
  next_cursor: string | null;
}

interface VersionsResponse {
  items: EntityVersion[];
  next_cursor: string | null;
}

interface ResolveResponse {
  pi: string;
  tip: string;
}
```

## Platform Support

Works in both Node.js and browsers:
- `download()`: Returns `Blob` (browser) or `Buffer` (Node)
- `stream()`: Returns `ReadableStream` (both)
- `getUrl()`: Returns URL string (both)

## Error Handling

```typescript
import {
  ContentError,
  EntityNotFoundError,
  ContentNotFoundError,
  ComponentNotFoundError
} from '@arke-institute/sdk/content';

try {
  const entity = await content.get('invalid-pi');
} catch (err) {
  if (err instanceof EntityNotFoundError) {
    console.log('Entity not found:', err.details.pi);
  }
}
```
