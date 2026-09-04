/**
 * GROQ projection for an article's related-card cover image. Baked to a
 * hotspot-aware 16:9 crop (mirrors RELATED_ARTICLES_QUERY in the web app,
 * #2291) so the related-endpoint NewsCards respect the editorial hotspot
 * instead of a centre object-cover that chops heads. Resolves to null when the
 * article has no cover (`null + "…"` is null in GROQ). Shared by the full
 * reindex (sanity-index-sync) and the per-doc webhook so they can't drift.
 *
 * ponytail: 16:9 baked in because handleRelated → NewsCard is the only
 * consumer of this metadata; store separate hotspot fields if a second aspect
 * ratio ever needs it.
 */
export const ARTICLE_COVER_IMAGE_PROJECTION = `"imageUrl": coverImage.asset->url + "?w=800&h=450&q=80&fm=webp&fit=crop&crop=focalpoint&fp-x=" + string(coalesce(coverImage.hotspot.x, 0.5)) + "&fp-y=" + string(coalesce(coverImage.hotspot.y, 0.5))`;

/**
 * The one article projection, shared by the nightly reindex
 * (sanity-index-sync) and the per-doc webhook. Both carried their own copy
 * until #2806, and every one of that issue's defects was present in both.
 *
 * Three of those defects live in this string:
 *
 * - `title` is Portable Text on all 125 published articles, so it is flattened
 *   here. Projected raw it decodes as an array against a declared `string` —
 *   the webhook's `S.decodeUnknownSync` then rejects the document outright and
 *   the article never reaches the index at all.
 * - `pt::text` renders top-level `block` nodes only, so a `qaBlock` answer
 *   contributes nothing. That hid ~90% of every interview.
 * - `lead` is the editor's standfirst and was indexed nowhere.
 *
 * The Q&A branches must be coalesced and joined, never concatenated with `+`:
 * GROQ propagates null through `+`, so `pt::text(body) + pt::text(body[...])`
 * blanks the body of the 121 of 125 articles that carry no `qaBlock`. Measured
 * across every published article, this projection yields zero nulls on every
 * field and takes the corpus from 49,568 to 52,331 indexed words.
 *
 * `tableHtml` comes back as raw HTML because GROQ cannot strip tags — see
 * `stripTableHtml`.
 *
 * ponytail: six of the eight non-`block` body types stay out, measured against
 * production in #2806, not guessed. `transferFact` (9 articles) would add only
 * the former club's name — the player is already in the title and the prose.
 * `articleImage` (36) holds `alt`, which is accessibility text, not content.
 * `qaSectionDivider` (1) and `videoBlock` (1) are furniture. `fileAttachment`
 * and `eventFact` have no published articles at all. Re-run that survey if
 * event articles start shipping: `eventFact` carries a title, location,
 * address and note, and would belong here.
 */
export const ARTICLE_INDEX_PROJECTION = `_id,
  "slug": coalesce(slug.current, ""),
  "title": coalesce(pt::text(title), title, ""),
  "lead": coalesce(lead, ""),
  "tags": coalesce(tags, []),
  "bodyText": array::join([
    pt::text(body),
    array::join(coalesce(body[_type=="qaBlock"].pairs[].question, []), " "),
    coalesce(pt::text(body[_type=="qaBlock"].pairs[].respondents[].answer), "")
  ], " "),
  "tableHtml": array::join(coalesce(body[_type=="htmlTable"].html, []), " "),
  ${ARTICLE_COVER_IMAGE_PROJECTION}`;

/**
 * Flattens an authored `htmlTable` to indexable words. On the transfer
 * overviews and season calendars the table *is* the article — 51 words of
 * prose over an 11,000-character table — so without this every squad list the
 * club has published is unfindable by the names inside it.
 *
 * ponytail: three replaces, no parser and no dependency. The only entity
 * present across all 10 published tables is `&nbsp;`; add to the first replace
 * if a future table introduces others.
 */
export function stripTableHtml(html: string): string {
  return html
    .replace(/&nbsp;/g, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function buildResponsibilityIndexText(doc: {
  title: string;
  question: string;
  keywords: readonly string[];
  summary: string;
}): string {
  return [doc.title, doc.question, doc.keywords.join(" "), doc.summary]
    .filter(Boolean)
    .join(". ");
}

export function buildArticleIndexText(doc: {
  title: string;
  tags: readonly string[];
  lead: string;
  bodyText: string | null;
  tableHtml: string;
}): string {
  return [
    doc.title,
    doc.tags.join(" "),
    doc.lead,
    doc.bodyText ?? "",
    stripTableHtml(doc.tableHtml),
  ]
    .filter(Boolean)
    .join(". ");
}

/**
 * The article's search-card summary — display only. It is the grey line under
 * a result, the context handed to the AI answer, and the related-card blurb;
 * it never affects what matches.
 *
 * Drawn from the editor's `lead` rather than sliced off the index text, which
 * now leads with prose but also carries Q&A and table words behind it. Slicing
 * that blob means the excerpt silently changes the next time the projection is
 * reordered. Table text is deliberately excluded — it is index fodder, not a
 * readable summary.
 */
export function buildArticleExcerpt(doc: {
  lead: string;
  bodyText: string | null;
}): string {
  return (doc.lead || doc.bodyText || "").slice(0, 200);
}

export function buildPageIndexText(doc: {
  title: string;
  bodyText: string | null;
}): string {
  return [doc.title, doc.bodyText ?? ""].filter(Boolean).join(". ");
}
