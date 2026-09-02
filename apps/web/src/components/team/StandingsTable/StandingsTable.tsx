import { Crest, MonoLabel } from "@/components/design-system";
import { isNumberlessTable } from "@/lib/utils/competitive-block-state";
import { cn } from "@/lib/utils/cn";
import { StandingsTableScroller } from "./StandingsTableScroller";
import type { RankingEntry } from "@kcvv/api-contract";

export interface StandingsTableProps {
  entries: readonly RankingEntry[];
  /** PSD team_id of the KCVV team to highlight. */
  highlightTeamId?: number;
  /** Name of the competition this table ranks. Also names the region, so a
   * team playing two phases gets two distinct landmark names instead of two
   * identical "Klassement" ones (#2631). */
  caption?: string;
}

/**
 * The KCVV row/item accent — a tinted background with an inset left rule in
 * jersey green. Shared between the numbered table and the numberless list so
 * the two registers read as the same accent, not two independent ones.
 */
const KCVV_HIGHLIGHT_CLASS =
  "bg-[color-mix(in_srgb,var(--color-jersey-deep)_12%,var(--color-cream))] shadow-[inset_3px_0_0_var(--color-jersey-deep)]";

/** Crest + truncating team name, italic unless it's the KCVV row. The one
 * piece both the numbered table and the numberless list render identically. */
function ClubIdentity({
  teamName,
  teamLogo,
  isKcvv,
}: {
  teamName: string;
  teamLogo: string | undefined;
  isKcvv: boolean;
}) {
  return (
    <>
      <Crest name={teamName} logo={teamLogo} size={16} />
      <span
        className={cn(
          "font-display text-ink min-w-0 truncate",
          isKcvv ? "font-semibold not-italic" : "italic",
        )}
        title={teamName}
      >
        {teamName}
      </span>
    </>
  );
}

function NumberlessClubList({
  entries,
  highlightTeamId,
  caption,
}: {
  entries: readonly RankingEntry[];
  highlightTeamId: number | undefined;
  caption: string | undefined;
}) {
  return (
    <div
      data-testid="standings-table"
      data-variant="numberless"
      className="w-full"
      role="region"
      aria-label={caption ?? "De reeks"}
    >
      {caption ? (
        <p className="pb-2 text-left">
          <MonoLabel>{caption}</MonoLabel>
        </p>
      ) : null}
      <ul className="font-mono text-xs">
        {entries.map((entry) => {
          const isKcvv = entry.team_id === highlightTeamId;
          return (
            <li
              key={entry.team_id}
              data-testid={isKcvv ? "standings-kcvv-row" : undefined}
              className={cn(
                "flex items-center gap-1.5 border-b border-[color:var(--color-paper-edge)] py-2 pr-4 pl-4",
                isKcvv && KCVV_HIGHLIGHT_CLASS,
              )}
            >
              <ClubIdentity
                teamName={entry.team_name}
                teamLogo={entry.team_logo}
                isKcvv={isKcvv}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function StandingsTable({
  entries,
  highlightTeamId,
  caption,
}: StandingsTableProps) {
  if (entries.length === 0) return null;

  // Derived from the entries themselves rather than taken as a prop: a
  // `numberless` boolean a caller sets could disagree with the data it
  // passes alongside it, silently dropping every number from a table that
  // actually has them. This way that state cannot be expressed (#2636
  // finding 9).
  if (isNumberlessTable(entries)) {
    return (
      <NumberlessClubList
        entries={entries}
        highlightTeamId={highlightTeamId}
        caption={caption}
      />
    );
  }

  return (
    <div data-testid="standings-table" className="w-full">
      <StandingsTableScroller ariaLabel={caption ?? "Klassement"}>
        <table className="w-full border-collapse font-mono text-xs">
          {caption ? (
            <caption className="pb-2 text-left">
              <MonoLabel>{caption}</MonoLabel>
            </caption>
          ) : null}
          <thead>
            <tr className="border-ink border-b-2">
              <th
                scope="col"
                className="text-ink-muted py-2 pr-2 pl-4 text-left tracking-wider uppercase"
              >
                #
              </th>
              <th
                scope="col"
                className="text-ink-muted py-2 pr-3 text-left tracking-wider uppercase"
              >
                Ploeg
              </th>
              <th
                scope="col"
                className="text-ink-muted py-2 pr-2 text-right tracking-wider uppercase"
              >
                M
              </th>
              {/* W/G/V hidden on mobile */}
              <th
                scope="col"
                className="text-ink-muted hidden py-2 pr-2 text-right tracking-wider uppercase sm:table-cell"
              >
                W
              </th>
              <th
                scope="col"
                className="text-ink-muted hidden py-2 pr-2 text-right tracking-wider uppercase sm:table-cell"
              >
                G
              </th>
              <th
                scope="col"
                className="text-ink-muted hidden py-2 pr-2 text-right tracking-wider uppercase sm:table-cell"
              >
                V
              </th>
              <th
                scope="col"
                className="text-ink-muted py-2 pr-2 text-right tracking-wider uppercase"
              >
                +/-
              </th>
              <th
                scope="col"
                className="text-ink-muted py-2 pr-4 text-right tracking-wider uppercase"
              >
                Ptn
              </th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => {
              const isKcvv = entry.team_id === highlightTeamId;
              return (
                <tr
                  key={entry.team_id}
                  data-testid={isKcvv ? "standings-kcvv-row" : undefined}
                  className={cn(
                    "border-b border-[color:var(--color-paper-edge)]",
                    isKcvv && KCVV_HIGHLIGHT_CLASS,
                  )}
                >
                  {/* Position */}
                  <td className="text-ink-muted py-2 pr-2 pl-4 tabular-nums">
                    {entry.position}
                  </td>

                  {/* Team name + crest */}
                  <td className="py-2 pr-3">
                    <span className="flex items-center gap-1.5">
                      <ClubIdentity
                        teamName={entry.team_name}
                        teamLogo={entry.team_logo}
                        isKcvv={isKcvv}
                      />
                    </span>
                  </td>

                  {/* M */}
                  <td className="text-ink py-2 pr-2 text-right tabular-nums">
                    {entry.played}
                  </td>

                  {/* W/G/V — hidden on mobile */}
                  <td className="text-ink hidden py-2 pr-2 text-right tabular-nums sm:table-cell">
                    {entry.won}
                  </td>
                  <td className="text-ink hidden py-2 pr-2 text-right tabular-nums sm:table-cell">
                    {entry.drawn}
                  </td>
                  <td className="text-ink hidden py-2 pr-2 text-right tabular-nums sm:table-cell">
                    {entry.lost}
                  </td>

                  {/* Goal difference */}
                  <td className="text-ink py-2 pr-2 text-right tabular-nums">
                    {entry.goal_difference > 0
                      ? `+${entry.goal_difference}`
                      : entry.goal_difference}
                  </td>

                  {/* Points — display-big black */}
                  <td className="font-display-big text-ink py-2 pr-4 text-right font-black tabular-nums">
                    {entry.points}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </StandingsTableScroller>
    </div>
  );
}
