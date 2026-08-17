/**
 * ScheurkalenderPage Component
 *
 * Private InDesign-poster data source (#2137) — poster layout, locked with the
 * owner against the live 26/27 season.
 *
 * Renders the full-season A + B *league* fixture list the club screenshots into
 * the season poster. The poster block is 340 × 567 mm, which a single
 * chronological column cannot fill without dropping the club names below ~3.4 mm
 * printed; the fixtures are therefore split across **two columns on the calendar
 * year** (first year left, second right) so the break always lands on New Year
 * regardless of how the fixture list shifts season to season.
 *
 * Within a column: a Freight Big month heading (month in ink, year as an italic
 * jersey-deep `<em>`, trailing period, no rule beneath — mirroring
 * `/ploegen/[slug]/wedstrijden`), then one row per fixture. Each row opens with a
 * fixed three-stop date tab — weekday · day · kickoff — so every club name starts
 * on the same left edge, and weekends are separated by a dotted seam.
 *
 * Deliberately absent: logos, squad pills, scores, and free-weekend markers.
 */

import { DateTime } from "luxon";
import { toDisplayZone } from "@/lib/utils/dates";
import { capitalize } from "@/lib/utils/capitalize";
import { EmptyState, PageContainer } from "@/components/design-system";
import { PrintButton } from "./PrintButton";
import { PrintDate } from "./PrintDate";

export interface ScheurkalenderMatch {
  id: number;
  /**
   * ISO calendar date (`YYYY-MM-DD`); kickoff time lives in `time`. The route
   * already read the day off the match Date's UTC fields (`toMatchDisplayZone`).
   */
  date: string;
  /** Kickoff time as `HH:MM`. */
  time?: string;
  /** Opponent club name, already casing-normalised by the BFF (#2336). */
  opponent: string;
  /** Which KCVV squad plays — rendered inline ("KCVV Elewijt A" / "… B"). */
  kcvvLabel: "A" | "B";
  /** True when KCVV plays at home (KCVV occupies the home slot). */
  kcvvIsHome: boolean;
}

export interface ScheurkalenderPageProps {
  /** Full-season A + B league fixtures, pre-sorted by date then time. */
  matches: ScheurkalenderMatch[];
  /** Season label for the masthead, e.g. "26/27". */
  season: string;
}

interface Weekend {
  key: string;
  /** The weekend's Saturday — anchors which month/year the weekend belongs to. */
  saturday: DateTime;
  matches: ScheurkalenderMatch[];
}

interface MonthGroup {
  key: string;
  /** "Augustus" */
  monthName: string;
  /** "’26" */
  yearSuffix: string;
  weekends: Weekend[];
}

const NL_WEEKDAYS = ["ma", "di", "wo", "do", "vr", "za", "zo"];

/** Bucket fixtures per weekend (ISO week — Mon–Sun share a group). */
function groupByWeekend(matches: ScheurkalenderMatch[]): Weekend[] {
  const order: string[] = [];
  const buckets = new Map<string, ScheurkalenderMatch[]>();
  for (const match of matches) {
    const dt = toDisplayZone(match.date);
    const key = `${dt.weekYear}-W${String(dt.weekNumber).padStart(2, "0")}`;
    let bucket = buckets.get(key);
    if (!bucket) {
      bucket = [];
      buckets.set(key, bucket);
      order.push(key);
    }
    bucket.push(match);
  }
  return order.map((key) => {
    const bucket = buckets.get(key)!;
    // Anchor on the weekend's Saturday so a Sat/Sun pair never straddles two
    // month headings (e.g. 31 Jan + 1 Feb both belong to January).
    const monday = toDisplayZone(bucket[0]!.date).startOf("week");
    return { key, saturday: monday.plus({ days: 5 }), matches: bucket };
  });
}

/** Bucket weekends per month, labelled from the weekend's Saturday. */
function groupByMonth(weekends: Weekend[]): MonthGroup[] {
  const groups: MonthGroup[] = [];
  for (const weekend of weekends) {
    const key = weekend.saturday.toFormat("yyyy-MM");
    const last = groups.at(-1);
    if (last?.key === key) {
      last.weekends.push(weekend);
      continue;
    }
    groups.push({
      key,
      monthName: capitalize(weekend.saturday.toFormat("LLLL")),
      yearSuffix: `’${weekend.saturday.toFormat("yy")}`,
      weekends: [weekend],
    });
  }
  return groups;
}

/**
 * Split weekends into the poster's two columns on the calendar year: the first
 * year left, everything after it right. Returns a single column when the
 * fixtures span only one year, so the sheet never renders an empty half.
 */
function splitByYear(weekends: Weekend[]): Weekend[][] {
  const firstYear = weekends[0]?.saturday.year;
  if (firstYear === undefined) return [];
  const left = weekends.filter((w) => w.saturday.year === firstYear);
  const right = weekends.filter((w) => w.saturday.year !== firstYear);
  return right.length > 0 ? [left, right] : [left];
}

function FixtureRow({ match }: { match: ScheurkalenderMatch }) {
  const dt = toDisplayZone(match.date);
  const kcvvName = (
    <>
      KCVV Elewijt <span className="text-jersey-deep">{match.kcvvLabel}</span>
    </>
  );
  const home = match.kcvvIsHome ? kcvvName : match.opponent;
  const away = match.kcvvIsHome ? match.opponent : kcvvName;

  return (
    <div className="flex items-baseline gap-3 py-[5px]">
      {/* Fixed tab stops: weekday · day · kickoff. The hairline keeps the display
          numeral and the mono time from reading as one run of digits. The third
          track is a fixed width, not `auto` — `time` is optional, and an auto
          track collapses on a timeless fixture and shunts its club names left
          out of line with every other row. */}
      <div className="grid shrink-0 grid-cols-[17px_20px_46px] items-baseline gap-x-2">
        <span className="text-ink-muted font-mono text-[9px] tracking-[0.08em] uppercase">
          {NL_WEEKDAYS[dt.weekday - 1]}
        </span>
        <span className="font-display text-ink text-right text-[19px] leading-none">
          {dt.day}
        </span>
        <span className="text-ink-muted border-ink/15 border-l pl-2.5 font-mono text-[11px] leading-[1.4]">
          {match.time ?? ""}
        </span>
      </div>
      <div className="text-ink flex-1 text-sm leading-tight">
        <span className={match.kcvvIsHome ? "font-extrabold" : "text-ink-soft"}>
          {home}
        </span>
        <span className="text-ink-muted mx-[7px] text-xs">&ndash;</span>
        <span className={match.kcvvIsHome ? "text-ink-soft" : "font-extrabold"}>
          {away}
        </span>
      </div>
    </div>
  );
}

function FixtureColumn({ weekends }: { weekends: Weekend[] }) {
  return (
    <>
      {groupByMonth(weekends).map((group) => (
        // The top-margin reset belongs on the <section> — the <h2> is always its
        // section's first child, so `first:` on the heading would match every month.
        <section
          key={group.key}
          aria-label={`${group.monthName} ${group.yearSuffix}`}
          className="mt-5 first:mt-0.5"
        >
          {/* Month heading — Freight Big, ink month + italic jersey-deep year,
              trailing period, no rule beneath. The kit ships freight-big-pro
              italic at 400/700 only, so the year stays at a real 700 rather
              than a browser-faked oblique 900. */}
          <h2 className="font-display-big text-ink mb-[7px] text-[30px] leading-[1.05] font-black tracking-[-0.01em]">
            {group.monthName}{" "}
            <em className="text-jersey-deep font-bold italic">
              {group.yearSuffix}
            </em>
            .
          </h2>
          {group.weekends.map((weekend, index) => (
            <div
              key={weekend.key}
              className={
                index > 0
                  ? "border-ink/20 mt-0.5 border-t border-dotted pt-0.5"
                  : ""
              }
            >
              {weekend.matches.map((match) => (
                <FixtureRow key={match.id} match={match} />
              ))}
            </div>
          ))}
        </section>
      ))}
    </>
  );
}

export function ScheurkalenderPage({
  matches,
  season,
}: ScheurkalenderPageProps) {
  const columns = splitByYear(groupByWeekend(matches));
  const hasMatches = columns.length > 0;

  return (
    <div className="bg-cream min-h-screen print:bg-white">
      {/* Screen-only toolbar — hidden on print and cropped out of poster screenshots. */}
      <PageContainer className="flex justify-end pt-6 print:hidden">
        <PrintButton />
      </PageContainer>

      <PageContainer className="pt-4 pb-12 print:p-0">
        {/* The "sheet" — this is what gets screenshotted into the poster. */}
        <div className="border-ink border-2 bg-white print:border-0">
          {/* Masthead */}
          <div className="border-ink flex items-baseline justify-between gap-4 border-b-2 px-4 py-3.5">
            <h1 className="font-body text-ink text-lg font-extrabold tracking-[0.02em] uppercase">
              KCVV Elewijt — Competitie {season}
            </h1>
            <p className="text-ink-muted font-mono text-[10px] tracking-[0.08em] uppercase">
              A &amp; B · Wedstrijdkalender
            </p>
          </div>

          {hasMatches ? (
            <div
              className={`grid px-5 pt-1.5 pb-[18px] ${
                columns.length > 1 ? "grid-cols-2" : "grid-cols-1"
              }`}
            >
              {columns.map((weekends, index) => (
                <div
                  key={weekends[0]?.key ?? index}
                  className={
                    index === 0 && columns.length > 1
                      ? "border-ink/15 border-r pr-[17px]"
                      : columns.length > 1
                        ? "pl-[17px]"
                        : ""
                  }
                >
                  <FixtureColumn weekends={weekends} />
                </div>
              ))}
            </div>
          ) : (
            // "gevonden" is banned outside query surfaces (#2427 rule 3) — this
            // is a data source, not a search.
            <EmptyState tier="surface" heading="Geen competitiewedstrijden">
              Er zijn geen competitiewedstrijden voor dit seizoen beschikbaar.
            </EmptyState>
          )}
        </div>

        {/* Print-only footer — kiosk prints get a date; the screen sheet stays clean. */}
        <p className="text-ink-muted mt-4 hidden text-center font-mono text-[10px] uppercase print:block">
          KCVV Elewijt · Competitie {season} · afgedrukt op <PrintDate />
        </p>
      </PageContainer>
    </div>
  );
}
