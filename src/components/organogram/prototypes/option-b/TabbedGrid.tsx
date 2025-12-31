"use client";

/**
 * TabbedGrid Component (Option B: Tabbed Grid)
 *
 * Main organogram prototype with department tabs and responsive grid.
 * Combines SearchBar, DepartmentFilter, and MemberGrid for a clean,
 * scannable interface optimized for both contact lookup and browsing.
 *
 * Features:
 * - Department filtering (All / Hoofdbestuur / Jeugdbestuur)
 * - Fuzzy search across all fields
 * - Responsive grid layout (1-4 columns)
 * - Member count badges
 * - Loading and empty states
 * - Click to open details modal
 *
 * Strengths:
 * - Clean separation by department
 * - Easy to scan and browse
 * - Quick filtering and search
 * - Mobile-friendly responsive grid
 *
 * Weaknesses:
 * - Flatter hierarchy (2 levels max)
 * - Loses reporting relationships
 * - No visual connection between roles
 */

import { useState, useMemo } from "react";
import { SearchBar } from "../shared/SearchBar";
import { DepartmentFilter } from "../shared/DepartmentFilter";
import { MemberGrid } from "./MemberGrid";
import type { OrgChartNode } from "@/types/organogram";

export interface TabbedGridProps {
  members: OrgChartNode[];
  onMemberClick?: (member: OrgChartNode) => void;
  isLoading?: boolean;
  initialDepartment?: "all" | "hoofdbestuur" | "jeugdbestuur";
  className?: string;
}

/**
 * TabbedGrid - Department tabs with responsive member grid
 *
 * @param members - All organization members
 * @param onMemberClick - Click handler for member selection
 * @param isLoading - Loading state
 * @param initialDepartment - Initial active department
 * @param className - Additional CSS classes
 */
export function TabbedGrid({
  members,
  onMemberClick,
  isLoading = false,
  initialDepartment = "all",
  className = "",
}: TabbedGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDepartment, setActiveDepartment] = useState<
    "all" | "hoofdbestuur" | "jeugdbestuur"
  >(initialDepartment);

  // Filter by department
  const departmentFilteredMembers = useMemo(() => {
    if (activeDepartment === "all") {
      return members;
    }

    return members.filter((member) => {
      // Include 'general' department members in hoofdbestuur
      if (activeDepartment === "hoofdbestuur") {
        return (
          member.department === "hoofdbestuur" ||
          member.department === "general"
        );
      }

      return member.department === activeDepartment;
    });
  }, [members, activeDepartment]);

  // Filter by search query (uses SearchBar's fuzzy matching internally)
  const filteredMembers = useMemo(() => {
    if (!searchQuery.trim()) {
      return departmentFilteredMembers;
    }

    const query = searchQuery.toLowerCase();
    return departmentFilteredMembers.filter((member) => {
      return (
        member.name.toLowerCase().includes(query) ||
        member.title.toLowerCase().includes(query) ||
        member.positionShort?.toLowerCase().includes(query) ||
        member.email?.toLowerCase().includes(query) ||
        member.department?.toLowerCase().includes(query)
      );
    });
  }, [departmentFilteredMembers, searchQuery]);

  // Handle search selection (from autocomplete)
  const handleSearchSelect = (member: OrgChartNode) => {
    onMemberClick?.(member);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header: Search + Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          members={members}
          placeholder="Zoek persoon, functie of afdeling..."
          showAutocomplete={true}
          maxResults={6}
          onSelect={handleSearchSelect}
        />

        {/* Department Filter */}
        <DepartmentFilter
          value={activeDepartment}
          onChange={setActiveDepartment}
          members={members}
          showCounts={true}
          variant="pills"
        />
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-sm text-kcvv-gray">
        <p>
          {isLoading ? (
            "Laden..."
          ) : (
            <>
              <span className="font-semibold text-kcvv-gray-blue">
                {filteredMembers.length}
              </span>{" "}
              {filteredMembers.length === 1 ? "lid" : "leden"}
              {searchQuery && (
                <>
                  {" "}
                  gevonden voor &quot;
                  <span className="font-medium">{searchQuery}</span>&quot;
                </>
              )}
            </>
          )}
        </p>

        {/* Active Department Badge */}
        {activeDepartment !== "all" && !searchQuery && (
          <span className="px-3 py-1 bg-kcvv-green/10 text-kcvv-green rounded-full text-xs font-medium">
            {activeDepartment === "hoofdbestuur"
              ? "Hoofdbestuur"
              : "Jeugdbestuur"}
          </span>
        )}
      </div>

      {/* Member Grid */}
      <MemberGrid
        members={filteredMembers}
        onMemberClick={onMemberClick}
        isLoading={isLoading}
        emptyMessage={
          searchQuery
            ? `Geen resultaten voor "${searchQuery}"`
            : "Geen leden in deze afdeling"
        }
      />
    </div>
  );
}
