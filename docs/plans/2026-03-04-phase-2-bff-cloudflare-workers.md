# Phase 2 — Effect BFF on Cloudflare Workers Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create `apps/api/` — a Cloudflare Worker BFF that implements `PsdApi` from `@kcvv/api-contract` with KV caching, then switch `apps/web/` from direct Footbalisto calls to the new typed BFF client.

**Architecture:** `apps/api/src/index.ts` exports a Worker `fetch` handler via `HttpApp.toWebHandler` wrapping `HttpApiBuilder.serve(PsdApi)`. All raw Footbalisto HTTP calls and transform logic live in `apps/api/src/footbalisto/`. Cloudflare KV provides reactive caching with per-endpoint TTLs. Once deployed, `apps/web/` uses `HttpApiClient.make(PsdApi)` via a new `BffServiceLive` that satisfies the existing `FootbalistoService` interface — no page code changes needed.

**Tech Stack:** Cloudflare Workers, Wrangler 4, `@effect/platform` HttpApiBuilder + HttpApiClient + HttpApp.toWebHandler, Cloudflare KV, Vitest (unit tests), `@kcvv/api-contract` (PsdApi contract)

**Git branch:** `feat/phase-2-bff-cloudflare-workers`

**Prerequisites before starting:**

- A Cloudflare account with Workers free tier (zero cost)
- `npx wrangler login` completed (run once — opens browser)
- Create two KV namespaces and note both IDs:
  ```bash
  npx wrangler kv namespace create PSD_CACHE
  npx wrangler kv namespace create PSD_CACHE --preview
  ```

---

## Phase 2a: apps/api — the Cloudflare Worker

---

### Task 1: Create the git branch

**Step 1: Create and checkout branch**

```bash
git checkout -b feat/phase-2-bff-cloudflare-workers
```

Expected: `Switched to a new branch 'feat/phase-2-bff-cloudflare-workers'`

---

### Task 2: Scaffold `apps/api/` workspace files

**Files to create:**

- `apps/api/package.json`
- `apps/api/tsconfig.json`
- `apps/api/wrangler.toml`
- `apps/api/vitest.config.ts`

**Step 1: Create `apps/api/package.json`**

```json
{
  "name": "@kcvv/api",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "wrangler dev",
    "deploy": "wrangler deploy",
    "type-check": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "lint": "eslint ."
  },
  "dependencies": {
    "@effect/platform": "^0.94.5",
    "@kcvv/api-contract": "workspace:*",
    "effect": "3.19.19"
  },
  "devDependencies": {
    "@cloudflare/workers-types": "^4.20250409.0",
    "@vitest/coverage-v8": "4.0.18",
    "typescript": "5.9.3",
    "vitest": "4.0.18",
    "wrangler": "^4.0.0"
  }
}
```

**Step 2: Create `apps/api/tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ESNext"],
    "types": ["@cloudflare/workers-types"],
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noEmit": true
  },
  "include": ["src/**/*", "vitest.config.ts"]
}
```

**Step 3: Create `apps/api/wrangler.toml`**

Replace `PROD_KV_ID` and `PREVIEW_KV_ID` with the IDs from the prerequisite step:

```toml
name = "kcvv-api"
main = "src/index.ts"
compatibility_date = "2024-09-23"
compatibility_flags = ["nodejs_compat"]

[vars]
FOOTBALISTO_API_URL = "https://footbalisto.be"
FOOTBALISTO_LOGO_CDN_URL = "https://dfaozfi7c7f3s.cloudfront.net/logos"

[[kv_namespaces]]
binding = "PSD_CACHE"
id = "PROD_KV_ID"
preview_id = "PREVIEW_KV_ID"
```

**Step 4: Create `apps/api/vitest.config.ts`**

```typescript
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
```

**Step 5: Install dependencies**

```bash
pnpm install
```

Expected: lockfile updated with wrangler + @cloudflare/workers-types.

**Step 6: Verify workspace resolution**

```bash
pnpm --filter @kcvv/api type-check
```

Expected: exits 0 (src/ is empty but tsconfig is valid).

**Step 7: Commit**

```bash
git add apps/api/package.json apps/api/tsconfig.json apps/api/wrangler.toml apps/api/vitest.config.ts pnpm-lock.yaml
git commit -m "feat(api): scaffold apps/api workspace — Wrangler + TypeScript setup"
```

---

### Task 3: Update Turborepo and CI for `apps/api`

**Files to modify:**

- `turbo.json`
- `package.json` (root lint-staged)
- `.github/workflows/ci.yml`

**Step 1: Update `turbo.json`**

Add `FOOTBALISTO_LOGO_CDN_URL` to the env list:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"],
      "env": [
        "DRUPAL_API_URL",
        "FOOTBALISTO_API_URL",
        "FOOTBALISTO_LOGO_CDN_URL",
        "REVALIDATION_SECRET"
      ]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "type-check": {
      "dependsOn": ["^build"]
    }
  }
}
```

**Step 2: Update root `package.json` lint-staged**

Add prettier for `apps/api` files (no ESLint config yet):

```json
"lint-staged": {
  "apps/web/**/*.{js,jsx,ts,tsx}": [
    "eslint --fix --config apps/web/eslint.config.mjs",
    "prettier --write"
  ],
  "apps/web/**/*.{json,md,yml,yaml}": [
    "prettier --write"
  ],
  "apps/api/**/*.{js,ts}": [
    "prettier --write"
  ],
  "apps/api/**/*.{json,toml,md}": [
    "prettier --write"
  ],
  "*.{json,md,yml,yaml}": [
    "prettier --write"
  ]
}
```

**Step 3: Update `.github/workflows/ci.yml` quality-checks job**

In the `quality-checks` job, add after the existing `Run tests` step:

```yaml
- name: Type check API
  run: npx turbo type-check --filter=@kcvv/api

- name: Run API tests
  run: npx turbo test --filter=@kcvv/api
```

**Step 4: Add a `deploy-api` job at the bottom of `ci.yml`**

```yaml
deploy-api:
  name: Deploy API to Cloudflare Workers
  runs-on: ubuntu-latest
  needs: [quality-checks, build]
  if: github.event_name == 'push' && github.ref == 'refs/heads/main'

  steps:
    - name: Checkout code
      uses: actions/checkout@v6

    - name: Setup Node.js
      uses: actions/setup-node@v6
      with:
        node-version-file: ".nvmrc"

    - name: Install pnpm
      uses: pnpm/action-setup@v4
      with:
        run_install: false

    - name: Install dependencies
      run: pnpm install --frozen-lockfile

    - name: Build api-contract
      run: npx turbo build --filter=@kcvv/api-contract

    - name: Deploy to Cloudflare Workers
      run: pnpm --filter @kcvv/api deploy
      env:
        CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
        CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
```

**Note:** Add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` in GitHub → Settings → Secrets and variables → Actions (manual browser step, not code).

**Step 5: Commit**

```bash
git add turbo.json package.json .github/workflows/ci.yml
git commit -m "feat(api): add turbo pipeline + CI coverage and deploy for apps/api"
```

---

### Task 4: Port raw Footbalisto schemas to `apps/api`

These are the raw Footbalisto API response shapes — BFF implementation details that never leave `apps/api`. The normalized types (`Match`, `MatchDetail`, etc.) come from `@kcvv/api-contract`.

**Files to create:**

- `apps/api/src/footbalisto/schemas.ts`
- `apps/api/src/footbalisto/schemas.test.ts`

**Step 1: Write the failing test**

Create `apps/api/src/footbalisto/schemas.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { Schema as S } from "effect";
import {
  FootbalistoMatchesArray,
  FootbalistoMatchDetailResponse,
  FootbalistoRankingArray,
} from "./schemas";

const rawMatch = {
  id: 1,
  teamId: 1,
  teamName: "KCVV Elewijt A",
  timestamp: 1737388800,
  age: "Seniors",
  date: "2025-01-15 15:00",
  time: "1970-01-01 15:00",
  homeClub: { id: 123, name: "KCVV Elewijt" },
  awayClub: { id: 456, name: "Opponent FC" },
  goalsHomeTeam: 3,
  goalsAwayTeam: 1,
  homeTeamId: 1,
  awayTeamId: 2,
  status: 1,
  competitionType: "3de Nationale",
  viewGameReport: true,
};

describe("FootbalistoMatchesArray", () => {
  it("decodes a valid match array", () => {
    const result = S.decodeUnknownSync(FootbalistoMatchesArray)([rawMatch]);
    expect(result[0]?.id).toBe(1);
    expect(result[0]?.status).toBe(1);
  });

  it("decodes a match without optional fields (teamId, age)", () => {
    const { teamId: _, age: __, ...minimalMatch } = rawMatch;
    const result = S.decodeUnknownSync(FootbalistoMatchesArray)([minimalMatch]);
    expect(result[0]?.teamId).toBeUndefined();
  });
});

describe("FootbalistoMatchDetailResponse", () => {
  it("decodes a response without lineup", () => {
    const raw = {
      general: {
        id: 1,
        date: "2025-01-15 15:00",
        homeClub: { id: 123, name: "KCVV Elewijt" },
        awayClub: { id: 456, name: "Opponent FC" },
        goalsHomeTeam: 3,
        goalsAwayTeam: 1,
        competitionType: "3de Nationale",
        viewGameReport: true,
        status: 1,
      },
    };
    const result = S.decodeUnknownSync(FootbalistoMatchDetailResponse)(raw);
    expect(result.general.id).toBe(1);
    expect(result.lineup).toBeUndefined();
  });
});

describe("FootbalistoRankingArray", () => {
  it("decodes a ranking response", () => {
    const raw = [
      {
        name: "3de Nationale A",
        type: "LEAGUE",
        teams: [
          {
            id: 1,
            rank: 1,
            matchesPlayed: 20,
            wins: 15,
            draws: 3,
            losses: 2,
            goalsScored: 45,
            goalsConceded: 20,
            points: 48,
            team: {
              id: 101,
              club: {
                id: 123,
                localName: "KCVV Elewijt",
                name: "KCVV Elewijt",
              },
            },
          },
        ],
      },
    ];
    const result = S.decodeUnknownSync(FootbalistoRankingArray)(raw);
    expect(result[0]?.teams[0]?.rank).toBe(1);
  });
});
```

**Step 2: Run — confirm fail**

```bash
pnpm --filter @kcvv/api test
```

Expected: FAIL — `Cannot find module './schemas'`

**Step 3: Create `apps/api/src/footbalisto/schemas.ts`**

Copy the raw Footbalisto schemas verbatim from `apps/web/src/lib/effect/schemas/match.schema.ts` (the `Footbalisto*` classes only — not the normalized types which come from `@kcvv/api-contract`):

```typescript
/**
 * Raw Footbalisto API schemas — BFF implementation details only.
 * Normalized types (Match, MatchDetail, etc.) come from @kcvv/api-contract.
 */
import { Schema as S } from "effect";

export class FootbalistoClub extends S.Class<FootbalistoClub>(
  "FootbalistoClub",
)({
  id: S.Number,
  name: S.String,
  logo: S.optional(S.NullOr(S.String)),
  abbreviation: S.optional(S.NullOr(S.String)),
  logoSmall: S.optional(S.NullOr(S.String)),
  version: S.optional(S.NullOr(S.Number)),
}) {}

export class FootbalistoMatch extends S.Class<FootbalistoMatch>(
  "FootbalistoMatch",
)({
  id: S.Number,
  teamId: S.optional(S.Number), // Only in /matches/next
  teamName: S.optional(S.String), // Only in /matches/next
  timestamp: S.Number,
  age: S.optional(S.String), // Only in /matches/next
  date: S.String, // Format: "YYYY-MM-DD HH:MM"
  time: S.String, // Legacy field
  homeClub: FootbalistoClub,
  awayClub: FootbalistoClub,
  goalsHomeTeam: S.NullOr(S.Number),
  goalsAwayTeam: S.NullOr(S.Number),
  homeTeamId: S.NullOr(S.Number),
  awayTeamId: S.NullOr(S.Number),
  status: S.Number, // 0=scheduled, 1=finished, 2=live, 3=postponed, 4=cancelled
  competitionType: S.String,
  viewGameReport: S.Boolean,
}) {}

export const FootbalistoMatchesArray = S.Array(FootbalistoMatch);

export class FootbalistoRankingClub extends S.Class<FootbalistoRankingClub>(
  "FootbalistoRankingClub",
)({
  id: S.Number,
  localName: S.NullOr(S.String),
  name: S.NullOr(S.String),
}) {}

export class FootbalistoRankingTeam extends S.Class<FootbalistoRankingTeam>(
  "FootbalistoRankingTeam",
)({
  id: S.Number,
  club: FootbalistoRankingClub,
}) {}

export class FootbalistoRankingEntry extends S.Class<FootbalistoRankingEntry>(
  "FootbalistoRankingEntry",
)({
  id: S.Number,
  rank: S.Number,
  matchesPlayed: S.Number,
  wins: S.Number,
  draws: S.Number,
  losses: S.Number,
  goalsScored: S.Number,
  goalsConceded: S.Number,
  points: S.Number,
  team: FootbalistoRankingTeam,
}) {}

export class FootbalistoRankingCompetition extends S.Class<FootbalistoRankingCompetition>(
  "FootbalistoRankingCompetition",
)({
  name: S.String,
  type: S.String,
  teams: S.Array(FootbalistoRankingEntry),
}) {}

export const FootbalistoRankingArray = S.Array(FootbalistoRankingCompetition);

export class FootbalistoEventAction extends S.Class<FootbalistoEventAction>(
  "FootbalistoEventAction",
)({
  type: S.String,
  subtype: S.optional(S.NullOr(S.String)),
  sortOrder: S.optional(S.Number),
  icon: S.optional(S.NullOr(S.String)),
  id: S.optional(S.Number),
}) {}

export class FootbalistoMatchEvent extends S.Class<FootbalistoMatchEvent>(
  "FootbalistoMatchEvent",
)({
  action: FootbalistoEventAction,
  minute: S.optional(S.NullOr(S.Number)),
  playerId: S.optional(S.NullOr(S.Number)),
  playerName: S.optional(S.NullOr(S.String)),
  clubId: S.optional(S.NullOr(S.Number)),
  goalsHome: S.optional(S.NullOr(S.Number)),
  goalsAway: S.optional(S.NullOr(S.Number)),
}) {}

export class FootbalistoLineupPlayer extends S.Class<FootbalistoLineupPlayer>(
  "FootbalistoLineupPlayer",
)({
  number: S.optional(S.NullOr(S.Number)),
  playerName: S.String,
  minutesPlayed: S.optional(S.NullOr(S.Number)),
  captain: S.optional(S.Boolean),
  playerId: S.optional(S.NullOr(S.Number)),
  status: S.optional(S.String),
  changed: S.optional(S.Boolean),
}) {}

export class FootbalistoLineup extends S.Class<FootbalistoLineup>(
  "FootbalistoLineup",
)({
  home: S.Array(FootbalistoLineupPlayer),
  away: S.Array(FootbalistoLineupPlayer),
}) {}

export class FootbalistoMatchDetailGeneral extends S.Class<FootbalistoMatchDetailGeneral>(
  "FootbalistoMatchDetailGeneral",
)({
  id: S.Number,
  date: S.String,
  time: S.optional(S.String),
  homeClub: FootbalistoClub,
  awayClub: FootbalistoClub,
  goalsHomeTeam: S.NullOr(S.Number),
  goalsAwayTeam: S.NullOr(S.Number),
  homeTeamId: S.optional(S.NullOr(S.Number)),
  awayTeamId: S.optional(S.NullOr(S.Number)),
  competitionType: S.String,
  viewGameReport: S.Boolean,
  status: S.Number,
}) {}

export class FootbalistoMatchDetailResponse extends S.Class<FootbalistoMatchDetailResponse>(
  "FootbalistoMatchDetailResponse",
)({
  general: FootbalistoMatchDetailGeneral,
  lineup: S.optional(FootbalistoLineup),
  substitutes: S.optional(FootbalistoLineup),
  events: S.optional(S.Array(FootbalistoMatchEvent)),
}) {}
```

**Step 4: Run tests — confirm pass**

```bash
pnpm --filter @kcvv/api test
```

Expected: PASS (3 describe blocks, all green)

**Step 5: Commit**

```bash
git add apps/api/src/footbalisto/schemas.ts apps/api/src/footbalisto/schemas.test.ts
git commit -m "feat(api): add raw Footbalisto schemas with tests"
```

---

### Task 5: Port transform functions to `apps/api`

Pure functions that convert raw Footbalisto data to normalized `@kcvv/api-contract` types.

**Files to create:**

- `apps/api/src/footbalisto/transforms.ts`
- `apps/api/src/footbalisto/transforms.test.ts`

**Step 1: Write failing tests**

Create `apps/api/src/footbalisto/transforms.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import {
  transformFootbalistoMatch,
  transformFootbalistoMatchDetail,
  transformFootbalistoRankingEntry,
} from "./transforms";
import type {
  FootbalistoMatch,
  FootbalistoRankingEntry,
  FootbalistoMatchDetailResponse,
} from "./schemas";

const rawMatch: FootbalistoMatch = {
  id: 42,
  teamId: 1,
  teamName: "KCVV Elewijt A",
  timestamp: 1737388800,
  age: "Seniors",
  date: "2025-01-15 15:00",
  time: "1970-01-01 15:00",
  homeClub: { id: 123, name: "KCVV Elewijt" },
  awayClub: { id: 456, name: "Opponent FC" },
  goalsHomeTeam: 3,
  goalsAwayTeam: 1,
  homeTeamId: 1,
  awayTeamId: 2,
  status: 1,
  competitionType: "3de Nationale",
  viewGameReport: true,
};

describe("transformFootbalistoMatch", () => {
  it("maps a finished match correctly", () => {
    const result = transformFootbalistoMatch(rawMatch);
    expect(result.id).toBe(42);
    expect(result.status).toBe("finished");
    expect(result.home_team.name).toBe("KCVV Elewijt");
    expect(result.home_team.score).toBe(3);
    expect(result.away_team.score).toBe(1);
    expect(result.time).toBe("15:00");
  });

  it("uses 'A-ploeg' round label for teamId 1", () => {
    const result = transformFootbalistoMatch(rawMatch);
    expect(result.round).toBe("A-ploeg");
  });

  it("uses 'B-ploeg' round label for teamId 2", () => {
    const result = transformFootbalistoMatch({ ...rawMatch, teamId: 2 });
    expect(result.round).toBe("B-ploeg");
  });

  it("uses age string as round label for other team IDs", () => {
    const result = transformFootbalistoMatch({
      ...rawMatch,
      teamId: 5,
      age: "U17",
    });
    expect(result.round).toBe("U17");
  });

  it("maps scheduled (0) with null scores", () => {
    const result = transformFootbalistoMatch({
      ...rawMatch,
      status: 0,
      goalsHomeTeam: null,
      goalsAwayTeam: null,
    });
    expect(result.status).toBe("scheduled");
    expect(result.home_team.score).toBeUndefined();
  });

  it("maps live (2), postponed (3), cancelled (4)", () => {
    expect(transformFootbalistoMatch({ ...rawMatch, status: 2 }).status).toBe(
      "live",
    );
    expect(transformFootbalistoMatch({ ...rawMatch, status: 3 }).status).toBe(
      "postponed",
    );
    expect(transformFootbalistoMatch({ ...rawMatch, status: 4 }).status).toBe(
      "cancelled",
    );
  });
});

describe("transformFootbalistoRankingEntry", () => {
  const rawEntry: FootbalistoRankingEntry = {
    id: 1,
    rank: 3,
    matchesPlayed: 20,
    wins: 12,
    draws: 4,
    losses: 4,
    goalsScored: 38,
    goalsConceded: 22,
    points: 40,
    team: {
      id: 101,
      club: { id: 123, localName: "KCVV Elewijt", name: "KCVV Elewijt" },
    },
  };

  it("maps all ranking fields", () => {
    const result = transformFootbalistoRankingEntry(
      rawEntry,
      "https://cdn.example.com",
    );
    expect(result.position).toBe(3);
    expect(result.team_id).toBe(101);
    expect(result.team_name).toBe("KCVV Elewijt");
    expect(result.team_logo).toBe(
      "https://cdn.example.com/extra_groot/123.png",
    );
    expect(result.goal_difference).toBe(16);
    expect(result.points).toBe(40);
  });

  it("falls back to club name when localName is null", () => {
    const entry = {
      ...rawEntry,
      team: {
        ...rawEntry.team,
        club: { ...rawEntry.team.club, localName: null },
      },
    };
    const result = transformFootbalistoRankingEntry(
      entry,
      "https://cdn.example.com",
    );
    expect(result.team_name).toBe("KCVV Elewijt");
  });
});

describe("transformFootbalistoMatchDetail", () => {
  const rawDetail: FootbalistoMatchDetailResponse = {
    general: {
      id: 99,
      date: "2025-03-01 14:30",
      homeClub: { id: 123, name: "KCVV Elewijt" },
      awayClub: { id: 456, name: "Opponent FC" },
      goalsHomeTeam: 2,
      goalsAwayTeam: 0,
      competitionType: "3de Nationale",
      viewGameReport: true,
      status: 1,
    },
  };

  it("maps match detail without lineup", () => {
    const result = transformFootbalistoMatchDetail(rawDetail);
    expect(result.id).toBe(99);
    expect(result.status).toBe("finished");
    expect(result.hasReport).toBe(true);
    expect(result.lineup).toBeUndefined();
  });

  it("maps lineup players when present", () => {
    const result = transformFootbalistoMatchDetail({
      ...rawDetail,
      lineup: {
        home: [{ playerName: "Jan Janssen", status: "basis", changed: false }],
        away: [{ playerName: "Piet Pieters", status: "basis", changed: false }],
      },
    });
    expect(result.lineup?.home[0]?.name).toBe("Jan Janssen");
    expect(result.lineup?.home[0]?.status).toBe("starter");
  });

  it("marks 'basis + changed' player as substituted", () => {
    const result = transformFootbalistoMatchDetail({
      ...rawDetail,
      lineup: {
        home: [{ playerName: "Jan Janssen", status: "basis", changed: true }],
        away: [],
      },
    });
    expect(result.lineup?.home[0]?.status).toBe("substituted");
  });

  it("adds yellow card from events", () => {
    const result = transformFootbalistoMatchDetail({
      ...rawDetail,
      lineup: {
        home: [
          {
            playerName: "Jan Janssen",
            playerId: 7,
            status: "basis",
            changed: false,
          },
        ],
        away: [],
      },
      events: [{ action: { type: "CARD", subtype: "YELLOW" }, playerId: 7 }],
    });
    expect(result.lineup?.home[0]?.card).toBe("yellow");
  });
});
```

**Step 2: Run — confirm fail**

```bash
pnpm --filter @kcvv/api test
```

Expected: FAIL — `Cannot find module './transforms'`

**Step 3: Create `apps/api/src/footbalisto/transforms.ts`**

Port the transform logic from `apps/web/src/lib/effect/services/FootbalistoService.ts`. Key difference: `transformFootbalistoRankingEntry` takes `logoCdnUrl: string` as a parameter instead of reading `process.env`:

```typescript
import type {
  Match,
  MatchDetail,
  MatchLineupPlayer,
  RankingEntry,
  CardType,
} from "@kcvv/api-contract";
import type {
  FootbalistoMatch,
  FootbalistoLineupPlayer,
  FootbalistoMatchEvent,
  FootbalistoMatchDetailResponse,
  FootbalistoRankingEntry,
} from "./schemas";

type MatchStatusType =
  | "scheduled"
  | "live"
  | "finished"
  | "postponed"
  | "cancelled";

const STATUS_MAP: Record<number, MatchStatusType> = {
  0: "scheduled",
  1: "finished",
  2: "live",
  3: "postponed",
  4: "cancelled",
};

function parseDateString(dateStr: string): { date: Date; time: string } {
  const [datePart, timePart = "00:00"] = dateStr.split(" ");
  const [year, month, day] = datePart!.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);
  return {
    date: new Date(year!, month! - 1, day!, hour, minute),
    time: timePart,
  };
}

function mapNumericStatus(status: number): MatchStatusType {
  return STATUS_MAP[status] ?? "scheduled";
}

export function transformFootbalistoMatch(fbMatch: FootbalistoMatch): Match {
  const { date: matchDate, time: timePart } = parseDateString(fbMatch.date);
  const status = mapNumericStatus(fbMatch.status);

  let roundLabel: string | undefined = fbMatch.age
    ? `${fbMatch.age}`
    : undefined;
  if (fbMatch.teamId === 1) roundLabel = "A-ploeg";
  else if (fbMatch.teamId === 2) roundLabel = "B-ploeg";

  return {
    id: fbMatch.id,
    date: matchDate,
    time: timePart,
    venue: undefined,
    home_team: {
      id: fbMatch.homeTeamId ?? fbMatch.homeClub.id,
      name: fbMatch.homeClub.name,
      logo: fbMatch.homeClub.logo ?? undefined,
      score: fbMatch.goalsHomeTeam ?? undefined,
    },
    away_team: {
      id: fbMatch.awayTeamId ?? fbMatch.awayClub.id,
      name: fbMatch.awayClub.name,
      logo: fbMatch.awayClub.logo ?? undefined,
      score: fbMatch.goalsAwayTeam ?? undefined,
    },
    status,
    round: roundLabel,
    competition: fbMatch.competitionType,
  };
}

function transformLineupStatus(
  status?: string,
  changed?: boolean,
): "starter" | "substitute" | "substituted" | "subbed_in" | "unknown" {
  if (status === "basis") return changed ? "substituted" : "starter";
  if (status === "invaller" || status === "bank")
    return changed ? "subbed_in" : "substitute";
  if (status === "wissel") return "substituted";
  return "unknown";
}

function transformLineupPlayer(
  player: FootbalistoLineupPlayer,
): MatchLineupPlayer {
  return {
    id: player.playerId ?? undefined,
    name: player.playerName,
    number: player.number ?? undefined,
    minutesPlayed: player.minutesPlayed ?? undefined,
    isCaptain: player.captain ?? false,
    status: transformLineupStatus(player.status, player.changed),
  };
}

function parseCardType(event: FootbalistoMatchEvent): CardType | undefined {
  const type = event.action.type.toUpperCase();
  const subtype = event.action.subtype?.toLowerCase();
  if (type !== "CARD") return undefined;
  switch (subtype) {
    case "yellow":
    case "geel":
      return "yellow";
    case "red":
    case "rood":
      return "red";
    case "double_yellow":
    case "yellowred":
    case "tweedegeel":
    case "tweede_geel":
      return "double_yellow";
    default:
      return undefined;
  }
}

function buildPlayerCardMap(
  events: readonly FootbalistoMatchEvent[],
): Map<number, CardType> {
  const cardMap = new Map<number, CardType>();
  for (const event of events) {
    const cardType = parseCardType(event);
    const playerId = event.playerId;
    if (cardType && playerId) {
      const existing = cardMap.get(playerId);
      if (existing === "yellow" && cardType === "yellow") {
        cardMap.set(playerId, "double_yellow");
      } else if (cardType === "red" || cardType === "double_yellow") {
        cardMap.set(playerId, cardType);
      } else if (!existing) {
        cardMap.set(playerId, cardType);
      }
    }
  }
  return cardMap;
}

function transformPlayerWithCard(
  player: FootbalistoLineupPlayer,
  cardMap: Map<number, CardType> | null,
): MatchLineupPlayer {
  const base = transformLineupPlayer(player);
  const card = cardMap && base.id ? cardMap.get(base.id) : undefined;
  return card ? { ...base, card } : base;
}

export function transformFootbalistoMatchDetail(
  response: FootbalistoMatchDetailResponse,
): MatchDetail {
  const general = response.general;
  const { date: matchDate, time: timePart } = parseDateString(general.date);
  const status = mapNumericStatus(general.status);
  const cardMap = response.events ? buildPlayerCardMap(response.events) : null;

  let lineup:
    | { home: MatchLineupPlayer[]; away: MatchLineupPlayer[] }
    | undefined;
  if (response.lineup || response.substitutes) {
    lineup = {
      home: [
        ...(response.lineup?.home ?? []).map((p) =>
          transformPlayerWithCard(p, cardMap),
        ),
        ...(response.substitutes?.home ?? []).map((p) =>
          transformPlayerWithCard(p, cardMap),
        ),
      ],
      away: [
        ...(response.lineup?.away ?? []).map((p) =>
          transformPlayerWithCard(p, cardMap),
        ),
        ...(response.substitutes?.away ?? []).map((p) =>
          transformPlayerWithCard(p, cardMap),
        ),
      ],
    };
  }

  return {
    id: general.id,
    date: matchDate,
    time: timePart,
    venue: undefined,
    home_team: {
      id: general.homeClub.id,
      name: general.homeClub.name,
      logo: general.homeClub.logo ?? undefined,
      score: general.goalsHomeTeam ?? undefined,
    },
    away_team: {
      id: general.awayClub.id,
      name: general.awayClub.name,
      logo: general.awayClub.logo ?? undefined,
      score: general.goalsAwayTeam ?? undefined,
    },
    status,
    competition: general.competitionType,
    lineup,
    hasReport: general.viewGameReport,
  };
}

/** Strip lineup from a MatchDetail to produce a basic Match */
export function matchDetailToMatch(detail: MatchDetail): Match {
  return {
    id: detail.id,
    date: detail.date,
    time: detail.time,
    venue: detail.venue,
    home_team: detail.home_team,
    away_team: detail.away_team,
    status: detail.status,
    round: detail.round,
    competition: detail.competition,
  };
}

/** logoCdnUrl: e.g. "https://dfaozfi7c7f3s.cloudfront.net/logos" (no trailing slash) */
export function transformFootbalistoRankingEntry(
  entry: FootbalistoRankingEntry,
  logoCdnUrl: string,
): RankingEntry {
  const teamName =
    entry.team.club.localName || entry.team.club.name || "Unknown Team";
  return {
    position: entry.rank,
    team_id: entry.team.id,
    team_name: teamName,
    team_logo: `${logoCdnUrl}/extra_groot/${entry.team.club.id}.png`,
    played: entry.matchesPlayed,
    won: entry.wins,
    drawn: entry.draws,
    lost: entry.losses,
    goals_for: entry.goalsScored,
    goals_against: entry.goalsConceded,
    goal_difference: entry.goalsScored - entry.goalsConceded,
    points: entry.points,
    form: undefined,
  };
}
```

**Step 4: Run tests — confirm pass**

```bash
pnpm --filter @kcvv/api test
```

Expected: PASS — all transform tests green

**Step 5: Commit**

```bash
git add apps/api/src/footbalisto/transforms.ts apps/api/src/footbalisto/transforms.test.ts
git commit -m "feat(api): port Footbalisto transform functions with tests"
```

---

### Task 6: Worker env type and KV cache service

**Files to create:**

- `apps/api/src/env.ts`
- `apps/api/src/cache/kv-cache.ts`
- `apps/api/src/cache/kv-cache.test.ts`

**Step 1: Write the failing test**

Create `apps/api/src/cache/kv-cache.test.ts`:

```typescript
import { describe, it, expect, vi } from "vitest";
import { Effect, Layer } from "effect";
import { KvCacheService, KvCacheLive } from "./kv-cache";
import { WorkerEnvTag } from "../env";

function makeMockKv() {
  const store = new Map<string, string>();
  return {
    get: vi.fn(async (key: string) => store.get(key) ?? null),
    put: vi.fn(async (key: string, value: string) => {
      store.set(key, value);
    }),
    store,
  };
}

function makeEnvLayer(mockKv: ReturnType<typeof makeMockKv>) {
  return Layer.succeed(WorkerEnvTag, {
    FOOTBALISTO_API_URL: "https://footbalisto.be",
    FOOTBALISTO_LOGO_CDN_URL: "https://cdn.example.com",
    PSD_CACHE: mockKv as unknown as KVNamespace,
  });
}

describe("KvCacheService", () => {
  it("returns null on a cache miss", async () => {
    const mockKv = makeMockKv();
    const program = Effect.gen(function* () {
      const cache = yield* KvCacheService;
      return yield* cache.get("missing-key");
    });
    const result = await Effect.runPromise(
      program.pipe(
        Effect.provide(KvCacheLive),
        Effect.provide(makeEnvLayer(mockKv)),
      ),
    );
    expect(result).toBeNull();
  });

  it("stores and retrieves a value with correct TTL", async () => {
    const mockKv = makeMockKv();
    const program = Effect.gen(function* () {
      const cache = yield* KvCacheService;
      yield* cache.set("test-key", "hello", 60);
      return yield* cache.get("test-key");
    });
    const result = await Effect.runPromise(
      program.pipe(
        Effect.provide(KvCacheLive),
        Effect.provide(makeEnvLayer(mockKv)),
      ),
    );
    expect(result).toBe("hello");
    expect(mockKv.put).toHaveBeenCalledWith("test-key", "hello", {
      expirationTtl: 60,
    });
  });
});
```

**Step 2: Run — confirm fail**

```bash
pnpm --filter @kcvv/api test
```

Expected: FAIL — `Cannot find module './kv-cache'` and `Cannot find module '../env'`

**Step 3: Create `apps/api/src/env.ts`**

```typescript
import { Context } from "effect";

export interface WorkerEnv {
  readonly FOOTBALISTO_API_URL: string;
  readonly FOOTBALISTO_LOGO_CDN_URL: string;
  readonly PSD_CACHE: KVNamespace;
}

export class WorkerEnvTag extends Context.Tag("WorkerEnv")<
  WorkerEnvTag,
  WorkerEnv
>() {}
```

**Step 4: Create `apps/api/src/cache/kv-cache.ts`**

```typescript
import { Context, Effect, Layer } from "effect";
import { WorkerEnvTag } from "../env";

/** Per-endpoint TTLs in seconds */
export const TTL = {
  MATCHES_TEAM: 60 * 60, // 1 hour — season schedule rarely changes
  NEXT_MATCHES: 60, // 60 seconds — freshness on match day
  MATCH_DETAIL_PAST: 60 * 60 * 24 * 7, // 7 days — historical, never changes
  MATCH_DETAIL_LIVE: 60, // 60 seconds — live match updates
  RANKING: 60 * 60, // 1 hour — updates after each match day
  STATS: 60 * 60 * 6, // 6 hours — occasional updates
} as const;

export interface KvCacheInterface {
  readonly get: (key: string) => Effect.Effect<string | null>;
  readonly set: (
    key: string,
    value: string,
    ttl: number,
  ) => Effect.Effect<void>;
}

export class KvCacheService extends Context.Tag("KvCacheService")<
  KvCacheService,
  KvCacheInterface
>() {}

export const KvCacheLive = Layer.effect(
  KvCacheService,
  Effect.gen(function* () {
    const env = yield* WorkerEnvTag;
    return {
      get: (key: string) =>
        Effect.tryPromise({
          try: () => env.PSD_CACHE.get(key),
          catch: () => null,
        }).pipe(Effect.orElseSucceed(() => null)),
      set: (key: string, value: string, ttl: number) =>
        Effect.tryPromise({
          try: () => env.PSD_CACHE.put(key, value, { expirationTtl: ttl }),
          catch: () => undefined,
        }).pipe(Effect.orElseSucceed(() => undefined)),
    };
  }),
);
```

**Step 5: Run tests — confirm pass**

```bash
pnpm --filter @kcvv/api test
```

Expected: PASS

**Step 6: Commit**

```bash
git add apps/api/src/env.ts apps/api/src/cache/kv-cache.ts apps/api/src/cache/kv-cache.test.ts
git commit -m "feat(api): add WorkerEnv tag and KV cache service with tests"
```

---

### Task 7: Footbalisto HTTP client service

**Files to create:**

- `apps/api/src/footbalisto/client.ts`
- `apps/api/src/footbalisto/client.test.ts`

**Step 1: Write failing tests**

Create `apps/api/src/footbalisto/client.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Effect, Layer } from "effect";
import {
  FootbalistoClient,
  FootbalistoClientLive,
  FootbalistoError,
} from "./client";
import { WorkerEnvTag } from "../env";

global.fetch = vi.fn();

function makeEnvLayer(baseUrl = "https://footbalisto.be") {
  return Layer.succeed(WorkerEnvTag, {
    FOOTBALISTO_API_URL: baseUrl,
    FOOTBALISTO_LOGO_CDN_URL: "https://cdn.example.com",
    PSD_CACHE: {} as KVNamespace,
  });
}

const rawMatch = {
  id: 1,
  teamId: 1,
  teamName: "KCVV A",
  timestamp: 1737388800,
  age: "Seniors",
  date: "2025-01-15 15:00",
  time: "1970-01-01 01:00",
  homeClub: { id: 123, name: "KCVV Elewijt" },
  awayClub: { id: 456, name: "Opponent FC" },
  goalsHomeTeam: 3,
  goalsAwayTeam: 1,
  homeTeamId: 1,
  awayTeamId: 2,
  status: 1,
  competitionType: "3de Nationale",
  viewGameReport: true,
};

beforeEach(() => vi.clearAllMocks());

describe("FootbalistoClient", () => {
  it("getRawMatches fetches /matches/:teamId", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => [rawMatch],
    });

    const program = Effect.gen(function* () {
      const client = yield* FootbalistoClient;
      return yield* client.getRawMatches(123);
    });

    const result = await Effect.runPromise(
      program.pipe(
        Effect.provide(FootbalistoClientLive),
        Effect.provide(makeEnvLayer()),
      ),
    );

    expect(result[0]?.id).toBe(1);
    expect(global.fetch).toHaveBeenCalledWith(
      "https://footbalisto.be/matches/123",
      expect.objectContaining({ headers: { Accept: "application/json" } }),
    );
  });

  it("getRawMatches fails with FootbalistoError on HTTP error", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 503,
      statusText: "Service Unavailable",
    });

    const program = Effect.gen(function* () {
      const client = yield* FootbalistoClient;
      return yield* client.getRawMatches(123);
    }).pipe(Effect.flip);

    const error = await Effect.runPromise(
      program.pipe(
        Effect.provide(FootbalistoClientLive),
        Effect.provide(makeEnvLayer()),
      ),
    );

    expect(error).toBeInstanceOf(FootbalistoError);
    expect((error as FootbalistoError).status).toBe(503);
  });

  it("getRawNextMatches fetches /matches/next", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => [rawMatch],
    });

    const program = Effect.gen(function* () {
      const client = yield* FootbalistoClient;
      return yield* client.getRawNextMatches();
    });

    const result = await Effect.runPromise(
      program.pipe(
        Effect.provide(FootbalistoClientLive),
        Effect.provide(makeEnvLayer()),
      ),
    );

    expect(result[0]?.id).toBe(1);
    expect(global.fetch).toHaveBeenCalledWith(
      "https://footbalisto.be/matches/next",
      expect.anything(),
    );
  });
});
```

**Step 2: Run — confirm fail**

```bash
pnpm --filter @kcvv/api test
```

Expected: FAIL — `Cannot find module './client'`

**Step 3: Create `apps/api/src/footbalisto/client.ts`**

```typescript
import { Context, Effect, Layer } from "effect";
import { Schema as S } from "effect";
import { TeamStats } from "@kcvv/api-contract";
import { WorkerEnvTag } from "../env";
import {
  FootbalistoMatchesArray,
  FootbalistoMatchDetailResponse,
  FootbalistoRankingArray,
  type FootbalistoMatch,
  type FootbalistoMatchDetailResponse as RawDetailResponse,
  type FootbalistoRankingCompetition,
} from "./schemas";

export class FootbalistoError extends Error {
  readonly _tag = "FootbalistoError" as const;
  constructor(
    message: string,
    readonly status?: number,
    readonly cause?: unknown,
  ) {
    super(message);
    this.name = "FootbalistoError";
  }
}

export class FootbalistoValidationError extends Error {
  readonly _tag = "FootbalistoValidationError" as const;
  constructor(
    message: string,
    readonly cause?: unknown,
  ) {
    super(message);
    this.name = "FootbalistoValidationError";
  }
}

export type FootbalistoClientError =
  | FootbalistoError
  | FootbalistoValidationError;

export interface FootbalistoClientInterface {
  readonly getRawMatches: (
    teamId: number,
  ) => Effect.Effect<readonly FootbalistoMatch[], FootbalistoClientError>;
  readonly getRawNextMatches: () => Effect.Effect<
    readonly FootbalistoMatch[],
    FootbalistoClientError
  >;
  readonly getRawMatchDetail: (
    matchId: number,
  ) => Effect.Effect<RawDetailResponse, FootbalistoClientError>;
  readonly getRawRanking: (
    teamId: number,
  ) => Effect.Effect<
    readonly FootbalistoRankingCompetition[],
    FootbalistoClientError
  >;
  readonly getRawTeamStats: (
    teamId: number,
  ) => Effect.Effect<typeof TeamStats.Type, FootbalistoClientError>;
}

export class FootbalistoClient extends Context.Tag("FootbalistoClient")<
  FootbalistoClient,
  FootbalistoClientInterface
>() {}

function fetchJson<A, I>(url: string, schema: S.Schema<A, I>) {
  return Effect.gen(function* () {
    const response = yield* Effect.tryPromise({
      try: () => fetch(url, { headers: { Accept: "application/json" } }),
      catch: (cause) =>
        new FootbalistoError(`Failed to fetch ${url}`, undefined, cause),
    });

    if (!response.ok) {
      return yield* Effect.fail(
        new FootbalistoError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status,
        ),
      );
    }

    const json = yield* Effect.tryPromise({
      try: () => response.json(),
      catch: (cause) =>
        new FootbalistoError("Failed to parse JSON", undefined, cause),
    });

    return yield* S.decodeUnknown(schema)(json).pipe(
      Effect.mapError(
        (cause) =>
          new FootbalistoValidationError("Schema validation failed", cause),
      ),
    );
  });
}

export const FootbalistoClientLive = Layer.effect(
  FootbalistoClient,
  Effect.gen(function* () {
    const env = yield* WorkerEnvTag;
    const base = env.FOOTBALISTO_API_URL;

    return {
      getRawMatches: (teamId) =>
        fetchJson(`${base}/matches/${teamId}`, FootbalistoMatchesArray),
      getRawNextMatches: () =>
        fetchJson(`${base}/matches/next`, FootbalistoMatchesArray),
      getRawMatchDetail: (matchId) =>
        fetchJson(`${base}/match/${matchId}`, FootbalistoMatchDetailResponse),
      getRawRanking: (teamId) =>
        fetchJson(`${base}/ranking/${teamId}`, FootbalistoRankingArray),
      getRawTeamStats: (teamId) =>
        fetchJson(`${base}/stats/team/${teamId}`, TeamStats),
    };
  }),
);
```

**Step 4: Run tests — confirm pass**

```bash
pnpm --filter @kcvv/api test
```

Expected: PASS

**Step 5: Commit**

```bash
git add apps/api/src/footbalisto/client.ts apps/api/src/footbalisto/client.test.ts
git commit -m "feat(api): add FootbalistoClient service with tests"
```

---

### Task 8: Implement MatchesApi handler

**Files to create:**

- `apps/api/src/handlers/matches.ts`
- `apps/api/src/handlers/matches.test.ts`

**Step 1: Write failing tests**

Create `apps/api/src/handlers/matches.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { Effect, Layer } from "effect";
import {
  getMatchesByTeamHandler,
  getNextMatchesHandler,
  getMatchByIdHandler,
  getMatchDetailHandler,
} from "./matches";
import {
  FootbalistoClient,
  type FootbalistoClientInterface,
} from "../footbalisto/client";
import { KvCacheService, type KvCacheInterface } from "../cache/kv-cache";

const rawMatch = {
  id: 1,
  teamId: 1,
  teamName: "KCVV A",
  timestamp: 1737388800,
  age: "Seniors",
  date: "2025-01-15 15:00",
  time: "1970-01-01 01:00",
  homeClub: { id: 123, name: "KCVV Elewijt" },
  awayClub: { id: 456, name: "Opponent FC" },
  goalsHomeTeam: 3,
  goalsAwayTeam: 1,
  homeTeamId: 1,
  awayTeamId: 2,
  status: 1,
  competitionType: "3de Nationale",
  viewGameReport: true,
} as const;

const rawDetail = {
  general: {
    id: 99,
    date: "2025-01-15 15:00",
    homeClub: { id: 123, name: "KCVV Elewijt" },
    awayClub: { id: 456, name: "Opponent FC" },
    goalsHomeTeam: 2,
    goalsAwayTeam: 0,
    competitionType: "3de Nationale",
    viewGameReport: true,
    status: 1,
  },
} as const;

function makeClientMock(): FootbalistoClientInterface {
  return {
    getRawMatches: (_teamId) => Effect.succeed([rawMatch]),
    getRawNextMatches: () =>
      Effect.succeed([rawMatch, { ...rawMatch, id: 2, teamId: 23 }]), // teamId 23 = Weitse Gans (should be filtered)
    getRawMatchDetail: (_matchId) => Effect.succeed(rawDetail),
    getRawRanking: () => Effect.succeed([]),
    getRawTeamStats: () => Effect.fail(new Error("not needed") as never),
  };
}

function makeCacheMock(): KvCacheInterface {
  return {
    get: () => Effect.succeed(null),
    set: () => Effect.succeed(undefined),
  };
}

function provide<A, E>(
  effect: Effect.Effect<A, E, FootbalistoClient | KvCacheService>,
) {
  return effect.pipe(
    Effect.provide(Layer.succeed(FootbalistoClient, makeClientMock())),
    Effect.provide(Layer.succeed(KvCacheService, makeCacheMock())),
  );
}

describe("getMatchesByTeamHandler", () => {
  it("transforms raw matches", async () => {
    const result = await Effect.runPromise(provide(getMatchesByTeamHandler(1)));
    expect(result[0]?.id).toBe(1);
    expect(result[0]?.status).toBe("finished");
    expect(result[0]?.home_team.name).toBe("KCVV Elewijt");
  });
});

describe("getNextMatchesHandler", () => {
  it("filters out teamId 23 (Weitse Gans)", async () => {
    const result = await Effect.runPromise(provide(getNextMatchesHandler()));
    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe(1);
  });
});

describe("getMatchDetailHandler", () => {
  it("returns MatchDetail with hasReport", async () => {
    const result = await Effect.runPromise(provide(getMatchDetailHandler(99)));
    expect(result.id).toBe(99);
    expect(result.hasReport).toBe(true);
  });
});

describe("getMatchByIdHandler", () => {
  it("returns a basic Match (no lineup)", async () => {
    const result = await Effect.runPromise(provide(getMatchByIdHandler(99)));
    expect(result.id).toBe(99);
    expect("lineup" in result).toBe(false);
  });
});
```

**Step 2: Run — confirm fail**

```bash
pnpm --filter @kcvv/api test
```

Expected: FAIL — `Cannot find module './matches'`

**Step 3: Create `apps/api/src/handlers/matches.ts`**

```typescript
import { Effect } from "effect";
import { HttpApiBuilder } from "@effect/platform";
import { PsdApi, type Match, type MatchDetail } from "@kcvv/api-contract";
import {
  FootbalistoClient,
  type FootbalistoClientError,
} from "../footbalisto/client";
import { KvCacheService, TTL } from "../cache/kv-cache";
import {
  transformFootbalistoMatch,
  transformFootbalistoMatchDetail,
  matchDetailToMatch,
} from "../footbalisto/transforms";

export const getMatchesByTeamHandler = (
  teamId: number,
): Effect.Effect<
  readonly Match[],
  FootbalistoClientError,
  FootbalistoClient | KvCacheService
> =>
  Effect.gen(function* () {
    const client = yield* FootbalistoClient;
    const cache = yield* KvCacheService;
    const cacheKey = `matches:team:${teamId}`;

    const cached = yield* cache.get(cacheKey);
    if (cached) return JSON.parse(cached) as readonly Match[];

    const rawMatches = yield* client.getRawMatches(teamId);
    const matches = rawMatches.map(transformFootbalistoMatch);
    yield* cache.set(cacheKey, JSON.stringify(matches), TTL.MATCHES_TEAM);
    return matches;
  });

export const getNextMatchesHandler = (): Effect.Effect<
  readonly Match[],
  FootbalistoClientError,
  FootbalistoClient | KvCacheService
> =>
  Effect.gen(function* () {
    const client = yield* FootbalistoClient;
    const cache = yield* KvCacheService;
    const cacheKey = "matches:next";

    const cached = yield* cache.get(cacheKey);
    if (cached) return JSON.parse(cached) as readonly Match[];

    const rawMatches = yield* client.getRawNextMatches();
    // Filter out Weitse Gans (teamId 23) — not KCVV but plays on KCVV pitch
    const matches = rawMatches
      .filter((m) => m.teamId !== 23)
      .map(transformFootbalistoMatch);
    yield* cache.set(cacheKey, JSON.stringify(matches), TTL.NEXT_MATCHES);
    return matches;
  });

export const getMatchByIdHandler = (
  matchId: number,
): Effect.Effect<
  Match,
  FootbalistoClientError,
  FootbalistoClient | KvCacheService
> =>
  Effect.gen(function* () {
    const client = yield* FootbalistoClient;
    const rawDetail = yield* client.getRawMatchDetail(matchId);
    return matchDetailToMatch(transformFootbalistoMatchDetail(rawDetail));
  });

export const getMatchDetailHandler = (
  matchId: number,
): Effect.Effect<
  MatchDetail,
  FootbalistoClientError,
  FootbalistoClient | KvCacheService
> =>
  Effect.gen(function* () {
    const client = yield* FootbalistoClient;
    const cache = yield* KvCacheService;
    const cacheKey = `match:detail:${matchId}`;

    const cached = yield* cache.get(cacheKey);
    if (cached) return JSON.parse(cached) as MatchDetail;

    const rawDetail = yield* client.getRawMatchDetail(matchId);
    const detail = transformFootbalistoMatchDetail(rawDetail);
    // Finished matches are immutable — cache 7 days. Live/upcoming — 60 seconds.
    const ttl =
      detail.status === "finished"
        ? TTL.MATCH_DETAIL_PAST
        : TTL.MATCH_DETAIL_LIVE;
    yield* cache.set(cacheKey, JSON.stringify(detail), ttl);
    return detail;
  });

export const MatchesApiLive = HttpApiBuilder.group(
  PsdApi,
  "matches",
  (handlers) =>
    handlers
      .handle("getMatchesByTeam", ({ path: { teamId } }) =>
        getMatchesByTeamHandler(teamId),
      )
      .handle("getNextMatches", () => getNextMatchesHandler())
      .handle("getMatchById", ({ path: { matchId } }) =>
        getMatchByIdHandler(matchId),
      )
      .handle("getMatchDetail", ({ path: { matchId } }) =>
        getMatchDetailHandler(matchId),
      ),
);
```

**Step 4: Run tests — confirm pass**

```bash
pnpm --filter @kcvv/api test
```

Expected: PASS

**Step 5: Commit**

```bash
git add apps/api/src/handlers/matches.ts apps/api/src/handlers/matches.test.ts
git commit -m "feat(api): implement MatchesApi handler with KV caching and tests"
```

---

### Task 9: Implement RankingApi and StatsApi handlers

**Files to create:**

- `apps/api/src/handlers/ranking.ts`
- `apps/api/src/handlers/ranking.test.ts`
- `apps/api/src/handlers/stats.ts`
- `apps/api/src/handlers/stats.test.ts`

**Step 1: Write failing test for ranking**

Create `apps/api/src/handlers/ranking.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { Effect, Layer } from "effect";
import { getRankingHandler } from "./ranking";
import {
  FootbalistoClient,
  type FootbalistoClientInterface,
} from "../footbalisto/client";
import { KvCacheService, type KvCacheInterface } from "../cache/kv-cache";

const rawCompetitions = [
  {
    name: "3de Nationale A",
    type: "LEAGUE",
    teams: [
      {
        id: 1,
        rank: 1,
        matchesPlayed: 20,
        wins: 15,
        draws: 3,
        losses: 2,
        goalsScored: 45,
        goalsConceded: 20,
        points: 48,
        team: {
          id: 101,
          club: { id: 123, localName: "KCVV Elewijt", name: "KCVV Elewijt" },
        },
      },
    ],
  },
  { name: "Beker", type: "CUP", teams: [] }, // should be skipped
];

function makeClientMock(
  overrides: Partial<FootbalistoClientInterface> = {},
): FootbalistoClientInterface {
  return {
    getRawMatches: () => Effect.succeed([]),
    getRawNextMatches: () => Effect.succeed([]),
    getRawMatchDetail: () => Effect.fail(new Error("not needed") as never),
    getRawRanking: () => Effect.succeed(rawCompetitions),
    getRawTeamStats: () => Effect.fail(new Error("not needed") as never),
    ...overrides,
  };
}

const cacheMock: KvCacheInterface = {
  get: () => Effect.succeed(null),
  set: () => Effect.succeed(undefined),
};

describe("getRankingHandler", () => {
  it("returns ranking from first non-CUP/FRIENDLY competition", async () => {
    const result = await Effect.runPromise(
      getRankingHandler(1, "https://cdn.example.com").pipe(
        Effect.provide(Layer.succeed(FootbalistoClient, makeClientMock())),
        Effect.provide(Layer.succeed(KvCacheService, cacheMock)),
      ),
    );
    expect(result[0]?.position).toBe(1);
    expect(result[0]?.team_name).toBe("KCVV Elewijt");
    expect(result[0]?.points).toBe(48);
  });

  it("returns empty array when no competition has teams", async () => {
    const result = await Effect.runPromise(
      getRankingHandler(1, "https://cdn.example.com").pipe(
        Effect.provide(
          Layer.succeed(
            FootbalistoClient,
            makeClientMock({
              getRawRanking: () =>
                Effect.succeed([{ name: "Cup", type: "CUP", teams: [] }]),
            }),
          ),
        ),
        Effect.provide(Layer.succeed(KvCacheService, cacheMock)),
      ),
    );
    expect(result).toHaveLength(0);
  });
});
```

**Step 2: Create `apps/api/src/handlers/ranking.ts`**

```typescript
import { Effect } from "effect";
import { HttpApiBuilder } from "@effect/platform";
import { PsdApi, type RankingEntry } from "@kcvv/api-contract";
import {
  FootbalistoClient,
  type FootbalistoClientError,
} from "../footbalisto/client";
import { KvCacheService, TTL } from "../cache/kv-cache";
import { WorkerEnvTag } from "../env";
import { transformFootbalistoRankingEntry } from "../footbalisto/transforms";

export const getRankingHandler = (
  teamId: number,
  logoCdnUrl: string,
): Effect.Effect<
  readonly RankingEntry[],
  FootbalistoClientError,
  FootbalistoClient | KvCacheService
> =>
  Effect.gen(function* () {
    const client = yield* FootbalistoClient;
    const cache = yield* KvCacheService;
    const cacheKey = `ranking:team:${teamId}`;

    const cached = yield* cache.get(cacheKey);
    if (cached) return JSON.parse(cached) as readonly RankingEntry[];

    const competitions = yield* client.getRawRanking(teamId);

    const competition =
      competitions.find(
        (c) => c.teams.length > 0 && c.type !== "CUP" && c.type !== "FRIENDLY",
      ) ?? competitions.find((c) => c.teams.length > 0);

    if (!competition || competition.teams.length === 0) {
      return [] as readonly RankingEntry[];
    }

    const ranking = competition.teams.map((e) =>
      transformFootbalistoRankingEntry(e, logoCdnUrl),
    );
    yield* cache.set(cacheKey, JSON.stringify(ranking), TTL.RANKING);
    return ranking;
  });

export const RankingApiLive = HttpApiBuilder.group(
  PsdApi,
  "ranking",
  (handlers) =>
    handlers.handle("getRanking", ({ path: { teamId } }) =>
      Effect.gen(function* () {
        const env = yield* WorkerEnvTag;
        return yield* getRankingHandler(teamId, env.FOOTBALISTO_LOGO_CDN_URL);
      }),
    ),
);
```

**Step 3: Write failing test for stats**

Create `apps/api/src/handlers/stats.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { Effect, Layer } from "effect";
import { getTeamStatsHandler } from "./stats";
import {
  FootbalistoClient,
  type FootbalistoClientInterface,
} from "../footbalisto/client";
import { KvCacheService, type KvCacheInterface } from "../cache/kv-cache";

const mockStats = {
  team_id: 1,
  team_name: "KCVV Elewijt A",
  total_matches: 25,
  wins: 18,
  draws: 4,
  losses: 3,
  goals_scored: 55,
  goals_conceded: 22,
};

function makeClientMock(): FootbalistoClientInterface {
  return {
    getRawMatches: () => Effect.succeed([]),
    getRawNextMatches: () => Effect.succeed([]),
    getRawMatchDetail: () => Effect.fail(new Error("not needed") as never),
    getRawRanking: () => Effect.succeed([]),
    getRawTeamStats: (_teamId) => Effect.succeed(mockStats),
  };
}

const cacheMock: KvCacheInterface = {
  get: () => Effect.succeed(null),
  set: () => Effect.succeed(undefined),
};

describe("getTeamStatsHandler", () => {
  it("returns team stats", async () => {
    const result = await Effect.runPromise(
      getTeamStatsHandler(1).pipe(
        Effect.provide(Layer.succeed(FootbalistoClient, makeClientMock())),
        Effect.provide(Layer.succeed(KvCacheService, cacheMock)),
      ),
    );
    expect(result.team_id).toBe(1);
    expect(result.team_name).toBe("KCVV Elewijt A");
    expect(result.wins).toBe(18);
  });
});
```

**Step 4: Create `apps/api/src/handlers/stats.ts`**

```typescript
import { Effect } from "effect";
import { HttpApiBuilder } from "@effect/platform";
import {
  PsdApi,
  TeamStats,
  type TeamStats as TeamStatsType,
} from "@kcvv/api-contract";
import {
  FootbalistoClient,
  type FootbalistoClientError,
} from "../footbalisto/client";
import { KvCacheService, TTL } from "../cache/kv-cache";

export const getTeamStatsHandler = (
  teamId: number,
): Effect.Effect<
  TeamStatsType,
  FootbalistoClientError,
  FootbalistoClient | KvCacheService
> =>
  Effect.gen(function* () {
    const client = yield* FootbalistoClient;
    const cache = yield* KvCacheService;
    const cacheKey = `stats:team:${teamId}`;

    const cached = yield* cache.get(cacheKey);
    if (cached) return JSON.parse(cached) as TeamStatsType;

    const stats = yield* client.getRawTeamStats(teamId);
    yield* cache.set(cacheKey, JSON.stringify(stats), TTL.STATS);
    return stats;
  });

export const StatsApiLive = HttpApiBuilder.group(PsdApi, "stats", (handlers) =>
  handlers.handle("getTeamStats", ({ path: { teamId } }) =>
    getTeamStatsHandler(teamId),
  ),
);
```

**Step 5: Run all tests — confirm pass**

```bash
pnpm --filter @kcvv/api test
```

Expected: PASS — all suites green

**Step 6: Commit**

```bash
git add apps/api/src/handlers/ranking.ts apps/api/src/handlers/ranking.test.ts apps/api/src/handlers/stats.ts apps/api/src/handlers/stats.test.ts
git commit -m "feat(api): implement RankingApi and StatsApi handlers with tests"
```

---

### Task 10: Wire the Worker entry point and smoke test

**Files to create:**

- `apps/api/src/index.ts`

**Step 1: Create `apps/api/src/index.ts`**

```typescript
/**
 * KCVV API — Cloudflare Worker BFF
 *
 * Implements PsdApi from @kcvv/api-contract using HttpApiBuilder.
 * Proxies Footbalisto API calls with Cloudflare KV caching.
 */
import { HttpApiBuilder, HttpApp, HttpMiddleware } from "@effect/platform";
import { Layer } from "effect";
import { PsdApi } from "@kcvv/api-contract";
import { WorkerEnvTag, type WorkerEnv } from "./env";
import { FootbalistoClientLive } from "./footbalisto/client";
import { KvCacheLive } from "./cache/kv-cache";
import { MatchesApiLive } from "./handlers/matches";
import { RankingApiLive } from "./handlers/ranking";
import { StatsApiLive } from "./handlers/stats";

function buildAppLayer(env: WorkerEnv) {
  return HttpApiBuilder.api(PsdApi).pipe(
    Layer.provide(MatchesApiLive),
    Layer.provide(RankingApiLive),
    Layer.provide(StatsApiLive),
    Layer.provide(FootbalistoClientLive),
    Layer.provide(KvCacheLive),
    Layer.provide(Layer.succeed(WorkerEnvTag, env)),
  );
}

export default {
  async fetch(request: Request, env: WorkerEnv): Promise<Response> {
    return HttpApp.toWebHandler(
      HttpApiBuilder.serve().pipe(
        HttpMiddleware.cors(),
        Layer.provide(buildAppLayer(env)),
      ),
    )(request);
  },
};
```

**Step 2: Type-check**

```bash
pnpm --filter @kcvv/api type-check
```

Expected: exits 0. Fix any type errors before continuing.

**Step 3: Manual smoke test with wrangler dev**

```bash
cd apps/api && npx wrangler dev
```

In a second terminal, test each endpoint:

```bash
# Next matches
curl -s http://localhost:8787/matches/next | head -c 200

# Team matches (teamId 1 = A-ploeg)
curl -s http://localhost:8787/matches/1 | head -c 200

# Ranking
curl -s http://localhost:8787/ranking/1 | head -c 200

# Stats
curl -s http://localhost:8787/stats/team/1 | head -c 200
```

Expected: each endpoint returns a JSON array/object matching the `@kcvv/api-contract` schema shapes. Stop dev server with Ctrl+C.

**Step 4: Commit**

```bash
git add apps/api/src/index.ts
git commit -m "feat(api): wire Cloudflare Worker entry point with HttpApiBuilder"
```

---

### Task 11: Create `apps/api/CLAUDE.md` and push

**Step 1: Create `apps/api/CLAUDE.md`**

```markdown
# apps/api — Cloudflare Worker BFF

Implements `PsdApi` from `@kcvv/api-contract` using Effect `HttpApiBuilder`. Proxies Footbalisto API with Cloudflare KV caching.

## Structure

src/
├── index.ts ← Worker entry — HttpApp.toWebHandler + HttpApiBuilder.serve
├── env.ts ← WorkerEnv type + WorkerEnvTag (injected per request)
├── footbalisto/
│ ├── schemas.ts ← Raw Footbalisto API schemas (never leave this package)
│ ├── transforms.ts ← Pure transform functions: raw Footbalisto → @kcvv/api-contract types
│ └── client.ts ← FootbalistoClient service — outbound HTTP to footbalisto.be
├── cache/
│ └── kv-cache.ts ← KvCacheService — Cloudflare KV get/set with TTL constants
└── handlers/
├── matches.ts ← MatchesApi: getMatchesByTeam, getNextMatches, getMatchById, getMatchDetail
├── ranking.ts ← RankingApi: getRanking
└── stats.ts ← StatsApi: getTeamStats

## Rules

- No `.js` extensions in imports — `moduleResolution: "bundler"` (Wrangler/esbuild compatible)
- Worker env is injected via `Layer.succeed(WorkerEnvTag, env)` in `index.ts` — do NOT read `process.env`
- Raw Footbalisto schemas stay in `src/footbalisto/schemas.ts` — normalized types come from `@kcvv/api-contract`
- KV cache is always attempted before hitting Footbalisto API
- `getNextMatches` filters out teamId 23 (Weitse Gans — not KCVV, plays on KCVV pitch)

## Local dev

pnpm --filter @kcvv/api dev # wrangler dev on localhost:8787
pnpm --filter @kcvv/api test # vitest unit tests
pnpm --filter @kcvv/api type-check

## Deployment

pnpm --filter @kcvv/api deploy # wrangler deploy (requires CLOUDFLARE_API_TOKEN in env)

## TTL Reference

| Endpoint              | TTL        |
| --------------------- | ---------- |
| /matches/:teamId      | 1 hour     |
| /matches/next         | 60 seconds |
| /match/:id (finished) | 7 days     |
| /match/:id (other)    | 60 seconds |
| /ranking/:teamId      | 1 hour     |
| /stats/team/:id       | 6 hours    |

## Learnings

(Append Footbalisto/Cloudflare gotchas here as discovered)
```

**Step 2: Commit and push**

```bash
git add apps/api/CLAUDE.md
git commit -m "docs(api): add CLAUDE.md for apps/api Cloudflare Worker"
git push -u origin feat/phase-2-bff-cloudflare-workers
```

---

## Phase 2b: Switch `apps/web` to the BFF client

> **Wait:** Complete Phase 2a → merge to main → validate deployed Worker in production for at least one day before starting Phase 2b. The Worker runs in parallel with the existing direct Footbalisto calls.

---

### Task 12: Implement `BffServiceLive` in `apps/web`

`BffServiceLive` implements the existing `FootbalistoService` interface using `HttpApiClient.make(PsdApi)`. This means **zero changes to any page or component** — only the runtime layer changes.

**Files to create:**

- `apps/web/src/lib/effect/services/BffService.ts`
- `apps/web/src/lib/effect/services/BffService.test.ts`

**Step 1: Write failing test**

Create `apps/web/src/lib/effect/services/BffService.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Effect } from "effect";
import { BffService, BffServiceLive } from "./BffService";

global.fetch = vi.fn();

beforeEach(() => vi.clearAllMocks());

describe("BffService.getMatches", () => {
  it("calls /matches/:teamId and returns Match array", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => [
        {
          id: 1,
          date: new Date("2025-01-15T15:00:00.000Z").toISOString(),
          time: "15:00",
          home_team: { id: 123, name: "KCVV Elewijt" },
          away_team: { id: 456, name: "Opponent FC" },
          status: "finished",
          competition: "3de Nationale",
        },
      ],
    });

    const program = Effect.gen(function* () {
      const bff = yield* BffService;
      return yield* bff.getMatches(1);
    });

    const result = await Effect.runPromise(
      program.pipe(Effect.provide(BffServiceLive)),
    );

    expect(result[0]?.id).toBe(1);
    expect(result[0]?.status).toBe("finished");
  });
});
```

**Step 2: Run — confirm fail**

```bash
pnpm --filter @kcvv/web test src/lib/effect/services/BffService.test.ts
```

Expected: FAIL — `Cannot find module './BffService'`

**Step 3: Add `BFF_URL` env variable**

Add to `apps/web/.env.local` (create the file if it does not exist):

```
BFF_URL=http://localhost:8787
```

For production, set `BFF_URL=https://kcvv-api.<your-subdomain>.workers.dev` in Vercel environment variables.

**Step 4: Create `apps/web/src/lib/effect/services/BffService.ts`**

`BffService` uses the same `"FootbalistoService"` Context.Tag string so it satisfies the same type constraints — no page changes needed.

```typescript
/**
 * BFF Service — replaces FootbalistoServiceLive with typed HttpApiClient calls to apps/api.
 *
 * Uses the same FootbalistoService Context.Tag so all pages stay unchanged.
 * Switch runtime.ts to use BffServiceLive instead of FootbalistoServiceLive.
 */
import { Context, Effect, Layer } from "effect";
import { HttpApiClient, FetchHttpClient } from "@effect/platform";
import { PsdApi } from "@kcvv/api-contract";
import type { FootbalistoService } from "./FootbalistoService";
import { FootbalistoError, ValidationError } from "../schemas";

// Re-use the same tag string so BffService satisfies FootbalistoService constraints
export class BffService extends Context.Tag("FootbalistoService")<
  BffService,
  typeof FootbalistoService.Service
>() {}

function mapError(error: unknown): FootbalistoError | ValidationError {
  if (
    error != null &&
    typeof error === "object" &&
    "_tag" in error &&
    error._tag === "ParseError"
  ) {
    return new ValidationError({
      message: "BFF response validation failed",
      errors: error,
    });
  }
  return new FootbalistoError({
    message: error instanceof Error ? error.message : "BFF request failed",
    cause: error,
  });
}

export const BffServiceLive = Layer.effect(
  BffService,
  Effect.gen(function* () {
    const baseUrl = process.env.BFF_URL ?? "https://api.kcvvelewijt.be";

    const client = yield* HttpApiClient.make(PsdApi, { baseUrl }).pipe(
      Effect.provide(FetchHttpClient.layer),
    );

    return {
      getMatches: (teamId: number) =>
        client.matches
          .getMatchesByTeam({ path: { teamId } })
          .pipe(Effect.mapError(mapError)),

      getNextMatches: () =>
        client.matches.getNextMatches().pipe(Effect.mapError(mapError)),

      getMatchById: (matchId: number) =>
        client.matches
          .getMatchById({ path: { matchId } })
          .pipe(Effect.mapError(mapError)),

      getMatchDetail: (matchId: number) =>
        client.matches
          .getMatchDetail({ path: { matchId } })
          .pipe(Effect.mapError(mapError)),

      getRanking: (teamId: number) =>
        client.ranking
          .getRanking({ path: { teamId } })
          .pipe(Effect.mapError(mapError)),

      getTeamStats: (teamId: number) =>
        client.stats
          .getTeamStats({ path: { teamId } })
          .pipe(Effect.mapError(mapError)),

      clearCache: () => Effect.succeed(undefined),
    };
  }),
);
```

**Step 5: Run tests — confirm pass**

```bash
pnpm --filter @kcvv/web test src/lib/effect/services/BffService.test.ts
```

Expected: PASS

**Step 6: Commit**

```bash
git add apps/web/src/lib/effect/services/BffService.ts apps/web/src/lib/effect/services/BffService.test.ts
git commit -m "feat(web): add BffServiceLive — typed HttpApiClient wrapper for apps/api"
```

---

### Task 13: Swap `runtime.ts` to use `BffServiceLive`

**Files to modify:**

- `apps/web/src/lib/effect/runtime.ts`

**Step 1: Update `runtime.ts`**

Replace the `FootbalistoServiceLive` import and usage with `BffServiceLive`:

```typescript
import { Effect, Layer, ManagedRuntime } from "effect";
import { DrupalService, DrupalServiceLive } from "./services/DrupalService";
import { FootbalistoService } from "./services/FootbalistoService";
import { BffService, BffServiceLive } from "./services/BffService";

export const AppLayer = Layer.mergeAll(DrupalServiceLive, BffServiceLive);

export const runtime = ManagedRuntime.make(AppLayer);

export const runPromise = <A, E>(
  effect: Effect.Effect<A, E, DrupalService | FootbalistoService | BffService>,
) => runtime.runPromise(effect);

export const runPromiseWithLogging = <A, E>(
  effect: Effect.Effect<A, E, DrupalService | FootbalistoService | BffService>,
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

export { DrupalService, FootbalistoService };
```

**Step 2: Run the full test suite**

```bash
pnpm --filter @kcvv/web test
```

Expected: all existing tests pass. If any test mocked `FOOTBALISTO_API_URL`, update to mock `BFF_URL` instead.

**Step 3: Build verification**

```bash
pnpm turbo build --filter=@kcvv/web
```

Expected: build succeeds.

**Step 4: Commit**

```bash
git add apps/web/src/lib/effect/runtime.ts
git commit -m "feat(web): switch runtime to BffServiceLive — pages now call the Cloudflare Worker BFF"
```

---

### Task 14: E2E smoke test and final push

**Step 1: Run BFF and Next.js together**

Terminal 1 — start the Worker locally:

```bash
pnpm --filter @kcvv/api dev
```

Terminal 2 — start Next.js:

```bash
pnpm --filter @kcvv/web dev
```

Open http://localhost:3000 and manually verify:

- [ ] Homepage shows upcoming matches (from `/matches/next`)
- [ ] A team page (`/team/[slug]`) shows matches and ranking
- [ ] A game page (`/game/[matchId]`) shows match detail

**Step 2: Confirm Footbalisto env var removed from Next.js**

```bash
grep -r "FOOTBALISTO_API_URL" apps/web/src/
```

Expected: no results (this env var is now only consumed by `apps/api`).

**Step 3: Update Vercel environment variables (manual browser step)**

In Vercel project settings → Environment Variables:

- Add `BFF_URL` = `https://kcvv-api.<your-workers-subdomain>.workers.dev`
- Remove `FOOTBALISTO_API_URL` (no longer consumed by `apps/web`)

**Step 4: Push and open PR**

```bash
git push
# Open a PR on GitHub: feat/phase-2-bff-cloudflare-workers → main
```

---

## Post-merge follow-up (outside this plan)

- Decommission AWS Lambda, API Gateway, DynamoDB (requires AWS console access)
- Archive `kcvv-api-psd` CodeCommit repo
- Monitor Cloudflare KV hit/miss ratio in the Workers dashboard
- Remove `FootbalistoServiceLive` import from `runtime.ts` after a stable period
