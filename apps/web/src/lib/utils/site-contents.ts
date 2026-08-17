import { toDisplayZone } from "./dates";

/**
 * The contents page's view model (#2622, decision D8 in
 * `docs/research/decision-sheet.md`).
 *
 * One assembler, not four. `/inhoud` is a printed contents page for the whole
 * site, and the single invariant worth protecting in code is that **nothing on
 * it is authored**: every row is derived from a repository read, so a group
 * with no documents behind it is simply not on the page. `llms.txt` shipped
 * `/club/organigram` for months after the route was deleted because it was
 * hand-written; this is the same page built the other way round.
 *
 * Players are deliberately absent and are not an oversight: an index of ~300
 * youth players was rejected on privacy grounds (A7), and of 294 player
 * documents **zero carry a slug** — there would be nothing to link to.
 */

/** The four groups, in the order the page prints them. */
export type ContentsGroupId =
  "ploegen" | "nieuws" | "evenementen" | "clubpaginas";

export interface ContentsEntry {
  /** Source document id — the React key, never rendered. */
  id: string;
  /** What the thing is called. */
  label: string;
  /**
   * The value the design pairs this group with — a Ploeg its Reeks, an Artikel
   * its date. `null` when the source has none, so the row can show the value as
   * *absent* rather than dropping the pair.
   */
  value: string | null;
  /** Site-relative route the row links to. */
  href: string;
}

export interface ContentsGroup {
  id: ContentsGroupId;
  /** Section heading, in the site's own Dutch vocabulary. */
  title: string;
  entries: ContentsEntry[];
}

/**
 * Structural input shapes rather than the repositories' view models, so
 * `TeamNavVM` / `ArticleVM` / `EventVM` and the page list all satisfy them
 * without adapters — the same reason `teamDisplayName` takes a `TeamNameSource`.
 */

export interface ContentsTeamSource {
  id: string;
  slug: string;
  /** Already resolved by the repository via `teamDisplayName` (#2630). */
  displayName: string;
  /** The club's short competition code. */
  division: string | null;
  /** The club's full competition name — null on every youth team. */
  divisionFull: string | null;
}

export interface ContentsArticleSource {
  id: string;
  slug: string;
  title: string;
  publishedAt: string | null;
}

export interface ContentsEventSource {
  id: string;
  slug: string;
  title: string;
  dateStart: string | null;
}

export interface ContentsPageSource {
  id: string;
  slug: string;
  title: string;
  updatedAt: string | null;
}

export interface SiteContentsInput {
  teams: readonly ContentsTeamSource[];
  articles: readonly ContentsArticleSource[];
  events: readonly ContentsEventSource[];
  pages: readonly ContentsPageSource[];
}

/**
 * `dd·MM·jj` — the contents-page date. Mono and fixed-width so a column of
 * them lines up; the interpunct is the fanzine separator the D-series mockups
 * use rather than a slash. Parsed through `toDisplayZone`, which is the site's
 * one Sanity-instant parse, so the rendered day never depends on where the code
 * runs. An unparseable or missing date is `null`, i.e. visibly absent.
 */
function contentsDate(value: string | null): string | null {
  if (!value) return null;
  const dt = toDisplayZone(value);
  return dt.isValid ? dt.toFormat("dd·MM·yy") : null;
}

/**
 * The one group whose repository order is not its printed order.
 *
 * `TeamRepository.findAll` sorts on the PSD-registered `name`, but what the
 * page prints is the display name (#2630) — and the two disagree, so the column
 * came out `A-ploeg · U11 · U13 · KCVVE U6 Groen & Wit · U10`. An index sorted
 * by a key it does not show is an index a reader cannot scan. The other three
 * groups already arrive in the order they should print (articles newest first,
 * events by start date, pages by title).
 */
function byDisplayName(a: ContentsTeamSource, b: ContentsTeamSource): number {
  return a.displayName.localeCompare(b.displayName, "nl", { numeric: true });
}

/** A group is only on the page when something is in it. */
function group(
  id: ContentsGroupId,
  title: string,
  entries: ContentsEntry[],
): ContentsGroup[] {
  return entries.length === 0 ? [] : [{ id, title, entries }];
}

/**
 * Assemble the whole contents page from four repository reads.
 *
 * Given empty inputs the result is `[]` — there is no floor of hardcoded rows
 * and no authored entry anywhere in this function.
 */
export function buildSiteContents({
  teams,
  articles,
  events,
  pages,
}: SiteContentsInput): ContentsGroup[] {
  return [
    ...group(
      "ploegen",
      "Ploegen",
      [...teams].sort(byDisplayName).map((team) => ({
        id: team.id,
        label: team.displayName,
        // Same fallback chain `/ploegen` uses. Null on the youth teams, which
        // carry no editorial division — that absence is the honest answer, and
        // the row shows it.
        value: team.divisionFull ?? team.division,
        href: `/ploegen/${team.slug}`,
      })),
    ),
    ...group(
      "nieuws",
      "Nieuws",
      articles.map((article) => ({
        id: article.id,
        label: article.title,
        value: contentsDate(article.publishedAt),
        href: `/nieuws/${article.slug}`,
      })),
    ),
    ...group(
      "evenementen",
      "Evenementen",
      events.map((event) => ({
        id: event.id,
        label: event.title,
        value: contentsDate(event.dateStart),
        href: `/evenementen/${event.slug}`,
      })),
    ),
    ...group(
      "clubpaginas",
      "Clubpagina's",
      pages.map((page) => ({
        id: page.id,
        label: page.title,
        // A club page has no date of its own and no reeks; what it does have is
        // when it last changed, which is the same "when" register the other
        // three groups print. The mockup showed the route prefix here, but
        // every one of these pages lives under `/club`, so that column would
        // have repeated one constant down the page and told the reader nothing
        // the link did not already carry.
        value: contentsDate(page.updatedAt),
        href: `/club/${page.slug}`,
      })),
    ),
  ];
}
