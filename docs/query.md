# query package

HTTP client for search and queries. Business logic in Query Links and Query Translator workers.

Independent (no dependencies on other packages).

## API

```typescript
// Direct path query (must know syntax)
const results = await arke.query.path(
  '"Hawaii" -[depicts]-> type:person',
  { limit: 20 }
);

// Natural language (LLM translates)
const nlResults = await arke.query.natural(
  'Who are the people in photographs from Hawaii?'
);
console.log('Generated query:', nlResults.generatedQuery);

// Collection search
const collResults = await arke.query.searchCollection(
  'collection-uuid',
  'family portraits',
  { entityTypes: ['photograph'] }
);
```

## Three Query Methods

| Method | Use Case | Backend |
|--------|----------|---------|
| `path()` | Direct path query syntax | Query Links |
| `natural()` | Natural language question | Query Translator → Query Links |
| `searchCollection()` | Search within collection | Query Links |

## Gateway Routes

```
POST /query/execute     # Path query (query-links)
POST /translate/query   # NL to path query (query-translator)
```

## Path Query Syntax

```
"text"              # Semantic search
@pi:canonical_id    # Exact PI match
-[term]->           # Outgoing edge
<-[term]-           # Incoming edge
-[*]{1,4}->         # Variable depth
type:person         # Filter by type
~ "hint"            # Ranking hint
```

## Types

```typescript
interface QueryResult {
  results: Entity[];
  totalCount: number;
  truncated: boolean;
}

interface NaturalQueryResult extends QueryResult {
  generatedQuery: string;
  confidence?: number;
}

interface QueryOptions {
  limit?: number;
  offset?: number;
  enrich?: boolean;
}

interface CollectionSearchOptions extends QueryOptions {
  entityTypes?: string[];
}
```
