"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { Button, getButtonClasses } from "@/components/design-system/Button";
import { List, MagnifyingGlass } from "@/lib/icons.redesign";
import {
  buildMenuItems,
  buildSeniorMenuItem,
  seniorNavLabel,
  isMenuItemActive,
} from "../menuItems";
import { NavTakeover, NavTakeoverItem } from "../NavTakeover";
import type { TeamNavVM } from "@/lib/repositories/team.repository";

export interface SiteHeaderProps {
  seniorTeams?: TeamNavVM[];
  className?: string;
}

/**
 * Bounds a single desktop nav entry so the row cannot be blown out by a long
 * Sanity team name (#2409's one-line-fit constraint at `lg`).
 *
 * `14ch` rather than a character cap on the label itself: it scales with the
 * three mono sizes the row steps through (11 / 13 / 14px), it leaves the full
 * name in the DOM so the link's accessible name stays intact, and it applies
 * only to the desktop row — the mobile drawer has no width constraint. `ch` is
 * exact here because every nav label is mono. `min-w-0` lets the flex item
 * actually shrink; without it `truncate` never engages.
 */
const NAV_LABEL_TRUNCATE = "block max-w-[14ch] truncate";

const Wordmark = () => (
  <Link
    href="/"
    aria-label="KCVV Elewijt — home"
    // `py-1 -my-1` — hit area only, no layout shift (#2394). Not named in the
    // ticket; the walk measured it at 20px and it is the site's home link.
    className="font-display -my-1 inline-block py-1 text-[20px] leading-none font-black whitespace-nowrap italic no-underline lg:text-[20px] xl:text-[24px] 2xl:text-[28px]"
  >
    <span className="text-ink">
      KCVV <span className="text-jersey-deep">Elewijt</span>
    </span>
  </Link>
);

export function SiteHeader({ seniorTeams, className }: SiteHeaderProps) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  const handleClose = useCallback(() => setDrawerOpen(false), []);

  const seniorMenuItems = (seniorTeams ?? []).map((t) =>
    buildSeniorMenuItem(t, seniorNavLabel(t.name)),
  );
  const menuItems = buildMenuItems(seniorMenuItems);

  const isActive = (href: string) => isMenuItemActive(href, pathname);

  return (
    <>
      <header
        className={cn(
          "bg-cream border-paper-edge sticky top-0 z-50 border-b",
          className,
        )}
      >
        {/* Mobile / Tablet (<1024px) */}
        <div className="relative flex h-16 items-center justify-between px-4 lg:hidden">
          <Button
            ref={hamburgerRef}
            variant="ghost"
            size="sm"
            aria-label="Open menu"
            aria-expanded={drawerOpen}
            aria-controls={drawerOpen ? "nav-takeover" : undefined}
            onClick={() => setDrawerOpen(true)}
            className="min-h-11 min-w-11 !px-2 !py-2"
          >
            <List size={20} aria-hidden="true" />
          </Button>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Wordmark />
          </div>

          <Link
            href="/zoeken"
            aria-label="Zoeken"
            className="text-ink hover:text-jersey-deep inline-flex h-11 w-11 items-center justify-center transition-colors"
          >
            <MagnifyingGlass size={20} aria-hidden="true" />
          </Link>
        </div>

        {/* Desktop (≥1024px) */}
        <div className="mx-auto hidden h-16 max-w-[1440px] items-center justify-between gap-4 px-4 lg:grid lg:grid-cols-[auto_1fr_auto] xl:gap-8 xl:px-8 2xl:gap-10">
          <Wordmark />

          <nav aria-label="Hoofdnavigatie" className="flex w-full">
            <ul className="m-0 flex w-full list-none items-center justify-between gap-x-4 gap-y-0 py-0 pr-0 pl-6 xl:gap-x-8 xl:pl-10 2xl:gap-x-10 2xl:pl-12">
              {menuItems.map((item) => (
                <li key={item.href} className="relative min-w-0">
                  <Link
                    href={item.href}
                    className={cn(
                      // `py-2 -my-2` — hit area only, no layout shift (#2394).
                      // Desktop-only nav, so it never showed up in the 390px
                      // walk, but it is the same 11px recipe the wordmark
                      // above carries.
                      "-my-2 py-2 font-mono text-[11px] font-semibold tracking-[0.04em] whitespace-nowrap uppercase no-underline transition-colors xl:text-[13px] 2xl:text-[14px]",
                      NAV_LABEL_TRUNCATE,
                      isActive(item.href)
                        ? "text-jersey-deep"
                        : "text-ink hover:text-jersey-deep",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3 xl:gap-5">
            <Link
              href="/zoeken"
              aria-label="Zoeken"
              className="text-ink hover:text-jersey-deep inline-flex items-center transition-colors"
            >
              <MagnifyingGlass size={18} aria-hidden="true" />
            </Link>
            <Link
              href="/club/word-lid"
              className="border-ink text-ink hover:border-jersey-deep hover:text-jersey-deep inline-flex items-center border px-2.5 py-1.5 font-mono text-[11px] font-semibold tracking-[0.04em] whitespace-nowrap uppercase no-underline transition-colors duration-150 xl:px-3.5 xl:py-2 xl:text-[13px] 2xl:text-[14px]"
            >
              Word lid
            </Link>
          </div>
        </div>
      </header>

      <NavTakeover
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        wordmark={<Wordmark />}
        returnFocusRef={hamburgerRef}
      >
        {menuItems.map((item) => (
          <NavTakeoverItem
            key={item.href}
            label={item.label}
            href={item.href}
            active={isActive(item.href)}
            onNavigate={handleClose}
          />
        ))}
        <div className="mt-6">
          <Link
            href="/club/word-lid"
            onClick={handleClose}
            className={getButtonClasses({
              variant: "primary",
              size: "md",
              fullWidth: true,
              className: "no-underline",
            })}
          >
            Word lid
          </Link>
        </div>
      </NavTakeover>
    </>
  );
}
