"use client";

/**
 * UnifiedOrganogramClient Component
 *
 * Unified interface combining three organogram views into a single tabbed experience:
 * - Card Hierarchy: Collapsible card-based hierarchical view
 * - Interactive Chart: D3-based visual organizational diagram
 * - Responsibility Finder: Help system to find the right contact person
 *
 * Features:
 * - View toggle: Cards, Chart, Verantwoordelijkheden (Responsibilities)
 * - Responsive defaults: Mobile → Cards, Desktop → Chart
 * - Shared state across all views
 * - localStorage preference persistence
 * - User-friendly for ages 6-99 on all devices
 * - Seamless integration with responsibility finder
 * - URL state management for shareable links
 * - Deep linking to specific members
 */

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { LayoutGrid, Network, CircleHelp } from "@/lib/icons";
import { CardHierarchy } from "./card-hierarchy/CardHierarchy";
import { EnhancedOrgChart } from "./chart/EnhancedOrgChart";
import { ResponsibilityFinder } from "../responsibility/ResponsibilityFinder";
import { MemberDetailsModal } from "./MemberDetailsModal";
import { FilterTabs } from "../design-system/FilterTabs";
import { UnifiedSearchBar } from "./shared/UnifiedSearchBar";
import {
  findMemberById,
  buildOrganogramUrl,
  parseOrganogramParams,
} from "@/lib/organogram-utils";
import { responsibilityPaths } from "@/data/responsibility-paths";
import type { OrgChartNode } from "@/types/organogram";
import type { ResponsibilityPath } from "@/types/responsibility";
import type { FilterTab } from "../design-system/FilterTabs/FilterTabs";

type ViewType = "cards" | "chart" | "responsibilities";

export interface UnifiedOrganogramClientProps {
  members: OrgChartNode[];
  className?: string;
}

const VIEW_PREFERENCE_KEY = "kcvv-organogram-view-preference";

/**
 * Get initial view based on URL or default (without localStorage to avoid hydration mismatch)
 */
function getInitialView(urlView: string | null): ViewType {
  // URL parameter takes precedence
  if (urlView && ["cards", "chart", "responsibilities"].includes(urlView)) {
    return urlView as ViewType;
  }

  // Default to chart for consistent SSR/CSR
  // localStorage preference will be synced via useEffect after mount
  return "chart";
}

/**
 * Render a unified organogram UI that lets users switch between cards, chart,
 * and responsibilities views, search members or responsibilities, and inspect member details.
 *
 * The component synchronizes the active view and selected member with the URL,
 * persists the user's view preference to localStorage, and supports deep links
 * that open the member details modal.
 *
 * @param members - All organization members used to populate the views and search
 * @param className - Optional additional CSS classes to apply to the root container
 * @returns The rendered unified organogram React element
 */
export function UnifiedOrganogramClient({
  members,
  className = "",
}: UnifiedOrganogramClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Parse URL parameters
  const urlParams = parseOrganogramParams(searchParams);

  // Initialize member from URL if present
  const urlMember = urlParams.memberId
    ? (findMemberById(members, urlParams.memberId) ?? null)
    : null;

  // Initialize view state from URL or preferences
  const [activeView, setActiveView] = useState<ViewType>(() =>
    getInitialView(urlParams.view),
  );
  const [selectedMember, setSelectedMember] = useState<OrgChartNode | null>(
    () => urlMember,
  );
  const [isModalOpen, setIsModalOpen] = useState(() => !!urlMember);
  const [searchQuery, setSearchQuery] = useState("");

  // Track whether initial localStorage sync has occurred
  const hasInitializedRef = useRef(false);

  // Sync localStorage preference after mount (avoids hydration mismatch)
  useEffect(() => {
    // Only run once on initial mount
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;

    // Only apply localStorage preference if no URL view is set
    if (!urlParams.view) {
      const savedPreference = localStorage.getItem(
        VIEW_PREFERENCE_KEY,
      ) as ViewType | null;

      if (
        savedPreference &&
        ["cards", "chart", "responsibilities"].includes(savedPreference)
      ) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- Synchronizing with localStorage after mount
        setActiveView(savedPreference);
      } else {
        // Apply responsive default on client
        const isMobile = window.matchMedia("(max-width: 1023px)").matches;
        const responsiveDefault = isMobile ? "cards" : "chart";
        if (responsiveDefault !== activeView) {
          setActiveView(responsiveDefault);
        }
      }
    }
  }, [urlParams.view, activeView]);

  // Sync state with URL changes (for browser back/forward navigation)
  useEffect(() => {
    const currentParams = parseOrganogramParams(searchParams);

    // Update view if it changed in the URL
    if (currentParams.view && currentParams.view !== activeView) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Synchronizing with URL changes for browser navigation
      setActiveView(currentParams.view as ViewType);
    }

    // Update selected member if it changed in the URL
    const newMember = currentParams.memberId
      ? (findMemberById(members, currentParams.memberId) ?? null)
      : null;

    if (newMember?.id !== selectedMember?.id) {
      setSelectedMember(newMember);
      setIsModalOpen(!!newMember);
    }
  }, [searchParams, members, activeView, selectedMember]);

  // Update URL when view or member changes
  const updateUrl = (options: {
    view?: ViewType;
    memberId?: string | null;
  }) => {
    // Preserve current member when memberId is undefined, allow null to explicitly clear
    const memberIdToUse =
      options.memberId === undefined
        ? (selectedMember?.id ?? null)
        : options.memberId;

    const newUrl = buildOrganogramUrl("/club/organogram", {
      view: options.view || activeView,
      memberId: memberIdToUse,
    });
    router.push(newUrl, { scroll: false });
  };

  // Handle view change
  const handleViewChange = (view: string) => {
    const newView = view as ViewType;
    setActiveView(newView);
    localStorage.setItem(VIEW_PREFERENCE_KEY, newView);
    updateUrl({ view: newView });
  };

  // Handle member click from any view
  const handleMemberClick = (member: OrgChartNode) => {
    setSelectedMember(member);
    setIsModalOpen(true);
    updateUrl({ memberId: member.id });
  };

  // Handle close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
    // Clear member from URL
    updateUrl({ memberId: null });
  };

  // Handle deep linking from Responsibility Finder
  const handleResponsibilityMemberSelect = (memberId: string) => {
    const member = findMemberById(members, memberId);
    if (member) {
      // Switch to chart view for better visualization
      const bestView: ViewType = "chart";
      setActiveView(bestView);
      setSelectedMember(member);
      setIsModalOpen(true);
      updateUrl({ view: bestView, memberId: member.id });

      // NOTE: Intentionally NOT updating localStorage here
      // Deep-link navigation temporarily shows chart view for better visualization,
      // but preserves the user's explicit view preference (set via handleViewChange)
    }
  };

  // Handle navigation to responsibility view from member details modal
  const handleViewResponsibility = (_responsibilityId: string) => {
    // Close modal and switch to responsibilities view
    setIsModalOpen(false);
    setSelectedMember(null);
    setActiveView("responsibilities");
    updateUrl({ view: "responsibilities", memberId: null });

    // TODO: Once ResponsibilityFinder supports highlighting specific paths,
    // we can pass _responsibilityId to auto-select/highlight it
  };

  // Handle unified search - member selection
  const handleSearchMemberSelect = (member: OrgChartNode) => {
    handleMemberClick(member);
  };

  // Handle unified search - responsibility selection
  const handleSearchResponsibilitySelect = (_path: ResponsibilityPath) => {
    // Switch to responsibilities view
    setActiveView("responsibilities");
    updateUrl({ view: "responsibilities", memberId: null });

    // TODO: Once ResponsibilityFinder supports pre-filling,
    // we can pass _path to auto-select/highlight it
  };

  // View tabs configuration
  const viewTabs: FilterTab[] = [
    {
      value: "cards",
      label: "Overzicht",
      icon: LayoutGrid,
    },
    {
      value: "chart",
      label: "Diagram",
      icon: Network,
    },
    {
      value: "responsibilities",
      label: "Hulp",
      icon: CircleHelp,
    },
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Unified Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <h3
          className="text-lg font-bold text-kcvv-gray-blue mb-3"
          style={{
            fontFamily: "quasimoda, acumin-pro, Montserrat, sans-serif",
          }}
        >
          Zoek een persoon of hulpvraag
        </h3>
        <UnifiedSearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          members={members}
          responsibilityPaths={responsibilityPaths}
          onSelectMember={handleSearchMemberSelect}
          onSelectResponsibility={handleSearchResponsibilitySelect}
          placeholder="Zoek op naam, functie, of hulpvraag..."
        />
      </div>

      {/* View Toggle */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <FilterTabs
          tabs={viewTabs}
          activeTab={activeView}
          onChange={handleViewChange}
          size="lg"
        />

        {/* View Description */}
        <div className="mt-3 text-sm text-kcvv-gray text-center lg:text-left">
          {activeView === "cards" && (
            <p>
              Bekijk de clubstructuur in overzichtelijke kaartjes. Klik op een
              kaartje om meer details te zien.
            </p>
          )}
          {activeView === "chart" && (
            <p>
              Bekijk de clubstructuur in een visueel diagram. Zoom, pan en klik
              voor details.
            </p>
          )}
          {activeView === "responsibilities" && (
            <p>
              Zoek snel de juiste contactpersoon voor jouw vraag of situatie.
            </p>
          )}
        </div>
      </div>

      {/* Active View */}
      <div
        className={`bg-white rounded-xl shadow-sm border border-gray-200 ${
          activeView === "responsibilities"
            ? "overflow-visible"
            : "overflow-hidden"
        }`}
      >
        {activeView === "cards" && (
          <CardHierarchy
            members={members}
            onMemberClick={handleMemberClick}
            initialExpandedDepth={2}
          />
        )}

        {activeView === "chart" && (
          <EnhancedOrgChart
            members={members}
            onMemberClick={handleMemberClick}
          />
        )}

        {activeView === "responsibilities" && (
          <div className="p-6">
            <ResponsibilityFinder
              onMemberSelect={handleResponsibilityMemberSelect}
            />
          </div>
        )}
      </div>

      {/* Member Details Modal */}
      {selectedMember && (
        <MemberDetailsModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          member={selectedMember}
          responsibilityPaths={responsibilityPaths}
          onViewResponsibility={handleViewResponsibility}
        />
      )}
    </div>
  );
}