# Claude Code Workflow for KCVV Migration

**Established:** 2025-12-29
**Type:** Hybrid (Auto-branch + Ask-for-PR)

## Workflow Pattern

### When You Start a New Task

**You say:**

```
"Let's migrate the ranking page"
"Add a new match calendar component"
"Fix the sponsor grid layout"
```

**I automatically:**

1. ✅ **Create feature branch** based on task type:
   - `migrate/ranking-page` (for migrations)
   - `feat/match-calendar` (for features)
   - `fix/sponsor-grid-layout` (for fixes)

2. ✅ **Switch to the branch**

3. ✅ **Implement the task** following standards:
   - Effect Schema for data
   - Vitest tests (>80% coverage)
   - Storybook stories
   - TypeScript strict mode
   - Tailwind CSS styling

4. ✅ **Commit as I go** with conventional commits:
   - `migrate(ranking): add ranking table component`
   - `feat(calendar): implement match calendar view`
   - `fix(sponsors): resolve grid layout issue`

5. ✅ **Run quality checks** before finalizing:
   - `npm run check-all`

6. ✅ **Push to remote** when ready

7. ❓ **Ask about PR:**

   ```
   I've completed the ranking page migration. The branch is pushed.

   Would you like me to create a pull request?
   ```

### When Creating a PR

**You approve:**

```
"Yes, create the PR"
"Go ahead"
```

**I then:**

1. Generate PR description from commits
2. Create PR using GitHub MCP
3. Add appropriate labels
4. Provide PR URL

**PR Template:**

```markdown
## Summary

[Brief description of changes]

## Changes

- Component implementation
- Tests added
- Storybook stories created
- Effect schema (if applicable)

## Checklist

- [x] All tests passing
- [x] No TypeScript errors
- [x] No ESLint errors
- [x] Storybook stories added
- [x] MIGRATION_PLAN.md updated

## Screenshots

[If applicable]
```

## Branch Naming Convention

| Task Type     | Branch Pattern        | Example                |
| ------------- | --------------------- | ---------------------- |
| **Migration** | `migrate/[page-name]` | `migrate/ranking-page` |
| **Feature**   | `feat/[feature-name]` | `feat/match-calendar`  |
| **Bug Fix**   | `fix/[issue-name]`    | `fix/sponsor-grid`     |
| **Refactor**  | `refactor/[area]`     | `refactor/api-client`  |
| **Test**      | `test/[component]`    | `test/article-card`    |

## Commit Message Format

```
<type>(<scope>): <description>

[optional body]
[optional footer]
```

**Types:** `migrate`, `feat`, `fix`, `test`, `docs`, `refactor`, `style`, `perf`, `ci`, `build`, `chore`

**Scopes:** `news`, `matches`, `teams`, `players`, `sponsors`, `calendar`, `ranking`, `api`, `ui`, `schema`, `migration`, `config`, `deps`

## Quality Gates

Before pushing, I verify:

- ✅ ESLint passes
- ✅ TypeScript passes
- ✅ All tests pass
- ✅ Build succeeds

## Examples

### Example 1: Migration Task

```
You: "Let's migrate the team detail page"

Me:
"I'll create a feature branch for this migration."
[Creates migrate/team-detail-page]
[Implements page with Effect schema, tests, stories]
[Commits: "migrate(teams): add team detail page with roster display"]
[Runs checks, pushes]

"I've completed the team detail page migration. All tests pass.
Would you like me to create a pull request?"

You: "Yes"

Me:
[Creates PR with description]
"PR created: https://github.com/.../pull/123"
```

### Example 2: Feature Task

```
You: "Add a search bar to the news page"

Me:
"I'll create a feature branch for this."
[Creates feat/news-search-bar]
[Implements search component]
[Commits: "feat(news): add search bar with real-time filtering"]
[Runs checks, pushes]

"Search bar implemented and tested. Ready for PR?"

You: "Not yet, I want to test it first"

Me:
"No problem! The branch is pushed. Test it out and let me know when
you want to create the PR."
```

### Example 3: Bug Fix

```
You: "The sponsor grid is broken on mobile"

Me:
"I'll create a fix branch and investigate."
[Creates fix/sponsor-grid-mobile]
[Analyzes issue, implements fix]
[Commits: "fix(sponsors): resolve grid layout on mobile viewports"]
[Runs visual regression tests]
[Pushes]

"Fixed the mobile layout issue. Visual regression tests confirm it
matches the design. Create PR?"

You: "Yes"

Me:
[Creates PR with before/after screenshots]
```

## Special Cases

### Multiple Related Changes

If you're working on something that spans multiple commits:

```
Me: [Auto-creates branch]
    [Commit 1: Initial implementation]
    [Commit 2: Add tests]
    [Commit 3: Fix TypeScript errors]
    [Commit 4: Add stories]
    [Pushes all commits]

"All commits are on migrate/ranking-page and pushed.
Create PR now or continue working?"
```

### Urgent Fixes

For hot fixes to production:

```
You: "Urgent: sponsors page is down"

Me: "Creating hotfix branch from main"
    [Creates hotfix/sponsors-page-down]
    [Quick fix]
    [Fast-track checks]

"Fix ready. This is urgent - create PR for immediate merge?"
```

### Continuing Work

If you come back to a task:

```
You: "Continue working on the ranking page"

Me: [Checks if branch exists]
    "Switching to existing branch migrate/ranking-page"
    OR
    "Creating new branch migrate/ranking-page"

    [Continues implementation]
```

## Interruptions

If you need to switch tasks mid-work:

```
You: "Stop, I need to fix something else first"

Me: [Commits current work-in-progress]
    "Work committed to migrate/ranking-page.
    What would you like to work on?"

    [Waits for new task, creates appropriate branch]
```

## My Responsibilities

✅ **I will always:**

- Create appropriate feature branch automatically
- Use conventional commit format
- Run quality checks before pushing
- Ask before creating PRs
- Update MIGRATION_PLAN.md for migrations
- Keep commits clean and atomic

❌ **I will never:**

- Create PR without asking
- Push broken code
- Skip quality checks
- Force push without warning
- Commit directly to main

## Your Responsibilities

✅ **You provide:**

- Clear task description
- Approval for PR creation
- Feedback on implementation
- Decision on when to merge

## Quick Reference

| Scenario         | What I Do Automatically        | What I Ask               |
| ---------------- | ------------------------------ | ------------------------ |
| New task         | Create branch, implement, push | "Create PR?"             |
| Multiple commits | Batch commits, push all        | "Create PR?"             |
| Urgent fix       | Fast-track, push               | "Create PR immediately?" |
| Continue work    | Resume branch, push updates    | "Create PR?"             |
| Task switch      | Save WIP, new branch           | "What next?"             |

## Configuration

This workflow is stored in:

- `.claude/WORKFLOW.md` (this file)
- Memory MCP (remembered across sessions)
- `.claude/CLAUDE.local.md` (project instructions)

## Modifying the Workflow

Want to change something? Just tell me:

- "Always create PRs automatically" → I'll do it
- "Never create PRs, just push" → I'll adapt
- "Ask me about branches too" → I'll ask first

I'll update this file and my memory accordingly.
