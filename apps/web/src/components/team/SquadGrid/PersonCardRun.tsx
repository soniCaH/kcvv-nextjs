import type { ReactNode } from "react";

export interface PersonCardRunProps {
  /**
   * The run's own word — becomes both the section's accessible name
   * (`aria-label`) and its visible mono-caps heading text. Required: a
   * shared structural primitive must never bake a role word (e.g. "Staf")
   * into itself — the caller who knows what the run actually contains
   * supplies it (#2575 review). `<SquadGrid>` passes a position-group
   * label ("Doelmannen", …); `<TeamStaff>`'s callers pass whatever word
   * fits their page ("Staf" on the team page, "De leden" on a board page).
   */
  label: string;
  children: ReactNode;
  /** Forwarded to the card-grid element, for a caller that needs to query it directly. */
  "data-testid"?: string;
}

/**
 * `<PersonCardRun>` — one labelled run of person cards: a mono-caps
 * heading (also the run's `aria-label`) over `<SquadGrid>`'s canonical
 * `auto-fill` grid track.
 *
 * Extracted from `<SquadGrid>` and `<TeamStaff>` (#2575 review), which had
 * landed on byte-identical section/heading/grid markup independently —
 * "One grid" (#2477) was two string literals kept in sync by hand, so
 * editing one silently reintroduced the column-count break the ticket
 * exists to close. This is now the one place the grid track lives;
 * `minmax(140px,1fr)` never appears a second time in either caller.
 */
export function PersonCardRun({
  label,
  children,
  "data-testid": dataTestId,
}: PersonCardRunProps) {
  return (
    <section aria-label={label}>
      <h3 className="text-ink-muted border-paper-edge mb-3 border-b pb-1.5 font-mono text-[11px] tracking-[0.1em] uppercase">
        {label}
      </h3>
      <div
        data-testid={dataTestId}
        className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-4"
      >
        {children}
      </div>
    </section>
  );
}
