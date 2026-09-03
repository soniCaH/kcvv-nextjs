"use client";

import sanitizeHtml from "sanitize-html";
import { cn } from "@/lib/utils/cn";
import { ScrollOverlay } from "@/components/design-system/ScrollHint/ScrollOverlay";

const TABLE_SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "table",
    "thead",
    "tbody",
    "tfoot",
    "tr",
    "th",
    "td",
    "caption",
    "colgroup",
    "col",
  ],
  allowedAttributes: {
    "*": ["colspan", "rowspan", "scope"],
  },
};

export interface HtmlTableBlockProps {
  /** Raw HTML — sanitized through `TABLE_SANITIZE_OPTIONS` before render. */
  html: string;
  className?: string;
}

// Sticky first column, applied only once there is a right edge to anchor
// against (`<ScrollOverlay>`'s `scrollableRightClassName` — reacts to
// `canScrollRight` without this component needing the boolean itself).
const STICKY_FIRST_COLUMN_CLASSES = [
  "[&>table>tbody>tr>td:first-child]:sticky [&>table>tbody>tr>td:first-child]:left-0 [&>table>tbody>tr>td:first-child]:z-10",
  "[&>table>tbody>tr:nth-child(odd)>td:first-child]:bg-cream",
  "[&>table>tbody>tr:nth-child(even)>td:first-child]:bg-[rgba(232,224,200,0.7)]",
  "[&>table>thead>tr>th:first-child]:sticky [&>table>thead>tr>th:first-child]:left-0 [&>table>thead>tr>th:first-child]:z-20",
  "[&>table>thead>tr>th:first-child]:bg-jersey-deep",
  "[&>table>tbody>tr>td:first-child]:shadow-[2px_0_4px_-1px_rgba(0,0,0,0.12)]",
  "[&>table>thead>tr>th:first-child]:shadow-[2px_0_4px_-1px_rgba(0,0,0,0.12)]",
].join(" ");

/**
 * <HtmlTableBlock> — Phase 5 restyle (fileattachment-htmltable-locked §5.2).
 *
 * Extracted from `<SanityArticleBody>` so the new `<ArticleBody>` PT
 * serializer (Part C / #1850) can consume the same component. Visual
 * vocabulary:
 *
 * - Card wrapper: 1px ink border + 4px offset shadow on cream, no tape.
 * - Header band: jersey-deep background with cream mono caps text.
 * - Body cells: monospace 13px; first column overrides to italic Freight.
 * - Dotted ink-muted dividers between rows and columns.
 * - Even rows: 2.5% ink-tint zebra.
 * - Horizontal scroll + sticky first column preserved verbatim from the
 *   legacy renderer. **Not** touched by this ticket (#2577) — the sticky
 *   column's target (today: literally the first column) and the rest of
 *   the "one quiet table skin" rework are #2476's own full scope; #2577
 *   owns only #2476's arrow/fade amendment.
 *
 * **Scroll arrow — `<ScrollOverlay>`'s "content scrolled past" idiom
 * (#2444, as amended by #2476).** A table is content you scroll *past*,
 * not a row of tap targets — unlike `<FilterTabs>`, it never reserves a
 * gutter; the right arrow simply overlays the edge and mounts only on
 * real overflow, with a fade capped at `min(24px, remaining)` rather than
 * a fixed width (#2476 amendment: a fixed fade over a narrow overflow
 * veiled more column than was actually cut). **Right edge only**, same as
 * before this ticket: the sticky first column (unchanged — see above)
 * keeps the identifying column always in view, so there is nothing to cue
 * on the left, and mounting a left arrow there would overlay that same
 * sticky column — see `<ScrollOverlay>`'s own docblock for the shared
 * contract with `<StandingsTable>` and `<VolledigOrganigram>`'s chart.
 * `dangerouslySetInnerHTML` is passed straight through to `<ScrollOverlay>`
 * rather than as `children`, so the sanitized HTML lands on the same
 * element that carries the scroll ref — the pattern `<ScrollOverlay>`
 * exists specifically to support.
 */
export function HtmlTableBlock({ html, className }: HtmlTableBlockProps) {
  const trimmed = typeof html === "string" ? html.trim() : "";
  if (trimmed.length === 0) return null;

  return (
    <div
      data-html-table="true"
      className={cn(
        "border-ink bg-cream shadow-paper-md my-6 border-2",
        className,
      )}
    >
      <ScrollOverlay
        role="region"
        ariaLabel="Scrollable table"
        direction="right"
        scrollableRightClassName={STICKY_FIRST_COLUMN_CLASSES}
        trackClassName={cn(
          "focus:outline-jersey-deep focus:outline-2 focus:outline-offset-2",
          // Table & cells — base typography + jersey-deep header band.
          "[&>table]:w-full [&>table]:border-collapse [&>table]:text-sm",
          "[&>table>thead]:bg-jersey-deep",
          "[&>table>thead>tr>th]:text-white",
          "[&>table>thead>tr>th]:font-mono [&>table>thead>tr>th]:text-[10px]",
          "[&>table>thead>tr>th]:font-semibold [&>table>thead>tr>th]:tracking-[0.18em]",
          "[&>table>thead>tr>th]:text-left [&>table>thead>tr>th]:uppercase",
          "[&>table>thead>tr>th]:px-3 [&>table>thead>tr>th]:py-2.5",
          // Header column dividers — dotted cream at 25% opacity per lock.
          "[&>table>thead>tr>th:not(:first-child)]:border-l [&>table>thead>tr>th:not(:first-child)]:border-dotted",
          "[&>table>thead>tr>th:not(:first-child)]:border-cream/30",
          // Body cells — monospace 13px with dotted ink-muted borders.
          "[&>table>tbody>tr>td]:font-mono [&>table>tbody>tr>td]:text-[13px]",
          "[&>table>tbody>tr>td]:px-3 [&>table>tbody>tr>td]:py-2 [&>table>tbody>tr>td]:align-top",
          "[&>table>tbody>tr>td]:text-ink",
          "[&>table>tbody>tr>td]:border-ink-muted [&>table>tbody>tr>td]:border-t [&>table>tbody>tr>td]:border-dotted",
          "[&>table>tbody>tr>td:not(:first-child)]:border-ink-muted [&>table>tbody>tr>td:not(:first-child)]:border-l [&>table>tbody>tr>td:not(:first-child)]:border-dotted",
          // First column — italic Freight Display, breaks the mono rhythm.
          "[&>table>tbody>tr>td:first-child]:font-serif [&>table>tbody>tr>td:first-child]:text-[15px]",
          "[&>table>tbody>tr>td:first-child]:font-semibold [&>table>tbody>tr>td:first-child]:italic",
          // Body th (rare — used when an editor uses th as a row header).
          "[&>table>tbody>tr>th]:font-mono [&>table>tbody>tr>th]:text-[10px]",
          "[&>table>tbody>tr>th]:tracking-[0.16em] [&>table>tbody>tr>th]:uppercase",
          "[&>table>tbody>tr>th]:px-3 [&>table>tbody>tr>th]:py-2 [&>table>tbody>tr>th]:text-left",
          // Subtle zebra — 2.5% ink tint on even rows.
          "[&>table>tbody>tr:nth-child(even)>td]:bg-[rgba(0,0,0,0.025)]",
        )}
        dangerouslySetInnerHTML={{
          __html: sanitizeHtml(trimmed, TABLE_SANITIZE_OPTIONS),
        }}
      />
    </div>
  );
}

export { TABLE_SANITIZE_OPTIONS };
