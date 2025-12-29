# Drupal JSON:API Analyzer Skill

This skill enables Claude to analyze KCVV Elewijt's Drupal JSON:API and automatically generate Effect Schemas.

## API Base URL

`https://api.kcvvelewijt.be/jsonapi`

## Available Endpoints

### Content Types

- `/node/article` - News articles
- `/node/page` - Static pages
- `/node/team` - Team information
- `/node/player` - Player profiles
- `/taxonomy_term/category` - Article categories
- `/taxonomy_term/tags` - Tags

### Custom Endpoints (Footbalisto)

- `https://footbalisto.be/matches/next` - Next match data
- `https://footbalisto.be/matches/results` - Match results
- `https://footbalisto.be/ranking` - League rankings

## Automatic Schema Generation Process

When Claude encounters an unknown Drupal entity type:

### Step 1: Fetch Sample Data

```typescript
const sampleUrl = `https://api.kcvvelewijt.be/jsonapi/${entityType}?page[limit]=1`;
const response = await fetch(sampleUrl);
const sample = await response.json();
```

### Step 2: Analyze Structure

```typescript
function analyzeJsonApiStructure(data: any) {
  const attributes = data.data[0].attributes;
  const relationships = data.data[0].relationships;

  return {
    attributes: Object.entries(attributes).map(([key, value]) => ({
      name: key,
      type: inferType(value),
      nullable: value === null,
    })),
    relationships: Object.keys(relationships || {}),
  };
}
```

### Step 3: Generate Effect Schema

```typescript
function generateEffectSchema(analysis: Analysis) {
  const fields = analysis.attributes.map((attr) => {
    const baseType = typeMapping[attr.type];
    return attr.nullable
      ? `${attr.name}: Schema.optional(${baseType})`
      : `${attr.name}: ${baseType}`;
  });

  return `
export const ${entityName}Schema = Schema.Struct({
  ${fields.join(",\n  ")}
})

export type ${entityName} = Schema.Schema.Type<typeof ${entityName}Schema>
  `;
}
```

### Step 4: Create API Client Method

```typescript
static get${EntityName}(id: string) {
  return HttpClient.get(\`\${this.baseUrl}/node/${entity_type}/\${id}\`).pipe(
    Effect.map(response => response.data.attributes),
    Effect.flatMap(data => Schema.decode(${EntityName}Schema)(data)),
    Effect.catchAll(error =>
      Effect.fail(new DrupalAPIError({ entity: "${entity_type}", cause: error }))
    )
  )
}
```

## Type Inference Rules

### Primitive Types

- `string` → `Schema.String`
- `number` → `Schema.Number`
- `boolean` → `Schema.Boolean`
- `null` → `Schema.Null`

### Complex Types

- `{ processed: string }` → `Schema.Struct({ processed: Schema.String })`
- `Array<T>` → `Schema.Array(T)`
- `{ url: string, alt?: string }` → Media object schema

### Drupal-Specific Patterns

- **Timestamp fields** (created, changed) → `Schema.Number` (Unix timestamp)
- **Body fields** → `Schema.Struct({ processed: Schema.String, value: Schema.optional(Schema.String) })`
- **Image fields** → `ImageSchema` (see below)
- **Taxonomy terms** → `TaxonomyTermSchema`

## Common Drupal Schemas

### Image Field

```typescript
export const DrupalImageSchema = Schema.Struct({
  url: Schema.String,
  alt: Schema.optional(Schema.String),
  title: Schema.optional(Schema.String),
  width: Schema.optional(Schema.Number),
  height: Schema.optional(Schema.Number),
});
```

### Processed Text Field

```typescript
export const ProcessedTextSchema = Schema.Struct({
  value: Schema.String,
  processed: Schema.String,
  format: Schema.optional(Schema.String),
});
```

### Taxonomy Term Reference

```typescript
export const TaxonomyTermRefSchema = Schema.Struct({
  id: Schema.String,
  name: Schema.String,
  weight: Schema.optional(Schema.Number),
});
```

## Example: Auto-Generate News Article Schema

**Input:** `https://api.kcvvelewijt.be/jsonapi/node/article`

**Generated Schema:**

```typescript
// src/schemas/news-article.schema.ts
import { Schema } from "effect";

export const NewsArticleSchema = Schema.Struct({
  id: Schema.String,
  title: Schema.String,
  created: Schema.Number,
  changed: Schema.Number,
  body: Schema.Struct({
    value: Schema.String,
    processed: Schema.String,
    format: Schema.optional(Schema.String),
  }),
  field_image: Schema.optional(
    Schema.Struct({
      url: Schema.String,
      alt: Schema.optional(Schema.String),
      width: Schema.optional(Schema.Number),
      height: Schema.optional(Schema.Number),
    }),
  ),
  field_category: Schema.optional(
    Schema.Struct({
      id: Schema.String,
      name: Schema.String,
    }),
  ),
  field_tags: Schema.Array(
    Schema.Struct({
      id: Schema.String,
      name: Schema.String,
    }),
  ),
  field_published: Schema.Boolean,
  path: Schema.Struct({
    alias: Schema.String,
    langcode: Schema.String,
  }),
});

export type NewsArticle = Schema.Schema.Type<typeof NewsArticleSchema>;
```

**Generated API Method:**

```typescript
// src/lib/drupal-api.ts
export class DrupalAPI {
  static getArticle(id: string) {
    return HttpClient.get(`${this.baseUrl}/node/article/${id}`).pipe(
      Effect.map((response) => this.normalizeJsonApi(response.data)),
      Effect.flatMap((data) => Schema.decode(NewsArticleSchema)(data)),
      Effect.catchAll((error) =>
        Effect.fail(
          new DrupalAPIError({ entity: "article", id, cause: error }),
        ),
      ),
    );
  }

  static getArticles(options?: ArticleQueryOptions) {
    const params = this.buildQueryParams(options);
    return HttpClient.get(`${this.baseUrl}/node/article?${params}`).pipe(
      Effect.map((response) => response.data.map(this.normalizeJsonApi)),
      Effect.flatMap((data) =>
        Schema.decode(Schema.Array(NewsArticleSchema))(data),
      ),
    );
  }
}
```

## JSON:API Normalization

Drupal's JSON:API returns data in a specific format that needs normalization:

```typescript
function normalizeJsonApi(jsonApiData: any) {
  return {
    id: jsonApiData.id,
    ...jsonApiData.attributes,
    // Flatten relationships
    ...(jsonApiData.relationships &&
      Object.fromEntries(
        Object.entries(jsonApiData.relationships).map(([key, rel]: any) => [
          key,
          rel.data,
        ]),
      )),
  };
}
```

## Relationship Includes

When fetching with relationships:

```typescript
const url = `${baseUrl}/node/article/${id}?include=field_image,field_category,field_tags`;

// Schema should handle nested data
export const NewsArticleWithRelationsSchema = Schema.Struct({
  ...NewsArticleSchema.fields,
  field_image: Schema.optional(FullImageSchema), // Full image object, not just reference
  field_category: Schema.optional(FullCategorySchema),
});
```

## Caching Strategy

```typescript
export class DrupalAPI {
  private static cache = new Map<string, { data: any; timestamp: number }>();
  private static CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  static getCached<T>(key: string, fetcher: Effect.Effect<T, any, any>) {
    return Effect.gen(function* (_) {
      const cached = DrupalAPI.cache.get(key);
      if (cached && Date.now() - cached.timestamp < DrupalAPI.CACHE_TTL) {
        return cached.data as T;
      }

      const fresh = yield* _(fetcher);
      DrupalAPI.cache.set(key, { data: fresh, timestamp: Date.now() });
      return fresh;
    });
  }
}
```

## Error Handling

```typescript
export class DrupalAPIError extends Data.TaggedError("DrupalAPIError")<{
  entity: string;
  id?: string;
  cause: unknown;
}> {}

export class NotFoundError extends Data.TaggedError("NotFoundError")<{
  entity: string;
  id: string;
}> {}

export class ValidationError extends Data.TaggedError("ValidationError")<{
  entity: string;
  errors: Schema.ParseError;
}> {}
```

## Testing Generated Schemas

```typescript
import { describe, it, expect } from "vitest";

describe("NewsArticleSchema", () => {
  it("should validate valid article data", () => {
    const validArticle = {
      id: "123",
      title: "Test Article",
      created: 1234567890,
      changed: 1234567890,
      body: { value: "Test", processed: "<p>Test</p>" },
      field_published: true,
      path: { alias: "/test", langcode: "nl" },
      field_tags: [],
    };

    const result = Schema.decodeSync(NewsArticleSchema)(validArticle);
    expect(result).toEqual(validArticle);
  });

  it("should fail on invalid data", () => {
    const invalidArticle = { id: 123 }; // id should be string

    expect(() =>
      Schema.decodeSync(NewsArticleSchema)(invalidArticle),
    ).toThrow();
  });
});
```

## Auto-Documentation

When a new schema is generated, Claude should also create:

1. Schema file in `/src/schemas/`
2. API method in `/src/lib/drupal-api.ts`
3. TypeScript types export
4. Vitest test file
5. Update this skill documentation
6. Add to schema registry

## Schema Registry

```typescript
// src/schemas/index.ts
export * from "./news-article.schema";
export * from "./team.schema";
export * from "./player.schema";
export * from "./match.schema";

export const DRUPAL_SCHEMAS = {
  "node/article": NewsArticleSchema,
  "node/team": TeamSchema,
  "node/player": PlayerSchema,
  "taxonomy_term/category": CategorySchema,
} as const;
```

## When to Regenerate Schemas

- New field added to Drupal content type
- Field type changed in Drupal
- New content type added
- Relationship structure changed
- API response format updated

Claude should detect schema mismatches and offer to regenerate schemas automatically.
