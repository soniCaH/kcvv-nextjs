import type { RankingEntry } from "@kcvv/api-contract";
import {
  EditorialHeading,
  EmptyState,
  MonoLabelRow,
  PageContainer,
} from "@/components/design-system";
import { cn } from "@/lib/utils/cn";
import { StandingsTable } from "@/components/team/StandingsTable";

export interface MatchStandingsSectionProps {
  /** Full league-table rows for the competition. Filtered to the two teams
   * playing this match (a match-day head-to-head snapshot). */
  entries: readonly RankingEntry[];
  /** PSD club id of the home side (`match.home_team.id`). */
  homeClubId: number;
  /** PSD club id of the away side (`match.away_team.id`). */
  awayClubId: number;
  /** PSD team id of the KCVV side, so its row tints in the table. */
  highlightTeamId?: number;
  /**
   * The ranking read failed permanently rather than legitimately returning
   * nothing (#2778 classifies which; the caller passes the verdict through
   * unchanged — this component never infers failure from an empty
   * `entries` array). Renders a failure notice in place of the table
   * instead of auto-hiding (#2576). `entries` is `[]` whenever this is
   * `true` — the caller has nothing to show either way.
   * @default false
   */
  unavailable?: boolean;
  className?: string;
}

/**
 * Section wrapper around `<StandingsTable>` for the match-detail page (#2162) —
 * restores the match-day standings snapshot dropped in the #1913 redesign,
 * **league matches only** (the page gates on `competitionType === "league"`).
 *
 * Shows **only the two teams playing this match** — a head-to-head standings
 * snapshot (the legacy behaviour), matched by club id against the full ranking
 * and keeping each team's real league position. Not the whole division.
 *
 * Mirrors the `<MatchLineupSection>` / `<MatchEventsSection>` chrome: mono caps
 * kicker (`KLASSEMENT`) + display-md italic heading (`In de stand.`) + paper
 * container, around the already-redesigned `<StandingsTable>` (KCVV row tinted
 * via `highlightTeamId`).
 *
 * Three outcomes when nobody is found in `entries` (#2576, resolving the gap
 * #2778 deliberately left open — "no new copy for this state" was that
 * ticket's own call, not this one's):
 * - **Genuinely empty** (`unavailable` false/omitted) — auto-hides, `null`,
 *   silently. Off-season, cup/friendly leaked through, or a youth table with
 *   no rows yet. Nothing failed, so nothing is said.
 * - **Permanently unavailable** (`unavailable: true`) — renders the section's
 *   own kicker + heading (unchanged) with a failure notice in place of the
 *   table: `<EmptyState tier="slot" variant="notice">`, #2427's Tier 2
 *   carrying different copy (#2469 resolution rule 5), not a third heading
 *   (rule 1 rejected the "editorial title" candidate for exactly this
 *   double-heading reason on this specific route).
 * - **Rows present** — the table, as before.
 */
export function MatchStandingsSection({
  entries,
  homeClubId,
  awayClubId,
  highlightTeamId,
  unavailable = false,
  className,
}: MatchStandingsSectionProps) {
  // `.filter` returns a fresh array, so the in-place `.sort` never mutates the
  // caller's `entries`. Always `[]` when `unavailable` — the caller degrades
  // the failed read to an empty array before it ever reaches this filter.
  const involved = entries
    .filter((e) => e.club_id === homeClubId || e.club_id === awayClubId)
    .sort((a, b) => a.position - b.position);

  if (involved.length === 0 && !unavailable) return null;

  return (
    <PageContainer
      as="section"
      className={cn("bg-cream py-10 md:py-14", className)}
    >
      <MonoLabelRow
        items={[{ label: "KLASSEMENT" }]}
        className="text-ink mb-3"
      />
      <EditorialHeading level={2} size="display-md" className="mb-8 md:mb-10">
        In de stand.
      </EditorialHeading>

      {involved.length === 0 ? (
        <EmptyState
          tier="slot"
          variant="notice"
          emphasis={{ text: "even niet beschikbaar" }}
        >
          Het klassement is even niet beschikbaar. Probeer het later opnieuw.
        </EmptyState>
      ) : (
        <StandingsTable entries={involved} highlightTeamId={highlightTeamId} />
      )}
    </PageContainer>
  );
}
