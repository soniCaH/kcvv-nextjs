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
    // #2470's copy table calls this "Tier 2 + action", but the register it
    // specifies doesn't exist yet: `<EmptyState tier="slot">`'s
    // failure-notice member has no action prop at all, and `<ErrorState>` is
    // a `min-h-[70vh]` full-page composition, not an in-flow footer. Staying
    // bespoke here is a deliberate stopgap, not a style choice — see #2816.
    // The retry is a substitution, not an addition: the load-more button it
    // replaces is unreachable behind the if-chain below (#2470 resolution
    // rule 4). `text-alert` is the palette's error token; `<Button
    // variant="ghost" size="sm">` is the same in-surface action
    // `<EmptyState reason="filtered">`'s own undo renders — reaching for the
    // primitive already imported below rather than a hand-rolled underlined
    // link gets the 24px WCAG 2.5.8 tap target for free. "Probeer opnieuw" —
    // the locked phrasing (#2433 rule 9's 4-to-2 collapse).
    return (
      <div className="py-4 text-center">
        <p className="text-alert mb-2">{error}</p>
        <Button variant="ghost" size="sm" onClick={onLoadMore}>
          Probeer opnieuw
        </Button>
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
