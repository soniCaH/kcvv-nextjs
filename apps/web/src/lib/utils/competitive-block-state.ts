import type { Match, RankingTable } from "@kcvv/api-contract";

/**
 * The competitive half of a team page — `#klassement` + `#wedstrijden` — as
 * one state, keyed to the data rather than to the section, the age group, or
 * history (#2540/#2636). Four reachable states plus a fifth degenerate input
 * (no fetch result at all — a team with no PSD id):
 *
 * - **`not-in-competition`** — the club has no official fixture for this team
 *   this season. Both sections stay off the page; the caller renders a single
 *   status line instead (`CompetitiveStatusLine`).
 * - **`no-table`** — in competition, but the association has not published a
 *   row yet. `tables` carries whatever the provider returned (usually `[]`
 *   or every entry empty) purely for debugging; the caller does not read
 *   entries off it.
 * - **`numberless`** — in competition, and every published entry reads
 *   `played === 0 && points === 0` (before matchday 1, or a reeks PSD never
 *   scores). `tables` is filtered to the tables that have rows.
 * - **`live`** — a published table with real numbers. `tables` is filtered to
 *   the tables that have rows.
 *
 * **What "fetch failed" is not here.** A rejected fetch is not a value this
 * function ever sees — `page.tsx` lets that promise reject so the render
 * throws and ISR serves the last-good page (#2540 state 4). This function
 * only classifies a *successful* fetch (or its absence).
 */
export type CompetitiveBlockState =
  | { readonly kind: "not-in-competition" }
  | { readonly kind: "no-table"; readonly tables: readonly RankingTable[] }
  | { readonly kind: "numberless"; readonly tables: readonly RankingTable[] }
  | { readonly kind: "live"; readonly tables: readonly RankingTable[] };

/** What `fetchBffData` resolves to when it resolves — never the rejection. */
export interface CompetitiveFetchResult {
  readonly matches: readonly Match[];
  readonly standings: readonly RankingTable[];
}

/**
 * The gate (#2636 AC 2): at least one `OFFICIAL` fixture in the current
 * provider season. `Match.competitionType` is the BFF's own normalisation of
 * PSD's `competitionType.type` (`OFFICIAL`/`LEAGUE` → `"league"`) — never
 * `standings.length > 0` (the ranking arrives *after* the fixtures, so it
 * reads zero rows for months on a team that is plainly in competition) and
 * never `division` (that field is the phase's association code, set on 3 of
 * 26 docs, and says nothing about whether a team has a league at all).
 */
function isInCompetition(matches: readonly Match[]): boolean {
  return matches.some((match) => match.competitionType === "league");
}

/** Every entry in a table reads `played === 0 && points === 0` — before
 * matchday 1, or a reeks PSD never scores (#2605 decision 3). */
function isNumberlessTable(table: RankingTable): boolean {
  return table.entries.every(
    (entry) => entry.played === 0 && entry.points === 0,
  );
}

/**
 * Classifies `#klassement`'s own tables, independent of the fixture gate
 * above. Shared between `deriveCompetitiveBlockState` (the page-level gate)
 * and `<StandingsSection>` (which renders whenever the gate is open, and
 * needs the same three-way read of its own `tables` prop) so the predicate
 * has exactly one owner.
 */
export function classifyStandingsTables(
  tables: readonly RankingTable[],
): "no-table" | "numberless" | "live" {
  const tablesWithRows = tables.filter((table) => table.entries.length > 0);
  if (tablesWithRows.length === 0) return "no-table";
  if (tablesWithRows.every(isNumberlessTable)) return "numberless";
  return "live";
}

/**
 * The pure exported function #2636 AC 1 asks for: takes the (successful)
 * fetch result and returns the competitive block's state, reachable without
 * rendering anything. Replaces the `showStandings` / `showMatches` flags that
 * used to be derived inline in `page.tsx`.
 *
 * `fetchResult` is `null` when the team carries no usable PSD id — not a
 * fetch failure, a deliberate skip, so it fails closed to
 * `not-in-competition` rather than throwing.
 */
export function deriveCompetitiveBlockState(
  fetchResult: CompetitiveFetchResult | null,
): CompetitiveBlockState {
  if (fetchResult === null) return { kind: "not-in-competition" };
  if (!isInCompetition(fetchResult.matches)) {
    return { kind: "not-in-competition" };
  }

  const tablesState = classifyStandingsTables(fetchResult.standings);
  if (tablesState === "no-table") {
    return { kind: "no-table", tables: fetchResult.standings };
  }

  const tablesWithRows = fetchResult.standings.filter(
    (table) => table.entries.length > 0,
  );
  return { kind: tablesState, tables: tablesWithRows };
}

/**
 * `#klassement`'s heading follows the data (#2605 decision): `"Klassement"`
 * only when the table carries real points, `"De reeks"` otherwise. Used for
 * both the sticky nav's chip label today and the section's own `<h2>` once
 * #2637 adds one — one word, one owner, so the nav chip and the heading can
 * never read differently for the same page.
 *
 * Only meaningful once the block is in competition; the caller does not ask
 * for a label in `not-in-competition`, since there is no nav entry to label.
 */
export function competitiveBlockHeadingLabel(
  state: Exclude<CompetitiveBlockState, { kind: "not-in-competition" }>,
): string {
  return state.kind === "live" ? "Klassement" : "De reeks";
}
