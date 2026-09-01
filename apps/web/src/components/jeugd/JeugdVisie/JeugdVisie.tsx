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
 * context labels instead of a person attribution) inside one card, at the
 * default flow placement (cream).
 *
 * `<SectionKicker>` is a mono eyebrow label (a `<div>`, not a heading
 * element — see `SectionKicker.tsx`), not the "heading above it" rule 5
 * means by "the card owns its own section"; that branch's own examples
 * (`/club`'s mission quote, framed by a `<StripedSeam>` on BOTH sides;
 * `<QuotesBlock>`'s real `<EditorialHeading level={2}>`) don't apply here —
 * `/jeugd` has one seam before the card (the hero's own transition, not a
 * frame around this card) and no seam after. Section/ink would also land
 * this card immediately under `<PageHero register="band" tone="dark">` +
 * that seam, reopening the dark band it just closed. Flow is the honest
 * read of its position, and it happens to be what the page needs.
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
