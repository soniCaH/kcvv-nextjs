/** Discriminated union for all related content item types */

import type { CardArtefactSubject } from "@/lib/utils/card-subject-artefact";

/**
 * `"domain"` (#2581/#2443) — a structural relation the site itself knows
 * (a player's own team, a match's opponent, a gallery's linked event), never
 * editor-curated, AI-scored, or a body-text mention. Enters the merge first —
 * see `mergeRelatedRow` (`../mergeRelatedRow`) — because it says what the
 * subject *is*, not what an editor or a model thought was related.
 */
export type RelatedContentSource = "editorial" | "ai" | "reference" | "domain";

/**
 * The kind of page *hosting* `<RelatedRow>` — the `pageType` prop, read only
 * for the `related_content_shown`/`related_content_click` analytics payload
 * (#1832's locked `page_type` dimension). Distinct from `RelatedContentItem["type"]`
 * (the kind of *target* a card links to): no route hosts a bare `"page"` (a
 * `/club/[slug]` CMS page stays out of scope per #2443's resolution — "still
 * nothing"), so `"page"` is not a member here even though `RelatedPageItem`
 * is a valid link target. `"match"` is the mirror case — `/wedstrijd/[matchId]`
 * hosts the row, but a match is never itself a card (see the `"match"` note
 * on `RelatedContentItem` below).
 */
export type RelatedPageType =
  "article" | "player" | "team" | "staff" | "event" | "match" | "gallery";

export interface RelatedArticleItem {
  type: "article";
  source: RelatedContentSource;
  id: string;
  title: string;
  slug: string;
  imageUrl: string | null;
  date: string | null;
  excerpt: string | null;
}

export interface RelatedPageItem {
  type: "page";
  source: RelatedContentSource;
  id: string;
  title: string;
  slug: string;
  imageUrl: string | null;
  excerpt: string | null;
}

export interface RelatedPlayerItem {
  type: "player";
  source: RelatedContentSource;
  id: string;
  firstName: string | null;
  lastName: string | null;
  position: string | null;
  imageUrl: string | null;
  psdId: string;
}

export interface RelatedTeamItem {
  type: "team";
  source: RelatedContentSource;
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  tagline: string | null;
}

export interface RelatedStaffItem {
  type: "staff";
  source: RelatedContentSource;
  id: string;
  firstName: string | null;
  lastName: string | null;
  role: string | null;
  imageUrl: string | null;
}

export interface RelatedEventItem {
  type: "event";
  source: RelatedContentSource;
  id: string;
  title: string;
  slug: string;
  /** Required ISO datetime — events without a start have nothing to render. */
  dateStart: string;
  /** Optional ISO end datetime; same-day single events typically omit it. */
  dateEnd: string | null;
  imageUrl: string | null;
}

export interface RelatedGalleryItem {
  type: "gallery";
  source: RelatedContentSource;
  id: string;
  title: string;
  slug: string;
  imageUrl: string | null;
}

/**
 * The 7th member (#2443/#2574 resolution). A match is deliberately **not** a
 * member here — it is not a Sanity document, so a match card would mean a
 * live BFF hop keyed on an unvalidated string (a gallery's `linkedMatch` is a
 * bare, unpicked string field). Where a match genuinely needs to appear in
 * the row (the `/nieuws/[slug]` "Bekijk de wedstrijd" fold-in, reusing the
 * `matchDetail` the page already fetched for its hero), the page builds the
 * card directly as a `RelatedRowItem` rather than round-tripping through this
 * union — see `RelatedRow`'s docblock.
 */
export type RelatedContentItem =
  | RelatedArticleItem
  | RelatedPageItem
  | RelatedPlayerItem
  | RelatedTeamItem
  | RelatedStaffItem
  | RelatedEventItem
  | RelatedGalleryItem;

/**
 * The flat card shape `<RelatedRow>` renders — what every `RelatedContentItem`
 * tier maps down to (`mapRelatedToRelatedRow`), and what a page-built
 * synthetic domain card (the `/nieuws/[slug]` match fold-in, `/ploegen/[slug]`'s
 * own fixture list) constructs directly, since neither has a Sanity document
 * to route through the union above. `href` is the merge/dedupe key
 * (`mergeRelatedRow`) — one destination, one card, "cardinality is not a
 * treatment" (#2443 rule 3).
 */
export interface RelatedRowItem {
  title: string;
  href: string;
  imageUrl?: string;
  /**
   * What the image region renders when `imageUrl` is absent — resolved via
   * `getCardSubjectArtefact` (`@/lib/utils/card-subject-artefact`, #2574).
   * Omit to keep `<NewsCard>`'s default hatch.
   */
  artefact?: CardArtefactSubject;
  /** Single category label rendered above the title (per-type badge). */
  badge?: string;
  /** Display date (e.g. formatted `publishedAt` / `dateStart`). */
  date?: string;
  /**
   * `articleType` of a linked article — drives the per-card background
   * lookup (R3). `null`/`undefined` (including every non-article type)
   * defaults to cream.
   */
  articleType?: "interview" | "announcement" | "transfer" | "event" | null;
  /**
   * Analytics payload — optional so demo / Storybook items can skip it. The
   * GA4 contract locked at #1832 is kept exactly; `"match"` is the one
   * pragmatic addition beyond `RelatedContentItem["type"]` — the
   * `/nieuws/[slug]` "Bekijk de wedstrijd" fold-in links a PSD match, which
   * (deliberately, see `RelatedContentItem`'s docblock) has no document
   * union member of its own to borrow a `target_type` from.
   */
  analyticsId?: string;
  analyticsSource?: RelatedContentSource;
  analyticsType?: RelatedContentItem["type"] | "match";
  /** `psdId` for players, `slug` for every other type. */
  analyticsTargetSlug?: string;
}
