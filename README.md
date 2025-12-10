# Arke SDK

TypeScript SDK for building applications on the Arke platform.

## Installation

```bash
npm install @arke/sdk
```

## Quick Start

```typescript
import { createClient } from '@arke/sdk';

const arke = createClient({
  authToken: 'your-jwt-token',
});

// Create a collection
const collection = await arke.collections.create({
  title: 'My Archive',
  slug: 'my-archive',
});

// Upload files to create a new collection
const result = await arke.upload.createCollection({
  files: './photos',
  collectionMetadata: {
    title: 'Photo Archive',
    slug: 'photos',
  },
});

// Query the knowledge graph
const results = await arke.query.natural(
  'Who are the people in photographs from Hawaii?'
);
```

## Packages

The SDK contains five packages:

| Package | Purpose | Auth Required |
|---------|---------|---------------|
| **collections** | Create/manage collections, members, invitations | Yes |
| **upload** | Upload files, create/add to collections | Yes |
| **edit** | Edit entities, trigger AI regeneration | Yes |
| **query** | Search and traverse the knowledge graph | No (public) |
| **content** | Read entities, download content | No (public) |

### Package Dependency Graph

```
collections (foundational)
       ▲
       │
  ┌────┴────┐
  │         │
upload    edit

query (independent)
content (independent)
```

## Package Details

### collections

```typescript
// Create collection
await arke.collections.create({ title, slug, description, visibility });

// List collections
const collections = await arke.collections.list({ page: 1 });

// Manage members
await arke.members.updateRole(collectionId, userId, 'editor');

// Invitations
await arke.invitations.create(collectionId, { email, role: 'editor' });
await arke.invitations.accept(invitationId);
```

### upload

```typescript
// Create new collection from files (anyone authenticated)
await arke.upload.createCollection({
  files: './photos',
  collectionMetadata: { title: 'My Archive', slug: 'my-archive' },
});

// Add to existing collection (requires membership)
await arke.upload.addToCollection({
  files: './more-photos',
  parentPi: 'pi:existing-root',
});
```

### edit

```typescript
// Edit entity
const session = await arke.edit.createSession('pi:abc123');
session.setPrompt('Update the description');
const result = await session.submit();

// Trigger AI regeneration
await arke.edit.regenerate('pi:abc123');
```

### query

```typescript
// Direct path query (requires knowing syntax)
await arke.query.path('"Hawaii" -[depicts]-> type:person');

// Natural language (LLM translates to path query)
await arke.query.natural('Who photographed Pearl Harbor?');

// Collection search
await arke.query.searchCollection(collectionId, 'family portraits');
```

### content

```typescript
// Get entity
const entity = await arke.content.get('pi:abc123');

// Download content
const blob = await arke.content.download('pi:abc123');

// Get version history
const versions = await arke.content.versions('pi:abc123');
```

## Documentation

- [Architecture Overview](./ARCHITECTURE.md)
- [collections package](./packages/collections/PLAN.md)
- [upload package](./packages/upload/PLAN.md)
- [edit package](./packages/edit/PLAN.md)
- [query package](./packages/query/PLAN.md)
- [content package](./packages/content/PLAN.md)

## Project Structure

```
arke-sdk/
├── src/
│   ├── index.ts              # Main entry, createClient()
│   ├── client.ts             # Base HTTP client
│   └── types.ts              # Shared types
├── packages/
│   ├── collections/
│   │   ├── index.ts          # Package entry
│   │   ├── collections.ts    # Collection CRUD
│   │   ├── members.ts        # Membership operations
│   │   ├── invitations.ts    # Invitation operations
│   │   └── types.ts
│   ├── upload/
│   │   ├── index.ts
│   │   ├── uploader.ts       # Main uploader class
│   │   ├── create-collection.ts
│   │   ├── add-to-collection.ts
│   │   └── types.ts
│   ├── edit/
│   │   ├── index.ts
│   │   ├── session.ts        # Edit session
│   │   ├── diff.ts           # Diff engine
│   │   └── types.ts
│   ├── query/
│   │   ├── index.ts
│   │   ├── path-query.ts     # Direct path queries
│   │   ├── natural-query.ts  # NL queries
│   │   ├── collection-search.ts
│   │   └── types.ts
│   └── content/
│       ├── index.ts
│       ├── entities.ts       # Entity operations
│       ├── download.ts       # Content download
│       └── types.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Distribution

The SDK is published to npm as `@arke/sdk`.

### Building

```bash
npm run build
```

### Publishing

```bash
npm version patch|minor|major
npm publish
```

### Imports

Users can import the full SDK or specific packages:

```typescript
// Full SDK
import { createClient } from '@arke/sdk';
const arke = createClient({ authToken });
arke.collections.create(...);

// Specific packages (tree-shakeable)
import { CollectionsClient } from '@arke/sdk/collections';
import { UploadClient } from '@arke/sdk/upload';
```

## Implementation Order

### Backend (Workers)
1. GraphDB Gateway - Add `is_collection_root` field + update endpoint
2. Query Links - Add filter support for `is_collection_root`
3. **Collections Worker** (new) - Manages collections in Supabase

### SDK (This Repo)
4. collections package
5. content package
6. upload package (refactor existing)
7. edit package (refactor existing)
8. query package

### Consumers
9. CLI (`arke-cli/`)
10. Web Frontend

## Backend Architecture

The SDK calls the Arke Gateway (`api.arke.institute`), which routes to workers:

| Route | Worker |
|-------|--------|
| `/collections/*`, `/me/*`, `/invitations/*` | Collections Worker |
| `/ingest/*` | Ingest Worker |
| `/api/*` | IPFS Wrapper |
| `/reprocess/*` | Reprocess API |
| `/query/*` | Query Links |
| `/translate/*` | Query Translator |

## Related Repositories

- **Collections Worker** - Backend for collection management (new)
- **Arke CLI** (`arke-cli/`) - Command-line interface using this SDK
- **Arke Gateway** (`arke-gateway/`) - API gateway routing
