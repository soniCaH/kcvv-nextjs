# #2693 — what does a tournament fixture row say?

Throwaway prototype. Three variants of the tournament row, rendered on the
**real** `/ploegen/kcvve-u9/wedstrijden` route against **production** data, so
each one is judged sitting among real league fixtures rather than in a vacuum.

## Run it

```bash
cd apps/web
corepack pnpm exec next dev -p 3011
```

Then open:

```text
http://localhost:3011/ploegen/kcvve-u9/wedstrijden?variant=A
```

`←` / `→` cycle through the variants, or use the pink bar at the bottom.

| `?variant=` | Name                 | Idea                                                                  |
| ----------- | -------------------- | --------------------------------------------------------------------- |
| `off`       | today, unchanged     | The shipped row. Asserts a match against the named club.              |
| `A`         | Reservation register | #2632's placeholder row with a richer subject line.                   |
| `B`         | Location line        | Tournament is the subject; the club becomes a place; time is "vanaf". |
| `C`         | Ticket band          | Not a fixture row at all — a banded entry that breaks the rhythm.     |

The one real tournament fixture is U9's `30 aug · FC Zemst Sportief`
(`data-match-id="3522"`). It is also the team's **next** fixture, so under
`off` it holds the green "Eerstvolgende" card.

`.env.local` in this worktree points at the **production** BFF and the
**production** Sanity dataset — the staging dataset has no `kcvve-u9` team, so
the page 404s against it.

## Shots

`shots/u9-<width>-<variant>.png` — 1440 and 390, captured 2026-08-18.

## What every variant sheds

The "vs" framing, the second crest read as an opponent, the home/away icon,
the score slot, and the row's click-through. They disagree about what replaces
them.

## Deliberately not prototyped

The featured (jersey-deep) treatment. All variants render on cream so they are
judged on equal ground. Whether a tournament may ever hold the green
next-fixture slot is a separate question for the grilling.
