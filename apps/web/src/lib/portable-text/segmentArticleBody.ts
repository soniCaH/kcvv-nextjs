import type { PortableTextBlock } from "@portabletext/react";
import type { TransferFactValue } from "@/components/article/blocks/TransferFact/types";
import type { PortableTextBlockLike } from "./findPullquoteText";

/**
 * Segments `ArticleBody`'s `content` into PT-block runs, consecutive-
 * transferFact groups (5.d-tra adjacency rule), and consecutive-blockquote
 * groups.
 *
 * A quotation is one object (#2515 rule 2), but Portable Text does not
 * merge adjacent same-style blocks — an editor who pressed Enter between
 * paragraphs of ONE quoted statement produces N sibling `blockquote`-style
 * blocks, not one. Left ungrouped, that renders as N stacked taped cards
 * with N quote marks for what reads as a single quotation (measured on
 * production: `2024-03-25-kopzorgen-het-voetbal` carries 5 consecutive
 * blockquote blocks that are one continuous statement). Consecutive
 * blockquote-style blocks are grouped here into one `blockquote-group`
 * segment, rendered by `ArticleBody`'s `<BlockquoteGroup>` as one
 * `<PullQuote>` card carrying one paragraph per source block.
 *
 * Pure and JSX-free (no rendering) — `ArticleBody.tsx` owns turning these
 * segments into React nodes.
 */
export type ArticleBodySegment =
  | { kind: "pt"; key: string; blocks: PortableTextBlock[] }
  | { kind: "transfer-facts"; key: string; facts: TransferFactValue[] }
  | { kind: "blockquote-group"; key: string; blocks: PortableTextBlock[] };

function isBlockquoteStyleBlock(block: PortableTextBlock): boolean {
  return (
    block._type === "block" &&
    (block as PortableTextBlockLike).style === "blockquote"
  );
}

type OpenSegment =
  | { kind: "pt"; items: PortableTextBlock[] }
  | { kind: "transfer-facts"; items: TransferFactValue[] }
  | { kind: "blockquote-group"; items: PortableTextBlock[] };

type Classified =
  | { kind: "pt"; item: PortableTextBlock }
  | { kind: "transfer-facts"; item: TransferFactValue }
  | { kind: "blockquote-group"; item: PortableTextBlock };

function classify(block: PortableTextBlock): Classified | null {
  if (block._type === "transferFact") {
    const fact = block as TransferFactValue;
    // Undropped playerName-less transferFact blocks are legitimately
    // absent from segmentation — `ArticleBody` never renders them.
    return fact.playerName?.trim()
      ? { kind: "transfer-facts", item: fact }
      : null;
  }
  if (isBlockquoteStyleBlock(block)) {
    return { kind: "blockquote-group", item: block };
  }
  return { kind: "pt", item: block };
}

/**
 * At most one buffer is ever open at a time, so one `open` slot (rather
 * than one buffer per segment kind) is enough — a segment kind change
 * flushes whatever was open and starts a fresh one of the new kind. Adding
 * a fourth segment kind means adding one `classify` branch, not touching
 * every existing branch to remember to flush the others.
 */
export function segmentArticleBody(
  blocks: PortableTextBlock[],
): ArticleBodySegment[] {
  const segments: ArticleBodySegment[] = [];
  let open: OpenSegment | null = null;
  let idx = 0;

  const flush = () => {
    if (!open || open.items.length === 0) return;
    if (open.kind === "pt") {
      segments.push({ kind: "pt", key: `pt-${idx++}`, blocks: open.items });
    } else if (open.kind === "transfer-facts") {
      segments.push({
        kind: "transfer-facts",
        key: `tf-${idx++}`,
        facts: open.items,
      });
    } else {
      segments.push({
        kind: "blockquote-group",
        key: `bq-${idx++}`,
        blocks: open.items,
      });
    }
  };

  for (const block of blocks) {
    const next = classify(block);
    if (!next) continue;
    if (open?.kind !== next.kind) {
      flush();
      open = { kind: next.kind, items: [] } as OpenSegment;
    }
    // Safe: the check above guarantees `open.kind === next.kind` on entry
    // to this line (either it already matched, or a fresh same-kind buffer
    // was just opened) — `next.item`'s type therefore always matches
    // `open.items`'s element type. TS can't correlate that across two
    // separately-discriminated unions, hence the one assertion.
    (open.items as (PortableTextBlock | TransferFactValue)[]).push(next.item);
  }
  flush();

  return segments;
}
