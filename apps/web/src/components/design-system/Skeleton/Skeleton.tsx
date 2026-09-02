import { cn } from "@/lib/utils/cn";

export type SkeletonTone = "cream" | "dark";

export interface SkeletonProps {
  /**
   * Which field the placeholder sits on. `"cream"` (default) is the paper
   * register; `"dark"` is the `jersey-deep-dark` full-bleed register.
   */
  tone?: SkeletonTone;
  /** Sizing/position utilities only (`h-4 w-32`, `absolute inset-0`, …). */
  className?: string;
}

/**
 * `<Skeleton>` — the one primitive every loading skeleton composes a shimmer
 * placeholder from (#2432 §5/§6).
 *
 * It owns three things no call site may repeat by hand, because a per-div
 * opt-in is exactly how they went missing — wrong in 13 files (fill) and 13
 * files (the `motion-safe:` gate) of the pre-#2573 audit:
 *
 * - **Fill.** `paper-edge` on cream — the only one of six fills in production
 *   use far enough from the `#f5f1e6` cream field for `animate-pulse`'s 50%
 *   opacity fade to actually register (a `cream-soft` bar landed on a 4-unit
 *   colour shift, invisible). A matching translucent-cream tone for the dark
 *   field.
 * - **The `motion-safe:` gate** on `animate-pulse`, so a shimmer never
 *   animates under `prefers-reduced-motion`.
 * - **`aria-hidden="true"`**, so a bar never gets read by a screen reader —
 *   the loading state's one announcement lives on `<LoadingAnnouncement>`,
 *   never on the bars themselves.
 *
 * `className` supplies sizing and position only — never a fill or animation
 * utility, both already owned here. A card's real chrome (`<TapedCard>`,
 * `border-2 border-ink`, `shadow-paper-*`) stays real; `<Skeleton>` only fills
 * the content slots inside it (#2432 §7).
 */
export function Skeleton({ tone = "cream", className }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "motion-safe:animate-pulse",
        tone === "dark" ? "bg-cream/20" : "bg-paper-edge",
        className,
      )}
    />
  );
}
