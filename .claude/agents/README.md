# KCVV Migration Agents

**Version:** 1.0.0
**Created:** 2025-12-30
**Purpose:** Autonomous agents for Gatsby → Next.js migration

## Overview

This directory contains 4 specialized agents that work together to automate the KCVV Elewijt Gatsby to Next.js migration process. These agents handle everything from planning to implementation to quality assurance.

## Available Agents

### 1. Migration Analyzer Agent

**Type:** Planning & Analysis
**Location:** `migration-analyzer/`

Analyzes Gatsby pages/components and creates comprehensive migration strategies.

**Use when you need to:**

- Understand what needs to be migrated
- Plan migration approach
- Identify dependencies and blockers
- Estimate effort and complexity

**Invocation:**

```
Analyze the news article page for migration
Analyze src/pages/team-detail.tsx
Create migration plan for ranking page
```

---

### 2. Schema Migration Agent

**Type:** Code Generation
**Location:** `schema-migrator/`

Fetches Drupal API data and generates Effect Schemas with all supporting code.

**Use when you need to:**

- Generate Effect Schemas from Drupal entities
- Create schemas for new content types
- Update existing schemas
- Generate mappers and tests

**Invocation:**

```
Generate schema for node/article
Create schema for taxonomy_term/category
Update schema for node/player
```

---

### 3. Component Migration Agent

**Type:** Full-Stack Implementation
**Location:** `component-migrator/`

Completely migrates Gatsby components/pages to Next.js with Storybook-first approach.

**Use when you need to:**

- Migrate a complete Gatsby page
- Convert components to Next.js patterns
- Implement from scratch with KCVV standards

**Invocation:**

```
Migrate src/pages/news/article.tsx
Migrate the team detail page
Convert NewsCard component to Next.js
```

---

### 4. Quality Review Agent

**Type:** Validation & QA
**Location:** `quality-reviewer/`

Reviews migrated code against KCVV standards and identifies issues.

**Use when you need to:**

- Validate code quality before PR
- Ensure standards compliance
- Audit existing components
- Get quality metrics

**Invocation:**

```
Review the news article page
Quality check src/components/news/NewsCard.tsx
Audit PR #123
```

---

## How Agents Work Together

### Complete Migration Workflow

```
1. migration-analyzer
   ↓ (Analyzes and creates plan)

2. schema-migrator
   ↓ (Generates required schemas)

3. component-migrator
   ↓ (Implements component with Storybook + tests)

4. quality-reviewer
   ↓ (Validates quality and standards)

5. Ready for PR! 🎉
```

### Example: Migrating News Article Page

```
You: "I want to migrate the news article page"

Step 1 - Analyze:
You: "Analyze the news article page"
Agent: migration-analyzer
Output: Detailed plan with dependencies, effort estimate, GitHub issues

Step 2 - Generate Schemas:
You: "Generate schema for node/article"
Agent: schema-migrator
Output: ArticleSchema, mapper, tests, API methods

Step 3 - Migrate Component:
You: "Migrate src/pages/news/[slug].tsx"
Agent: component-migrator
Output: Complete Next.js page, Storybook stories, tests

Step 4 - Quality Review:
You: "Review the news article page"
Agent: quality-reviewer
Output: Quality report, issues identified, recommendations

Step 5 - Fix & Finalize:
(Fix any issues found)
You: "Create PR"
Done! ✅
```

## Workflow Patterns

### Pattern 1: New Page Migration

```bash
# 1. Analyze first
"Analyze src/pages/teams/[id].tsx"
→ Creates plan, identifies dependencies

# 2. Generate any missing schemas
"Generate schema for node/team"
"Generate schema for node/player"
→ Creates all required schemas

# 3. Migrate the page
"Migrate the team detail page"
→ Complete implementation

# 4. Quality check
"Review the team detail page"
→ Validation and recommendations

# 5. Create PR
"Create PR"
```

### Pattern 2: Schema-First Approach

```bash
# When you know what schemas you need
"Generate schema for node/sponsor"
"Generate schema for taxonomy_term/season"

# Then migrate components
"Migrate sponsors page"
```

### Pattern 3: Quick Component Update

```bash
# For simple components, skip analysis
"Migrate NewsCard component"
"Review NewsCard component"
```

### Pattern 4: Audit Existing Code

```bash
# Review what's already migrated
"Review all components in src/components/news/"
"Audit the current migration status"
```

### Pattern 5: Full-Stack Feature

```bash
# End-to-end feature implementation
"Analyze ranking page"           # Plan
"Generate schema for ranking"     # Schema
"Migrate ranking page"            # Implementation
"Review ranking page"             # QA
"Create PR"                       # Ship it
```

## Agent Communication

Agents can communicate with each other:

### Automatic Invocation

**component-migrator** can automatically invoke:

- **schema-migrator** when it detects missing schemas
- **quality-reviewer** for validation before completion

**Example:**

```
You: "Migrate news page"

component-migrator:
  → Detects ArticleSchema missing
  → Invokes schema-migrator to generate it
  → Continues with migration
  → Invokes quality-reviewer for validation
  → Reports complete migration
```

### Manual Chaining

You can chain agents manually:

```
"Analyze the team page, then generate required schemas, then migrate it"

This will invoke:
1. migration-analyzer
2. schema-migrator (for each schema)
3. component-migrator
```

## Tips for Best Results

### 1. Start with Analysis

Always run **migration-analyzer** first for complex pages to understand the scope.

### 2. Review Agent Output

Agents provide detailed reports - review them before proceeding.

### 3. Trust But Verify

Agents are smart but review generated code, especially:

- ISR configuration
- Error handling
- Accessibility

### 4. Iterate on Quality

Run **quality-reviewer** multiple times:

- After migration (initial review)
- After fixing issues (validation)
- Before PR (final check)

### 5. Use Storybook

Agents create Storybook stories - use them to verify visually.

### 6. Keep Agents Updated

As your standards evolve, update agent configurations.

## Configuration

Each agent can be configured via `config.json` in its directory.

### Global Configuration

Create `.claude/agents/config.json` for shared settings:

```json
{
  "drupalApiUrl": "https://api.kcvvelewijt.be/jsonapi",
  "githubIntegration": true,
  "autoCreateIssues": false,
  "branchPrefix": "migrate",
  "testCoverageTarget": 80,
  "storybookRequired": true
}
```

### Per-Agent Configuration

Each agent has its own `config.json` - see individual agent documentation.

## Examples & Templates

Each agent directory contains:

- `prompts/` - Prompt templates
- `examples/` - Example outputs

### Example Files to Create

```bash
# Migration Analyzer examples
.claude/agents/migration-analyzer/examples/
  ├── news-article-analysis.md
  ├── team-page-analysis.md
  └── complex-page-analysis.md

# Schema Migrator examples
.claude/agents/schema-migrator/examples/
  ├── article-schema-output.ts
  ├── team-schema-output.ts
  └── taxonomy-schema-output.ts

# Component Migrator examples
.claude/agents/component-migrator/examples/
  ├── page-migration.md
  ├── component-migration.md
  └── full-stack-feature.md

# Quality Reviewer examples
.claude/agents/quality-reviewer/examples/
  ├── excellent-review.md
  ├── needs-improvement-review.md
  └── failed-review.md
```

## Monitoring & Metrics

### Track Migration Progress

Agents automatically update `MIGRATION_PLAN.md` and can generate metrics:

```
"Generate migration metrics report"

Output:
- Pages migrated: 12/25 (48%)
- Components migrated: 34/50 (68%)
- Schemas created: 15
- Test coverage: 87% avg
- Quality score: 85/100 avg
```

### Quality Trends

**quality-reviewer** can track quality over time:

```
"Show quality trends for last month"

Output:
- Test coverage trend: ↑ (75% → 87%)
- TypeScript errors: ↓ (23 → 0)
- Accessibility score: ↑ (70% → 88%)
```

## Troubleshooting

### Agent Not Responding

**Check:**

1. Agent name is correct
2. Input format matches patterns
3. Required files exist (Gatsby source, etc.)

**Example:**

```
❌ "migrate news page"              # Too vague
✅ "Migrate src/pages/news/[slug].tsx"  # Specific
```

### Agent Produces Errors

**Common causes:**

1. Missing Drupal API access
2. Invalid Gatsby file path
3. Missing dependencies

**Solution:**
Review agent output for specific error and address root cause.

### Generated Code Has Issues

**Process:**

1. Run **quality-reviewer** to identify issues
2. Fix issues manually or ask agent to fix
3. Re-run **quality-reviewer** to validate

### Schema Doesn't Match API

**Solution:**

```
"Update schema for node/article"

Agent will:
- Fetch fresh API data
- Compare with existing schema
- Generate update migration
```

## Advanced Usage

### Batch Operations

```
"Analyze all pages in src/pages/teams/"
"Generate schemas for all Drupal content types"
"Review all components in src/components/"
```

### Custom Workflows

Create custom workflows by chaining agents:

```json
{
  "workflows": {
    "full-page-migration": [
      "migration-analyzer",
      "schema-migrator",
      "component-migrator",
      "quality-reviewer"
    ],
    "schema-only": ["schema-migrator"],
    "audit-mode": ["quality-reviewer"]
  }
}
```

### CI/CD Integration

Agents can run in CI/CD:

```yaml
# .github/workflows/quality-check.yml
- name: Run Quality Review
  run: |
    claude-agent quality-reviewer --format=json --output=report.json
```

## Best Practices

### DO ✅

- Run **migration-analyzer** before complex migrations
- Let **schema-migrator** handle schema generation
- Trust **component-migrator** for Storybook-first approach
- Use **quality-reviewer** before every PR
- Review agent outputs carefully
- Keep configurations updated

### DON'T ❌

- Skip analysis for complex pages
- Manually create schemas (use schema-migrator)
- Skip Storybook stories (required by KCVV standards)
- Ignore quality-reviewer warnings
- Modify agent-generated code without understanding it
- Mix manual and agent-based approaches

## Getting Help

### Documentation

- Individual agent docs: See `AGENT.md` in each agent directory
- KCVV workflow: `.claude/WORKFLOW.md`
- Migration plan: `MIGRATION_PLAN.md`

### Agent Capabilities

Ask agents about their capabilities:

```
"What can the migration-analyzer agent do?"
"Show me examples of schema-migrator output"
"How does component-migrator work?"
```

### Debugging

Enable verbose output:

```
"Analyze news page with verbose output"
```

## Versioning

Agents follow semantic versioning:

- **Major:** Breaking changes to agent behavior
- **Minor:** New features, improvements
- **Patch:** Bug fixes, documentation

Current versions:

- migration-analyzer: 1.0.0
- schema-migrator: 1.0.0
- component-migrator: 1.0.0
- quality-reviewer: 1.0.0

## Contributing

To improve agents:

1. Update `AGENT.md` with new capabilities
2. Add examples to `examples/`
3. Update this README
4. Test thoroughly
5. Version bump if needed

## Roadmap

### Planned Features

- [ ] Visual regression testing integration
- [ ] Automated PR creation
- [ ] Migration progress dashboard
- [ ] AI-powered code suggestions
- [ ] Integration with design system
- [ ] Performance testing automation

### Under Consideration

- Drupal API schema validation
- Automated accessibility testing
- Bundle size analysis
- Security vulnerability scanning

---

## Quick Reference

| Task              | Agent              | Command                        |
| ----------------- | ------------------ | ------------------------------ |
| Plan migration    | migration-analyzer | "Analyze [page]"               |
| Create schema     | schema-migrator    | "Generate schema for [entity]" |
| Migrate component | component-migrator | "Migrate [component]"          |
| Check quality     | quality-reviewer   | "Review [component]"           |
| Full migration    | All agents         | Use workflow pattern           |

---

**Last Updated:** 2025-12-30
**Maintained By:** KCVV Development Team
**Questions?** See individual agent documentation or `.claude/WORKFLOW.md`
