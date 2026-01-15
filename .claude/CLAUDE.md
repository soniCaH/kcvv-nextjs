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
- ✅ **Effect Schema** - Use for ALL data validation (see SCHEMA_GUIDE.md)
- ✅ **Test Coverage** - Minimum 80% coverage target
- ✅ **ESLint Clean** - Zero warnings, zero errors

### Component Development

Before doing any UI, frontend or React development, ALWAYS call the storybook MCP server to get further instructions.

- ✅ **Design System FIRST** - Review DESIGN_SYSTEM.md before creating components
- ✅ **Storybook SECOND** - Create stories BEFORE implementation (see STORYBOOK.md)
- ✅ **Visual Source of Truth** - Storybook is the definitive component documentation
- ✅ **All Variants** - Document all component states in stories
- ✅ **Accessibility** - WCAG AA minimum (AAA preferred)

### Styling

- ✅ **KCVV Design System** - Follow DESIGN_SYSTEM.md (AUTHORITATIVE)
- ✅ **Exact Colors** - Use #4acf52 for primary green (no variations)
- ✅ **Tailwind CSS** - Use for ALL styling (no CSS modules, no styled-components)
- ✅ **Responsive** - Mobile-first approach, test on mobile/tablet/desktop
- ✅ **shadcn/ui** - Use for base components (Card, Button, etc.)

### Next.js Patterns

- ✅ **ISR (Incremental Static Regeneration)** - Set appropriate `revalidate` times
- ✅ **Server Components** - Default to server components
- ✅ **Image Optimization** - Use `next/image` with proper `sizes`
- ✅ **Metadata** - Implement `generateMetadata` for SEO

---

## 📚 Migration-Specific Guidelines

### When Migrating Components

1. **Review Design System** - Check DESIGN_SYSTEM.md for patterns
2. **Schemas** - Follow SCHEMA_GUIDE.md to create Effect Schemas
3. **Storybook FIRST** - Create story before implementation (see STORYBOOK.md)
4. **Component** - Implement with TypeScript + Tailwind (following DESIGN_SYSTEM.md)
5. **Tests** - Write comprehensive Vitest tests (>80% coverage)
6. **Document** - Update `MIGRATION_PLAN.md`

### Drupal API Integration

- ✅ Use Effect Schema for ALL Drupal data (follow SCHEMA_GUIDE.md)
- ✅ No S.Unknown types - always create proper schemas
- ✅ Normalize JSON:API format with mappers
- ✅ Handle errors with Effect's error handling
- ✅ Cache with ISR (don't over-fetch)
- ✅ Test with real Drupal responses

### Skills Available

See `.claude/skills/` for:

- **drupal-api-analyzer/** - Auto-generate schemas from Drupal API
- **gatsby-nextjs-migration/** - Migration patterns and best practices

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
├── .claude/                      # Claude Code configuration
│   ├── skills/                   # Reusable skills (Drupal API, migrations)
│   ├── CLAUDE.md                # THIS FILE - Project instructions
│   ├── WORKFLOW.md              # Git workflow
│   └── SETUP_VERIFICATION.md    # Setup reference
├── src/
│   ├── app/                     # Next.js 15 app directory
│   ├── components/              # React components
│   │   ├── ui/                 # shadcn/ui base components
│   │   ├── organogram/         # Organogram feature
│   │   ├── responsibility/     # Responsibility finder
│   │   └── ...                 # Feature-specific components
│   ├── lib/
│   │   ├── effect/
│   │   │   ├── schemas/        # Effect Schemas
│   │   │   └── services/       # API services
│   │   ├── mappers/            # JSON:API mappers
│   │   └── utils/              # Utility functions
│   ├── data/                    # Static data
│   │   ├── club-structure.ts   # Organogram data
│   │   └── responsibility-paths.ts  # Help system Q&A
│   └── styles/                  # Global styles
├── DESIGN_SYSTEM.md             # ⭐ AUTHORITATIVE design reference
├── SCHEMA_GUIDE.md              # ⭐ Effect Schema guide
├── STORYBOOK.md                 # ⭐ Storybook component guide
├── RESPONSIBILITY.md            # Responsibility finder docs
├── ORGANOGRAM.md                # Organogram docs (feature has issues)
├── SECURITY.md                  # Security policies
├── MIGRATION_PLAN.md            # Migration tracking
├── README.md                    # Project overview
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

### Primary References (⭐ Use These First)

- **DESIGN_SYSTEM.md** - AUTHORITATIVE design reference - use for ALL components
- **SCHEMA_GUIDE.md** - Effect Schema patterns - use for ALL Drupal data
- **STORYBOOK.md** - Component development guide - use for ALL components
- **README.md** - Project overview and quick start

### Feature Documentation

- **RESPONSIBILITY.md** - Responsibility finder feature (active, needs expansion)
- **ORGANOGRAM.md** - Organogram feature (⚠️ has critical usability issues)
- **SECURITY.md** - Security policies (file upload, image handling)

### Claude Code Configuration

- **`.claude/WORKFLOW.md`** - Git workflow and branch strategy
- **`.claude/CLAUDE.md`** - THIS FILE - Primary instructions
- **`.claude/SETUP_VERIFICATION.md`** - Setup reference (historical)
- **`.claude/skills/`** - Drupal API and migration skills

### Migration Tracking

- **MIGRATION_PLAN.md** - Migration progress (use `npm run migration:status`)

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

---

## 📝 Recent Documentation Updates (2025-12-30)

### New Documentation Files

- **STORYBOOK.md** - General Storybook guide (replaced feature-specific STORYBOOK_FEATURES.md)
- **SCHEMA_GUIDE.md** - Effect Schema reference (renamed from SCHEMA_ANALYSIS.md)
- **RESPONSIBILITY.md** - Consolidated from 3 separate files
- **ORGANOGRAM.md** - Consolidated from 2 separate files
- **README.md** - Completely rewritten with comprehensive project info

### Documentation Standards

When creating new features or components:

1. Check DESIGN_SYSTEM.md for design patterns
2. Follow SCHEMA_GUIDE.md for Drupal data
3. Follow STORYBOOK.md for component stories
4. Update README.md if adding major features

---

_Last Updated: 2025-12-30_
_This file is the PRIMARY source of instructions for Claude Code_
