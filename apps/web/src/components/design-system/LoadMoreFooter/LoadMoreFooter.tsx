import { Button } from "../Button";
import { Spinner } from "../Spinner";

export interface LoadMoreFooterProps {
  /** Label on the load-more button, e.g. `"Meer nieuws laden"`. */
  label: string;
  hasMore: boolean;
  isLoading: boolean;
  /** Message for a failed batch. Absent → no error is showing. */
  error?: string;
  /** Retries the failed batch; also the load-more handler. */
  onLoadMore: () => void;
}

/**
 * The tail of a paginated listing: a failed-batch message with a retry, the
 * in-flight spinner, and the load-more button — exactly one of the three shows
 * at a time.
 *
 * One component rather than one per listing: `/nieuws` and `/galerij` are the
 * two listings on the shared 24 + 12 contract (#2569 / decision #2431), and a
 * hand-copied second footer is how that contract grows a second look.
 */
export function LoadMoreFooter({
  label,
  hasMore,
  isLoading,
  error,
  onLoadMore,
}: LoadMoreFooterProps) {
  if (error) {
    // This is the failed-batch treatment #2470's own copy table calls "Tier 2
    // + action" — but it stays this bespoke `<p>` + text button, NOT a
    // migration to the `<EmptyState tier="slot">` register (#2580 review
    // finding 7): a future reader should not assume this site was moved onto
    // that primitive. The batch failed, but the page around it survives, and
    // the load-more button this replaces is hidden by the if-chain below — so
    // the retry is a substitution, not an addition (#2470 resolution rule 4).
    // `text-alert` is the palette's error token; the previous `text-red-400`
    // was a raw, off-palette Tailwind colour. "Probeer opnieuw" — the locked
    // phrasing (#2433 rule 9's 4-to-2 collapse). `min-h-6` + padding on the
    // retry button meets the 24px WCAG 2.5.8 target minimum — it is the only
    // control in this state, since the load-more button above is unreachable
    // (#2470's own mockup already flagged this exact underlined-text-button
    // site as under-target: docs/design/mockups/2470-client-failure/
    // candidates.html:655-657).
    return (
      <div className="py-4 text-center">
        <p className="text-alert mb-2">{error}</p>
        <button
          type="button"
          className="text-jersey-deep inline-flex min-h-6 items-center px-1 text-sm underline hover:no-underline"
          onClick={onLoadMore}
        >
          Probeer opnieuw
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner variant="compact" label="Laden..." />
      </div>
    );
  }

  if (!hasMore) return null;

  return (
    <div className="flex justify-center pt-2 pb-4">
      <Button variant="secondary" size="md" onClick={onLoadMore}>
        {label}
      </Button>
    </div>
  );
}
