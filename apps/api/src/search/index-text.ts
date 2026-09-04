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
 * The window an article is searchable in. Both index paths share it so a
 * future-dated or expired article cannot enter the index down one path while
 * the other holds it out — `runSanityIndexSync` only upserts, so anything the
 * webhook admits early stays until something deletes it.
 */
export const ARTICLE_PUBLISHED_FILTER = `publishedAt <= now() && (!defined(unpublishAt) || unpublishAt > now())`;

/**
 * The one article projection, shared by the nightly reindex
 * (sanity-index-sync) and the per-doc webhook. Both carried their own copy
 * until #2806, and every one of that issue's defects was present in both.
 *
 * What it fixes:
 *
 * - `title` is Portable Text on all 125 published articles, so it is flattened
 *   here. Projected raw it decodes as an array against a declared `string` —
 *   the webhook's `S.decodeUnknownSync` then rejects the document outright and
 *   the article never reaches the index at all.
 * - `pt::text` renders top-level `block` nodes only, so `qaBlock` answers
 *   contributed nothing. That hid roughly 90% of every interview.
 * - `htmlTable` was invisible too, and on the transfer overviews and season
 *   calendars the table *is* the article — 51 words of prose over an 11,000
 *   character table.
 * - `lead` is the editor's standfirst and was indexed nowhere.
 *
 * **Every branch is projected separately and joined in TypeScript, never in
 * GROQ.** GROQ propagates null through both `+` and `array::join`, and the
 * null sources here are not hypothetical: `pt::text(body)` returns null (not
 * `""`) for a body holding no top-level `block`, so a Q&A-only or table-only
 * article would blank out entirely — the exact articles this projection
 * exists to rescue. A `pairs[]` entry with no `question`, or an `htmlTable`
 * with no `html`, puts a null *element* in an array, which `array::join` also
 * propagates. `coalesce` on the outer value does not reach either case.
 * Composing in TypeScript sidesteps the whole class; `buildArticleIndexText`
 * filters the nulls out.
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
  "prose": coalesce(pt::text(body), ""),
  "qaQuestions": coalesce(body[_type=="qaBlock"].pairs[].question, []),
  "qaAnswers": coalesce(pt::text(body[_type=="qaBlock"].pairs[].respondents[].answer), ""),
  "tableHtml": coalesce(body[_type=="htmlTable"].html, []),
  ${ARTICLE_COVER_IMAGE_PROJECTION}`;

/**
 * Flattens authored `htmlTable` markup to indexable words. On the transfer
 * overviews and season calendars the table *is* the article — 51 words of
 * prose over an 11,000-character table — so without this every squad list the
 * club has published is unfindable by the names inside it.
 *
 * ponytail: three replaces, no parser and no dependency. Entities become
 * spaces rather than their characters: this text is embedded, never rendered,
 * so a stray `&` would only be a dead token.
 */
export function stripTableHtml(html: string): string {
  return html
    .replace(/&[a-z]+;|&#\d+;/gi, " ")
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

/**
 * The text an article is embedded from. The `filter(Boolean)` calls are load
 * bearing twice over: they drop the null elements GROQ leaves in
 * `qaQuestions` and `tableHtml`, and they keep an absent branch from leaving
 * a bare separator behind.
 */
export function buildArticleIndexText(doc: {
  title: string;
  tags: readonly string[];
  lead: string;
  prose: string;
  qaQuestions: readonly (string | null)[];
  qaAnswers: string;
  tableHtml: readonly (string | null)[];
}): string {
  return [
    doc.title,
    doc.tags.join(" "),
    doc.lead,
    doc.prose,
    doc.qaQuestions.filter(Boolean).join(" "),
    doc.qaAnswers,
    stripTableHtml(doc.tableHtml.filter(Boolean).join(" ")),
  ]
    .filter(Boolean)
    .join(". ");
}

/**
 * The article's search-card summary — display only. It is the grey line under
 * a result, the context handed to the AI answer, and the related-card blurb;
 * it never affects what matches.
 *
 * Drawn from the editor's `lead`, falling back to the article's prose. Neither
 * the Q&A text nor the table text can reach it: an interview whose lead is
 * empty should show its opening paragraph, not "Hoe ging het? Uitstekend", and
 * a transfer overview should not show a run of table cells.
 */
export function buildArticleExcerpt(doc: {
  lead: string;
  prose: string;
}): string {
  return (doc.lead || doc.prose).slice(0, 200);
}

export function buildPageIndexText(doc: {
  title: string;
  bodyText: string | null;
}): string {
  return [doc.title, doc.bodyText ?? ""].filter(Boolean).join(". ");
}
