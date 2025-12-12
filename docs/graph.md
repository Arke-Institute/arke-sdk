# graph package

HTTP client for read-only entity relationships from GraphDB Gateway service.

Independent (no dependencies on other packages).

## API

```typescript
import { GraphClient } from '@arke-institute/sdk/graph';

const graph = new GraphClient({
  gatewayUrl: 'https://gateway.arke.institute',
});

// Entity operations
const entity = await graph.getEntity('uuid-123');
const exists = await graph.entityExists('uuid-123');
const results = await graph.queryByCode('person_john');
const entities = await graph.lookupByCode('alice_austen', 'person');

// PI-based operations
const fromPi = await graph.listEntitiesFromPi('01K75HQQXNTDG7BBP7PS9AWYAN');
const withRels = await graph.getEntitiesWithRelationships('01K75HQQXNTDG7BBP7PS9AWYAN');
const lineage = await graph.getLineage('01K75HQQXNTDG7BBP7PS9AWYAN', 'both');

// Relationship operations
const relationships = await graph.getRelationships('uuid-123');

// Path finding
const paths = await graph.findPaths(['uuid-1'], ['uuid-2'], { max_depth: 4 });
const reachable = await graph.findReachable(['uuid-event'], 'person', { max_depth: 3 });
```

## Gateway Routes

All public (no auth required):

```
GET  /graphdb/entity/:id                     # Get entity by ID
GET  /graphdb/entity/exists/:id              # Check entity exists
POST /graphdb/entity/query                   # Query by code
POST /graphdb/entities/list                  # List from PI(s)
POST /graphdb/entities/lookup-by-code        # Find by code
POST /graphdb/pi/entities-with-relationships # Get entities with relationships
POST /graphdb/pi/lineage                     # Get lineage
GET  /graphdb/relationships/:id              # Get relationships
POST /graphdb/paths/between                  # Find paths
POST /graphdb/paths/reachable                # Find reachable entities
```

## Types

```typescript
interface GraphEntity {
  canonical_id: string;
  code: string;
  label: string;
  type: string;
  properties?: Record<string, unknown>;
  created_by_pi?: string;
  source_pis?: string[];
}

interface Relationship {
  direction: 'outgoing' | 'incoming';
  predicate: string;
  target_id: string;
  target_code: string;
  target_label: string;
  target_type: string;
  properties?: Record<string, unknown>;
  source_pi?: string;
  created_at?: string;
}

interface EntityWithRelationships extends GraphEntity {
  relationships: Relationship[];
}

interface PathEdge {
  subject_id: string;
  subject_label: string;
  subject_type: string;
  predicate: string;
  object_id: string;
  object_label: string;
  object_type: string;
  source_pi?: string;
}

interface Path {
  source_id: string;
  target_id: string;
  length: number;
  edges: PathEdge[];
}

interface PathOptions {
  max_depth?: number;
  direction?: 'outgoing' | 'incoming' | 'both';
  limit?: number;
}

interface ReachableOptions {
  max_depth?: number;
  direction?: 'outgoing' | 'incoming' | 'both';
  limit?: number;
}

interface LineageResponse {
  source_pi: string;
  ancestors?: LineageEntry[];
  descendants?: LineageEntry[];
}
```

## Error Handling

```typescript
import {
  GraphError,
  GraphEntityNotFoundError,
  NoPathFoundError
} from '@arke-institute/sdk/graph';

try {
  const entity = await graph.getEntity('invalid-uuid');
} catch (err) {
  if (err instanceof GraphEntityNotFoundError) {
    console.log('Entity not found:', err.details.canonicalId);
  }
}
```

## Use Cases

### Get all entities from a PI with their relationships

```typescript
const entities = await graph.getEntitiesWithRelationships('01K75HQQXNTDG7BBP7PS9AWYAN');

entities.forEach(entity => {
  console.log(`${entity.label} (${entity.type})`);
  entity.relationships.forEach(rel => {
    const dir = rel.direction === 'outgoing' ? '->' : '<-';
    console.log(`  ${dir} [${rel.predicate}] ${rel.target_label}`);
  });
});
```

### Find paths between two entities

```typescript
const paths = await graph.findPaths(
  ['uuid-alice-austen'],
  ['uuid-photography'],
  { max_depth: 4, direction: 'both' }
);

paths.forEach(path => {
  console.log(`Path (${path.length} hops):`);
  path.edges.forEach(edge => {
    console.log(`  ${edge.subject_label} -[${edge.predicate}]-> ${edge.object_label}`);
  });
});
```

### Find all people reachable from an event

```typescript
const people = await graph.findReachable(
  ['uuid-event-123'],
  'person',
  { max_depth: 3, limit: 50 }
);

console.log(`Found ${people.length} people connected to this event`);
```
