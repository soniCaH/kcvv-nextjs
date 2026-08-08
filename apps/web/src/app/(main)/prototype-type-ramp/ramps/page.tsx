/**
 * PROTOTYPE — throwaway route, issue #2396. Delete before the PR.
 *
 * Question (Q6): the app ships two token ramps plus Tailwind's factory scale.
 * Which one survives?
 *
 * The options are mostly bookkeeping, so most of them render identically —
 * that is itself the answer, and the page says so instead of pretending three
 * pages look different. The one place a real pixel moves is the headings, so
 * that is what this shows.
 *
 * Headings are fluid in one ramp and fixed-with-a-breakpoint-jump in the other,
 * so the difference only exists across viewport widths. Rather than iframe the
 * whole site chrome three times, each heading is rendered at the size it
 * actually computes to at 390px, 768px and 1280px.
 *
 * `?variant=A|B|C`.
 */

import { notFound } from "next/navigation";
import { PageContainer } from "@/components/design-system";
import { PrototypeSwitcher } from "../_switcher";

export const dynamic = "force-dynamic";

const KEYS = ["A", "B", "C"] as const;
type Key = (typeof KEYS)[number];

function isKey(v: string): v is Key {
  return (KEYS as readonly string[]).includes(v);
}

const WIDTHS = ["390px", "768px", "1280px"] as const;

interface Step {
  /** what a component writes */
  name: string;
  /** rendered px at 390 / 768 / 1280 */
  px: [number, number, number];
  sample: string;
}

interface Option {
  name: string;
  what: string;
  heads: Step[];
  /** does the h2 / text-2xl collision survive? */
  collision: boolean;
  bodyNote: string;
}

/**
 * Today: --font-size-* fixed values with one jump at the 768px breakpoint.
 * Merged: --text-display-* clamps, evaluated at each width.
 */
const OPTIONS: Record<Key, Option> = {
  A: {
    name: "Vandaag — twee ramps naast elkaar",
    what: "Koppen komen uit --font-size-*: vaste maten die op 768px in één keer verspringen. Daarnaast bestaat --text-* met eigen, vloeiende display-stappen die de koppen niet gebruiken. En text-2xl komt uit Tailwinds fabrieksschaal, die niemand hier gekozen heeft.",
    heads: [
      {
        name: "h1",
        px: [28, 48, 48],
        sample: "Er is maar één plezante compagnie",
      },
      { name: "h2", px: [22, 32, 32], sample: "Wedstrijdkalender" },
      { name: "h3", px: [20, 24, 24], sample: "Jeugdwerking" },
    ],
    collision: true,
    bodyNote:
      "Bodytekst: 12 / 14 / 16 / 18px — precies dezelfde vier maten als in de andere opties.",
  },
  B: {
    name: "Eén ramp — --text-* wint",
    what: "--font-size-* verdwijnt; koppen gaan naar de display-stappen van --text-*, die vloeiend meeschalen in plaats van te verspringen. De namen text-xs/sm/base/lg/xl/2xl worden overschreven zodat ze naar jouw waarden wijzen — de 154 bestaande gebruiken hoeven niet aangeraakt te worden en de naambotsing verdwijnt.",
    heads: [
      {
        name: "h1 · display-lg",
        px: [32, 43, 48],
        sample: "Er is maar één plezante compagnie",
      },
      {
        name: "h2 · display-md",
        px: [24, 27.5, 32],
        sample: "Wedstrijdkalender",
      },
      { name: "h3 · display-sm", px: [20, 23.7, 24], sample: "Jeugdwerking" },
    ],
    collision: false,
    bodyNote:
      "Bodytekst: onveranderd. text-xs/sm/base/lg wijzen al naar 12 / 14 / 16 / 18 — exact dezelfde maten. Onder de 20px beweegt er niets.",
  },
  C: {
    name: "Twee ramps blijven, grens gedocumenteerd",
    what: "Niets verandert aan de code: --font-size-* houdt de basiselementen, --text-* houdt de componenten, en er komt een regel in DESIGN.md die zegt welke waar hoort. Dit rendert exact hetzelfde als vandaag — dat is de hele kost én de hele opbrengst.",
    heads: [
      {
        name: "h1",
        px: [28, 48, 48],
        sample: "Er is maar één plezante compagnie",
      },
      { name: "h2", px: [22, 32, 32], sample: "Wedstrijdkalender" },
      { name: "h3", px: [20, 24, 24], sample: "Jeugdwerking" },
    ],
    collision: true,
    bodyNote:
      "Bodytekst: identiek aan vandaag. Geen enkele pixel beweegt; alleen de documentatie groeit.",
  },
};

function StepRow({ step }: { step: Step }) {
  return (
    <div className="border-paper-edge border-b border-dashed py-4 last:border-b-0">
      <p className="text-ink-muted m-0 mb-3 font-mono text-[10px] tracking-[0.08em] uppercase">
        {step.name}
      </p>
      <div className="grid gap-4 sm:grid-cols-3">
        {step.px.map((px, i) => (
          <div key={WIDTHS[i]} className="min-w-0">
            <p className="text-ink-muted/70 m-0 mb-1.5 font-mono text-[10px]">
              {WIDTHS[i]} → {px}px
            </p>
            <p
              className="font-display m-0 truncate leading-[1.1] font-bold"
              style={{ fontSize: `${px}px` }}
            >
              {step.sample}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function PrototypeRampsPage({
  searchParams,
}: {
  searchParams: Promise<{ variant?: string }>;
}) {
  if (process.env.NODE_ENV === "production") notFound();

  const sp = await searchParams;
  const key: Key = sp.variant && isKey(sp.variant) ? sp.variant : "A";
  const o = OPTIONS[key]!;

  return (
    <>
      <div className="border-alert border-b-2 bg-[#fdf2ef] px-4 py-2 text-center font-mono text-[11px] tracking-[0.08em] uppercase">
        Prototype · issue #2396 · vraag 6 · welke ramp blijft over?
      </div>

      <PageContainer width="default" className="pt-6 pb-32">
        <p className="text-ink-muted m-0 font-mono text-[11px] tracking-[0.08em] uppercase">
          Optie {key}
        </p>
        <h1 className="mt-2 mb-4 text-[length:var(--text-display-md)] leading-[1.15]">
          {o.name}
        </h1>
        <p className="border-ink bg-cream-soft m-0 mb-10 max-w-[62ch] border-2 p-3 text-[length:var(--text-body-sm)] leading-[1.55]">
          {o.what}
        </p>

        <section>
          <h2 className="border-ink m-0 mb-2 border-b-2 pb-2 font-mono text-[11px] tracking-[0.12em] uppercase">
            1 · Koppen, op drie echte schermbreedtes
          </h2>
          <p className="text-ink-muted mt-3 mb-4 max-w-[62ch] font-mono text-[10px] leading-[1.5]">
            Elke kop staat hier op de maat die hij op die breedte écht krijgt.
            Vandaag springt h1 van 28px naar 48px op het moment dat het scherm
            768px passeert — daartussen zit niets. Een vloeiende stap groeit
            mee.
          </p>
          {o.heads.map((s) => (
            <StepRow key={s.name} step={s} />
          ))}
        </section>

        <section className="mt-12">
          <h2 className="border-ink m-0 mb-4 border-b-2 pb-2 font-mono text-[11px] tracking-[0.12em] uppercase">
            2 · De naamval: h2 naast text-2xl
          </h2>
          {o.collision ? (
            <>
              <div className="border-alert border-2 p-5">
                <p className="text-ink-muted m-0 mb-1 font-mono text-[10px]">
                  &lt;h2&gt; — 22px
                </p>
                <p
                  className="font-display m-0 leading-[1.2] font-bold"
                  style={{ fontSize: "22px" }}
                >
                  Wedstrijdkalender
                </p>
                <p className="text-ink-muted m-0 mt-4 mb-1 font-mono text-[10px]">
                  className=&quot;text-2xl&quot; — 24px
                </p>
                <p
                  className="font-display m-0 leading-[1.2] font-bold"
                  style={{ fontSize: "24px" }}
                >
                  Wedstrijdkalender
                </p>
              </div>
              <p className="text-ink-muted m-0 mt-3 max-w-[62ch] font-mono text-[10px] leading-[1.5]">
                Dezelfde naam, twee maten. Wie een kop wil die matcht met h2 en
                text-2xl schrijft, zit er 2px naast — en ziet dat pas naast
                elkaar. Zes van de tien gedeelde namen doen dit.
              </p>
            </>
          ) : (
            <>
              <div className="border-jersey-deep border-2 p-5">
                <p className="text-ink-muted m-0 mb-1 font-mono text-[10px]">
                  &lt;h2&gt; en className=&quot;text-2xl&quot; — beide 24px
                </p>
                <p
                  className="font-display m-0 leading-[1.2] font-bold"
                  style={{ fontSize: "24px" }}
                >
                  Wedstrijdkalender
                </p>
              </div>
              <p className="text-ink-muted m-0 mt-3 max-w-[62ch] font-mono text-[10px] leading-[1.5]">
                Eén naam, één maat. Dit is wat het overschrijven van de
                fabrieksnamen oplevert — zonder dat er ook maar één van de 154
                bestaande gebruiken aangeraakt wordt.
              </p>
            </>
          )}
        </section>

        <section className="mt-12">
          <h2 className="border-ink m-0 mb-4 border-b-2 pb-2 font-mono text-[11px] tracking-[0.12em] uppercase">
            3 · Bodytekst
          </h2>
          <p className="m-0 max-w-[62ch] text-[length:var(--text-body-md)] leading-[1.6]">
            {o.bodyNote}
          </p>
        </section>
      </PageContainer>

      <PrototypeSwitcher variants={[...KEYS]} current={key} label={o.name} />
    </>
  );
}
