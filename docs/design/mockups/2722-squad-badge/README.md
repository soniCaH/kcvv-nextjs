# #2722 — Squad badge at thumbnail size

PROTOTYPE. Throwaway. The variants live on branch `prototype/2722-squad-badge` and
must not be promoted to production as written.

## The question

How should the KCVV squad (`A` / `B` / `U15`) read to an Instagram follower
scrolling at thumbnail size?

The #2700 badge is _correct_ — the datum flows, the Ploeg field prefills, and the
mark lands in every exported PNG on all 11 templates. It is simply not seen. The
club's own operator generated an Aftrap render for `KFC Eppegem — KCVV Elewijt
(B-Ploeg)`, looked at the result, and reported the feature as broken. If the
person who asked for the badge and knows where it sits misses it at full size, a
follower at roughly 1/8 scale has no chance.

## How to run it

```bash
cd /Users/kevinvanransbeeck/Sites/KCVV/kcvv-proto-2722
pnpm --filter @kcvv/web dev -p 3200
```

Then open <http://localhost:3200/share?variant=A>.

`apps/web/.env.local` in this worktree points `KCVV_API_URL` at the **production**
worker, so the match picker carries real fixtures with real squad labels.

Flip variants with the floating pink bar at the bottom, or `←` / `→` when no text
field has focus. The switcher uses `history.replaceState`, so the match and Ploeg
you typed survive a variant change.

## The variants

| Key   | Name             | Where the squad lives                                                                    |
| ----- | ---------------- | ---------------------------------------------------------------------------------------- |
| `off` | Production today | 76px mono mark, top-right corner. The baseline — this is what shipped in #2700.          |
| `A`   | Corner flash     | Same slot, ~2.4x the mark, bled off the canvas edge so it reads as a **shape**.          |
| `B`   | Squad band       | Full-bleed horizontal band under the top bar, carrying the full label (`B-PLOEG`).       |
| `C`   | Name-integrated  | No chrome at all — the squad rides the club name in the biggest type (`KCVV Elewijt B`). |

`C` is where the operator's instinct went unprompted, which is worth something on
its own.

## How to judge it

**Judge at thumbnail scale, not at 1080x1920.** Every variant looks fine full
size — that is exactly how the current one shipped. Generate the PNG, then shrink
the browser window until the render is about 135px wide (an Instagram Story tray
thumbnail) and ask: _can I tell an A from a B without leaning in?_

Check each variant against all of:

- Both registers — the cream sheet (Aftrap without a photo) and the fullscreen
  photo (Aftrap with one). The palette flips, so contrast flips with it.
- A federation age code (`U15`, `U13A`), not just `A` / `B`. Type it into Ploeg.
- An empty Ploeg field — no mark, no empty band, no dangling suffix on the name.
- The square 1:1 templates, which have a third of the vertical room.

## Known prototype shortcuts

These are deliberate and must be rewritten if a variant wins — do not copy them
across:

- `fullSquadLabel()` re-derives `A-PLOEG` from the short `A`. The real
  implementation should carry both forms from `kcvv_team_label` instead of
  round-tripping through `shortSquadLabel`.
- Variant C sniffs the rendered string for `kcvv` because `ShareName` is not told
  which side is the club. The real implementation should be told.
- Variant C changes only the display name. The footer matchup line
  (`KCVV ELEWIJT — FC TEGENSTANDER`) is left alone, and would need a decision.
- `ShareTop` returns a fragment so variant B can hang a band under the row.
  Revert it to a single `<div>` if B does not win.

## Verdict

**`off` wins — leave the shipped #2700 badge exactly as it is.** Decided
2026-08-20. No variant was folded into `main`; nothing changed in production.

The question this settled: the corner mark is quiet enough that the club's own
operator missed it, and none of the three louder treatments earned the cost of
changing a locked, working surface across 11 templates and two registers.

**If this is reopened, do not re-run the prototype from scratch** — the four
treatments are on `prototype/2722-squad-badge` and can be brought back up with
the run command above. Re-argue the verdict, not the code.
