/**
 * TeamCard Component
 *
 * Team teaser card for team listings and overview pages.
 * Used on /jeugd (youth overview) and team listing pages.
 *
 * Features:
 * - Team photo with hover zoom effect
 * - Team name and tagline
 * - Age group badge for youth teams
 * - Coach info display (optional)
 * - Win/Draw/Loss record (optional)
 * - Loading skeleton state
 * - Compact variant for dense layouts
 */

import { forwardRef, type HTMLAttributes, type Ref } from "react";
import Link from "next/link";
import Image from "next/image";
import { Users, Trophy, User } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface TeamCardProps extends Omit<
  HTMLAttributes<HTMLElement>,
  "title"
> {
  /** Team name */
  name: string;
  /** Link to team detail page */
  href: string;
  /** Team photo URL */
  imageUrl?: string;
  /** Team tagline or motto */
  tagline?: string;
  /** Age group for youth teams (e.g., U15, U21) */
  ageGroup?: string;
  /** Type of team for visual styling */
  teamType?: "senior" | "youth" | "club";
  /** Coach information */
  coach?: {
    name: string;
    imageUrl?: string;
  };
  /** Win/Draw/Loss record */
  record?: {
    wins: number;
    draws: number;
    losses: number;
  };
  /** Card size variant */
  variant?: "default" | "compact";
  /** Loading state */
  isLoading?: boolean;
}

export const TeamCard = forwardRef<HTMLElement, TeamCardProps>(
  (
    {
      name,
      href,
      imageUrl,
      tagline,
      ageGroup,
      teamType = "senior",
      coach,
      record,
      variant = "default",
      isLoading = false,
      className,
      ...props
    },
    ref,
  ) => {
    const isCompact = variant === "compact";

    // Loading skeleton
    if (isLoading) {
      return (
        <div
          ref={ref as Ref<HTMLDivElement>}
          className={cn(
            "relative overflow-hidden bg-gray-200 animate-pulse rounded-sm",
            isCompact ? "h-[180px]" : "h-[280px]",
            className,
          )}
          aria-label="Laden..."
        >
          <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
            <div className="h-6 bg-gray-300 rounded w-3/4" />
            <div className="h-4 bg-gray-300 rounded w-1/2" />
          </div>
        </div>
      );
    }

    // Team type badge colors
    const badgeColors = {
      senior: "bg-kcvv-green-bright text-white",
      youth: "bg-blue-500 text-white",
      club: "bg-amber-500 text-white",
    };

    return (
      <article
        ref={ref}
        className={cn("team-card group", className)}
        {...props}
      >
        <Link
          href={href}
          className={cn(
            "relative block overflow-hidden rounded-sm",
            "no-underline text-inherit",
            "bg-white",
            "border border-[#edeff4]",
            "shadow-sm",
            "transition-all duration-300 ease-in-out",
            "hover:shadow-lg hover:-translate-y-1",
          )}
          title={`Bekijk ${name}`}
          aria-label={`Bekijk team ${name}${tagline ? `, ${tagline}` : ""}${ageGroup ? `, leeftijdsgroep ${ageGroup}` : ""}`}
        >
          {/* Image Section */}
          <div
            className={cn(
              "relative overflow-hidden bg-gray-100",
              isCompact ? "h-[100px]" : "h-[160px]",
            )}
          >
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={`Team foto ${name}`}
                fill
                className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
                sizes={isCompact ? "200px" : "(max-width: 768px) 100vw, 400px"}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <Users
                  className={cn(
                    "text-gray-300",
                    isCompact ? "w-12 h-12" : "w-16 h-16",
                  )}
                  aria-hidden="true"
                />
              </div>
            )}

            {/* Age group badge for youth teams */}
            {ageGroup && (
              <div
                className={cn(
                  "absolute top-3 left-3",
                  "px-3 py-1 rounded-sm",
                  "text-sm font-bold uppercase tracking-wide",
                  badgeColors[teamType],
                )}
              >
                {ageGroup}
              </div>
            )}

            {/* Team type indicator for non-youth */}
            {!ageGroup && teamType !== "senior" && (
              <div
                className={cn(
                  "absolute top-3 left-3",
                  "px-3 py-1 rounded-sm",
                  "text-xs font-medium uppercase tracking-wide",
                  badgeColors[teamType],
                )}
              >
                {teamType === "club" ? "Club" : "Senior"}
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className={cn("p-4", isCompact && "p-3")}>
            {/* Team Name */}
            <h3
              className={cn(
                "font-bold text-gray-900 leading-tight",
                isCompact ? "text-base" : "text-lg",
              )}
              style={{
                fontFamily: "quasimoda, acumin-pro, Montserrat, sans-serif",
              }}
            >
              {name}
            </h3>

            {/* Tagline */}
            {tagline && (
              <p
                className={cn(
                  "text-gray-600 mt-1",
                  isCompact ? "text-xs" : "text-sm",
                  "line-clamp-1",
                )}
              >
                {tagline}
              </p>
            )}

            {/* Coach Info */}
            {coach && (
              <div
                className={cn(
                  "flex items-center gap-2 mt-3",
                  "text-gray-600",
                  isCompact ? "text-xs" : "text-sm",
                )}
              >
                {coach.imageUrl ? (
                  <Image
                    src={coach.imageUrl}
                    alt={coach.name}
                    width={24}
                    height={24}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <User className="w-4 h-4" aria-hidden="true" />
                )}
                <span className="truncate">{coach.name}</span>
              </div>
            )}

            {/* Record (W/D/L) */}
            {record && (
              <div
                className={cn(
                  "flex items-center gap-3 mt-3",
                  "text-xs font-medium",
                )}
              >
                <Trophy className="w-4 h-4 text-gray-400" aria-hidden="true" />
                <span className="text-green-600" title="Gewonnen">
                  {record.wins}W
                </span>
                <span className="text-gray-500" title="Gelijk">
                  {record.draws}D
                </span>
                <span className="text-red-500" title="Verloren">
                  {record.losses}L
                </span>
              </div>
            )}
          </div>
        </Link>
      </article>
    );
  },
);

TeamCard.displayName = "TeamCard";
