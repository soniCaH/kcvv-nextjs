"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CaretLeft } from "@/lib/icons.redesign";
import { PRESS_DOWN_CLASSES } from "../press-down";
import { trackEvent } from "@/lib/analytics/track-event";

export type UpLinkTone = "ink" | "cream";

export interface UpLinkProps {
  /** The structural parent's route — a fixed per-route fact, never derived
   *  from referrer or history (#2428). */
  href: string;
  /** The bare parent name, e.g. "Nieuws" — never "Terug naar …" (#2428). */
  label: string;
  /**
   * `ink` (default) — the paper chip on a cream/paper surface. `cream` — the
   * tone-swapped chip rendered *inside* a dark-register opening band, where
   * ink is invisible and a cream-on-cream offset shadow would double the
   * edge, so the shadow goes warm instead (#2442 rule 2).
   */
  tone?: UpLinkTone;
  className?: string;
}

// Plain string concatenation, not `cn()` (tailwind-merge): combining the
// `text-label` custom font-size token with a `text-ink` / `text-cream`
// colour in the same twMerge call gets the size silently dropped — twMerge
// files unrecognised size tokens under its text-colour group and keeps only
// the last one (#2769 / [[reference_twmerge_drops_custom_text_tokens]]).
// `<MonoLabel>` sidesteps the same trap the same way.
const TONE_CLASS: Record<UpLinkTone, string> = {
  ink: "border-ink bg-cream text-ink shadow-paper-sm",
  cream:
    "border-cream bg-transparent text-cream shadow-[4px_4px_0_0_var(--color-warm)]",
};

/**
 * `<UpLink>` — the one up-link every detail route renders to its structural
 * parent (#2428/#2442). A bordered paper chip, not a bare text link: it
 * carries its own background (survives on any surface, including the dark
 * register) and reaches a 30px tap target from `border-2` + `py-2` around an
 * 11px `--text-label` line box, with no dependency on the type ramp.
 *
 * Page-rendered at the container's left edge above the opening on 13 routes;
 * rendered *inside* the band (via `tone="cream"`) by `<PageHero
 * register="band" tone="dark">` and `<UltrasHero>` on the 4 dark routes.
 * Always the container's left edge — the chip never adopts the opening's own
 * alignment (`<EventHero>` is centred; the chip still isn't).
 */
export function UpLink({ href, label, tone = "ink", className }: UpLinkProps) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      data-testid="up-link"
      data-tone={tone}
      onClick={() => {
        trackEvent("nav_parent_click", {
          path: pathname ?? "",
          destination: href,
        });
      }}
      className={`text-label inline-flex w-fit items-center gap-1.5 border-2 px-3 py-2 font-mono font-semibold uppercase ${TONE_CLASS[tone]} ${PRESS_DOWN_CLASSES}${className ? ` ${className}` : ""}`}
    >
      <CaretLeft aria-hidden size={12} />
      {label}
    </Link>
  );
}
