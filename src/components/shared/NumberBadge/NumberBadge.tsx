/**
 * NumberBadge Component
 *
 * 3D decorative badge displaying numbers or short text codes.
 * Used for jersey numbers (PlayerCard), role codes (staff), and age groups (TeamCard).
 *
 * Features:
 * - 3D text-shadow effect with layered shadows
 * - Stenciletta font for numbers (stencil look)
 * - Color variants: green (players), navy (staff), blue (youth)
 * - Size variants for different card contexts
 * - Hover scale animation
 */

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";
import { BADGE_SHADOWS } from "@/lib/utils/text-shadow";
import {
  CARD_COLORS,
  type BadgeColor,
  type BadgeSize,
} from "@/lib/utils/card-tokens";

export interface NumberBadgeProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> {
  /** Value to display (number or short text like "T1", "U15") */
  value: string | number;
  /** Color variant */
  color?: BadgeColor;
  /** Size variant */
  size?: BadgeSize;
  /** Enable hover animation */
  animated?: boolean;
}

export const NumberBadge = forwardRef<HTMLDivElement, NumberBadgeProps>(
  (
    {
      value,
      color = "green",
      size = "lg",
      animated = true,
      className,
      ...props
    },
    ref,
  ) => {
    const badgeColor = CARD_COLORS.badge[color];
    const textShadow = BADGE_SHADOWS[color][size];

    // Determine if value is short text (like role codes) vs number
    const isText = typeof value === "string" && isNaN(Number(value));

    return (
      <div
        ref={ref}
        className={cn(
          "number-badge",
          "absolute z-[5] pointer-events-none",
          "transition-all duration-300 ease-in-out",
          animated && "group-hover:scale-110 group-hover:origin-top-left",
          // Size-specific positioning and font size
          size === "sm" && [
            "top-[8px] left-[12px]",
            "text-[5rem] lg:text-[7rem]",
          ],
          size === "md" && [
            "top-[10px] left-[12px]",
            "text-[7rem] lg:text-[9rem]",
          ],
          size === "lg" && [
            "top-[10px] left-[15px]",
            "text-[8rem] lg:top-[5px] lg:text-[11.25rem] xl:text-[14rem]",
          ],
          className,
        )}
        style={{
          maxWidth: "10px",
          fontFamily: isText ? "inherit" : "stenciletta, sans-serif",
          lineHeight: 0.71,
          letterSpacing: isText ? "-4px" : "-6px",
          color: badgeColor,
          WebkitTextStroke: `${isText ? "3px" : "4px"} ${badgeColor}`,
          WebkitTextFillColor: "white",
          textShadow,
        }}
        aria-hidden="true"
        {...props}
      >
        {value}
      </div>
    );
  },
);

NumberBadge.displayName = "NumberBadge";
