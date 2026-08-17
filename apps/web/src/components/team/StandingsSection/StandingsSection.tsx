import type { RankingTable } from "@kcvv/api-contract";
import { StandingsTable } from "@/components/team/StandingsTable";
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
 * breaks that invariant. The `<h2>` itself is #2540's and is not here yet.
 *
 * `<StandingsTable>` stays a single-table renderer and keeps its own empty
 * guard, so a table that arrives with no rows drops out on its own.
 */
export function StandingsSection({
  tables,
  divisionFull,
  highlightTeamId,
  className,
}: StandingsSectionProps) {
  // Count rows, not tables — the contract permits a published-but-empty reeks,
  // and a section of nothing but empty tables must not draw its own seam.
  if (!tables.some((table) => table.entries.length > 0)) return null;

  return (
    <div
      data-testid="standings-section"
      className={cn("flex flex-col gap-10", className)}
    >
      {tables.map((table) => (
        <StandingsTable
          key={table.competition_id}
          entries={table.entries}
          caption={divisionFull ?? table.competition_name}
          highlightTeamId={highlightTeamId}
        />
      ))}
    </div>
  );
}
