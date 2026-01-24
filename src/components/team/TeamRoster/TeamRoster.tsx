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
import { User } from "lucide-react";

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
  /** Photo URL */
  imageUrl?: string;
}

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

  // Staff section content (rendered inline to avoid component-in-render issue)
  const staffSection =
    showStaff && staff.length > 0 ? (
      <section className="mt-12">
        <h3
          className="text-xl font-bold text-gray-900 mb-6"
          style={{
            fontFamily: "quasimoda, acumin-pro, Montserrat, sans-serif",
          }}
        >
          Technische Staf
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {staff.map((member) => (
            <div
              key={member.id || `${member.firstName}-${member.lastName}`}
              className="flex flex-col items-center text-center"
            >
              <div className="relative w-24 h-24 mb-3 rounded-full overflow-hidden bg-gray-100">
                {member.imageUrl ? (
                  <Image
                    src={member.imageUrl}
                    alt={`${member.firstName} ${member.lastName}`}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <User
                      className="w-12 h-12 text-gray-300"
                      aria-hidden="true"
                    />
                  </div>
                )}
              </div>
              <p
                className="font-semibold text-gray-900"
                style={{
                  fontFamily: "quasimoda, acumin-pro, Montserrat, sans-serif",
                }}
              >
                {member.firstName} {member.lastName}
              </p>
              <p className="text-sm text-gray-600">{member.role}</p>
            </div>
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
