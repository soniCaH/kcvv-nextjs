/** PROTOTYPE — throwaway, issue #2408. Delete before the PR. */

/**
 * The homepage spine at low fidelity. Ten bands, not the twelve the critique
 * counted: `bannerSlotA/B/C` are never filled together, so at most one banner
 * band appears (#2402).
 *
 * Content is placeholder on purpose — the question is ranking, so every variant
 * renders the *same* content and differs only in what outranks what. Real type
 * ramp, real colour, fake copy.
 */

export type BandKind = "hero" | "cards" | "ledger" | "logos" | "cta" | "banner";

export interface Band {
  id: string;
  /** MonoLabel kicker, as the real section renders it. */
  kicker: string;
  /** EditorialHeading text. */
  heading: string;
  blurb?: string;
  kind: BandKind;
  /** Card / row / logo count — density is half of what makes a band read heavy. */
  count?: number;
  /** Who this band is for. Shown in the rank overlay, not in the design. */
  persona: "volger" | "ouder" | "nieuw" | "club" | "iedereen";
}

export const BANDS: Band[] = [
  {
    id: "hero",
    kicker: "Uitgelicht",
    heading: "Ravijn tussen de lijnen: KCVV pakt drie punten in de slotfase.",
    kind: "hero",
    persona: "volger",
  },
  {
    id: "uitgelicht",
    kicker: "Uitgelicht",
    heading: "Uitgelicht.",
    blurb: "Drie verhalen die de redactie naar voren schuift.",
    kind: "cards",
    count: 3,
    persona: "iedereen",
  },
  {
    id: "firstteams",
    kicker: "Eerste elftallen",
    heading: "A-ploeg & B-ploeg.",
    blurb: "De laatste uitslag en de eerstvolgende wedstrijd.",
    kind: "ledger",
    count: 2,
    persona: "volger",
  },
  {
    id: "event",
    kicker: "Evenement",
    heading: "Mosselfestijn — zaterdag 20 september.",
    kind: "banner",
    persona: "club",
  },
  {
    id: "banner",
    kicker: "",
    heading: "Voetbal is voor iedereen.",
    blurb: "De anti-racisme-campagne — redactionele slot, geen advertentie.",
    kind: "banner",
    persona: "iedereen",
  },
  {
    id: "news",
    kicker: "Laatste nieuws",
    heading: "Laatste nieuws.",
    kind: "cards",
    count: 6,
    persona: "iedereen",
  },
  {
    id: "matches",
    kicker: "Dit weekend",
    heading: "Komende wedstrijden.",
    blurb: "Alle ploegen, van U6 tot de A-ploeg.",
    kind: "ledger",
    count: 5,
    persona: "ouder",
  },
  {
    id: "youth",
    kicker: "Word jeugdspeler",
    heading: "De toekomst van Elewijt.",
    blurb:
      "Onze jeugdwerking groeit elk jaar. Bovenbouw, Middenbouw en Onderbouw delen één doel.",
    kind: "cta",
    persona: "nieuw",
  },
  {
    id: "sponsors",
    kicker: "Onze partners",
    heading: "Zij maken het mogelijk.",
    kind: "logos",
    count: 12,
    persona: "club",
  },
  {
    id: "clubshop",
    kicker: "Clubshop",
    heading: "Draag de kleuren.",
    kind: "cta",
    persona: "club",
  },
];

export const BAND_BY_ID = Object.fromEntries(
  BANDS.map((b) => [b.id, b]),
) as Record<string, Band>;
