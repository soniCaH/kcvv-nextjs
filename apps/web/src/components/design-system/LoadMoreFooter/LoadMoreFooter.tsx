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
    // Tier 2 + action (#2470/#2580): the batch failed, but the page around it
    // survives, and the load-more button this replaces is hidden by the
    // if-chain below — so the retry is a substitution, not an addition
    // (#2470 resolution rule 4). `text-alert` is the palette's error token;
    // the previous `text-red-400` was a raw, off-palette Tailwind colour.
    // "Probeer opnieuw" — the locked phrasing (#2433 rule 9's 4-to-2 collapse).
    return (
      <div className="py-4 text-center">
        <p className="text-alert mb-2">{error}</p>
        <button
          type="button"
          className="text-jersey-deep text-sm underline hover:no-underline"
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
