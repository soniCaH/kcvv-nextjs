/**
 * PROTOTYPE — throwaway, issue #2396. Delete before the PR.
 *
 * Four type-ramp policies, rendered over identical specimens. Only the label
 * size and the leading change — that is the question, so everything else is
 * held constant.
 */

export type VariantKey = "A" | "B" | "C" | "D";

export interface Treatment {
  name: string;
  note: string;
  /** label sitting directly above body text — the case that must recede */
  attached: string;
  /** standalone kicker with nothing under it */
  standalone: string;
  /** leading for body copy: "" means inherit body 1.75, as ships today */
  bodyLeading: string;
}

const TRACK = "tracking-[var(--text-label--tracking)]";

export const VARIANTS: Record<VariantKey, Treatment> = {
  A: {
    name: "Vandaag",
    note: "Wat er nu draait: 10px labels boven tekst, 11px los. De tokens leveren alleen font-size, dus de body erft line-height 1.75 van <body> in plaats van de 1.6 die het token zegt.",
    attached: `text-[10px] ${TRACK}`,
    standalone: `text-[11px] ${TRACK}`,
    bodyLeading: "",
  },
  B: {
    name: "Alles naar de 11px-vloer",
    note: "De collapse uit ronde 1 — elk label op --text-label (11px), geen sub-vloer. Dit is de variant die je in de uitsnede afwees: kijk of dat in echte context standhoudt.",
    attached: `text-[length:var(--text-label)] ${TRACK}`,
    standalone: `text-[length:var(--text-label)] ${TRACK}`,
    bodyLeading: "",
  },
  C: {
    name: "Alleen leading hersteld",
    note: "Zelfde maten als vandaag, maar de tokens dragen hun eigen line-height en tracking. Isoleert Q1 van Q3 — als dit al goed genoeg is, hoeft er aan de maten niets te veranderen.",
    attached: `text-[10px] ${TRACK} leading-none`,
    standalone: `text-[11px] ${TRACK} leading-none`,
    bodyLeading: "leading-[1.6]",
  },
  D: {
    name: "Twee labelstappen + hersteld",
    note: "Het voorstel: label 11px als het los staat, label-sm 10px als het boven tekst hangt en moet wegvallen. Plus de herstelde leading. De 9px en de halve pixels verdwijnen.",
    attached: `text-[10px] ${TRACK} leading-none`,
    standalone: `text-[length:var(--text-label)] ${TRACK} leading-none`,
    bodyLeading: "leading-[1.6]",
  },
};

const LABEL_BASE = "block font-mono uppercase";

/** Label + value, the pairing from the screenshot. */
function Pair({
  t,
  label,
  value,
  bodyClass,
  bodyPx,
  onGreen = false,
}: {
  t: Treatment;
  label: string;
  value: React.ReactNode;
  bodyClass: string;
  bodyPx: string;
  onGreen?: boolean;
}) {
  return (
    <div>
      <span
        className={`${LABEL_BASE} ${t.attached} mb-1.5 ${
          onGreen ? "text-cream/85" : "text-ink-muted"
        }`}
      >
        {label}
      </span>
      <p className={`m-0 ${bodyClass} ${t.bodyLeading}`}>{value}</p>
      <span
        className={`mt-2 block font-mono text-[9px] ${
          onGreen ? "text-cream/50" : "text-ink-muted/60"
        }`}
      >
        {bodyPx}
      </span>
    </div>
  );
}

export function Specimens({ t }: { t: Treatment }) {
  return (
    <div className="space-y-12">
      {/* 1 — the case you flagged */}
      <section>
        <h2 className="border-ink m-0 mb-5 border-b-2 pb-2 font-mono text-[11px] tracking-[0.12em] uppercase">
          1 · Label boven een waarde
        </h2>
        <div className="grid gap-8 sm:grid-cols-2">
          <Pair
            t={t}
            label="Beker van Vlaanderen"
            value={
              <>
                Uitslag <b className="font-semibold">3 – 1</b>
              </>
            }
            bodyClass="text-[length:var(--text-body-md)]"
            bodyPx="body-md · 16px"
          />
          <Pair
            t={t}
            label="Zondag 15u00"
            value={
              <>
                KCVV Elewijt — <b className="font-semibold">SK Londerzeel</b>
              </>
            }
            bodyClass="text-[length:var(--text-body-sm)]"
            bodyPx="body-sm · 14px"
          />
        </div>

        <div className="bg-jersey-deep text-cream mt-8 grid gap-8 p-6 sm:grid-cols-2">
          <Pair
            t={t}
            onGreen
            label="Jeugd · U15"
            value="Training verplaatst naar dinsdag"
            bodyClass="text-[length:var(--text-body-md)]"
            bodyPx="body-md · 16px"
          />
          <Pair
            t={t}
            onGreen
            label="Kantine"
            value="Open vanaf 13u30"
            bodyClass="text-[length:var(--text-body-sm)]"
            bodyPx="body-sm · 14px"
          />
        </div>
      </section>

      {/* 2 — standalone, where 11px is uncontested */}
      <section>
        <h2 className="border-ink m-0 mb-5 border-b-2 pb-2 font-mono text-[11px] tracking-[0.12em] uppercase">
          2 · Los label, niets eronder
        </h2>
        <span className={`${LABEL_BASE} ${t.standalone} text-jersey-deep mb-3`}>
          Wedstrijdkalender
        </span>
        <p className="text-ink-muted m-0 max-w-[52ch] font-mono text-[10px]">
          Een sectiekop of kicker heeft geen tekst waar hij tegen moet
          wegvallen. Hier is 11px onbetwist — de vraag geldt alleen voor labels
          die aan tekst vastzitten.
        </p>
      </section>

      {/* 3 — the leading question, isolated */}
      <section>
        <h2 className="border-ink m-0 mb-5 border-b-2 pb-2 font-mono text-[11px] tracking-[0.12em] uppercase">
          3 · Bodytekst — de leading
        </h2>
        <p
          className={`m-0 max-w-[62ch] text-[length:var(--text-body-md)] ${t.bodyLeading}`}
        >
          De ploeg speelt zondag om 15u00 op eigen veld. De kantine is open
          vanaf 13u30 en de jeugdwerking verzamelt een half uur voor aanvang aan
          de kleedkamers. Wie mee wil rijden naar de uitwedstrijd van volgende
          week laat dat weten aan de ploegafgevaardigde.
        </p>
        <p className="text-ink-muted m-0 mt-3 font-mono text-[10px]">
          {t.bodyLeading === ""
            ? "1.75 — geërfd van <body>, want het token levert alleen font-size"
            : "1.6 — wat --text-body-md--lh altijd al zei"}
        </p>
      </section>
    </div>
  );
}
