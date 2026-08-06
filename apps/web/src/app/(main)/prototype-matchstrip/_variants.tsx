/**
 * PROTOTYPE — throwaway, issue #2387. Delete before the PR.
 *
 * Four structurally different answers to: "how does the strip carry a result
 * AND a next fixture without an opponent name wrapping at 390px?"
 *
 * All four use design tokens only — `text-[length:var(--text-label)]`,
 * `text-mono-sm`, `text-mono-md`, palette utilities. No new `text-[Npx]`.
 * Home/away reuses `TeamAgendaRow`'s House/Bus glyph (owner's call) so the
 * site keeps one vocabulary for that fact rather than three. Scores render in
 * true scoreboard order — home team first, not KCVV-first.
 *
 * Variant D lives in `_variant-d.tsx` because it needs client state.
 */

import { cn } from "@/lib/utils/cn";
import { MonoLabel } from "@/components/design-system/MonoLabel";
import { getButtonClasses } from "@/components/design-system/Button";
import { House, Bus } from "@/lib/icons.redesign";
import { OUTCOME_UNDERLINE } from "@/lib/utils/match-display";
import { VariantE, NAME_E } from "./_variant-e";
import {
  VariantD,
  VariantD1,
  VariantD2,
  VariantD3,
  NAME_D,
  NAME_D1,
  NAME_D2,
  NAME_D3,
} from "./_variant-d";
import {
  KCVV,
  OUTCOME_WORD,
  scoreboardScore,
  outcomeOf,
  type Outcome,
  type ProtoCase,
  type ProtoTeam,
} from "./_data";

/** The canonical marker: a highlighter sweep behind the score, none on a draw. */
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

const HREF = "/wedstrijd/12345";

const SHELL =
  "bg-cream border-t-jersey-deep/35 border-b-ink/15 border-t border-b";

/* ── shared atoms (deliberately minimal — variants own their layout) ─────── */

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

/** Reuses `TeamAgendaRow`'s venue glyph — one home/away vocabulary, not three. */
function VenueTag({ home }: { home: boolean }) {
  const Icon = home ? House : Bus;
  return (
    <Icon
      aria-label={home ? "Thuiswedstrijd" : "Uitwedstrijd"}
      className="text-ink-muted h-4 w-4 shrink-0"
    />
  );
}

function DetailsCta() {
  return (
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
  );
}

/* ── A — Ledger: two full-width rows, name owns the remaining width ─────── */

export const NAME_A = "Ledger — twee rijen, naam krijgt de restbreedte";

function LedgerRow({
  status,
  team,
  home,
  trailing,
}: {
  status: string;
  team: ProtoTeam;
  home: boolean;
  trailing: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3 px-4 py-2.5 lg:px-6">
      <span className="text-ink-muted w-16 shrink-0">
        <MonoLabel size="sm">{status}</MonoLabel>
      </span>
      <Crest team={team} />
      <span className="font-display text-ink min-w-0 flex-1 truncate leading-none font-bold italic">
        {team.name}
      </span>
      <VenueTag home={home} />
      <span className="shrink-0 text-right">{trailing}</span>
    </div>
  );
}

export function VariantA({ data }: { data: ProtoCase }) {
  const { result, fixture } = data;
  const o = outcomeOf(result);
  return (
    <aside aria-label="Laatste uitslag en volgende wedstrijd" className={SHELL}>
      <div className="lg:divide-ink/15 lg:grid lg:grid-cols-[1fr_1fr_auto] lg:divide-x">
        <LedgerRow
          status="Uitslag"
          team={result.opponent}
          home={result.kcvvHome}
          trailing={
            <Score outcome={o} className="text-mono-md">
              {scoreboardScore(result)}
            </Score>
          }
        />
        <div className="border-ink/15 border-t lg:border-t-0">
          <LedgerRow
            status="Volgende"
            team={fixture.opponent}
            home={fixture.kcvvHome}
            trailing={
              <span className="text-ink text-mono-sm font-mono font-semibold">
                {fixture.date} · {fixture.time}
              </span>
            }
          />
        </div>
        <div className="border-ink/15 flex items-center justify-center border-t px-4 py-3 lg:border-t-0 lg:px-6">
          <DetailsCta />
        </div>
      </div>
    </aside>
  );
}

/* ── B — Score first: name is a caption, free to wrap on its own line ───── */

export const NAME_B = "Score eerst — naam als bijschrift, mag wrappen";

export function VariantB({ data }: { data: ProtoCase }) {
  const { result, fixture } = data;
  const o = outcomeOf(result);
  return (
    <aside aria-label="Laatste uitslag en volgende wedstrijd" className={SHELL}>
      <div className="lg:divide-ink/15 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] lg:divide-x">
        {/* result */}
        <div className="flex items-center gap-4 px-4 py-3 lg:px-6">
          <div className="shrink-0 text-center">
            <Score outcome={o} className="text-display-sm leading-none">
              {scoreboardScore(result)}
            </Score>
            <span className="text-ink-muted mt-2 block">
              <MonoLabel size="sm">{OUTCOME_WORD[o]}</MonoLabel>
            </span>
          </div>
          <div className="min-w-0">
            <span className="text-ink-muted flex items-center gap-1.5">
              <MonoLabel size="sm">{result.date}</MonoLabel>
              <VenueTag home={result.kcvvHome} />
            </span>
            <span className="font-display text-ink mt-1 block truncate leading-none font-bold italic">
              {result.opponent.name}
            </span>
            <span className="text-ink-muted text-mono-sm mt-1 block font-mono">
              {result.competition}
            </span>
          </div>
        </div>

        {/* fixture */}
        <div className="border-ink/15 flex min-w-0 items-center gap-3 border-t px-4 py-3 lg:border-t-0 lg:px-6">
          <Crest team={fixture.opponent} />
          <div className="min-w-0">
            <span className="text-ink-muted block">
              <MonoLabel size="sm">Volgende</MonoLabel>
            </span>
            <span className="font-display text-ink mt-1 block truncate leading-none font-bold italic">
              {fixture.opponent.name}
            </span>
            <span className="text-ink text-mono-sm mt-1 flex items-center gap-1.5 font-mono font-semibold">
              {fixture.date} · {fixture.time}
              <VenueTag home={fixture.kcvvHome} />
            </span>
          </div>
        </div>

        <div className="border-ink/15 flex items-center justify-center border-t px-4 py-3 lg:border-t-0 lg:px-6">
          <DetailsCta />
        </div>
      </div>
    </aside>
  );
}

/* ── C — Crest-anchored: short code on the line, full name in the meta ──── */

export const NAME_C = "Crest-anker — afkorting boven, volle naam eronder";

function CrestPair({
  opponent,
  kcvvHome,
  middle,
}: {
  opponent: ProtoTeam;
  kcvvHome: boolean;
  middle: React.ReactNode;
}) {
  const left = kcvvHome ? KCVV : opponent;
  const right = kcvvHome ? opponent : KCVV;
  return (
    <div className="flex items-center justify-center gap-3">
      <Crest team={left} big />
      <span className="font-display text-ink text-mono-md leading-none font-bold italic">
        {left.short}
      </span>
      <span className="text-center">{middle}</span>
      <span className="font-display text-ink text-mono-md leading-none font-bold italic">
        {right.short}
      </span>
      <Crest team={right} big />
    </div>
  );
}

export function VariantC({ data }: { data: ProtoCase }) {
  const { result, fixture } = data;
  const o = outcomeOf(result);
  return (
    <aside aria-label="Laatste uitslag en volgende wedstrijd" className={SHELL}>
      <div className="lg:divide-ink/15 lg:grid lg:grid-cols-[1fr_1fr_auto] lg:divide-x">
        <div className="px-4 py-3 text-center lg:px-6">
          <CrestPair
            opponent={result.opponent}
            kcvvHome={result.kcvvHome}
            middle={
              <Score outcome={o} className="text-mono-md">
                {scoreboardScore(result)}
              </Score>
            }
          />
          <p className="text-ink-muted text-mono-sm mt-2 mb-0 font-mono">
            {result.date} · KCVV Elewijt – {result.opponent.name}
          </p>
        </div>

        <div className="border-ink/15 border-t px-4 py-3 text-center lg:border-t-0 lg:px-6">
          <CrestPair
            opponent={fixture.opponent}
            kcvvHome={fixture.kcvvHome}
            middle={
              <span className="text-ink-muted font-display text-mono-md leading-none italic">
                vs.
              </span>
            }
          />
          <p className="text-ink-muted text-mono-sm mt-2 mb-0 font-mono">
            {fixture.date} · {fixture.time} · KCVV Elewijt –{" "}
            {fixture.opponent.name}
          </p>
        </div>

        <div className="border-ink/15 flex items-center justify-center border-t px-4 py-3 lg:border-t-0 lg:px-6">
          <DetailsCta />
        </div>
      </div>
    </aside>
  );
}

export const VARIANTS = {
  A: { name: NAME_A, Component: VariantA },
  B: { name: NAME_B, Component: VariantB },
  C: { name: NAME_C, Component: VariantC },
  D: { name: NAME_D, Component: VariantD },
  D1: { name: NAME_D1, Component: VariantD1 },
  D2: { name: NAME_D2, Component: VariantD2 },
  D3: { name: NAME_D3, Component: VariantD3 },
  E: { name: NAME_E, Component: VariantE },
} as const;

export type VariantKey = keyof typeof VARIANTS;

/** Today's shipped layout, for reference above the variants. */
export function VariantToday({ data }: { data: ProtoCase }) {
  const { fixture } = data;
  const left = fixture.kcvvHome ? KCVV : fixture.opponent;
  const right = fixture.kcvvHome ? fixture.opponent : KCVV;
  return (
    <aside
      aria-label="Volgende wedstrijd"
      className={cn(SHELL, "grid lg:grid-cols-[auto_1fr_auto]")}
    >
      <div className="flex min-w-0 items-center justify-center gap-3 px-4 py-3 lg:justify-start lg:px-6">
        <Crest team={left} />
        <span className="font-display text-ink text-mono-md max-w-[40%] min-w-0 truncate leading-none font-bold italic">
          {left.name === KCVV.name ? "KCVV" : left.name}
        </span>
        <span className="font-display text-ink/50 text-mono-md leading-none italic">
          vs.
        </span>
        <span className="font-display text-ink text-mono-md max-w-[40%] min-w-0 truncate leading-none font-bold italic">
          {right.name === KCVV.name ? "KCVV" : right.name}
        </span>
        <Crest team={right} />
      </div>
      <div className="border-ink/15 flex items-center justify-center border-t px-4 py-2 lg:border-0">
        <span className="text-ink text-mono-sm font-mono font-semibold">
          {fixture.date} · {fixture.time}
        </span>
      </div>
      <div className="border-ink/15 flex items-center justify-center border-t px-4 py-3 lg:justify-end lg:border-0 lg:px-6">
        <DetailsCta />
      </div>
    </aside>
  );
}
