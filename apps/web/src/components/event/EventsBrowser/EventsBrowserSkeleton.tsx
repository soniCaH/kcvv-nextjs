/**
 * `<EventsBrowser>` loading skeleton — the filter chip row + month-grouped
 * ticket list only (not the page's opening, which renders outside this
 * boundary). Shared by two callers:
 *
 * - `apps/web/src/app/(main)/evenementen/loading.tsx` — the route's
 *   navigation-triggered full-page skeleton.
 * - `apps/web/src/app/(main)/evenementen/page.tsx` — the local `<Suspense>`
 *   fallback around `<EventsBrowser>` (it reads `?type=` via
 *   `useSearchParams`, so on this ISR route it needs a LOCAL boundary or the
 *   whole page bails to client-side rendering — #2564 review finding 1).
 *
 * One skeleton in one place keeps both callers honest against the real
 * `<FilterTabs>` shape: a single-line, non-wrapping `gap-3` row (#2564 —
 * absorbed `EventFilterBar`'s old `flex-wrap` chips), not the wrapping,
 * bespoke-sized row this used to model.
 */
export function EventsBrowserSkeleton() {
  return (
    <div className="flex flex-col gap-8 motion-safe:animate-pulse">
      {/* Filter chip row — single line, matching <FilterTabs>. */}
      <div className="flex gap-3 pb-1.5">
        {["w-16", "w-28", "w-32", "w-28", "w-20"].map((w, i) => (
          <div
            key={i}
            className={`border-cream/40 bg-cream/10 h-9 border-2 ${w}`}
          />
        ))}
      </div>

      {/* Month-grouped ticket list. */}
      <div className="flex flex-col gap-12">
        {Array.from({ length: 2 }).map((_, m) => (
          <section key={m}>
            <div className="bg-cream/25 mb-4 h-9 w-48" />
            <ul className="flex flex-col gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <li
                  key={i}
                  className="border-cream/40 bg-cream/5 flex items-stretch border-2"
                >
                  <div className="border-cream/40 flex w-[72px] shrink-0 flex-col items-center justify-center gap-1 border-r-2 border-dashed py-4">
                    <div className="bg-cream/20 h-6 w-8" />
                    <div className="bg-cream/15 h-2 w-10" />
                  </div>
                  <div className="flex flex-1 flex-col justify-center gap-2 px-4 py-4">
                    <div className="bg-cream/20 h-4 w-1/2" />
                    <div className="bg-cream/15 h-3 w-2/3" />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
