import { EmptyState } from "@/components/design-system/EmptyState";

export type CompetitiveStatusLineVariant = "not-in-competition" | "unavailable";

const COPY: Record<CompetitiveStatusLineVariant, string> = {
  "not-in-competition":
    "De kalender voor dit seizoen is nog niet bekendgemaakt.",
  // A permanent PSD read failure (#2636 finding 3) — distinct wording from
  // the line above on purpose, so a genuine pre-season silence is never
  // confused with a broken read. Present tense, names the outage rather than
  // promising a fix, the same register as the pre-publication line.
  unavailable: "De wedstrijdgegevens zijn tijdelijk niet beschikbaar.",
};

export interface CompetitiveStatusLineProps {
  /** Which state this status line reports. Defaults to `"not-in-competition"`,
   * the far more common of the two. */
  variant?: CompetitiveStatusLineVariant;
}

/**
 * The `not-in-competition` and `unavailable` states (#2540/#2636 decision) —
 * the competitive half of a team page (`#klassement` + `#wedstrijden`)
 * collapses to a single line rather than two sections that would otherwise
 * render empty or, for `unavailable`, take the whole page down.
 *
 * A **dashed paper slip on soft cream** — `<EmptyState tier="slot">`'s
 * existing "held-open gap" vocabulary (already used for a lineup column or an
 * events list with nothing to show), recoloured onto `cream-soft` with the
 * `className` override rather than a new primitive.
 *
 * Deliberately **not** a `<section>`: no `<h2>`, no `id`, no sticky-nav
 * entry. This is the one place the page's nav/render invariant intentionally
 * does not apply — see the comment beside `navItems` in `page.tsx`.
 */
export function CompetitiveStatusLine({
  variant = "not-in-competition",
}: CompetitiveStatusLineProps) {
  return (
    <EmptyState
      tier="slot"
      className="border-ink bg-cream-soft w-full flex-none py-4"
    >
      {COPY[variant]}
    </EmptyState>
  );
}
