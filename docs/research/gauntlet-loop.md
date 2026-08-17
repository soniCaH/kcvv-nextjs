# The gauntlet loop — what it is, who owns it, and whether it belongs in this repo

> **Provenance.** Produced 2026-08-17 by a research agent, against primary sources only. Every claim
> below is traced to the source that owns it — the author's own site, his own repository, the
> plugin's own manifest, or official Anthropic documentation. Secondary write-ups are cited **only**
> where the primary source is unreachable, and are labelled as such. Fetch failures are stated rather
> than guessed around, in [`README.md`](./README.md)'s house convention.
>
> **Why this file exists.** To decide whether the technique is worth adopting alongside
> `scripts/ralph.sh` and the new `ralph-afk` skill. The short answer is at the top.

## Verdict up front

**"Gauntlet loop" is a real, named, single-author technique — about three weeks old, coined by Matt
Shumer in late July 2026, with a primary source you can read in five minutes.** It is not vague, and
it is not a hallucinated term. But it is also not a tool, a plugin, or a skill in any official
registry: it is a _prompt shape_, and every implementation in the wild is a community repackaging.

**It solves a different problem than Ralph or worktree fan-out.** Ralph and fan-out are _throughput_
patterns — get more issues done. The gauntlet loop is a _quality-convergence_ pattern — drive **one**
artifact toward **one** external reference until a blind judge prefers yours. They do not compete and
one does not replace the other.

**For this repo: do not adopt it.** It requires a fetchable external reference per unit of work, and
a 127-issue queue of specced tickets has no such thing. It also aims at the wrong bottleneck. The one
idea worth stealing is the **separate-critic blind A/B** — and the place to put it is the PR review
gate, not the implementation loop. Details in [§7](#7-applicability-to-this-repo) and
[§8](#8-the-adjacent-technique-actually-worth-taking).

---

## 1. Is it real, and who owns it?

**Yes. Coined and named by Matt Shumer** (AI investor, former HyperWrite CEO), off the back of a
viral project called _Claude of Duty_.

### The primary sources, in order of authority

| Source                                                                                                                   | What it owns                                                                                                                                          | Status                                                                                                           |
| ------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| [`github.com/mshumer/Claude-of-Duty`](https://github.com/mshumer/Claude-of-Duty)                                         | The run itself. Created **2026-07-25**, ~3,180 stars. Contains `prompt.md` — the entire originating prompt — plus an unusually honest results section | Read in full                                                                                                     |
| [`github.com/mshumer/Claude-of-Duty/blob/main/prompt.md`](https://github.com/mshumer/Claude-of-Duty/blob/main/prompt.md) | **The canonical prompt text**, verbatim                                                                                                               | Read in full                                                                                                     |
| [`somethingbig.ai/gauntlet-loop`](https://somethingbig.ai/gauntlet-loop)                                                 | Shumer's own write-up on **his own site** (footer: "© 2026 Something Big, LLC"). The canonical method description                                     | Read                                                                                                             |
| [`x.com/mattshumer_/status/2081857631254372509`](https://x.com/mattshumer_/status/2081857631254372509)                   | Where he actually coins the name: _"driven by a technique I'm calling the Gauntlet Loop"_                                                             | **Could not read** — HTTP 402 via WebFetch, CAPTCHA via `xcancel.com`. Title text captured via search index only |

### Two facts that matter about the provenance

**The name came after the artifact.** `Claude-of-Duty`'s README never uses the words "gauntlet loop"
— not once. The repo is just a Three.js FPS with a process note. Shumer named the technique
retroactively, in the X post above, after the demo went viral. The technique is therefore _described_
by its author, but it was never _specified_ by him: there is no reference implementation, no schema,
no versioned definition.

**There is no canonical implementation, and no official packaging.** Within days of the X post,
GitHub filled with independent repackagings. None is authoritative, and none is Shumer's:

| Repo                                                                             | Created      | Stars | Note                                                                                                                                       |
| -------------------------------------------------------------------------------- | ------------ | ----- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| [`robonuggets/gauntlet-loop`](https://github.com/robonuggets/gauntlet-loop)      | 2026-08-05   | 373   | The most-adopted packaging. A single `SKILL.md`. Explicitly credits Shumer and links back to `Claude-of-Duty`                              |
| [`duolahypercho/gauntlet-loop`](https://github.com/duolahypercho/gauntlet-loop)  | 2026-07-27   | 129   | Earliest packaging                                                                                                                         |
| [`jolbol1/apex-gp`](https://github.com/jolbol1/apex-gp)                          | 2026-08-02   | 25    | Not a packaging — a _second independent run_ of the technique, with published cost data. See [§3](#3-what-the-technique-actually-produced) |
| `NicholasSpisak`, `trilwu`, `PARAD111GM`, `MyriadSecurity`, `kamtS`, `ugulay`, … | Jul–Aug 2026 | 0–3   | A dozen more near-identical forks of the same idea                                                                                         |

**`mshumer` has published no `gauntlet-loop` repo of his own.** His repository list shows
`Claude-of-Duty` (2026-07-25) and nothing else on the subject.

---

## 2. What it actually does — mechanism, loop shape, termination

### The entire original prompt

This is `prompt.md` from `Claude-of-Duty`, verbatim and complete. The README's framing is that this
is "the entire prompt that produced this repository" — roughly 55k lines across 11 subsystems.

```text
I want you to build a first-person shooter at the level of the most recent Call of Duty games. It
should be utterly perfect, visually beautiful, with every single thing done at AAA quality—from
textures to physics to anything you could think of.

Fan out sub-agents and have sub-agents tackle each one individually so that the game is utterly
perfect. You should /loop on each item and have a separate sub-agent check it visually to ensure it
looks triple A. That separate sub-agent should be a really harsh critic, and if it doesn't look
triple A, it should keep going.

Don't stop until each sub-agent is utterly wowed with the quality when compared with the actual Call
of Duty game. It should literally compare them side by side blind and say which one looks better. Do
this in ThreeJS. /loop until it's utterly perfect. Fan out sub-agents and ultracode.
```

That is the whole technique. Everything else written about it is elaboration.

### The loop shape

```text
             ┌──────────────────────────────────────────────┐
             │  LEAD AGENT                                  │
             │  goal + a named, fetchable external BAR      │
             │  decomposes into independently judgeable     │
             │  pieces — the agent decides the split,       │
             │  not the human                               │
             └───────────────────┬──────────────────────────┘
                                 │  fan out, one pair per piece
        ┌────────────────────────┼────────────────────────┐
        ▼                        ▼                        ▼
  ┌───────────┐            ┌───────────┐            ┌───────────┐
  │ BUILDER   │            │ BUILDER   │            │ BUILDER   │
  └─────┬─────┘            └─────┬─────┘            └─────┬─────┘
        │ artifact               │                        │
        ▼                        ▼                        ▼
  ┌─────────────────────────────────────────────────────────────┐
  │ CRITIC — a SEPARATE agent, FRESH context.                   │
  │ Opens the real output. Fetches the real bar.                │
  │ Blind A/B with labels stripped: "which is better?"          │
  │ Binary, not a score. Names the single biggest gap.          │
  └───────────────┬─────────────────────────┬───────────────────┘
                  │ ours loses              │ ours wins
                  │ → back to builder       │ → piece exits
                  └──────── loop ───────────┘
```

Three load-bearing properties, per Shumer's own write-up at
[`somethingbig.ai/gauntlet-loop`](https://somethingbig.ai/gauntlet-loop):

1. **A real, fetchable bar.** _"You give a lead agent a goal and a real example of what great looks
   like."_ Not a rubric, not "make it amazing" — a concrete artifact the critic can screenshot, run,
   read, or open. This is the part that carries the whole technique.
2. **Builder and critic must be separate agents with separate context.** Shumer's stated failure
   mode: _"the builder and critic should be separate agents"_ — a builder remembers its own decisions
   and rationalises them, producing "reasonable" work rather than better work.
3. **Blind, binary comparison rather than scoring.** Labels stripped, pick A or B. Scores out of ten
   drift upward every round.

### Termination condition

**There is no automatic exit.** Shumer states termination as three human-side conditions: stop
_"when you like the result, when improvements become too small to matter, or when you have spent as
much compute as you are willing to spend."_

The prompt's nominal exit — "loop until the critic picks ours blind" — is a bar the run is expected
to _fail_, and did (see [§3](#3-what-the-technique-actually-produced)). Every community packaging
converges on the same rule: the exit is winning the comparison **or the operator stopping the run**,
never a round count.

### `ultracode` and `/loop` are real Claude Code features

The prompt's last line is not folklore. Per the official docs at
[`code.claude.com/docs/en/workflows`](https://code.claude.com/docs/en/workflows), `ultracode` is a
keyword that opts a single prompt into a **dynamic workflow** — a JavaScript orchestration script
Claude writes and a background runtime executes, spawning subagents at scale. Documented hard limits:
**up to 16 concurrent agents** and **1,000 agents total per run**. `/loop` is a separate feature that
reruns a prompt on an interval or lets the model pace itself.

---

## 3. What the technique actually produced

This section exists because the primary source is far more honest than the coverage of it, and the
numbers change the verdict.

### From `Claude-of-Duty`'s own README

Under the heading **"Honest assessment"**, the repo states plainly: _"The goal was to match a modern
Call of Duty. **It does not.**"_

| Round | Critic score /10      |
| ----- | --------------------- |
| 1     | 3.59                  |
| 2     | 4.14                  |
| 3     | **4.05** (regression) |
| 4     | 5.05                  |

And the line that matters most: _"In a blind A/B, **every critic in every round picked the real Call
of Duty frame.**"_

**The loop never met its own exit condition.** It ran until the operator stopped it. The technique's
headline framing — "loop until it wins" — did not happen in the run that named the technique.

### The process note — parallel fan-out _lost_

This is the single most surprising primary finding, and it sits in the README of the project the
technique is named after:

> _"Sequential single-owner passes beat parallel fan-out decisively. Three rounds of six agents each
> owning one directory moved the score +0.46 and left frame-ruining defects **higher** than they
> started (60 → 47 → 66), because tonemapping, sky and indirect light are one coupled system and
> isolated agents kept breaking each other's assumptions. One sequential pass with a single owner per
> coupled concern moved it +1.00 and cut defects 66 → 26."_

Read that carefully before generalising it — **the stated cause is coupling, not parallelism**. The
subsystems fought because they shared one rendering pipeline. It is evidence against fanning agents
out across a _coupled_ surface. It is not evidence against fanning them out across _independent_
units of work. That distinction is what saves `ralph-afk` from this finding
([§5](#5-versus-parallel-git-worktree-fan-out)).

### Independent replication cost

[`jolbol1/apex-gp`](https://github.com/jolbol1/apex-gp), an explicit second run of the technique
(procedural F1 game, same builder/blind-critic shape), publishes its own numbers in its README:

> _"It took **137 agents, 22.0M tokens and 19.3 hours** of agent wall-clock over 10 rounds, and
> finished at **67.3/100** where 90 means a [player could not tell the difference]."_

### Practitioner criticism

Pieter Levels ([`@levelsio`](https://x.com/levelsio/status/2084997902632390981)) — _low confidence on
exact wording, the post itself returned HTTP 402 and this is a search-index reproduction_:

> _"Every time I do a Gauntlet Loop I end up with a total mess and chaos of unperformant code and too
> many things happening and nothing works properly. And I burn $500. I have to clean everything up
> manually and get back to what I had."_

The consistent, independently-reported failure mode across secondary coverage: **when there is no
real bar, the critic invents one and approves everything**, and there is no budget ceiling in the
loop, so an unreachable bar burns tokens indefinitely.

---

## 4. Versus the Ralph loop

Ralph is Geoffrey Huntley's technique ([`ghuntley.com/ralph`](https://ghuntley.com/ralph/)), reduced
by its author to one line:

```bash
while :; do cat PROMPT.md | claude-code ; done
```

Anthropic ships it officially: **`ralph-loop` is in `anthropics/claude-plugins-official`** (confirmed
by reading `.claude-plugin/marketplace.json` — 286 plugins, author "Anthropic", homepage
[`anthropics/claude-plugins-public/tree/main/plugins/ralph-loop`](https://github.com/anthropics/claude-plugins-public/tree/main/plugins/ralph-loop)).
The plugin implements the loop with a **Stop hook** that blocks session exit and re-feeds the same
prompt, rather than an external bash loop.

|                              | **Ralph loop**                                                                                                                                                             | **Gauntlet loop**                                                                                                                                     |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Author                       | Geoffrey Huntley                                                                                                                                                           | Matt Shumer                                                                                                                                           |
| Primary source               | [ghuntley.com/ralph](https://ghuntley.com/ralph/)                                                                                                                          | [somethingbig.ai/gauntlet-loop](https://somethingbig.ai/gauntlet-loop) + [`prompt.md`](https://github.com/mshumer/Claude-of-Duty/blob/main/prompt.md) |
| Official packaging           | **Yes** — `ralph-loop`, Anthropic official marketplace                                                                                                                     | **No** — see [§6](#6-confusions-ruled-in-and-out)                                                                                                     |
| Loop axis                    | **Time.** Same prompt, again, forever                                                                                                                                      | **Quality.** Same artifact, judged against an external bar                                                                                            |
| What carries state           | The **filesystem** — prior work persists as files and git history                                                                                                          | The **critic's verdict** — a gap statement fed back to the builder                                                                                    |
| Who judges                   | Nothing, or the test suite / linter                                                                                                                                        | A **separate agent with fresh context**, blind A/B                                                                                                    |
| Needs an external reference? | No                                                                                                                                                                         | **Yes — mandatory.** Without it the technique degenerates                                                                                             |
| Termination                  | None inherent. Human stops it, or `--max-iterations` / a completion promise string                                                                                         | None inherent. Human stops it, or the blind A/B is won                                                                                                |
| Parallelism                  | Optional. Huntley permits _"up to 500 parallel subagents for all operations but only 1 subagent for build/tests"_                                                          | Central — fan-out is in the prompt                                                                                                                    |
| Anthropic's stated fit       | _"Well-defined tasks with clear success criteria… tasks with automatic verification (tests, linters)"_; **not** for _"tasks requiring human judgment or design decisions"_ | Taste-dominated work where a reference exists and tests cannot express the goal                                                                       |

**They are complementary, not rival.** Ralph handles _"is it done?"_ when a machine can answer.
Gauntlet handles _"is it good?"_ when only a comparison can answer. In Anthropic's own vocabulary
from [Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents),
the gauntlet loop is **evaluator-optimizer** (_"one LLM call generates a response while another
provides evaluation and feedback in a loop"_) wrapped in **orchestrator-workers** (_"a central LLM
dynamically breaks down tasks, delegates them to worker LLMs, and synthesizes their results"_). Both
patterns predate the name by well over a year. The gauntlet loop's genuine contribution is the
insistence that the evaluator's criterion be an **external, fetchable artifact** rather than a
rubric.

---

## 5. Versus parallel git-worktree fan-out

This is the shape `ralph-afk` is being built to: compute a wave of mutually-unblocked `ready` issues,
spawn one background agent per issue, each in `../kcvv-issue-<N>` on `feat/issue-<N>`.

|                              | **Worktree fan-out** (`ralph-afk`)                                                      | **Gauntlet loop**                                                                                           |
| ---------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Unit of parallelism          | **One issue** — a whole independent deliverable                                         | **One facet of one artifact** — hero, motion, type, colour                                                  |
| Isolation mechanism          | **Filesystem.** Separate worktrees, separate branches. Agents physically cannot collide | **Context only.** All agents write into one tree                                                            |
| Merge model                  | `N` separate PRs, each reviewed and merged independently                                | One artifact; convergence happens inside the run                                                            |
| What guarantees independence | GitHub's native `blockedBy` GraphQL relationships, checked per issue                    | Nothing. The lead agent's judgement about what is separable                                                 |
| Optimises for                | **Throughput** — issues closed per wall-clock hour                                      | **Quality ceiling** — one artifact versus one reference                                                     |
| Correct failure mode         | An agent produces a bad PR; review catches it; blast radius is one branch               | Agents break each other's assumptions in shared files — **exactly the documented `Claude-of-Duty` failure** |

**The `Claude-of-Duty` process note does not indict `ralph-afk`.** Its stated cause was that
"tonemapping, sky and indirect light are one coupled system" — six agents editing one rendering
pipeline. `ralph-afk` fans out across issues that are _decoupled by construction_, gated on
`blockedBy`, and physically separated by worktrees. That is the configuration the note implicitly
endorses: one owner per coupled concern.

**What the note _does_ indict is any future temptation to fan several agents onto one issue.** If a
wave ever puts two agents in the same worktree, or two issues touch the same coupled subsystem
(`packages/sanity-schemas`, the type ramp, `render`-equivalent shared tokens), this is the primary
evidence that it will regress. That risk is worth a line in `ralph-afk`'s hard rules.

---

## 6. Confusions ruled in and out

Each of these was checked directly, not inferred.

| Candidate                                                                         | Verdict                                                                           | Evidence                                                                                                                                                                                                                                                                                                                                                                                                                   |
| --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A `gauntlet` plugin in Anthropic's official marketplace**                       | **Ruled out.** Does not exist                                                     | Fetched `anthropics/claude-plugins-official/.claude-plugin/marketplace.json` — **286 plugins**, zero substring matches for `gaunt` anywhere in any entry. `ralph-loop` **is** there                                                                                                                                                                                                                                        |
| **A `gauntlet` plugin in Anthropic's community marketplace**                      | **Ruled out.** Does not exist                                                     | Fetched `anthropics/claude-plugins-community/.claude-plugin/marketplace.json` — **2,281 plugins**, zero matches for `gaunt`. (`ralph` matches 4 unrelated plugins; `worktree` matches 17)                                                                                                                                                                                                                                  |
| **A `gauntlet` skill in `anthropics/skills`**                                     | **Ruled out.** Does not exist                                                     | Full recursive tree listing, zero matches                                                                                                                                                                                                                                                                                                                                                                                  |
| **A `gauntlet` npm package for agents**                                           | **Ruled out.** No such thing                                                      | `gauntlet-loop` → **404**. `gauntlet` → a **2014** package, _"Make your js applications dance on the client and the server"_, v0.0.2, unrelated. The `@chainlink/*-gauntlet-*` family and `@gauntlet-xyz/sdk` are blockchain/DeFi tooling from Gauntlet Networks, unrelated                                                                                                                                                |
| **"Gauntlet" in AI evals/benchmarking**                                           | **Real, and genuinely unrelated.** A homonym                                      | MosaicML / Databricks' **[Mosaic Eval Gauntlet](https://github.com/mosaicml/llm-foundry/blob/main/scripts/eval/local_data/EVAL_GAUNTLET.md)** — a battery of ~35–39 public benchmarks across 6 competency categories, shipped in `llm-foundry`. It runs _a model_ through _many tests_. The gauntlet loop runs _one artifact_ through _one critic_, repeatedly. Same metaphor, opposite topology. **Do not conflate them** |
| **"gantlet" (the other spelling)** in agent-harness or prompt-engineering writing | **Ruled out.** No usage found                                                     | Search returns only unrelated "agent harness engineering" / "loop engineering" literature. Nobody in this space uses the `gantlet` spelling                                                                                                                                                                                                                                                                                |
| **A built-in Claude Code feature**                                                | **Ruled out** as a named feature — but its two dependencies **are** real features | `ultracode` and `/loop` are documented at [code.claude.com/docs/en/workflows](https://code.claude.com/docs/en/workflows). "Gauntlet loop" appears nowhere in Anthropic documentation                                                                                                                                                                                                                                       |

---

## 7. Applicability to this repo

Concretely: one solo developer, `soniCaH/www.kcvvelewijt.be`, pnpm + Turborepo, Next.js on Vercel +
Sanity Studio + a Cloudflare Workers BFF, TypeScript strict + Effect. ~127 open issues, ~30 `ready`.
A sequential `scripts/ralph.sh` with a human PR-review gate, and a `ralph-afk` skill in progress. The
real bottleneck is that **the human must review and merge every PR**, with CodeRabbitAI on each one.

### Verdict: ignore it as a loop, steal exactly one idea, and put it somewhere else

**Why not to adopt it:**

1. **It aims at the wrong bottleneck.** The gauntlet loop makes _one artifact better_. It does not
   make _more issues ship_, and it does not touch review throughput. Adding it slows the queue down —
   more rounds, more tokens, more PRs waiting on the same one reviewer.
2. **The bar requirement does not survive contact with a ticket queue.** Shumer's own rule is that
   the reference must be **named, fetchable, and comparable**. That works for "beat Nike's running
   campaign page." It does not work for "#2606 placeholder fixture" or "#2607 loading skeletons."
   Roughly 30 `ready` issues would need 30 hand-picked external references. The documented
   consequence of skipping that step is the technique's most common failure: **the critic invents a
   standard and approves everything**, at full token cost.
3. **This repo already has the bar in a better form.** `docs/design/` mockups, `DESIGN.md`, the
   locked-primitive rules, `PRODUCT.md` Brand Commitments, and the VR baseline suite are all
   _internal, versioned, fetchable_ references — and unlike a competitor's live page, they are the
   references the project has actually committed to. A blind A/B against a competitor's site would
   optimise toward someone else's design language, straight into the
   "consistency ≠ flattening" and "no magazine chrome" rules.
4. **The cost profile is wrong for a solo hobby project.** 22M tokens / 19.3h for one artifact
   (`apex-gp`), or $500–900 burned with 95% discarded (levels.io). That budget buys a lot of
   sequential Ralph turns.
5. **The one run that named the technique never met its own exit condition,** and its own author
   recorded that sequential single-owner passes beat parallel fan-out on the coupled surface.

**The one idea worth stealing — the separate-critic blind A/B.** Not the loop; the _judge_. The
transferable insight is Shumer's stated failure mode: a builder that grades its own work rationalises
it, and a **score drifts upward every round while a binary blind comparison does not**. Where that
applies here:

- **Not applicable to `scripts/ralph.sh` — checked and ruled out.** An earlier draft of this section
  claimed `run_code_review()` grades work in the implementer's own session. It does not.
  `scripts/ralph.sh` makes four independent `claude --print` invocations
  (lines 215, 242, 323, 381) with no `--resume` or `--continue` between them, so the reviewer already
  starts from a fresh context and never sees the implementation reasoning. The builder-grades-itself
  failure mode does not exist here. Left in as a negative finding so it is not "discovered" again.
- **`ralph-afk`'s hard rules should forbid two agents in one worktree, and flag waves whose issues
  touch a shared coupled surface** — the `Claude-of-Duty` process note is the citation for that rule.
- **Where a design ticket genuinely does have a fetchable bar** — an approved mockup under
  `docs/design/mockups/`, or a VR baseline — a blind A/B against _that_ is cheap and correctly aimed.
  This is the gauntlet idea pointed at an internal reference, which is the only version that fits.

**What not to do:** do not install any of the community `gauntlet-loop` skills. They are
paste-a-prompt generators with no code, zero official provenance, and 0–373 stars of unreviewed
third-party origin. If the pattern is ever wanted, the entire technique is three paragraphs — write
them into a project skill and keep the authorship local.

---

## 8. The adjacent technique actually worth taking

Found while searching, and aimed squarely at the stated bottleneck: **Claude Code dynamic workflows**
— official, documented, and not a community pattern.
[`code.claude.com/docs/en/workflows`](https://code.claude.com/docs/en/workflows).

A dynamic workflow is a JavaScript orchestration script Claude writes and a background runtime
executes. Its relevance here is specific: **intermediate results stay in script variables instead of
landing in a context window**, the run is resumable, and — critically — the docs list _reviewing a
changeset_ as a first-class example. This is Anthropic's own example prompt, verbatim:

```text
use a workflow to review every file changed in this PR for correctness issues, then merge the
per-file findings into one ranked summary
```

Why this is the right shape for this repo's actual constraint:

- **It attacks review, not implementation.** The bottleneck is one human reading `N` PRs. A per-file
  reviewer fan-out that returns _one ranked, deduplicated summary_ compresses the reading, which is
  the scarce resource. CodeRabbitAI already covers correctness; a workflow can be pointed at what
  CodeRabbit does not know — `CLAUDE.md` conventions, the locked design primitives, peer-drift
  against sibling files, the `blockedBy`/spec match.
- **Adversarial verification is built in.** The docs describe workflows applying "a repeatable
  quality pattern": _"it can have independent agents adversarially review each other's findings
  before they're reported."_ That is the gauntlet loop's separate-critic idea, already implemented,
  already official, without the token profile.
- **It is savable and shareable.** Press `s` in `/workflows` and the script becomes a `/command` in
  `.claude/workflows/`. In a monorepo, project workflows load from every `.claude/workflows/` between
  cwd and the repo root — so a web-specific review workflow can live under `apps/web/`.
- **The cost is bounded and visible.** Documented caps: **16 concurrent agents**, **1,000 agents per
  run**, a `Large workflow` warning past 25 agents or 1.5M projected tokens, and a
  `workflowSizeGuideline` setting (`small` = fewer than 5 agents). None of which the gauntlet loop
  has.

Two smaller notes worth recording, both from the same page:

- **Stopping mid-fan-out is expensive.** On resume, _"cached results stop at the first agent that
  didn't finish, and every agent that started after that one runs again, even if it completed."_
  Many small agents preserve more progress than one long one.
- **`ultracode` typed into a prompt does not trigger from `-p`.** Per the docs, the keyword is an
  opt-in _"only in a prompt you type yourself"_ — it does **not** start a workflow from `claude -p`,
  an SDK prompt not stamped as human, a scheduled task, or a PR comment. `scripts/ralph.sh` drives
  `claude --print`, so the keyword would be inert there. A workflow must be requested in the prompt
  body instead.

---

## Sources — what was read, and what could not be

**Read in full (primary):**

- [`github.com/mshumer/Claude-of-Duty`](https://github.com/mshumer/Claude-of-Duty) — README and
  `prompt.md`, fetched raw. Repo metadata via GitHub API (created 2026-07-25, ~3,180 stars).
- [`somethingbig.ai/gauntlet-loop`](https://somethingbig.ai/gauntlet-loop) — Matt Shumer's own site.
- [`ghuntley.com/ralph`](https://ghuntley.com/ralph/) — Geoffrey Huntley's Ralph write-up.
- [`anthropics/claude-plugins-official`](https://github.com/anthropics/claude-plugins-official) and
  [`anthropics/claude-plugins-community`](https://github.com/anthropics/claude-plugins-community) —
  both `marketplace.json` files parsed programmatically (286 and 2,281 plugins).
- [`anthropics/claude-plugins-public/plugins/ralph-loop`](https://github.com/anthropics/claude-plugins-public/tree/main/plugins/ralph-loop) — plugin README and file tree.
- [`code.claude.com/docs/en/workflows`](https://code.claude.com/docs/en/workflows) — official
  dynamic-workflows / `ultracode` documentation.
- [`anthropic.com/engineering/building-effective-agents`](https://www.anthropic.com/engineering/building-effective-agents) — evaluator-optimizer and orchestrator-workers definitions.
- [`robonuggets/gauntlet-loop`](https://github.com/robonuggets/gauntlet-loop) `SKILL.md` — the
  leading community packaging (third-party, cited as such).
- [`jolbol1/apex-gp`](https://github.com/jolbol1/apex-gp) README — independent replication numbers.
- npm registry: `gauntlet-loop` (404), `gauntlet` (2014, unrelated), full `gauntlet` search page.
- `anthropics/skills` full recursive tree.

**Could not be read — stated plainly:**

- [`x.com/mattshumer_/status/2081857631254372509`](https://x.com/mattshumer_/status/2081857631254372509)
  — **HTTP 402** via WebFetch; `xcancel.com` mirror served a CAPTCHA. This is the post where the term
  is coined. Its title text (_"a technique I'm calling the Gauntlet Loop"_) was recovered from the
  search index only. **The coinage attribution is therefore one step removed from the post itself** —
  though it is corroborated by Shumer's own site and by `robonuggets`' attribution.
- [`x.com/levelsio/status/2084997902632390981`](https://x.com/levelsio/status/2084997902632390981) —
  same 402. The criticism quoted in [§3](#3-what-the-technique-actually-produced) is a
  **search-index reproduction, low confidence on exact wording**; the substance (cost burned, work
  discarded) is corroborated across several independent secondary write-ups.
- The `$1,200` / `$1,700` per-project cost figures that circulate in secondary coverage were **not**
  traced to any primary source and are **deliberately excluded** from this document.

**Secondary sources consulted but not relied on for any claim:** Decrypt, daily.dev, digg,
thepromptindex, stork.ai, ournationonline, we0.ai. Where they were the only route to a fact, the fact
is labelled low-confidence above.
