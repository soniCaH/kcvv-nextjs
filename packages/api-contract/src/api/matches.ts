import { HttpApiEndpoint, HttpApiGroup } from "@effect/platform";
import { Schema as S } from "effect";
import { Match, MatchDetail, MatchesArray } from "../schemas/match.js";

export class MatchesApi extends HttpApiGroup.make("matches")
  .add(
    HttpApiEndpoint.get("getMatchesByTeam", "/matches/:teamId")
      .setPath(S.Struct({ teamId: S.NumberFromString }))
      .addSuccess(MatchesArray),
  )
  .add(
    HttpApiEndpoint.get("getNextMatches", "/matches/next").addSuccess(
      MatchesArray,
    ),
  )
  .add(
    HttpApiEndpoint.get("getMatchById", "/match/:matchId")
      .setPath(S.Struct({ matchId: S.NumberFromString }))
      .addSuccess(Match),
  )
  .add(
    HttpApiEndpoint.get("getMatchDetail", "/match/:matchId/detail")
      .setPath(S.Struct({ matchId: S.NumberFromString }))
      .addSuccess(MatchDetail),
  ) {}
