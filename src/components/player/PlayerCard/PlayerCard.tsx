/**
 * PlayerCard Component
 *
 * Visual player card for team rosters and player listings.
 * Matches the Gatsby PlayerTeaser design exactly.
 *
 * Features:
 * - Large jersey number with 3D shadow effect (stenciletta font)
 * - Green gradient overlay at bottom
 * - Player photo with hover shift effect
 * - First name (semibold) / Last name (thin) typography
 * - Captain badge support
 * - Loading skeleton state
 */

import { forwardRef, type HTMLAttributes } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";

/**
 * Generate text-shadow CSS for the 3D effect
 * Matches the Gatsby SCSS textShadow function exactly
 */
function generateTextShadow(precision: number, size: number): string {
  const shadows: string[] = [];
  let offset = 0;
  const length = Math.floor(size * (1 / precision)) - 1;

  for (let i = 0; i <= length; i++) {
    offset += precision;
    shadows.push(`${-offset}px ${offset}px #4B9B48`);
  }

  return shadows.join(", ");
}

// Pre-calculate the text shadow for performance
const JERSEY_NUMBER_SHADOW = generateTextShadow(0.25, 8);

export interface PlayerCardProps extends Omit<
  HTMLAttributes<HTMLElement>,
  "title"
> {
  /** Player first name */
  firstName: string;
  /** Player last name */
  lastName: string;
  /** Player position (Keeper, Verdediger, Middenvelder, Aanvaller) */
  position: string;
  /** Link to player profile page */
  href: string;
  /** Jersey number */
  number?: number;
  /** Player photo URL */
  imageUrl?: string;
  /** Is team captain */
  isCaptain?: boolean;
  /** Team name/slug for context */
  teamSlug?: string;
  /** Card size variant */
  variant?: "default" | "compact";
  /** Loading state */
  isLoading?: boolean;
}

export const PlayerCard = forwardRef<HTMLElement, PlayerCardProps>(
  (
    {
      firstName,
      lastName,
      position,
      href,
      number,
      imageUrl,
      isCaptain = false,
      variant = "default",
      isLoading = false,
      className,
      ...props
    },
    ref,
  ) => {
    const fullName = `${firstName} ${lastName}`.trim();
    const isCompact = variant === "compact";

    // Loading skeleton
    if (isLoading) {
      return (
        <div
          className={cn(
            "relative overflow-hidden bg-gray-200 animate-pulse",
            isCompact ? "h-[220px]" : "h-[285px] lg:h-[446px]",
            "w-full max-w-[340px]",
            className,
          )}
          aria-label="Laden..."
        >
          <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
            <div className="h-8 bg-gray-300 rounded w-3/4" />
            <div className="h-8 bg-gray-300 rounded w-1/2" />
          </div>
        </div>
      );
    }

    return (
      <article
        ref={ref}
        className={cn("player__teaser group w-full", className)}
        {...props}
      >
        <Link
          href={href}
          className={cn(
            "player__teaser__link",
            "relative block overflow-hidden",
            "w-full no-underline",
            isCompact ? "h-[220px]" : "h-[285px] lg:h-[446px]",
            "lg:max-w-[340px]",
          )}
          title={`${position} - ${fullName}`}
          aria-label={`Bekijk profiel van ${fullName}, ${position}${number ? `, nummer ${number}` : ""}`}
        >
          {/* Gray background area - starts below the number */}
          <div
            className={cn(
              "player__teaser__bg absolute right-0 bottom-0 left-0",
              "bg-[#edeff4]",
              isCompact ? "top-[40px]" : "top-[54px] lg:top-[90px]",
            )}
            style={{ zIndex: -10 }}
            aria-hidden="true"
          />

          {/* Player image container */}
          <div className="player__teaser__image absolute inset-0">
            <div
              className={cn(
                "absolute bottom-0",
                "transition-all duration-300 ease-out",
                "lg:group-hover:-translate-x-[50px] lg:group-hover:-translate-y-[10px]",
              )}
              style={{
                right: "-34px",
                width: "100%",
                maxWidth: isCompact ? "180px" : "232px",
                height: "100%",
                marginLeft: "10px",
                zIndex: 0,
              }}
            >
              {/* Desktop styles applied via media query */}
              <style>{`
                @media screen and (min-width: 960px) {
                  .player__teaser__image > div {
                    left: 74px !important;
                    max-width: 299px !important;
                    height: calc(100% - 15px) !important;
                  }
                }
              `}</style>
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={fullName}
                  fill
                  className="object-cover object-top"
                  sizes={
                    isCompact ? "180px" : "(max-width: 960px) 232px, 299px"
                  }
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    className="w-1/2 h-1/2 text-[#cacaca]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Jersey number - large decorative text behind player */}
          {number && (
            <div
              className={cn(
                "player__teaser__position",
                "absolute transition-all duration-300 ease-out",
                isCompact
                  ? "top-[8px] left-[15px] text-[8rem]"
                  : "top-[10px] left-[15px] text-[11.25rem] lg:top-[5px] lg:text-[14rem]",
                "lg:group-hover:text-[25rem]",
              )}
              style={{
                maxWidth: "10px",
                fontFamily: "stenciletta, sans-serif",
                lineHeight: 0.71,
                letterSpacing: "-6px",
                color: "white",
                WebkitTextStroke: "4px #4B9B48",
                WebkitTextFillColor: "white",
                textShadow: JERSEY_NUMBER_SHADOW,
                mixBlendMode: "darken",
                zIndex: -1,
              }}
              aria-hidden="true"
            >
              {number}
            </div>
          )}

          {/* Bottom gradient overlay for name visibility */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[30%] pointer-events-none"
            style={{
              background: "linear-gradient(0deg, #4acf52 10%, transparent 80%)",
              zIndex: 10,
            }}
            aria-hidden="true"
          />

          {/* Name section - positioned at bottom */}
          <div
            className="player_teaser__name__wrapper absolute bottom-[17px] left-[15px] lg:left-[15px] lg:right-[15px]"
            style={{ zIndex: 10 }}
          >
            {/* Captain badge */}
            {isCaptain && (
              <span
                className={cn(
                  "inline-flex items-center gap-1 mb-1",
                  "text-xs font-medium uppercase tracking-wide text-white",
                  "bg-white/20 backdrop-blur-sm rounded px-2 py-0.5",
                )}
                aria-label="Aanvoerder"
              >
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
                C
              </span>
            )}

            {/* First name - semibold */}
            <div
              className="player_teaser__name--first text-white"
              style={{
                fontFamily: "quasimoda, acumin-pro, Montserrat, sans-serif",
                fontSize: "2rem",
                fontWeight: 600,
                textTransform: "uppercase",
                lineHeight: 0.91,
              }}
            >
              {firstName}
            </div>

            {/* Last name - thin */}
            <div
              className="player_teaser__name--last text-white"
              style={{
                fontFamily: "quasimoda, acumin-pro, Montserrat, sans-serif",
                fontSize: "2rem",
                fontWeight: 100,
                textTransform: "uppercase",
                lineHeight: 0.91,
              }}
            >
              {lastName}
            </div>

            {/* Desktop: larger last name */}
            <style>{`
              @media screen and (min-width: 960px) {
                .player_teaser__name--last {
                  font-size: 2.25rem !important;
                }
              }
            `}</style>
          </div>
        </Link>
      </article>
    );
  },
);

PlayerCard.displayName = "PlayerCard";
