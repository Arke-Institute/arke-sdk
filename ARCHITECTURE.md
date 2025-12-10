# Arke SDK Architecture

## What is the Arke SDK?

The **Arke SDK** (`@arke/sdk`) is a TypeScript software development kit for building applications on the Arke platform. It's a single distributable package that contains multiple internal packages (modules) for different functionality.

**Key distinction:**
- **SDK** = The full toolkit (`@arke/sdk`)
- **Package** = An internal module within the SDK (collections, upload, edit, query, content)

## Design Principles

1. **Single SDK, Multiple Packages** - One installable package with modular functionality
2. **Gateway-First** - All API calls route through `api.arke.institute`
3. **Client-Side Logic** - SDK handles operations requiring client computation (CIDs, diffs, etc.)
4. **Shared Between CLI and Frontend** - Same SDK works in Node.js and browsers
5. **Type-Safe** - Full TypeScript with exported types

## SDK Structure

```
@arke/sdk
├── collections/    # Collection management
├── upload/         # File upload operations
├── edit/           # Entity editing
├── query/          # Search and queries
└── content/        # Read entities, download content
```

### Usage

```typescript
import { collections, upload, edit, query, content } from '@arke/sdk';

// Or import specific packages
import { collections } from '@arke/sdk/collections';
import { upload } from '@arke/sdk/upload';
```

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   CLI (arke-cli)              Web Frontend                          │
│         │                          │                                 │
│         └──────────┬───────────────┘                                │
│                    │                                                 │
│              @arke/sdk                                               │
│     ┌──────────────┼──────────────────┐                             │
│     │              │                  │                             │
│   collections   upload   edit   query   content                     │
│   (package)    (package) (package) (package) (package)              │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
                               │
                               │ HTTP
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        API GATEWAY                                   │
│                    api.arke.institute                               │
├─────────────────────────────────────────────────────────────────────┤
│  Routes to workers based on path:                                   │
│                                                                      │
│  /collections/*  →  Collections Worker (NEW)                        │
│  /me/*           →  Collections Worker                              │
│  /invitations/*  →  Collections Worker                              │
│  /ingest/*       →  Ingest Worker (existing)                        │
│  /api/*          →  IPFS Wrapper (existing)                         │
│  /reprocess/*    →  Reprocess API (existing)                        │
│  /query/*        →  Query Links (existing)                          │
│  /translate/*    →  Query Translator (existing)                     │
│  /graphdb/*      →  GraphDB Gateway (existing)                      │
└─────────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         WORKERS                                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Collections Worker (NEW)    - Manages collections, members,        │
│                                invitations in Supabase               │
│                              - Marks PIs as collection roots         │
│                                (calls graphdb-gateway)               │
│                                                                      │
│  Ingest Worker (existing)    - File upload, processing              │
│  IPFS Wrapper (existing)     - Entity CRUD, content serving         │
│  Reprocess API (existing)    - AI regeneration                      │
│  Query Links (existing)      - Path query execution                 │
│  Query Translator (existing) - NL → path query                      │
│  GraphDB Gateway (existing)  - Neo4j operations                     │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
                               │
                               ▼
                          ┌─────────┐
                          │Supabase │
                          └─────────┘
```

## Key Distinction: SDK vs Worker

**SDK packages are thin HTTP clients.** Business logic lives in workers.

| Concern | SDK Package | Worker |
|---------|-------------|--------|
| Where | Client (browser/Node) | Server (Cloudflare) |
| Role | HTTP client + types | Business logic |
| Auth | Passes JWT in headers | Validates JWT, checks permissions |
| State | Stateless | Manages database |
| Example | `collections.create({...})` → HTTP POST | Validates, inserts to Supabase, returns |

## Package Dependencies

Within the SDK, packages can depend on each other:

```
┌─────────────────────────────────────────────────────────────────┐
│                   collections (foundational)                     │
│  • Collection CRUD                                               │
│  • Membership/invitation management                              │
│  • Mark PI as collection root                                    │
└─────────────────────────────────────────────────────────────────┘
                    ▲                       ▲
                    │ depends on            │ depends on
                    │                       │
          ┌─────────┴─────────┐   ┌─────────┴─────────┐
          │      upload       │   │       edit        │
          │                   │   │                   │
          │ • createCollection│   │ • Edit entities   │
          │   (waits for      │   │ • Change          │
          │   ingest, then    │   │   collection root │
          │   registers via   │   │   (uses           │
          │   collections)    │   │   collections)    │
          │ • addToCollection │   │                   │
          └───────────────────┘   └───────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        query (independent)                       │
│  • Direct path queries                                          │
│  • Natural language queries                                     │
│  • Collection search                                            │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                       content (independent)                      │
│  • Read entities, download content                              │
│  • Version history                                              │
└─────────────────────────────────────────────────────────────────┘
```

## Gateway Routes by Package

```
┌─────────────────────────────────────────────────────────────────────┐
│                    api.arke.institute (Gateway)                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  collections ────► /collections/*, /me/*, /invitations/*            │
│               (Proxied to Collections Worker)                        │
│                                                                      │
│  upload ─────────► /ingest/*                                        │
│               (Proxied to Ingest Worker)                             │
│                                                                      │
│  edit ───────────► /api/entities/*, /reprocess/*                    │
│               (Proxied to IPFS Wrapper / Reprocess API)              │
│                                                                      │
│  query ──────────► /query/*, /translate/*                           │
│               (Proxied to Query Links / Query Translator)            │
│                                                                      │
│  content ────────► /api/entities/*, /api/cat/*                      │
│               (Proxied to IPFS Wrapper)                              │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

## Authentication

All SDK operations accept an auth token (JWT from Supabase):

```typescript
import { createClient } from '@arke/sdk';

const arke = createClient({
  gatewayUrl: 'https://api.arke.institute',  // Default
  authToken: 'eyJ...',                       // JWT for authenticated operations
  network: 'main',                           // 'main' | 'test'
});

// Now use packages
await arke.collections.create({ ... });
await arke.upload.createCollection({ ... });
```

## Permission Model

### Two Upload Operations

```
┌─────────────────────────────────────────────────────────────────┐
│                        Upload Operations                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  CREATE NEW COLLECTION                ADD TO EXISTING COLLECTION │
│  Parent = Arke origin block           Parent = existing PI       │
│                                                                  │
│  • Anyone authenticated can do        • Requires membership      │
│  • Creates new root PI                • Must be owner/editor of  │
│  • Root PI marked with                  collection that owns     │
│    is_collection_root: true             the parent PI            │
│  • Creator becomes owner                                         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Permission Flow

```
User wants to upload/edit PI
         │
         ▼
┌─────────────────────────────────────┐
│ SDK sends request to Gateway        │
│ with auth token + PI                │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│ Gateway/Worker checks permissions   │
│ (finds collection, checks membership)│
└────────────────┬────────────────────┘
                 │
         ┌───────┴───────┐
         │               │
         ▼               ▼
      Allowed        403 Forbidden
```

## GraphDB Integration

### Collection Root Marking

Collection root PIs are marked in the graph database with `is_collection_root: true`:

```cypher
(:Entity {
  canonical_id: string,
  type: 'pi',
  is_collection_root: boolean,  // true for collection roots
  ...
})
```

This enables:
- Fast collection search (filter by `is_collection_root: true`)
- Query package can find all collections

### Required Backend Changes

1. **GraphDB Gateway**: Add `PATCH /entity/:canonical_id` endpoint
2. **Query Links**: Add filter support for `is_collection_root`

## Implementation Order

### Workers (Backend)
1. GraphDB Gateway - Add `is_collection_root` field + update endpoint
2. Query Links - Add filter support for `is_collection_root`
3. **Collections Worker** (new) - Collection/membership/invitation management

### SDK (This Repo)
4. collections package - Interfaces with Collections Worker
5. content package - Read operations (independent)
6. upload package - Refactor existing SDK, integrate collections
7. edit package - Refactor existing SDK, integrate collections
8. query package - Three query methods

### Consumers
9. CLI - Consumes SDK
10. Web Frontend - Consumes SDK
