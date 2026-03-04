# KCVV Platform Architecture Design

**Date:** 2026-03-03
**Status:** Approved
**Scope:** Full platform overhaul — monorepo, BFF API migration, CMS replacement, cost elimination

---

## 1. Executive Summary

The current KCVV platform consists of four separate repositories spanning two languages, three hosting providers, and one CMS — with no shared types, a polling-based AWS Lambda cache costing €20-30/month, and a Drupal instance nobody trusts to update. This document defines the target architecture that consolidates everything into a single TypeScript monorepo, eliminates all hosting costs, replaces Drupal with Sanity CMS, and migrates the BFF from AWS Lambda to a typed Effect HTTP server on Cloudflare Workers.

**Outcome:** €0/month hosting, shared Effect Schema types across the full stack, a proper CMS with image support, and a single Claude Code session that understands the entire platform.

---

## 2. Current State

### Active Repositories

| Repo                  | Language             | Host                    | Purpose                                        |
| --------------------- | -------------------- | ----------------------- | ---------------------------------------------- |
| `kcvv-nextjs`         | TypeScript           | Vercel                  | Primary website (Gatsby migration in progress) |
| `kcvv-api-psd`        | JavaScript (untyped) | AWS CodeCommit + Lambda | BFF — ProSoccerData proxy, DynamoDB cache      |
| `kcvv-data-api`       | PHP                  | Unknown host            | Drupal CMS (hands-off, content-only)           |
| `KCVV-Elewijt-Gatsby` | TypeScript           | Netlify                 | Legacy site (being replaced)                   |

### Pain Points

- **€20-30/month** on AWS API Gateway + Lambda + DynamoDB for a cache that proactively pulls all ProSoccerData (even data never accessed)
- **No shared types** between the BFF and the frontend — types duplicated or absent
- **Drupal CMS** is untrusted (hosting issues), requires PHP knowledge, serves as a fragile dependency for articles and events
- **Organigram and some club content** are hardcoded in Markdown/JS files — not editable without a code deploy
- **No unified Claude Code context** — cross-project features require switching sessions and manually re-explaining architecture
- **Four separate CI/CD pipelines** with no coordination

---

## 3. Target Architecture

### Repository Structure

```
kcvv-nextjs/ (becomes monorepo root, kept on same GitHub repo)
├── apps/
│   ├── web/              ← Next.js 16 website (moved from repo root)
│   └── studio/           ← Sanity Studio v3 (new)
├── packages/
│   └── api-contract/     ← Shared Effect Schema types + HttpApi definition (new)
├── turbo.json
├── package.json          ← workspace root
└── CLAUDE.md             ← root-level cross-project context
```

> `kcvv-api` (Cloudflare Worker) lives in a **separate repository** because Cloudflare Workers deployment tooling (Wrangler) has different CI requirements from Turborepo-managed apps. It consumes `packages/api-contract` via a published package or workspace reference.

### Data Flow

```
Browser
  └─► Next.js (apps/web, Vercel)
        ├─► Sanity CDN          — articles, sponsors, events, organigram, club pages
        │     (direct @sanity/client, no proxy needed — public CDN)
        └─► KCVV API (kcvv-api, Cloudflare Workers)
              ├─► Cloudflare KV   — cache for ProSoccerData responses
              └─► ProSoccerData   — matches, players, teams, rankings (on cache miss)
```

### Hosting

| Service                               | Provider                  | Cost         |
| ------------------------------------- | ------------------------- | ------------ |
| `apps/web` (Next.js)                  | Vercel (existing)         | €0           |
| `kcvv-api` (Effect BFF)               | Cloudflare Workers        | €0           |
| `apps/studio` (Sanity Studio)         | Sanity.io hosted / Vercel | €0           |
| Sanity content API + assets           | Sanity free tier          | €0           |
| KV cache (PSD responses)              | Cloudflare KV             | €0           |
| AWS (Lambda + API Gateway + DynamoDB) | **Decommissioned**        | €0           |
| **Total**                             |                           | **€0/month** |

---

## 4. Technology Decisions

### 4.1 Monorepo Tooling — Turborepo

Turborepo is the standard monorepo tool for Next.js-based projects (same Vercel ecosystem). It provides:

- Remote caching of build and test outputs
- Parallel task execution across workspaces
- `turbo.json` pipeline that understands dependencies between packages

### 4.2 BFF Framework — Effect `@effect/platform` + `HttpApiBuilder`

The ProSoccerData BFF is rewritten in TypeScript using Effect's `HttpApiBuilder`. This gives us:

- **`packages/api-contract/`** defines `HttpApi` with Effect Schema — the single source of truth for all PSD endpoint shapes
- **`kcvv-api/`** implements the contract with `HttpApiBuilder.implement(PsdApi)`
- **`apps/web/`** consumes it with `HttpApiClient.make(PsdApi)` — fully typed, autocomplete, no manual fetch

Effect's `@effect/platform` HTTP server is compatible with Cloudflare Workers via `HttpApp.toWebHandler`, which converts any Effect HTTP app to a standard Web API `fetch` handler (the native Cloudflare Workers interface).

```typescript
// packages/api-contract/src/index.ts
export class PsdApi extends HttpApi.make("psd")
  .add(MatchesApi)
  .add(PlayersApi)
  .add(TeamsApi)
  .add(RankingApi) {}

// kcvv-api/src/index.ts — Cloudflare Worker entry
export default {
  fetch: HttpApp.toWebHandler(
    HttpApiBuilder.serve(PsdApi).pipe(
      Layer.provide(PsdApiLive),
      Layer.provide(CloudflareKvCacheLive),
    ),
  ),
};
```

### 4.3 API Caching — Cloudflare KV

Replaces DynamoDB as the cache layer for PSD responses. Key differences from the current approach:

|           | Current (DynamoDB)                   | New (Cloudflare KV)              |
| --------- | ------------------------------------ | -------------------------------- |
| Strategy  | Proactive: pull ALL data on schedule | Reactive: cache on first request |
| Cost      | ~€15-20/month                        | €0 (100k reads/day free)         |
| Cold data | Cached even if never accessed        | Never fetched if not accessed    |
| TTL       | Manually managed                     | Native KV TTL per entry          |

### 4.4 CMS — Sanity v3

Replaces Drupal for all editable content. Chosen because:

- Built-in Studio UI handles rich text, image uploads (100GB free), structured content types
- Free tier: 10,000 documents, 100GB assets, 1M CDN API requests/month, 20 users
- Image pipeline: Sanity CDN + URL builder is fully compatible with `next/image`
- TypeScript-first schema definition
- No server to maintain (fully managed)
- Datasets are public on the free tier — acceptable for a football club's public content

**Content types managed in Sanity:**

| Type          | Replaces              | Key fields                                                               |
| ------------- | --------------------- | ------------------------------------------------------------------------ |
| `article`     | Drupal news           | title, slug, body (portable text), author, publishedAt, coverImage, tags |
| `sponsor`     | DynamoDB / hardcoded  | name, logo, url, tier (main/gold/silver), active                         |
| `event`       | Drupal events         | title, description, date, location, category                             |
| `staffMember` | Hardcoded JS/Markdown | name, role, photo, department, bio                                       |
| `page`        | Drupal / hardcoded    | title, slug, body (portable text) — club history, privacy policy, etc.   |

### 4.5 Frontend — Next.js (unchanged stack)

`apps/web/` is the current `kcvv-nextjs` repo moved into the monorepo. No changes to the framework, routing, or design system. Data fetching changes:

- **PSD data:** switch from `fetch(process.env.API_URL + '/...')` → `HttpApiClient.make(PsdApi)` — fully typed
- **Sanity data:** add `@sanity/client` + `next-sanity` for server component queries with ISR revalidation
- **Drupal data:** removed after Sanity migration is complete

### 4.6 Admin UI — Sanity Studio v3

`apps/studio/` is a standard Sanity Studio v3 project co-located in the monorepo. Deployed to `studio.kcvv.be`. The schema lives in the repo alongside the frontend — content type definitions are version-controlled and reviewed like code. Authentication uses Sanity's built-in Google/GitHub OAuth.

---

## 5. Package: `api-contract`

This package is the cornerstone of the type-safe stack. It is the only place where PSD response shapes are defined.

```
packages/api-contract/
├── src/
│   ├── schemas/
│   │   ├── match.ts        ← MatchResult, MatchDetail, MatchEvent Effect schemas
│   │   ├── player.ts       ← Player, PlayerStats
│   │   ├── team.ts         ← Team, TeamStanding
│   │   └── ranking.ts      ← RankingEntry
│   ├── api/
│   │   ├── matches.ts      ← HttpApiGroup for /matches endpoints
│   │   ├── players.ts      ← HttpApiGroup for /players endpoints
│   │   ├── teams.ts        ← HttpApiGroup for /teams endpoints
│   │   └── ranking.ts      ← HttpApiGroup for /ranking endpoints
│   └── index.ts            ← PsdApi root export
└── package.json
```

The existing Effect schemas in `apps/web/src/lib/schemas/` are migrated here — they are already Effect Schema so this is largely a move + namespace cleanup, not a rewrite.

---

## 6. BFF Logic Migration

The current Lambda functions implement two key behaviours that must be preserved in the Effect Worker:

### 6.1 Endpoint Combining

Some pages require data from multiple PSD endpoints combined into a single response (e.g. match detail = match record + both lineups + match events). Currently this combining logic is buried in Lambda handlers. In the Effect Worker it becomes explicit, testable `Effect.all` compositions:

```typescript
const getMatchDetail = (matchId: string) =>
  Effect.all({
    match: PsdClient.getMatch(matchId),
    homeLineup: PsdClient.getLineup(matchId, "home"),
    awayLineup: PsdClient.getLineup(matchId, "away"),
    events: PsdClient.getMatchEvents(matchId),
  });
```

### 6.2 Auth Wrapping

The PSD API key is injected server-side via a Cloudflare Worker secret (equivalent to a Lambda environment variable), accessed via `env.PSD_API_KEY` in the Worker context and provided to the Effect `HttpClient` layer at startup.

### 6.3 Caching Strategy

Replace the "pull everything on a schedule" pattern with reactive per-endpoint TTL caching in Cloudflare KV:

| Endpoint category      | TTL        | Rationale                       |
| ---------------------- | ---------- | ------------------------------- |
| Match results (past)   | 7 days     | Historical — never changes      |
| Live / today's matches | 60 seconds | Freshness required on match day |
| Season rankings        | 1 hour     | Updates after each match        |
| Player / team profiles | 24 hours   | Rarely changes mid-season       |
| Squad lists            | 6 hours    | Occasional transfer updates     |

---

## 7. Sanity Content Migration

Drupal content is migrated once to Sanity. No ongoing sync. After migration Drupal is decommissioned.

### Migration Script

A one-time Node.js script at `scripts/migrate-drupal-to-sanity.ts`:

1. Fetches all content from Drupal JSON:API (already integrated in the Next.js site — reuse existing service layer)
2. Transforms to Sanity document format
3. Creates documents via Sanity client bulk import
4. Downloads and re-uploads media assets to Sanity Assets

Manual review in Sanity Studio follows the import to clean up any formatting or missing fields.

### Switchover

Next.js pages switch from Drupal → Sanity one content type at a time (articles first, then events, then pages). Each switch is a separate PR. The old Drupal service files are deleted once all types are migrated.

---

## 8. CLAUDE.md Structure

The monorepo gets a layered CLAUDE.md hierarchy so a Claude Code session from the root has full platform context, while per-app sessions stay focused:

```
CLAUDE.md                          ← Platform overview, all services, git workflow, costs
apps/web/CLAUDE.md                 ← Next.js specifics, routes, design system rules (existing)
apps/studio/CLAUDE.md              ← Sanity schema conventions, content type rules
packages/api-contract/CLAUDE.md   ← Schema authoring rules, Effect HttpApi conventions
```

The `kcvv-api` repo gets its own `CLAUDE.md` covering Cloudflare Workers conventions, Wrangler config, and KV cache patterns.

---

## 9. CI/CD

### Turborepo Affected-Only Pipelines

```yaml
- name: Test affected workspaces
  run: npx turbo test --filter='[HEAD^1]'

- name: Build affected workspaces
  run: npx turbo build --filter='[HEAD^1]'
```

Only changed packages and their dependents are tested/built on each PR.

### Deployment Triggers

| App           | Trigger                       | Target                          |
| ------------- | ----------------------------- | ------------------------------- |
| `apps/web`    | Merge to main                 | Vercel (automatic, existing)    |
| `apps/studio` | Merge to main                 | Vercel / sanity.io (automatic)  |
| `kcvv-api`    | Merge to main (separate repo) | Cloudflare Workers via Wrangler |

### Repository Visibility

Keep the repository **public**. All secrets (PSD API key, Sanity token, Cloudflare API token) are stored in GitHub Secrets — never committed. Benefits of staying public:

- **Unlimited GitHub Actions minutes** (private repos: 2,000/month free)
- **Free CodeQL** security scanning (`codeql.yml` continues to work)
- No code sensitivity risk — a football club website has no proprietary logic

---

## 10. Migration Sequence

Each phase keeps the live site fully functional throughout.

### Phase 0 — Monorepo Setup

- Add Turborepo to `kcvv-nextjs` root (`turbo.json`, root `package.json` workspace config)
- Move Next.js source into `apps/web/` (update all relative paths, `tsconfig.json`, Vercel config)
- Create empty `packages/api-contract/` with build setup
- Verify Vercel deployment works from new structure
- Archive `KCVV-Elewijt-Gatsby` repo on GitHub

### Phase 1 — API Contract Package

- Migrate existing Effect schemas from `apps/web/src/lib/schemas/` → `packages/api-contract/src/schemas/`
- Define `HttpApi` groups for all PSD endpoints currently consumed by the frontend
- Update `apps/web/` imports to come from `packages/api-contract`
- Frontend still calls old AWS API — no runtime change yet

### Phase 2 — Effect BFF on Cloudflare Workers

- Create `kcvv-api` GitHub repository
- Implement `HttpApiBuilder.implement(PsdApi)` with Cloudflare KV caching
- Migrate endpoint-combining logic from Lambda → Effect `Effect.all`
- Deploy to Cloudflare Workers, run in parallel with AWS for a short validation window
- Switch `apps/web/` to call new BFF via `HttpApiClient.make(PsdApi)`
- Decommission AWS (Lambda, API Gateway, DynamoDB, CodeCommit)

### Phase 3 — Sanity CMS

- Initialise Sanity project, define all schemas in `apps/studio/`
- Set up `@sanity/client` + `next-sanity` in `apps/web/`
- Write and run Drupal → Sanity migration script
- Review migrated content in Studio
- Switch Next.js pages from Drupal JSON:API → Sanity (one content type per PR)
- Decommission Drupal dependency from `apps/web/`

### Phase 4+ — Ongoing Site Migration

Continue existing migration phases with the full typed stack available:

- Calendar & Events (#517) — events now editable in Sanity Studio
- Club Information Pages (#518) — organigram now dynamic via Sanity `staffMember` type
- Search & Utility (#519)
- Kiosk Mode (#520)

---

## 11. Cost Summary

| Item                                    | Before           | After        |
| --------------------------------------- | ---------------- | ------------ |
| AWS (API Gateway + Lambda + DynamoDB)   | €20-30/month     | €0           |
| Vercel (Next.js)                        | €0               | €0           |
| Cloudflare Workers + KV                 | —                | €0           |
| Sanity (CMS + Studio + CDN + assets)    | —                | €0           |
| GitHub Actions (public repo, unlimited) | €0               | €0           |
| **Total**                               | **€20-30/month** | **€0/month** |

**Annual saving: €240-360.**

---

## 12. Open Questions / Future Decisions

- **Sanity dataset privacy:** Free tier is public-only. If member-only content is ever needed, gate at Next.js middleware layer (check session before fetching) rather than upgrading Sanity tier.
- **`kcvv-api` monorepo inclusion:** Kept separate now due to Wrangler tooling. If Turborepo + Wrangler integration matures, `apps/api/` can move into the monorepo without breaking changes.
- **Kiosk mode (#520):** If it needs its own deployment unit, add as `apps/kiosk/` in the monorepo.
- **Admin UI beyond Sanity Studio:** If custom CRUD forms are ever needed (beyond what Sanity handles), Cloudflare Access (free ≤50 users, email OTP) is the preferred auth solution for an `apps/admin/` Next.js app.
