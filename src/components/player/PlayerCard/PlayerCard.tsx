/**
 * PlayerCard Component
 *
 * Visual player card for team rosters and player listings.
 * Features the distinctive KCVV green gradient, position indicator,
 * and player photo with hover effects.
 *
 * Design based on Gatsby PlayerTeaser with improvements:
 * - Better responsive behavior
 * - Skeleton loading state
 * - Enhanced accessibility with ARIA labels
 * - Consistent with KCVV design system
 */

import { forwardRef, type HTMLAttributes } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";

/** Position code to display text mapping */
const positionCodes: Record<string, string> = {
  Keeper: "K",
  Verdediger: "V",
  Middenvelder: "M",
  Aanvaller: "A",
  k: "K",
  d: "V",
  m: "M",
  a: "A",
};

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

/**
 * Player card component for team rosters
 *
 * Features:
 * - Green gradient overlay at bottom
 * - Large decorative position letter
 * - Player photo with hover shift (desktop)
 * - First/Last name typography
 * - Captain badge support
 * - Loading skeleton state
 */
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
    const positionCode = positionCodes[position] || position?.charAt(0) || "?";
    const fullName = `${firstName} ${lastName}`.trim();
    const isCompact = variant === "compact";

    // Loading skeleton
    if (isLoading) {
      return (
        <div
          className={cn(
            "relative overflow-hidden rounded-lg bg-gray-200 animate-pulse",
            isCompact ? "h-[220px]" : "h-[285px] lg:h-[380px]",
            "w-full max-w-[340px]",
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

    return (
      <article
        ref={ref}
        className={cn(
          "relative group",
          "w-full",
          isCompact ? "max-w-[200px]" : "max-w-[340px]",
          className,
        )}
        {...props}
      >
        <Link
          href={href}
          className={cn(
            "relative overflow-hidden flex flex-col justify-end",
            "w-full text-decoration-none",
            isCompact ? "h-[220px] p-3" : "h-[285px] lg:h-[380px] p-4 lg:p-5",
            "rounded-lg",
          )}
          title={`${position} - ${fullName}`}
          aria-label={`Bekijk profiel van ${fullName}, ${position}${number ? `, nummer ${number}` : ""}`}
        >
          {/* Background gradient layer */}
          <div
            className={cn(
              "absolute inset-0 z-0",
              "bg-gradient-to-t from-kcvv-green-bright via-kcvv-green-bright/30 to-transparent",
              "from-0% via-30% to-60%",
            )}
            aria-hidden="true"
          />

          {/* Background pattern/texture */}
          <div
            className="absolute inset-x-0 top-12 lg:top-20 bottom-0 -z-10 bg-foundation-gray-light"
            aria-hidden="true"
          />

          {/* Player image */}
          <div
            className={cn(
              "absolute inset-0 z-0",
              "transition-transform duration-300 ease-out",
              "lg:group-hover:-translate-x-3 lg:group-hover:-translate-y-2",
            )}
          >
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={fullName}
                fill
                className="object-cover object-top"
                sizes={isCompact ? "200px" : "(max-width: 960px) 50vw, 340px"}
              />
            ) : (
              // Placeholder silhouette
              <div className="absolute inset-0 flex items-center justify-center bg-foundation-gray-light">
                <svg
                  className="w-1/2 h-1/2 text-foundation-gray"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
            )}
          </div>

          {/* Jersey number - large decorative text (matching live site design) */}
          {number && (
            <span
              className={cn(
                "absolute z-0 font-bold select-none pointer-events-none",
                "text-white/85",
                "transition-all duration-300 ease-out",
                isCompact
                  ? "right-0 top-1/4 -translate-y-1/2 text-[7rem] leading-none"
                  : "right-0 top-1/3 -translate-y-1/2 text-[10rem] lg:text-[15rem] leading-[0.85]",
              )}
              style={{
                fontFamily: "var(--font-family-alt)",
                // Multi-layered 3D shadow effect like the live site
                textShadow: `
                -1px 1px 0 var(--color-kcvv-green-dark),
                -2px 2px 0 var(--color-kcvv-green-dark),
                -3px 3px 0 var(--color-kcvv-green-dark),
                -4px 4px 0 var(--color-kcvv-green-dark),
                -5px 5px 0 var(--color-kcvv-green-dark),
                -6px 6px 0 var(--color-kcvv-green-dark),
                -7px 7px 0 var(--color-kcvv-green-dark),
                -8px 8px 0 var(--color-kcvv-green-dark)
              `,
              }}
              aria-hidden="true"
            >
              {number}
            </span>
          )}

          {/* Position badge - top left */}
          <div
            className={cn(
              "absolute z-10 font-bold uppercase",
              "bg-kcvv-green-dark text-white",
              "flex items-center justify-center",
              isCompact
                ? "top-2 left-2 px-2 py-1 text-xs rounded"
                : "top-3 left-3 px-3 py-1.5 text-sm lg:text-base rounded-md",
            )}
            style={{ fontFamily: "var(--font-family-alt)" }}
            aria-label={position}
          >
            {positionCode}
          </div>

          {/* Name section */}
          <div className="relative z-10 text-white">
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

            {/* First name */}
            <div
              className={cn(
                "font-semibold uppercase leading-tight truncate",
                isCompact ? "text-lg" : "text-xl lg:text-2xl",
              )}
              style={{ fontFamily: "var(--font-family-title)" }}
            >
              {firstName}
            </div>

            {/* Last name */}
            <div
              className={cn(
                "font-light uppercase leading-tight truncate",
                isCompact ? "text-lg" : "text-xl lg:text-2xl",
              )}
              style={{ fontFamily: "var(--font-family-title)" }}
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
