/** PROTOTYPE — throwaway, issue #2408. Delete before the PR. */

import Link from "next/link";
import {
  EditorialHeading,
  MonoLabel,
  PageContainer,
  PRESS_DOWN_CLASSES,
  StripedSeam,
} from "@/components/design-system";
import type { Rank } from "./_band";

export interface Variant {
  name: string;
  /** What this variant claims, in one line — shown above the spine. */
  claim: string;
  /** Band ids, top to bottom. Every variant renders all ten. */
  order: string[];
  rank: Record<string, Rank>;
  /**
   * Which band gets the jersey-deep full bleed. At most one — a second colour
   * field cancels the first. `null` means the spine is one uninterrupted sheet.
   */
  field: string | null;
  /** Variant E only: the persona switchboard replaces the ranking question. */
  switchboard?: boolean;
}

const TAIL: Record<string, Rank> = {
  event: 3,
  banner: 3,
  sponsors: 3,
  clubshop: 3,
};

export const VARIANTS: Record<string, Variant> = {
  A: {
    name: "Jeugd draagt de pagina",
    claim:
      "De jeugdband houdt de enige kleuronderbreking én de zwaarste kop, en schuift omhoog naar plek 4. Werving is een expliciet succescriterium; dit is de enige variant die daarnaar handelt.",
    order: [
      "hero",
      "uitgelicht",
      "firstteams",
      "youth",
      "news",
      "matches",
      "event",
      "banner",
      "sponsors",
      "clubshop",
    ],
    rank: {
      youth: 1,
      hero: 2,
      firstteams: 2,
      news: 2,
      matches: 2,
      uitgelicht: 3,
      ...TAIL,
    },
    field: "youth",
  },

  B: {
    name: "Wedstrijdruggengraat draagt de pagina",
    claim:
      "Uitslag en kalender staan bovenaan, boven de hero, en krijgen het kleurveld. De jeugdband wordt teruggeschroefd naar crème — de test is of hij dat overleeft.",
    order: [
      "firstteams",
      "matches",
      "hero",
      "news",
      "uitgelicht",
      "youth",
      "event",
      "banner",
      "sponsors",
      "clubshop",
    ],
    rank: {
      firstteams: 1,
      matches: 1,
      hero: 2,
      news: 2,
      youth: 2,
      uitgelicht: 3,
      ...TAIL,
    },
    field: "firstteams",
  },

  C: {
    name: "Redactie draagt de pagina",
    claim:
      "Hero en nieuwsraster op vol gewicht. Let op: het kleurveld blijft op de jeugdband, die rang 2 is. Dit is de pagina van vandaag — de kop zegt redactie, de kleur zegt jeugd. Als deze variant onrustig aanvoelt, is dat het bewijs.",
    order: [
      "hero",
      "news",
      "uitgelicht",
      "firstteams",
      "matches",
      "youth",
      "event",
      "banner",
      "sponsors",
      "clubshop",
    ],
    rank: {
      hero: 1,
      news: 1,
      uitgelicht: 2,
      firstteams: 2,
      matches: 2,
      youth: 2,
      ...TAIL,
    },
    field: "youth",
  },

  D: {
    name: "Zoals nu — de basislijn",
    claim:
      "Geen voorstel: dit is de pagina van vandaag. Huidige volgorde, alle tien de banden op één gewicht, kleurveld op de jeugdband. Niets rangschikt iets. Dit is waartegen A, B, C en E het moeten winnen — zonder deze variant vergelijk je ze met je herinnering aan de echte pagina, en die staat vol echte inhoud.",
    order: [
      "hero",
      "uitgelicht",
      "firstteams",
      "event",
      "banner",
      "news",
      "matches",
      "youth",
      "sponsors",
      "clubshop",
    ],
    // Every band at rank 2 — including the commercial tail. That flatness is
    // the finding, not an oversight: the critique's "nothing outranks
    // anything" rendered literally.
    rank: {
      hero: 2,
      uitgelicht: 2,
      firstteams: 2,
      event: 2,
      banner: 2,
      news: 2,
      matches: 2,
      youth: 2,
      sponsors: 2,
      clubshop: 2,
    },
    field: "youth",
  },

  E: {
    name: "Wisselbord — rangschikken binnen een tak",
    claim:
      "Het eerste scherm concurreert niet, het stuurt door: vier ingangen, één per persona. De rangschikking gebeurt daarna binnen een tak. Risico om te beoordelen: leest dit als portaalpagina in plaats van als fanzine?",
    order: [
      "hero",
      "firstteams",
      "matches",
      "news",
      "youth",
      "uitgelicht",
      "event",
      "banner",
      "sponsors",
      "clubshop",
    ],
    rank: {
      hero: 2,
      firstteams: 2,
      matches: 2,
      news: 2,
      youth: 2,
      uitgelicht: 2,
      ...TAIL,
    },
    field: null,
    switchboard: true,
  },
};

export type VariantKey = keyof typeof VARIANTS;

const ROUTES = [
  {
    label: "Ik volg de eerste ploeg",
    sub: "Uitslagen, kalender, klassement",
    href: "#firstteams",
  },
  {
    label: "Mijn kind speelt hier",
    sub: "Wedstrijden per ploeg, terrein en uur",
    href: "#matches",
  },
  {
    label: "Ik wil komen voetballen",
    sub: "Jeugdwerking en inschrijven",
    href: "#youth",
  },
  {
    label: "Ik wil de club steunen",
    sub: "Sponsor worden of vrijwilligen",
    href: "#sponsors",
  },
];

/** Variant E's first screen. Four entry points — exactly the working-memory cap. */
export function Switchboard() {
  return (
    <section className="bg-jersey-deep text-cream">
      <div className="mb-6">
        <StripedSeam height="xl" colorPair="cream-jersey-deep" />
      </div>

      <PageContainer width="index" className="py-12 md:py-20">
        <div className="mb-3">
          <MonoLabel size="md" tone="cream">
            KCVV Elewijt · sinds 1909
          </MonoLabel>
        </div>

        <EditorialHeading
          level={2}
          size="display-lg"
          tone="cream"
          className="mb-8 max-w-3xl"
        >
          Waarvoor kom je?
        </EditorialHeading>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {ROUTES.map((r) => (
            <Link
              key={r.href}
              href={r.href}
              className={`border-cream bg-cream text-ink block border-2 p-5 shadow-[6px_6px_0_0_rgba(0,0,0,0.35)] ${PRESS_DOWN_CLASSES}`}
            >
              <span className="font-display block text-xl font-bold">
                {r.label}
              </span>
              <span className="text-ink-muted mt-1 block text-sm">{r.sub}</span>
            </Link>
          ))}
        </div>
      </PageContainer>
    </section>
  );
}
