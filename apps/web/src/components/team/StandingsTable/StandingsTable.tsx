import { Crest, MonoLabel } from "@/components/design-system";
import { cn } from "@/lib/utils/cn";
import type { RankingEntry } from "@kcvv/api-contract";

export interface StandingsTableProps {
  entries: readonly RankingEntry[];
  /** PSD team_id of the KCVV team to highlight. */
  highlightTeamId?: number;
  /** Name of the competition this table ranks. Also names the region, so a
   * team playing two phases gets two distinct landmark names instead of two
   * identical "Klassement" ones (#2631). */
  caption?: string;
  /**
   * Every entry reads `played === 0 && points === 0` — before matchday 1, or
   * a reeks PSD never scores at all (#2605 decision 3). Position and every
   * numeric column would all read the same non-answer, which reads as ranked
   * when it isn't, so this drops them and renders the clubs as a plain list
   * instead — "a full overview of all competition opponents at one glance."
   */
  numberless?: boolean;
}

function isKcvvRow(entry: RankingEntry, highlightTeamId: number | undefined) {
  return entry.team_id === highlightTeamId;
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
          const isKcvv = isKcvvRow(entry, highlightTeamId);
          return (
            <li
              key={entry.team_id}
              data-testid={isKcvv ? "standings-kcvv-row" : undefined}
              className={cn(
                "flex items-center gap-1.5 border-b border-[color:var(--color-paper-edge)] py-2 pr-4 pl-4",
                isKcvv &&
                  "bg-[color-mix(in_srgb,var(--color-jersey-deep)_12%,var(--color-cream))] shadow-[inset_3px_0_0_var(--color-jersey-deep)]",
              )}
            >
              <Crest name={entry.team_name} logo={entry.team_logo} size={16} />
              <span
                className={cn(
                  "font-display text-ink min-w-0 truncate",
                  isKcvv ? "font-semibold not-italic" : "italic",
                )}
                title={entry.team_name}
              >
                {entry.team_name}
              </span>
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
  numberless = false,
}: StandingsTableProps) {
  if (entries.length === 0) return null;

  if (numberless) {
    return (
      <NumberlessClubList
        entries={entries}
        highlightTeamId={highlightTeamId}
        caption={caption}
      />
    );
  }

  return (
    <div
      data-testid="standings-table"
      className="w-full overflow-x-auto"
      role="region"
      aria-label={caption ?? "Klassement"}
    >
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
                  isKcvv &&
                    "bg-[color-mix(in_srgb,var(--color-jersey-deep)_12%,var(--color-cream))] shadow-[inset_3px_0_0_var(--color-jersey-deep)]",
                )}
              >
                {/* Position */}
                <td className="text-ink-muted py-2 pr-2 pl-4 tabular-nums">
                  {entry.position}
                </td>

                {/* Team name + crest */}
                <td className="py-2 pr-3">
                  <span className="flex items-center gap-1.5">
                    <Crest
                      name={entry.team_name}
                      logo={entry.team_logo}
                      size={16}
                    />
                    <span
                      className={cn(
                        "font-display text-ink min-w-0 truncate",
                        isKcvv ? "font-semibold not-italic" : "italic",
                      )}
                      title={entry.team_name}
                    >
                      {entry.team_name}
                    </span>
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
    </div>
  );
}
