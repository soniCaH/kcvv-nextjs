# Local Instructions

This is a Gatsby to Next.js migration project for KCVV Elewijt football club.

## Automated Workflow

- **Auto-create feature branch** when starting tasks (migrate/_, feat/_, fix/\*)
- **Ask before creating PRs** (hybrid workflow)
- Use conventional commits (type(scope): message)
- Run `npm run check-all` before pushing
- Update MIGRATION_PLAN.md for migration phases

## Standards

- Effect Schema for data validation
- TypeScript strict mode
- Vitest tests (>80% coverage target)
- **Storybook as THE visual source of truth for ALL components**
- Create Storybook stories BEFORE implementing components
- Visual regression testing via Playwright + Storybook
- Tailwind CSS for styling
- ISR with appropriate revalidation

See `.claude/WORKFLOW.md` for complete workflow details.
See `.claude/VISUAL_TESTING.md` for visual testing standards.
