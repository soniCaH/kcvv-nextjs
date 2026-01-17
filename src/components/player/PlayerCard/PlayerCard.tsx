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
 * Matches the Gatsby SCSS textShadow function
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
            "relative overflow-hidden flex flex-col justify-between",
            "w-full no-underline",
            isCompact
              ? "h-[220px] pb-[17px] pl-[15px]"
              : "h-[285px] lg:h-[446px] pb-[17px] pl-[15px] lg:px-[15px]",
            "lg:max-w-[340px]",
          )}
          title={`${position} - ${fullName}`}
          aria-label={`Bekijk profiel van ${fullName}, ${position}${number ? `, nummer ${number}` : ""}`}
        >
          {/* Bottom gradient overlay (30% height from bottom) - z-index 10 */}
          <div
            className="absolute bottom-0 left-0 w-full h-[30%] pointer-events-none"
            style={{
              zIndex: 10,
              background: "linear-gradient(0deg, #4acf52 10%, transparent 80%)",
            }}
            aria-hidden="true"
          />

          {/* Background (gray area behind player) - z-index -10 */}
          <div
            className={cn(
              "absolute right-0 bottom-0 left-0 -z-10 bg-[#edeff4]",
              isCompact ? "top-[40px]" : "top-[54px] lg:top-[90px]",
            )}
            aria-hidden="true"
          />

          {/* Player image - positioned absolutely */}
          <div className="absolute inset-0">
            <div
              className={cn(
                "absolute bottom-0 right-[-34px] ml-[10px]",
                "w-full h-full",
                isCompact
                  ? "max-w-[180px]"
                  : "max-w-[232px] lg:left-[74px] lg:max-w-[299px] lg:h-[calc(100%-15px)]",
                "transition-all duration-300 ease-out",
                "lg:group-hover:-translate-x-[50px] lg:group-hover:-translate-y-[10px]",
              )}
              style={{ zIndex: 0 }}
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

          {/* Jersey number - large decorative text with 3D shadow */}
          {number && (
            <span
              className={cn(
                "block max-w-[10px] transition-all duration-300 ease-out",
                "leading-[0.71] tracking-[-6px]",
                isCompact
                  ? "mt-2 text-[8rem]"
                  : "mt-[10px] text-[11.25rem] lg:mt-[5px] lg:text-[14rem]",
                "lg:group-hover:text-[25rem]",
              )}
              style={{
                fontFamily:
                  "stenciletta, -apple-system, system-ui, BlinkMacSystemFont, sans-serif",
                textShadow: generateTextShadow(0.25, 8),
                zIndex: -1,
                WebkitTextStroke: "4px #4B9B48",
                WebkitTextFillColor: "white",
                mixBlendMode: "darken",
              }}
              aria-hidden="true"
            >
              {number}
            </span>
          )}

          {/* Spacer when no number */}
          {!number && <div className="flex-1" />}

          {/* Name section - must be above gradient with z-index 10 */}
          <div className="font-normal text-white" style={{ zIndex: 10 }}>
            {/* Captain badge */}
            {isCaptain && (
              <span
                className={cn(
                  "inline-flex items-center gap-1 mb-1",
                  "text-xs font-medium uppercase tracking-wide",
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

            {/* First name - semibold (font-weight 600) */}
            <div
              className="text-[2rem] uppercase leading-[0.91] font-semibold"
              style={{
                fontFamily:
                  "quasimoda, acumin-pro, Montserrat, Verdana, sans-serif",
              }}
            >
              {firstName}
            </div>

            {/* Last name - thin (font-weight 100), larger on desktop */}
            <div
              className="text-[2rem] lg:text-[2.25rem] uppercase leading-[0.91] font-thin"
              style={{
                fontFamily:
                  "quasimoda, acumin-pro, Montserrat, Verdana, sans-serif",
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
