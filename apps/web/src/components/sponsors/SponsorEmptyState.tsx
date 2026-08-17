/**
 * SponsorEmptyState — the `/sponsors` 0-sponsors-total body (7.d4 §4).
 *
 * A thin call to the tier-"surface" `<EmptyState>` (#2427 / #2562) — the
 * message that sits between the headline-only hero and the
 * `<SponsorCtaBand>` when there are no sponsors yet. The "Word sponsor"
 * action lives in the band below, so this block passes no `actions`.
 */

import { EmptyState } from "@/components/design-system/EmptyState";

export interface SponsorEmptyStateProps {
  /** Additional CSS classes */
  className?: string;
}

export const SponsorEmptyState = ({ className }: SponsorEmptyStateProps) => {
  return (
    <EmptyState
      tier="surface"
      heading="Nog geen sponsors"
      className={className}
    >
      We zoeken partners die mee de plezantste compagnie willen dragen — jouw
      zaak kan de eerste langs de lijn zijn.
    </EmptyState>
  );
};
