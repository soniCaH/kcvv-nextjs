# Wire apps/web → BFF (HttpApiClient) Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace `FootbalistoService` in `apps/web` with a typed `BffService` that calls the Cloudflare Worker BFF via `HttpApiClient.make(PsdApi)`.

**Architecture:** `BffService` wraps `HttpApiClient.make(PsdApi)` from `@effect/platform`, exposing the same methods as `FootbalistoService`. The live layer bundles `FetchHttpClient.layer` so callers (pages, runtime) have zero extra requirements. All five pages that currently use `FootbalistoService` change only the service name; their `catchAll` error handling stays identical.

**Tech Stack:** `@effect/platform` (HttpApiClient, FetchHttpClient), `@kcvv/api-contract` (PsdApi, shared schemas), Effect 3.x, Next.js 16 Server Components, Vitest

---

## Context You Must Know

### What is being replaced

`apps/web/src/lib/effect/services/FootbalistoService.ts` (678 lines) is a self-contained Effect service that called Footbalisto.be directly. It had six methods:

| Method                    | BFF endpoint                                                                           |
| ------------------------- | -------------------------------------------------------------------------------------- |
| `getMatches(teamId)`      | `GET /matches/:teamId`                                                                 |
| `getNextMatches()`        | `GET /matches/next` _(BFF not yet implemented — returns 500, pages handle gracefully)_ |
| `getMatchById(matchId)`   | `GET /match/:matchId`                                                                  |
| `getMatchDetail(matchId)` | `GET /match/:matchId/detail`                                                           |
| `getRanking(teamId)`      | `GET /ranking/:teamId`                                                                 |
| `getTeamStats(teamId)`    | `GET /stats/team/:teamId`                                                              |

### Files that use FootbalistoService (pages)

- `apps/web/src/app/page.tsx` — `getNextMatches()` with `catchAll`
- `apps/web/src/app/(main)/game/[matchId]/page.tsx` — `getMatchDetail(id)` in both `generateMetadata` and render
- `apps/web/src/app/(main)/team/[slug]/page.tsx` — `getMatches(teamId)` + `getRanking(rankingId)` in parallel
- `apps/web/src/app/(main)/calendar/page.tsx` — `getNextMatches()` with `catchAll`
- `apps/web/src/app/(main)/scheurkalender/page.tsx` — `getNextMatches()` with `catchAll`

### How `HttpApiClient.make` works

```typescript
// Requires HttpClient service from context during layer build
const client = yield * HttpApiClient.make(PsdApi, { baseUrl });
// After yield*, client methods return Effect<A, BffError, never>
// — no remaining service requirements because HttpClient was captured
client.matches.getMatchesByTeam({ path: { teamId: 1 } }); // Effect<readonly Match[], BffError, never>
client.matches.getNextMatches({}); // Effect<readonly Match[], BffError, never>
client.ranking.getRanking({ path: { teamId: 1 } }); // Effect<readonly RankingEntry[], BffError, never>
client.stats.getTeamStats({ path: { teamId: 1 } }); // Effect<TeamStats, BffError, never>
```

Providing `FetchHttpClient.layer` to the `BffServiceLive` layer satisfies the `HttpClient` requirement for `HttpApiClient.make`. After the layer is built, all method calls have `never` requirements.

### Environment variable

`KCVV_API_URL` — the BFF base URL. Default: `https://kcvv-api.kevin-van-ransbeeck.workers.dev`.
Set in Vercel for production/preview; `.env.local` for local dev.

---

## Tasks

### Task 1: Add `@effect/platform` to `apps/web`

**Files:**

- Modify: `apps/web/package.json` (via pnpm, not manually)

**Step 1: Install the package**

```bash
pnpm --filter @kcvv/web add @effect/platform
```

Expected: `apps/web/package.json` gains `"@effect/platform": "^x.x.x"`, lockfile updated.

**Step 2: Verify it resolves**

```bash
pnpm --filter @kcvv/web list @effect/platform
```

Expected: version appears in output.

**Step 3: Commit**

```bash
git add apps/web/package.json pnpm-lock.yaml
git commit -m "feat(deps): add @effect/platform to apps/web"
```

---

### Task 2: Create BffService (TDD)

**Files:**

- Create: `apps/web/src/lib/effect/services/BffService.ts`
- Create: `apps/web/src/lib/effect/services/BffService.test.ts`

#### Step 1: Write the failing tests first

Create `BffService.test.ts`:

```typescript
import { describe, it, expect, vi, afterEach } from "vitest";
import { Effect } from "effect";
import { BffService, BffServiceLive } from "./BffService";

// Minimal fixture that satisfies the Match schema from @kcvv/api-contract.
// date/time must be ISO strings because JSON.stringify converts Date objects.
const sampleMatch = {
  id: 1,
  date: "2025-09-01T15:00:00.000Z",
  time: "15:00",
  venue: undefined,
  home_team: {
    id: 10,
    name: "KCVV Elewijt",
    score: undefined,
    logo: undefined,
  },
  away_team: { id: 20, name: "Opponent FC", score: undefined, logo: undefined },
  status: "scheduled",
  competition: "LEAGUE",
  round: undefined,
};

const sampleRankingEntry = {
  position: 1,
  team_id: 10,
  team_name: "KCVV Elewijt",
  team_logo: "https://example.com/logo.png",
  played: 5,
  won: 4,
  drawn: 1,
  lost: 0,
  goals_for: 10,
  goals_against: 3,
  goal_difference: 7,
  points: 13,
  form: undefined,
};

function mockFetchWith(data: unknown, status = 200) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(
      new Response(JSON.stringify(data), {
        status,
        headers: { "Content-Type": "application/json" },
      }),
    ),
  );
}

describe("BffService", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("getMatches calls /matches/:teamId and returns decoded matches", async () => {
    mockFetchWith([sampleMatch]);

    const result = await Effect.runPromise(
      Effect.gen(function* () {
        const bff = yield* BffService;
        return yield* bff.getMatches(1);
      }).pipe(Effect.provide(BffServiceLive)),
    );

    expect(vi.mocked(fetch)).toHaveBeenCalledWith(
      expect.stringContaining("/matches/1"),
      expect.any(Object),
    );
    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe(1);
  });

  it("getNextMatches calls /matches/next", async () => {
    mockFetchWith([sampleMatch]);

    await Effect.runPromise(
      Effect.gen(function* () {
        const bff = yield* BffService;
        return yield* bff.getNextMatches();
      }).pipe(Effect.provide(BffServiceLive)),
    );

    expect(vi.mocked(fetch)).toHaveBeenCalledWith(
      expect.stringContaining("/matches/next"),
      expect.any(Object),
    );
  });

  it("getMatchDetail calls /match/:matchId/detail", async () => {
    const sampleDetail = {
      ...sampleMatch,
      hasReport: false,
      lineup: undefined,
    };
    mockFetchWith(sampleDetail);

    await Effect.runPromise(
      Effect.gen(function* () {
        const bff = yield* BffService;
        return yield* bff.getMatchDetail(42);
      }).pipe(Effect.provide(BffServiceLive)),
    );

    expect(vi.mocked(fetch)).toHaveBeenCalledWith(
      expect.stringContaining("/match/42/detail"),
      expect.any(Object),
    );
  });

  it("getRanking calls /ranking/:teamId and returns decoded entries", async () => {
    mockFetchWith([sampleRankingEntry]);

    const result = await Effect.runPromise(
      Effect.gen(function* () {
        const bff = yield* BffService;
        return yield* bff.getRanking(1);
      }).pipe(Effect.provide(BffServiceLive)),
    );

    expect(vi.mocked(fetch)).toHaveBeenCalledWith(
      expect.stringContaining("/ranking/1"),
      expect.any(Object),
    );
    expect(result).toHaveLength(1);
    expect(result[0]?.team_name).toBe("KCVV Elewijt");
  });

  it("propagates errors as Effect failures (not exceptions)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("", { status: 500 })),
    );

    const result = await Effect.runPromise(
      Effect.gen(function* () {
        const bff = yield* BffService;
        return yield* bff
          .getMatches(1)
          .pipe(
            Effect.catchAll(() =>
              Effect.succeed(
                [] as readonly import("@kcvv/api-contract").Match[],
              ),
            ),
          );
      }).pipe(Effect.provide(BffServiceLive)),
    );

    expect(result).toEqual([]);
  });
});
```

**Step 2: Run tests to verify they fail**

```bash
pnpm --filter @kcvv/web test src/lib/effect/services/BffService.test.ts
```

Expected: FAIL — "Cannot find module './BffService'"

**Step 3: Create `BffService.ts`**

```typescript
import { Context, Effect, Layer } from "effect";
import { HttpApiClient, FetchHttpClient } from "@effect/platform";
import type { HttpClientError } from "@effect/platform";
import type { ParseError } from "effect/ParseResult";
import {
  PsdApi,
  type Match,
  type MatchDetail,
  type RankingEntry,
  type TeamStats,
} from "@kcvv/api-contract";

export type BffError = HttpClientError.HttpClientError | ParseError;

export class BffService extends Context.Tag("BffService")<
  BffService,
  {
    getMatches: (teamId: number) => Effect.Effect<readonly Match[], BffError>;
    getNextMatches: () => Effect.Effect<readonly Match[], BffError>;
    getMatchById: (matchId: number) => Effect.Effect<Match, BffError>;
    getMatchDetail: (matchId: number) => Effect.Effect<MatchDetail, BffError>;
    getRanking: (
      teamId: number,
    ) => Effect.Effect<readonly RankingEntry[], BffError>;
    getTeamStats: (teamId: number) => Effect.Effect<TeamStats, BffError>;
  }
>() {}

const BFF_URL =
  process.env.KCVV_API_URL ??
  "https://kcvv-api.kevin-van-ransbeeck.workers.dev";

export const BffServiceLive = Layer.effect(
  BffService,
  Effect.gen(function* () {
    const client = yield* HttpApiClient.make(PsdApi, { baseUrl: BFF_URL });
    return {
      getMatches: (teamId: number) =>
        client.matches.getMatchesByTeam({ path: { teamId } }),
      getNextMatches: () => client.matches.getNextMatches({}),
      getMatchById: (matchId: number) =>
        client.matches.getMatchById({ path: { matchId } }),
      getMatchDetail: (matchId: number) =>
        client.matches.getMatchDetail({ path: { matchId } }),
      getRanking: (teamId: number) =>
        client.ranking.getRanking({ path: { teamId } }),
      getTeamStats: (teamId: number) =>
        client.stats.getTeamStats({ path: { teamId } }),
    };
  }),
).pipe(Layer.provide(FetchHttpClient.layer));
```

> **Note on `getNextMatches({})`:** If TypeScript complains about the `{}` argument (endpoint has no params), try `client.matches.getNextMatches()` with no argument instead. Check what TypeScript infers from the `@effect/platform` version in use.

**Step 4: Run tests to verify they pass**

```bash
pnpm --filter @kcvv/web test src/lib/effect/services/BffService.test.ts
```

Expected: All 5 tests PASS.

**Step 5: Type-check**

```bash
pnpm --filter @kcvv/web tsc --noEmit 2>&1 | head -20
```

Expected: No errors on `BffService.ts` or `BffService.test.ts`.

**Step 6: Commit**

```bash
git add apps/web/src/lib/effect/services/BffService.ts apps/web/src/lib/effect/services/BffService.test.ts
git commit -m "feat(api): add BffService — HttpApiClient wrapper for PsdApi"
```

---

### Task 3: Update runtime.ts and services barrel

**Files:**

- Modify: `apps/web/src/lib/effect/runtime.ts`
- Modify: `apps/web/src/lib/effect/services/index.ts`

#### Step 1: Rewrite `runtime.ts`

Replace every reference to `FootbalistoService` / `FootbalistoServiceLive` with `BffService` / `BffServiceLive`. Full new content:

```typescript
import { Effect, Layer, ManagedRuntime } from "effect";
import { DrupalService, DrupalServiceLive } from "./services/DrupalService";
import { BffService, BffServiceLive } from "./services/BffService";

export const AppLayer = Layer.mergeAll(DrupalServiceLive, BffServiceLive);
export const runtime = ManagedRuntime.make(AppLayer);

export const runPromise = <A, E>(
  effect: Effect.Effect<A, E, DrupalService | BffService>,
) => runtime.runPromise(effect);

export const runPromiseWithLogging = <A, E>(
  effect: Effect.Effect<A, E, DrupalService | BffService>,
) =>
  runtime.runPromise(
    effect.pipe(
      Effect.tapError((error) =>
        Effect.sync(() => {
          console.error("[Effect Error]", error);
        }),
      ),
    ),
  );

export const provideServices = <A, E, R>(effect: Effect.Effect<A, E, R>) =>
  Effect.provide(effect, AppLayer);

export { DrupalService, BffService };
```

#### Step 2: Update `services/index.ts`

```typescript
export * from "./DrupalService";
export * from "./BffService";
```

#### Step 3: Type-check

```bash
pnpm --filter @kcvv/web tsc --noEmit 2>&1 | head -20
```

Expected: Errors only on pages that still import `FootbalistoService` (those are next tasks). No errors in `runtime.ts` or `services/index.ts` themselves.

**Step 4: Commit**

```bash
git add apps/web/src/lib/effect/runtime.ts apps/web/src/lib/effect/services/index.ts
git commit -m "feat(api): wire BffService into Effect runtime (replaces FootbalistoService)"
```

---

### Task 4: Migrate homepage and calendar pages

These three pages all use `getNextMatches()` with `catchAll(() => Effect.succeed([]))`.

**Files:**

- Modify: `apps/web/src/app/page.tsx`
- Modify: `apps/web/src/app/(main)/calendar/page.tsx`
- Modify: `apps/web/src/app/(main)/scheurkalender/page.tsx`

#### Step 1: In each file make these two changes

1. Replace the import:

   ```typescript
   // Before
   import { FootbalistoService } from "@/lib/effect/services/FootbalistoService";
   // After
   import { BffService } from "@/lib/effect/services/BffService";
   ```

2. Replace the service yield:
   ```typescript
   // Before
   const footbalisto = yield* FootbalistoService;
   const matches = yield* footbalisto.getNextMatches()...
   // After
   const bff = yield* BffService;
   const matches = yield* bff.getNextMatches()...
   ```

> The `catchAll(() => Effect.succeed([]))` stays exactly as-is. `/matches/next` is not yet implemented in the BFF — `catchAll` ensures pages render empty gracefully until it is.

#### Step 2: Type-check

```bash
pnpm --filter @kcvv/web tsc --noEmit 2>&1 | grep -E "calendar|scheurkalender|\"app/page" | head -10
```

Expected: No errors for these three files.

**Step 3: Commit**

```bash
git add apps/web/src/app/page.tsx "apps/web/src/app/(main)/calendar/page.tsx" "apps/web/src/app/(main)/scheurkalender/page.tsx"
git commit -m "feat(migration): wire homepage, calendar, scheurkalender to BffService"
```

---

### Task 5: Migrate game detail page

**Files:**

- Modify: `apps/web/src/app/(main)/game/[matchId]/page.tsx`

#### Step 1: Replace the import

```typescript
// Before
import { FootbalistoService } from "@/lib/effect/services/FootbalistoService";
import type { MatchDetail } from "@/lib/effect/schemas/match.schema";
// After
import { BffService } from "@/lib/effect/services/BffService";
import type { MatchDetail } from "@kcvv/api-contract";
```

#### Step 2: Replace both service usages (generateMetadata + render)

In `generateMetadata` and in the page render function:

```typescript
// Before
const footbalisto = yield * FootbalistoService;
return yield * footbalisto.getMatchDetail(numericId);
// After
const bff = yield * BffService;
return yield * bff.getMatchDetail(numericId);
```

#### Step 3: Type-check

```bash
pnpm --filter @kcvv/web tsc --noEmit 2>&1 | grep "game" | head -10
```

Expected: No errors.

**Step 4: Commit**

```bash
git add "apps/web/src/app/(main)/game"
git commit -m "feat(migration): wire game detail page to BffService"
```

---

### Task 6: Migrate team page

**Files:**

- Modify: `apps/web/src/app/(main)/team/[slug]/page.tsx`

#### Step 1: Replace the import

```typescript
// Before
import { FootbalistoService } from "@/lib/effect/services/FootbalistoService";
import type { Match, RankingEntry } from "@/lib/effect/schemas";
// After
import { BffService } from "@/lib/effect/services/BffService";
import type { Match, RankingEntry } from "@kcvv/api-contract";
```

> If the file also imports other types from `@/lib/effect/schemas` (non-match types), keep those imports and only change the Match/RankingEntry import.

#### Step 2: Replace the service usage in `fetchFootbalistoData`

```typescript
// Before
const footbalisto = yield* FootbalistoService;
const [matchesResult, standingsResult] = yield* Effect.all(
  [
    footbalisto.getMatches(teamId).pipe(Effect.catchAll(...)),
    footbalisto.getRanking(rankingId).pipe(Effect.catchAll(...)),
  ],
  { concurrency: "unbounded" },
);
// After
const bff = yield* BffService;
const [matchesResult, standingsResult] = yield* Effect.all(
  [
    bff.getMatches(teamId).pipe(Effect.catchAll(...)),
    bff.getRanking(rankingId).pipe(Effect.catchAll(...)),
  ],
  { concurrency: "unbounded" },
);
```

#### Step 3: Type-check

```bash
pnpm --filter @kcvv/web tsc --noEmit 2>&1 | grep "team" | head -10
```

Expected: No errors.

**Step 4: Commit**

```bash
git add "apps/web/src/app/(main)/team"
git commit -m "feat(migration): wire team page to BffService"
```

---

### Task 7: Delete FootbalistoService and clean up schemas

**Files:**

- Delete: `apps/web/src/lib/effect/services/FootbalistoService.ts`
- Delete: `apps/web/src/lib/effect/services/FootbalistoService.test.ts`
- Modify: `apps/web/src/lib/effect/schemas/match.schema.ts`

#### Step 1: Verify no remaining references to FootbalistoService

```bash
grep -r "FootbalistoService" apps/web/src --include="*.ts" --include="*.tsx" -l
```

Expected: **empty output**. If any files still reference it — fix them before continuing.

#### Step 2: Delete the old service files

```bash
rm apps/web/src/lib/effect/services/FootbalistoService.ts
rm apps/web/src/lib/effect/services/FootbalistoService.test.ts
```

#### Step 3: Clean `match.schema.ts` — remove raw Footbalisto classes

`match.schema.ts` currently has two sections:

1. **Re-exports from `@kcvv/api-contract`** (at top) — **keep these** (backward-compat aliases within `apps/web`)
2. **Raw Footbalisto `S.Class` definitions** (everything below the re-exports) — **delete all**

Final file should only contain the re-exports block:

```typescript
export {
  CardType,
  Match,
  MatchDetail,
  MatchesArray,
  MatchesResponse,
  MatchLineup,
  MatchLineupPlayer,
  MatchStatus,
  MatchTeam,
  PlayerStats,
  RankingArray,
  RankingEntry,
  RankingResponse,
  TeamStats,
} from "@kcvv/api-contract";
```

Remove the `import { Schema as S } from "effect"` and `import { DateFromStringOrDate } from "./common.schema"` lines if no longer used.

#### Step 4: Type-check

```bash
pnpm --filter @kcvv/web tsc --noEmit 2>&1 | head -20
```

Expected: No errors.

#### Step 5: Run all tests

```bash
pnpm --filter @kcvv/web test
```

Expected: All tests pass. (FootbalistoService.test.ts is gone; BffService.test.ts passes.)

**Step 6: Commit**

```bash
git add -u apps/web/src/lib/effect/services/ apps/web/src/lib/effect/schemas/match.schema.ts
git commit -m "feat(migration): delete FootbalistoService, strip raw Footbalisto schemas"
```

---

### Task 8: Add env docs and final build verification

**Files:**

- Create: `apps/web/.env.local.example`

#### Step 1: Create `apps/web/.env.local.example`

```env
# BFF (Cloudflare Worker) base URL
# Production:  https://kcvv-api.kevin-van-ransbeeck.workers.dev
# Staging:     https://kcvv-api-staging.kevin-van-ransbeeck.workers.dev
# Local dev:   http://localhost:8787  (run: pnpm --filter @kcvv/api dev)
KCVV_API_URL=http://localhost:8787
```

#### Step 2: Full build verification

```bash
pnpm turbo build --filter=@kcvv/web
```

Expected: Build succeeds with no TypeScript or bundler errors.

> If Turbopack fails with a module resolution error that `tsc --noEmit` missed, check for `.js` extensions in imports inside `packages/api-contract` (see CLAUDE.md api-contract gotchas).

#### Step 3: Lint

```bash
pnpm --filter @kcvv/web lint:fix
```

Expected: No lint errors.

#### Step 4: Commit

```bash
git add apps/web/.env.local.example
git commit -m "docs(api): add .env.local.example with KCVV_API_URL for BFF wiring"
```

---

## After All Tasks

Use `superpowers:finishing-a-development-branch` to decide how to merge.

The `/matches/next` BFF endpoint is intentionally not yet implemented — pages that call `getNextMatches()` will receive empty arrays via their existing `catchAll` handlers. Implementing that endpoint is a separate follow-up task.
