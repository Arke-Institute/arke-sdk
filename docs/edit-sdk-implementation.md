# Edit SDK Implementation Plan

## Overview

Add `src/edit/` package to arke-sdk, migrating from arke-edit-sdk with adaptations for gateway URLs.

## Package Structure

```
src/edit/
├── index.ts           # Public exports
├── client.ts          # EditClient - API communication
├── session.ts         # EditSession - stateful workflow
├── diff.ts            # DiffEngine - text diffing (copy from edit-sdk)
├── prompts.ts         # PromptBuilder - AI prompts (copy from edit-sdk)
├── errors.ts          # Custom error classes
└── types.ts           # All type definitions
```

## Key Changes from arke-edit-sdk

| arke-edit-sdk | arke-sdk/edit |
|---------------|---------------|
| `ipfsWrapperUrl` + `reprocessApiUrl` | Single `gatewayUrl` |
| `ArkeClient` | `EditClient` |
| `ArkeEditSDK` | Factory method in `EditClient` |
| `statusUrlTransform` option | Not needed (extract batch_id internally) |
| Separate error classes | Consistent with SDK patterns |

## URL Mapping

| Operation | Gateway Route | Auth |
|-----------|---------------|------|
| Get entity | `GET /api/entities/{pi}` | No |
| Get content | `GET /api/cat/{cid}` | No |
| Upload content | `POST /api/upload` | Yes |
| Update entity | `POST /api/entities/{pi}/versions` | Yes |
| Reprocess | `POST /reprocess/reprocess` | Yes |
| Reprocess status | Poll `status_url` directly | No |

## Implementation Steps

### Step 1: Create types.ts

Copy types from arke-edit-sdk with simplifications:
- Remove `ArkeClientConfig` (replaced by `EditClientConfig`)
- Remove `statusUrlTransform` (handled internally)
- Keep all entity, edit, diff, prompt, and reprocess types

### Step 2: Create errors.ts

```typescript
export class EditError extends Error {
  constructor(message: string, public code: string, public details?: unknown) {
    super(message);
    this.name = 'EditError';
  }
}

export class EntityNotFoundError extends EditError { ... }
export class CASConflictError extends EditError { ... }
export class ReprocessError extends EditError { ... }
```

### Step 3: Create diff.ts

Direct copy from arke-edit-sdk - pure utility with `diff` npm dependency.

Key methods:
- `diff(original, modified)` - Line-level diff
- `diffWords(original, modified)` - Word-level diff
- `createComponentDiff(name, orig, mod)` - Create ComponentDiff
- `formatForPrompt(diffs)` - Format for AI

### Step 4: Create prompts.ts

Direct copy from arke-edit-sdk - pure string generation.

Key methods:
- `buildAIPrompt(prompt, component, context, content)`
- `buildEditReviewPrompt(diffs, corrections, component, instructions)`
- `buildCascadePrompt(basePrompt, context)`
- `buildCombinedPrompt(general, specific, component)`
- `buildCorrectionPrompt(corrections)`
- `getComponentGuidance(component)`

### Step 5: Create client.ts

New implementation using gateway URLs:

```typescript
export interface EditClientConfig {
  gatewayUrl: string;
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
  async getReprocessStatus(statusUrl: string): Promise<ReprocessStatus>

  // Session factory
  createSession(pi: string, config?: EditSessionConfig): EditSession

  // Auth management
  setAuthToken(token?: string): void
}
```

**Key differences from arke-edit-sdk:**
- Single `gatewayUrl` for all requests
- Routes mapped: `/api/*` for IPFS, `/reprocess/*` for reprocess API
- Status polling uses full `status_url` from reprocess response (no transform needed)

### Step 6: Create session.ts

Adapt from arke-edit-sdk with these changes:
- Constructor takes `EditClient` instead of `ArkeClient`
- Internal state management unchanged
- Methods unchanged (setPrompt, setContent, addCorrection, setScope, etc.)

Key workflow:
1. `load()` - Fetch entity and priority components
2. Configure: `setPrompt()` / `setContent()` / `addCorrection()` / `setScope()`
3. Preview: `getDiff()` / `previewPrompt()` / `getChangeSummary()`
4. Execute: `submit(note)` → save edits + trigger reprocess
5. Wait: `waitForCompletion(options)` with polling

### Step 7: Create index.ts

```typescript
// Client
export { EditClient, type EditClientConfig } from './client';

// Session
export { EditSession } from './session';

// Utilities
export { DiffEngine } from './diff';
export { PromptBuilder } from './prompts';

// Errors
export { EditError, EntityNotFoundError, CASConflictError, ReprocessError } from './errors';

// Types
export type {
  // Config
  EditMode,
  EditSessionConfig,
  // Entity
  Entity,
  EntityUpdate,
  EntityVersion,
  // Edit
  RegeneratableComponent,
  EditScope,
  Correction,
  // Diff
  DiffType,
  TextDiff,
  ComponentDiff,
  // Prompt
  PromptTarget,
  EntityContext,
  CascadeContext,
  CustomPrompts,
  // Reprocess
  ReprocessRequest,
  ReprocessResult,
  ReprocessPhase,
  ReprocessProgress,
  ReprocessStatus,
  // Result
  SaveResult,
  EditResult,
  EditPhase,
  EditStatus,
  PollOptions,
  ChangeSummary,
} from './types';
```

### Step 8: Update main SDK exports

Add to `src/index.ts`:

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
} from './edit';
export type {
  EditMode,
  EditSessionConfig,
  Entity as EditEntity,  // Avoid conflict with query Entity
  EntityUpdate,
  EntityVersion,
  RegeneratableComponent,
  EditScope,
  Correction,
  DiffType,
  TextDiff,
  ComponentDiff,
  PromptTarget,
  EntityContext,
  CascadeContext,
  ReprocessRequest,
  ReprocessResult,
  ReprocessPhase,
  ReprocessProgress,
  ReprocessStatus,
  SaveResult,
  EditResult,
  EditPhase,
  EditStatus,
  PollOptions,
  ChangeSummary,
} from './edit';
```

### Step 9: Update package.json

Add `diff` dependency and export path:

```json
{
  "dependencies": {
    "diff": "^5.2.0",
    "multiformats": "^13.4.1"
  },
  "exports": {
    "./edit": {
      "types": "./dist/edit/index.d.ts",
      "import": "./dist/edit/index.js",
      "require": "./dist/edit/index.cjs"
    }
  }
}
```

### Step 10: Update tsup.config.ts

Add edit entry point:

```typescript
entry: [
  'src/index.ts',
  'src/collections/index.ts',
  'src/upload/index.ts',
  'src/query/index.ts',
  'src/edit/index.ts',  // NEW
],
```

## Usage Example

```typescript
import { EditClient } from '@arke-institute/sdk';
// or
import { EditClient } from '@arke-institute/sdk/edit';

const edit = new EditClient({
  gatewayUrl: 'https://gateway.arke.institute',
  authToken: 'your-jwt-token',
});

// Create session for AI-prompt mode
const session = edit.createSession('01K9CRZDV5KR6DGYH1TB87XKS5', {
  mode: 'ai-prompt',
});

// Load entity
await session.load();

// Set AI prompt
session.setPrompt('description', 'Improve the description with more historical context');

// Configure scope
session.setScope({
  components: ['description'],
  cascade: true,  // Will cascade to collection root
});

// Preview changes
const summary = session.getChangeSummary();
console.log('Will regenerate:', summary.willRegenerate);
console.log('Will cascade:', summary.willCascade);

// Submit
const result = await session.submit('Improved description with AI');

// Wait for completion
await session.waitForCompletion({
  pollInterval: 3000,
  timeout: 300000,
  onProgress: (status) => console.log('Status:', status.phase),
});
```

## Not Included

1. **React hooks** - Keep separate (arke-edit-sdk/react can still be used)
2. **Pre-flight permission check** - Backend enforces permissions, just handle 403
3. **statusUrlTransform** - Not needed with current orchestrator setup

## Dependencies

- `diff@^5.2.0` - Text diffing library (small, well-maintained)

## Testing Plan

1. Unit tests for DiffEngine (pure functions)
2. Unit tests for PromptBuilder (pure functions)
3. Integration tests for EditClient against gateway
4. Session workflow tests with mocked client

## File Sizes (Estimated)

| File | Lines |
|------|-------|
| types.ts | ~250 |
| errors.ts | ~40 |
| diff.ts | ~200 |
| prompts.ts | ~250 |
| client.ts | ~250 |
| session.ts | ~450 |
| index.ts | ~60 |
| **Total** | ~1,500 |
