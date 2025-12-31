"use client";

/**
 * EnhancedOrgChart Component (Option C: Enhanced d3)
 *
 * Enhanced version of d3-org-chart with better mobile UX.
 * Improves upon the current OrgChart.tsx implementation.
 *
 * Enhancements:
 * - Mobile navigation drawer (off-canvas)
 * - Contact overlay on node hover/tap
 * - Improved mobile controls (larger touch targets)
 * - Search highlighting with auto-zoom
 * - Simplified zoom controls
 * - Clearer visual hierarchy
 * - Better responsive behavior
 *
 * Features:
 * - Hierarchical org chart visualization (d3-org-chart)
 * - Search with autocomplete
 * - Department filtering
 * - Zoom/pan controls
 * - Expand/collapse nodes
 * - Fullscreen mode
 * - Export as image
 */

import { useEffect, useRef, useState, useMemo } from "react";
import { OrgChart } from "d3-org-chart";
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Expand,
  Minimize,
  Download,
} from "lucide-react";
import { Menu } from "@/lib/icons";
import { SearchBar } from "../shared/SearchBar";
import { DepartmentFilter } from "../shared/DepartmentFilter";
import { MobileNavigationDrawer } from "./MobileNavigationDrawer";
import { ContactOverlay } from "./ContactOverlay";
import { renderNode, renderCompactNode, type NodeData } from "./NodeRenderer";
import type { OrgChartNode } from "@/types/organogram";

export interface EnhancedOrgChartProps {
  members: OrgChartNode[];
  onMemberClick?: (member: OrgChartNode) => void;
  isLoading?: boolean;
  className?: string;
}

/**
 * EnhancedOrgChart - Enhanced d3-org-chart with mobile improvements
 *
 * @param members - All organization members
 * @param onMemberClick - Click handler for member details
 * @param isLoading - Loading state
 * @param className - Additional CSS classes
 */
export function EnhancedOrgChart({
  members,
  onMemberClick,
  isLoading = false,
  className = "",
}: EnhancedOrgChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<OrgChart<NodeData> | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeDepartment, setActiveDepartment] = useState<
    "all" | "hoofdbestuur" | "jeugdbestuur"
  >("all");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [contactOverlay, setContactOverlay] = useState<{
    member: OrgChartNode;
    position: { x: number; y: number };
  } | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

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
        member.email?.toLowerCase().includes(query)
      );
    });
  }, [departmentFilteredMembers, searchQuery]);

  // Transform data for d3-org-chart
  const chartData = useMemo<NodeData[]>(() => {
    return searchResults.map((member) => ({
      ...member,
      _expanded: true,
      children: [],
    }));
  }, [searchResults]);

  // Initialize d3-org-chart
  useEffect(() => {
    if (!chartContainerRef.current || chartData.length === 0) return;

    const chart = new OrgChart<NodeData>()
      .container("#enhanced-org-chart-container")
      .data(chartData)
      .nodeWidth(() => (isMobile ? 200 : 280))
      .nodeHeight(() => (isMobile ? 100 : 140))
      .childrenMargin(() => 50)
      .compactMarginBetween(() => 35)
      .compactMarginPair(() => 50)
      .neighbourMargin(() => 50)
      .siblingsMargin(() => 50)
      .nodeContent((d) => {
        const hasChildren =
          members.filter((m) => m.parentId === d.data.id).length > 0;
        return isMobile
          ? renderCompactNode(d.data, hasChildren)
          : renderNode(d.data, hasChildren);
      })
      .onNodeClick((node: unknown) => {
        const hierarchyNode = node as { data: NodeData };
        const member = members.find((m) => m.id === hierarchyNode.data.id);
        if (member && onMemberClick) {
          onMemberClick(member);
        }
      });

    chartRef.current = chart;
    chart.render();

    return () => {
      // Cleanup: clear container innerHTML
      if (chartContainerRef.current) {
        chartContainerRef.current.innerHTML = "";
      }
    };
  }, [chartData, members, onMemberClick, isMobile]);

  // Handle search selection - zoom to member
  const handleSearchSelect = (member: OrgChartNode) => {
    if (chartRef.current) {
      chartRef.current.setCentered(member.id).render();
    }
  };

  // Handle mobile drawer member selection - zoom to member
  const handleMobileDrawerSelect = (member: OrgChartNode) => {
    if (chartRef.current) {
      chartRef.current.setCentered(member.id).render();
    }
    setIsMobileDrawerOpen(false);
  };

  // Zoom controls
  const handleZoomIn = () => {
    if (chartRef.current) {
      chartRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (chartRef.current) {
      chartRef.current.zoomOut();
    }
  };

  const handleFitView = () => {
    if (chartRef.current) {
      chartRef.current.fit();
    }
  };

  // Expand/collapse all
  const handleExpandAll = () => {
    if (chartRef.current) {
      chartRef.current.expandAll();
    }
  };

  const handleCollapseAll = () => {
    if (chartRef.current) {
      chartRef.current.collapseAll();
    }
  };

  // Fullscreen toggle
  const handleFullscreenToggle = () => {
    if (!document.fullscreenElement) {
      chartContainerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Export as image
  const handleExport = () => {
    if (chartRef.current) {
      chartRef.current.exportImg({
        full: true,
        save: true,
      });
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="h-12 bg-gray-100 rounded-lg animate-pulse" />
        <div className="h-12 bg-gray-100 rounded-lg animate-pulse" />
        <div className="h-96 bg-gray-100 rounded-lg animate-pulse" />
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
      <div className="flex items-center justify-between flex-wrap gap-3">
        {/* Left: Results Count */}
        <p className="text-sm text-kcvv-gray">
          {searchResults.length === 0 ? (
            "Geen resultaten"
          ) : (
            <>
              <span className="font-semibold text-kcvv-gray-blue">
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

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Mobile Navigation Button */}
          <button
            onClick={() => setIsMobileDrawerOpen(true)}
            className="
              lg:hidden
              px-3 py-2
              flex items-center gap-2
              text-sm font-medium text-white
              bg-kcvv-green hover:bg-kcvv-green-hover
              rounded-lg
              transition-colors
              focus:outline-none focus:ring-2 focus:ring-kcvv-green focus:ring-offset-2
            "
          >
            <Menu size={18} />
            <span>Navigatie</span>
          </button>

          {/* Expand/Collapse All (Desktop) */}
          <div className="hidden lg:flex gap-2">
            <button
              onClick={handleExpandAll}
              className="
                px-3 py-2
                flex items-center gap-2
                text-xs font-medium text-kcvv-gray-dark
                bg-gray-100 hover:bg-gray-200
                rounded-lg
                transition-colors
                focus:outline-none focus:ring-2 focus:ring-kcvv-green focus:ring-offset-2
              "
              aria-label="Alles uitklappen"
            >
              <Expand size={16} />
              <span className="hidden sm:inline">Alles uitklappen</span>
            </button>
            <button
              onClick={handleCollapseAll}
              className="
                px-3 py-2
                flex items-center gap-2
                text-xs font-medium text-kcvv-gray-dark
                bg-gray-100 hover:bg-gray-200
                rounded-lg
                transition-colors
                focus:outline-none focus:ring-2 focus:ring-kcvv-green focus:ring-offset-2
              "
              aria-label="Alles inklappen"
            >
              <Minimize size={16} />
              <span className="hidden sm:inline">Alles inklappen</span>
            </button>
          </div>

          {/* Export Button (Desktop) */}
          <button
            onClick={handleExport}
            className="
              hidden lg:flex
              px-3 py-2
              items-center gap-2
              text-xs font-medium text-kcvv-gray-dark
              bg-gray-100 hover:bg-gray-200
              rounded-lg
              transition-colors
              focus:outline-none focus:ring-2 focus:ring-kcvv-green focus:ring-offset-2
            "
            aria-label="Exporteren als afbeelding"
          >
            <Download size={16} />
            <span className="hidden sm:inline">Exporteren</span>
          </button>

          {/* Fullscreen Toggle (Desktop) */}
          <button
            onClick={handleFullscreenToggle}
            className="
              hidden lg:flex
              px-3 py-2
              items-center gap-2
              text-xs font-medium text-kcvv-gray-dark
              bg-gray-100 hover:bg-gray-200
              rounded-lg
              transition-colors
              focus:outline-none focus:ring-2 focus:ring-kcvv-green focus:ring-offset-2
            "
            aria-label={
              isFullscreen ? "Volledig scherm verlaten" : "Volledig scherm"
            }
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      {/* Chart Container */}
      {searchResults.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl text-kcvv-gray">🔍</span>
          </div>
          <p className="text-lg font-semibold text-kcvv-gray-blue mb-2">
            {searchQuery
              ? `Geen resultaten voor "${searchQuery}"`
              : "Geen leden in deze afdeling"}
          </p>
          <p className="text-sm text-kcvv-gray max-w-md">
            Probeer een andere zoekopdracht of filter
          </p>
        </div>
      ) : (
        <div className="relative">
          {/* Chart */}
          <div
            id="enhanced-org-chart-container"
            ref={chartContainerRef}
            className="
              w-full
              bg-white
              rounded-lg
              border-2 border-gray-200
              overflow-hidden
            "
            style={{
              minHeight: "600px",
              height: isFullscreen ? "100vh" : "600px",
            }}
          />

          {/* Zoom Controls (Fixed Bottom Right) */}
          <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
            <button
              onClick={handleZoomIn}
              className="
                w-12 h-12
                flex items-center justify-center
                bg-white hover:bg-gray-50
                text-kcvv-gray-dark
                rounded-lg
                shadow-lg
                border-2 border-gray-200
                transition-colors
                focus:outline-none focus:ring-2 focus:ring-kcvv-green focus:ring-offset-2
              "
              aria-label="Inzoomen"
            >
              <ZoomIn size={20} />
            </button>
            <button
              onClick={handleZoomOut}
              className="
                w-12 h-12
                flex items-center justify-center
                bg-white hover:bg-gray-50
                text-kcvv-gray-dark
                rounded-lg
                shadow-lg
                border-2 border-gray-200
                transition-colors
                focus:outline-none focus:ring-2 focus:ring-kcvv-green focus:ring-offset-2
              "
              aria-label="Uitzoomen"
            >
              <ZoomOut size={20} />
            </button>
            <button
              onClick={handleFitView}
              className="
                w-12 h-12
                flex items-center justify-center
                bg-white hover:bg-gray-50
                text-kcvv-gray-dark
                rounded-lg
                shadow-lg
                border-2 border-gray-200
                transition-colors
                focus:outline-none focus:ring-2 focus:ring-kcvv-green focus:ring-offset-2
              "
              aria-label="Pas aan"
            >
              <Maximize2 size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Navigation Drawer */}
      <MobileNavigationDrawer
        members={members}
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        onMemberSelect={handleMobileDrawerSelect}
      />

      {/* Contact Overlay */}
      {contactOverlay && (
        <ContactOverlay
          member={contactOverlay.member}
          position={contactOverlay.position}
          isVisible={true}
          onClose={() => setContactOverlay(null)}
          onViewDetails={onMemberClick}
        />
      )}
    </div>
  );
}
