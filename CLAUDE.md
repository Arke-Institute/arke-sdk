# CLAUDE.md

This file provides guidance to Claude Code when working with this SDK.

## Project Overview

This is `@arke-institute/sdk` v2.0.0 - a TypeScript SDK auto-generated from the Arke v1 OpenAPI spec using `openapi-typescript` + `openapi-fetch`.

## Key Commands

```bash
npm run generate        # Fetch spec from production + generate types
npm run generate:local  # Fetch spec from localhost:8787 + generate types
npm run build           # Build with tsup
npm test                # Run tests
npm run typecheck       # TypeScript validation
npm run publish-all     # Generate + test + build + publish
```

## Architecture

```
arke-sdk-v2/
├── scripts/           # Generation scripts
│   ├── fetch-spec.ts  # Fetches OpenAPI spec from arke_v1
│   └── generate.ts    # Runs openapi-typescript to generate types
├── openapi/           # Committed spec snapshot
│   ├── spec.json      # OpenAPI 3.1 spec
│   └── version.json   # Spec version metadata
├── src/
│   ├── generated/     # AUTO-GENERATED - DO NOT EDIT
│   │   └── types.ts   # Types from openapi-typescript
│   ├── client/        # Client wrapper
│   │   ├── ArkeClient.ts
│   │   ├── config.ts
│   │   └── errors.ts
│   └── operations/    # High-level operations (TODOs)
└── tests/             # Unit tests
```

## Workflow

When API changes:
1. Deploy arke_v1: `cd ../arke_v1 && npm run deploy`
2. Regenerate SDK: `npm run generate`
3. Run tests: `npm test`
4. Publish: `npm run publish-all`

## Key Files

| File | Purpose |
|------|---------|
| `src/generated/types.ts` | Auto-generated types (DO NOT EDIT) |
| `src/client/ArkeClient.ts` | Main client class |
| `src/client/errors.ts` | Error classes and parsing |
| `openapi/spec.json` | Committed OpenAPI spec snapshot |

## Important Notes

- **Never edit `src/generated/types.ts`** - it's auto-generated
- Types are generated with `pathParamsAsTypes: false` to avoid index signature conflicts
- The `arke.api` property exposes the raw openapi-fetch client with full type safety
- Operations in `src/operations/` are placeholders for future high-level utilities
