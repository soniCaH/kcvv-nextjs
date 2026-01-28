/**
 * MatchResult Component
 *
 * Result card for recent results lists with win/draw/loss styling.
 *
 * Features:
 * - Color-coded result indicator (green=win, yellow=draw, red=loss)
 * - Team names and optional logos
 * - Score display
 * - Date
 * - Link to match detail page
 */

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

export interface MatchResultTeam {
  /** Team ID */
  id: number;
  /** Team name */
  name: string;
  /** Team logo URL */
  logo?: string;
}

export interface MatchResultProps {
  /** Home team info */
  homeTeam: MatchResultTeam;
  /** Away team info */
  awayTeam: MatchResultTeam;
  /** Home team score */
  homeScore: number;
  /** Away team score */
  awayScore: number;
  /** Match date (ISO string or YYYY-MM-DD) */
  date: string;
  /** Competition name */
  competition?: string;
  /** KCVV team ID for determining win/loss */
  kcvvTeamId?: number;
  /** Link to match detail page */
  href?: string;
  /** Loading state */
  isLoading?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Format date for display
 */
function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("nl-BE", {
      day: "numeric",
      month: "short",
    });
  } catch {
    return dateStr;
  }
}

/**
 * Determine the result for KCVV: "win", "draw", or "loss"
 */
function getResult(
  homeTeamId: number,
  awayTeamId: number,
  homeScore: number,
  awayScore: number,
  kcvvTeamId?: number,
): "win" | "draw" | "loss" | "neutral" {
  if (!kcvvTeamId) return "neutral";

  const isHome = homeTeamId === kcvvTeamId;
  const isAway = awayTeamId === kcvvTeamId;

  if (!isHome && !isAway) return "neutral";

  const kcvvScore = isHome ? homeScore : awayScore;
  const oppScore = isHome ? awayScore : homeScore;

  if (kcvvScore > oppScore) return "win";
  if (kcvvScore < oppScore) return "loss";
  return "draw";
}

/**
 * Render a result card showing match outcome with color-coded indicator.
 *
 * @param homeTeam - Home team info (id, name, optional logo)
 * @param awayTeam - Away team info (id, name, optional logo)
 * @param homeScore - Home team final score
 * @param awayScore - Away team final score
 * @param date - Match date in ISO or YYYY-MM-DD format
 * @param competition - Optional competition name
 * @param kcvvTeamId - KCVV team ID for win/loss determination
 * @param href - Optional link to match detail page
 * @param isLoading - Show loading skeleton
 * @param className - Additional CSS classes
 * @returns The rendered match result element
 */
export function MatchResult({
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
  date,
  competition,
  kcvvTeamId,
  href,
  isLoading = false,
  className,
}: MatchResultProps) {
  // Loading skeleton
  if (isLoading) {
    return (
      <div
        className={cn(
          "bg-white border border-gray-200 rounded-lg p-3",
          className,
        )}
      >
        <div className="flex items-center gap-3">
          <div className="w-1 h-12 bg-gray-200 rounded animate-pulse" />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-6 w-12 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  const result = getResult(
    homeTeam.id,
    awayTeam.id,
    homeScore,
    awayScore,
    kcvvTeamId,
  );

  const resultColors = {
    win: "bg-green-500",
    draw: "bg-yellow-500",
    loss: "bg-red-500",
    neutral: "bg-gray-300",
  };

  const content = (
    <div className="flex items-center gap-3">
      {/* Result indicator bar */}
      <div
        className={cn("w-1 self-stretch rounded-full", resultColors[result])}
        aria-hidden="true"
      />

      <div className="flex-1 min-w-0">
        {/* Teams and score row */}
        <div className="flex items-center justify-between gap-2">
          {/* Home team */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {homeTeam.logo ? (
              <Image
                src={homeTeam.logo}
                alt={`${homeTeam.name} logo`}
                width={24}
                height={24}
                className="object-contain flex-shrink-0"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                <span className="text-xs text-gray-500">
                  {homeTeam.name.charAt(0)}
                </span>
              </div>
            )}
            <span
              className={cn(
                "truncate text-sm",
                homeTeam.id === kcvvTeamId
                  ? "font-semibold text-gray-900"
                  : "text-gray-700",
              )}
            >
              {homeTeam.name}
            </span>
          </div>

          {/* Score */}
          <div className="flex items-center gap-1.5 font-mono font-bold text-base flex-shrink-0">
            <span
              className={cn(
                homeTeam.id === kcvvTeamId &&
                  result === "win" &&
                  "text-green-600",
              )}
            >
              {homeScore}
            </span>
            <span className="text-gray-400">-</span>
            <span
              className={cn(
                awayTeam.id === kcvvTeamId &&
                  result === "win" &&
                  "text-green-600",
              )}
            >
              {awayScore}
            </span>
          </div>

          {/* Away team */}
          <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
            <span
              className={cn(
                "truncate text-sm text-right",
                awayTeam.id === kcvvTeamId
                  ? "font-semibold text-gray-900"
                  : "text-gray-700",
              )}
            >
              {awayTeam.name}
            </span>
            {awayTeam.logo ? (
              <Image
                src={awayTeam.logo}
                alt={`${awayTeam.name} logo`}
                width={24}
                height={24}
                className="object-contain flex-shrink-0"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                <span className="text-xs text-gray-500">
                  {awayTeam.name.charAt(0)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Date and competition row */}
        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
          <span>{formatDate(date)}</span>
          {competition && (
            <>
              <span>•</span>
              <span>{competition}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );

  const containerClasses = cn(
    "block bg-white border border-gray-200 rounded-lg p-3 transition-shadow hover:shadow-md",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={containerClasses}>
        {content}
      </Link>
    );
  }

  return <div className={containerClasses}>{content}</div>;
}
