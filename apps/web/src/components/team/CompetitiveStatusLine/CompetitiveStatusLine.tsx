import { EmptyState } from "@/components/design-system/EmptyState";

/**
 * The `not-in-competition` state (#2540/#2636 decision) — the competitive
 * half of a team page (`#klassement` + `#wedstrijden`) collapses to a single
 * line rather than two sections that would otherwise render empty.
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
export function CompetitiveStatusLine() {
  return (
    <EmptyState
      tier="slot"
      className="border-ink bg-cream-soft w-full flex-none py-4"
    >
      De kalender voor dit seizoen is nog niet bekendgemaakt.
    </EmptyState>
  );
}
