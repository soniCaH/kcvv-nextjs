# Schema Migration Agent

**Type:** Autonomous Code Generation Agent
**Purpose:** Fetch Drupal entity data and generate complete Effect Schema ecosystem

## Overview

This agent connects to your Drupal JSON:API, fetches sample data, analyzes structure, and automatically generates Effect Schemas with TypeScript types, mappers, tests, and API client methods.

## When to Use

Invoke this agent when you need to:

- Generate Effect Schemas from Drupal entities
- Create schemas for new content types
- Update existing schemas after Drupal changes
- Generate complete schema ecosystem (schema + mapper + tests + API methods)
- Discover and document Drupal API structure

## What This Agent Does

### 1. API Discovery

- Connects to Drupal JSON:API
- Fetches sample data for entity types
- Analyzes field structure and types
- Identifies relationships
- Maps Drupal field types to TypeScript/Effect types

### 2. Schema Generation

- Creates Effect Schema with proper types
- Handles optional vs required fields
- Generates nested schemas for complex fields
- Creates reusable sub-schemas
- Adds JSDoc documentation

### 3. Mapper Creation

- Generates JSON:API normalization functions
- Handles relationship flattening
- Creates type-safe mappers
- Adds error handling

### 4. API Client Methods

- Generates DrupalAPI class methods
- Adds Effect-based error handling
- Implements caching strategy
- Creates query builders for filters

### 5. Test Generation

- Creates Vitest test suites
- Generates test fixtures
- Tests schema validation
- Tests mapper functions
- Tests API methods (with mocks)

### 6. Documentation

- Updates schema registry
- Adds usage examples
- Documents field mappings
- Updates drupal-api-analyzer skill

## Agent Workflow

```
1. Receive entity type (e.g., "node/article")
2. Fetch sample data from Drupal API
3. Analyze structure:
   - Identify all fields
   - Infer types
   - Detect relationships
   - Find nested structures
4. Generate Effect Schema
5. Generate TypeScript types
6. Generate mapper functions
7. Generate API client methods
8. Generate Vitest tests
9. Update schema registry
10. Return completion report
```

## Input Format

Invoke with entity type:

```
Generate schema for node/article
Create schema for taxonomy_term/category
Migrate schema for node/team
Update schema for node/player
```

Or with API URL:

```
Generate schema from https://api.kcvvelewijt.be/jsonapi/node/sponsor
```

## Output Format

The agent creates multiple files and returns a report:

````markdown
# Schema Generation Report: [Entity Type]

## Files Created

✅ src/lib/effect/schemas/[entity].schema.ts
✅ src/lib/mappers/[entity].mapper.ts
✅ src/lib/effect/schemas/**tests**/[entity].schema.test.ts
✅ src/lib/mappers/**tests**/[entity].mapper.test.ts

## API Methods Added

✅ DrupalAPI.get[Entity](id: string)
✅ DrupalAPI.get[Entity]s(options?: QueryOptions)

## Schema Structure

### Fields Detected (12)

- id: string (required)
- title: string (required)
- created: number (required) - Unix timestamp
- changed: number (required) - Unix timestamp
- body: ProcessedTextSchema (optional)
- field_image: ImageSchema (optional)
- field_category: Schema.String (optional) - relationship
- field_tags: Schema.Array(Schema.String) (optional) - relationship
- field_published: boolean (required)
- path: PathSchema (required)

### Relationships (2)

- field_category → taxonomy_term/category
- field_tags → taxonomy_term/tags

### Reusable Schemas Created

- ProcessedTextSchema (already exists)
- ImageSchema (already exists)
- PathSchema (newly created)

## Sample Data

[JSON sample used for generation]

## Generated Code Preview

```typescript
// src/lib/effect/schemas/article.schema.ts
export const ArticleSchema = Schema.Struct({
  id: Schema.String,
  title: Schema.String,
  // ... rest of schema
});

export type Article = Schema.Schema.Type<typeof ArticleSchema>;
```
````

## Next Steps

1. Review generated schema
2. Run tests: npm run test -- article.schema
3. Test API method: DrupalAPI.getArticle("test-id")
4. Add to your components

## Validation

✅ All tests pass
✅ TypeScript compiles without errors
✅ Schema added to registry
✅ Documentation updated

````

## Configuration

### Type Inference Rules

```json
{
  "typeMapping": {
    "string": "Schema.String",
    "number": "Schema.Number",
    "boolean": "Schema.Boolean",
    "object": "Schema.Struct",
    "array": "Schema.Array"
  },
  "drupalPatterns": {
    "created|changed": "Schema.Number (timestamp)",
    "body": "ProcessedTextSchema",
    "field_image": "ImageSchema",
    "path": "PathSchema"
  }
}
````

### Nullable Handling

- Fields with null in sample → `Schema.optional()`
- Required fields → Direct schema
- Empty arrays → `Schema.Array()` (not optional)

## Examples

### Example 1: News Article

```
Input: "Generate schema for node/article"

Agent Actions:
1. Fetches: https://api.kcvvelewijt.be/jsonapi/node/article?page[limit]=1
2. Analyzes 12 fields
3. Creates ArticleSchema with nested schemas
4. Generates mapper with relationship handling
5. Creates API methods with includes
6. Generates comprehensive tests
7. Updates schema registry

Output:
- article.schema.ts (45 lines)
- article.mapper.ts (30 lines)
- Tests (60 lines)
- API methods added to DrupalAPI class
```

### Example 2: Taxonomy Term

```
Input: "Generate schema for taxonomy_term/category"

Agent Actions:
1. Fetches category data
2. Simple structure detected
3. Creates CategorySchema
4. Generates mapper
5. Creates tests

Output:
- category.schema.ts (15 lines)
- category.mapper.ts (10 lines)
- Tests (30 lines)
```

## Common Drupal Field Patterns

### Body Field (Processed Text)

```typescript
export const ProcessedTextSchema = Schema.Struct({
  value: Schema.String,
  processed: Schema.String,
  format: Schema.optional(Schema.String),
});
```

### Image Field

```typescript
export const ImageSchema = Schema.Struct({
  url: Schema.String,
  alt: Schema.optional(Schema.String),
  title: Schema.optional(Schema.String),
  width: Schema.optional(Schema.Number),
  height: Schema.optional(Schema.Number),
});
```

### Path Field

```typescript
export const PathSchema = Schema.Struct({
  alias: Schema.String,
  langcode: Schema.String,
});
```

### Taxonomy Reference

```typescript
// Simple reference (ID only)
field_category: Schema.optional(Schema.String);

// Full term (with include)
field_category: Schema.optional(CategorySchema);
```

## Mapper Generation

Generated mappers normalize JSON:API format:

```typescript
export function mapArticle(jsonApiData: any): unknown {
  return {
    id: jsonApiData.id,
    ...jsonApiData.attributes,
    // Flatten relationships
    field_category: jsonApiData.relationships?.field_category?.data?.id,
    field_tags:
      jsonApiData.relationships?.field_tags?.data?.map((t: any) => t.id) || [],
  };
}
```

## API Method Generation

```typescript
static getArticle(id: string, include?: string[]) {
  const params = include ? `?include=${include.join(',')}` : ''

  return HttpClient.get(`${this.baseUrl}/node/article/${id}${params}`).pipe(
    Effect.map(response => mapArticle(response.data)),
    Effect.flatMap(data => Schema.decode(ArticleSchema)(data)),
    Effect.catchAll(error =>
      Effect.fail(new DrupalAPIError({
        entity: "article",
        id,
        cause: error
      }))
    )
  )
}

static getArticles(options?: ArticleQueryOptions) {
  const params = buildQueryParams(options)

  return HttpClient.get(`${this.baseUrl}/node/article?${params}`).pipe(
    Effect.map(response => response.data.map(mapArticle)),
    Effect.flatMap(data => Schema.decode(Schema.Array(ArticleSchema))(data)),
  )
}
```

## Test Generation

```typescript
describe("ArticleSchema", () => {
  it("should decode valid article data", () => {
    const validData = {
      id: "123",
      title: "Test Article",
      created: 1234567890,
      // ... complete fixture
    };

    const result = Schema.decodeSync(ArticleSchema)(validData);
    expect(result).toEqual(validData);
  });

  it("should fail on invalid data", () => {
    const invalidData = { id: 123 }; // id should be string

    expect(() => Schema.decodeSync(ArticleSchema)(invalidData)).toThrow();
  });
});

describe("mapArticle", () => {
  it("should normalize JSON:API format", () => {
    const jsonApiData = {
      id: "123",
      attributes: { title: "Test" },
      relationships: { field_category: { data: { id: "cat-1" } } },
    };

    const result = mapArticle(jsonApiData);
    expect(result.field_category).toBe("cat-1");
  });
});
```

## Integration with Other Agents

After this agent completes:

1. Use **component-migrator** to build components using the schema
2. Use **quality-reviewer** to validate schema correctness

## Error Handling

The agent handles:

- API connection failures (retries, clear error messages)
- Invalid JSON responses (reports and suggests fixes)
- Missing fields (creates optional fields)
- Unknown types (defaults to Schema.Unknown with warning)
- Relationship errors (documents in report)

## Limitations

- Requires live Drupal API access
- Sample data must be representative
- Cannot infer business logic (only structure)
- Relationships require manual review for includes
- Custom field types may need manual adjustment

## Advanced Features

### Relationship Includes

When generating schemas for entities with relationships, the agent can:

1. Detect all relationships
2. Check if related schema exists
3. Generate related schemas if needed
4. Create separate schemas for "with includes" vs "without includes"

```typescript
// Base schema (references only)
export const ArticleSchema = Schema.Struct({
  field_category: Schema.optional(Schema.String), // ID only
});

// Full schema (with includes)
export const ArticleWithRelationsSchema = Schema.Struct({
  ...ArticleSchema.fields,
  field_category: Schema.optional(CategorySchema), // Full object
});
```

### Schema Evolution

The agent can update existing schemas:

```
Update schema for node/article
```

This will:

1. Compare current schema with API
2. Identify new/changed/removed fields
3. Suggest migration strategy
4. Update schema while preserving customizations
5. Update tests

## Configuration File

Create `.claude/agents/schema-migrator/config.json`:

```json
{
  "apiBaseUrl": "https://api.kcvvelewijt.be/jsonapi",
  "schemasPath": "src/lib/effect/schemas",
  "mappersPath": "src/lib/mappers",
  "testsPath": "__tests__",
  "generateTests": true,
  "generateMappers": true,
  "updateApiClient": true,
  "updateRegistry": true
}
```
