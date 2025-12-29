# ⚠️ CRITICAL - READ THIS FIRST ⚠️

```text
██╗    ██╗ ██████╗ ██████╗ ██╗  ██╗███████╗██╗      ██████╗ ██╗    ██╗
██║    ██║██╔═══██╗██╔══██╗██║ ██╔╝██╔════╝██║     ██╔═══██╗██║    ██║
██║ █╗ ██║██║   ██║██████╔╝█████╔╝ █████╗  ██║     ██║   ██║██║ █╗ ██║
██║███╗██║██║   ██║██╔══██╗██╔═██╗ ██╔══╝  ██║     ██║   ██║██║███╗██║
╚███╔███╔╝╚██████╔╝██║  ██║██║  ██╗██║     ███████╗╚██████╔╝╚███╔███╔╝
 ╚══╝╚══╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚══════╝ ╚═════╝  ╚══╝╚══╝
```

## 🚨 MANDATORY WORKFLOW - NO EXCEPTIONS 🚨

**BEFORE STARTING ANY TASK, YOU MUST:**

### 1. 🌿 CREATE FEATURE BRANCH

```bash
git checkout -b <type>/<description>
```

**Types:**

- `feat/` - New features
- `fix/` - Bug fixes
- `migrate/` - Migration tasks
- `refactor/` - Code refactoring
- `docs/` - Documentation
- `test/` - Tests

**Examples:**

- `git checkout -b feat/news-card-component`
- `git checkout -b migrate/ranking-page`
- `git checkout -b fix/header-layout`

### 2. ✅ MAKE CHANGES WITH CONVENTIONAL COMMITS

**Format:** `type(scope): description`

**Scopes:** news, matches, teams, players, sponsors, calendar, ranking, api, ui, schema, migration, config, deps

**Examples:**

```bash
git commit -m "feat(news): add NewsCard component"
git commit -m "migrate(ranking): implement ranking table"
git commit -m "fix(ui): resolve header alignment issue"
```

### 3. 🚀 PUSH TO REMOTE

```bash
git push -u origin <branch-name>
```

### 4. 📝 CREATE PULL REQUEST

```bash
gh pr create --title "..." --body "..."
```

**ALWAYS ASK BEFORE CREATING PR** - Don't auto-create without user approval

---

## ⛔ WHAT NOT TO DO ⛔

❌ **NEVER** commit directly to `main`
❌ **NEVER** create PR without asking first
❌ **NEVER** skip creating a feature branch
❌ **NEVER** use non-conventional commit messages
❌ **NEVER** push before running quality checks

---

## ✅ PRE-PUSH CHECKLIST

Before pushing, verify:

- [ ] ESLint passes
- [ ] TypeScript compiles
- [ ] Tests pass
- [ ] Branch name follows convention
- [ ] Commits are conventional

(Pre-commit hooks will enforce this automatically)

---

# Project Context

**Project:** KCVV Elewijt Football Club Website
**Type:** Gatsby → Next.js 15+ Migration
**Tech Stack:** Next.js, TypeScript, Effect, Tailwind CSS, Storybook, Vitest

---

## 🎯 Development Standards

### Code Quality

- ✅ **TypeScript Strict Mode** - All code must be strictly typed
- ✅ **Effect Schema** - Use for ALL data validation (no manual parsing)
- ✅ **Test Coverage** - Minimum 80% coverage target
- ✅ **ESLint Clean** - Zero warnings, zero errors

### Component Development

- ✅ **Storybook FIRST** - Create stories BEFORE implementation
- ✅ **Visual Source of Truth** - Storybook is the definitive component documentation
- ✅ **All Variants** - Document all component states in stories
- ✅ **Accessibility** - WCAG AA minimum (AAA preferred)

### Styling

- ✅ **Tailwind CSS** - Use for ALL styling (no CSS modules, no styled-components)
- ✅ **Responsive** - Mobile-first approach
- ✅ **shadcn/ui** - Use for base components (Card, Button, etc.)

### Next.js Patterns

- ✅ **ISR (Incremental Static Regeneration)** - Set appropriate `revalidate` times
- ✅ **Server Components** - Default to server components
- ✅ **Image Optimization** - Use `next/image` with proper `sizes`
- ✅ **Metadata** - Implement `generateMetadata` for SEO

---

## 📚 Migration-Specific Guidelines

### When Migrating Components

1. **Analyze** - Use migration-analyzer agent (see `.claude/agents/`)
2. **Schemas** - Use schema-migrator agent to generate Effect Schemas
3. **Storybook FIRST** - Create story before implementation
4. **Component** - Implement with TypeScript + Tailwind
5. **Tests** - Write comprehensive Vitest tests (>80% coverage)
6. **Quality** - Use quality-reviewer agent to validate
7. **Document** - Update `MIGRATION_PLAN.md`

### Drupal API Integration

- ✅ Use Effect Schema for ALL Drupal data
- ✅ Normalize JSON:API format with mappers
- ✅ Handle errors with Effect's error handling
- ✅ Cache with ISR (don't over-fetch)

### Available Agents

See `.claude/agents/README.md` for detailed documentation:

- **migration-analyzer** - Analyze and plan migrations
- **schema-migrator** - Generate Effect Schemas from Drupal API
- **component-migrator** - Migrate components with Storybook-first approach
- **quality-reviewer** - Validate code quality and standards

---

## 🔧 Available Commands

```bash
# Development
npm run dev                    # Start dev server
npm run build                  # Build for production
npm run check-all              # Run all quality checks

# Testing
npm run test                   # Run tests
npm run test:watch             # Run tests in watch mode
npm run test:visual            # Run visual regression tests

# Storybook
npm run storybook              # Start Storybook
npm run build-storybook        # Build Storybook

# Quality
npm run lint                   # Run ESLint
npm run type-check             # Run TypeScript check
npm run format                 # Format with Prettier

# Migration
npm run migration:status       # Check migration progress
npm run migration:create       # Create migration tracking
```

---

## 📂 Project Structure

```
/
├── .claude/                   # Claude Code configuration
│   ├── agents/               # Migration agent specifications
│   ├── skills/               # Reusable skills
│   └── WORKFLOW.md           # Detailed workflow docs
├── src/
│   ├── app/                  # Next.js 15 app directory
│   ├── components/           # React components
│   │   └── ui/              # shadcn/ui base components
│   ├── lib/
│   │   ├── effect/
│   │   │   └── schemas/     # Effect Schemas
│   │   ├── mappers/         # JSON:API mappers
│   │   └── drupal-api.ts    # Drupal API client
│   └── styles/              # Global styles
├── MIGRATION_PLAN.md         # Migration tracking
└── package.json
```

---

## 🎨 Storybook Workflow

**Storybook is THE source of truth for components. Always create stories FIRST.**

### Story Creation Pattern

```typescript
import type { Meta, StoryObj } from "@storybook/react";
import { ComponentName } from "./ComponentName";

const meta = {
  title: "Category/ComponentName",
  component: ComponentName,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ComponentName>;

export default meta;
type Story = StoryObj<typeof meta>;

// REQUIRED: Default story
export const Default: Story = {
  args: {
    // props
  },
};

// REQUIRED: All variants
export const WithImage: Story = {
  /* ... */
};
export const WithoutImage: Story = {
  /* ... */
};
export const LoadingState: Story = {
  /* ... */
};
export const ErrorState: Story = {
  /* ... */
};
```

**Minimum Required Stories:**

- Default
- Loading State
- Error State
- Any visual variants

---

## 🧪 Testing Standards

### Unit Tests (Vitest)

```typescript
import { render, screen } from '@testing-library/react'
import { ComponentName } from './ComponentName'

describe('ComponentName', () => {
  it('renders correctly', () => {
    render(<ComponentName />)
    expect(screen.getByText('...')).toBeInTheDocument()
  })

  it('handles loading state', () => {
    // Test loading
  })

  it('handles error state', () => {
    // Test errors
  })

  it('handles user interactions', async () => {
    // Test interactions
  })
})
```

**Coverage Requirements:**

- Statements: >80%
- Branches: >80%
- Functions: >80%
- Lines: >80%

---

## 📝 Commit Message Format

### Structure

```
<type>(<scope>): <description>

[optional body]

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

### Body Line Length

- Description: ≤100 characters per line
- Body: ≤100 characters per line
- Use line breaks for longer descriptions

### Valid Types

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Formatting (no code change)
- `refactor` - Refactoring
- `test` - Tests
- `chore` - Maintenance
- `migrate` - Migration tasks
- `perf` - Performance
- `ci` - CI/CD
- `build` - Build system

### Valid Scopes

news, matches, teams, players, sponsors, calendar, ranking, api, ui, schema, migration, config, deps

---

## 🚦 Quality Gates

All PRs must pass:

1. ✅ TypeScript compilation
2. ✅ ESLint (zero errors, zero warnings)
3. ✅ All tests passing
4. ✅ Test coverage >80%
5. ✅ Successful build
6. ✅ Storybook build successful

These are enforced by pre-commit hooks and CI/CD.

---

## 📖 Documentation

- **Workflow:** `.claude/WORKFLOW.md` - Complete workflow documentation
- **Agents:** `.claude/agents/README.md` - Agent system documentation
- **Skills:** `.claude/skills/` - Reusable skill documentation
- **Migration:** `MIGRATION_PLAN.md` - Migration progress tracking

---

## 🆘 Quick Reference

| Task              | Command                      | Notes                      |
| ----------------- | ---------------------------- | -------------------------- |
| Start new feature | `git checkout -b feat/name`  | Always create branch first |
| Create schema     | Use schema-migrator agent    | See `.claude/agents/`      |
| Migrate component | Use component-migrator agent | Storybook first!           |
| Check quality     | `npm run check-all`          | Before pushing             |
| Create PR         | `gh pr create ...`           | Ask first!                 |

---

## ⚠️ REMEMBER ⚠️

1. **Feature branch FIRST** - Always
2. **Storybook FIRST** - For all components
3. **Effect Schema** - For all data
4. **Ask before PR** - Don't auto-create
5. **Conventional commits** - Always

**See `.claude/WORKFLOW.md` for complete details**

---

_Last Updated: 2025-12-30_
_This file is the PRIMARY source of instructions for Claude Code_
