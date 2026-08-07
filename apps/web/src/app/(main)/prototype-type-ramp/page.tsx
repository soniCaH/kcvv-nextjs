/**
 * PROTOTYPE — throwaway route, issue #2396. Delete before the PR.
 *
 * Question: how small does a label have to be to read as subordinate to the
 * text it supports — and does repairing the ramp's leading change the answer?
 *
 * Four policies on one route, switchable via `?variant=A|B|C|D`. Every variant
 * renders the SAME specimens; only the label size and the leading move. That
 * is the question, so everything else is held constant.
 *
 * Mounted under (main) with real Typekit fonts, real tokens and real chrome —
 * the standalone compare page loaded Typekit over file://, which is domain
 * locked, so it may have been showing fallback fonts.
 *
 * Judge at 390px first, outdoors if you can. DESIGN.md's usage scene is a phone
 * on the sideline, not a desk monitor.
 */

import { notFound } from "next/navigation";
import { PageContainer } from "@/components/design-system";
import { TeamAgendaRow } from "@/components/team/TeamMatchesSection/TeamAgendaRow";
import type { ScheduleMatch } from "@/components/match/types";
import { PrototypeSwitcher } from "./_switcher";
import { Specimens, VARIANTS, type VariantKey } from "./_variants";

export const dynamic = "force-dynamic";

const KEYS = ["A", "B", "C", "D"] as const;

function isVariantKey(v: string): v is VariantKey {
  return (KEYS as readonly string[]).includes(v);
}

const KCVV = { id: 1235, name: "KCVV Elewijt" };
const OPP = { id: 42, name: "SK Londerzeel" };

const REAL_ROWS: ScheduleMatch[] = [
  {
    id: 1,
    date: new Date("2026-09-13T15:00:00.000Z"),
    time: "15:00",
    homeTeam: KCVV,
    awayTeam: OPP,
    status: "finished",
    competition: "3e Provinciale A",
    isHome: true,
    homeScore: 3,
    awayScore: 1,
  },
  {
    id: 2,
    date: new Date("2026-09-20T15:00:00.000Z"),
    time: "15:00",
    homeTeam: KCVV,
    awayTeam: OPP,
    status: "scheduled",
    competition: "Beker van Vlaanderen",
    isHome: true,
  },
];

export default async function PrototypeTypeRampPage({
  searchParams,
}: {
  searchParams: Promise<{ variant?: string }>;
}) {
  if (process.env.NODE_ENV === "production") notFound();

  const sp = await searchParams;
  const key: VariantKey =
    sp.variant && isVariantKey(sp.variant) ? sp.variant : "A";
  const t = VARIANTS[key]!;

  return (
    <>
      <div className="border-alert border-b-2 bg-[#fdf2ef] px-4 py-2 text-center font-mono text-[11px] tracking-[0.08em] uppercase">
        Prototype · issue #2396 · niet voor productie
      </div>

      <PageContainer width="default" className="pt-6 pb-32">
        <p className="text-ink-muted m-0 font-mono text-[11px] tracking-[0.08em] uppercase">
          Variant {key} — {t.name}
        </p>
        <p className="border-ink bg-cream-soft mt-3 mb-10 max-w-[62ch] border-2 p-3 text-[length:var(--text-body-sm)] leading-[1.55]">
          {t.note}
        </p>

        <Specimens t={t} />

        <section className="mt-12">
          <h2 className="border-ink m-0 mb-5 border-b-2 pb-2 font-mono text-[11px] tracking-[0.12em] uppercase">
            4 · De echte component, onveranderd
          </h2>
          <p className="text-ink-muted mt-0 mb-4 max-w-[62ch] font-mono text-[10px]">
            TeamAgendaRow zoals hij vandaag draait — de gedeelde rij van de
            homepage, /ploegen/[slug] én /kalender. Verandert niet mee met de
            variant: dit is de nulmeting waartegen je de specimens leest.
          </p>
          <ul className="m-0 list-none p-0">
            {REAL_ROWS.map((m) => (
              <li key={m.id}>
                <TeamAgendaRow match={m} />
              </li>
            ))}
          </ul>
        </section>
      </PageContainer>

      <PrototypeSwitcher variants={[...KEYS]} current={key} label={t.name} />
    </>
  );
}
