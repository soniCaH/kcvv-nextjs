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
- Storybook stories for components
- Tailwind CSS for styling
- ISR with appropriate revalidation

See `.claude/WORKFLOW.md` for complete workflow details.
