/**
 * PROTOTYPE — throwaway route, issue #2387. Delete before the PR.
 *
 * Question: how does the MatchStrip carry a *result* and a *next fixture*
 * without an opponent name wrapping or clipping, at 390px and 1440px?
 *
 * Four variants on one route, switchable via `?variant=A|B|C|D`, plus
 * `?case=kort|lang|extreem|gelijk` to swap the opponent-name stress case.
 * Mounted under (main) rather than (landing) on purpose: (main) omits the real
 * `<MatchStripSlot />`, so there is no second strip competing for the eye,
 * but the real header, footer and page chrome are still around it.
 */

import { notFound } from "next/navigation";
import { PageContainer } from "@/components/design-system";
import { CASES } from "./_data";
import { PrototypeSwitcher } from "./_switcher";
import { VARIANTS, VariantToday, type VariantKey } from "./_variants";

export const dynamic = "force-dynamic";

const KEYS = ["A", "B", "C", "D", "D1", "D2", "D3", "E"] as const;

function isVariantKey(v: string): v is VariantKey {
  return (KEYS as readonly string[]).includes(v);
}

export default async function PrototypeMatchStripPage({
  searchParams,
}: {
  searchParams: Promise<{ variant?: string; case?: string }>;
}) {
  if (process.env.NODE_ENV === "production") notFound();

  const sp = await searchParams;
  const variant: VariantKey =
    sp.variant && isVariantKey(sp.variant) ? sp.variant : "A";
  const caseKey = sp.case ?? "lang";
  const data = CASES.find((c) => c.key === caseKey) ?? CASES[1] ?? CASES[0]!;

  const { name, Component } = VARIANTS[variant];

  return (
    <>
      <div className="border-alert border-b-2 bg-[#fdf2ef] px-4 py-2 text-center font-mono text-[11px] tracking-[0.08em] uppercase">
        Prototype · issue #2387 · niet voor productie
      </div>

      <section className="pt-6">
        <PageContainer width="index" className="pb-3">
          <p className="text-ink-muted m-0 font-mono text-[11px] tracking-[0.08em] uppercase">
            Nu in productie — alleen de volgende wedstrijd
          </p>
        </PageContainer>
        <VariantToday data={data} />
      </section>

      <section className="pt-10">
        <PageContainer width="index" className="pb-3">
          <p className="text-ink-muted m-0 font-mono text-[11px] tracking-[0.08em] uppercase">
            Variant {variant} — {name}
          </p>
        </PageContainer>
        <Component data={data} />
      </section>

      <PageContainer width="index" className="py-10">
        <p className="text-body-sm text-ink-muted max-w-[var(--container-prose)]">
          Casus: <strong className="text-ink">{data.label}</strong>. Wissel van
          variant met ← / → of de balk onderaan. Test op 390px én 1440px — de
          drie varianten falen op verschillende breedtes, dat is het punt.
        </p>
        <p className="text-body-sm text-ink-muted max-w-[var(--container-prose)]">
          Thuis/uit gebruikt het House/Bus-glyph van <code>TeamAgendaRow</code>{" "}
          — één vocabulaire, geen derde. De score staat in echte
          scorebord-volgorde: thuisploeg eerst, niet KCVV eerst.
        </p>
      </PageContainer>

      <div className="h-32" />

      <PrototypeSwitcher
        variants={[...KEYS]}
        current={variant}
        label={name}
        cases={CASES.map((c) => ({ key: c.key, label: c.key }))}
        currentCase={data.key}
      />
    </>
  );
}
