"use client";

/**
 * FilterTabs Component
 *
 * Unified filter/tab component for consistent filtering UI across the app.
 * Used in: Organogram, News Categories, Sponsors, Responsibility Finder, etc.
 *
 * Features:
 * - Horizontal scrolling on mobile with navigation arrows
 * - Optional count badges
 * - Multiple size variants (sm, md, lg)
 * - Active state with green background (no side borders)
 * - Inactive state with green text and border
 * - Fully accessible and keyboard navigable
 * - Consistent with KCVV design system
 *
 * Design:
 * - Active: bg-kcvv-green-bright text-white (clean, no side borders)
 * - Inactive: bg-transparent text-kcvv-green-bright border-kcvv-green-bright
 * - Hover: bg-kcvv-green-bright text-white
 */

import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "@/lib/icons";

export interface FilterTab {
  /** Unique identifier */
  value: string;
  /** Display label */
  label: string;
  /** Optional count badge */
  count?: number;
  /** Optional custom href (for Link-based tabs) */
  href?: string;
}

export interface FilterTabsProps {
  /** Array of filter options */
  tabs: FilterTab[];
  /** Currently active tab value */
  activeTab: string;
  /** Change handler (for controlled tabs) */
  onChange?: (value: string) => void;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Show count badges */
  showCounts?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Optional aria-label for accessibility */
  ariaLabel?: string;
  /** Render as links instead of buttons (for Next.js Link) */
  renderAsLinks?: boolean;
}

/**
 * FilterTabs - Unified filter component
 *
 * @param tabs - Array of filter tab options
 * @param activeTab - Currently active tab value
 * @param onChange - Change handler
 * @param size - Size variant (sm | md | lg)
 * @param showCounts - Show count badges
 * @param className - Additional CSS classes
 * @param ariaLabel - Accessibility label
 * @param renderAsLinks - Render as <a> tags instead of buttons
 */
export function FilterTabs({
  tabs,
  activeTab,
  onChange,
  size = "md",
  showCounts = true,
  className = "",
  ariaLabel = "Filter tabs",
  renderAsLinks = false,
}: FilterTabsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  // Check scroll position for arrow visibility
  const checkScrollPosition = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setShowLeftArrow(scrollLeft > 10);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  // Update arrows on mount, scroll, and resize
  useEffect(() => {
    checkScrollPosition();
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener("scroll", checkScrollPosition);
    window.addEventListener("resize", checkScrollPosition);

    return () => {
      container.removeEventListener("scroll", checkScrollPosition);
      window.removeEventListener("resize", checkScrollPosition);
    };
  }, [checkScrollPosition, tabs]);

  // Scroll handlers
  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 200;
    const newScrollLeft =
      direction === "left"
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    });
  };

  // Size-based styles
  const sizeClasses = {
    sm: {
      tab: "px-4 py-2 text-xs",
      badge: "ml-1.5 px-1.5 py-0.5 text-xs",
      arrow: "w-8 h-8",
    },
    md: {
      tab: "px-6 py-3 text-sm",
      badge: "ml-2 px-2 py-0.5 text-xs",
      arrow: "w-10 h-10",
    },
    lg: {
      tab: "px-8 py-4 text-base",
      badge: "ml-2.5 px-2.5 py-1 text-sm",
      arrow: "w-12 h-12",
    },
  };

  const currentSize = sizeClasses[size];

  // Active/Inactive styles - transparent border for active to prevent width shift
  const activeClasses =
    "bg-kcvv-green-bright text-white border-2 border-transparent";
  const inactiveClasses =
    "bg-transparent text-kcvv-green-bright hover:bg-kcvv-green-bright hover:text-white hover:border-transparent border-2 border-kcvv-green-bright";

  // Render individual tab
  const renderTab = (tab: FilterTab) => {
    const isActive = activeTab === tab.value;
    const baseClasses = `
      group
      ${currentSize.tab}
      ${isActive ? activeClasses : inactiveClasses}
      font-medium
      transition-all
      duration-200
      whitespace-nowrap
      flex-shrink-0
      rounded
      flex
      items-center
      focus:outline-none
    `;

    const content = (
      <>
        {tab.label}
        {showCounts && typeof tab.count !== "undefined" && (
          <span
            className={`
              ${currentSize.badge}
              rounded-full
              font-semibold
              ${
                isActive
                  ? "bg-white/20 text-white"
                  : "bg-kcvv-green-bright/10 text-kcvv-green-bright group-hover:bg-white/20 group-hover:text-white"
              }
            `}
            style={{ fontFamily: "ibm-plex-mono, monospace" }}
          >
            {tab.count}
          </span>
        )}
      </>
    );

    if (renderAsLinks && tab.href) {
      return (
        <a
          key={tab.value}
          href={tab.href}
          className={baseClasses}
          role="tab"
          aria-selected={isActive}
          aria-current={isActive ? "page" : undefined}
        >
          {content}
        </a>
      );
    }

    return (
      <button
        key={tab.value}
        onClick={() => onChange?.(tab.value)}
        className={baseClasses}
        role="tab"
        aria-selected={isActive}
        type="button"
      >
        {content}
      </button>
    );
  };

  return (
    <div
      className={`relative ${className}`}
      role="tablist"
      aria-label={ariaLabel}
    >
      {/* Left Arrow */}
      {showLeftArrow && (
        <button
          type="button"
          onClick={() => scroll("left")}
          className={`
            absolute left-0 top-1/2 -translate-y-1/2 z-10
            ${currentSize.arrow}
            bg-white
            rounded-full
            shadow-md
            flex items-center justify-center
            text-kcvv-green-bright
            hover:bg-kcvv-green-bright hover:text-white
            transition-colors
            focus:outline-none focus:ring-2 focus:ring-kcvv-green-bright focus:ring-offset-2
          `}
          aria-label="Scroll left"
        >
          <ChevronLeft size={size === "sm" ? 16 : size === "lg" ? 24 : 20} />
        </button>
      )}

      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className={`
          flex gap-2 overflow-x-auto scroll-smooth
          ${showLeftArrow ? (size === "sm" ? "pl-10" : size === "lg" ? "pl-14" : "pl-12") : "pl-0"}
          ${showRightArrow ? (size === "sm" ? "pr-10" : size === "lg" ? "pr-14" : "pr-12") : "pr-0"}
          scrollbar-hide
        `}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {tabs.map(renderTab)}
      </div>

      {/* Right Arrow */}
      {showRightArrow && (
        <button
          type="button"
          onClick={() => scroll("right")}
          className={`
            absolute right-0 top-1/2 -translate-y-1/2 z-10
            ${currentSize.arrow}
            bg-white
            rounded-full
            shadow-md
            flex items-center justify-center
            text-kcvv-green-bright
            hover:bg-kcvv-green-bright hover:text-white
            transition-colors
            focus:outline-none focus:ring-2 focus:ring-kcvv-green-bright focus:ring-offset-2
          `}
          aria-label="Scroll right"
        >
          <ChevronRight size={size === "sm" ? 16 : size === "lg" ? 24 : 20} />
        </button>
      )}

      {/* Hide scrollbar CSS */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
