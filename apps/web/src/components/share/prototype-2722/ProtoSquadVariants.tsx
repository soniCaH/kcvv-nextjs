"use client";

/**
 * PROTOTYPE — #2722. Throwaway. Do not promote to production.
 *
 * Question: how should the KCVV squad (`A` / `B` / `U15`) read to an Instagram
 * follower scrolling at thumbnail size? The #2700 badge is correct and lands in
 * every export, but the club's own operator generated an Aftrap render and did
 * not notice it — so a follower at 1/8 scale certainly will not.
 *
 * Four options mounted on the live `/share` route behind `?variant=`:
 *
 *   off — production today: 76px mono mark, top-right corner. The baseline.
 *   A   — corner flash: same slot, ~2.4x the mark, bled off the canvas edge so
 *         it reads as a SHAPE at thumbnail size rather than as a letter.
 *   B   — squad band: full-bleed horizontal rule under the top bar carrying the
 *         full label (`B-PLOEG`). New chrome, strongest horizontal in the layout.
 *   C   — name-integrated: no chrome at all; the squad rides the club name in
 *         the biggest type on the canvas (`KCVV Elewijt B`). This is where the
 *         operator's instinct went unprompted.
 *
 * Judge at THUMBNAIL scale, not at 1080x1920. Every variant looks fine full-size —
 * that is exactly how the current one shipped.
 */

import React, { createContext, useContext } from "react";
import { MONO_FONT } from "../constants";
import type { SharePalette } from "../shared/theme";

export const PROTO_VARIANTS = ["off", "A", "B", "C"] as const;
export type ProtoVariant = (typeof PROTO_VARIANTS)[number];

export const PROTO_VARIANT_NAMES: Record<ProtoVariant, string> = {
  off: "Production today (corner mark)",
  A: "Corner flash (bled off the edge)",
  B: "Squad band (full-bleed rule)",
  C: "Name-integrated (KCVV Elewijt B)",
};

export function isProtoVariant(value: string | null): value is ProtoVariant {
  return (PROTO_VARIANTS as readonly string[]).includes(value ?? "");
}

/**
 * Defaults to `"off"` so Storybook, the unit tests and any render that is not
 * the `/share` page keep the production treatment untouched.
 */
export const ProtoVariantContext = createContext<ProtoVariant>("off");

export function useProtoVariant(): ProtoVariant {
  return useContext(ProtoVariantContext);
}

/**
 * `ShareBadgeContext` carries the short form (`"A"`, `"B"`, `"U15"`). The band
 * has room for the long one. Prototype-grade two-case expansion — the real
 * implementation should carry both forms rather than re-deriving one.
 */
function fullSquadLabel(badge: string): string {
  if (badge === "A") return "A-PLOEG";
  if (badge === "B") return "B-PLOEG";
  return badge.toUpperCase();
}

/** Production today: the #2700 mark, unchanged. Baseline for the comparison. */
function ProductionMark({
  badge,
  palette,
}: {
  badge: string;
  palette: SharePalette;
}) {
  return (
    <span
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "76px",
        padding: "0 30px",
        fontFamily: MONO_FONT,
        fontSize: "46px",
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
        background: palette.badgeBg,
        color: palette.badgeText,
      }}
    >
      {badge}
    </span>
  );
}

/**
 * Variant A — corner flash. Bleeds through `ShareFrame`'s 64/80 padding to the
 * canvas edge, so the silhouette survives downscaling even when the glyph does
 * not. Negative margins rather than absolute positioning, so it stays inside the
 * existing flex row and cannot overlap the crest.
 */
function CornerFlash({
  badge,
  palette,
}: {
  badge: string;
  palette: SharePalette;
}) {
  return (
    <span
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: "180px",
        height: "180px",
        padding: "0 40px",
        marginTop: "-64px",
        marginRight: "-80px",
        fontFamily: MONO_FONT,
        fontSize: "112px",
        fontWeight: 700,
        letterSpacing: "0.02em",
        lineHeight: 1,
        textTransform: "uppercase",
        whiteSpace: "nowrap",
        background: palette.badgeBg,
        color: palette.badgeText,
      }}
    >
      {badge}
    </span>
  );
}

/**
 * The top-bar slot, opposite the crest. Renders nothing for the variants that
 * express the squad somewhere else (B in a band, C in the name).
 */
export function ProtoSquadMark({
  badge,
  palette,
}: {
  badge: string | undefined;
  palette: SharePalette;
}) {
  const variant = useProtoVariant();
  if (!badge) return null;
  if (variant === "A") return <CornerFlash badge={badge} palette={palette} />;
  if (variant === "B" || variant === "C") return null;
  return <ProductionMark badge={badge} palette={palette} />;
}

/**
 * Variant B — full-bleed band under the top bar. Rendered as a sibling of the
 * top row (`ShareTop` returns a fragment), so it spans the whole canvas width
 * through the content column's horizontal padding.
 */
export function ProtoSquadBand({
  badge,
  palette,
}: {
  badge: string | undefined;
  palette: SharePalette;
}) {
  const variant = useProtoVariant();
  if (variant !== "B" || !badge) return null;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        height: "104px",
        marginTop: "32px",
        marginLeft: "-80px",
        marginRight: "-80px",
        background: palette.badgeBg,
        color: palette.badgeText,
        fontFamily: MONO_FONT,
        fontSize: "56px",
        fontWeight: 700,
        letterSpacing: "0.22em",
        // Optical centring: the trailing letter-space pushes the text left.
        textIndent: "0.22em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}
    >
      {fullSquadLabel(badge)}
    </div>
  );
}

/**
 * Variant C — fold the squad into the club name, in the biggest type on the
 * canvas. Matches on the club name because `ShareName` does not know which side
 * is KCVV; the real implementation would be told, not sniff the string.
 *
 * Returns `children` untouched for every other variant, so the auto-fit
 * measurement upstream stays correct.
 */
export function useProtoSquadName(
  children: React.ReactNode,
  badge: string | undefined,
): React.ReactNode {
  const variant = useProtoVariant();
  if (variant !== "C" || !badge) return children;
  if (typeof children !== "string") return children;
  if (!/kcvv/i.test(children)) return children;
  return `${children} ${badge}`;
}
