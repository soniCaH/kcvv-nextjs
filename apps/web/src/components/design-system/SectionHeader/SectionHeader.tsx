import { cn } from "@/lib/utils/cn";
import {
  EditorialHeading,
  type EditorialHeadingEmphasis,
  type EditorialHeadingSize,
} from "../EditorialHeading";
import { EditorialLink } from "../EditorialLink";
import { MonoLabelRow, type MonoLabelRowItem } from "../MonoLabelRow";

type SectionHeaderCta = { linkText: string; linkHref: string };

/**
 * Longest `title` the `ruled` treatment (D10/S2,
 * docs/research/decision-sheet.md §8) will centre between hairlines. The
 * evidence heading in
 * docs/design/mockups/research-d-series/d10-section-openers.html
 * ("Negentien ploegen, van U6 tot U21") is 33 characters and reads fine on
 * one line at `display-lg` inside the wide container; this leaves headroom
 * above it while still rejecting anything long enough to wrap. Past this
 * length a centred, ruled heading scans worse than the default ranged-left
 * layout, so `ruled` is silently ignored rather than honoured — see
 * `isRuled` below.
 */
const RULED_TITLE_MAX_LENGTH = 40;

export type SectionHeaderBase = {
  title: string;
  /** Optional uppercase mono kicker rendered above the heading via <MonoLabelRow> */
  kicker?: MonoLabelRowItem[];
  /** Optional italic emphasis pass-through to the underlying <EditorialHeading> */
  emphasis?: EditorialHeadingEmphasis;
  /** Size of the underlying <EditorialHeading>. Default: 'display-lg' */
  size?: EditorialHeadingSize;
  /** "light" = ink on cream (default); "dark" = cream on ink */
  variant?: "light" | "dark";
  /**
   * Ruled treatment (D10/S2): hairlines run out from a centred title,
   * chapter furniture for a long index page. Orthogonal to `variant` —
   * `variant` is the ground colour, `ruled` is this heading-row layout, so
   * either combines with either.
   *
   * Only takes effect while `title` is at most `RULED_TITLE_MAX_LENGTH`
   * characters. A longer heading centred between rules scans worse than
   * the default ranged-left layout, so past that length the component
   * falls back to the default treatment instead of shipping the
   * worse-scanning result (and warns in development so the drift is
   * visible to whoever authored the title). Default: false.
   */
  ruled?: boolean;
  /** Override the rendered heading level. Default: h2 */
  as?: "h1" | "h2" | "h3";
  className?: string;
};

export type SectionHeaderProps = SectionHeaderBase &
  ({ linkText?: never; linkHref?: never } | SectionHeaderCta);

function headingLevelFor(as: SectionHeaderProps["as"]): 1 | 2 | 3 {
  switch (as) {
    case "h1":
      return 1;
    case "h3":
      return 3;
    case "h2":
    case undefined:
      return 2;
    default: {
      // Exhaustiveness check — TypeScript narrows `as` to `never` here, so
      // adding a new tag variant to SectionHeaderProps['as'] without a case
      // becomes a compile-time error.
      const _exhaustive: never = as;
      throw new Error(`headingLevelFor: unhandled value ${_exhaustive}`);
    }
  }
}

/**
 * Section header reworked in Phase 1 to compose <EditorialHeading> +
 * <MonoLabelRow>. Drops the legacy `font-body!` / `font-black!` / `mb-0!` /
 * green-left-border treatment in favour of the redesign editorial vocabulary.
 *
 * All existing call sites continue to work — `kicker`, `emphasis` and
 * `ruled` are additive opt-in props.
 */
export const SectionHeader = ({
  title,
  kicker,
  emphasis,
  size = "display-lg",
  linkText,
  linkHref,
  variant = "light",
  ruled = false,
  as = "h2",
  className,
}: SectionHeaderProps) => {
  const isDark = variant === "dark";
  const isRuled = ruled && title.trim().length <= RULED_TITLE_MAX_LENGTH;

  if (ruled && !isRuled && process.env.NODE_ENV === "development") {
    console.warn(
      `[SectionHeader] ruled treatment ignored — title "${title}" is longer than ${RULED_TITLE_MAX_LENGTH} characters and would scan worse centred between rules. Falling back to the default layout.`,
    );
  }

  // Matches the ground-swap pattern already used for tone/link below —
  // full-opacity, the documented 1px hairline weight (DESIGN.md), drawn the
  // same way <QASectionDivider>'s title variant draws its flanking rules.
  const hairlineClass = isDark ? "bg-cream" : "bg-ink";

  const headingEl = (
    <EditorialHeading
      level={headingLevelFor(as)}
      size={size}
      emphasis={emphasis}
      tone={isDark ? "cream" : "ink"}
    >
      {title}
    </EditorialHeading>
  );

  const ctaEl =
    linkText && linkHref ? (
      <EditorialLink
        href={linkHref}
        variant="cta"
        tone={isDark ? "dark" : "light"}
      >
        {linkText}
      </EditorialLink>
    ) : null;

  return (
    <header
      className={cn(
        "mb-10 flex flex-col gap-3",
        isRuled && "items-center text-center",
        className,
      )}
      data-ruled={isRuled || undefined}
    >
      {kicker && kicker.length > 0 && <MonoLabelRow items={kicker} />}
      {isRuled ? (
        <div className="flex w-full items-center gap-4">
          <span
            aria-hidden="true"
            className={cn("h-px flex-1", hairlineClass)}
          />
          {headingEl}
          <span
            aria-hidden="true"
            className={cn("h-px flex-1", hairlineClass)}
          />
        </div>
      ) : (
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
          {headingEl}
          {ctaEl}
        </div>
      )}
      {isRuled && ctaEl}
    </header>
  );
};
