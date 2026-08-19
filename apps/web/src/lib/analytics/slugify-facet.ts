/**
 * Normalize an `empty_state_undo` facet value into one value space before it
 * hits GA4's reused `filter_type` dimension (#2691). The five hosts pass
 * wildly different casings for the same conceptual facet — `hulp`'s
 * `CategoryKey`/`UserRole` values are already lowercase slugs (`"medisch"`),
 * but `evenementen`'s `EventFilterValue`, `kalender`'s `KalenderFilterValue`
 * and `nieuws`'s category label/slug are display casing (`"Jeugdwerking"`,
 * `"Supportersactiviteit"`, `"Jeugd"`). Left alone, the same conceptual
 * facet (news tag `"Jeugd"` vs hulp slug `"jeugd"`) would split into two
 * rows in a `filter_type` breakdown that already carries values from
 * `match_agenda_filter` / `search_filter_changed`.
 */
export function slugifyFacet(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
