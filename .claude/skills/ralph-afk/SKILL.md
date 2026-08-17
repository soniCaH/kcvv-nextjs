---
name: ralph-afk
description: Spawn a wave of parallel agents to implement unblocked `ready` issues, one git worktree each. Use for ralph afk, running a wave, or working the issue queue unattended.
argument-hint: "[issue-number...]"
---

# Ralph AFK

Run the queue while the user is away. Pick the currently-unblocked `ready` issues, spawn one autonomous agent per issue in its own worktree (in parallel, in one message), and report PR URLs as they land.

Sequential human-in-the-loop counterpart: `/ralph` (`.claude/commands/ralph.md`) and `scripts/ralph.sh`. Brief template: [AFK-BRIEF.md](AFK-BRIEF.md).

This skill reuses `/ralph`'s conventions exactly — same labels, same `blockedBy` gate, same worktree paths, same quality gates. It only changes the shape: a parallel wave instead of one issue at a time. If a convention here ever disagrees with `.claude/commands/ralph.md`, that file wins.

## Process

**You** run every step here, in the main checkout, as the orchestrator. Spawned agents run only what their brief tells them, inside their own worktree — they never call `unblocked-issues.sh` or `wave-check.sh`. Both scripts are repo-root-relative, so run them from the repository root; they need `gh` and `git` on PATH and nothing else.

### 0. Prune merged worktrees

Prior runs leave worktrees behind. Garbage-collect the merged ones before computing the wave:

```bash
source ~/.nvm/nvm.sh && nvm use >/dev/null 2>&1
git fetch --prune origin
git worktree list
```

For each `../kcvv-issue-<N>` whose PR is merged (`gh pr view --json state` on branch `feat/issue-<N>`):

```bash
git worktree remove ../kcvv-issue-<N> --force
git branch -d feat/issue-<N>   # safe — refuses if unmerged
```

Leave worktrees whose PR is still open — those are under review. Report what you pruned.

### 1. Determine the wave

If the user passed explicit issue numbers, use those (still subject to the hard rules below). Otherwise build the wave automatically:

1. Get the eligible set. Both gates — the `ready` label and zero open blockers — live in one script, which `scripts/ralph.sh` and `/ralph` use too:

   ```bash
   ./scripts/unblocked-issues.sh
   ```

   It prints every eligible issue number, ascending. A **nonzero exit** means a `blockedBy` query failed and the set is incomplete — report that and stop, rather than building a wave from a partial queue.

2. Read the titles, so you can judge scope and collisions:

   ```bash
   gh issue view <N> --json number,title,milestone --jq '"\(.number) · \(.title) · \(.milestone.title // "no milestone")"'
   ```

3. **Mutually compatible** = drop pairs that would collide at merge. See "Collision classes" below.
4. **Cap the wave.** Default **4** agents. The bottleneck is human PR review, not agent capacity — a wave of 12 just builds a review queue. Go wider only if the user asks.

Present the proposed wave as a numbered list: issue number · title · milestone · one-line scope · why it is compatible with the others. Ask: launch all / drop some / stop.

### Collision classes (KCVV-specific)

Separate worktrees mean agents never fight at run time, but they still collide at merge. Within one wave, allow **at most one** issue that touches each of these:

| Collision class                          | Why it collides                                                                                          |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `pnpm-lock.yaml` (adds/removes a dep)    | The lockfile is prettier-formatted; every agent hand-edits the same 3 blocks. Two = guaranteed conflict. |
| Visual-regression baselines              | A scoped `-u` run rewrites baseline PNGs. Two agents capturing baselines overwrite each other.           |
| `packages/api-contract/src/`             | Every downstream app type-checks against it; two concurrent contract changes break each other's build.   |
| `packages/sanity-schemas/src/`           | Shared by both studios; concurrent schema edits conflict.                                                |
| Design tokens / `DESIGN.md` / global CSS | Site-wide; two edits to the same token file conflict and both invalidate the whole VR suite.             |
| The same route or component file         | Check the file list each issue states; two issues editing one file conflict line-for-line.               |

When in doubt, keep both — but if two issues plausibly land in the same file, serialize them across waves. It is cheaper than a merge fight.

### 2. Draft one self-contained brief per issue

Fill [AFK-BRIEF.md](AFK-BRIEF.md) per issue. The spawned agent does **not** see this conversation, so the brief must stand alone: issue number, worktree path, read-list, acceptance criteria **verbatim**, bootstrap commands, quality gates, commit/PR shape, hard rules.

Show the briefs (collapsed if many). Wait for "launch".

### 3. Spawn the wave in parallel

In a **single message**, one `Agent()` call per issue:

```text
Agent({ description: "Issue <N> — <short title>",
        subagent_type: "general-purpose",
        prompt: "<self-contained brief from step 2>" })
```

**Do not pass `isolation: "worktree"`.** The harness worktree does not follow this repo's `../kcvv-issue-<N>` + `feat/issue-<N>` convention and skips the KCVV bootstrap (corepack pnpm, api-contract build, `.env.local`). The brief has the agent create its own worktree the repo way, so `/ralph` and `scripts/ralph.sh` can find and clean up after it.

Flip labels for the whole wave **before** spawning, so `gh issue list --label in-progress` is honest while agents run:

```bash
gh issue edit <N> --remove-label "ready" --add-label "in-progress"
```

### 4. Report back as agents finish

You are notified as each background agent completes. For each:

- Capture the PR URL.
- Note blockers it hit (the brief tells agents to comment-and-stop, never to work around a blocker).

If an agent finished **without** opening a PR, roll its label back so the queue stays truthful:

```bash
gh issue edit <N> --remove-label "in-progress" --add-label "ready"
```

When the wave is done, present a table: issue · PR URL · status (opened / blocked / failed) · what it skipped.

### 5. Check the merge order before the user merges anything

Every branch in the wave came off the same `origin/main`, so merging one can break the others. Run this and include its output with the table above:

```bash
./scripts/wave-check.sh
```

It is read-only — no checkout, no working-tree change. It reports which branches no longer merge into `main` (rebase those), which pairs collide, and the exact files they fight over. Read the filenames before reacting: a collision in `pnpm-lock.yaml` means the wave broke the collision-class rule in step 1 and one branch just needs the lockfile re-derived; a collision in a route or component is a real design overlap worth a human decision.

Tell the user the safe merge order: everything that collides with nothing merges in any order, and each colliding pair gets one merged first, the other rebased after.

### 6. Optional follow-up wave

After the user merges, "again" / "next wave" re-runs from step 0. Newly-unblocked issues become eligible.

## Lifecycle between waves

This skill is **stateless across invocations**. Every run re-queries GitHub, so the dependency graph reflects whatever has been merged since.

- **The orchestrator does not auto-loop.** When the wave's PRs are open, it stops. Downstream issues only unblock once blockers close, which needs merges the orchestrator cannot do.
- **Hands-free continuation** — wrap in `/loop`, e.g. `/loop 45m /ralph-afk`. Each tick re-picks the latest unblocked wave; a tick with nothing eligible reports "no work" and exits. Use 45m+, not 5m — a wave takes far longer than that to produce reviewable PRs.
- **Drained** = `./scripts/unblocked-issues.sh` prints nothing on a zero exit. Say so explicitly, and distinguish it from a nonzero exit, which means the queue could not be read at all.

## Hard rules

Step 1's gate is not a default the user can wave through. These bind even when the user names issues explicitly.

- **Spawn only for an issue carrying `ready` with zero open blockers.** When the user names one that fails either test, say which test it failed — a missing label routes to `/spec`, an open blocker gets named — and stop.
- **One issue per collision class per wave.** The table in step 1 is the list.
- **Every agent works only inside its own `../kcvv-issue-<N>` worktree**, which survives until the human merges. The main checkout is theirs to read, never to write. When a branch guard blocks an agent, the fix is the worktree — `ALLOW_MAIN_COMMIT=1` is a human escape hatch and stays one.
- **A failed or stalled agent goes back to the user, not back into the queue.** They decide whether to re-run it under `/ralph` for closer supervision.
