"use client";

/**
 * <OrganigramSectionNav> — the hub's sticky in-page section nav (lock 7o2 /
 * 7o7, refined by #2478). Two doors ("Hulp" → `#hulp`, "Structuur" →
 * `#structuur`), each the light chip (rule 1), filled by the shared
 * `useSectionNav` hook's scroll-spy (rule 3) — the same hook
 * `<TeamSectionNav>` consumes, so a fill means the same thing on every
 * route — plus the unified `<HubSearch>` repeated compactly.
 *
 * Sits below the global header, pinned at `--sticky-header-h` (rule 4). The
 * shared hook also derives `scroll-padding-top` from this bar's own
 * measured height (rule 7); no section carries a hand-written `scroll-mt-*`.
 */

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";
import { PageContainer } from "@/components/design-system";
import { HubSearch } from "../HubSearch";
import { useSectionNav } from "@/hooks/useSectionNav";
import type { OrgChartNode } from "@/types/organigram";
import type { ResponsibilityPath } from "@/types/responsibility";

const SECTIONS = [
  { id: "hulp", label: "Hulp" },
  { id: "structuur", label: "Structuur" },
] as const;

const SECTION_IDS = SECTIONS.map((s) => s.id);

export interface OrganigramSectionNavProps {
  members: OrgChartNode[];
  responsibilityPaths: ResponsibilityPath[];
  className?: string;
}

export function OrganigramSectionNav({
  members,
  responsibilityPaths,
  className,
}: OrganigramSectionNavProps) {
  const { navRef, activeId } = useSectionNav(SECTION_IDS);

  // The repeated search stays hidden until the hero (which carries its own
  // search) scrolls out of view — so the page never shows two search fields at
  // once. Hidden by default; only the observer callback toggles it (no flash,
  // no set-state-in-effect).
  const [heroOutOfView, setHeroOutOfView] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    // No hero to track → leave the search hidden (it reveals relative to the
    // hero, which is always present on the hub).
    const hero = document.getElementById("hub-hero");
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => setHeroOutOfView(!entry.isIntersecting),
      // Top inset clears the header (64px) + this nav (~48px) so the search
      // reveals exactly as the hero (and its search) tucks behind the bars.
      { rootMargin: "-112px 0px 0px 0px" },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      ref={navRef}
      aria-label="Secties van de hub"
      className={cn(
        "bg-cream-deep border-ink sticky top-[var(--sticky-header-h)] z-30 border-b-2",
        className,
      )}
    >
      <PageContainer
        width="index"
        className="flex flex-wrap items-center gap-3 py-2"
      >
        <ul className="flex items-center gap-2">
          {SECTIONS.map((section) => {
            const isActive = activeId === section.id;
            return (
              <li key={section.id}>
                {/* The light chip (#2478 rule 1) — a mirror of
                    <TeamSectionNav>'s item; a change to this recipe needs
                    the same change there. */}
                <a
                  href={`#${section.id}`}
                  aria-current={isActive ? "location" : undefined}
                  onClick={() => {
                    // Move keyboard focus into the target section (it's
                    // tabIndex=-1) so a keyboard/SR user actually lands there —
                    // the hash anchor alone leaves focus on the door (B3). The
                    // hash navigation handles the scroll (preventScroll here).
                    // Active state is scroll-spy driven only (rule 3) — a
                    // click never sets it directly.
                    document
                      .getElementById(section.id)
                      ?.focus({ preventScroll: true });
                  }}
                  className={cn(
                    "border-ink inline-block border px-3 py-1.5 font-mono text-[11px] font-semibold tracking-[0.06em] uppercase transition-all duration-150",
                    isActive
                      ? "bg-jersey-deep text-cream"
                      : "bg-cream text-ink hover:bg-cream-soft shadow-[1px_1px_0_0_var(--color-ink)]",
                  )}
                >
                  {section.label}
                </a>
              </li>
            );
          })}
        </ul>

        {heroOutOfView && (
          <HubSearch
            members={members}
            responsibilityPaths={responsibilityPaths}
            variant="nav"
            placeholder="Zoek…"
            className="ml-auto w-full max-w-[240px] min-w-0"
          />
        )}
      </PageContainer>
    </nav>
  );
}
