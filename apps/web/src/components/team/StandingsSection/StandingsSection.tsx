import type { RankingTable } from "@kcvv/api-contract";
import { StandingsTable } from "@/components/team/StandingsTable";
import { EmptyState } from "@/components/design-system/EmptyState";
import { classifyStandingsTables } from "@/lib/utils/competitive-block-state";
import { cn } from "@/lib/utils/cn";

export interface StandingsSectionProps {
  /** Every official table the association publishes for this team, in feed
   * order. A senior side has one; every youth side gets a fresh poule at the
   * winter break and so ends the season with two. */
  tables: readonly RankingTable[];
  /** Sanity's editorial reeks name. Wins over the provider's, because the
   * federation's name for a reeks is not the club's — the club says
   * `3e Nationale VV A` where the provider files `3de Afdeling Voetb Vl A`
   * (#2589 decision 4). */
  divisionFull?: string | null;
  /** PSD team_id of the KCVV team to highlight in every table. */
  highlightTeamId?: number;
  className?: string;
}

/**
 * The content of `#klassement` — N league tables under one section (#2631).
 *
 * Never two sections: #2540 gives `#klassement` exactly one `<h2>`, one
 * `StripedSeam` and one nav entry, and splitting the phases into two sections
 * breaks that invariant. The `<h2>` itself lands with the rest of the heading
 * sweep (#2637) and is not here yet.
 *
 * The parent only mounts this component once the competitive block's fixture
 * gate is open (#2636) — so unlike before #2636, this component never auto-
 * hides itself. `#klassement` shows the clubs it has and the numbers it has,
 * and it never says a table is coming (#2605): no rows yet renders a present-
 * tense note in its own voice rather than a bare `null`, and rows without
 * numbers (before matchday 1, or a reeks PSD never scores) render as a plain
 * club list rather than a table full of zeroes.
 */
export function StandingsSection({
  tables,
  divisionFull,
  highlightTeamId,
  className,
}: StandingsSectionProps) {
  const state = classifyStandingsTables(tables);

  if (state === "no-table") {
    return (
      <div data-testid="standings-section" className={cn("flex", className)}>
        <EmptyState tier="slot">
          Voor deze reeks is er geen klassement.
        </EmptyState>
      </div>
    );
  }

  const tablesWithRows = tables.filter((table) => table.entries.length > 0);

  return (
    <div
      data-testid="standings-section"
      className={cn("flex flex-col gap-10", className)}
    >
      {tablesWithRows.map((table) => (
        <StandingsTable
          key={table.competition_id}
          entries={table.entries}
          caption={divisionFull ?? table.competition_name}
          highlightTeamId={highlightTeamId}
          numberless={state === "numberless"}
        />
      ))}
    </div>
  );
}
