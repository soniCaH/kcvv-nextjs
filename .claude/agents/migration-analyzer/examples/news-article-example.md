# Migration Analysis Example: News Article Page

This is an example of what the Migration Analyzer Agent produces.

## Input

```
"Analyze the news article page for migration"
```

## Output

---

# Migration Analysis: News Article Page

## Summary

- **Complexity:** Medium
- **Estimated Effort:** 6-8 hours
- **Dependencies:** 3 components, 2 schemas
- **Blockers:** None

## Current Gatsby Implementation

### File Location

- Path: `src/pages/news/{DrupalNodeArticle.path}.tsx`
- Lines of code: 145
- Last modified: 2024-11-15

### GraphQL Queries

**Main Query:**

```graphql
query ArticleByPath($path: String!) {
  drupal {
    nodeByPath(path: $path) {
      ... on DrupalNodeArticle {
        id
        title
        created
        changed
        body {
          processed
        }
        fieldImage {
          url
          alt
          width
          height
        }
        fieldCategory {
          name
          path
        }
        fieldTags {
          name
        }
        fieldPublished
      }
    }
  }
}
```

**Related Articles Query:**

```graphql
query RelatedArticles($category: String!) {
  allDrupalNodeArticle(
    filter: { fieldCategory: { name: { eq: $category } } }
    limit: 3
  ) {
    nodes {
      id
      title
      path
      fieldImage {
        url
      }
    }
  }
}
```

### Components Used

- ✅ `ArticleHeader` (already migrated to Next.js)
- ❌ `ArticleContent` (needs migration)
- ❌ `RelatedArticles` (needs migration)
- ✅ `Layout` (already migrated to Next.js)

### Data Flow

1. Gatsby fetches article by path at build time
2. Related articles fetched based on category
3. Both queries combined in page component
4. Data passed to child components

### Styling

- CSS Modules: `article.module.css`
- Responsive breakpoints: mobile, tablet, desktop
- Custom animations for image gallery

## Next.js Target Architecture

### Proposed Structure

```
src/app/news/[slug]/
├── page.tsx              # Main page (Server Component)
├── loading.tsx           # Loading UI
└── error.tsx             # Error boundary

src/components/news/
├── ArticleLayout.tsx        # Main layout component
├── ArticleLayout.stories.tsx
├── ArticleLayout.test.tsx
├── ArticleContent.tsx       # Content component
├── ArticleContent.stories.tsx
├── ArticleContent.test.tsx
├── RelatedArticles.tsx      # Related articles
├── RelatedArticles.stories.tsx
└── RelatedArticles.test.tsx

src/lib/effect/schemas/
├── article.schema.ts     # Effect Schema
└── __tests__/
    └── article.schema.test.ts
```

### Required Schemas

- [x] ImageSchema (already exists in `common.schema.ts`)
- [ ] ArticleSchema (needs creation)
- [ ] CategorySchema (needs creation)
- [ ] TagSchema (needs creation)

**ArticleSchema structure:**

```typescript
{
  id: string
  title: string
  created: number (Unix timestamp)
  changed: number
  body: ProcessedTextSchema
  fieldImage?: ImageSchema
  fieldCategory?: CategorySchema
  fieldTags: TagSchema[]
  fieldPublished: boolean
  path: PathSchema
}
```

### Drupal API Endpoints

**Primary:**

- `GET /jsonapi/node/article/{id}`
- Include: `field_image,field_category,field_tags`

**Related Articles:**

- `GET /jsonapi/node/article?filter[field_category.id]={categoryId}&page[limit]=3`

### ISR Strategy

```typescript
export const revalidate = 3600; // 1 hour
export const dynamicParams = true;

// Rationale:
// - News articles change occasionally but not frequently
// - 1 hour revalidation balances freshness vs. performance
// - Dynamic params allows new articles without rebuild
```

**Static Path Generation:**

```typescript
export async function generateStaticParams() {
  // Generate for latest 50 articles at build time
  // Older articles generated on-demand
}
```

## Migration Steps

### Phase 1: Prerequisites (1-2 hours)

1. [ ] Create ArticleSchema
   - Define all fields based on API
   - Add validation rules
   - Create TypeScript type
   - **Estimated:** 30 min

2. [ ] Create CategorySchema
   - Simple taxonomy schema
   - **Estimated:** 15 min

3. [ ] Create TagSchema
   - Simple taxonomy schema
   - **Estimated:** 15 min

4. [ ] Add API methods to DrupalAPI class
   - `getArticle(slug: string)`
   - `getRelatedArticles(categoryId: string, limit: number)`
   - Add error handling
   - **Estimated:** 45 min

5. [ ] Test API methods
   - Verify data fetching
   - Test error cases
   - **Estimated:** 15 min

**GitHub Issues:**

- #501: Create ArticleSchema, CategorySchema, TagSchema
- #502: Add article API methods to DrupalAPI

### Phase 2: Component Migration (2-3 hours)

1. [ ] Migrate ArticleContent component
   - Convert CSS modules to Tailwind
   - Add TypeScript types
   - **Estimated:** 45 min

2. [ ] Create ArticleContent Storybook story
   - Default state
   - With/without image
   - Long/short content variants
   - **Estimated:** 30 min

3. [ ] Write ArticleContent tests
   - Rendering tests
   - Props validation
   - Edge cases
   - **Estimated:** 30 min

4. [ ] Migrate RelatedArticles component
   - Create card grid layout
   - Add loading states
   - **Estimated:** 45 min

5. [ ] Create RelatedArticles Storybook story
   - With 0, 1, 2, 3 articles
   - Loading state
   - **Estimated:** 30 min

6. [ ] Write RelatedArticles tests
   - Grid rendering
   - Empty state
   - Click handling
   - **Estimated:** 30 min

**GitHub Issues:**

- #503: Migrate ArticleContent component
- #504: Migrate RelatedArticles component

### Phase 3: Page Implementation (2-3 hours)

1. [ ] Create page structure
   - `src/app/news/[slug]/page.tsx`
   - `loading.tsx`
   - `error.tsx`
   - **Estimated:** 30 min

2. [ ] Implement generateStaticParams
   - Fetch article slugs
   - Limit to recent 50
   - **Estimated:** 30 min

3. [ ] Implement data fetching
   - Fetch article with Effect
   - Handle errors
   - Decode with schema
   - **Estimated:** 45 min

4. [ ] Fetch related articles
   - Based on category
   - Limit to 3
   - **Estimated:** 30 min

5. [ ] Implement ArticleLayout
   - Compose child components
   - Handle loading states
   - Error boundaries
   - **Estimated:** 45 min

6. [ ] Create generateMetadata
   - SEO optimization
   - Open Graph tags
   - Twitter cards
   - **Estimated:** 30 min

**GitHub Issues:**

- #505: Implement news article page with ISR

### Phase 4: Testing (1 hour)

1. [ ] Write page-level tests
   - Data fetching
   - generateStaticParams
   - Error handling
   - **Estimated:** 30 min

2. [ ] Visual regression tests
   - Capture Storybook snapshots
   - Compare with Gatsby version
   - **Estimated:** 15 min

3. [ ] Verify ISR behavior
   - Test revalidation
   - Test on-demand generation
   - **Estimated:** 15 min

**GitHub Issues:**

- #506: Add comprehensive tests for article page

### Phase 5: Documentation (30 min)

1. [ ] Update MIGRATION_PLAN.md
   - Mark article page as complete
   - Document any issues
   - **Estimated:** 10 min

2. [ ] Add JSDoc comments
   - Document complex functions
   - Add usage examples
   - **Estimated:** 10 min

3. [ ] Create README for news components
   - Usage instructions
   - Props documentation
   - **Estimated:** 10 min

**GitHub Issues:**

- #507: Document news article migration

## Dependencies

### Must Migrate First

None - all prerequisites can be created fresh.

### Can Migrate In Parallel

- [ ] Category page (shares CategorySchema)
- [ ] Tag page (shares TagSchema)
- [ ] News listing page

### Blocks Migration Of

- News category page (depends on this for patterns)
- News search page (depends on ArticleSchema)

## Risks & Challenges

### 1. Image Gallery Animation

**Challenge:** Gatsby version has custom CSS animations for image gallery
**Mitigation:**

- Convert to Tailwind animations
- Consider using Framer Motion for complex animations
- Fallback to simpler fade transitions

### 2. Related Articles Logic

**Challenge:** Gatsby uses build-time filtering, Next.js uses runtime API calls
**Mitigation:**

- Implement efficient filtering in Drupal API
- Cache related articles with ISR
- Consider pre-computing relationships

### 3. URL Structure

**Challenge:** Gatsby uses `{DrupalNodeArticle.path}`, Next.js uses `[slug]`
**Mitigation:**

- Ensure Drupal path field maps correctly
- Set up redirects if needed
- Test all existing article URLs

### 4. SEO Continuity

**Challenge:** Maintaining Google rankings during migration
**Mitigation:**

- Implement generateMetadata with same meta tags
- Ensure canonical URLs match
- Test with Google Search Console

## Performance Considerations

### Gatsby (Current)

- Build time: ~2 min for all articles
- Page load: Instant (fully static)
- Rebuild needed for new content

### Next.js (Target)

- Build time: ~30 sec (only latest 50 articles)
- Page load: Fast (ISR with 1-hour cache)
- New content appears automatically after 1 hour

**Improvement:** Faster builds, automatic updates, better scalability

## GitHub Issues Created

- #501: Create Article, Category, Tag schemas (Priority: High)
- #502: Add article API methods (Priority: High)
- #503: Migrate ArticleContent component (Priority: Medium)
- #504: Migrate RelatedArticles component (Priority: Medium)
- #505: Implement news article page (Priority: High)
- #506: Add tests for article page (Priority: High)
- #507: Document news article migration (Priority: Low)

**Labels:** `migration`, `news`, `gatsby-nextjs`
**Milestone:** Phase 3: Content Pages Migration

## Next Steps

**Recommended Order:**

1. **Start with schemas** (Use schema-migrator agent)

   ```
   "Generate schema for node/article"
   "Generate schema for taxonomy_term/category"
   "Generate schema for taxonomy_term/tags"
   ```

2. **Migrate components** (Use component-migrator agent)

   ```
   "Migrate ArticleContent component"
   "Migrate RelatedArticles component"
   ```

3. **Implement page** (Use component-migrator agent)

   ```
   "Migrate src/pages/news/{DrupalNodeArticle.path}.tsx"
   ```

4. **Quality check** (Use quality-reviewer agent)

   ```
   "Review the news article page"
   ```

5. **Create PR**
   ```
   "Create PR for news article migration"
   ```

## Estimated Timeline

**Total: 6-8 hours**

- Prerequisites: 1-2 hours
- Components: 2-3 hours
- Page: 2-3 hours
- Testing: 1 hour
- Documentation: 30 min

**Can be completed in:** 1-2 days (with breaks and code reviews)

---

_Generated by Migration Analyzer Agent_
_Ready to start? Use the other agents to automate each phase!_
