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

/**
 * <HtmlTableBlock> — the quiet skin (#2582, reversing the
 * fileattachment-htmltable-locked §5.2 card that #2476 sanctioned undoing).
 *
 * Extracted from `<SanityArticleBody>` so the new `<ArticleBody>` PT
 * serializer (Part C / #1850) can consume the same component. It shares
 * `<StandingsTable>`'s register rather than keeping one of its own — "one
 * table skin, the quiet one" (#2476 rule 1) — mono on cream, `border-b-2`
 * ink under the header, `border-b` paper-edge between rows, no frame: no
 * 2px ink border, no `--shadow-paper-md`, no jersey-deep header band, no
 * zebra, no dotted dividers, no italic-serif first column.
 *
 * **No anchoring.** #2476 rule 3: what varies between an authored table and
 * a *typed* one is not the skin but the anchoring, and anchoring has to
 * know what a column means — an authored table's columns are arbitrary
 * editor content, so this component declares none. The old sticky first
 * column (positional, not declared) is gone with it; `<StandingsTable>` is
 * the one that anchors now.
 *
 * **Column-agnostic styling only.** No selector here reaches into a
 * cell's *content* (no `:first-child` font override, no per-position
 * assumption) — only `table`/`thead`/`tbody`/`th`/`td` structure. That is
 * what "must not assume sanitized content" (#2582) means in practice: an
 * authored `<a>` or `<strong>` that one day survives `sanitizeHtml`
 * (`TABLE_SANITIZE_OPTIONS` below is untouched here — restoring them is
 * #2481's job) renders through this skin exactly as plain text does today,
 * with no rework needed on this end.
 *
 * A `<caption>` (three published tables ship one) renders in the kicker
 * register per #2476 rule 8 — `font-mono`, `text-label`, uppercase,
 * `ink-muted`, left-aligned — rather than the browser-default centred text
 * it gets today.
 *
 * **Scroll arrow — `<ScrollOverlay>`'s "content scrolled past" idiom
 * (#2444, as amended by #2476/#2577).** A table is content you scroll
 * *past*, not a row of tap targets — it never reserves a gutter; the right
 * arrow simply overlays the edge and mounts only on real overflow, with a
 * fade capped at `min(24px, remaining)`. **Right edge only**: with no
 * anchor there is nothing pinning the left edge, but an authored table's
 * natural reading order still starts there, so only the trailing edge
 * needs a cue — see `<ScrollOverlay>`'s own docblock for the shared
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
    <div data-html-table="true" className={cn("my-6", className)}>
      <ScrollOverlay
        role="region"
        ariaLabel="Scrollable table"
        direction="right"
        trackClassName={cn(
          "focus:outline-jersey-deep focus:outline-2 focus:outline-offset-2",
          // Table & cells — StandingsTable's quiet register.
          "[&>table]:w-full [&>table]:border-collapse [&>table]:font-mono [&>table]:text-xs",
          "[&>table>thead>tr]:border-ink [&>table>thead>tr]:border-b-2",
          "[&>table>thead>tr>th]:text-ink-muted [&>table>thead>tr>th]:px-2 [&>table>thead>tr>th]:py-2",
          "[&>table>thead>tr>th]:text-left [&>table>thead>tr>th]:font-normal",
          "[&>table>thead>tr>th]:tracking-wider [&>table>thead>tr>th]:uppercase",
          "[&>table>tbody>tr]:border-b [&>table>tbody>tr]:border-[color:var(--color-paper-edge)]",
          "[&>table>tbody>tr>td]:text-ink [&>table>tbody>tr>td]:px-2 [&>table>tbody>tr>td]:py-2 [&>table>tbody>tr>td]:align-top",
          // Body th (rare — used when an editor uses th as a row header).
          "[&>table>tbody>tr>th]:text-ink-muted [&>table>tbody>tr>th]:px-2 [&>table>tbody>tr>th]:py-2",
          "[&>table>tbody>tr>th]:text-left [&>table>tbody>tr>th]:font-normal [&>table>tbody>tr>th]:uppercase",
          // Caption — kicker register (#2476 rule 8), above and left, not
          // the browser-default centred text.
          "[&>table>caption]:text-label [&>table>caption]:text-ink-muted",
          "[&>table>caption]:mb-2 [&>table>caption]:text-left [&>table>caption]:uppercase",
        )}
        dangerouslySetInnerHTML={{
          __html: sanitizeHtml(trimmed, TABLE_SANITIZE_OPTIONS),
        }}
      />
    </div>
  );
}

export { TABLE_SANITIZE_OPTIONS };
