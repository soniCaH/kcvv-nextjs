import { LISTING_INITIAL_TOTAL } from "@/lib/constants";

/**
 * The mechanics behind the one listing pagination contract (#2569 / decision
 * #2431). `/nieuws` and `/galerij` are the two listings whose collection has no
 * natural ceiling; both paint `LISTING_INITIAL_TOTAL` and append
 * `LISTING_BATCH_SIZE` per click, and both go through the helpers here so the
 * site never grows a second idiom.
 */

export interface Paginated<T> {
  items: T[];
  hasMore: boolean;
}

/**
 * Clamps a client-supplied window before it reaches GROQ. Both listing actions
 * are `"use server"`, so their params are public input: an unbounded `limit`
 * would slice the whole collection per request, and a negative `offset` flips
 * `[$offset...$end]` into GROQ's end-relative form.
 */
export function clampListingWindow(params: { offset: number; limit: number }): {
  offset: number;
  limit: number;
} {
  return {
    offset: Math.max(0, Math.trunc(params.offset)),
    limit: Math.min(
      Math.max(1, Math.trunc(params.limit)),
      LISTING_INITIAL_TOTAL,
    ),
  };
}

/**
 * Splits an over-fetched batch into the page and its `hasMore` flag. Callers
 * query `limit + 1` rows, so the extra row answers "is there more?" without a
 * second count query.
 */
export function paginateResults<T>(rows: T[], limit: number): Paginated<T> {
  const hasMore = rows.length > limit;
  return { items: hasMore ? rows.slice(0, limit) : rows, hasMore };
}

/**
 * Drops rows already on screen, and rows repeated inside the batch itself. A
 * document published or unpublished between two clicks shifts the window, so an
 * appended batch can overlap what is already rendered.
 */
export function deduplicateById<T extends { id: string }>(
  rows: T[],
  existingIds: ReadonlySet<string>,
): T[] {
  const seen = new Set(existingIds);
  return rows.filter((row) => {
    if (seen.has(row.id)) return false;
    seen.add(row.id);
    return true;
  });
}
