"use client";

/**
 * PROTOTYPE — throwaway, issue #2387. Delete before the PR.
 *
 * Variant D — today's strip plus a two-slide switch: slide 1 is the last
 * result, slide 2 is the next fixture. The result slide is the default, so
 * "wat gebeurde" is what loads.
 *
 * Deliberately NOT a carousel: two slides, no auto-advance, no swipe-only
 * affordance. The arrows are real labelled buttons with `aria-live` on the
 * slide, because the strip sits at the top of every landing page and
 * DESIGN.md forbids hiding anything necessary behind an undiscoverable
 * interaction.
 *
 * The DESKTOP layout is approved (owner, 2026-08-06) and is identical in every
 * variant below — only the sub-`lg` block differs:
 *
 *   D  — today's row: crest · KCVV · score · opponent · crest  (name capped at 40%)
 *   D1 — stacked: crests + score on line 1, full pairing on line 2
 *   D2 — opponent-led: KCVV dropped entirely, opponent owns the full width
 *   D3 — score-left: score anchored left, opponent name to its right over 2 lines
 */

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { MonoLabel } from "@/components/design-system/MonoLabel";
import { getButtonClasses } from "@/components/design-system/Button";
import { House, Bus } from "@/lib/icons.redesign";
import { OUTCOME_UNDERLINE } from "@/lib/utils/match-display";
import { KCVV, outcomeOf, type ProtoCase, type ProtoTeam } from "./_data";

const HREF = "/wedstrijd/12345";

export const NAME_D = "Slider — mobiel: vandaag's rij (naam max 40%)";
export const NAME_D1 =
  "Slider — mobiel: crests + score boven, naam op volle breedte";
export const NAME_D2 = "Slider — mobiel: alleen de tegenstander, KCVV weg";
export const NAME_D3 = "Slider — mobiel: score links, naam rechts";

export type MobileLayout = "today" | "stacked" | "opponent" | "scoreleft";

/* ── atoms ───────────────────────────────────────────────────────────────── */

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
  outcome: "win" | "draw" | "loss";
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

function Meta({
  home,
  children,
}: {
  home: boolean;
  children: React.ReactNode;
}) {
  const Icon = home ? House : Bus;
  return (
    <div className="text-ink flex items-center justify-center gap-2 font-mono">
      <Icon
        aria-label={home ? "Thuiswedstrijd" : "Uitwedstrijd"}
        className="h-4 w-4 shrink-0"
      />
      <span className="text-mono-sm font-semibold">{children}</span>
    </div>
  );
}

/* ── the shell + switch, shared by every variant ──────────────────────────── */

interface SlideData {
  home: ProtoTeam;
  away: ProtoTeam;
  opponent: ProtoTeam;
  kcvvHome: boolean;
  outcome: "win" | "draw" | "loss" | null;
  score: string | null;
  meta: string;
}

function useSlides(data: ProtoCase): [SlideData, SlideData] {
  const { result, fixture } = data;
  const o = outcomeOf(result);
  return [
    {
      home: result.kcvvHome ? KCVV : result.opponent,
      away: result.kcvvHome ? result.opponent : KCVV,
      opponent: result.opponent,
      kcvvHome: result.kcvvHome,
      outcome: o,
      score: result.kcvvHome
        ? `${result.kcvvGoals}–${result.oppGoals}`
        : `${result.oppGoals}–${result.kcvvGoals}`,
      meta: `${result.date} · ${result.competition}`,
    },
    {
      home: fixture.kcvvHome ? KCVV : fixture.opponent,
      away: fixture.kcvvHome ? fixture.opponent : KCVV,
      opponent: fixture.opponent,
      kcvvHome: fixture.kcvvHome,
      outcome: null,
      score: null,
      meta: `${fixture.date} · ${fixture.time} · ${fixture.competition}`,
    },
  ];
}

/* ── DESKTOP — approved, identical in every variant ──────────────────────── */

function DesktopSlide({ s }: { s: SlideData }) {
  return (
    <div className="hidden lg:block">
      <div className="flex min-w-0 items-center justify-center gap-3 px-6 py-3">
        <Crest team={s.home} big />
        <span className="font-display text-ink text-mono-md max-w-[40%] min-w-0 truncate leading-none font-bold italic">
          {s.home.short === "KCVV" ? "KCVV" : s.home.name}
        </span>
        {s.score && s.outcome ? (
          <Score outcome={s.outcome} className="text-mono-md shrink-0">
            {s.score}
          </Score>
        ) : (
          <span className="font-display text-ink/50 text-mono-md shrink-0 leading-none italic">
            vs.
          </span>
        )}
        <span className="font-display text-ink text-mono-md max-w-[40%] min-w-0 truncate leading-none font-bold italic">
          {s.away.short === "KCVV" ? "KCVV" : s.away.name}
        </span>
        <Crest team={s.away} big />
      </div>
      <Meta home={s.kcvvHome}>{s.meta}</Meta>
    </div>
  );
}

/* ── MOBILE — the four candidates ────────────────────────────────────────── */

function MobileToday({ s }: { s: SlideData }) {
  return (
    <div className="lg:hidden">
      <div className="flex min-w-0 items-center justify-center gap-3 px-4 py-3">
        <Crest team={s.home} />
        <span className="font-display text-ink text-mono-md max-w-[40%] min-w-0 truncate leading-none font-bold italic">
          {s.home.short === "KCVV" ? "KCVV" : s.home.name}
        </span>
        {s.score && s.outcome ? (
          <Score outcome={s.outcome} className="text-mono-md shrink-0">
            {s.score}
          </Score>
        ) : (
          <span className="font-display text-ink/50 text-mono-md shrink-0 leading-none italic">
            vs.
          </span>
        )}
        <span className="font-display text-ink text-mono-md max-w-[40%] min-w-0 truncate leading-none font-bold italic">
          {s.away.short === "KCVV" ? "KCVV" : s.away.name}
        </span>
        <Crest team={s.away} />
      </div>
      <div className="border-ink/15 border-t px-4 py-2">
        <Meta home={s.kcvvHome}>{s.meta}</Meta>
      </div>
    </div>
  );
}

/** D1 — crests + score on line 1, the full pairing on its own line below. */
function MobileStacked({ s }: { s: SlideData }) {
  return (
    <div className="lg:hidden">
      <div className="flex items-center justify-center gap-4 px-4 pt-3">
        <Crest team={s.home} big />
        {s.score && s.outcome ? (
          <Score outcome={s.outcome} className="text-display-sm leading-none">
            {s.score}
          </Score>
        ) : (
          <span className="font-display text-ink/50 text-mono-md leading-none italic">
            vs.
          </span>
        )}
        <Crest team={s.away} big />
      </div>
      {/* The name gets the full 358px column — one line, ellipsis if it still
          overruns. Owner's call: ellipsis over wrapping. */}
      <p className="font-display text-ink mt-2 mb-0 truncate px-4 text-center leading-none font-bold italic">
        {s.opponent.name}
      </p>
      <div className="border-ink/15 mt-2 border-t px-4 py-2">
        <Meta home={s.kcvvHome}>{s.meta}</Meta>
      </div>
    </div>
  );
}

/**
 * D2 — KCVV is dropped entirely. Every match on this site involves KCVV, so
 * on a 390px screen the club's own name is the one word that carries no
 * information. The whole width goes to the opponent.
 */
function MobileOpponent({ s }: { s: SlideData }) {
  return (
    <div className="lg:hidden">
      <div className="flex min-w-0 items-center gap-3 px-4 pt-3">
        <Crest team={s.opponent} big />
        <span className="font-display text-ink min-w-0 flex-1 truncate leading-none font-bold italic">
          {s.opponent.name}
        </span>
        {s.score && s.outcome ? (
          <Score
            outcome={s.outcome}
            className="text-display-sm shrink-0 leading-none"
          >
            {s.score}
          </Score>
        ) : null}
      </div>
      <div className="border-ink/15 mt-3 border-t px-4 py-2">
        <Meta home={s.kcvvHome}>{s.meta}</Meta>
      </div>
    </div>
  );
}

/** D3 — score anchored left, opponent name to its right over up to 2 lines. */
function MobileScoreLeft({ s }: { s: SlideData }) {
  return (
    <div className="lg:hidden">
      <div className="flex min-w-0 items-center gap-4 px-4 pt-3">
        <div className="shrink-0 text-center">
          {s.score && s.outcome ? (
            <Score outcome={s.outcome} className="text-display-sm leading-none">
              {s.score}
            </Score>
          ) : (
            <span className="text-ink-muted">
              <MonoLabel size="sm">Nog te spelen</MonoLabel>
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-ink-muted block">
            <MonoLabel size="sm">
              {s.kcvvHome ? "KCVV — thuis tegen" : "KCVV — uit bij"}
            </MonoLabel>
          </span>
          <span className="font-display text-ink mt-1 block truncate leading-none font-bold italic">
            {s.opponent.name}
          </span>
        </div>
        <Crest team={s.opponent} big />
      </div>
      <div className="border-ink/15 mt-3 border-t px-4 py-2">
        <Meta home={s.kcvvHome}>{s.meta}</Meta>
      </div>
    </div>
  );
}

const MOBILE = {
  today: MobileToday,
  stacked: MobileStacked,
  opponent: MobileOpponent,
  scoreleft: MobileScoreLeft,
};

/* ── the variant itself ──────────────────────────────────────────────────── */

function Slider({ data, mobile }: { data: ProtoCase; mobile: MobileLayout }) {
  const slides = useSlides(data);
  const [i, setI] = useState<0 | 1>(0);
  const s = slides[i];
  const MobileSlide = MOBILE[mobile];

  return (
    <aside
      aria-label="Laatste uitslag en volgende wedstrijd"
      className="bg-cream border-t-jersey-deep/35 border-b-ink/15 grid border-t border-b lg:grid-cols-[auto_1fr_auto]"
    >
      <div className="border-ink/15 flex items-center justify-center gap-2 border-b px-4 py-2 lg:border-r lg:border-b-0 lg:px-5">
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

      <div aria-live="polite" className="min-w-0">
        <MobileSlide s={s} />
        <DesktopSlide s={s} />
      </div>

      <div className="border-ink/15 flex items-center justify-center border-t px-4 py-3 lg:justify-end lg:border-0 lg:px-6">
        <a
          href={HREF}
          className={getButtonClasses({
            variant: "primary",
            size: "sm",
            className: "no-underline",
          })}
        >
          Wedstrijddetails
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </aside>
  );
}

export function VariantD({ data }: { data: ProtoCase }) {
  return <Slider data={data} mobile="today" />;
}
export function VariantD1({ data }: { data: ProtoCase }) {
  return <Slider data={data} mobile="stacked" />;
}
export function VariantD2({ data }: { data: ProtoCase }) {
  return <Slider data={data} mobile="opponent" />;
}
export function VariantD3({ data }: { data: ProtoCase }) {
  return <Slider data={data} mobile="scoreleft" />;
}
