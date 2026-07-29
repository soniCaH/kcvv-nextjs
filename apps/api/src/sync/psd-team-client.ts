import { Context, Effect, Layer, Schema as S } from "effect";
import { WorkerEnvTag } from "../env";
import { KvCacheService } from "../cache/kv-cache";
import {
  PsdClubStaffMember,
  PsdMember,
  PsdMembersPageSchema,
  PsdQuicksearchStaffPageSchema,
  PsdTeam,
  PsdTeamsSchema,
} from "../psd/schemas-player-team";

export class PsdTeamClientError extends Error {
  readonly _tag = "PsdTeamClientError" as const;
  constructor(
    message: string,
    readonly status?: number,
    readonly cause?: unknown,
  ) {
    super(message);
    this.name = "PsdTeamClientError";
  }
}

export class PsdTeamClientValidationError extends Error {
  readonly _tag = "PsdTeamClientValidationError" as const;
  constructor(
    message: string,
    readonly cause?: unknown,
  ) {
    super(message);
    this.name = "PsdTeamClientValidationError";
  }
}

export type PsdTeamClientErrors =
  | PsdTeamClientError
  | PsdTeamClientValidationError;

export interface PsdTeamClientInterface {
  readonly getRawTeams: () => Effect.Effect<
    readonly PsdTeam[],
    PsdTeamClientErrors
  >;
  readonly getRawMembers: (
    teamId: number,
  ) => Effect.Effect<readonly PsdMember[], PsdTeamClientErrors>;
  readonly getRawStaff: (
    teamId: number,
  ) => Effect.Effect<readonly PsdMember[], PsdTeamClientErrors>;
  readonly getRawClubStaff: () => Effect.Effect<
    readonly PsdClubStaffMember[],
    PsdTeamClientErrors
  >;
}

export class PsdTeamClient extends Context.Tag("PsdTeamClient")<
  PsdTeamClient,
  PsdTeamClientInterface
>() {}

function fetchJson<A, I>(
  url: string,
  schema: S.Schema<A, I>,
  headers: Record<string, string>,
) {
  return Effect.gen(function* () {
    const response = yield* Effect.tryPromise({
      try: () => fetch(url, { headers }),
      catch: (cause) =>
        new PsdTeamClientError(`Failed to fetch ${url}`, undefined, cause),
    });

    if (!response.ok) {
      return yield* Effect.fail(
        new PsdTeamClientError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status,
        ),
      );
    }

    const json = yield* Effect.tryPromise({
      try: () => response.json(),
      catch: (cause) =>
        new PsdTeamClientError("Failed to parse JSON", undefined, cause),
    });

    return yield* S.decodeUnknown(schema)(json).pipe(
      Effect.mapError(
        (cause) =>
          new PsdTeamClientValidationError("Schema validation failed", cause),
      ),
    );
  });
}

export const PsdTeamClientLive = Layer.effect(
  PsdTeamClient,
  Effect.gen(function* () {
    const env = yield* WorkerEnvTag;
    const cache = yield* KvCacheService;
    const base = env.PSD_API_BASE_URL;

    const psdHeaders = {
      "x-api-key": env.PSD_API_KEY,
      "x-api-club": env.PSD_API_CLUB,
      Authorization: env.PSD_API_AUTH,
      "Accept-Language": "nl-BE",
      "Content-Type": "application/json",
    };

    const countedFetch = <A, I>(url: string, schema: S.Schema<A, I>) =>
      fetchJson(url, schema, psdHeaders).pipe(
        Effect.ensuring(cache.increment()),
      );

    // Fetch every page of a Spring-pageable endpoint: read page 0 to learn
    // totalPages, then fetch the rest at bounded concurrency. `fetchPage` owns
    // the URL, schema, and any envelope-unwrapping (e.g. `.playerList`).
    const paginateAll = <T>(
      fetchPage: (
        page: number,
      ) => Effect.Effect<
        { readonly totalPages: number; readonly content: readonly T[] },
        PsdTeamClientErrors
      >,
    ) =>
      Effect.gen(function* () {
        const firstPage = yield* fetchPage(0);
        if (firstPage.totalPages <= 1) return firstPage.content;

        const remainingPages = yield* Effect.all(
          Array.from({ length: firstPage.totalPages - 1 }, (_, i) =>
            fetchPage(i + 1).pipe(Effect.map((page) => page.content)),
          ),
          { concurrency: 3 },
        );

        return [...firstPage.content, ...remainingPages.flat()];
      });

    return {
      getRawTeams: () => countedFetch(`${base}/teams`, PsdTeamsSchema),
      getRawMembers: (teamId: number) =>
        paginateAll((page) =>
          countedFetch(
            `${base}/teams/${teamId}/members?page=${page}`,
            PsdMembersPageSchema,
          ),
        ),
      getRawStaff: (teamId: number) =>
        paginateAll((page) =>
          countedFetch(
            `${base}/teams/${teamId}/staff?page=${page}`,
            PsdMembersPageSchema,
          ),
        ),
      // Club-wide staff search — nested `playerList` wrapper. Adds ~2 PSD calls;
      // called once per sync cycle only.
      getRawClubStaff: () =>
        paginateAll((page) =>
          countedFetch(
            `${base}/members/quicksearch/status/staff?page=${page}&size=100`,
            PsdQuicksearchStaffPageSchema,
          ).pipe(Effect.map((r) => r.playerList)),
        ),
    };
  }),
);
