"use client";

/**
 * CardHierarchy Component (Option A: Card Hierarchy)
 *
 * Main organogram prototype with expandable/collapsible cards.
 * Shows organizational hierarchy through nested, expandable cards.
 *
 * Features:
 * - Expandable card hierarchy (preserves reporting relationships)
 * - Search with auto-expand to matching results
 * - Department filtering
 * - Expand All / Collapse All controls
 * - Progressive disclosure (start partially expanded)
 * - Mobile-friendly touch interactions
 * - Keyboard accessible
 *
 * Strengths:
 * - Shows hierarchical relationships
 * - Progressive disclosure reduces overwhelm
 * - Mobile-native expandable pattern
 * - Clear parent-child connections
 *
 * Weaknesses:
 * - Harder to see "big picture" at once
 * - Deep hierarchies require more clicks
 * - Can lose context when deeply nested
 */

import { useState, useMemo } from "react";
import { SearchBar } from "../shared/SearchBar";
import { DepartmentFilter } from "../shared/DepartmentFilter";
import { HierarchyLevel } from "./HierarchyLevel";
import type { OrgChartNode } from "@/types/organogram";

export interface CardHierarchyProps {
  members: OrgChartNode[];
  onMemberClick?: (member: OrgChartNode) => void;
  initialExpandedDepth?: number;
  maxDepth?: number;
  isLoading?: boolean;
  className?: string;
}

/**
 * CardHierarchy - Hierarchical expandable cards
 *
 * @param members - All organization members
 * @param onMemberClick - Click handler for member selection
 * @param initialExpandedDepth - How many levels to expand initially (default: 2)
 * @param maxDepth - Maximum hierarchy depth to render (default: 10)
 * @param isLoading - Loading state
 * @param className - Additional CSS classes
 */
export function CardHierarchy({
  members,
  onMemberClick,
  initialExpandedDepth = 2,
  maxDepth = 10,
  isLoading = false,
  className = "",
}: CardHierarchyProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDepartment, setActiveDepartment] = useState<
    "all" | "hoofdbestuur" | "jeugdbestuur"
  >("all");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
    // Initialize with members up to initialExpandedDepth
    const initialExpanded = new Set<string>();

    const expandToDepth = (
      nodeId: string | null,
      currentDepth: number,
    ): void => {
      if (currentDepth >= initialExpandedDepth) return;

      members
        .filter((m) => m.parentId === nodeId)
        .forEach((child) => {
          initialExpanded.add(child.id);
          expandToDepth(child.id, currentDepth + 1);
        });
    };

    // Find root nodes and expand from there
    const rootNodes = members.filter((m) => !m.parentId);
    rootNodes.forEach((root) => {
      initialExpanded.add(root.id);
      expandToDepth(root.id, 1);
    });

    return initialExpanded;
  });

  // Filter by department
  const departmentFilteredMembers = useMemo(() => {
    if (activeDepartment === "all") {
      return members;
    }

    return members.filter((member) => {
      if (activeDepartment === "hoofdbestuur") {
        return (
          member.department === "hoofdbestuur" ||
          member.department === "general"
        );
      }
      return member.department === activeDepartment;
    });
  }, [members, activeDepartment]);

  // Search filtering
  const searchResults = useMemo(() => {
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

  // Calculate which IDs should be auto-expanded based on search
  const searchExpandedIds = useMemo(() => {
    if (!searchQuery.trim() || searchResults.length === 0) {
      return new Set<string>();
    }

    const autoExpanded = new Set<string>();

    // For each search result, add all ancestors
    searchResults.forEach((result) => {
      let current: OrgChartNode | undefined = result;

      while (current) {
        autoExpanded.add(current.id);
        current = members.find((m) => m.id === current?.parentId);
      }
    });

    return autoExpanded;
  }, [searchQuery, searchResults, members]);

  // Merge manual expansions with search auto-expansions
  const effectiveExpandedIds = useMemo(() => {
    const merged = new Set(expandedIds);
    searchExpandedIds.forEach((id) => merged.add(id));
    return merged;
  }, [expandedIds, searchExpandedIds]);

  // Get root members (those without parentId or whose parent is filtered out)
  const rootMembers = useMemo(() => {
    const filteredIds = new Set(searchResults.map((m) => m.id));

    return searchResults.filter((member) => {
      // No parent = root
      if (!member.parentId) return true;

      // Parent exists but is filtered out = treat as root
      return !filteredIds.has(member.parentId);
    });
  }, [searchResults]);

  // Handle expand/collapse toggle
  const handleToggle = (memberId: string, isExpanded: boolean) => {
    const newExpanded = new Set(expandedIds);

    if (isExpanded) {
      newExpanded.add(memberId);
    } else {
      newExpanded.delete(memberId);

      // Also collapse all children recursively
      const collapseChildren = (parentId: string) => {
        members
          .filter((m) => m.parentId === parentId)
          .forEach((child) => {
            newExpanded.delete(child.id);
            collapseChildren(child.id);
          });
      };

      collapseChildren(memberId);
    }

    setExpandedIds(newExpanded);
  };

  // Expand All
  const handleExpandAll = () => {
    const allIds = new Set(searchResults.map((m) => m.id));
    setExpandedIds(allIds);
  };

  // Collapse All
  const handleCollapseAll = () => {
    setExpandedIds(new Set());
  };

  // Handle search selection
  const handleSearchSelect = (member: OrgChartNode) => {
    onMemberClick?.(member);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="h-12 bg-gray-100 rounded-lg animate-pulse" />
        <div className="h-12 bg-gray-100 rounded-lg animate-pulse" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-32 bg-gray-100 rounded-lg animate-pulse"
              style={{ marginLeft: `${(i % 3) * 16}px` }}
            />
          ))}
        </div>
      </div>
    );
  }

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

      {/* Controls Bar */}
      <div className="flex items-center justify-between">
        {/* Results Count */}
        <p className="text-sm text-gray-medium">
          {searchResults.length === 0 ? (
            "Geen resultaten"
          ) : (
            <>
              <span className="font-semibold text-gray-blue">
                {searchResults.length}
              </span>{" "}
              {searchResults.length === 1 ? "lid" : "leden"}
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

        {/* Expand/Collapse All */}
        {searchResults.length > 0 && (
          <div className="flex gap-2">
            <button
              onClick={handleExpandAll}
              className="
                px-3 py-1.5
                text-xs font-medium text-gray-dark
                bg-gray-100 hover:bg-gray-200
                rounded-lg
                transition-colors
                focus:outline-none focus:ring-2 focus:ring-green-main focus:ring-offset-2
              "
            >
              Alles uitklappen
            </button>
            <button
              onClick={handleCollapseAll}
              className="
                px-3 py-1.5
                text-xs font-medium text-gray-dark
                bg-gray-100 hover:bg-gray-200
                rounded-lg
                transition-colors
                focus:outline-none focus:ring-2 focus:ring-green-main focus:ring-offset-2
              "
            >
              Alles inklappen
            </button>
          </div>
        )}
      </div>

      {/* Hierarchy */}
      {searchResults.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl text-gray-medium">🔍</span>
          </div>
          <p className="text-lg font-semibold text-gray-blue mb-2">
            {searchQuery
              ? `Geen resultaten voor "${searchQuery}"`
              : "Geen leden in deze afdeling"}
          </p>
          <p className="text-sm text-gray-medium max-w-md">
            Probeer een andere zoekopdracht of filter
          </p>
        </div>
      ) : (
        <HierarchyLevel
          members={rootMembers}
          allMembers={searchResults}
          depth={0}
          maxDepth={maxDepth}
          expandedIds={effectiveExpandedIds}
          onToggle={handleToggle}
          onMemberClick={onMemberClick}
        />
      )}
    </div>
  );
}
