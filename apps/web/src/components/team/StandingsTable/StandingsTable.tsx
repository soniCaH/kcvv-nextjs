import { Crest, MonoLabel } from "@/components/design-system";
import { isNumberlessTable } from "@/lib/utils/competitive-block-state";
import { cn } from "@/lib/utils/cn";
import { ScrollOverlay } from "@/components/design-system/ScrollHint/ScrollOverlay";
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

/**
 * Anchor group (#2476 rule 3): "a table declares its anchors; position
 * never decides." `#` + `Ploeg` are a declared *leading group* of two —
 * pinned left so they never scroll away — and `Ptn` is the one declared
 * *concluding* column, pinned right. The middle columns (M/W/G/V/+/-)
 * scroll underneath both.
 *
 * Applied via `overflowsClassName`, not `scrollableRightClassName`: the
 * anchor has to hold for the whole scroll session, including its last few
 * pixels where `canScrollRight` already reads false — `overflows` (#2489)
 * is the static "does this track overflow at all" signal built for that.
 *
 * ponytail: the pinned cells always paint a flat `bg-cream`, not the KCVV
 * row's tinted highlight — that tint (and its inset accent rule) still
 * shows on every un-pinned column of that row. Give the pinned cells the
 * tint too if a reviewer wants full-row parity while scrolled; leaving it
 * out keeps this to one background value instead of a per-row conditional
 * class computed inside `.map()`.
 */
const ANCHOR_TRACK_CLASSES = [
  "[&>table>thead>tr>th:nth-child(-n+2)]:sticky [&>table>thead>tr>th:nth-child(-n+2)]:z-10 [&>table>thead>tr>th:nth-child(-n+2)]:bg-cream",
  "[&>table>tbody>tr>td:nth-child(-n+2)]:sticky [&>table>tbody>tr>td:nth-child(-n+2)]:z-10 [&>table>tbody>tr>td:nth-child(-n+2)]:bg-cream",
  "[&>table>thead>tr>th:first-child]:left-0 [&>table>tbody>tr>td:first-child]:left-0",
  "[&>table>thead>tr>th:first-child]:w-12 [&>table>tbody>tr>td:first-child]:w-12",
  "[&>table>thead>tr>th:nth-child(2)]:left-12 [&>table>tbody>tr>td:nth-child(2)]:left-12",
  "[&>table>thead>tr>th:nth-child(2)]:shadow-[2px_0_4px_-1px_rgba(0,0,0,0.12)]",
  "[&>table>tbody>tr>td:nth-child(2)]:shadow-[2px_0_4px_-1px_rgba(0,0,0,0.12)]",
  "[&>table>thead>tr>th:last-child]:sticky [&>table>thead>tr>th:last-child]:right-0 [&>table>thead>tr>th:last-child]:z-10 [&>table>thead>tr>th:last-child]:bg-cream",
  "[&>table>tbody>tr>td:last-child]:sticky [&>table>tbody>tr>td:last-child]:right-0 [&>table>tbody>tr>td:last-child]:z-10 [&>table>tbody>tr>td:last-child]:bg-cream",
  "[&>table>thead>tr>th:last-child]:shadow-[-2px_0_4px_-1px_rgba(0,0,0,0.12)]",
  "[&>table>tbody>tr>td:last-child]:shadow-[-2px_0_4px_-1px_rgba(0,0,0,0.12)]",
].join(" ");

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
          <MonoLabel tone="muted">{caption}</MonoLabel>
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
      <ScrollOverlay
        role="region"
        ariaLabel={caption ?? "Klassement"}
        direction="right"
        overflowsClassName={ANCHOR_TRACK_CLASSES}
      >
        <table className="w-full border-collapse font-mono text-xs">
          {caption ? (
            <caption className="pb-2 text-left">
              <MonoLabel tone="muted">{caption}</MonoLabel>
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
              <th
                scope="col"
                className="text-ink-muted py-2 pr-2 text-right tracking-wider uppercase"
              >
                W
              </th>
              <th
                scope="col"
                className="text-ink-muted py-2 pr-2 text-right tracking-wider uppercase"
              >
                G
              </th>
              <th
                scope="col"
                className="text-ink-muted py-2 pr-2 text-right tracking-wider uppercase"
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

                  <td className="text-ink py-2 pr-2 text-right tabular-nums">
                    {entry.won}
                  </td>
                  <td className="text-ink py-2 pr-2 text-right tabular-nums">
                    {entry.drawn}
                  </td>
                  <td className="text-ink py-2 pr-2 text-right tabular-nums">
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
      </ScrollOverlay>
    </div>
  );
}
