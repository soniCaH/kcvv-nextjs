---
name: ralph-afk
description: Spawn a wave of parallel agents to implement unblocked `ready` issues, one git worktree each, then review the branches they open. Use for ralph afk, running a wave, reviewing wave branches, or working the issue queue unattended.
argument-hint: "[issue-number...]"
---

# Ralph AFK

Run the queue while the user is away. Pick the currently-unblocked `ready` issues, spawn one autonomous agent per issue in its own worktree (in parallel, in one message), review the draft PRs they open, and report the URLs as they land.

Sequential human-in-the-loop counterpart: `/ralph` (`.claude/commands/ralph.md`) and `scripts/ralph.sh`. Brief template: [AFK-BRIEF.md](AFK-BRIEF.md).

This skill follows `/ralph`'s conventions — same `blockedBy` gate, same worktree paths, same quality gate, same TDD loop — and where one here disagrees with `.claude/commands/ralph.md`, that file wins.

Two things differ on purpose, because a wave is not one issue at a time. Both live in step 5: the last gate runs at the orchestrator instead of inside the worker, and agents leave the issue on `in-progress` for the orchestrator to flip. Keep this paragraph honest — a stale parity claim is worse than no claim.

## Process

**You** run every step here, in the main checkout, as the orchestrator. Spawned agents run only what their brief tells them, inside their own worktree — they never call `unblocked-issues.sh` or `wave-check.sh`. Both scripts are repo-root-relative, so run them from the repository root; they need `gh` and `git` on PATH and nothing else.

### 0. Prune merged worktrees

Prior runs leave worktrees behind. Garbage-collect the merged ones before computing the wave:

```bash
source ~/.nvm/nvm.sh && nvm use >/dev/null 2>&1
git fetch --prune origin
git worktree list
```

For each `../kcvv-issue-<N>`, name the branch explicitly — a bare `gh pr view` reads the _current_ branch, which here is whatever the main checkout is on, not the worktree's:

```bash
gh pr view "feat/issue-<N>" --json state,url --jq '.state'
```

When that prints `MERGED`:

```bash
git worktree remove ../kcvv-issue-<N> --force
git branch -d feat/issue-<N>   # safe — refuses if unmerged
```

Leave worktrees whose PR is still open — those are under review. Report what you pruned.

### 1. Determine the wave

If the user passed explicit issue numbers, put each one through the same gate the automatic path uses — a named issue is not a pre-approved one:

```bash
gh issue view <N> --json state,labels --jq '"\(.state) \([.labels[].name] | join(","))"'
```

Keep it only when the state is `OPEN`, the labels include `ready`, and `./scripts/unblocked-issues.sh` lists it. Anything else stops with the reason, per the hard rules below.

Otherwise build the wave automatically:

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

Open the wave board first — one task per issue, so a running wave is legible at a glance. `Agent()` has no name input: a spawned agent's name is its `subagent_type`, so all four read `kcvv-implementer` and the board is what carries the issue numbers.

```text
TaskCreate({ subject: "#<N> — <short title>",
             activeForm: "#<N> <short title>",
             description: "<the one-line scope from step 1>" })
```

Mark each task `in_progress` as you spawn its agent.

Then, in a **single message**, one `Agent()` call per issue:

```text
Agent({ description: "Issue <N> — <short title>",
        subagent_type: "kcvv-implementer",
        prompt: "<self-contained brief from step 2>" })
```

`kcvv-implementer` (`.claude/agents/kcvv-implementer.md`) pins the model, effort, and turn ceiling for wave work; `general-purpose` would inherit all three from your session instead. If wave agents compact mid-run or their branches come back rough, raise the tier in that file rather than editing this one. PR #2678 has the measurements behind the values.

**Do not pass `isolation: "worktree"`.** The harness worktree does not follow this repo's `../kcvv-issue-<N>` + `feat/issue-<N>` convention and skips the KCVV bootstrap (corepack pnpm, api-contract build, `.env.local`). The brief has the agent create its own worktree the repo way, so `/ralph` and `scripts/ralph.sh` can find and clean up after it.

Flip labels for the whole wave **before** spawning, so `gh issue list --label in-progress` is honest while agents run:

```bash
gh issue edit <N> --remove-label "ready" --add-label "in-progress"
```

### 4. Report back as agents finish

You are notified as each background agent completes. For each:

- Capture the PR URL.
- Note blockers it hit (the brief tells agents to comment-and-stop, never to work around a blocker).
- Mark its board task `completed`, so the board tracks the wave rather than outliving it.

If an agent finished **without** opening a PR, roll its label back so the queue stays truthful:

```bash
gh issue edit <N> --remove-label "in-progress" --add-label "ready"
```

When the wave is done, present a table: issue · PR URL · status (draft / blocked / failed) · what it skipped.

### 5. Review each branch — this part is yours

Wave agents run on a cheaper tier than you do and stop at a **draft** PR, because `/code-review` pins no model of its own: run inside a wave agent it would inherit that agent's tier and grade its own homework. You are the Opus context in this pipeline, so the review sits here.

#### 5a. Price the branch before you review it

The review level is **derived from the diff, not chosen by feel, and never chosen by the agent that wrote the code**. Run this probe in the worktree — four greps, near-zero cost:

```bash
cd ../kcvv-issue-<N>
# 1. Shared reach — did something with many consumers change?
git diff --name-only origin/main...HEAD | grep -E 'lib/(utils|repositories|mappers)/|components/design-system/|packages/|globals\.css|DESIGN\.md|api-contract'
# 2. Deletions and renames — did a component with consumers go away?
git diff --diff-filter=DR --name-only origin/main...HEAD
# 3. Reachability and exposure — hrefs, query filters, data gates
git diff origin/main...HEAD -- '*.ts' '*.tsx' | grep -E '^\+.*(href:|href=|notFound\(|showInNavigation|archived|filter\(|robots)'
# 4. Resting pixels — how many baselines moved?
git diff --name-only origin/main...HEAD | grep -c '__snapshots__'
```

Read the result as a ladder — **the first rung that matches wins**:

| Level      | Trips when                                                                                                    |
| ---------- | ------------------------------------------------------------------------------------------------------------- |
| **high**   | Probe 1 hits · or probe 2 hits · or probe 3 hits · or probe 4 is ≥ 20                                         |
| **medium** | New self-contained code only: no shared edits, no deletions, no reachability changes, fewer than 20 baselines |
| **low**    | Docs, comments, config or stories only, and zero baselines                                                    |

Then:

1. `/code-review <level> ../kcvv-issue-<N>`.
2. A **single altitude agent** — only at `high`, and only when the branch introduces a new abstraction, a shared primitive, or a second copy of something.

**Diff size is not a risk signal, and treating it as one is the trap this section exists to close.** On the 2026-09-02 wave, #2656 had the _narrowest_ diff — four files the issue named individually — and produced the wave's most severe finding: 16 stale VR baselines that would have failed CI, caught only by pixel-scanning the committed PNGs. It trips probe 1 (a shared `OUTCOME_UNDERLINE` in `lib/utils/match-display.ts`, read by four surfaces) and probe 4. Meanwhile #2581's 66-file diff was high for a different reason — probe 3, an `href` that 404s on youth fixtures.

Set expectations honestly: on a wave of four real feature branches, most or all will price as `high` and this saves nothing. It pays on waves carrying doc, config, story or single-literal issues, where a `high` pass is pure waste. **The fan-out cut above is the change that saves money on a normal wave; this one stops you overpaying on a quiet one.**

Never let the level be argued down by how confident the implementing agent sounds. It has not seen its own blind spots — that is the entire reason the review is here and not there.

**Do not run `/simplify` as written here.** Its four-agent fan-out is the most expensive thing in the whole pipeline and the worst value in it. Measured on the 2026-09-02 wave (#2575): 438k tokens for one branch — more than three `/code-review` passes — and three of its four angles either duplicated findings `/code-review` had already reported or returned trivia (an import path, some comment trimming). The **altitude** angle alone produced both findings that mattered: the duplicated grid track that the "One grid" AC forbade, and the class-string test that violated an explicit "never compare class strings" criterion.

So run the altitude angle as one `Agent()` call with the diff and the issue's own acceptance criteria, and skip the other three. Reuse and simplification findings that matter show up in `/code-review high` anyway; efficiency findings are worth a separate agent only when the diff touches an image projection, a query, or a hot path.

Budget context, so this stays a judgement and not a superstition: on that wave the review layer was ~1.09M tokens against ~1.58M for the four implementers — 41% of the run. Review agents run on Opus while wave agents run on Sonnet, so review tokens cost more _and_ there are more of them. Cutting the fan-out takes the review layer to roughly 25% without giving up a single finding that caught a real bug.

Send the confirmed findings back to that issue's agent with `SendMessage` — it still holds the full context of its own change and applies fixes far more cheaply than you can re-derive them. Refute false positives with a one-line reason instead of forwarding them. Apply the fixes in the worktree yourself only when the agent is no longer reachable.

When the fixes land and `check-all` passes again, release the PR:

```bash
gh pr ready <pr-url>
gh issue edit <N> --remove-label "in-progress" --add-label "ready-for-review"
```

`gh pr ready` says the branch has been reviewed. Leave a PR in draft and say so if its findings are unresolved.

This review is the wave's **last gate** (`.claude/CLAUDE.md`) — weigh that when you decide how hard to look and what to wave through as out of scope. Done when every finding on every branch is either applied or refuted in one line, and you can say which is which.

You do control which branch spends CodeRabbitAI's one review an hour: whichever PR you mark ready first wins the race. Order them riskiest-first — the biggest diff, the one touching shared code, the one whose findings you were least sure about.

### 6. Check the merge order before the user merges anything

Every branch in the wave came off the same `origin/main`, so merging one can break the others. Run this and include its output with the table above:

```bash
./scripts/wave-check.sh
```

It is read-only — no checkout, no working-tree change. It reports which branches no longer merge into `main` (rebase those), which pairs collide, and the exact files they fight over. Read the filenames before reacting: a collision in `pnpm-lock.yaml` means the wave broke the collision-class rule in step 1 and one branch just needs the lockfile re-derived; a collision in a route or component is a real design overlap worth a human decision.

Tell the user the safe merge order: everything that collides with nothing merges in any order, and each colliding pair gets one merged first, the other rebased after.

### 7. Optional follow-up wave

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
