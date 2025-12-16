# Edit Package Implementation Plan

## Summary

Migrate functionality from `arke-edit-sdk/` to `arke-sdk/src/edit/` with authentication through the gateway.

---

## Implementation Progress

### ✅ Phase 1: IPFS Wrapper Permission Enforcement - COMPLETE

**Commit:** `ipfs_wrapper` - Added permission checking via collections worker

**Changes Made:**
- Added `COLLECTIONS_WORKER` service binding to `wrangler.jsonc`
- Created `src/lib/permissions.ts` with `checkEditPermission()` function
- Updated `src/handlers/versions.ts` to check permissions before `appendVersionHandler`
- Permissions flow: JWT → Gateway validates → sets `X-User-Id` → IPFS Wrapper → Collections Worker

**Permission Logic:**
- If PI is NOT in a collection → `canEdit: true` (free entity)
- If PI IS in a collection → `canEdit: true` only if user is owner/editor

### ✅ Phase 2: Reprocess API Permission Enforcement - COMPLETE

**Commit:** `d651278` in `arke-reprocess-api` - Add permission checking via collections worker

**Changes Made:**
- Added `COLLECTIONS_WORKER` service binding to `wrangler.jsonc`
- Created `src/permissions.ts` with `checkReprocessPermission()` function
- Updated `src/index.ts` to check permissions and auto-set cascade boundary
- Fixed `src/resolver.ts` to treat `00000000000000000000000000` as "no parent" sentinel
- Added `test/permissions.test.ts` with full test coverage
- Added `PERMISSION_PLAN.md` documenting the implementation

**Cascade Logic:**
- Cascade automatically stops at `collection.rootPi`
- No cross-collection cascading (limitation documented)
- User can still provide explicit `stop_at_pi` to cascade less than full collection

**Test Results:**
| Test | Result |
|------|--------|
| Owner permission check | ✓ `canEdit: true` |
| Non-member permission check | ✓ `canEdit: false` |
| Reprocess by owner | ✓ 200 OK |
| Reprocess by non-member | ✓ 403 Forbidden |
| Reprocess unauthenticated | ✓ 401 Unauthorized |
| Cascade from child to root | ✓ 2 entities queued |

### 🔲 Phase 3: SDK Edit Package - NOT STARTED

### 🔲 Phase 4: SDK Permission UX - NOT STARTED

---

## Current arke-edit-sdk Functionality Analysis

### Core Components

| File | Purpose | Migrate? |
|------|---------|----------|
| `client.ts` | Low-level API calls (IPFS Wrapper + Reprocess API) | Yes, adapt to gateway URLs |
| `session.ts` | Stateful EditSession class | Yes |
| `diff.ts` | Text diffing with `diff` npm package | Yes (utility) |
| `prompts.ts` | AI prompt construction | Yes (utility) |
| `types.ts` | All type definitions | Yes |
| `sdk.ts` | Factory class | Yes, rename to EditClient |
| `react/useEditSession.ts` | React hook | Skip for now (SDK is vanilla TS) |

### Functionality Summary

1. **Entity Operations** (via IPFS Wrapper)
   - `getEntity(pi)` - Fetch entity by PI
   - `getContent(cid)` - Fetch content by CID
   - `uploadContent(content, filename)` - Upload and get CID
   - `updateEntity(pi, update)` - Create new version (CAS)

2. **Reprocess Operations** (via Reprocess API)
   - `reprocess(request)` - Trigger AI regeneration
   - `getReprocessStatus(statusUrl)` - Poll status

3. **EditSession** (high-level workflow)
   - Load entity and components
   - Set prompts (AI mode) or edit content (manual mode)
   - Add corrections (OCR fixes)
   - Configure scope (which components to regenerate, cascade)
   - Submit (save + reprocess)
   - Wait for completion with polling

4. **Utility Classes**
   - `DiffEngine` - Line/word diffs, formatting for prompts
   - `PromptBuilder` - Context-aware prompt construction

---

## Gateway Endpoint Analysis

### Already Available

| Edit SDK Endpoint | Gateway Route | Auth | Status |
|-------------------|---------------|------|--------|
| `GET /entities/:pi` | `GET /api/entities/:pi` | Public | ✅ |
| `GET /cat/:cid` | `GET /api/cat/:cid` | Public | ✅ |
| `POST /upload` | `POST /api/upload` | Required | ✅ |
| `POST /entities/:pi/versions` | `POST /api/entities/:pi/versions` | Required | ✅ |
| `POST /api/reprocess` | `POST /reprocess/reprocess` | Required | ✅ |

### Gaps / Issues

1. **Reprocess Status URL Transform**
   - Current: Reprocess API returns `status_url` pointing to orchestrator domain
   - Problem: Orchestrator may not be proxied through gateway
   - Solution: Either proxy orchestrator OR transform URLs in SDK

2. **No `/api/upload` endpoint confirmation**
   - Need to verify IPFS Wrapper has `/upload` route
   - Gateway proxies `POST /api/*` with auth to IPFS Wrapper

3. **Collections Integration**
   - `changeCollectionRoot()` already exists in `CollectionsClient.changeRoot()`
   - Just need to re-export or document usage

---

## Implementation Plan

### Phase 1: Core Edit Client

Create `src/edit/` package structure mirroring collections:

```
src/edit/
├── index.ts           # Public exports
├── client.ts          # EditClient class
├── session.ts         # EditSession class
├── diff.ts            # DiffEngine (copy from edit-sdk)
├── prompts.ts         # PromptBuilder (copy from edit-sdk)
├── errors.ts          # EditError classes
└── types.ts           # All type definitions
```

### File-by-File Plan

#### 1. `types.ts` - Copy and adapt from arke-edit-sdk

Keep all types but remove:
- `ArkeClientConfig` (replaced by `EditClientConfig`)
- `statusUrlTransform` option (handled differently)

Key types to include:
```typescript
// Config
EditClientConfig
EditMode
EditSessionConfig

// Entity
Entity
EntityUpdate
EntityVersion

// Edit
RegeneratableComponent
EditScope
Correction

// Diff
DiffType
TextDiff
ComponentDiff

// Prompt
PromptTarget
EntityContext
CascadeContext
CustomPrompts

// Reprocess
ReprocessRequest
ReprocessResult
ReprocessPhase
ReprocessProgress
ReprocessStatus

// Result
SaveResult
EditResult
EditPhase
EditStatus
PollOptions
ChangeSummary
```

#### 2. `errors.ts` - New error classes

```typescript
export class EditError extends Error {
  constructor(message: string, public code: string, public details?: unknown)
}

export class EntityNotFoundError extends EditError
export class CASConflictError extends EditError
export class ReprocessError extends EditError
export class ValidationError extends EditError
```

#### 3. `diff.ts` - Copy from arke-edit-sdk

Direct copy with minimal changes:
- Keep `diff` npm package dependency
- All methods are static, no external deps

#### 4. `prompts.ts` - Copy from arke-edit-sdk

Direct copy:
- Uses only internal types
- All methods are static

#### 5. `client.ts` - EditClient class

**Key differences from arke-edit-sdk:**
- Single `gatewayUrl` instead of separate URLs
- All routes go through gateway:
  - `/api/*` for IPFS Wrapper
  - `/reprocess/*` for Reprocess API
- Auth token handling like CollectionsClient

```typescript
export interface EditClientConfig {
  gatewayUrl: string;      // https://api.arke.institute
  authToken?: string;
  fetchImpl?: typeof fetch;
}

export class EditClient {
  // Entity operations (via /api/*)
  async getEntity(pi: string): Promise<Entity>
  async getContent(cid: string): Promise<string>
  async uploadContent(content: string, filename: string): Promise<string>
  async updateEntity(pi: string, update: EntityUpdate): Promise<EntityVersion>

  // Reprocess operations (via /reprocess/*)
  async reprocess(request: ReprocessRequest): Promise<ReprocessResult>
  async getReprocessStatus(batchId: string): Promise<ReprocessStatus>

  // Session factory
  createSession(pi: string, config?: EditSessionConfig): EditSession
}
```

**URL Mapping:**
| Operation | Gateway URL |
|-----------|-------------|
| Get entity | `GET /api/entities/{pi}` |
| Get content | `GET /api/cat/{cid}` |
| Upload content | `POST /api/upload` |
| Update entity | `POST /api/entities/{pi}/versions` |
| Reprocess | `POST /reprocess/reprocess` |
| Status | `GET /reprocess/status/{batchId}` |

**Note on Status URL:**
The reprocess API returns `status_url` which points directly to the orchestrator.
Options:
1. Parse `status_url` to extract batch_id, reconstruct as `/reprocess/status/{id}`
2. Proxy orchestrator through gateway (more work)

Recommend option 1 - extract batch_id and use `/reprocess/status/{batch_id}`.

#### 6. `session.ts` - EditSession class

Copy from arke-edit-sdk with these changes:
- Constructor takes `EditClient` instead of `ArkeClient`
- Status polling uses batch_id instead of raw URL

#### 7. `index.ts` - Public exports

```typescript
// Client
export { EditClient, type EditClientConfig } from './client';

// Session
export { EditSession } from './session';

// Utilities
export { DiffEngine } from './diff';
export { PromptBuilder } from './prompts';

// Errors
export {
  EditError,
  EntityNotFoundError,
  CASConflictError,
  ReprocessError,
  ValidationError,
} from './errors';

// Types
export type { /* all types */ } from './types';
```

### Phase 2: Update Main SDK Index

Add edit exports to `src/index.ts`:

```typescript
// Edit
export {
  EditClient,
  type EditClientConfig,
  EditSession,
  DiffEngine,
  PromptBuilder,
  EditError,
  EntityNotFoundError,
  CASConflictError,
  ReprocessError,
  // ... types
} from './edit';
```

### Phase 3: Verify Gateway Routes

Confirm these IPFS Wrapper routes exist:
- `GET /entities/:pi` ✓ (documented)
- `POST /entities/:pi/versions` ✓ (documented)
- `GET /cat/:cid` - verify
- `POST /upload` - verify

Confirm Reprocess API routes:
- `POST /api/reprocess` ✓ (documented)
- `GET /api/status/:batch_id` - verify exact path

---

## Gateway Changes Needed

### None Required!

The gateway already has:
```typescript
// All GET /api/* is public
app.get('/api/*', (c) => proxyToService(c, c.env.IPFS_WRAPPER, { stripPrefix: '/api' }));

// All other /api/* requires auth (POST, etc.)
app.all('/api/*', requireAuth, (c) => proxyToService(c, c.env.IPFS_WRAPPER, { stripPrefix: '/api' }));

// All /reprocess/* requires auth
app.all('/reprocess/*', requireAuth, (c) => proxyToService(c, c.env.REPROCESS_API, { stripPrefix: '/reprocess', addPrefix: '/api' }));
```

The edit SDK operations map cleanly:
- Read operations → `GET /api/*` (public)
- Write operations → `POST /api/*` (auth required)
- Reprocess → `POST /reprocess/*` (auth required)

---

## Dependencies

### New npm dependencies for arke-sdk

```json
{
  "dependencies": {
    "diff": "^7.0.0"
  }
}
```

The `diff` package is small and well-maintained.

---

## Migration Guide (for arke-edit-sdk users)

### Before (arke-edit-sdk)

```typescript
import { ArkeEditSDK } from 'arke-edit-sdk';

const sdk = new ArkeEditSDK({
  ipfsWrapperUrl: 'https://api.arke.institute',
  reprocessApiUrl: 'https://reprocess-api.arke.institute',
  authToken: 'your-token',
});

const session = sdk.createSession('pi:abc123', { mode: 'ai-prompt' });
```

### After (arke-sdk)

```typescript
import { EditClient } from '@arke-institute/sdk';

const edit = new EditClient({
  gatewayUrl: 'https://api.arke.institute',
  authToken: 'your-token',
});

const session = edit.createSession('pi:abc123', { mode: 'ai-prompt' });
```

---

## API Changes Summary

| Old | New |
|-----|-----|
| `ArkeEditSDK` | `EditClient` |
| `ArkeClient` | Internal to `EditClient` |
| `ipfsWrapperUrl` + `reprocessApiUrl` | `gatewayUrl` |
| `statusUrlTransform` | Not needed (handled internally) |

---

## Estimated Scope

- **Types**: ~270 lines (copy + adapt)
- **Errors**: ~50 lines (similar to collections)
- **Diff**: ~200 lines (direct copy)
- **Prompts**: ~250 lines (direct copy)
- **Client**: ~200 lines (adapt from arke-edit-sdk/client.ts)
- **Session**: ~500 lines (adapt from arke-edit-sdk/session.ts)
- **Index**: ~60 lines

**Total: ~1,500 lines**

Most is direct copy/paste with minor adaptations for gateway URLs.

---

## Backend Changes Required: Permission Model

### Current State

The permission system exists in `collections-worker/src/lib/permissions.ts`:

```typescript
// getPiPermissions returns:
interface PiPermissions {
  pi: string;
  canView: boolean;      // Can read entity content
  canEdit: boolean;      // Can modify entity (owner or editor)
  canAdminister: boolean; // Can manage collection (owner only)
  collection: {
    id: string;
    title: string;
    slug: string;
    visibility: string;
    role: 'owner' | 'editor' | 'viewer' | null;
    rootPi: string;
    hops: number;        // Distance from PI to collection root
  } | null;
}
```

**Key Logic:**
- If PI is NOT inside a collection → anyone can edit (`canEdit: true`)
- If PI IS inside a collection → only members with `owner` or `editor` role can edit
- `getPiPermissions()` uses GraphDB to find parent collection, then checks Supabase for membership

### Problem

Currently, **neither IPFS Wrapper nor Reprocess API check permissions**:

1. **IPFS Wrapper** (`POST /entities/:pi/versions`)
   - Accepts any authenticated request
   - No check if user can edit that specific PI

2. **Reprocess API** (`POST /api/reprocess`)
   - Accepts any authenticated request
   - No check if user can reprocess that specific PI

### Solution: Worker-Level Permission Enforcement

Gateway-level permission checks don't scale well because:
- Cascade operations need to check permissions across multiple collections
- Gateway would need complex logic to parse request bodies and check each affected entity
- Each worker knows best what permissions it needs

**Approach: Each worker checks its own permissions via COLLECTIONS_WORKER service binding.**

---

## IPFS Wrapper Permission Enforcement

### Changes Required

**1. Add service binding** in `wrangler.jsonc`:
```jsonc
{
  "services": [
    { "binding": "COLLECTIONS_WORKER", "service": "collections-worker" }
  ]
}
```

**2. Update Env type** in `src/types/env.ts`:
```typescript
export interface Env {
  // ... existing
  COLLECTIONS_WORKER: Fetcher;
}
```

**3. Create permission helper** `src/lib/permissions.ts`:
```typescript
import type { Env } from '../types/env';

export interface PiPermissions {
  pi: string;
  canView: boolean;
  canEdit: boolean;
  canAdminister: boolean;
  collection: {
    id: string;
    rootPi: string;
  } | null;
}

export async function checkEditPermission(
  env: Env,
  userId: string | null,
  pi: string
): Promise<{ allowed: boolean; reason?: string }> {
  const response = await env.COLLECTIONS_WORKER.fetch(
    `https://internal/pi/${pi}/permissions`,
    {
      headers: userId ? { 'X-User-Id': userId } : {},
    }
  );

  if (!response.ok) {
    return { allowed: false, reason: 'Permission check failed' };
  }

  const permissions: PiPermissions = await response.json();

  if (!permissions.canEdit) {
    return {
      allowed: false,
      reason: permissions.collection
        ? `Not authorized to edit entities in collection "${permissions.collection.id}"`
        : 'Not authorized to edit this entity',
    };
  }

  return { allowed: true };
}
```

**4. Add permission check to `appendVersionHandler`** in `src/handlers/versions.ts`:
```typescript
import { checkEditPermission } from '../lib/permissions';

export async function appendVersionHandler(c: Context): Promise<Response> {
  const pi = c.req.param('pi');
  const userId = c.req.header('X-User-Id') || null;

  // Permission check
  const permission = await checkEditPermission(c.env, userId, pi);
  if (!permission.allowed) {
    return c.json({
      error: 'FORBIDDEN',
      message: permission.reason,
    }, 403);
  }

  // ... rest of existing handler
}
```

### Files to Modify

| File | Changes |
|------|---------|
| `ipfs_wrapper/wrangler.jsonc` | Add COLLECTIONS_WORKER service binding |
| `ipfs_wrapper/src/types/env.ts` | Add COLLECTIONS_WORKER to Env |
| `ipfs_wrapper/src/lib/permissions.ts` | NEW: permission check helper |
| `ipfs_wrapper/src/handlers/versions.ts` | Add permission check to appendVersionHandler |

---

## Reprocess API Permission Enforcement

The Reprocess API has more complex permission requirements due to **cascade**.

### Cascade Permission Model

```
Entity Tree:                    Collections:

    A (root)                    Collection X (root: A)
   / \                            - User has editor role
  B   C
 /                             Collection Y (root: B)
D                                 - User has NO role
```

**Scenario:** User triggers reprocess on D with `cascade: true`

**Current behavior:** Cascade goes all the way to A (absolute root)

**New behavior:** Cascade should respect collection boundaries and permissions:

1. **Default cascade target:** The root of the user's nearest accessible collection
   - If D is in Collection Y but user has no access, check parent B
   - B is root of Collection Y, but user has no access
   - Check C's parent A - user has editor access to Collection X
   - Cascade stops at A (Collection X root)

2. **Explicit `stop_at_pi`:** User can specify where to stop cascade
   - If user specifies `stop_at_pi: C`, cascade only goes to C
   - User must have edit permission on C for this to work

3. **Cross-collection cascade:** When cascade crosses collection boundaries
   - Must check permission for EACH collection in the path
   - If any collection denies access, cascade stops there

### New Reprocess API Request Format

```typescript
interface ReprocessRequest {
  pi: string;
  phases: string[];
  cascade: boolean;
  options?: {
    stop_at_pi?: string;           // Explicit stop point (optional)
    cascade_to_collection_root?: boolean;  // Default: true
    custom_prompts?: CustomPrompts;
    custom_note?: string;
  };
}
```

### New Reprocess API Response (with cascade info)

```typescript
interface ReprocessResponse {
  batch_id: string;
  entities_queued: number;
  entity_pis: string[];
  status_url: string;
  cascade_info?: {
    requested_stop_at: string | null;
    actual_stop_at: string;           // Where cascade actually stopped
    stopped_reason: 'reached_target' | 'permission_boundary' | 'tree_root';
    collections_traversed: string[];  // Collection IDs in cascade path
  };
}
```

### Permission Check Flow for Reprocess

```typescript
async function checkReprocessPermissions(
  env: Env,
  userId: string,
  pi: string,
  cascade: boolean,
  stopAtPi?: string
): Promise<{
  allowed: boolean;
  reason?: string;
  effectiveStopPi?: string;
  collectionsTraversed?: string[];
}> {
  // 1. Check permission on the target PI
  const targetPerms = await getPiPermissions(env, userId, pi);
  if (!targetPerms.canEdit) {
    return { allowed: false, reason: 'Not authorized to edit this entity' };
  }

  if (!cascade) {
    return { allowed: true, effectiveStopPi: pi };
  }

  // 2. For cascade, walk up the tree and check permissions at each collection boundary
  const collectionsTraversed: string[] = [];
  let currentPi = pi;
  let effectiveStopPi = pi;

  while (true) {
    const entity = await getEntity(env, currentPi);
    if (!entity.parent_pi) {
      // Reached tree root
      effectiveStopPi = currentPi;
      break;
    }

    // Check if user specified this as stop point
    if (stopAtPi && currentPi === stopAtPi) {
      effectiveStopPi = currentPi;
      break;
    }

    // Get permissions for parent
    const parentPerms = await getPiPermissions(env, userId, entity.parent_pi);

    // Track collection changes
    if (parentPerms.collection && parentPerms.collection.id !== targetPerms.collection?.id) {
      collectionsTraversed.push(parentPerms.collection.id);

      // Check if user can edit in this new collection
      if (!parentPerms.canEdit) {
        // Stop cascade here - user can't edit higher
        effectiveStopPi = currentPi;
        break;
      }
    }

    currentPi = entity.parent_pi;
    effectiveStopPi = currentPi;

    // Safety: prevent infinite loops
    if (collectionsTraversed.length > 100) break;
  }

  return {
    allowed: true,
    effectiveStopPi,
    collectionsTraversed,
  };
}
```

### Changes Required

**1. Add service binding** in `wrangler.jsonc`:
```jsonc
{
  "services": [
    { "binding": "COLLECTIONS_WORKER", "service": "collections-worker" }
  ]
}
```

**2. Update Env type** in `src/types.ts`:
```typescript
export interface Env {
  // ... existing
  COLLECTIONS_WORKER: Fetcher;
}
```

**3. Create permission module** `src/permissions.ts`:
```typescript
// Full implementation of checkReprocessPermissions
// Plus helper to call collections worker
```

**4. Update `handleReprocessRequest`** in `src/index.ts`:
```typescript
// Extract user ID from header (gateway sets this)
const userId = request.headers.get('X-User-Id');
if (!userId) {
  return jsonResponse({ error: 'UNAUTHORIZED', message: 'Authentication required' }, 401);
}

// Check permissions (including cascade)
const permCheck = await checkReprocessPermissions(
  env,
  userId,
  body.pi,
  body.cascade,
  body.options?.stop_at_pi
);

if (!permCheck.allowed) {
  return jsonResponse({ error: 'FORBIDDEN', message: permCheck.reason }, 403);
}

// Use effectiveStopPi instead of user-provided stop_at_pi
const effectiveStopAtPI = permCheck.effectiveStopPi || body.options?.stop_at_pi || '00000000000000000000000000';
```

### Files to Modify

| File | Changes |
|------|---------|
| `arke-reprocess-api/wrangler.jsonc` | Add COLLECTIONS_WORKER service binding |
| `arke-reprocess-api/src/types.ts` | Add COLLECTIONS_WORKER to Env, update request/response types |
| `arke-reprocess-api/src/permissions.ts` | NEW: permission checking with cascade logic |
| `arke-reprocess-api/src/index.ts` | Add permission check, update response format |

---

## Collections Worker: New Endpoint Needed?

The existing `/pi/:pi/permissions` endpoint returns single-PI permissions. For efficient cascade checking, we might want a batch endpoint:

**Option A: Use existing endpoint (multiple calls)**
- Simple, no backend changes
- Slightly slower for deep cascades
- Acceptable for MVP

**Option B: New batch endpoint**
```typescript
// POST /pi/permissions/batch
{
  pis: string[];
  userId?: string;
}

// Response
{
  permissions: Record<string, PiPermissions>;
}
```

**Recommendation:** Start with Option A. Optimize later if cascade permission checking becomes a bottleneck.

---

## Gateway Changes

**No permission logic needed.** Gateway just:
1. Authenticates the user (already does this)
2. Sets `X-User-Id` header (already does this)
3. Proxies to worker (already does this)

Workers handle their own authorization.

---

## Complete Implementation Phases

### ✅ Phase 1: IPFS Wrapper Permission Enforcement - DONE
1. ~~Add COLLECTIONS_WORKER service binding~~
2. ~~Create permission helper~~
3. ~~Add check to `appendVersionHandler`~~
4. ~~Test: member vs non-member entity edits~~

### ✅ Phase 2: Reprocess API Permission Enforcement - DONE
1. ~~Add COLLECTIONS_WORKER service binding~~
2. ~~Create permission module with cascade logic~~
3. ~~Update request handler with permission checks~~
4. ~~Auto-set cascade boundary to collection rootPi~~
5. ~~Test: single entity, cascade within collection~~

**Note:** Cross-collection cascade is NOT supported. Cascade stops at collection root. This is documented as a limitation in `arke-reprocess-api/PERMISSION_PLAN.md`.

### 🔲 Phase 3: SDK Edit Package - NEXT
1. Create `src/edit/` package structure
2. Copy types, diff, prompts from arke-edit-sdk
3. Adapt client for gateway URLs
4. Adapt session for new client
5. Add to main SDK exports

**Simplified approach:** Since backend permission enforcement is complete, the SDK doesn't need to do permission pre-checks. It can just make requests and handle 403 errors gracefully.

### 🔲 Phase 4: SDK Permission UX (Optional)
1. Add `checkEditPermission()` to EditClient for UX pre-flight checks
2. Add `PermissionError` class for better error handling
3. Consider adding permission info to EditSession for UI hints

**Note:** This phase is optional since the backend already enforces permissions. This is purely for better UX (showing "you can't edit this" before the user tries).

---

## Cascade Behavior Summary

| Scenario | Default Cascade Stops At | Reason |
|----------|-------------------------|--------|
| Entity not in any collection | Tree root (no parent_pi) | No permissions to check |
| Entity in single collection, user is editor | Collection root | Normal case |
| Entity in nested collections, user is editor of inner only | Inner collection root | Permission boundary |
| Entity in nested collections, user is editor of both | Outer collection root | Full access |
| User specifies `stop_at_pi` | Specified PI (if has permission) | User preference |
| User specifies `stop_at_pi` but lacks permission there | Nearest accessible ancestor | Permission boundary |

---

## Not Included (Future Work)

1. **React hooks** - Keep in separate package or add later
2. **Collection root change** - Already in CollectionsClient
3. **Batch editing** - Not in current edit-sdk
4. **Batch permission endpoint** - Optimize later if needed

---

## Questions to Resolve

1. **Reprocess status endpoint**: Is it `/api/status/:batch_id` or different?
   - **Status:** Need to verify - the reprocess API returns `status_url` pointing to orchestrator

2. **Upload endpoint**: Confirm `/upload` exists on IPFS Wrapper
   - **Status:** Need to verify during Phase 3

3. **Orchestrator proxy**: Do we need to proxy orchestrator for status polling?
   - **Status:** Need to verify - may need to add gateway route or parse batch_id from status_url

These can be verified during Phase 3 implementation.

---

## Known Issues

### Parent-child relationships not set for ingested entities

Entities created via the ingest pipeline have `children_pi` arrays but **no `parent_pi` back-references**. This breaks cascade because the resolver walks up via `parent_pi`.

**Example:**
```
SDK Integration Test Collection:
- Root: 01KC7J0HWBP57RNZY12JRDH8TV (has children_pi)
- Child: 01KC7J0HEYE5XM8YMK60HFQCJT (parent_pi: null) ← BROKEN

Permission Test Collection:
- Root: 01K9CRZD8NTJP2KV14X12RCGPT (has children_pi)
- Child: 01K9CRZDV5KR6DGYH1TB87XKS5 (parent_pi: set correctly) ← WORKS
```

**Root cause:** The orchestrator/ingest pipeline sets `children_pi` on parents but doesn't set `parent_pi` on children. The IPFS wrapper's `appendVersionHandler` does set bidirectional links when using `children_pi_add`.

**Fix options:**
1. Fix ingest pipeline to set `parent_pi` on children when creating relationships
2. Run migration script to backfill `parent_pi` for existing entities
3. Have cascade also traverse via `children_pi` arrays (expensive, not recommended)

**Status:** Being addressed separately.
