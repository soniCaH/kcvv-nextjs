/**
 * TeamRoster Component
 *
 * Player grid showing full team roster grouped by position.
 * Displays PlayerCard components organized by position (GK, DEF, MID, FWD).
 *
 * Features:
 * - Players grouped by position (Keeper, Verdediger, Middenvelder, Aanvaller)
 * - Position section headers with player count
 * - Optional staff display (coaches, trainers)
 * - Compact list view variant
 * - Loading skeleton grid
 * - Empty state handling
 */

import { useMemo } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import { PlayerCard, type PlayerCardProps } from "../../player/PlayerCard";

export interface RosterPlayer extends Omit<
  PlayerCardProps,
  "variant" | "isLoading"
> {
  /** Unique identifier */
  id?: string;
}

export interface StaffMember {
  /** Unique identifier */
  id?: string;
  /** First name */
  firstName: string;
  /** Last name */
  lastName: string;
  /** Role (e.g., Hoofdtrainer, Assistent-trainer) */
  role: string;
  /** Short role code displayed like jersey number (e.g., T1, T2, TK, TVJO, PDG) */
  roleCode?: string;
  /** Photo URL */
  imageUrl?: string;
}

/**
 * Generate text-shadow CSS for staff role code (navy blue variant)
 */
function generateStaffTextShadow(precision: number, size: number): string {
  const shadows: string[] = [];
  let offset = 0;
  const length = Math.floor(size * (1 / precision)) - 1;

  for (let i = 0; i <= length; i++) {
    offset += precision;
    shadows.push(`${-offset}px ${offset}px #1e3a5f`); // navy blue
  }

  return shadows.join(", ");
}

// Pre-calculate the staff text shadow for performance (smaller for 4-char codes)
const STAFF_ROLE_SHADOW = generateStaffTextShadow(0.25, 6);

export interface TeamRosterProps {
  /** Array of player data */
  players: RosterPlayer[];
  /** Array of staff data (coaches, trainers) */
  staff?: StaffMember[];
  /** Team name for accessibility */
  teamName?: string;
  /** Group players by position with headers */
  groupByPosition?: boolean;
  /** Display staff section */
  showStaff?: boolean;
  /** Layout variant */
  variant?: "grid" | "compact";
  /** Loading state */
  isLoading?: boolean;
  /** Message when no players found */
  emptyMessage?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Position display names and order
 */
const POSITION_CONFIG: Record<
  string,
  { label: string; labelPlural: string; order: number }
> = {
  Keeper: { label: "Keeper", labelPlural: "Keepers", order: 1 },
  Verdediger: { label: "Verdediger", labelPlural: "Verdedigers", order: 2 },
  Middenvelder: {
    label: "Middenvelder",
    labelPlural: "Middenvelders",
    order: 3,
  },
  Aanvaller: { label: "Aanvaller", labelPlural: "Aanvallers", order: 4 },
};

/**
 * Get position order for sorting
 */
function getPositionOrder(position: string): number {
  return POSITION_CONFIG[position]?.order ?? 99;
}

/**
 * Get position label (singular or plural)
 */
function getPositionLabel(position: string, count: number): string {
  const config = POSITION_CONFIG[position];
  if (!config) return position;
  return count === 1 ? config.label : config.labelPlural;
}

export function TeamRoster({
  players,
  staff = [],
  teamName = "Team",
  groupByPosition = true,
  showStaff = false,
  variant = "grid",
  isLoading = false,
  emptyMessage = "Geen spelers gevonden",
  className,
}: TeamRosterProps) {
  const isCompact = variant === "compact";

  // Sort players by position order, then by number
  const sortedPlayers = useMemo(() => {
    return [...players].sort((a, b) => {
      const posA = getPositionOrder(a.position);
      const posB = getPositionOrder(b.position);
      if (posA !== posB) return posA - posB;
      // Within same position, sort by number
      return (a.number ?? 99) - (b.number ?? 99);
    });
  }, [players]);

  // Group players by position
  const groupedPlayers = useMemo(() => {
    if (!groupByPosition) return null;

    const groups: Record<string, RosterPlayer[]> = {};
    sortedPlayers.forEach((player) => {
      const pos = player.position;
      if (!groups[pos]) groups[pos] = [];
      groups[pos].push(player);
    });

    // Sort groups by position order
    return Object.entries(groups).sort(
      ([posA], [posB]) => getPositionOrder(posA) - getPositionOrder(posB),
    );
  }, [sortedPlayers, groupByPosition]);

  // Loading skeleton
  if (isLoading) {
    // Flat grid skeleton when not grouping by position
    if (!groupByPosition) {
      return (
        <div
          className={cn("space-y-8", className)}
          aria-label={`${teamName} selectie laden...`}
        >
          <div
            className={cn(
              "grid gap-4",
              isCompact
                ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
            )}
          >
            {Array.from({ length: 8 }).map((_, j) => (
              <PlayerCard
                key={j}
                firstName=""
                lastName=""
                position=""
                href=""
                isLoading
                variant={isCompact ? "compact" : "default"}
              />
            ))}
          </div>
        </div>
      );
    }

    // Grouped skeleton when grouping by position
    return (
      <div
        className={cn("space-y-8", className)}
        aria-label={`${teamName} selectie laden...`}
      >
        {/* Position section skeletons */}
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-4">
            {/* Header skeleton */}
            <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
            {/* Player cards skeleton */}
            <div
              className={cn(
                "grid gap-4",
                isCompact
                  ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                  : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
              )}
            >
              {Array.from({ length: i === 1 ? 2 : i === 4 ? 3 : 4 }).map(
                (_, j) => (
                  <PlayerCard
                    key={j}
                    firstName=""
                    lastName=""
                    position=""
                    href=""
                    isLoading
                    variant={isCompact ? "compact" : "default"}
                  />
                ),
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state (no players and no staff to show)
  if (sortedPlayers.length === 0 && (!showStaff || staff.length === 0)) {
    return (
      <div
        className={cn(
          "flex items-center justify-center py-12",
          "text-gray-500 text-center",
          className,
        )}
      >
        <p>{emptyMessage}</p>
      </div>
    );
  }

  const gridClasses = cn(
    "grid gap-6",
    isCompact
      ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  );

  // Staff section content - uses PlayerCard style but with amber colors for role code
  const staffSection =
    showStaff && staff.length > 0 ? (
      <section className="mt-12">
        <h3
          className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"
          style={{
            fontFamily: "quasimoda, acumin-pro, Montserrat, sans-serif",
          }}
        >
          Technische Staf
          <span className="text-sm font-normal text-gray-500">
            ({staff.length})
          </span>
        </h3>
        <div className={gridClasses}>
          {staff.map((member) => (
            <article
              key={member.id || `${member.firstName}-${member.lastName}`}
              className="group w-full max-w-[340px]"
            >
              <div
                className={cn(
                  "relative block overflow-hidden isolate w-full",
                  isCompact ? "h-[220px]" : "h-[285px] lg:h-[446px]",
                )}
              >
                {/* Gray background area */}
                <div
                  className={cn(
                    "absolute right-0 bottom-0 left-0 z-0",
                    "bg-[#edeff4]",
                    isCompact ? "top-[40px]" : "top-[54px] lg:top-[90px]",
                  )}
                  aria-hidden="true"
                />

                {/* Role code - displayed like jersey number but in dark blue, smaller to fit 4 chars */}
                {member.roleCode && (
                  <div
                    className={cn(
                      "absolute z-[5] transition-all duration-300 ease-in-out pointer-events-none",
                      isCompact
                        ? "top-[8px] left-[12px] text-[5rem]"
                        : "top-[10px] left-[12px] text-[7rem] lg:top-[5px] lg:text-[9rem]",
                      "group-hover:scale-105 group-hover:origin-top-left",
                    )}
                    style={{
                      maxWidth: "10px",
                      fontFamily: "stenciletta, sans-serif",
                      lineHeight: 0.71,
                      letterSpacing: "-4px",
                      color: "#1e3a5f",
                      WebkitTextStroke: "3px #1e3a5f",
                      WebkitTextFillColor: "white",
                      textShadow: STAFF_ROLE_SHADOW,
                    }}
                    aria-hidden="true"
                  >
                    {member.roleCode}
                  </div>
                )}

                {/* Staff image container - with same hover animation as players */}
                <div className="absolute inset-0 z-[2]">
                  <div
                    className={cn(
                      "absolute bottom-0 right-[-34px] ml-[10px]",
                      "w-full h-full",
                      isCompact
                        ? "max-w-[180px]"
                        : "max-w-[232px] lg:left-[74px] lg:max-w-[299px] lg:h-[calc(100%-15px)]",
                      "transition-all duration-300 ease-in-out",
                      "group-hover:-translate-x-[50px] group-hover:-translate-y-[10px]",
                    )}
                  >
                    {member.imageUrl ? (
                      <Image
                        src={member.imageUrl}
                        alt={`${member.firstName} ${member.lastName}`}
                        fill
                        className="object-contain object-bottom"
                        sizes={
                          isCompact
                            ? "180px"
                            : "(max-width: 960px) 232px, 299px"
                        }
                      />
                    ) : (
                      /* Staff placeholder - same alignment as player silhouette */
                      <div className="absolute inset-0 flex items-end justify-center">
                        <svg
                          className={cn(
                            "text-[#cacaca]",
                            isCompact
                              ? "w-[140px] h-[180px]"
                              : "w-[200px] h-[280px] lg:w-[240px] lg:h-[340px]",
                          )}
                          fill="currentColor"
                          viewBox="0 0 24 32"
                          aria-hidden="true"
                        >
                          {/* Staff silhouette - similar to player but with tie/collar detail */}
                          <path d="M12 0C8.7 0 6 2.7 6 6s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6zm0 14c-6.6 0-12 3.4-12 8v10h24V22c0-4.6-5.4-8-12-8z" />
                          {/* Tie detail to differentiate from players */}
                          <path
                            d="M12 14l-1.5 4 1.5 8 1.5-8-1.5-4z"
                            fill="#b0b0b0"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom gradient overlay - navy blue for staff to distinguish from players */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-[30%] z-[3] pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(0deg, #1e3a5f 10%, transparent 80%)",
                  }}
                  aria-hidden="true"
                />

                {/* Name section - no role badge, just names like players */}
                <div className="absolute bottom-[17px] left-[15px] right-[15px] z-[4] overflow-hidden">
                  {/* First name */}
                  <div
                    className={cn(
                      "text-white uppercase font-semibold truncate",
                      isCompact
                        ? "text-[1.5rem]"
                        : "text-[1.75rem] lg:text-[2rem]",
                    )}
                    style={{
                      fontFamily:
                        "quasimoda, acumin-pro, Montserrat, sans-serif",
                      lineHeight: 1,
                    }}
                  >
                    {member.firstName}
                  </div>

                  {/* Last name */}
                  <div
                    className={cn(
                      "text-white uppercase font-thin truncate",
                      isCompact
                        ? "text-[1.5rem]"
                        : "text-[1.75rem] lg:text-[2rem]",
                    )}
                    style={{
                      fontFamily:
                        "quasimoda, acumin-pro, Montserrat, sans-serif",
                      lineHeight: 1,
                    }}
                  >
                    {member.lastName}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    ) : null;

  // Grouped display by position
  if (groupedPlayers && groupedPlayers.length > 0) {
    return (
      <div
        className={className}
        role="region"
        aria-label={`${teamName} selectie`}
      >
        <div className="space-y-10">
          {groupedPlayers.map(([position, positionPlayers]) => (
            <section key={position}>
              <h3
                className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"
                style={{
                  fontFamily: "quasimoda, acumin-pro, Montserrat, sans-serif",
                }}
              >
                {getPositionLabel(position, positionPlayers.length)}
                <span className="text-sm font-normal text-gray-500">
                  ({positionPlayers.length})
                </span>
              </h3>
              <div className={gridClasses}>
                {positionPlayers.map((player) => (
                  <PlayerCard
                    key={player.id || player.href}
                    {...player}
                    variant={isCompact ? "compact" : "default"}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
        {staffSection}
      </div>
    );
  }

  // Flat list display (no grouping)
  return (
    <div
      className={className}
      role="region"
      aria-label={`${teamName} selectie`}
    >
      <div className={gridClasses}>
        {sortedPlayers.map((player) => (
          <PlayerCard
            key={player.id || player.href}
            {...player}
            variant={isCompact ? "compact" : "default"}
          />
        ))}
      </div>
      {staffSection}
    </div>
  );
}
