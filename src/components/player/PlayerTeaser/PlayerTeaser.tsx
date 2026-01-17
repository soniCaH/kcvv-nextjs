/**
 * PlayerTeaser Component
 *
 * Compact player preview for lists and roster grids.
 * Simpler design than PlayerCard, optimized for dense layouts.
 */

import { forwardRef, type HTMLAttributes } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";

/** Position to short code mapping */
const positionShort: Record<string, string> = {
  Keeper: "GK",
  Verdediger: "DEF",
  Middenvelder: "MID",
  Aanvaller: "FWD",
  k: "GK",
  d: "DEF",
  m: "MID",
  a: "FWD",
};

export interface PlayerTeaserStats {
  /** Games played */
  games?: number;
  /** Goals scored */
  goals?: number;
}

export interface PlayerTeaserProps extends Omit<
  HTMLAttributes<HTMLElement>,
  "title"
> {
  /** Full player name */
  name: string;
  /** Player position */
  position: string;
  /** Link to player profile */
  href: string;
  /** Jersey number */
  number?: number;
  /** Player photo URL (square, min 80x80) */
  imageUrl?: string;
  /** Show basic stats */
  showStats?: boolean;
  /** Stats data */
  stats?: PlayerTeaserStats;
  /** Selected/highlighted state */
  isSelected?: boolean;
  /** Loading skeleton */
  isLoading?: boolean;
}

/**
 * Compact player teaser for lists and grids
 *
 * Features:
 * - Horizontal layout with photo, name, position
 * - Optional stats display
 * - Selected state with green border
 * - Loading skeleton
 */
export const PlayerTeaser = forwardRef<HTMLElement, PlayerTeaserProps>(
  (
    {
      name,
      position,
      href,
      number,
      imageUrl,
      showStats = false,
      stats,
      isSelected = false,
      isLoading = false,
      className,
      ...props
    },
    ref,
  ) => {
    const positionLabel =
      positionShort[position] || position?.slice(0, 3).toUpperCase() || "???";

    // Loading skeleton
    if (isLoading) {
      return (
        <div
          className={cn(
            "flex items-center gap-3 p-3",
            "bg-white rounded-lg border border-[#edeff4]",
            "animate-pulse",
            className,
          )}
          aria-label="Laden..."
        >
          <div className="w-12 h-12 bg-gray-200 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      );
    }

    return (
      <article ref={ref} className={cn("group", className)} {...props}>
        <Link
          href={href}
          className={cn(
            "flex items-center gap-3 p-3",
            "bg-white rounded-lg",
            "border transition-all duration-200",
            isSelected
              ? "border-kcvv-green-bright border-2 shadow-sm"
              : "border-[#edeff4] hover:border-kcvv-green-bright/50 hover:shadow-sm",
            "no-underline text-inherit",
          )}
          title={`${name} - ${position}`}
        >
          {/* Player photo */}
          <div
            className={cn(
              "relative w-12 h-12 shrink-0",
              "rounded-full overflow-hidden",
              "bg-[#edeff4]",
            )}
          >
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={name}
                fill
                className="object-cover"
                sizes="48px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-[#cacaca]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
            )}
          </div>

          {/* Player info */}
          <div className="flex-1 min-w-0">
            {/* Name row */}
            <div className="flex items-center gap-2">
              <span
                className="font-semibold text-[#292c31] truncate"
                style={{ fontFamily: "var(--font-family-title)" }}
              >
                {name}
              </span>
              {number && (
                <span
                  className="text-xs font-mono text-[#62656A] bg-[#edeff4] px-1.5 py-0.5 rounded"
                  aria-label={`Nummer ${number}`}
                >
                  #{number}
                </span>
              )}
            </div>

            {/* Position and stats row */}
            <div className="flex items-center gap-3 mt-0.5">
              <span className="text-sm text-[#62656A]">{positionLabel}</span>

              {showStats && stats && (
                <div className="flex items-center gap-2 text-xs text-[#9a9da2]">
                  {stats.games !== undefined && (
                    <span title={`${stats.games} wedstrijden`}>
                      {stats.games} wed.
                    </span>
                  )}
                  {stats.goals !== undefined && stats.goals > 0 && (
                    <span
                      className="text-kcvv-green-bright font-medium"
                      title={`${stats.goals} doelpunten`}
                    >
                      {stats.goals} ⚽
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Arrow indicator */}
          <svg
            className={cn(
              "w-5 h-5 text-[#cacaca] shrink-0",
              "transition-transform duration-200",
              "group-hover:translate-x-1 group-hover:text-kcvv-green-bright",
            )}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </article>
    );
  },
);

PlayerTeaser.displayName = "PlayerTeaser";
