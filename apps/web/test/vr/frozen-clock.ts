/**
 * The VR harness's frozen "now" — the single source of truth shared by
 * `.storybook/test-runner.ts` (which stubs `Date`/`Date.now()` to this exact
 * instant for every story) and any story fixture whose host component reads
 * `new Date()` for relative past/future logic (e.g. `<TeamMatchesSection>`'s
 * `findNextMatch`/`recentResults`).
 *
 * A story that hand-copies this value instead of importing it can silently
 * drift from the harness's real clock if that clock ever moves, dropping
 * rows from its own baseline without failing anything.
 */
export const VR_FROZEN_NOW_ISO = "2026-01-15T12:00:00.000Z";
