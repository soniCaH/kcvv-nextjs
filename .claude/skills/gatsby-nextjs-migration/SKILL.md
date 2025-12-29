# Gatsby to Next.js Migration Skill

This skill helps Claude Code migrate Gatsby pages to Next.js 15+ with ISR, Effect Schema, and best practices for KCVV Elewijt.

## Core Patterns

### 1. GraphQL to Effect Data Fetching

**Gatsby Pattern:**

```typescript
export const query = graphql`
  query NewsArticle($id: String!) {
    drupal {
      nodeById(id: $id) {
        ... on Drupal_NodeArticle {
          title
          body {
            processed
          }
          fieldImage {
            url
          }
        }
      }
    }
  }
`;
```

**Next.js + Effect Pattern:**

```typescript
import { Effect, Schema } from "effect"
import { DrupalAPI } from "@/lib/drupal-api"

const NewsArticleSchema = Schema.Struct({
  id: Schema.String,
  title: Schema.String,
  body: Schema.Struct({
    processed: Schema.String
  }),
  fieldImage: Schema.optional(Schema.Struct({
    url: Schema.String
  }))
})

export async function generateStaticParams() {
  const articles = await DrupalAPI.getArticleIds().pipe(
    Effect.runPromise
  )
  return articles.map(id => ({ id }))
}

export default async function NewsArticlePage({
  params
}: {
  params: { id: string }
}) {
  const article = await DrupalAPI.getArticle(params.id).pipe(
    Effect.flatMap(data => Schema.decode(NewsArticleSchema)(data)),
    Effect.runPromise
  )

  return <ArticleLayout article={article} />
}

export const revalidate = 3600 // ISR: revalidate every hour
```

### 2. Drupal JSON:API Integration

**API Client Pattern:**

```typescript
import { Effect, HttpClient } from "effect";

export class DrupalAPI {
  static baseUrl = "https://api.kcvvelewijt.be/jsonapi";

  static getArticle(id: string) {
    return HttpClient.get(`${this.baseUrl}/node/article/${id}`).pipe(
      Effect.map((response) => response.data.attributes),
      Effect.catchAll((error) =>
        Effect.fail(new DrupalAPIError({ cause: error })),
      ),
    );
  }

  static getArticles(filters?: ArticleFilters) {
    const params = new URLSearchParams();
    if (filters?.category)
      params.set("filter[field_category]", filters.category);

    return HttpClient.get(`${this.baseUrl}/node/article?${params}`).pipe(
      Effect.map((response) => response.data),
    );
  }
}
```

### 3. Component Migration

**Gatsby Component:**

```typescript
import { graphql } from "gatsby"

export const NewsCard = ({ article }) => (
  <div>
    <h2>{article.title}</h2>
    <GatsbyImage image={article.fieldImage} alt={article.title} />
  </div>
)
```

**Next.js + Shadcn Component:**

```typescript
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import Image from "next/image"

interface NewsCardProps {
  article: Schema.Schema.Type<typeof NewsArticleSchema>
}

export function NewsCard({ article }: NewsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{article.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {article.fieldImage && (
          <Image
            src={article.fieldImage.url}
            alt={article.title}
            width={800}
            height={600}
            className="rounded-lg"
          />
        )}
      </CardContent>
    </Card>
  )
}
```

### 4. Static Generation Patterns

**Pages with Dynamic Routes:**

```typescript
// app/teams/[slug]/page.tsx
export async function generateStaticParams() {
  const teams = await DrupalAPI.getTeams().pipe(
    Effect.runPromise
  )

  return teams.map(team => ({
    slug: team.slug
  }))
}

export default async function TeamPage({
  params
}: {
  params: { slug: string }
}) {
  const team = await DrupalAPI.getTeam(params.slug).pipe(
    Effect.flatMap(data => Schema.decode(TeamSchema)(data)),
    Effect.catchTag("ParseError", error =>
      Effect.fail(new NotFoundError({ teamSlug: params.slug }))
    ),
    Effect.runPromise
  )

  return <TeamLayout team={team} />
}

// ISR with on-demand revalidation
export const revalidate = 3600
export const dynamicParams = true
```

### 5. Image Optimization

**Gatsby Image → Next.js Image:**

```typescript
// Before (Gatsby)
<GatsbyImage image={getImage(data.file)} alt="..." />

// After (Next.js)
<Image
  src={data.file.url}
  alt="..."
  width={800}
  height={600}
  sizes="(max-width: 768px) 100vw, 800px"
  priority={false}
  className="rounded-lg"
/>
```

## Migration Checklist for Each Page

- [ ] Identify Gatsby page and corresponding Next.js route
- [ ] Convert GraphQL query to Effect-based data fetching
- [ ] Create Effect Schema for data validation
- [ ] Implement `generateStaticParams` for dynamic routes
- [ ] Set appropriate ISR revalidation time
- [ ] Migrate Gatsby components to Shadcn equivalents
- [ ] Update image handling (GatsbyImage → next/image)
- [ ] Add TypeScript types (use Effect Schema types)
- [ ] Create Storybook stories for components
- [ ] Write Vitest unit tests
- [ ] Add Playwright visual regression tests
- [ ] Update MIGRATION_PLAN.md
- [ ] Create GitHub issue for tracking
- [ ] Test on local dev server
- [ ] Verify ISR behavior

## Common Pitfalls

1. **Schema Validation**: Always use `Schema.decode` instead of manual parsing
2. **Error Handling**: Use Effect's error handling, don't catch errors manually
3. **ISR Configuration**: Set `revalidate` and `dynamicParams` appropriately
4. **Image Sizes**: Always specify width/height for next/image
5. **Metadata**: Don't forget to add generateMetadata for SEO

## Testing Strategy

### Unit Tests (Vitest)

```typescript
import { describe, it, expect } from "vitest";
import { DrupalAPI } from "@/lib/drupal-api";

describe("DrupalAPI.getArticle", () => {
  it("should fetch and parse article correctly", async () => {
    const article = await DrupalAPI.getArticle("test-id").pipe(
      Effect.runPromise,
    );
    expect(article).toHaveProperty("title");
  });
});
```

### Visual Tests (Playwright)

```typescript
import { test, expect } from "@playwright/test";

test("news page renders correctly", async ({ page }) => {
  await page.goto("/nieuws");
  await expect(page).toHaveScreenshot();
});
```

## Drupal JSON:API Helpers

### Common Field Mappings

- `body.processed` → HTML content
- `field_image.url` → Image URL
- `field_category` → Category taxonomy
- `field_tags` → Tags taxonomy
- `created` → Unix timestamp
- `changed` → Unix timestamp (last modified)

### Relationship Loading

```typescript
// Include relationships in request
const url = `${baseUrl}/node/article/${id}?include=field_image,field_category`;
```

## Effect Patterns

### Composing API Calls

```typescript
const getArticleWithCategory = (id: string) =>
  Effect.all([DrupalAPI.getArticle(id), DrupalAPI.getCategories()]).pipe(
    Effect.map(([article, categories]) => ({
      ...article,
      category: categories.find((c) => c.id === article.categoryId),
    })),
  );
```

### Error Recovery

```typescript
const getArticleOrFallback = (id: string) =>
  DrupalAPI.getArticle(id).pipe(
    Effect.catchTag("NotFoundError", () => Effect.succeed(defaultArticle)),
  );
```

## Auto-Generated Schemas

When Claude encounters a new Drupal entity type, it should:

1. Fetch sample data from API
2. Generate Effect Schema from structure
3. Create TypeScript types
4. Add to schema registry
5. Update this skill with the new pattern

## Current KCVV Schemas

See `/src/schemas/` for:

- `news-article.schema.ts`
- `team.schema.ts`
- `player.schema.ts`
- `match.schema.ts`
- `sponsor.schema.ts`
- `ranking.schema.ts`
