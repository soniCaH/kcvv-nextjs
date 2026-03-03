# KCVV Elewijt - Claude Code Instructions

## Project

- **Site:** KCVV Elewijt Football Club — Gatsby → Next.js migration
- **Stack:** Turborepo monorepo + pnpm workspaces; Next.js 16, TypeScript strict, Effect, Tailwind CSS v4, Storybook 10, Vitest
- **Hosting:** Vercel | **CMS:** Drupal JSON:API + Footbalisto API
- **Primary green:** #4acf52

## Platform Architecture

| App/Package   | Path                     | Host               | Purpose                         |
| ------------- | ------------------------ | ------------------ | ------------------------------- |
| Next.js web   | `apps/web/`              | Vercel             | Club website                    |
| Sanity Studio | `apps/studio/`           | sanity.io          | CMS admin UI                    |
| API contract  | `packages/api-contract/` | (library)          | Shared Effect schemas + HttpApi |
| PSD BFF       | `kcvv-api` repo          | Cloudflare Workers | ProSoccerData proxy + cache     |

**Design doc:** `docs/plans/2026-03-03-platform-architecture-design.md`
**GitHub Project:** https://github.com/users/soniCaH/projects/2

## Efficiency Rules (MANDATORY)

- Do NOT read DESIGN_SYSTEM.md, SCHEMA_GUIDE.md, STORYBOOK.md, or MIGRATION_PLAN.md unless explicitly asked. Use existing source code as reference instead.
- Do NOT spawn Explore/Plan agents for tasks involving ≤3 files. Read the files directly.
- Do NOT re-analyze project status. Check `gh issue list` or this file.
- Do NOT explain what you're about to do — just do it.
- For simple feature/fix tasks: read relevant code → implement → test. No planning phase needed.
- When you learn something new about the Drupal/Footbalisto API (gotcha, edge case, failed approach), append it to the relevant skill file under "## Learnings".

## Current State (updated: 2026-03-03)

### Migration Phases

| Phase                         | Status      | Issue |
| ----------------------------- | ----------- | ----- |
| 0: Monorepo Setup             | Done        | #721  |
| 1: Design System + Foundation | Done        | —     |
| 2: Content Pages              | ~70%        | —     |
| 3: Team & Player Features     | Done        | —     |
| 4: Calendar & Events          | Not started | #517  |
| 5: Club Information Pages     | Not started | #518  |
| 6: Search & Utility           | ~90%        | #519  |
| 7: Kiosk Mode                 | Not started | #520  |

## Git Workflow

1. **Branch first:** `git checkout -b <type>/<description>` — types: `feat/`, `fix/`, `migrate/`, `refactor/`, `docs/`, `test/`
2. **Conventional commits:** `type(scope): description` — scopes: news, matches, teams, players, sponsors, calendar, ranking, api, ui, schema, migration, config, deps
3. **Quality before commit:** run `pnpm --filter @kcvv/web lint:fix` (minimum) or `pnpm --filter @kcvv/web check-all` (preferred). Husky pre-commit runs lint-staged, type-check — run checks first to avoid failed commits.
4. **Push:** `git push -u origin <branch-name>`
5. **Never:** commit to `main`, create PR without asking, push before checks pass

## Development Standards

- Effect Schema for all data validation (no `S.Unknown`)
- Test coverage minimum 80%
- Tailwind CSS only, primary green #4acf52
- ISR with appropriate `revalidate`
- `next/image` with proper `sizes`, `generateMetadata` for SEO
- Doc files (DESIGN_SYSTEM.md, SCHEMA_GUIDE.md, STORYBOOK.md) — do NOT consult unless explicitly asked.
- App-specific rules (Design System, Storybook, routes, test coverage) → see `apps/web/CLAUDE.md`
- api-contract conventions → see `packages/api-contract/CLAUDE.md`

## Skills

- `.claude/skills/drupal-api-analyzer/` — Drupal JSON:API reference & learnings
- `.claude/skills/gatsby-nextjs-migration/` — Migration reference & learnings
