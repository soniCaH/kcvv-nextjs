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
            "relative overflow-hidden bg-gray-200 animate-pulse w-[340px]",
            isCompact ? "h-[220px]" : "h-[285px] lg:h-[446px]",
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
        className={cn("player__teaser group w-[340px]", className)}
        {...props}
      >
        <Link
          href={href}
          className={cn(
            "relative block overflow-hidden isolate w-full",
            "no-underline",
            isCompact ? "h-[220px]" : "h-[285px] lg:h-[446px]",
          )}
          title={`${position} - ${fullName}`}
          aria-label={`Bekijk profiel van ${fullName}, ${position}${number ? `, nummer ${number}` : ""}`}
        >
          {/* Gray background area - starts below the number */}
          <div
            className={cn(
              "absolute right-0 bottom-0 left-0 z-0",
              "bg-[#edeff4]",
              isCompact ? "top-[40px]" : "top-[54px] lg:top-[90px]",
            )}
            aria-hidden="true"
          />

          {/* Jersey number - large decorative text behind player */}
          {number && (
            <div
              className={cn(
                "player__teaser__position",
                "absolute z-[1] transition-all duration-300 ease-in-out",
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
                color: "#4B9B48",
                WebkitTextStroke: "4px #4B9B48",
                WebkitTextFillColor: "white",
                textShadow: JERSEY_NUMBER_SHADOW,
                mixBlendMode: "darken",
              }}
              aria-hidden="true"
            >
              {number}
            </div>
          )}

          {/* Player image container */}
          <div className="absolute inset-0 z-[2]">
            <div
              className={cn(
                "absolute bottom-0 right-[-34px] ml-[10px]",
                "w-full h-full",
                isCompact
                  ? "max-w-[180px]"
                  : "max-w-[232px] lg:left-[74px] lg:max-w-[299px] lg:h-[calc(100%-15px)]",
                "transition-all duration-300 ease-in-out",
                "lg:group-hover:-translate-x-[50px] lg:group-hover:-translate-y-[10px]",
              )}
            >
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

          {/* Bottom gradient overlay for name visibility */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[30%] z-[3] pointer-events-none"
            style={{
              background: "linear-gradient(0deg, #4acf52 10%, transparent 80%)",
            }}
            aria-hidden="true"
          />

          {/* Name section - positioned at bottom */}
          <div className="absolute bottom-[17px] left-[15px] right-[15px] z-[4]">
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
              className="text-white text-[2rem] uppercase font-semibold"
              style={{
                fontFamily: "quasimoda, acumin-pro, Montserrat, sans-serif",
                lineHeight: 0.91,
              }}
            >
              {firstName}
            </div>

            {/* Last name - thin */}
            <div
              className="text-white text-[2rem] lg:text-[2.25rem] uppercase font-thin"
              style={{
                fontFamily: "quasimoda, acumin-pro, Montserrat, sans-serif",
                lineHeight: 0.91,
              }}
            >
              {lastName}
            </div>
          </div>
        </Link>
      </article>
    );
  },
);

PlayerCard.displayName = "PlayerCard";
