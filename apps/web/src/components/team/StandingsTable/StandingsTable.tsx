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
 * Applied via `overflowsClassName`: the anchor has to hold for the whole
 * scroll session, including its last few pixels where `canScrollRight`
 * already reads false — `overflows` (#2489) is the static "does this
 * track overflow at all" signal built for that.
 *
 * The pinned cells paint `bg-cream` by default, EXCEPT on the KCVV row
 * (`tr[data-kcvv='true']`, review finding 2): a plain `bg-cream` there
 * would erase the highlight on exactly the columns a supporter scans to
 * find their own club. The row's own tint and inset accent rule are drawn
 * on the `<tr>` (`KCVV_HIGHLIGHT_CLASS`), but a pinned `<td>` needs an
 * opaque background to occlude the columns scrolling underneath it — table
 * cell backgrounds paint above the row's — so the tint (and, on the
 * leading cell, the accent rule) has to be repeated at the cell level or
 * it is hidden behind that opaque `bg-cream` the moment the row is pinned.
 * The higher-specificity `tr[data-kcvv='true'] > td` selectors below win
 * over the plain ones regardless of source order.
 *
 * `Ptn` also gets a fixed `w-14` for the same reason `#` gets `w-12`: the
 * scroll arrow and fade are absolutely positioned against the track's own
 * right edge, which is exactly where the pinned `Ptn` column now always
 * sits — an unmoved `right-0` arrow paints on top of it, defeating the
 * pin for whichever rows sit at the button's vertical centre (review
 * finding 3). `StandingsTable` passes `chromeClassName="right-14"` to
 * `<ScrollOverlay>` to inset both past it; a fixed width is what makes
 * that offset a known, stable number instead of "however wide today's
 * longest point total happens to render."
 */
// The KCVV tint, repeated literally below (not interpolated) — Tailwind's
// scanner needs the full class string to appear verbatim in source; a
// template-literal composed at runtime is invisible to it.
const ANCHOR_TRACK_CLASSES = [
  "[&>table>thead>tr>th:nth-child(-n+2)]:sticky [&>table>thead>tr>th:nth-child(-n+2)]:z-10 [&>table>thead>tr>th:nth-child(-n+2)]:bg-cream",
  "[&>table>tbody>tr>td:nth-child(-n+2)]:sticky [&>table>tbody>tr>td:nth-child(-n+2)]:z-10 [&>table>tbody>tr>td:nth-child(-n+2)]:bg-cream",
  "[&>table>tbody>tr[data-kcvv='true']>td:nth-child(-n+2)]:bg-[color-mix(in_srgb,var(--color-jersey-deep)_12%,var(--color-cream))]",
  "[&>table>thead>tr>th:first-child]:left-0 [&>table>tbody>tr>td:first-child]:left-0",
  "[&>table>thead>tr>th:first-child]:w-12 [&>table>tbody>tr>td:first-child]:w-12",
  "[&>table>thead>tr>th:nth-child(2)]:left-12 [&>table>tbody>tr>td:nth-child(2)]:left-12",
  "[&>table>thead>tr>th:nth-child(2)]:shadow-[2px_0_4px_-1px_rgba(0,0,0,0.12)]",
  "[&>table>tbody>tr>td:nth-child(2)]:shadow-[2px_0_4px_-1px_rgba(0,0,0,0.12)]",
  "[&>table>tbody>tr[data-kcvv='true']>td:first-child]:shadow-[inset_3px_0_0_var(--color-jersey-deep)]",
  "[&>table>thead>tr>th:last-child]:sticky [&>table>thead>tr>th:last-child]:right-0 [&>table>thead>tr>th:last-child]:z-10 [&>table>thead>tr>th:last-child]:bg-cream",
  "[&>table>tbody>tr>td:last-child]:sticky [&>table>tbody>tr>td:last-child]:right-0 [&>table>tbody>tr>td:last-child]:z-10 [&>table>tbody>tr>td:last-child]:bg-cream",
  "[&>table>thead>tr>th:last-child]:w-14 [&>table>tbody>tr>td:last-child]:w-14",
  "[&>table>tbody>tr[data-kcvv='true']>td:last-child]:bg-[color-mix(in_srgb,var(--color-jersey-deep)_12%,var(--color-cream))]",
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
          // `min-w-44` (not `min-w-0`) is load-bearing: a flex item's
          // default min-width is its content's full nowrap width, so
          // `truncate` never actually truncates without SOME numeric
          // floor. `min-w-0` set that floor to zero, which let this column
          // shrink to nothing — a `table-layout: auto` table only needs to
          // fit its container, so it shrank the name instead of ever
          // overflowing (#2582 review finding 1: `overflows` stayed false
          // at every viewport, so `ANCHOR_TRACK_CLASSES` never mounted).
          //
          // 176px is not a guess: measured live (Playwright, 375px
          // viewport, the real `<ScrollOverlay>` track, not a JSDOM mock)
          // against `StandingsTable.stories.tsx`'s `fullDivision` fixture,
          // the other seven columns' own natural minimums sum to ~194px
          // out of a 343px track (Storybook's own page padding removed),
          // so anything the browser can shrink this column to at or below
          // ~149px lets the table fit without ever overflowing — a first
          // attempt at `min-w-28` (112px) proved exactly that, byte-
          // identical before/after. 176px clears that equilibrium with
          // margin (~18-20 readable characters) and reliably forces
          // overflow at 375px while changing nothing at tablet/desktop,
          // where the column was never the bottleneck.
          "font-display text-ink min-w-44 truncate",
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
        // Insets the arrow + fade past the pinned `Ptn` column (fixed at
        // `w-14` above) so they no longer overlay it — see the
        // ANCHOR_TRACK_CLASSES docblock, review finding 3.
        chromeClassName="right-14"
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
                  // Read by ANCHOR_TRACK_CLASSES so the pinned cells can
                  // carry this row's own tint (review finding 2) — a plain
                  // attribute hook rather than threading `isKcvv` into a
                  // static class string computed once for the whole track.
                  data-kcvv={isKcvv || undefined}
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
