"use client";

/**
 * TeamDetail Component
 *
 * Composite component for team detail pages.
 * Combines TeamHeader with tabbed content (Info/Lineup).
 *
 * Features:
 * - Team header with photo, name, and metadata
 * - Tab navigation (Info | Lineup)
 * - Info tab with contact info and body content
 * - Lineup tab with staff and players by position
 * - Loading state support
 */

import { useMemo } from "react";
import DOMPurify from "isomorphic-dompurify";
import * as Tabs from "@radix-ui/react-tabs";
import { TeamHeader, type TeamHeaderProps } from "../TeamHeader";
import { TeamRoster, type RosterPlayer, type StaffMember } from "../TeamRoster";
import { cn } from "@/lib/utils/cn";

/** Shared tab trigger styles */
const TAB_TRIGGER_CLASSES =
  "px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent data-[state=active]:border-kcvv-green-bright data-[state=active]:text-kcvv-green-bright transition-colors";

export interface TeamDetailProps {
  /** Team header props */
  header: TeamHeaderProps;
  /** Contact info HTML content */
  contactInfo?: string;
  /** Body content HTML */
  bodyContent?: string;
  /** Staff members */
  staff?: StaffMember[];
  /** Player roster */
  players?: RosterPlayer[];
  /** Loading state */
  isLoading?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Render a complete team detail view with header and tabbed content.
 */
export function TeamDetail({
  header,
  contactInfo,
  bodyContent,
  staff = [],
  players = [],
  isLoading = false,
  className,
}: TeamDetailProps) {
  const hasPlayers = players.length > 0;
  const hasStaff = staff.length > 0;
  // Trim content to avoid rendering empty/whitespace-only sections
  const hasContactInfo = !!contactInfo?.trim();
  const hasBodyContent = !!bodyContent?.trim();

  // Sanitize HTML content to prevent XSS attacks
  // Even though Drupal should sanitize, this provides defense-in-depth
  const sanitizedContactInfo = useMemo(
    () => (contactInfo ? DOMPurify.sanitize(contactInfo) : ""),
    [contactInfo],
  );
  const sanitizedBodyContent = useMemo(
    () => (bodyContent ? DOMPurify.sanitize(bodyContent) : ""),
    [bodyContent],
  );

  // Loading state
  if (isLoading) {
    return (
      <div className={cn("min-h-screen", className)}>
        <TeamHeader {...header} isLoading />
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded w-48 animate-pulse" />
            <div className="h-64 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Team Header */}
      <TeamHeader {...header} />

      {/* Tab Navigation */}
      <Tabs.Root defaultValue="info" className="container mx-auto px-4 py-8">
        <Tabs.List
          className="flex border-b border-gray-200 mb-6"
          aria-label="Team informatie"
        >
          <Tabs.Trigger value="info" className={TAB_TRIGGER_CLASSES}>
            Info
          </Tabs.Trigger>
          {hasPlayers && (
            <Tabs.Trigger value="lineup" className={TAB_TRIGGER_CLASSES}>
              Lineup
            </Tabs.Trigger>
          )}
        </Tabs.List>

        {/* Info Tab */}
        <Tabs.Content value="info" className="focus:outline-none">
          <div className="space-y-8">
            {/* Contact Info */}
            {hasContactInfo && (
              <section className="prose prose-gray max-w-none">
                <h2 className="text-2xl font-bold mb-4">Contactinformatie</h2>
                <div
                  dangerouslySetInnerHTML={{
                    __html: sanitizedContactInfo,
                  }}
                />
              </section>
            )}

            {/* Staff only (when no players) */}
            {!hasPlayers && hasStaff && (
              <section>
                <h2 className="text-2xl font-bold mb-4">Technische Staf</h2>
                <TeamRoster
                  players={[]}
                  staff={staff}
                  teamName={header.name}
                  groupByPosition={false}
                  showStaff={true}
                />
              </section>
            )}

            {/* Body content */}
            {hasBodyContent && (
              <section className="prose prose-gray max-w-none">
                <div
                  dangerouslySetInnerHTML={{
                    __html: sanitizedBodyContent,
                  }}
                />
              </section>
            )}

            {/* No content message */}
            {!hasContactInfo && !hasStaff && !hasBodyContent && (
              <p className="text-gray-500 text-center py-8">
                Geen extra informatie beschikbaar voor dit team.
              </p>
            )}
          </div>
        </Tabs.Content>

        {/* Lineup Tab - only shown when there are players */}
        {hasPlayers && (
          <Tabs.Content value="lineup" className="focus:outline-none">
            <TeamRoster
              players={players}
              staff={staff}
              teamName={header.name}
              groupByPosition={true}
              showStaff={hasStaff}
            />
          </Tabs.Content>
        )}
      </Tabs.Root>
    </div>
  );
}
