/**
 * Mappers
 * Transform data between different layers (domain ↔ presentation)
 */

export {
  mapArticleToHomepageArticle,
  mapArticlesToHomepageArticles,
} from "./article.mapper";
export {
  mapMatchToUpcomingMatch,
  mapMatchesToUpcomingMatches,
} from "./match.mapper";
export {
  mapSponsorToComponentSponsor,
  mapSponsorsToComponentSponsors,
} from "./sponsor.mapper";
export type { HomepageArticle } from "./article.mapper";
