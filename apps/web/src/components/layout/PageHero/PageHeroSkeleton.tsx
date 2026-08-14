import { cn } from "@/lib/utils/cn";
import {
  PageContainer,
  type PageContainerWidth,
} from "@/components/design-system/PageContainer";
import type { PageHeroRegister, PageHeroTone } from "./PageHero";

/**
 * `<PageHeroSkeleton>` — the shared opening's loading footprint.
 *
 * The register hoisted the opening's geometry out of nine call sites; without
 * this, the loading path kept it. Seven `loading.tsx` files each drew their own
 * version of the same three bars — four different constructions of the kicker →
 * headline gap alone (`mt-2`, `mt-3`, `gap-3`, and `gap-4`), none of which
 * agreed with `<PageHero>`'s real `mt-2` / `mt-4`. A skeleton that disagrees
 * with the thing it stands in for is a layout shift by construction.
 *
 * Bar widths are fixed rather than per-route: a placeholder's job is to hold the
 * footprint, and a route-specific width is a value that drifts for nothing. The
 * band · cream register needs no entry here — its skeletons render the real
 * `<PageHero size="compact">`, which carries no data and so needs no shimmer.
 */

export interface PageHeroSkeletonProps {
  /** Matches the opening being stood in for. */
  register?: PageHeroRegister;
  /** Matches the field the opening sits on — drives the bar fill. */
  tone?: PageHeroTone;
  /** Band · dark only, mirroring `<PageHero>`'s own `width`. */
  width?: PageContainerWidth;
  /** Draw the photo column. Band · dark only. */
  image?: boolean;
  /** Draw the lead bar. */
  lead?: boolean;
  className?: string;
}

/** Bars read as paper on cream and as translucent cream on the dark field. */
const BAR_CLASS: Record<
  PageHeroTone,
  { kicker: string; headline: string; lead: string }
> = {
  cream: {
    kicker: "bg-paper-edge",
    headline: "bg-paper-edge",
    lead: "bg-paper-edge",
  },
  dark: {
    kicker: "bg-cream/20",
    headline: "bg-cream/25",
    lead: "bg-cream/15",
  },
};

/** Kicker → headline → lead, at `<PageHero>`'s own rhythm. */
function OpeningBars({ tone, lead }: { tone: PageHeroTone; lead: boolean }) {
  const bar = BAR_CLASS[tone];
  return (
    <>
      <div className={cn("h-3 w-44", bar.kicker)} />
      <div className={cn("mt-2 h-12 w-2/3 max-w-full", bar.headline)} />
      {lead ? (
        <div className={cn("mt-4 h-5 w-1/2 max-w-full", bar.lead)} />
      ) : null}
    </>
  );
}

export function PageHeroSkeleton({
  register = "band",
  tone = "cream",
  width,
  image = false,
  lead = false,
  className,
}: PageHeroSkeletonProps) {
  if (register === "minimal") {
    return (
      <div
        aria-hidden="true"
        className={cn("mb-10 motion-safe:animate-pulse", className)}
      >
        <OpeningBars tone={tone} lead={lead} />
      </div>
    );
  }

  return (
    <header aria-hidden="true" className={cn("bg-jersey-deep-dark", className)}>
      <PageContainer
        width={width}
        className="grid gap-8 py-14 motion-safe:animate-pulse sm:py-20 md:grid-cols-[1fr_auto] md:items-center"
      >
        <div>
          <OpeningBars tone="dark" lead={lead} />
        </div>
        {image ? (
          <div className="border-ink bg-cream-soft shadow-paper-md aspect-[3/2] w-full border-2 md:w-[24rem]" />
        ) : null}
      </PageContainer>
    </header>
  );
}
