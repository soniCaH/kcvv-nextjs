"use client";

/**
 * DepartmentFilter Component
 *
 * Department selection filter with horizontal scrolling on mobile.
 * Inspired by CategoryFilters horizontal scroll pattern.
 *
 * Features:
 * - Three options: All, Hoofdbestuur, Jeugdbestuur
 * - Member counts per department
 * - Active state highlighting (green background)
 * - Horizontal scrolling on mobile with navigation arrows
 * - Smooth scroll animation
 * - Keyboard accessible
 *
 * Variants:
 * - tabs: Traditional tab-like buttons
 * - pills: Rounded pill buttons
 * - buttons: Standard button group
 */

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "@/lib/icons";
import type { DepartmentFilterProps, DepartmentOption } from "./types";

/**
 * DepartmentFilter - Filter by department with optional member counts
 *
 * @param value - Current active department
 * @param onChange - Change handler
 * @param members - All members (for counting)
 * @param showCounts - Show member counts
 * @param variant - Display style (tabs | pills | buttons)
 * @param className - Additional CSS classes
 */
export function DepartmentFilter({
  value,
  onChange,
  members,
  showCounts = true,
  variant = "tabs",
  className = "",
}: DepartmentFilterProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  // Calculate member counts
  const options: DepartmentOption[] = [
    {
      value: "all",
      label: "Alle",
      count: members.length,
    },
    {
      value: "hoofdbestuur",
      label: "Hoofdbestuur",
      count: members.filter(
        (m) => m.department === "hoofdbestuur" || m.department === "general",
      ).length,
    },
    {
      value: "jeugdbestuur",
      label: "Jeugdbestuur",
      count: members.filter((m) => m.department === "jeugdbestuur").length,
    },
  ];

  // Check scroll position
  const updateArrows = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setShowLeftArrow(scrollLeft > 10);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  // Update arrows on mount and scroll
  useEffect(() => {
    updateArrows();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", updateArrows);
      window.addEventListener("resize", updateArrows);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", updateArrows);
      }
      window.removeEventListener("resize", updateArrows);
    };
  }, [members]);

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

  // Variant styles
  const buttonBaseClasses = {
    tabs: "px-6 py-3 font-medium transition-all whitespace-nowrap",
    pills:
      "px-6 py-3 rounded-full font-medium transition-all whitespace-nowrap",
    buttons:
      "px-6 py-3 font-medium transition-all whitespace-nowrap first:rounded-l-lg last:rounded-r-lg",
  };

  const activeClasses = {
    tabs: "bg-green-main text-white shadow-md border-b-4 border-green-hover",
    pills: "bg-green-main text-white shadow-md",
    buttons: "bg-green-main text-white shadow-md",
  };

  const inactiveClasses = {
    tabs: "bg-white text-gray-dark hover:bg-gray-50 border-b-4 border-transparent",
    pills: "bg-gray-100 text-gray-dark hover:bg-gray-200",
    buttons: "bg-gray-100 text-gray-dark hover:bg-gray-200",
  };

  return (
    <div className={`relative ${className}`}>
      {/* Left Arrow */}
      {showLeftArrow && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-gray-dark hover:text-green-main transition-colors"
          aria-label="Scroll links"
        >
          <ChevronLeft size={20} />
        </button>
      )}

      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className={`
          flex gap-2 overflow-x-auto scroll-smooth
          ${showLeftArrow ? "pl-12" : "pl-2"}
          ${showRightArrow ? "pr-12" : "pr-2"}
          scrollbar-hide
        `}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`
              ${buttonBaseClasses[variant]}
              ${
                value === option.value
                  ? activeClasses[variant]
                  : inactiveClasses[variant]
              }
              flex-shrink-0
              focus:outline-none focus:ring-2 focus:ring-green-main focus:ring-offset-2
            `}
            aria-pressed={value === option.value}
          >
            {option.label}
            {showCounts && (
              <span
                className={`
                  ml-2 px-2 py-0.5 rounded-full text-xs font-semibold
                  ${
                    value === option.value
                      ? "bg-white/20 text-white"
                      : "bg-gray-200 text-gray-600"
                  }
                `}
                style={{ fontFamily: "ibm-plex-mono, monospace" }}
              >
                {option.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Right Arrow */}
      {showRightArrow && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-gray-dark hover:text-green-main transition-colors"
          aria-label="Scroll rechts"
        >
          <ChevronRight size={20} />
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
