"use client";

/**
 * DepartmentFilter Component (Migrated to FilterTabs)
 *
 * Department selection filter using the unified FilterTabs component.
 * This is now a thin wrapper around FilterTabs for backward compatibility.
 *
 * Features:
 * - Three options: All, Hoofdbestuur, Jeugdbestuur
 * - Member counts per department
 * - Consistent styling with FilterTabs across the app
 * - Mobile-responsive with horizontal scrolling
 */

import { useMemo } from "react";
import { FilterTabs, type FilterTab } from "@/components/ui/FilterTabs";
import type { DepartmentFilterProps } from "./types";

/**
 * DepartmentFilter - Filter by department with member counts
 *
 * @param value - Current active department
 * @param onChange - Change handler
 * @param members - All members (for counting)
 * @param showCounts - Show member counts
 * @param variant - DEPRECATED: Use size prop instead (kept for backward compatibility)
 * @param size - Size variant (sm | md | lg)
 * @param className - Additional CSS classes
 */
export function DepartmentFilter({
  value,
  onChange,
  members,
  showCounts = true,
  variant,
  size = "md",
  className = "",
}: DepartmentFilterProps) {
  // Calculate tabs with member counts
  const tabs: FilterTab[] = useMemo(
    () => [
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
    ],
    [members],
  );

  // Map variant to size if provided (backward compatibility)
  const effectiveSize = variant ? "md" : size;

  // Type-safe onChange handler
  const handleChange = (newValue: string) => {
    onChange(newValue as "all" | "hoofdbestuur" | "jeugdbestuur");
  };

  return (
    <FilterTabs
      tabs={tabs}
      activeTab={value}
      onChange={handleChange}
      size={effectiveSize}
      showCounts={showCounts}
      className={className}
      ariaLabel="Filter by department"
    />
  );
}
