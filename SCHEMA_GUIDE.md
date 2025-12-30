# Effect Schema Guide - Drupal JSON:API

**Purpose:** Reference guide for creating and validating Effect Schemas for Drupal data
**Last Updated:** December 2025

---

## 📖 Table of Contents

1. [Overview](#overview)
2. [Core Principles](#core-principles)
3. [Type Inference Rules](#type-inference-rules)
4. [Common Drupal Patterns](#common-drupal-patterns)
5. [JSONAPI Common Types](#jsonapi-common-types)
6. [Best Practices](#best-practices)
7. [Schema Validation Checklist](#schema-validation-checklist)
8. [Testing Requirements](#testing-requirements)
9. [Common Pitfalls](#common-pitfalls)
10. [Implementation History](#implementation-history)

---

## Overview

### What is Effect Schema?

Effect Schema is a library for runtime validation and type inference. It ensures data from Drupal's JSON:API matches expected TypeScript types.

### Why Use Effect Schema?

**Runtime Safety:**

- Validates API responses at runtime
- Catches breaking changes from Drupal
- Prevents `undefined` errors in production

**Type Safety:**

- Auto-generates TypeScript types from schemas
- No manual type definitions needed
- Types always match runtime validation

**Better Than Manual Parsing:**

```typescript
// ❌ BAD: Manual parsing (no validation)
const article = response.data as Article;

// ✅ GOOD: Effect Schema (validated)
const article = await Schema.decode(ArticleSchema)(response.data);
```

---

## Core Principles

### 1. NO S.Unknown

**Never use `S.Unknown`** - it's equivalent to TypeScript's `any`.

❌ **BAD:**

```typescript
field_related_content: S.optional(S.Unknown);
```

✅ **GOOD:**

```typescript
field_related_content: S.optional(
  S.Struct({
    data: S.Array(DrupalNodeReference),
  }),
);
```

### 2. NO any Types

Especially in helper functions:

❌ **BAD:**

```typescript
const mapIncluded = (data: any[], included: any[]) => {};
```

✅ **GOOD:**

```typescript
const mapIncluded = (
  data: readonly Article[],
  included: readonly ArticleIncludedResource[],
): readonly Article[] => {};
```

### 3. Use Discriminated Unions

For JSON:API `included` arrays:

✅ **GOOD:**

```typescript
export const ArticleIncludedResource = S.Union(
  MediaImage, // type: 'media--image'
  File, // type: 'file--file'
  TaxonomyTerm, // type: 'taxonomy_term--*'
  DrupalResource, // Fallback for unknown types
);
```

TypeScript can narrow types based on the `type` field:

```typescript
if (item.type === "media--image") {
  // TypeScript knows item is MediaImage
}
```

### 4. Prefer Specific Types Over Broad

❌ **BAD:**

```typescript
type: S.String; // Could be anything
```

✅ **GOOD:**

```typescript
type: S.Literal("media--image"); // Exact type
// OR
type: S.Union(
  S.Literal("taxonomy_term--tags"),
  S.Literal("taxonomy_term--categories"),
);
```

---

## Type Inference Rules

### Primitive Types

| Drupal Type | Effect Schema             |
| ----------- | ------------------------- |
| `string`    | `S.String`                |
| `number`    | `S.Number`                |
| `boolean`   | `S.Boolean`               |
| `null`      | `S.Null` or `S.NullOr(T)` |

### Drupal-Specific Patterns

#### Timestamps

```typescript
created: S.Number; // Unix timestamp
changed: S.Number; // Unix timestamp

// Or with date conversion:
created: S.DateFromString;
```

#### Body/Processed Text Fields

```typescript
body: S.Struct({
  value: S.String, // Raw HTML
  processed: S.String, // Processed HTML
  format: S.optional(S.String), // Text format (e.g., 'full_html')
});
```

#### Image Fields

```typescript
field_image: S.optional(
  S.Struct({
    url: S.String,
    alt: S.optional(S.String),
    title: S.optional(S.String),
    width: S.optional(S.Number),
    height: S.optional(S.Number),
  }),
);
```

#### Path/URL Fields

```typescript
path: S.Struct({
  alias: S.String, // e.g., '/news/article-title'
  langcode: S.String, // e.g., 'nl'
});
```

#### Taxonomy Terms

```typescript
field_tags: S.optional(
  S.Struct({
    data: S.Array(
      S.Union(
        TaxonomyTerm, // Fully resolved
        DrupalTermReference, // Just reference (id + type)
      ),
    ),
  }),
);
```

### Null vs Undefined

**Important:** Drupal often returns `null` instead of omitting fields.

❌ **BAD:**

```typescript
description: S.optional(S.String); // Expects undefined or string
```

✅ **GOOD:**

```typescript
description: S.NullOr(S.String); // Handles null from Drupal
// OR
description: S.optional(S.NullOr(S.String)); // Can be undefined, null, or string
```

### Complex Types

#### Arrays

```typescript
tags: S.Array(S.String);
items: S.Array(ItemSchema);
```

#### Nested Objects

```typescript
media: S.Struct({
  id: S.String,
  type: S.Literal("media--image"),
  attributes: MediaImageAttributes,
  relationships: S.optional(MediaImageRelationships),
});
```

---

## Common Drupal Patterns

### File Entity

```typescript
export class FileUri extends S.Class<FileUri>("FileUri")({
  url: S.String,
}) {}

export class FileAttributes extends S.Class<FileAttributes>("FileAttributes")({
  drupal_internal__fid: S.optional(S.Number),
  filename: S.optional(S.String),
  uri: FileUri,
  filemime: S.optional(S.String),
  filesize: S.optional(S.Number),
  created: S.optional(S.DateFromString),
  changed: S.optional(S.DateFromString),
}) {}

export class File extends S.Class<File>("File")({
  id: S.String,
  type: S.Literal("file--file"),
  attributes: FileAttributes,
}) {}
```

### Media Entity

```typescript
export class MediaImageAttributes extends S.Class<MediaImageAttributes>(
  "MediaImageAttributes",
)({
  drupal_internal__mid: S.optional(S.Number),
  name: S.optional(S.String),
  created: S.optional(S.DateFromString),
  changed: S.optional(S.DateFromString),
  status: S.optional(S.Boolean),
}) {}

export class MediaImage extends S.Class<MediaImage>("MediaImage")({
  id: S.String,
  type: S.Literal("media--image"),
  attributes: MediaImageAttributes,
  relationships: S.Struct({
    field_media_image: S.optional(
      S.Struct({
        data: S.optional(
          S.Struct({
            id: S.String,
            type: S.Literal("file--file"),
          }),
        ),
      }),
    ),
  }),
}) {}
```

### Taxonomy Term

```typescript
export class TaxonomyTermAttributes extends S.Class<TaxonomyTermAttributes>(
  "TaxonomyTermAttributes",
)({
  drupal_internal__tid: S.optional(S.Number),
  name: S.String,
  description: S.optional(S.NullOr(S.String)), // Note: NullOr
  weight: S.optional(S.Number),
  path: S.optional(DrupalPath),
}) {}

export class TaxonomyTerm extends S.Class<TaxonomyTerm>("TaxonomyTerm")({
  id: S.String,
  type: S.String, // Can be various vocabularies
  attributes: TaxonomyTermAttributes,
  relationships: S.optional(
    S.Struct({
      parent: S.optional(
        S.Struct({
          data: S.Array(DrupalTermReference),
        }),
      ),
    }),
  ),
}) {}
```

---

## JSONAPI Common Types

### Version Object

```typescript
export class JsonApiVersion extends S.Class<JsonApiVersion>("JsonApiVersion")({
  version: S.String,
  meta: S.optional(S.Unknown), // Vendor-specific, can stay Unknown
}) {}
```

### Links Object

```typescript
export class JsonApiLink extends S.Class<JsonApiLink>("JsonApiLink")({
  href: S.String,
  meta: S.optional(S.Unknown),
}) {}

export class JsonApiLinks extends S.Class<JsonApiLinks>("JsonApiLinks")({
  self: S.optional(JsonApiLink),
  next: S.optional(JsonApiLink),
  prev: S.optional(JsonApiLink),
  first: S.optional(JsonApiLink),
  last: S.optional(JsonApiLink),
}) {}
```

### Resource Base

```typescript
export class DrupalResource extends S.Class<DrupalResource>("DrupalResource")({
  id: S.String,
  type: S.String,
  attributes: S.optional(S.Unknown), // Varies by type
  relationships: S.optional(S.Unknown), // Varies by type
  links: S.optional(S.Unknown),
}) {}
```

Use `DrupalResource` as a **fallback** in discriminated unions.

---

## Best Practices

### 1. Create Separate Schema Files

**File structure:**

```text
src/lib/effect/schemas/
├── common.schema.ts       # Shared types (JsonApiLinks, etc.)
├── file.schema.ts         # File entities
├── media.schema.ts        # Media entities
├── taxonomy.schema.ts     # Taxonomy terms
├── article.schema.ts      # Article content type
├── team.schema.ts         # Team content type
└── index.ts              # Export all schemas
```

### 2. Use S.Class for Entities

```typescript
export class Article extends S.Class<Article>("Article")({
  id: S.String,
  type: S.Literal("node--article"),
  attributes: ArticleAttributes,
  relationships: S.optional(ArticleRelationships),
}) {}

export type Article = S.Schema.Type<typeof Article>;
```

Benefits:

- Auto-generates TypeScript type
- Clear entity structure
- Easy to extend

### 3. Create Discriminated Unions

For `included` arrays in JSON:API responses:

```typescript
export const ArticleIncludedResource = S.Union(
  MediaImage,
  File,
  TaxonomyTerm,
  DrupalResource, // Always include fallback
);

export class ArticlesResponse extends S.Class<ArticlesResponse>(
  "ArticlesResponse",
)({
  data: S.Array(Article),
  included: S.optional(S.Array(ArticleIncludedResource)),
  jsonapi: S.optional(JsonApiVersion),
  links: S.optional(JsonApiLinks),
}) {}
```

### 4. Add JSDoc Comments

```typescript
/**
 * File entity from Drupal
 * Represents uploaded files (images, PDFs, etc.)
 */
export class File extends S.Class<File>("File")({
  /** Unique identifier */
  id: S.String,

  /** Always 'file--file' for file entities */
  type: S.Literal("file--file"),

  /** File metadata and URL */
  attributes: FileAttributes,
}) {}
```

### 5. Export Types

```typescript
// article.schema.ts
export class Article extends S.Class<Article>("Article")({
  /* ... */
}) {}
export type Article = S.Schema.Type<typeof Article>;

// index.ts
export * from "./article.schema";
export * from "./file.schema";
export * from "./media.schema";
```

Usage:

```typescript
import { Article, ArticleSchema } from "@/lib/effect/schemas";
```

---

## Schema Validation Checklist

Before committing a new schema, verify:

### Type Safety

- [ ] No `S.Unknown` (except vendor-specific meta fields)
- [ ] No `any` types in helper functions
- [ ] All relationships properly typed
- [ ] Discriminated unions for included resources
- [ ] Literal types for `type` fields where possible

### Drupal Compatibility

- [ ] Handles `null` values (use `S.NullOr` where needed)
- [ ] Timestamp fields are `S.Number` or `S.DateFromString`
- [ ] Processed text fields have `value` and `processed`
- [ ] Path fields have `alias` and `langcode`
- [ ] Internal IDs are optional (drupal_internal\_\_\*)

### Documentation

- [ ] JSDoc comments on classes
- [ ] Prop descriptions for complex fields
- [ ] Exported TypeScript type
- [ ] Added to schema index

### Testing

- [ ] Test file created (`*.schema.test.ts`)
- [ ] Valid data parsing test
- [ ] Invalid data rejection test
- [ ] Real Drupal example test
- [ ] Null handling test (if applicable)

---

## Testing Requirements

### Minimum Test Coverage

Every schema needs:

```typescript
import { describe, it, expect } from "vitest";
import { Schema } from "effect";

describe("ArticleSchema", () => {
  it("parses valid article data", () => {
    const validArticle = {
      id: "123",
      type: "node--article",
      attributes: {
        title: "Test Article",
        created: "2025-01-15T10:00:00Z",
        /* ... */
      },
    };

    const result = Schema.decodeSync(ArticleSchema)(validArticle);
    expect(result).toEqual(validArticle);
  });

  it("rejects invalid data", () => {
    const invalidArticle = {
      id: 123, // Should be string
      type: "wrong-type",
    };

    expect(() => Schema.decodeSync(ArticleSchema)(invalidArticle)).toThrow();
  });

  it("parses real Drupal response", () => {
    const drupalResponse = {
      /* Paste actual JSON:API response */
    };

    expect(() =>
      Schema.decodeSync(ArticleSchema)(drupalResponse),
    ).not.toThrow();
  });
});
```

### Test Real Responses

**Always test with actual Drupal JSON:API responses:**

1. Fetch from API: `curl https://api.kcvvelewijt.be/jsonapi/node/article/123`
2. Copy response to test
3. Verify schema parses it

This catches:

- Missing optional fields
- Unexpected null values
- Different field types than expected

---

## Common Pitfalls

### 1. Forgetting NullOr for Drupal Fields

❌ **PROBLEM:**

```typescript
description: S.optional(S.String);
```

Drupal returns: `{ description: null }`
Result: **Schema validation fails**

✅ **SOLUTION:**

```typescript
description: S.optional(S.NullOr(S.String));
```

### 2. Using S.Unknown for Relationships

❌ **PROBLEM:**

```typescript
field_related_content: S.optional(S.Unknown);
```

✅ **SOLUTION:**

```typescript
field_related_content: S.optional(
  S.Struct({
    data: S.Array(DrupalNodeReference),
  }),
);
```

### 3. Not Handling Included Resources

❌ **PROBLEM:**

```typescript
included: S.optional(S.Array(S.Unknown));
```

✅ **SOLUTION:**

```typescript
included: S.optional(S.Array(ArticleIncludedResource));

// Where ArticleIncludedResource is:
export const ArticleIncludedResource = S.Union(
  MediaImage,
  File,
  TaxonomyTerm,
  DrupalResource,
);
```

### 4. Loose Type in Helper Functions

❌ **PROBLEM:**

```typescript
const mapIncluded = (data: any[], included: any[]) => {};
```

✅ **SOLUTION:**

```typescript
const mapIncluded = (
  data: readonly Article[],
  included: readonly ArticleIncludedResource[],
): readonly Article[] => {};
```

### 5. Not Testing Null Handling

❌ **PROBLEM:**
Only testing with complete data.

✅ **SOLUTION:**

```typescript
it("handles null description", () => {
  const articleWithNullDesc = {
    ...validArticle,
    attributes: {
      ...validArticle.attributes,
      description: null, // ← Test this
    },
  };

  expect(() =>
    Schema.decodeSync(ArticleSchema)(articleWithNullDesc),
  ).not.toThrow();
});
```

---

## Implementation History

### Original Issues (2025-01-20)

Found in codebase before cleanup:

- 7 occurrences of `S.Unknown`
- Multiple `any` types in DrupalService
- Loose types in relationships
- No discriminated unions for included resources

### What Was Fixed

1. **Created new schema files:**
   - `file.schema.ts` (59 tests)
   - `media.schema.ts` (59 tests)
   - `taxonomy.schema.ts` (59 tests)
   - `common.schema.test.ts` (59 tests)

2. **Added JSON:API common types:**
   - `JsonApiVersion`
   - `JsonApiLink` / `JsonApiLinks`
   - `DrupalResource`

3. **Updated article.schema.ts:**
   - Replaced all `S.Unknown` with proper types
   - Created `ArticleIncludedResource` discriminated union
   - Properly typed all relationships

4. **Fixed DrupalService.ts:**
   - Changed `links: any` → `links: JsonApiLinks | undefined`
   - Typed `mapIncluded` function parameters
   - Added type guards for discriminated unions

5. **Added 236 tests** with comprehensive coverage

### Results

- ✅ Zero `S.Unknown` in article schemas (except DrupalResource fallback)
- ✅ Zero `any` types in DrupalService
- ✅ Full type safety with discriminated unions
- ✅ Runtime validation for all included entities
- ✅ Self-documenting code with JSDoc comments

---

## When to Create New Schemas

Create a new schema when:

- Adding a new Drupal content type
- Adding a new Drupal entity type (users, comments, etc.)
- Drupal API structure changes
- New JSON:API relationships added

---

## Resources

### Files

- Schemas: `src/lib/effect/schemas/`
- Tests: `src/lib/effect/schemas/*.test.ts`
- Service: `src/lib/effect/services/DrupalService.ts`

### Documentation

- [Effect Schema](https://effect.website/docs/schema/introduction)
- [Drupal JSON:API](https://www.drupal.org/docs/core-modules-and-themes/core-modules/jsonapi-module)

---

**Last Updated:** December 2025
**Maintainer:** KCVV Development Team
