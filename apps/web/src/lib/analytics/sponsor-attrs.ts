import type { SponsorTier } from "@/hooks/useSponsorAnalytics";

export interface SponsorAttrs {
  sponsorId: string;
  tier?: SponsorTier;
}

/**
 * Read the inert markers `<SponsorTile>` / `<HoofdSponsorTile>` emit off a
 * delegated click target, or `null` when the element carries no sponsor id.
 *
 * Two surfaces delegate on those tiles — `<SponsorsAnalytics>` for `/sponsors`
 * and `<HomepageAnalytics>` for the homepage block (#2400) — so the attribute
 * names and the empty-string coercion live here rather than in both.
 */
export function readSponsorAttrs(el: HTMLElement): SponsorAttrs | null {
  const sponsorId = el.getAttribute("data-sponsor-id");
  if (!sponsorId) return null;
  return {
    sponsorId,
    tier: (el.getAttribute("data-sponsor-tier") || undefined) as
      | SponsorTier
      | undefined,
  };
}
