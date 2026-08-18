"use client";

/**
 * PROTOTYPE — #2693. Throwaway. Do not promote to production.
 *
 * Question: what does a tournament fixture row say, given that whether the
 * named club is the host or an opponent is not knowable from PSD?
 *
 * Three variants of the row on the real `/ploegen/[slug]/wedstrijden` route,
 * switchable via `?variant=`, plus `off` for today's unchanged row.
 *
 * All three shed the same things — the "vs" framing, the second crest read as
 * an opponent, the home/away icon, the score slot, and the row's click-through.
 * They disagree about what replaces them.
 *
 * Deliberately NOT prototyped: the featured ("Eerstvolgende") jersey-deep
 * treatment. Every variant renders on cream so they are judged on equal
 * ground. Whether a tournament may ever hold the green next-fixture slot at
 * all is a separate question for the grilling.
 */

import { useSearchParams } from "next/navigation";
import { Crest } from "@/components/design-system";
import { KCVV_CLUB_ID } from "@/lib/constants";
import { cn } from "@/lib/utils/cn";
import { toMatchDisplayZone } from "@/lib/utils/dates";
import type { ScheduleMatch } from "@/components/match/types";

export const PROTO_VARIANTS = ["A", "B", "C", "off"] as const;
export type ProtoVariant = (typeof PROTO_VARIANTS)[number];

export const PROTO_VARIANT_NAMES: Record<ProtoVariant, string> = {
  A: "Reservation register",
  B: "Location line",
  C: "Ticket band",
  off: "today, unchanged",
};

export function useProtoVariant(): ProtoVariant {
  const raw = useSearchParams().get("variant");
  return (PROTO_VARIANTS as readonly string[]).includes(raw ?? "")
    ? (raw as ProtoVariant)
    : "A";
}

/**
 * PROTOTYPE DETECTOR ONLY. Production must never string-match the Dutch
 * competition label — that ban is exactly why #2692 exists. This stands in for
 * `competitionType === "tournament"` until #2692 lands.
 */
export function isProtoTournament(match: ScheduleMatch): boolean {
  if (match.isPlaceholder) return false;
  return (match.competition ?? "").trim().toLowerCase() === "tornooi";
}

/** The club that is not KCVV — host or opponent, unknowable which. */
function namedClub(match: ScheduleMatch) {
  return match.homeTeam.id === KCVV_CLUB_ID ? match.awayTeam : match.homeTeam;
}

function startTime(match: ScheduleMatch): string {
  return match.time ?? toMatchDisplayZone(match.date).toFormat("HH:mm");
}

function dayNumber(date: Date): string {
  return toMatchDisplayZone(date).toFormat("d");
}

function monthShort(date: Date): string {
  return toMatchDisplayZone(date)
    .toFormat("MMM")
    .replace(/\.$/, "")
    .toLowerCase();
}

/** The list's card shell — sharp, 2px ink, hard offset shadow. No hover: none of these rows navigate. */
const CARD =
  "flex w-full items-stretch overflow-hidden border-2 border-ink bg-cream text-ink shadow-[2px_2px_0_0_var(--color-ink)]";

const MONO = "font-mono tracking-wider uppercase";

function DateStub({ date }: { date: Date }) {
  return (
    <div className="border-ink/30 bg-cream-soft/30 flex shrink-0 flex-col items-center justify-center gap-0 border-r-2 border-dashed px-3 py-3">
      <span className="font-display-big text-ink text-[18px] leading-none">
        {dayNumber(date)}
      </span>
      <span className={cn(MONO, "text-ink-muted text-[11px]")}>
        {monthShort(date)}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * A · Reservation register
 * The shipped placeholder row (#2632) with a richer subject. One crest,
 * one mono subject line, the time in the centred slot an ordinary row uses.
 * Tests: is the register #2632 already ships enough for this too?
 * ------------------------------------------------------------------ */
export function VariantA({ match }: { match: ScheduleMatch }) {
  const club = namedClub(match);
  const time = startTime(match);
  const subject = `${match.competition} · ${club.name}`;

  return (
    <article
      data-testid="proto-tournament-row"
      aria-label={`${subject}, ${dayNumber(match.date)} ${monthShort(match.date)} om ${time}`}
      className={CARD}
    >
      <div aria-hidden="true" className="contents">
        <DateStub date={match.date} />
        <div className="flex w-full items-center gap-2 px-3 py-2">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <Crest name={club.name} logo={club.logo} />
            <span
              className={cn(
                MONO,
                "text-ink-muted min-w-0 flex-1 truncate text-[9px]",
              )}
            >
              {subject}
            </span>
          </div>
          <span className="font-display-big shrink-0 px-1.5 text-[16px] leading-none tabular-nums sm:px-2 sm:text-[18px]">
            {time}
          </span>
          <div className="hidden flex-1 sm:block" />
        </div>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ *
 * B · Location line
 * The tournament is the subject in display type; the club is demoted to a
 * place ("bij …"); the time is prefixed "vanaf" so it cannot read as a
 * kickoff. No centred column — the trailing edge holds the start time.
 * Tests: does naming the event and placing the club kill the match reading?
 * ------------------------------------------------------------------ */
export function VariantB({ match }: { match: ScheduleMatch }) {
  const club = namedClub(match);
  const time = startTime(match);

  return (
    <article
      data-testid="proto-tournament-row"
      aria-label={`${match.competition} bij ${club.name}, ${dayNumber(match.date)} ${monthShort(match.date)} vanaf ${time}`}
      className={CARD}
    >
      <div aria-hidden="true" className="contents">
        <DateStub date={match.date} />
        <div className="flex w-full items-center gap-3 px-3 py-2">
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="font-display-big text-ink text-[18px] leading-none">
              {match.competition}
            </span>
            <span className="flex min-w-0 items-center gap-1.5">
              <Crest name={club.name} logo={club.logo} size={14} />
              <span className="text-ink-muted min-w-0 truncate text-[13px]">
                bij {club.name}
              </span>
            </span>
          </div>
          <span
            className={cn(MONO, "text-ink shrink-0 text-[11px] font-semibold")}
          >
            vanaf {time}
          </span>
        </div>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ *
 * C · Ticket band
 * Not a fixture row at all. No date stub, no scoreboard rhythm — a banded
 * entry that interrupts the list, the way a diary entry interrupts a table.
 * Tests: should a tournament leave the fixture rhythm entirely?
 * ------------------------------------------------------------------ */
export function VariantC({ match }: { match: ScheduleMatch }) {
  const club = namedClub(match);
  const time = startTime(match);
  const when = `${dayNumber(match.date)} ${monthShort(match.date)}`;

  return (
    <article
      data-testid="proto-tournament-row"
      aria-label={`${match.competition} bij ${club.name}, ${when} vanaf ${time}`}
      className="border-ink bg-cream-deep text-ink flex w-full items-center gap-3 border-y-2 border-dashed px-4 py-3"
    >
      <div aria-hidden="true" className="contents">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <span className={cn(MONO, "text-ink-muted text-[9px]")}>
            {match.competition} · {when} · vanaf {time}
          </span>
          <span className="font-display-big text-ink min-w-0 truncate text-[20px] leading-none">
            bij {club.name}
          </span>
        </div>
        <Crest
          name={club.name}
          logo={club.logo}
          size={28}
          className="shrink-0"
        />
      </div>
    </article>
  );
}

export function ProtoTournamentRow({
  match,
  variant,
}: {
  match: ScheduleMatch;
  variant: ProtoVariant;
}) {
  if (variant === "B") return <VariantB match={match} />;
  if (variant === "C") return <VariantC match={match} />;
  return <VariantA match={match} />;
}
