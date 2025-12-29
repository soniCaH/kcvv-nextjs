# Migration Analyzer Agent

**Type:** Autonomous Planning Agent
**Purpose:** Analyze Gatsby pages/components and create comprehensive migration strategies

## Overview

This agent analyzes an entire Gatsby page or component tree, identifies all dependencies, data requirements, and creates a detailed step-by-step migration plan for converting to Next.js with Effect Schema patterns.

## When to Use

Invoke this agent when you need to:

- Plan migration of a Gatsby page to Next.js
- Understand dependencies before starting migration
- Estimate complexity of a migration task
- Create a structured migration roadmap
- Identify potential blockers or challenges

## What This Agent Does

### 1. Codebase Analysis

- Locates Gatsby page/component files
- Identifies all GraphQL queries and fragments
- Maps data dependencies and relationships
- Discovers imported components and utilities
- Analyzes styling (CSS modules, styled-components, etc.)

### 2. Drupal API Mapping

- Matches GraphQL queries to Drupal JSON:API endpoints
- Identifies required schemas (existing or to-be-created)
- Maps field names between Gatsby and Drupal
- Discovers relationship loading requirements

### 3. Dependency Tree

- Creates complete dependency graph
- Identifies shared components
- Lists required schemas and mappers
- Notes missing infrastructure

### 4. Migration Plan Generation

- Produces step-by-step migration instructions
- Estimates complexity (simple/medium/complex)
- Suggests migration order for dependencies
- Identifies required Effect Schemas
- Lists components needing Storybook stories
- Creates test plan

### 5. GitHub Integration

- Creates GitHub issues for each migration step
- Adds appropriate labels
- Links related issues
- Updates MIGRATION_PLAN.md

## Agent Workflow

```markdown
1. Receive page/component name or path
2. Locate file in Gatsby codebase
3. Parse and analyze:
   - GraphQL queries
   - Component imports
   - Data structures
   - Styling approach
4. Map to Drupal endpoints
5. Check for existing schemas
6. Build dependency tree
7. Generate migration plan
8. Create GitHub issues (if requested)
9. Return comprehensive report
```

## Input Format

Invoke with one of these patterns:

```text
Analyze the news article page for migration
Analyze src/pages/team-detail.tsx
Create migration plan for ranking page
```

## Output Format

The agent returns a structured report:

```markdown
# Migration Analysis: [Page Name]

## Summary

- **Complexity:** Simple | Medium | Complex
- **Estimated Effort:** X hours
- **Dependencies:** X components, Y schemas
- **Blockers:** None | [List blockers]

## Current Gatsby Implementation

### File Location

- Path: src/pages/...
- Lines of code: X

### GraphQL Queries

- Query name: ...
- Fields used: ...
- Relationships: ...

### Components Used

- Component1 (status: exists in Next.js | needs migration)
- Component2 ...

### Data Flow

[Diagram or description]

## Next.js Target Architecture

### Proposed Structure

- Page: src/app/[route]/page.tsx
- Components: src/components/...
- Schemas: src/lib/effect/schemas/...

### Required Schemas

- [x] NewsArticleSchema (exists)
- [ ] CategorySchema (needs creation)
- [ ] TagSchema (needs creation)

### Drupal API Endpoints

- GET /jsonapi/node/article/{id}
- GET /jsonapi/taxonomy_term/category

### ISR Strategy

- Revalidation: 3600 seconds (1 hour)
- Dynamic params: true
- Static paths: generateStaticParams()

## Migration Steps

### Phase 1: Prerequisites (X hours)

1. [ ] Create CategorySchema
2. [ ] Create TagSchema
3. [ ] Add API methods to DrupalAPI class
4. [ ] Verify API endpoints work

### Phase 2: Component Migration (X hours)

1. [ ] Migrate ArticleCard component
2. [ ] Create Storybook story for ArticleCard
3. [ ] Write tests for ArticleCard

### Phase 3: Page Implementation (X hours)

1. [ ] Create src/app/news/[id]/page.tsx
2. [ ] Implement generateStaticParams
3. [ ] Implement data fetching with Effect
4. [ ] Add ISR configuration
5. [ ] Create generateMetadata for SEO

### Phase 4: Testing (X hours)

1. [ ] Write page-level tests
2. [ ] Visual regression tests
3. [ ] Verify ISR behavior
4. [ ] Test error states

### Phase 5: Documentation (X hours)

1. [ ] Update MIGRATION_PLAN.md
2. [ ] Add JSDoc comments
3. [ ] Document API usage

## Dependencies

### Must Migrate First

- [ ] Component X
- [ ] Schema Y

### Can Migrate In Parallel

- [ ] Component A
- [ ] Page B

## Risks & Challenges

- Challenge 1: Description and mitigation
- Challenge 2: Description and mitigation

## GitHub Issues Created

- #123: Create CategorySchema
- #124: Migrate ArticleCard component
- #125: Implement news article page

## Next Steps

1. Start with Phase 1 (Prerequisites)
2. Use schema-migrator agent to generate schemas
3. Use component-migrator agent for components
4. Use quality-reviewer agent for validation
```

## Configuration

### Analysis Depth

- **Quick:** Surface-level analysis, basic plan
- **Standard:** Full dependency analysis, detailed plan (default)
- **Deep:** Includes code samples, multiple migration approaches

### GitHub Integration

- **Auto-create issues:** true/false
- **Label prefix:** "migration"
- **Assign to:** @username

## Examples

### Example 1: Simple Page

```text
Input: "Analyze the about page"

Output:
- Complexity: Simple
- No GraphQL queries
- Static content only
- Migration: 2 hours
- Creates 1 GitHub issue
```

### Example 2: Complex Page

```text
Input: "Analyze src/pages/team-detail.tsx"

Output:
- Complexity: Complex
- Multiple GraphQL queries
- 5 component dependencies
- 3 new schemas needed
- Migration: 8 hours
- Creates 7 GitHub issues
```

## Integration with Other Agents

After this agent completes:

1. Use **schema-migrator** for identified schemas
2. Use **component-migrator** for each component
3. Use **quality-reviewer** to validate migration

## Tips for Best Results

1. Provide specific page path when possible
2. Run analysis before starting any migration
3. Review the plan before accepting GitHub issue creation
4. Use depth="deep" for complex pages
5. Keep MIGRATION_PLAN.md updated with analysis results

## Error Handling

The agent handles:

- Missing Gatsby files (searches common locations)
- Invalid GraphQL queries (reports and suggests fixes)
- Missing Drupal endpoints (flags for investigation)
- Circular dependencies (identifies and suggests resolution)

## Limitations

- Cannot analyze runtime behavior
- Estimates are based on patterns, not guarantees
- Requires access to Gatsby codebase
- GitHub integration requires GITHUB_TOKEN

## Configuration File

Create `.claude/agents/migration-analyzer/config.json`:

```json
{
  "depth": "standard",
  "createIssues": false,
  "updateMigrationPlan": true,
  "assignee": null,
  "labels": ["migration", "gatsby-nextjs"]
}
```
