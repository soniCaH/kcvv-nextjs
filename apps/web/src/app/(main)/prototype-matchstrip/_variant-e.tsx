"use client";

/**
 * PROTOTYPE — throwaway, issue #2387. Delete before the PR.
 *
 * Variant E — owner's composite (2026-08-06):
 *
 *   MOBILE  — variant A's ledger, both rows visible at once, no CTA button.
 *             Each row IS the link to its own match detail page, the same
 *             contract `TeamAgendaRow` uses: the row owns its `<Link>`, so
 *             it's one touch target with no nested interactives, and the
 *             trailing chevron is the visible affordance (never hover-only).
 *   DESKTOP  — the approved D slider: one match at a time, switch on the
 *             left, `Wedstrijddetails` CTA on the right.
 *
 * Names truncate with an ellipsis; they never wrap (owner's call).
 */

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { MonoLabel } from "@/components/design-system/MonoLabel";
import { getButtonClasses } from "@/components/design-system/Button";
import { House, Bus } from "@/lib/icons.redesign";
import { OUTCOME_UNDERLINE } from "@/lib/utils/match-display";
import {
  KCVV,
  outcomeOf,
  type Outcome,
  type ProtoCase,
  type ProtoTeam,
} from "./_data";

export const NAME_E =
  "Mobiel: A-ledger, hele rij is de link · Desktop: D-slider";

/** "zo 3 aug" -> { day: "3", month: "aug" }. Prototype-grade parsing. */
function splitDate(d: string): { day: string; month: string } {
  const parts = d.split(/\s+/);
  return { day: parts[1] ?? "", month: parts[2] ?? "" };
}

function Crest({ team, big = false }: { team: ProtoTeam; big?: boolean }) {
  const size = big ? "h-9 w-9" : "h-7 w-7";
  if (team.logo) {
    return (
      <img
        src={team.logo}
        alt=""
        className={cn(size, "shrink-0 object-contain")}
        loading="lazy"
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className={cn(
        "border-ink/40 bg-cream-soft text-ink inline-flex shrink-0 items-center justify-center border",
        "font-display text-mono-sm leading-none font-black italic",
        size,
      )}
    >
      {team.short[0]}
    </span>
  );
}

function Score({
  children,
  outcome,
  className,
}: {
  children: React.ReactNode;
  outcome: Outcome;
  className?: string;
}) {
  const shadow = OUTCOME_UNDERLINE[outcome];
  return (
    <span
      className={cn("text-ink font-mono font-bold", className)}
      style={shadow ? { boxShadow: shadow, padding: "0 8px" } : undefined}
    >
      {children}
    </span>
  );
}

function VenueGlyph({ home }: { home: boolean }) {
  const Icon = home ? House : Bus;
  return (
    <Icon
      aria-label={home ? "Thuiswedstrijd" : "Uitwedstrijd"}
      className="text-ink-muted h-4 w-4 shrink-0"
    />
  );
}

/* ── MOBILE — two linked ledger rows ─────────────────────────────────────── */

/**
 * The date moves into `TeamAgendaRow`'s date-stub primitive — 44px instead of
 * ~110px inline — which is what buys the opponent name its width back. The
 * result row is told apart from the fixture row by its score-with-sweep vs a
 * kickoff time; the accessible name spells it out for anyone that isn't
 * obvious to.
 */
function DateStub({ day, month }: { day: string; month: string }) {
  // Unboxed on purpose: a bordered stub next to the bordered crest reads as
  // two competing squares. `TeamAgendaRow` can afford the box because it sits
  // inside a ticket-stub card; this is a flat band.
  return (
    <span className="text-ink text-mono-sm w-12 shrink-0 font-mono font-bold whitespace-nowrap tabular-nums">
      {day}{" "}
      <span className="text-ink-muted font-medium uppercase">{month}</span>
    </span>
  );
}

function LedgerLinkRow({
  href,
  label,
  day,
  month,
  team,
  home,
  trailing,
  last = false,
}: {
  href: string;
  label: string;
  day: string;
  month: string;
  team: ProtoTeam;
  home: boolean;
  trailing: React.ReactNode;
  last?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={cn(
        "hover:bg-cream-soft focus-visible:outline-jersey-deep flex min-w-0 items-center gap-2.5 px-4 py-2.5 no-underline",
        "focus-visible:outline-2 focus-visible:outline-offset-[-2px]",
        last ? "" : "border-ink/15 border-b",
      )}
    >
      <DateStub day={day} month={month} />
      <Crest team={team} />
      <span className="font-display text-ink min-w-0 flex-1 truncate leading-none font-bold italic">
        {team.name}
      </span>
      <VenueGlyph home={home} />
      <span className="shrink-0">{trailing}</span>
      <span aria-hidden="true" className="text-ink-muted shrink-0 font-mono">
        →
      </span>
    </Link>
  );
}

/* ── DESKTOP — the approved slider ───────────────────────────────────────── */

function DesktopSlider({ data }: { data: ProtoCase }) {
  const { result, fixture } = data;
  const o = outcomeOf(result);
  const [i, setI] = useState<0 | 1>(0);

  const showing = i === 0 ? result : fixture;
  const home = i === 0 ? result.kcvvHome : fixture.kcvvHome;
  const leftTeam = home ? KCVV : showing.opponent;
  const rightTeam = home ? showing.opponent : KCVV;

  return (
    <div className="hidden lg:grid lg:grid-cols-[auto_1fr_auto]">
      <div className="border-ink/15 flex items-center justify-center gap-2 border-r px-5">
        <button
          type="button"
          onClick={() => setI(0)}
          disabled={i === 0}
          aria-label="Toon de laatste uitslag"
          className="border-ink text-ink hover:bg-cream-soft flex h-9 w-9 items-center justify-center border-2 font-mono text-sm disabled:opacity-30"
        >
          ←
        </button>
        <span className="text-ink-muted w-20 text-center">
          <MonoLabel size="sm">{i === 0 ? "Uitslag" : "Volgende"}</MonoLabel>
        </span>
        <button
          type="button"
          onClick={() => setI(1)}
          disabled={i === 1}
          aria-label="Toon de volgende wedstrijd"
          className="border-ink text-ink hover:bg-cream-soft flex h-9 w-9 items-center justify-center border-2 font-mono text-sm disabled:opacity-30"
        >
          →
        </button>
      </div>

      <div aria-live="polite" className="min-w-0 py-3">
        <div className="flex min-w-0 items-center justify-center gap-3 px-6">
          <Crest team={leftTeam} big />
          <span className="font-display text-ink text-mono-md max-w-[40%] min-w-0 truncate leading-none font-bold italic">
            {leftTeam.short === "KCVV" ? "KCVV" : leftTeam.name}
          </span>
          {i === 0 ? (
            <Score outcome={o} className="text-mono-md shrink-0">
              {result.kcvvHome
                ? `${result.kcvvGoals}–${result.oppGoals}`
                : `${result.oppGoals}–${result.kcvvGoals}`}
            </Score>
          ) : (
            <span className="font-display text-ink/50 text-mono-md shrink-0 leading-none italic">
              vs.
            </span>
          )}
          <span className="font-display text-ink text-mono-md max-w-[40%] min-w-0 truncate leading-none font-bold italic">
            {rightTeam.short === "KCVV" ? "KCVV" : rightTeam.name}
          </span>
          <Crest team={rightTeam} big />
        </div>
        {/* No venue glyph here: on desktop both teams render in true scoreboard
            order, so the layout already says who was at home. The glyph only
            earns its place on mobile, where the row shows the opponent alone. */}
        <div className="text-ink mt-1.5 flex items-center justify-center font-mono">
          <span className="text-mono-sm font-semibold">
            {i === 0
              ? `${result.date} · ${result.competition}`
              : `${fixture.date} · ${fixture.time} · ${fixture.competition}`}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-end px-6">
        <Link
          href={`/wedstrijd/${showing.id}`}
          className={getButtonClasses({
            variant: "primary",
            size: "sm",
            className: "no-underline",
          })}
        >
          Wedstrijddetails
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}

/* ── the variant ─────────────────────────────────────────────────────────── */

export function VariantE({ data }: { data: ProtoCase }) {
  const { result, fixture } = data;
  const o = outcomeOf(result);

  return (
    <aside
      aria-label="Laatste uitslag en volgende wedstrijd"
      className="bg-cream border-t-jersey-deep/35 border-b-ink/15 border-t border-b"
    >
      <div className="lg:hidden">
        <LedgerLinkRow
          href={`/wedstrijd/${result.id}`}
          label={`Uitslag ${result.date}: KCVV Elewijt tegen ${result.opponent.name}`}
          day={splitDate(result.date).day}
          month={splitDate(result.date).month}
          team={result.opponent}
          home={result.kcvvHome}
          trailing={
            <Score outcome={o} className="text-mono-md">
              {result.kcvvHome
                ? `${result.kcvvGoals}–${result.oppGoals}`
                : `${result.oppGoals}–${result.kcvvGoals}`}
            </Score>
          }
        />
        <LedgerLinkRow
          href={`/wedstrijd/${fixture.id}`}
          label={`Volgende wedstrijd ${fixture.date} om ${fixture.time}: KCVV Elewijt tegen ${fixture.opponent.name}`}
          day={splitDate(fixture.date).day}
          month={splitDate(fixture.date).month}
          team={fixture.opponent}
          home={fixture.kcvvHome}
          last
          trailing={
            <span className="text-ink text-mono-sm font-mono font-semibold">
              {fixture.time}
            </span>
          }
        />
      </div>

      <DesktopSlider data={data} />
    </aside>
  );
}
