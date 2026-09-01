"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * `useFilterParam` — one `[value, setValue]` pair for a single-select filter
 * chip row whose active facet lives in a `?<name>=` URL param, replacing the
 * five hand-rolled "read/write a filter in the URL" implementations found
 * during #2564's review (#2779): `EventsBrowser`, `NewsListingClient`,
 * `HulpFinder` (two facets), `CalendarWidget`, and `SearchInterface` each
 * reinvented their own narrow-or-fallback `isX` type guard, delete-on-default
 * convention, dedup guard, and URL-write plumbing.
 *
 * Two write mechanisms, chosen per route via `writeVia` — never mixed, never
 * guessed:
 *
 * - **`"router"`** (default) drives `next/navigation`'s router and reads the
 *   facet straight from `useSearchParams()` — a pure, stateless derivation
 *   that's already reactive to `router.push`/`replace` AND browser
 *   back/forward with no extra plumbing. Only correct on a route that already
 *   accepts calling `useSearchParams()` for this facet: wrapped in its own
 *   local `<Suspense>` (`/hulp`, `/zoeken`), or `force-dynamic` (`/kalender`,
 *   where it resolves during the per-request server render with no bailout
 *   and no `<Suspense>` needed at all).
 * - **`"history"`** writes via `window.history.pushState` + a `popstate`
 *   listener instead of the router, and reads from local state seeded on
 *   mount (or synchronously from `initialValue`, when the caller's server
 *   page already resolved it from `searchParams`). It never calls
 *   `useSearchParams()` — merely calling that hook, whether or not its value
 *   is read, opts the WHOLE subtree into client-side rendering, throwing away
 *   prerendered HTML for every visitor (#2564 finding 1, and finding 3's
 *   sibling bug: a `router.push` on a dynamic segment re-runs the server and
 *   discards client state). Required on a static/ISR route that must stay
 *   prerendered (`/evenementen`, `/nieuws`).
 *
 * Every write reads the LIVE `window.location.search` (not the mode-specific
 * read source above) to build the next URL, so a facet driven by this hook
 * never clobbers a concurrent, unrelated write to the same URL that this
 * hook's own read source can't see — e.g. `/hulp`'s member panel writes
 * `?member=`/`?holder=` via `history.replaceState`, which `useSearchParams()`
 * never observes.
 *
 * The setter accepts a per-call `{ hash, replace }` override for the one real
 * wrinkle found while designing this hook: `HulpFinder`'s `#<slug>` question
 * deep-link (`reveal()`) needs to write the SAME `?categorie=` param a chip
 * click does, but land on its own question's `#<id>` instead of the section
 * anchor a chip press uses, and via `replace` (a deep-link arrival isn't an
 * action to undo) rather than `push` (every chip press is).
 */

function narrowParam<T extends string>(
  raw: string | null,
  values: readonly T[],
  fallback: T,
): T {
  return raw !== null && (values as readonly string[]).includes(raw)
    ? (raw as T)
    : fallback;
}

function readParam(name: string): string | null {
  return new URLSearchParams(window.location.search).get(name);
}

export interface UseFilterParamOptions<T extends string> {
  /** The value that means "no filter" — deleted from the querystring rather
   *  than round-tripped as an explicit param, and this hook's return value
   *  whenever the param is absent or fails to narrow against `values`. */
  fallback: T;
  /** Pathname this hook reads/writes, e.g. `"/hulp"`. */
  route: string;
  /** Write mechanism — see the module docblock. Defaults to `"router"`. */
  writeVia?: "router" | "history";
  /** Hash appended on every write, unless a call to the setter overrides it. */
  hash?: string;
  /**
   * `"history"` mode only: seeds the initial value synchronously from a prop
   * the caller's server page already resolved from `searchParams` (e.g.
   * `NewsListingClient`'s `initialCategory`), instead of the deferred
   * mount-effect read from `window.location` a page with no such prop
   * (`EventsBrowser`) needs to stay prerenderable.
   */
  initialValue?: T;
}

export type SetFilterParam<T extends string> = (
  next: T,
  overrides?: { hash?: string; replace?: boolean },
) => void;

export function useFilterParam<T extends string>(
  name: string,
  values: readonly T[],
  options: UseFilterParamOptions<T>,
): [T, SetFilterParam<T>] {
  const { fallback, route, writeVia = "router", hash, initialValue } = options;
  const router = useRouter();

  // "history" mode's reactive read: local state, seeded once on mount (or
  // synchronously from `initialValue`) and re-synced on `popstate` — the
  // mechanism `EventsBrowser`/`NewsListingClient` hand-rolled before this
  // hook. Called unconditionally every render (its body no-ops in "router"
  // mode via the `writeVia !== "history"` guards below) so the only hook in
  // this file called conditionally is `useSearchParams()` further down —
  // see its own comment for why.
  const [historyValue, setHistoryValue] = useState<T>(
    () => initialValue ?? fallback,
  );

  useEffect(() => {
    if (writeVia !== "history" || initialValue !== undefined) return;
    // One-time URL deep-link seed, not a sync loop — mirrors EventsBrowser's
    // pre-hook mount effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time URL deep-link seed, not a sync loop
    setHistoryValue(narrowParam(readParam(name), values, fallback));
    // Run once on mount — the initial URL is the only deep-link source.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (writeVia !== "history") return;
    // Browser back/forward — re-reads the URL and updates state WITHOUT
    // writing it again (the browser already moved it).
    const onPopState = () => {
      setHistoryValue(narrowParam(readParam(name), values, fallback));
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [name, values, fallback, writeVia]);

  // "router" mode's read: `useSearchParams()` is already fully reactive to
  // `router.push`/`replace` and browser back/forward, so it needs none of
  // the state/effect machinery above. It must never run in "history" mode —
  // merely calling it, regardless of whether the result is used, opts the
  // whole subtree into client-side rendering (see the module docblock).
  // `writeVia` is a literal every call site hardcodes once — never a value
  // that changes across a mounted instance's renders — which is the
  // precondition this conditional call relies on.
  // eslint-disable-next-line react-hooks/rules-of-hooks -- `writeVia` is a per-call-site-stable literal, never derived from state/props that change during a component's lifetime; see the module docblock
  const routerRaw = writeVia === "router" ? useSearchParams().get(name) : null;

  const value =
    writeVia === "router"
      ? narrowParam(routerRaw, values, fallback)
      : historyValue;

  const setValue = useCallback<SetFilterParam<T>>(
    (next, overrides) => {
      if (next === value) return; // dedup guard
      const params = new URLSearchParams(window.location.search); // live read — merges concurrent, unrelated writes this hook's own read source can't see
      if (next === fallback) params.delete(name);
      else params.set(name, next);
      const qs = params.toString();
      const finalHash = overrides?.hash ?? hash;
      const path = `${route}${qs ? `?${qs}` : ""}${finalHash ? `#${finalHash}` : ""}`;

      if (writeVia === "router") {
        if (overrides?.replace) router.replace(path, { scroll: false });
        else router.push(path, { scroll: false });
      } else {
        setHistoryValue(next);
        // Passing the current `window.history.state` (not `{}`) keeps
        // Next's internal `__NA` marker, so its own patched push/replaceState
        // still treats this as an internal write rather than a fresh
        // navigation to re-process.
        window.history.pushState(window.history.state, "", path);
      }
    },
    [value, fallback, name, route, hash, writeVia, router],
  );

  return [value, setValue];
}
