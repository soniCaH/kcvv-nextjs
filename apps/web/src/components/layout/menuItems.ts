import type { TeamNavVM } from "@/lib/repositories/team.repository";
import { RESERVEN_PSD_ID, isAgeCode } from "@/lib/utils/group-teams";

export interface MenuItem {
  label: string;
  href: string;
}

/**
 * The nav, in order. Flat — every entry is a plain link (#2409, built by
 * #2415); see `apps/web/DESIGN.md` § Navigation for why the dropdowns were
 * deleted rather than regrouped, and `nav-reachability.test.ts` for the guard
 * that keeps the deletion safe.
 *
 * `Home` is absent on purpose — the wordmark is the home link.
 *
 * Written as one literal rather than a static list spliced at an index: the
 * whole nav is decided and flat, so the order should be readable top to bottom
 * instead of reconstructed from a slice offset.
 */
export const buildMenuItems = (
  seniorItems: (MenuItem | null)[],
): MenuItem[] => [
  { label: "Nieuws", href: "/nieuws" },
  { label: "Wedstrijden", href: "/kalender" },
  { label: "Evenementen", href: "/evenementen" },
  ...seniorItems.filter((item): item is MenuItem => item !== null),
  { label: "Jeugd", href: "/jeugd" },
  { label: "Sponsors", href: "/sponsors" },
  { label: "Hulp", href: "/hulp" },
  { label: "De club", href: "/club" },
];

export const buildSeniorMenuItem = (
  team: TeamNavVM | undefined,
  label: string,
): MenuItem | null =>
  team?.slug ? { label, href: `/ploegen/${team.slug}` } : null;

const isReserven = (t: TeamNavVM): boolean => t.psdId === RESERVEN_PSD_ID;

/**
 * NAV-1: the reserves belong under Jeugd, not the senior nav. `layout.tsx`
 * splits the roster with this before handing the remainder to the senior nav
 * builder, and `nav-reachability.test.ts` imports it so the guard runs against
 * the real rule rather than a copy of it.
 */
export const isUnderJeugd = (t: TeamNavVM): boolean =>
  isAgeCode(t.age ?? undefined) || isReserven(t);

/**
 * True when `pathname` is `href` or sits under it. Compared segment-wise, so
 * `/club` matches `/club/bestuur` but never `/clubhuis` — the trailing slash
 * is load-bearing, not cosmetic.
 */
export const isMenuItemActive = (href: string, pathname: string): boolean =>
  pathname === href || pathname.startsWith(`${href}/`);
