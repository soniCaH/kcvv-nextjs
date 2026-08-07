/** PROTOTYPE — throwaway, issue #2408. Delete before the PR. */

import {
  EditorialHeading,
  LinkButton,
  MonoLabel,
  PageContainer,
  StripedSeam,
} from "@/components/design-system";
import { cn } from "@/lib/utils/cn";
import type { Band } from "./_bands";

export type Rank = 1 | 2 | 3;

/**
 * The weight ladder. This is the whole prototype in one object: rank 1 shouts,
 * rank 3 whispers, and every variant is just a different assignment of bands to
 * these three rows.
 */
const RANK_TREATMENT = {
  1: {
    heading: "display-lg",
    kicker: "md",
    pad: "py-14 md:py-24",
    showKicker: true,
    showBlurb: true,
  },
  2: {
    heading: "display-md",
    kicker: "sm",
    pad: "py-10 md:py-14",
    showKicker: true,
    showBlurb: true,
  },
  3: {
    heading: "display-sm",
    kicker: "sm",
    pad: "py-6 md:py-9",
    showKicker: false,
    showBlurb: false,
  },
} as const;

/** Skeleton fill — deliberately not a photo. Density is the signal, not imagery. */
function Fill({
  className,
  onField,
}: {
  className?: string;
  onField: boolean;
}) {
  return (
    <div
      className={cn(
        "border-2",
        onField ? "border-cream/25 bg-cream/10" : "border-ink/15 bg-ink/[0.06]",
        className,
      )}
    />
  );
}

function BandContent({
  band,
  rank,
  onField,
}: {
  band: Band;
  rank: Rank;
  onField: boolean;
}) {
  const n = band.count ?? 1;

  if (band.kind === "hero") {
    return (
      <Fill
        onField={onField}
        className={rank === 1 ? "h-64 md:h-96" : "h-40"}
      />
    );
  }

  if (band.kind === "cards") {
    // Rank 3 caps the grid — a subordinate band does not get to spend six cards.
    const shown = rank === 3 ? Math.min(n, 3) : n;
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: shown }, (_, i) => (
          <Fill
            key={i}
            onField={onField}
            className={rank === 1 ? "h-52" : rank === 2 ? "h-40" : "h-24"}
          />
        ))}
      </div>
    );
  }

  if (band.kind === "ledger") {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: n }, (_, i) => (
          <Fill
            key={i}
            onField={onField}
            className={rank === 1 ? "h-20" : rank === 2 ? "h-14" : "h-10"}
          />
        ))}
      </div>
    );
  }

  if (band.kind === "logos") {
    return (
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
        {Array.from({ length: n }, (_, i) => (
          <Fill key={i} onField={onField} className="h-14" />
        ))}
      </div>
    );
  }

  if (band.kind === "banner") {
    return (
      <Fill
        onField={onField}
        className={rank === 3 ? "h-16" : "h-28 md:h-36"}
      />
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3.5">
      <LinkButton href="#" variant="primary" withArrow>
        Ontdek meer
      </LinkButton>
      {rank === 1 ? (
        <LinkButton href="#" variant="inverted" withArrow>
          Schrijf je in
        </LinkButton>
      ) : null}
    </div>
  );
}

/**
 * One spine band at a given rank. `onField` paints it as the jersey-deep
 * full-bleed interruption — at most one band per variant gets it, because a
 * second colour field cancels the first.
 */
export function BandBlock({
  band,
  rank,
  onField,
  showOverlay,
}: {
  band: Band;
  rank: Rank;
  onField: boolean;
  showOverlay: boolean;
}) {
  const t = RANK_TREATMENT[rank];

  return (
    <section
      data-band={band.id}
      data-rank={rank}
      className={cn(onField && "bg-jersey-deep text-cream")}
    >
      {onField ? (
        <div className="mb-6">
          <StripedSeam height="xl" colorPair="cream-jersey-deep" />
        </div>
      ) : null}

      <PageContainer width="index" className={t.pad}>
        {showOverlay ? (
          <p className="text-alert m-0 mb-2 font-mono text-[10px] tracking-[0.14em] uppercase">
            rang {rank} · {band.persona}
          </p>
        ) : null}

        {t.showKicker && band.kicker ? (
          <div className="mb-3">
            <MonoLabel size={t.kicker} tone={onField ? "cream" : "ink"}>
              {band.kicker}
            </MonoLabel>
          </div>
        ) : null}

        <EditorialHeading
          level={2}
          size={t.heading}
          tone={onField ? "cream" : "ink"}
          className="mb-5 max-w-3xl"
        >
          {band.heading}
        </EditorialHeading>

        {t.showBlurb && band.blurb ? (
          <p
            className={cn(
              "mb-6 max-w-xl text-base leading-relaxed",
              onField ? "text-cream/90" : "text-ink-muted",
            )}
          >
            {band.blurb}
          </p>
        ) : null}

        <BandContent band={band} rank={rank} onField={onField} />
      </PageContainer>
    </section>
  );
}
