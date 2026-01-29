# @arke-institute/sdk

TypeScript SDK for the Arke API - auto-generated from OpenAPI spec.

## Installation

```bash
npm install @arke-institute/sdk
```

## Quick Start

```typescript
import { ArkeClient } from '@arke-institute/sdk';

const arke = new ArkeClient({
  authToken: 'your-jwt-token',
});

// Create an entity
const { data, error } = await arke.api.POST('/entities', {
  body: {
    collection_id: '01ABC...',
    type: 'document',
    properties: { title: 'My Document' },
  },
});

if (error) {
  console.error('Failed:', error);
} else {
  console.log('Created:', data.id);
}
```

## Configuration

```typescript
const arke = new ArkeClient({
  // Base URL (default: 'https://api.arke.institute')
  baseUrl: 'https://api.arke.institute',

  // JWT or API key
  authToken: 'your-token',

  // Network: 'main' or 'test' (default: 'main')
  network: 'test',

  // Custom headers
  headers: {
    'X-Custom-Header': 'value',
  },
});
```

## API Access

All API calls are made through the `arke.api` property, which provides full type safety:

```typescript
// GET request
const { data } = await arke.api.GET('/entities/{id}', {
  params: { path: { id: '01XYZ...' } },
});

// POST request
const { data } = await arke.api.POST('/entities', {
  body: { collection_id: '...', type: 'document', properties: {} },
});

// PUT request (update)
const { data } = await arke.api.PUT('/entities/{id}', {
  params: { path: { id: '01XYZ...' } },
  body: { expect_tip: 'bafyrei...', properties_merge: { status: 'active' } },
});

// DELETE request
await arke.api.DELETE('/relationships', {
  body: { source_id: '...', target_id: '...', predicate: 'contains' },
});
```

## Available Endpoints

The SDK provides typed access to all Arke API endpoints:

| Endpoint Group | Description |
|----------------|-------------|
| `/auth/*` | Authentication and registration |
| `/users/*` | User profile and API keys |
| `/collections/*` | Collection CRUD, roles, members |
| `/entities/*` | Entity CRUD |
| `/relationships` | Relationship management |
| `/files/*` | File storage and downloads |
| `/folders/*` | Folder hierarchy |
| `/versions/*` | Version history |
| `/agents/*` | Agent management |
| `/permissions/*` | Permission introspection |

## Error Handling

```typescript
import {
  ArkeError,
  CASConflictError,
  NotFoundError,
  parseApiError
} from '@arke-institute/sdk';

const { data, error, response } = await arke.api.GET('/entities/{id}', {
  params: { path: { id: 'invalid-id' } },
});

if (error) {
  // Parse into typed error
  const arkeError = parseApiError(response.status, error);

  if (arkeError instanceof CASConflictError) {
    console.log('Concurrent modification - expected:', arkeError.expectedTip);
  } else if (arkeError instanceof NotFoundError) {
    console.log('Entity not found');
  }
}
```

## Authentication Management

```typescript
const arke = new ArkeClient();

// Set token after login
arke.setAuthToken('new-token');

// Check auth status
if (arke.isAuthenticated) {
  // Make authenticated requests
}

// Clear token on logout
arke.clearAuthToken();
```

## Test Network

Use the test network for development (uses 'II' prefixed IDs):

```typescript
const arke = new ArkeClient({
  authToken: 'your-token',
  network: 'test',
});
```

## Folder Upload

Upload entire folder structures with automatic CID computation and relationship linking:

### Node.js

```typescript
import { ArkeClient } from '@arke-institute/sdk';
import { uploadTree, scanDirectory } from '@arke-institute/sdk/operations';

const arke = new ArkeClient({ authToken: 'your-token' });

// Scan a local directory
const tree = await scanDirectory('/path/to/my-folder');

// Upload to a new collection
const result = await uploadTree(arke, tree, {
  target: {
    createCollection: {
      label: 'My Upload',
      description: 'Uploaded folder contents',
    },
  },
  onProgress: (p) => {
    console.log(`${p.phase}: ${p.completedFiles}/${p.totalFiles} files`);
  },
});

console.log('Collection:', result.collection.id);
console.log('Files:', result.files.length);
console.log('Folders:', result.folders.length);
```

### Browser (Drag & Drop)

```typescript
import { uploadTree, scanFileSystemEntries } from '@arke-institute/sdk/operations';

dropzone.ondrop = async (e) => {
  e.preventDefault();
  const entries = Array.from(e.dataTransfer.items)
    .map(item => item.webkitGetAsEntry())
    .filter(Boolean);

  const tree = await scanFileSystemEntries(entries);
  const result = await uploadTree(client, tree, {
    target: { collectionId: 'existing-collection-id' },
  });
};
```

### Browser (File Input)

```typescript
import { uploadTree, scanFileList } from '@arke-institute/sdk/operations';

// <input type="file" webkitdirectory multiple />
input.onchange = async (e) => {
  const tree = await scanFileList(e.target.files);
  const result = await uploadTree(client, tree, {
    target: { parentId: 'existing-folder-id', collectionId: 'collection-id' },
  });
};
```

### Upload Options

```typescript
const result = await uploadTree(client, tree, {
  target: {
    // Option 1: Create new collection
    createCollection: { label: 'New Collection' },

    // Option 2: Upload to existing collection root
    collectionId: '01ABC...',

    // Option 3: Upload to existing folder
    collectionId: '01ABC...',
    parentId: '01XYZ...',
  },

  // Progress tracking
  onProgress: (p) => console.log(p.phase, p.completedFiles),

  // Parallel uploads (default: 5)
  concurrency: 10,

  // Continue if some files fail
  continueOnError: true,
});
```

### CID Utilities

```typescript
import { computeCid, verifyCid } from '@arke-institute/sdk/operations';

// Compute CIDv1 for any content
const cid = await computeCid(new TextEncoder().encode('hello'));
// => "bafkreifzjut3te2nhyekklss27nh3k72ysco7y32koao5eei66wof36n5e"

// Verify content matches CID
const isValid = await verifyCid(content, expectedCid);
```

## Development

### Regenerate Types

When the API changes, regenerate the types:

```bash
# From production API
npm run generate

# From local dev server
npm run generate:local
```

### Build

```bash
npm run build
```

### Test

```bash
npm test
```

### Publish

```bash
# Dry run
npm run publish-all:dry

# Actual publish
npm run publish-all
```

## Future Operations

The SDK includes placeholder modules for additional high-level operations:

- **BatchOperations**: Bulk entity/relationship creation
- **CryptoOperations**: Ed25519 key generation

## License

MIT
