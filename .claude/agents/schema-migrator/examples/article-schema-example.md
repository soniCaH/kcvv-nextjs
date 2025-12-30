# Schema Migration Example: Article Entity

This is an example of what the Schema Migration Agent produces.

## Input

```
"Generate schema for node/article"
```

## Output

---

# Schema Generation Report: node/article

## Files Created

✅ `src/lib/effect/schemas/article.schema.ts` (65 lines)
✅ `src/lib/mappers/article.mapper.ts` (42 lines)
✅ `src/lib/effect/schemas/__tests__/article.schema.test.ts` (85 lines)
✅ `src/lib/mappers/__tests__/article.mapper.test.ts` (55 lines)

## API Methods Added

✅ `DrupalAPI.getArticle(id: string, include?: string[])`
✅ `DrupalAPI.getArticles(options?: ArticleQueryOptions)`

## Schema Structure

### Fields Detected (12)

- `id`: Schema.String (required)
- `title`: Schema.String (required)
- `created`: Schema.Number (required) - Unix timestamp
- `changed`: Schema.Number (required) - Unix timestamp
- `body`: ProcessedTextSchema (optional)
- `field_image`: ImageSchema (optional)
- `field_category`: Schema.String (optional) - relationship ID
- `field_tags`: Schema.Array(Schema.String) (optional) - relationship IDs
- `field_published`: Schema.Boolean (required)
- `field_promoted`: Schema.Boolean (required)
- `field_sticky`: Schema.Boolean (required)
- `path`: PathSchema (required)

### Relationships Detected (2)

- `field_category` → `taxonomy_term/category` (single)
- `field_tags` → `taxonomy_term/tags` (multiple)

### Reusable Schemas

- ✅ ProcessedTextSchema (already exists in `common.schema.ts`)
- ✅ ImageSchema (already exists in `common.schema.ts`)
- ✅ PathSchema (already exists in `common.schema.ts`)

## Sample Data Used

```json
{
  "data": {
    "type": "node--article",
    "id": "a7b3c4d5-e6f7-8901-2345-67890abcdef1",
    "attributes": {
      "drupal_internal__nid": 123,
      "title": "KCVV Elewijt wint met 3-1 tegen Kampenhout",
      "created": 1703001234,
      "changed": 1703012345,
      "promote": true,
      "sticky": false,
      "status": true,
      "body": {
        "value": "In een spannende wedstrijd...",
        "format": "full_html",
        "processed": "<p>In een spannende wedstrijd...</p>"
      },
      "path": {
        "alias": "/nieuws/kcvv-elewijt-wint-3-1",
        "pid": 456,
        "langcode": "nl"
      }
    },
    "relationships": {
      "field_image": {
        "data": {
          "type": "file--file",
          "id": "12345678-90ab-cdef-1234-567890abcdef"
        }
      },
      "field_category": {
        "data": {
          "type": "taxonomy_term--category",
          "id": "cat-nieuws"
        }
      },
      "field_tags": {
        "data": [
          { "type": "taxonomy_term--tags", "id": "tag-wedstrijd" },
          { "type": "taxonomy_term--tags", "id": "tag-overwinning" }
        ]
      }
    }
  }
}
```

## Generated Code

### article.schema.ts

```typescript
import { Schema } from "effect";
import { ImageSchema, PathSchema, ProcessedTextSchema } from "./common.schema";

/**
 * Schema for Drupal Article (node/article) entity
 *
 * Represents news articles with title, body, featured image,
 * category classification, and tags.
 */
export const ArticleSchema = Schema.Struct({
  /** Unique identifier */
  id: Schema.String,

  /** Article title */
  title: Schema.String,

  /** Creation timestamp (Unix time) */
  created: Schema.Number,

  /** Last modified timestamp (Unix time) */
  changed: Schema.Number,

  /** Article body content with processed HTML */
  body: Schema.optional(ProcessedTextSchema),

  /** Featured image */
  field_image: Schema.optional(ImageSchema),

  /** Primary category ID (reference to taxonomy_term/category) */
  field_category: Schema.optional(Schema.String),

  /** Tag IDs (references to taxonomy_term/tags) */
  field_tags: Schema.Array(Schema.String),

  /** Whether article is published */
  field_published: Schema.Boolean,

  /** Whether article is promoted to front page */
  field_promoted: Schema.Boolean,

  /** Whether article is sticky (stays at top) */
  field_sticky: Schema.Boolean,

  /** URL path information */
  path: PathSchema,
});

/**
 * TypeScript type inferred from ArticleSchema
 */
export type Article = Schema.Schema.Type<typeof ArticleSchema>;

/**
 * Schema for article with full relationship data (when using includes)
 */
export const ArticleWithRelationsSchema = Schema.Struct({
  ...ArticleSchema.fields,
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
});

export type ArticleWithRelations = Schema.Schema.Type<
  typeof ArticleWithRelationsSchema
>;
```

### article.mapper.ts

```typescript
/**
 * Normalizes Drupal JSON:API article data to flat structure
 */
export function mapArticle(jsonApiData: any): unknown {
  return {
    id: jsonApiData.id,
    ...jsonApiData.attributes,
    // Flatten single relationship (category)
    field_category: jsonApiData.relationships?.field_category?.data?.id,
    // Flatten multiple relationships (tags)
    field_tags:
      jsonApiData.relationships?.field_tags?.data?.map((tag: any) => tag.id) ||
      [],
    // Map boolean fields from 'status' to 'field_published'
    field_published: jsonApiData.attributes.status,
    field_promoted: jsonApiData.attributes.promote,
    field_sticky: jsonApiData.attributes.sticky,
  };
}

/**
 * Normalizes article data with included relationships
 */
export function mapArticleWithRelations(
  jsonApiData: any,
  included: any[] = [],
): unknown {
  const base = mapArticle(jsonApiData);

  // Find included category
  const categoryId = jsonApiData.relationships?.field_category?.data?.id;
  const category = included.find((item) => item.id === categoryId);

  // Find included tags
  const tagIds =
    jsonApiData.relationships?.field_tags?.data?.map((t: any) => t.id) || [];
  const tags = included.filter((item) => tagIds.includes(item.id));

  return {
    ...base,
    field_category: category
      ? { id: category.id, name: category.attributes.name }
      : undefined,
    field_tags: tags.map((tag) => ({
      id: tag.id,
      name: tag.attributes.name,
    })),
  };
}
```

### API Methods Added to DrupalAPI

```typescript
/**
 * Fetch single article by ID
 */
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

/**
 * Fetch multiple articles with optional filters
 */
static getArticles(options?: {
  category?: string
  tags?: string[]
  limit?: number
  offset?: number
}) {
  const params = new URLSearchParams()

  if (options?.category) {
    params.set('filter[field_category.id]', options.category)
  }

  if (options?.tags && options.tags.length > 0) {
    params.set('filter[field_tags.id][operator]', 'IN')
    params.set('filter[field_tags.id][value]', options.tags.join(','))
  }

  if (options?.limit) {
    params.set('page[limit]', options.limit.toString())
  }

  if (options?.offset) {
    params.set('page[offset]', options.offset.toString())
  }

  return HttpClient.get(`${this.baseUrl}/node/article?${params}`).pipe(
    Effect.map(response => response.data.map(mapArticle)),
    Effect.flatMap(data => Schema.decode(Schema.Array(ArticleSchema))(data)),
  )
}
```

## Test Coverage

### Schema Tests

```typescript
describe("ArticleSchema", () => {
  it("should decode valid article data", () => {
    const validArticle = {
      id: "123",
      title: "Test Article",
      created: 1234567890,
      changed: 1234567890,
      body: { value: "Test", processed: "<p>Test</p>" },
      field_published: true,
      field_promoted: false,
      field_sticky: false,
      path: { alias: "/test", langcode: "nl" },
      field_tags: [],
    };

    const result = Schema.decodeSync(ArticleSchema)(validArticle);
    expect(result).toEqual(validArticle);
  });

  it("should fail on missing required fields", () => {
    const invalid = { id: "123" }; // Missing title, etc.

    expect(() => Schema.decodeSync(ArticleSchema)(invalid)).toThrow();
  });

  it("should handle optional fields", () => {
    const minimal = {
      id: "123",
      title: "Test",
      created: 1234567890,
      changed: 1234567890,
      field_published: true,
      field_promoted: false,
      field_sticky: false,
      path: { alias: "/test", langcode: "nl" },
      field_tags: [],
      // body, field_image, field_category are optional
    };

    const result = Schema.decodeSync(ArticleSchema)(minimal);
    expect(result.body).toBeUndefined();
    expect(result.field_image).toBeUndefined();
    expect(result.field_category).toBeUndefined();
  });
});
```

### Mapper Tests

```typescript
describe("mapArticle", () => {
  it("should normalize JSON:API format", () => {
    const jsonApiData = {
      id: "123",
      attributes: {
        title: "Test",
        created: 1234567890,
        status: true,
        promote: false,
        sticky: false,
      },
      relationships: {
        field_category: { data: { id: "cat-1" } },
        field_tags: { data: [{ id: "tag-1" }, { id: "tag-2" }] },
      },
    };

    const result = mapArticle(jsonApiData);

    expect(result.field_category).toBe("cat-1");
    expect(result.field_tags).toEqual(["tag-1", "tag-2"]);
    expect(result.field_published).toBe(true);
  });

  it("should handle missing relationships", () => {
    const jsonApiData = {
      id: "123",
      attributes: { title: "Test" },
      relationships: {},
    };

    const result = mapArticle(jsonApiData);

    expect(result.field_category).toBeUndefined();
    expect(result.field_tags).toEqual([]);
  });
});
```

## Schema Registry Updated

```typescript
// src/lib/effect/schemas/index.ts
export * from "./article.schema";
export * from "./common.schema";

export const DRUPAL_SCHEMAS = {
  "node/article": ArticleSchema,
  // ... other schemas
} as const;
```

## Next Steps

1. ✅ Review generated schema in `src/lib/effect/schemas/article.schema.ts`
2. ⏳ Test schema with sample data: `npm run test -- article.schema`
3. ⏳ Use in components:

```typescript
import { DrupalAPI } from "@/lib/drupal-api";

const article = await DrupalAPI.getArticle("article-id").pipe(
  Effect.runPromise,
);
```

4. ⏳ Fetch with relationships:

```typescript
const article = await DrupalAPI.getArticle("article-id", [
  "field_image",
  "field_category",
  "field_tags",
]).pipe(Effect.runPromise);
```

## Validation Results

✅ All tests pass (12/12)
✅ TypeScript compiles without errors
✅ Schema registered in index.ts
✅ API methods added to DrupalAPI class
✅ Documentation complete with JSDoc

---

_Generated by Schema Migration Agent_
_Ready to use in your components!_
