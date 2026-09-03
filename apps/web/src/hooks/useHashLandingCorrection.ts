"use client";

import { useCallback, useEffect, useRef } from "react";

/** How long a hash navigation stays eligible for a corrective re-scroll
 *  after it fires — long enough to absorb a bar resize or a late webfont
 *  swap that lands mid-flight, short enough that a reader who has since
 *  scrolled elsewhere is never snapped back by an unrelated later change. */
const HASH_CORRECTION_WINDOW_MS = 1500;

export interface UseHashLandingCorrectionResult {
  /** Call whenever the caller's own layout might have shifted the target
   *  (e.g. a sticky bar's resize) so a still-armed hash landing gets
   *  re-verified. A no-op outside the armed window. */
  notifyLayoutChange: () => void;
}

/**
 * Corrects a hash navigation's landing spot when something above the target
 * changes size *after* the browser already computed its scroll target —
 * `scrollIntoView`/native fragment navigation compute a target once and
 * never retarget an in-flight or already-settled scroll (#2584 review
 * findings 1 and 4). Two triggers, both scoped to a short "armed" window
 * after a real hash navigation (never indefinitely, so a reader who has
 * since scrolled elsewhere is never snapped back):
 *
 * - **`notifyLayoutChange()`**, called by a consumer that owns geometry of
 *   its own (`useSectionNav`'s sticky bar resizing, e.g. `<HubSearch>`
 *   mounting once the hero scrolls out of view).
 * - **A late webfont swap**, via the `FontFaceSet` `loadingdone` event. The
 *   Freight families load async via Adobe Typekit (`globals.css`'s own
 *   comment on this); a swap reflows whatever text sits above the target,
 *   which can shift it even on a route with no sticky bar at all — measured
 *   on `/jeugd#visie`, which has no section nav to notify a resize in the
 *   first place.
 *
 * `<useSectionNav>` composes this for its own bar-resize case;
 * `<JeugdVisie>` (no bar, no nav) uses it directly for the webfont case.
 */
export function useHashLandingCorrection(
  ids: readonly string[],
): UseHashLandingCorrectionResult {
  const idsKey = ids.join("|");
  const idListRef = useRef<string[]>([]);
  useEffect(() => {
    idListRef.current = idsKey.split("|").filter(Boolean);
  }, [idsKey]);

  // Ref-held (not effect-closure-local) so it survives `notifyLayoutChange`
  // being called from an effect that re-runs independently.
  const armedRef = useRef(false);
  const disarmTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  const arm = useCallback(() => {
    armedRef.current = true;
    clearTimeout(disarmTimerRef.current);
    disarmTimerRef.current = setTimeout(() => {
      armedRef.current = false;
    }, HASH_CORRECTION_WINDOW_MS);
  }, []);

  const correct = useCallback(() => {
    if (!armedRef.current) return;
    const hash = decodeURIComponent(window.location.hash.slice(1));
    if (!hash || !idListRef.current.includes(hash)) return;
    document.getElementById(hash)?.scrollIntoView({ block: "start" });
  }, []);

  // Wired once: a cold load with the hash already in the URL arms and
  // corrects immediately (the browser's own pre-hydration jump already
  // completed, so there is no live animation to fight). A same-page hash
  // change (a click) only *arms* — it must NOT also correct here: the
  // browser's own native fragment navigation is already mid-flight at that
  // exact moment, and a second `scrollIntoView()` racing it is what
  // actually caused a short landing on a route with no resize or font race
  // at all, the first time this was tried unconditionally on every
  // hashchange.
  //
  // `loadingdone` — not `document.fonts.ready` — for the webfont trigger:
  // `ready` can resolve almost immediately for an already-cached fallback
  // face, well before the *real* webfont's own network fetch even starts
  // (measured on `/jeugd#visie`: `fonts.ready` was already "loaded" at
  // t≈0ms, then flipped back to "loading" and only genuinely settled at
  // t≈600ms once Freight itself — loaded async via Adobe Typekit — actually
  // swapped in and reflowed the content above the target). `loadingdone`
  // fires for every such batch, including the one that matters, for as
  // long as this effect stays mounted.
  useEffect(() => {
    if (window.location.hash) arm();
    correct();
    document.fonts?.addEventListener?.("loadingdone", correct);

    const onHashChange = () => arm();
    window.addEventListener("hashchange", onHashChange);
    return () => {
      document.fonts?.removeEventListener?.("loadingdone", correct);
      window.removeEventListener("hashchange", onHashChange);
      clearTimeout(disarmTimerRef.current);
    };
  }, [arm, correct]);

  return { notifyLayoutChange: correct };
}
