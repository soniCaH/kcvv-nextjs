"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { narrowParam, type SetFilterParam } from "./filterParam";

export interface UseRouterFilterParamOptions<T extends string> {
  /** The value that means "no filter" — deleted from the querystring rather
   *  than round-tripped as an explicit param, and this hook's return value
   *  whenever the param is absent or fails to narrow against `values`. */
  fallback: T;
  /** Pathname this hook reads/writes, e.g. `"/hulp"`. */
  route: string;
  /** Hash appended on every write, unless a call to the setter overrides it. */
  hash?: string;
}

/**
 * `useRouterFilterParam` — one `[value, setValue]` pair for a single-select
 * filter chip row whose active facet lives in a `?<name>=` URL param, driven
 * by `next/navigation`'s router (#2779, split from `useFilterParam` per
 * #2783 review finding 2).
 *
 * `value` is a pure, stateless derivation of `useSearchParams()` — already
 * reactive to `router.push`/`replace` and browser back/forward, so this
 * needs no local state, no mount effect, no `popstate` listener. Only
 * correct on a route that already accepts calling `useSearchParams()` for
 * this facet: wrapped in its own local `<Suspense>` (`/hulp`, `/zoeken`), or
 * `force-dynamic` (`/kalender`, where it resolves during the per-request
 * server render with no bailout and no `<Suspense>` needed at all). A
 * static/ISR route that must stay prerendered needs `useHistoryFilterParam`
 * instead — merely calling `useSearchParams()`, whether or not the result is
 * used, opts the whole subtree into client-side rendering.
 *
 * **Single source of truth (#2783 review finding 1).** Both the returned
 * `value` and the setter's live-URL merge read from the SAME
 * `useSearchParams()` call this render — never `window.location.search`,
 * which can disagree with `useSearchParams()` for the entire span of a
 * pending transition (a `router.push` already in flight). Reading a second,
 * independently-timed "what is the URL right now" was what let a rapid
 * second click get silently dropped: the setter's dedup guard compared the
 * new value against a `value` that hadn't caught up yet, decided the click
 * was a no-op, and skipped the write.
 *
 * The setter accepts a per-call `{ hash, replace }` override — the wrinkle
 * that shaped this API: `HulpFinder`'s `#<slug>` deep-link needs to write the
 * same `?categorie=` param a chip click does, but land on its own hash via
 * `replace` instead of `push`.
 */
export function useRouterFilterParam<T extends string>(
  name: string,
  values: readonly T[],
  options: UseRouterFilterParamOptions<T>,
): [T, SetFilterParam<T>] {
  const { fallback, route, hash } = options;
  const router = useRouter();
  const searchParams = useSearchParams();
  const value = narrowParam(searchParams.get(name), values, fallback);

  const setValue = useCallback<SetFilterParam<T>>(
    (next, overrides) => {
      if (next === value) return; // dedup guard
      // Merge base is the SAME `searchParams` this render already read —
      // never a second, independently-timed read (see docblock).
      const params = new URLSearchParams(searchParams.toString());
      if (next === fallback) params.delete(name);
      else params.set(name, next);
      const qs = params.toString();
      const finalHash = overrides?.hash ?? hash;
      const path = `${route}${qs ? `?${qs}` : ""}${finalHash ? `#${finalHash}` : ""}`;

      if (overrides?.replace) router.replace(path, { scroll: false });
      else router.push(path, { scroll: false });
    },
    [value, fallback, name, route, hash, router, searchParams],
  );

  return [value, setValue];
}
