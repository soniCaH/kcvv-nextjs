import { PullQuote, SectionKicker } from "@/components/design-system";

const VISIE_TAGS = [
  { label: "de jeugdvisie" },
  { label: "plezier" },
  { label: "techniek" },
  { label: "teamspirit" },
];

/**
 * <JeugdVisie> — the `/jeugd` filosofie/visie block (Phase 7 / Phase 2, design
 * contract 7j0b + 7j-final-page). Carries the `#visie` anchor — the repointed
 * "jeugdvisie" nav card (Phase 3) lands here.
 *
 * Folded into `<PullQuote>` (#2566, decision #2515 rule 4): the visie
 * statement and a mono tag row (the `labels` slot — a nameless quote with
 * context labels instead of a person attribution) inside one card.
 *
 * Explicit, deliberate exception to `<PullQuote>`'s `section` test (see
 * `PullQuotePlacement`'s doc): this card fails it (a mono kicker, not a
 * heading; no seam framing both sides) AND section/ink would land it right
 * under `<PageHero tone="dark">` + the seam that just closed the dark
 * band — so it stays at the default flow placement (cream) on purpose.
 */
export function JeugdVisie() {
  return (
    <section id="visie" className="scroll-mt-24">
      <SectionKicker className="mb-4">Onze jeugdvisie</SectionKicker>

      <PullQuote labels={VISIE_TAGS}>
        Bij KCVV Elewijt staat plezier op één. Wie graag speelt, leert vanzelf —
        techniek, teamspirit en respect groeien mee.
      </PullQuote>
    </section>
  );
}
