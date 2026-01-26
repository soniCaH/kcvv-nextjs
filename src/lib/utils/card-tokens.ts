/**
 * Card Design Tokens
 *
 * Shared design tokens for PlayerCard, TeamCard, and staff cards.
 * Ensures visual consistency across all card-type components.
 */

/**
 * Badge color variants
 */
export type BadgeColor = "green" | "navy" | "blue";

/**
 * Badge size variants
 */
export type BadgeSize = "sm" | "md" | "lg";

/**
 * Shared card colors
 */
export const CARD_COLORS = {
  /** Badge colors by variant */
  badge: {
    /** Player jersey numbers - KCVV green */
    green: "#4B9B48",
    /** Staff role codes - navy blue */
    navy: "#1e3a5f",
    /** Youth teams - blue */
    blue: "#3b82f6",
  },
  /** Card background colors */
  background: {
    /** Card container background */
    card: "#ffffff",
    /** Image placeholder background */
    placeholder: "#edeff4",
    /** Placeholder icon color */
    icon: "#cacaca",
  },
  /** Border colors */
  border: {
    /** Default card border */
    default: "#edeff4",
  },
  /** Gradient colors for overlays */
  gradient: {
    /** Player cards - KCVV bright green */
    green: "#4acf52",
    /** Staff cards - navy blue */
    navy: "#1e3a5f",
  },
} as const;

/**
 * Badge size configurations
 */
export const BADGE_SIZES = {
  sm: {
    /** Font size for compact cards */
    fontSize: {
      mobile: "5rem",
      desktop: "7rem",
    },
    /** Top position offset */
    top: {
      mobile: "8px",
      desktop: "5px",
    },
    /** Left position offset */
    left: "12px",
    /** Letter spacing (tighter for multi-char) */
    letterSpacing: "-4px",
    /** Stroke width */
    strokeWidth: "3px",
  },
  md: {
    fontSize: {
      mobile: "7rem",
      desktop: "9rem",
    },
    top: {
      mobile: "10px",
      desktop: "5px",
    },
    left: "12px",
    letterSpacing: "-4px",
    strokeWidth: "3px",
  },
  lg: {
    /** Font size for default cards */
    fontSize: {
      mobile: "8rem",
      desktop: "11.25rem",
      desktopLg: "14rem",
    },
    /** Top position offset */
    top: {
      mobile: "10px",
      desktop: "5px",
    },
    /** Left position offset */
    left: "15px",
    /** Letter spacing (wide for single digits) */
    letterSpacing: "-6px",
    /** Stroke width */
    strokeWidth: "4px",
  },
} as const;

/**
 * Card shadow configurations
 */
export const CARD_SHADOWS = {
  /** Default shadow */
  default: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  /** Hover shadow */
  hover: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
} as const;

/**
 * Card image section heights
 */
export const CARD_HEIGHTS = {
  /** Image section only (unified card design) */
  image: {
    compact: "200px",
    default: "200px",
    desktopLg: "320px",
  },
  /** Full card heights (for loading skeletons) */
  full: {
    compact: "280px",
    default: "340px",
    desktopLg: "480px",
  },
} as const;
