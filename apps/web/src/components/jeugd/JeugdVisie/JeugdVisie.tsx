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
 * Folded into `<PullQuote>` (#2566, decision #2515 rule 4): a mono section
 * kicker above a `placement="section"` card (its own heading + the seam
 * above it → ink tone, per rule 5) carrying the visie statement and a mono
 * tag row in the `labels` slot — a nameless quote with context labels
 * instead of a person attribution.
 */
export function JeugdVisie() {
  return (
    <section id="visie" className="scroll-mt-24">
      <SectionKicker className="mb-4">Onze jeugdvisie</SectionKicker>

      <PullQuote placement="section" labels={VISIE_TAGS}>
        Bij KCVV Elewijt staat plezier op één. Wie graag speelt, leert vanzelf —
        techniek, teamspirit en respect groeien mee.
      </PullQuote>
    </section>
  );
}
