import { HttpApi } from "@effect/platform";
import { MatchesApi } from "./matches.js";
import { RankingApi } from "./ranking.js";
import { StatsApi } from "./stats.js";

export { MatchesApi, RankingApi, StatsApi };

/** Root API definition — implemented by kcvv-api (Cloudflare Worker), consumed by apps/web */
export class PsdApi extends HttpApi.make("psd")
  .add(MatchesApi)
  .add(RankingApi)
  .add(StatsApi) {}
