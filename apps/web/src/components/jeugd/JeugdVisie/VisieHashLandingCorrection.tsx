"use client";

import { useHashLandingCorrection } from "@/hooks/useHashLandingCorrection";

/**
 * Invisible client component that corrects a cold `/jeugd#visie` load — a
 * late webfont swap (Freight loads async via Adobe Typekit) can reflow
 * content above `#visie` after the browser's own pre-hydration jump
 * already landed. A sibling of `<JeugdVisie>` (the `AgendaScrollToNext`
 * pattern), not mounted inside it, so `<JeugdVisie>` itself stays a server
 * component.
 */
export function VisieHashLandingCorrection() {
  useHashLandingCorrection(["visie"]);
  return null;
}
