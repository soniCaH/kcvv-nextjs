# KCVV Elewijt - Claude Code Instructions

## Project Context

**Project:** KCVV Elewijt Football Club Website
**Type:** Gatsby → Next.js 15+ Migration
**Stack:** Next.js, TypeScript, Effect, Tailwind CSS, Storybook, Vitest

---

## Git Workflow (MANDATORY)

### Before ANY Task

1. **Create feature branch:** `git checkout -b <type>/<description>`
   - Types: `feat/`, `fix/`, `migrate/`, `refactor/`, `docs/`, `test/`
2. **Conventional commits:** `type(scope): description`
   - Scopes: news, matches, teams, players, sponsors, calendar, ranking, api, ui, schema, migration, config, deps
3. **Push to remote:** `git push -u origin <branch-name>`
4. **Ask before creating PR** - Never auto-create

### Never Do

- ❌ Commit directly to `main`
- ❌ Create PR without asking
- ❌ Skip feature branch
- ❌ Push before quality checks pass

See `.claude/WORKFLOW.md` for complete details.

---

## Development Standards

### Code Quality

- TypeScript strict mode - all code strictly typed
- Effect Schema for ALL data validation
- Test coverage minimum 80%
- ESLint clean - zero warnings/errors

### Component Development

- **DESIGN_SYSTEM.md** - Review before creating components
- **STORYBOOK.md** - Create stories BEFORE implementation
- **Storybook MCP** - Call before UI/React work for instructions
- Accessibility: WCAG AA minimum

### Styling

- Tailwind CSS only (no CSS modules, no styled-components)
- Primary green: #4acf52
- Mobile-first, responsive
- Use shadcn/ui for base components

### Next.js Patterns

- ISR with appropriate `revalidate` times
- Server components by default
- `next/image` with proper `sizes`
- `generateMetadata` for SEO

---

## Migration Guidelines

### When Migrating Components

1. Check DESIGN_SYSTEM.md for patterns
2. Follow SCHEMA_GUIDE.md for Effect Schemas
3. Create Storybook story FIRST
4. Implement with TypeScript + Tailwind
5. Write tests (>80% coverage)
6. Update MIGRATION_PLAN.md

### Drupal API Integration

- Effect Schema for ALL Drupal data
- No `S.Unknown` types - create proper schemas
- Normalize JSON:API with mappers
- Cache with ISR

### Skills Available

- `.claude/skills/drupal-api-analyzer/` - Auto-generate schemas
- `.claude/skills/gatsby-nextjs-migration/` - Migration patterns

---

## Key Documentation

| Document            | Purpose                        |
| ------------------- | ------------------------------ |
| DESIGN_SYSTEM.md    | Authoritative design reference |
| SCHEMA_GUIDE.md     | Effect Schema patterns         |
| STORYBOOK.md        | Component development guide    |
| MIGRATION_PLAN.md   | Migration progress tracking    |
| .claude/WORKFLOW.md | Git workflow details           |

---

## Quick Reference

| Task             | Command/Action                 |
| ---------------- | ------------------------------ |
| Start feature    | `git checkout -b feat/name`    |
| Quality check    | `npm run check-all`            |
| Create PR        | Ask first, then `gh pr create` |
| Migration status | `npm run migration:status`     |
