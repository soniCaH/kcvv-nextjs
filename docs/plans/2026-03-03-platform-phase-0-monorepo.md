# Platform Phase 0 — Monorepo Setup Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the current `kcvv-nextjs` repo into a Turborepo monorepo root with the Next.js app at `apps/web/` and a skeleton `packages/api-contract/` package, without breaking the live Vercel deployment or CI/CD pipeline.

**Architecture:** The repo root becomes a workspace host (Turborepo + **pnpm workspaces**). All Next.js source moves into `apps/web/` using `git mv` to preserve history. A minimal `packages/api-contract/` is scaffolded with TypeScript + Effect ready for Phase 1. Root-level tooling (husky, commitlint, `.claude/`, `.github/`) stays at the root.

**Tech Stack:** Turborepo, **pnpm workspaces**, TypeScript, Effect (`effect`, `@effect/platform`), existing Next.js stack unchanged.

> ⚠️ **Amendment (Tasks 1-3 already completed with npm):** Task 3b below switches the package manager to pnpm before the big file move. All tasks from 4 onwards use pnpm. npm was used to bootstrap — pnpm takes over from here.

---

## Context & Rules

- Every commit must pass the existing husky pre-commit (lint-staged + type-check) and commitlint (scope must be one of: `news, matches, teams, players, sponsors, calendar, ranking, api, ui, schema, migration, config, deps`)
- Use scope `config` for monorepo structure commits, `migration` for content/app moves, `api` for api-contract package
- Run `pnpm run check-all` from `apps/web/` before any push
- All work is on branch `feat/platform-phase-0-monorepo` (create it first)
- Vercel deployment must stay live throughout — never break `main`
- After every GitHub issue created, run: `gh project item-add 2 --owner soniCaH --url <issue-url>`

---

## Task 1: Create feature branch

**Files:** none (git only)

**Step 1: Create and push the branch**

```bash
git checkout -b feat/platform-phase-0-monorepo
git push -u origin feat/platform-phase-0-monorepo
```

Expected: branch created, tracking remote.

---

## Task 2: Add Turborepo and workspace root `package.json`

**Files:**

- Modify: `package.json` (root — becomes workspace root)
- Create: `turbo.json`

**Step 1: Install turbo at root**

```bash
npm install turbo --save-dev --package-lock-only
```

We use `--package-lock-only` for now — the actual workspace install happens after the files are moved in Task 4.

**Step 2: Update root `package.json`**

Add `workspaces` and `turbo` fields. Keep `husky`, `commitlint`, and `lint-staged` at root (they are git-level tools, not app-level). Remove all Next.js / app-level deps from root — they will live in `apps/web/package.json`.

The root `package.json` should look like:

```json
{
  "name": "kcvv",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "test": "turbo test",
    "lint": "turbo lint",
    "type-check": "turbo type-check",
    "prepare": "husky"
  },
  "devDependencies": {
    "@commitlint/cli": "<keep existing version>",
    "@commitlint/config-conventional": "<keep existing version>",
    "husky": "<keep existing version>",
    "lint-staged": "<keep existing version>",
    "turbo": "<installed version>"
  }
}
```

> **Note:** Copy the exact version strings from the current `package.json` for commitlint, husky, lint-staged. All other deps (Next.js, React, Effect, Tailwind, Vitest, Storybook etc.) move to `apps/web/package.json` in Task 4.

**Step 3: Create `turbo.json`**

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "type-check": {
      "dependsOn": ["^build"]
    }
  }
}
```

**Step 4: Commit**

```bash
git add package.json turbo.json
git commit -m "feat(config): add turborepo and workspace root package.json"
```

---

## Task 3: Create the `apps/web/` workspace

**Files:**

- Create: `apps/web/` (directory)
- Create: `apps/web/package.json`

**Step 1: Create directory**

```bash
mkdir -p apps/web packages
```

**Step 2: Create `apps/web/package.json`**

This gets all the app-level dependencies from the current root `package.json`. Copy the entire `dependencies` and `devDependencies` from the root (minus `husky`, `lint-staged`, `@commitlint/*`, `turbo` — those stay at root). Add a `name` field:

```json
{
  "name": "@kcvv/web",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "lint:fix": "eslint --fix .",
    "type-check": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:changed": "vitest run --changed",
    "test:related": "vitest related --run",
    "test:clear-cache": "vitest --clearCache",
    "test:no-cache": "vitest run --no-cache",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build",
    "check-all": "npm run lint && npm run type-check && npm run test && npm run build",
    "build:responsibility": "tsx scripts/generate-responsibility-data.ts",
    "watch:responsibility": "tsx watch scripts/generate-responsibility-data.ts",
    "migration:status": "node scripts/migration-status.js",
    "migration:create": "node scripts/migration-create.js"
  },
  "dependencies": { "<copy all from current root package.json dependencies>" },
  "devDependencies": { "<copy all app-level devDependencies from current root package.json>" }
}
```

**Step 3: Commit the empty workspace**

```bash
git add apps/ packages/
git commit -m "feat(config): scaffold apps/web and packages workspace directories"
```

---

## Task 3b: Switch package manager from npm to pnpm

Tasks 1-3 used npm to bootstrap. Switch to pnpm before the big file move so everything from Task 4 onwards uses pnpm correctly.

**Files:**

- Create: `pnpm-workspace.yaml`
- Modify: `package.json` (root — add `packageManager` field, remove `workspaces` field)
- Modify: `apps/web/package.json` (update `@kcvv/api-contract` dep to `workspace:*`)
- Delete: `package-lock.json`

**Step 1: Install pnpm globally (if not already installed)**

```bash
npm install -g pnpm@latest
```

Verify: `pnpm --version` (should print 9.x or later)

**Step 2: Create `pnpm-workspace.yaml` at monorepo root**

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

**Step 3: Update root `package.json`**

Remove the `"workspaces"` field (pnpm uses `pnpm-workspace.yaml` instead) and add `packageManager`:

```json
{
  "name": "kcvv",
  "private": true,
  "packageManager": "pnpm@9.15.4",
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "test": "turbo test",
    "lint": "turbo lint",
    "type-check": "turbo type-check",
    "prepare": "husky"
  },
  "devDependencies": {
    "@commitlint/cli": "<keep existing>",
    "@commitlint/config-conventional": "<keep existing>",
    "husky": "<keep existing>",
    "lint-staged": "<keep existing>",
    "turbo": "<keep existing>"
  }
}
```

> Use the exact pnpm version from `pnpm --version` for the `packageManager` field.

**Step 4: Update `apps/web/package.json` internal dependency**

Change the `@kcvv/api-contract` dependency to use pnpm's workspace protocol:

```json
"@kcvv/api-contract": "workspace:*"
```

**Step 5: Delete `package-lock.json`**

```bash
rm package-lock.json
```

**Step 6: Install with pnpm**

```bash
pnpm install
```

This generates `pnpm-lock.yaml` and creates `node_modules` via pnpm's content-addressable store.

**Step 7: Update Renovate to recognise pnpm**

In `renovate.json`, add `"pnpm"` to `enabledManagers`:

```json
"enabledManagers": ["npm", "pnpm", "nvm", "github-actions", "dockerfile"]
```

**Step 8: Verify basic commands work**

```bash
pnpm run type-check          # from root (runs tsc at root — still fine at this stage)
pnpm --filter @kcvv/web run type-check   # targets apps/web
```

**Step 9: Commit**

```bash
git rm package-lock.json
git add pnpm-workspace.yaml pnpm-lock.yaml package.json apps/web/package.json renovate.json
git commit -m "feat(config): switch package manager from npm to pnpm"
```

---

## Task 4: Move Next.js source into `apps/web/` with git history

This is the most critical task. Use `git mv` for everything so git history is preserved.

**Files to move** (from root → `apps/web/`):

```
src/              → apps/web/src/
public/           → apps/web/public/
content/          → apps/web/content/
scripts/          → apps/web/scripts/
tests/            → apps/web/tests/
next.config.ts    → apps/web/next.config.ts
tsconfig.json     → apps/web/tsconfig.json
vitest.config.ts  → apps/web/vitest.config.ts
postcss.config.mjs → apps/web/postcss.config.mjs
eslint.config.mjs → apps/web/eslint.config.mjs
next-env.d.ts     → apps/web/next-env.d.ts
.storybook/       → apps/web/.storybook/
```

**Files to KEEP at root** (do not move):

```
.github/          ← CI/CD stays at git root
.claude/          ← Claude hooks stay at git root
CLAUDE.md         ← stays at root (will be updated later)
docs/             ← architecture docs stay at root
renovate.json     ← stays at root
commitlint.config.js ← stays at root
.nvmrc            ← stays at root
.gitignore        ← stays at root
*.md              ← DESIGN_SYSTEM.md, MIGRATION_PLAN.md etc. stay at root
package.json      ← already updated (workspace root)
turbo.json        ← already created
```

**Step 1: Run all git mv commands**

```bash
git mv src apps/web/src
git mv public apps/web/public
git mv content apps/web/content
git mv scripts apps/web/scripts
git mv tests apps/web/tests
git mv next.config.ts apps/web/next.config.ts
git mv tsconfig.json apps/web/tsconfig.json
git mv vitest.config.ts apps/web/vitest.config.ts
git mv postcss.config.mjs apps/web/postcss.config.mjs
git mv eslint.config.mjs apps/web/eslint.config.mjs
git mv next-env.d.ts apps/web/next-env.d.ts
git mv .storybook apps/web/.storybook
```

**Step 2: Verify git sees renames (not deletes)**

```bash
git status
```

Expected: all moved files show as `renamed: src/... -> apps/web/src/...` — **not** as deleted + untracked. If any show as deleted, stop and investigate before continuing.

**Step 3: Commit the move**

```bash
git commit -m "feat(migration): move nextjs app into apps/web workspace"
```

Do NOT run lint or type-check yet — paths are broken until Task 5.

---

## Task 5: Fix internal path references in `apps/web/`

After the move, several config files have broken relative paths. Fix them all.

**Files:**

- Modify: `apps/web/tsconfig.json`
- Modify: `apps/web/vitest.config.ts`
- Modify: `apps/web/next.config.ts`

**Step 1: Update `apps/web/tsconfig.json`**

The `paths` alias `@/*` must point to `./src/*` (relative to `apps/web/`). The `include` array must reference `next-env.d.ts` which is now alongside it. This should already be correct since paths were relative to `tsconfig.json` — but verify:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts"
  ],
  "exclude": ["node_modules", "../../docs/archive"]
}
```

Change `"exclude": ["node_modules", "docs/archive"]` → `"exclude": ["node_modules", "../../docs/archive"]`

**Step 2: Update `apps/web/vitest.config.ts`**

The `@` alias path must be absolute from `apps/web/`:

```typescript
resolve: {
  alias: {
    "@": path.resolve(__dirname, "./src"),  // ← already relative, should work
  },
},
```

Also update `setupFiles` — it references `./tests/setup.ts` which is now at `apps/web/tests/setup.ts`. Since vitest runs from `apps/web/`, this relative path is still correct. Verify nothing else changed.

**Step 3: Update `apps/web/next.config.ts`**

The `spawn("npm", ["run", "watch:responsibility"])` call uses npm scripts — these resolve relative to the working directory when Next.js runs, which will now be `apps/web/`. Since `scripts/generate-responsibility-data.ts` also moved to `apps/web/scripts/`, the npm script still works. No changes needed unless the script uses `__dirname` to reference files.

Check `apps/web/scripts/generate-responsibility-data.ts` for any hardcoded paths from the old root and update them to be relative to the new location.

**Step 4: Update `apps/web/next.config.ts` image remote patterns**

The `api.kcvvelewijt.be` and CloudFront hostname patterns stay unchanged — no path changes needed.

**Step 5: Verify type-check passes**

```bash
cd apps/web && npm run type-check
```

Expected: no errors. Fix any path errors before continuing.

**Step 6: Commit**

```bash
cd ../..  # back to monorepo root
git add apps/web/tsconfig.json apps/web/vitest.config.ts apps/web/next.config.ts
git commit -m "feat(config): fix internal path references after monorepo move"
```

---

## Task 6: Install dependencies with pnpm and verify the move

**Step 1: Clean and reinstall from monorepo root**

```bash
rm -rf node_modules apps/web/node_modules packages/api-contract/node_modules
pnpm install
```

pnpm links workspace packages via its content-addressable store. `@kcvv/api-contract` is automatically symlinked into `apps/web/node_modules/@kcvv/api-contract`.

**Step 2: Verify Next.js dev server starts**

```bash
pnpm --filter @kcvv/web dev
```

Expected: Next.js starts on `localhost:3000` with no errors.

**Step 3: Verify tests pass**

```bash
pnpm --filter @kcvv/web test
```

Expected: all tests pass (same as before the move).

**Step 4: Verify Storybook builds**

```bash
pnpm --filter @kcvv/web build-storybook
```

Expected: Storybook builds without errors.

**Step 5: Commit updated lock file**

```bash
git add pnpm-lock.yaml
git commit -m "feat(config): update pnpm lock file after workspace install"
```

---

## Task 7: Update Vercel deployment configuration

Vercel currently deploys from the repo root. After moving Next.js to `apps/web/`, it needs to know the new root directory.

**Option A — via `vercel.json` (preferred, version-controlled)**

Create `vercel.json` at the **monorepo root**:

```json
{
  "buildCommand": "turbo build --filter=@kcvv/web",
  "outputDirectory": "apps/web/.next",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "rootDirectory": "apps/web"
}
```

**Step 1: Create `vercel.json`**

```bash
# Create at monorepo root
```

Create the file with the content above.

**Step 2: Verify build output path**

In `apps/web/next.config.ts`, Next.js outputs to `.next/` relative to `apps/web/`. The `outputDirectory` in `vercel.json` is relative to the monorepo root, so `apps/web/.next` is correct.

**Step 3: Commit**

```bash
git add vercel.json
git commit -m "feat(config): add vercel.json for monorepo root directory"
```

---

## Task 8: Update GitHub Actions CI/CD

The CI workflow runs commands from the repo root. After the move, app-level commands (`npm run lint`, `npm run test`, `npm run build`) need to run from `apps/web/` or via `turbo`.

**Files:**

- Modify: `.github/workflows/ci.yml`

**Step 1: Update `ci.yml` to use turbo**

Replace app-specific `npm run ...` commands with `turbo` equivalents that know about workspaces. Key changes:

```yaml
- name: Install dependencies
  run: npm ci
  # ← runs from monorepo root, installs all workspaces

- name: Lint
  run: npx turbo lint --filter=@kcvv/web

- name: Type check
  run: npx turbo type-check --filter=@kcvv/web

- name: Run tests
  run: npx turbo test --filter=@kcvv/web

- name: Build Next.js
  run: npx turbo build --filter=@kcvv/web

- name: Build Storybook
  run: cd apps/web && npm run build-storybook

- name: Upload coverage
  uses: codecov/codecov-action@v5
  with:
    token: ${{ secrets.CODECOV_TOKEN }}
    directory: apps/web/coverage # ← updated path
```

The `migration-status` job and `security-scan` job also need `working-directory` updated:

```yaml
- name: Generate migration report
  working-directory: apps/web
  run: npm run migration:status
```

**Step 2: Update `codeql.yml`**

CodeQL scans the whole repo — no changes needed. It will still find TypeScript files in `apps/web/src/`.

**Step 3: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "feat(config): update ci workflow for turborepo monorepo structure"
```

---

## Task 8b: pnpm catch-up (if Tasks 4-8 were completed with npm)

> ⚠️ **Do this task before Task 9 if pnpm was not yet set up.**
> Skip it entirely if pnpm is already in use (i.e. `pnpm-lock.yaml` exists at root).

**Step 1: Check current state**

```bash
ls pnpm-lock.yaml 2>/dev/null && echo "pnpm already set up — skip this task" || echo "npm still in use — proceed"
```

**Step 2: Install pnpm**

```bash
npm install -g pnpm@latest
```

**Step 3: Create `pnpm-workspace.yaml`**

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

**Step 4: Update root `package.json`**

- Remove `"workspaces"` field (pnpm uses `pnpm-workspace.yaml`)
- Add `"packageManager": "pnpm@<version>"` (use output of `pnpm --version`)

**Step 5: Update `apps/web/package.json`**

Change the internal dep:

```json
"@kcvv/api-contract": "workspace:*"
```

**Step 6: Update Renovate**

In `renovate.json`, add `"pnpm"` to `enabledManagers`:

```json
"enabledManagers": ["npm", "pnpm", "nvm", "github-actions", "dockerfile"]
```

**Step 7: Update `vercel.json` installCommand**

```json
"installCommand": "pnpm install"
```

**Step 8: Update CI — add pnpm setup before install step**

In `.github/workflows/ci.yml`, before every `npm ci` step, add:

```yaml
- name: Install pnpm
  uses: pnpm/action-setup@v4
  with:
    run_install: false
```

Then replace `npm ci` → `pnpm install --frozen-lockfile` and `npm run` → `pnpm run` throughout.

**Step 9: Switch to pnpm**

```bash
rm -rf node_modules apps/web/node_modules package-lock.json
pnpm install
```

**Step 10: Commit**

```bash
git rm package-lock.json
git add pnpm-workspace.yaml pnpm-lock.yaml package.json apps/web/package.json renovate.json vercel.json .github/workflows/ci.yml
git commit -m "feat(config): switch package manager to pnpm"
```

---

## Task 9: Update CLAUDE.md hierarchy

The root `CLAUDE.md` becomes platform-wide context. The existing Next.js-specific content moves to `apps/web/CLAUDE.md`.

**Files:**

- Modify: `CLAUDE.md` (root — becomes platform overview)
- Create: `apps/web/CLAUDE.md` (Next.js specifics)
- Create: `packages/api-contract/CLAUDE.md` (schema conventions)

**Step 1: Create `apps/web/CLAUDE.md`**

Move the following sections from the root `CLAUDE.md` into `apps/web/CLAUDE.md`:

- Design System & Storybook section (the full block)
- Implemented Routes list
- Test Coverage notes

Keep in root `CLAUDE.md`:

- Project overview
- Efficiency Rules
- Current State / Migration Phases table
- Git Workflow
- Development Standards
- Skills section

Add to root `CLAUDE.md` a new **Platform Architecture** section:

```markdown
## Platform Architecture

| App/Package   | Path                     | Host               | Purpose                         |
| ------------- | ------------------------ | ------------------ | ------------------------------- |
| Next.js web   | `apps/web/`              | Vercel             | Club website                    |
| Sanity Studio | `apps/studio/`           | sanity.io          | CMS admin UI                    |
| API contract  | `packages/api-contract/` | (library)          | Shared Effect schemas + HttpApi |
| PSD BFF       | `kcvv-api` repo          | Cloudflare Workers | ProSoccerData proxy + cache     |

**Design doc:** `docs/plans/2026-03-03-platform-architecture-design.md`
**GitHub Project:** https://github.com/users/soniCaH/projects/2
```

**Step 2: Create `packages/api-contract/CLAUDE.md`**

```markdown
# api-contract Package

Shared Effect Schema types and HttpApi definition consumed by both apps/web and kcvv-api.

## Rules

- All schemas use Effect Schema (`import { Schema as S } from "effect"`)
- No `S.Unknown` — every field must be typed
- Schemas here are the single source of truth — never duplicate in apps/web/src/lib/schemas/
- HttpApi groups live in `src/api/`, schemas in `src/schemas/`
- Export everything from `src/index.ts`
```

**Step 3: Commit**

```bash
git add CLAUDE.md apps/web/CLAUDE.md packages/api-contract/CLAUDE.md
git commit -m "docs(config): update claude.md hierarchy for monorepo structure"
```

---

## Task 10: Create `packages/api-contract/` skeleton

**Files:**

- Create: `packages/api-contract/package.json`
- Create: `packages/api-contract/tsconfig.json`
- Create: `packages/api-contract/src/index.ts`

**Step 1: Create `packages/api-contract/package.json`**

```json
{
  "name": "@kcvv/api-contract",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "exports": {
    ".": {
      "import": "./src/index.ts",
      "types": "./src/index.ts"
    }
  },
  "scripts": {
    "type-check": "tsc --noEmit",
    "build": "tsc --build"
  },
  "dependencies": {
    "effect": "<copy version from apps/web/package.json>",
    "@effect/platform": "<copy version from apps/web/package.json>"
  },
  "devDependencies": {
    "typescript": "<copy version from apps/web/package.json>"
  }
}
```

**Step 2: Create `packages/api-contract/tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022"],
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "skipLibCheck": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist"
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

**Step 3: Create `packages/api-contract/src/index.ts`**

```typescript
// Phase 1 will populate this package with:
// - Shared Effect Schema types (migrated from apps/web/src/lib/schemas/)
// - HttpApi groups for all ProSoccerData endpoints
// - PsdApi root export for use with HttpApiClient and HttpApiBuilder

export {};
```

**Step 4: Add `@kcvv/api-contract` as a workspace dependency of `apps/web`**

In `apps/web/package.json`, add to `dependencies`:

```json
"@kcvv/api-contract": "*"
```

**Step 5: Reinstall from root**

```bash
npm install
```

**Step 6: Verify type-check still passes for `apps/web/`**

```bash
cd apps/web && npm run type-check
```

**Step 7: Commit**

```bash
cd ../..
git add packages/api-contract/ apps/web/package.json package-lock.json
git commit -m "feat(api): scaffold api-contract package skeleton"
```

---

## Task 11: Update husky hooks for monorepo root

Husky runs from the git root — this is already correct. But some hook scripts may reference paths assuming the git root = the Next.js root. Check and fix.

**Files:**

- Modify: `.claude/hooks/warn-main-edits.sh` (if it references app paths)
- Modify: `.husky/` scripts (check for hardcoded paths)

**Step 1: Check hook scripts**

```bash
ls .husky/
cat .husky/pre-commit
cat .husky/commit-msg
```

**Step 2: Check if lint-staged config references the right paths**

In `package.json` (root), the `lint-staged` config must point to `apps/web/`:

```json
"lint-staged": {
  "apps/web/**/*.{js,jsx,ts,tsx}": [
    "eslint --fix"
  ],
  "apps/web/**/*.{json,md,yml,yaml}": [
    "prettier --write"
  ],
  "package.json": [
    "prettier --write"
  ]
}
```

Update the glob patterns to include `apps/web/` prefix. If `lint-staged` is currently configured in the root `package.json`, update the globs. If it's in a `.lintstagedrc` file, update that instead.

**Step 3: Verify pre-commit hook works**

Make a trivial change to a file in `apps/web/src/` and attempt a commit:

```bash
echo "// test" >> apps/web/src/lib/utils.ts
git add apps/web/src/lib/utils.ts
git commit -m "test(config): verify lint-staged runs on apps/web source"
# Then revert
git reset HEAD~1
git checkout apps/web/src/lib/utils.ts
```

Expected: pre-commit runs lint on the changed file, type-check runs, commit either passes or fails for the right reason (lint error on the comment we added).

---

## Task 12: Full verification

**Step 1: Clean install from monorepo root**

```bash
rm -rf node_modules apps/web/node_modules packages/api-contract/node_modules
pnpm install
```

**Step 2: Run full check suite from `apps/web/`**

```bash
pnpm --filter @kcvv/web check-all
```

Expected: lint ✅, type-check ✅, tests ✅, build ✅.

**Step 3: Verify turbo pipeline works**

```bash
pnpm turbo build --filter=@kcvv/web
pnpm turbo test --filter=@kcvv/web
```

**Step 4: Check git log shows history preserved**

```bash
git log --follow apps/web/src/app/page.tsx | head -20
```

Expected: shows commits from before the move — git history is preserved via `git mv`.

---

## Task 13: Open PR and link to GitHub Project

**Step 1: Push branch**

```bash
git push -u origin feat/platform-phase-0-monorepo
```

**Step 2: Create PR**

```bash
gh pr create \
  --title "feat(migration): Phase 0 — Turborepo monorepo setup" \
  --body "$(cat <<'EOF'
## Summary
- Transforms `kcvv-nextjs` into a Turborepo monorepo root
- Switches package manager from npm to **pnpm** (workspaces via `pnpm-workspace.yaml`)
- Moves Next.js app into `apps/web/` (git history preserved via `git mv`)
- Adds `packages/api-contract/` skeleton for Phase 1
- Updates Vercel (`installCommand: pnpm install`), CI/CD (pnpm action), husky/lint-staged, CLAUDE.md hierarchy
- Zero breaking changes to the live Vercel deployment

## Part of
Closes part of #720 (Platform Overhaul — Phase 0)
Closes #721

## Test plan
- [ ] `pnpm --filter @kcvv/web check-all` passes
- [ ] `pnpm turbo build --filter=@kcvv/web` succeeds
- [ ] Vercel preview deployment builds successfully
- [ ] Git history preserved: `git log --follow apps/web/src/app/page.tsx`
- [ ] Pre-commit hook runs lint-staged on `apps/web/` files
- [ ] `pnpm-lock.yaml` committed, `package-lock.json` deleted

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

**Step 3: Add PR to GitHub Project**

```bash
PR_URL=$(gh pr view --json url --jq '.url')
gh project item-add 2 --owner soniCaH --url "$PR_URL"
```

---

## What comes next (Phase 1)

Once this PR is merged, Phase 1 begins in a new branch:

- Migrate existing Effect schemas from `apps/web/src/lib/schemas/` → `packages/api-contract/src/schemas/`
- Define `HttpApi` groups for all PSD endpoints
- Update `apps/web/` imports to use `@kcvv/api-contract`

See `docs/plans/2026-03-03-platform-architecture-design.md` for the full picture.
