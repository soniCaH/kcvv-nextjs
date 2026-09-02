import { cn } from "@/lib/utils/cn";
import {
  PageContainer,
  type PageContainerWidth,
} from "@/components/design-system/PageContainer";
import { TapedCard } from "@/components/design-system/TapedCard";
import { Skeleton } from "@/components/design-system/Skeleton";
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
 * footprint, and a route-specific width is a value that drifts for nothing.
 *
 * `register="band"` · `tone="cream"` composes the real `<TapedCard>` shell
 * (#2432 §7 — a skeleton composes the real container, never re-draws its
 * chrome) with shimmer bars inside, rather than the real `<PageHero>`. Two
 * of its three callers have a data-driven headline (`/club/[slug]`'s CMS
 * title) or must never risk showing another page's real heading while
 * leaking into a sibling segment (`/club`'s index) — #2432 §2 bans a
 * skeleton from ever rendering a real `<h1>` it cannot be sure is correct,
 * so this register renders no heading text at all, static or not.
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

/** Kicker → headline → lead, at `<PageHero>`'s own rhythm. */
function OpeningBars({ tone, lead }: { tone: PageHeroTone; lead: boolean }) {
  return (
    <>
      <Skeleton tone={tone} className="h-3 w-44" />
      <Skeleton tone={tone} className="mt-2 h-12 w-2/3 max-w-full" />
      {lead ? (
        <Skeleton tone={tone} className="mt-4 h-5 w-1/2 max-w-full" />
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
      <div aria-hidden="true" className={cn("mb-10", className)}>
        <OpeningBars tone={tone} lead={lead} />
      </div>
    );
  }

  if (tone === "cream") {
    return (
      <div aria-hidden="true" data-testid="page-hero-skeleton">
        <TapedCard
          bg="cream"
          padding="md"
          tape={{ color: "warm", position: "left", length: "lg" }}
          className={className}
        >
          <OpeningBars tone="cream" lead={lead} />
        </TapedCard>
      </div>
    );
  }

  return (
    <header aria-hidden="true" className={cn("bg-jersey-deep-dark", className)}>
      <PageContainer
        width={width}
        className="grid gap-8 py-14 sm:py-20 md:grid-cols-[1fr_auto] md:items-center"
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
