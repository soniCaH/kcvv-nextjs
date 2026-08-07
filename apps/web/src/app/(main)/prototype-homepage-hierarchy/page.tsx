/**
 * PROTOTYPE — throwaway route, issue #2408. Delete before the PR.
 *
 * Question: which homepage band carries the page, and how is "everything else
 * is subordinate" expressed — when the club has two co-equal personas and will
 * not declare a winner (#2406)?
 *
 * Five variants on one route, switchable via `?variant=A|B|C|D|E`, plus
 * `?overlay=1` to label every band with its rank and its persona.
 *
 * Every variant renders the SAME ten bands with the SAME placeholder content.
 * They differ only in order, in the three-step weight ladder, and in which band
 * (if any) gets the jersey-deep full bleed. That is the question — holding
 * content constant is what makes them comparable.
 *
 * Judge at 390px first. The critique's P1 framing is that the phone is the
 * primary device and loses; desktop is the check, not the brief.
 *
 * Mounted under (main) rather than (landing) so the real header and footer are
 * around it without the real homepage spine competing underneath.
 */

import { notFound } from "next/navigation";
import { PageContainer } from "@/components/design-system";
import { BandBlock } from "./_band";
import { BAND_BY_ID } from "./_bands";
import { PrototypeSwitcher } from "./_switcher";
import { VARIANTS, Switchboard, type VariantKey } from "./_variants";

export const dynamic = "force-dynamic";

const KEYS = ["A", "B", "C", "D", "E"] as const;

function isVariantKey(v: string): v is VariantKey {
  return (KEYS as readonly string[]).includes(v);
}

export default async function PrototypeHomepageHierarchyPage({
  searchParams,
}: {
  searchParams: Promise<{ variant?: string; overlay?: string }>;
}) {
  if (process.env.NODE_ENV === "production") notFound();

  const sp = await searchParams;
  const key: VariantKey =
    sp.variant && isVariantKey(sp.variant) ? sp.variant : "A";
  const overlay = sp.overlay === "1";
  const variant = VARIANTS[key]!;

  return (
    <>
      <div className="border-alert border-b-2 bg-[#fdf2ef] px-4 py-2 text-center font-mono text-[11px] tracking-[0.08em] uppercase">
        Prototype · issue #2408 · niet voor productie
      </div>

      <PageContainer width="index" className="pt-6 pb-2">
        <p className="text-ink-muted m-0 font-mono text-[11px] tracking-[0.08em] uppercase">
          Variant {key} — {variant.name}
        </p>
        <p className="text-body-sm text-ink max-w-[var(--container-prose)] pt-2">
          {variant.claim}
        </p>
      </PageContainer>

      {variant.switchboard ? <Switchboard /> : null}

      {variant.order.map((id) => {
        const band = BAND_BY_ID[id];
        if (!band) return null;
        return (
          <div key={id} id={id}>
            <BandBlock
              band={band}
              rank={variant.rank[id] ?? 3}
              onField={variant.field === id}
              showOverlay={overlay}
            />
          </div>
        );
      })}

      <PageContainer width="index" className="py-10">
        <p className="text-body-sm text-ink-muted max-w-[var(--container-prose)]">
          Wissel van variant met ← / → of de balk onderaan. Zet{" "}
          <strong className="text-ink">rangen</strong> aan om per band de rang
          en de persona te zien.
        </p>
        <p className="text-body-sm text-ink-muted max-w-[var(--container-prose)]">
          Tien banden, geen twaalf — de drie bannerslots worden nooit samen
          gevuld, dus er verschijnt er hoogstens één. Inhoud is opzettelijk nep:
          de vraag gaat over rangschikking, niet over copy of beeld.
        </p>
        <p className="text-body-sm text-ink-muted max-w-[var(--container-prose)]">
          De interessante uitkomst is meestal &ldquo;de kop van B met de
          volgorde van A&rdquo;. Dat is het ontwerp dat je wil.
        </p>
      </PageContainer>

      <div className="h-32" />

      <PrototypeSwitcher
        variants={[...KEYS]}
        current={key}
        label={variant.name}
        overlay={overlay}
      />
    </>
  );
}
