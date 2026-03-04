import { HttpApiEndpoint, HttpApiGroup } from "@effect/platform";
import { Schema as S } from "effect";
import { TeamStats } from "../schemas/stats";

export class StatsApi extends HttpApiGroup.make("stats")
  .add(
    HttpApiEndpoint.get("getTeamStats", "/stats/team/:teamId")
      .setPath(S.Struct({ teamId: S.NumberFromString }))
      .addSuccess(TeamStats),
  ) {}
