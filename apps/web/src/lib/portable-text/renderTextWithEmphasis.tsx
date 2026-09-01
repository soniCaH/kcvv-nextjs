import type { ReactNode } from "react";
import { HighlighterStroke } from "@/components/design-system/HighlighterStroke";

/**
 * Wraps the first occurrence of `matchText` inside `body` in a
 * `<HighlighterStroke>` — the "no font change" emphasis pass for a quote
 * body. Lives here (not on `<PullQuote>`) because inline emphasis is a
 * Portable Text concern, not a flat string plus an accent prop on a shared
 * presentational component (see `docs/ubiquitous-language.md`) — its one
 * caller, `ArticleBody`'s `pullQuote` block serializer, already knows the
 * phrase to emphasise and already builds node trees.
 *
 * Returns `body` unchanged when `matchText` is omitted or not found — a
 * dev-mode warning fires on a miss so an authored `emphasis` value that no
 * longer matches the body doesn't go silently unnoticed.
 */
export function renderTextWithEmphasis(
  body: string,
  matchText: string | undefined,
): ReactNode {
  if (!matchText) return body;
  const idx = body.indexOf(matchText);
  if (idx < 0) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        `[renderTextWithEmphasis] "${matchText}" not found in quote body`,
      );
    }
    return body;
  }
  const before = body.slice(0, idx);
  const match = body.slice(idx, idx + matchText.length);
  const after = body.slice(idx + matchText.length);
  return (
    <>
      {before}
      <HighlighterStroke>{match}</HighlighterStroke>
      {after}
    </>
  );
}
