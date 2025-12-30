# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is `@arke-institute/sdk` - a TypeScript SDK auto-generated from the Arke v1 OpenAPI spec using `openapi-typescript` + `openapi-fetch`. The SDK provides type-safe access to the Arke API for entity management, relationships, files, and collections.

## Key Commands

```bash
npm run generate        # Fetch spec from production + generate types
npm run generate:local  # Fetch spec from localhost:8787 + generate types
npm run build           # Build with tsup (outputs dist/)
npm test                # Run vitest tests
npm run test:watch      # Run tests in watch mode
npm run typecheck       # TypeScript validation
npm run publish-all     # Full release: generate → test → build → publish
```

## Architecture

**Generation Pipeline:**
1. `scripts/fetch-spec.ts` fetches OpenAPI spec from arke_v1 → `openapi/spec.json`
2. `scripts/generate.ts` runs openapi-typescript → `src/generated/types.ts`
3. `ArkeClient` wraps openapi-fetch client with the generated `paths` type

**Key Design Decisions:**
- Types generated with `pathParamsAsTypes: false` to avoid index signature conflicts
- `arke.api` exposes raw openapi-fetch client (GET, POST, PUT, DELETE methods)
- Error classes (`CASConflictError`, `NotFoundError`, etc.) parse API responses into typed errors
- Test network uses `X-Arke-Network: test` header (entities get 'II' prefix IDs)

**Upload Module (`src/operations/upload/`):**
- `types.ts` - UploadTree, UploadFile, UploadOptions interfaces
- `cid.ts` - CIDv1 computation using multiformats (raw codec + SHA-256)
- `engine.ts` - Core upload logic: scan → compute CIDs → create entities → upload → link
- `scanners.ts` - Platform helpers: `scanDirectory` (Node.js), `scanFileSystemEntries`/`scanFileList` (browser)

Upload flow:
1. Scan input to build `UploadTree` (files + folders with relative paths)
2. Compute CIDs for all files in parallel
3. Create all folder entities (with collection, no parent yet)
4. Create all file entities (get presigned upload URLs)
5. Upload file content to presigned URLs
6. Bulk link children to parents using `/folders/{id}/children/bulk`

## Workflow

**When API changes:**
1. Deploy arke_v1: `cd ../arke_v1 && npm run deploy`
2. Regenerate SDK: `npm run generate`
3. Run tests: `npm test`
4. Publish: `npm run publish-all`

**Local development against arke_v1:**
1. Start arke_v1 locally: `cd ../arke_v1 && npm run dev`
2. Regenerate from local: `npm run generate:local`

## Critical Rules

- **Never edit `src/generated/types.ts`** - it's auto-generated and will be overwritten
- The committed `openapi/spec.json` is the source of truth for SDK types
- The `multiformats` package is used for CID computation - uses raw codec (0x55) + SHA-256
