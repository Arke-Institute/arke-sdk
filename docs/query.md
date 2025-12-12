# query package

HTTP client for search and queries. Business logic in Query Links and Query Translator workers.

Independent (no dependencies on other packages).

## API

```typescript
// Direct path query (must know syntax)
const results = await arke.query.path(
  '"Hawaii" -[depicts]-> type:person',
  { k: 20 }
);

// Natural language (LLM translates and executes)
const nlResults = await arke.query.natural(
  'Who are the people in photographs from Hawaii?'
);
console.log('Generated query:', nlResults.translation.path);

// Translate only (no execution)
const translated = await arke.query.translate(
  'Find photographers connected to Alice Austen'
);
console.log('Path query:', translated.path);

// Validate/parse a query
const parsed = await arke.query.parse('"test" -[*]-> type:person');

// Get syntax documentation
const syntax = await arke.query.syntax();

// Collection search (uses lineage filtering)
const collResults = await arke.query.path(
  '"family portraits" type:photograph',
  {
    lineage: { sourcePi: 'collection-uuid', direction: 'descendants' }
  }
);
```

## Query Methods

| Method | Use Case | Gateway Route | Backend |
|--------|----------|---------------|---------|
| `path()` | Direct path query syntax | `POST /query/path` | query-links |
| `natural()` | NL question → execute | `POST /query/natural` | query-translator |
| `translate()` | NL → path query only | `POST /query/translate` | query-translator |
| `parse()` | Validate query syntax | `GET /query/parse` | query-links |
| `syntax()` | Get syntax documentation | `GET /query/syntax` | query-links |

## Gateway Routes (Public - No Auth Required)

```
POST /query/path        # Execute path query (query-links)
POST /query/natural     # NL → translate + execute (query-translator)
POST /query/translate   # NL → path query only (query-translator)
GET  /query/parse       # Validate/parse query syntax (query-links)
GET  /query/syntax      # Get syntax documentation (query-links)
GET  /query/health      # Health check (query-links)
```

## Path Query Syntax

### Entry Points

| Syntax | Description | Supports Hops |
|--------|-------------|---------------|
| `"text"` | Semantic search | Yes |
| `@canonical_id` | Exact entity lookup | Yes |
| `type:X ~ "text"` | Type + semantic | Yes |
| `type:X` | Type filter only | No (zero-hop only) |

### Edge Traversal

| Syntax | Description |
|--------|-------------|
| `-[*]->` | Outgoing edge, any relation |
| `<-[*]-` | Incoming edge, any relation |
| `<-[*]->` | Bidirectional edge |
| `-[term]->` | Fuzzy relation match (single-hop only) |
| `-[term1, term2]->` | Match ANY terms (single-hop only) |

### Variable Depth

| Syntax | Description |
|--------|-------------|
| `-[*]{1,4}->` | 1 to 4 hops |
| `-[*]{,4}->` | Up to 4 hops (shorthand) |
| `-[*]{2,}->` | 2+ hops (capped at 4) |
| `-[*]{3}->` | Exactly 3 hops |

### Filters

| Syntax | Description |
|--------|-------------|
| `type:person` | Filter by type |
| `type:file,document` | Multiple types (OR) |
| `type:X ~ "text"` | Type + semantic ranking |
| `@canonical_id` | Exact entity match |
| `"text"` | Semantic search |

## Types

```typescript
// Path query request
interface PathQueryRequest {
  path: string;           // The path query
  k?: number;             // Results to return (default: 5)
  k_explore?: number;     // Beam width (default: k * 3)
  lineage?: LineageFilter;
  enrich?: boolean;       // Fetch content (default: false)
  enrich_limit?: number;  // Max chars (default: 2000)
}

interface LineageFilter {
  sourcePi: string;
  direction: 'ancestors' | 'descendants' | 'both';
}

// Natural language request
interface NaturalQueryRequest {
  query: string;          // Natural language question
  custom_instructions?: string;
  k?: number;
  k_explore?: number;
  lineage?: LineageFilter;
  enrich?: boolean;
  enrich_limit?: number;
}

// Query result
interface QueryResult {
  results: Result[];
  metadata: QueryMetadata;
}

interface Result {
  entity: Entity;
  path: PathStep[];
  score: number;
}

interface Entity {
  canonical_id: string;
  label: string;
  type: string;
  properties: Record<string, any>;
  source_pis: string[];
  content?: EnrichedContent;
}

interface QueryMetadata {
  query: string;
  hops: number;
  k: number;
  k_explore: number;
  total_candidates_explored: number;
  execution_time_ms: number;
  error?: string;
  reason?: string;
  lineage?: LineageMetadata;
}

// Natural language result extends QueryResult
interface NaturalQueryResult extends QueryResult {
  translation: {
    path: string;
    explanation: string;
    tokens_used: number;
    cost_usd: number;
    attempts?: number;
    validation_errors?: Array<{ path: string; error: string }>;
  };
}

// Translate-only result
interface TranslateResult {
  path: string;
  explanation: string;
  tokens_used: number;
  cost_usd: number;
}
```

## Examples

```typescript
// Find people connected to Alice Austen
await arke.query.path('"alice austen" -[*]{,4}-> type:person');

// Find photographers (semantic ranking)
await arke.query.path('"alice austen" -[*]{,4}-> type:person ~ "photographer"');

// Exact entity lookup
await arke.query.path('@6a9dbb57-9096-4753-a0e6-26299324161f -[*]{,4}-> type:file');

// Zero-hop search
await arke.query.path('"Washington" type:person');

// With lineage filtering (collection scope)
await arke.query.path('"letters" type:document', {
  lineage: { sourcePi: 'arke:my_collection', direction: 'descendants' }
});

// Natural language
await arke.query.natural('Who are the photographers in the Alice Austen collection?');
```

## Constraints

- Entry points with hops must be semantic, exact ID, or type+semantic (not type-only)
- Every hop must end with a target filter
- Variable-depth queries must use wildcard `[*]`, not fuzzy relations
- Maximum depth is 4 hops
- Fuzzy relation matching only works on single-hop queries
