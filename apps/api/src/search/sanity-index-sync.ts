import { createClient } from "@sanity/client";
import { Array as Arr, Effect, Schedule } from "effect";
import { WorkerEnvTag } from "../env";
import { sanityClientConfig } from "../sanity/config";
import {
  HARD_TTL_LONG,
  KvCacheService,
  type KvCacheInterface,
} from "../cache/kv-cache";
import { datasetIndexMismatch } from "./dataset-index-guard";
import { EmbeddingService } from "./embedding";
import {
  ARTICLE_INDEX_PROJECTION,
  ARTICLE_PUBLISHED_FILTER,
  PAGE_INDEX_PROJECTION,
  RESPONSIBILITY_ACTIVE_FILTER,
  RESPONSIBILITY_INDEX_PROJECTION,
  buildArticleIndexText,
  buildArticleMetadata,
  buildPageIndexText,
  buildPageMetadata,
  buildResponsibilityIndexText,
  buildResponsibilityMetadata,
} from "./index-queries";
import { VectorizeService, type VectorRecord } from "./vectorize";

// ─── Types (only fields needed for indexing) ──────────────────────────────────

interface SanityResponsibilityDoc {
  _id: string;
  slug: string;
  title: string;
  question: string;
  keywords: string[];
  summary: string;
}

interface SanityArticleDoc {
  _id: string;
  slug: string;
  title: string;
  lead: string;
  tags: string[];
  prose: string;
  qaQuestions: string[];
  qaAnswers: string;
  tableHtml: string[];
  imageUrl: string | null;
}

interface SanityPageDoc {
  _id: string;
  slug: string;
  title: string;
  bodyText: string | null;
  fileAttachmentLabels: string[];
}

// ─── Sanity GROQ queries ─────────────────────────────────────────────────────

const RESPONSIBILITY_QUERY = `*[_type == "responsibility" && ${RESPONSIBILITY_ACTIVE_FILTER}] {
  ${RESPONSIBILITY_INDEX_PROJECTION}
}`;

// Exported for the test that pins the `publishedAt` field name — the
// reconciliation injects its fetcher, so nothing else exercises this string.
export const ARTICLE_QUERY = `*[_type == "article" && ${ARTICLE_PUBLISHED_FILTER}] {
  ${ARTICLE_INDEX_PROJECTION}
}`;

const PAGE_QUERY = `*[_type == "page"] {
  ${PAGE_INDEX_PROJECTION}
}`;

// ─── Batching ────────────────────────────────────────────────────────────────

// Vectorize caps a binding upsert at 1000 vectors/request. Its write-ahead log
// handles one batch at a time and does not queue concurrent writes, so chunks
// go out sequentially — parallel upserts contend for that slot and surface as
// 40041 Too Many Requests.
const MAX_VECTORS_PER_UPSERT = 1000;

// Belt-and-suspenders for a transient limit; batching is what removes the burst.
const UPSERT_RETRY = Schedule.exponential("100 millis").pipe(
  Schedule.jittered,
  Schedule.intersect(Schedule.recurs(3)),
);

// Same platform limit as upsert — deleteByIds is a request over the same
// Vectorize binding, so batching and retrying it the same way is the
// documented behaviour, not a guess (matches webhooks/index-handler.ts's
// single-id deleteByIds call, batched here because a sweep's delete set can
// exceed one id).
const MAX_IDS_PER_DELETE = MAX_VECTORS_PER_UPSERT;
const DELETE_RETRY = UPSERT_RETRY;

// ─── Reconciliation (#2831) ────────────────────────────────────────────────
//
// Vectorize exposes exactly upsert / query / getByIds / deleteByIds — no
// list, no scan, no cursor (@cloudflare/workers-types VectorizeIndex). A
// delete must always be addressed by an id this worker already knows, so
// "what should be pruned" has to come from somewhere other than the index.
//
// Chosen mechanism: after a sweep whose Sanity fetches ALL succeeded, write
// the id set it just saw (across all three types) to KV as a manifest. The
// next sweep deletes `previousManifest − currentIds` — anything the last
// successful sweep saw that this one no longer does. That covers every way
// a document can drop out of its query without the sweep needing to know
// which one happened: it expired (`unpublishAt`), it was deactivated
// (`active == false`, RESPONSIBILITY_ACTIVE_FILTER), or it was deleted from
// Sanity outright.
//
// What it does NOT cover: a vector that predates the first manifest this
// mechanism ever writes. Nothing can name that id after the fact — Vectorize
// has no list-ids call, and if the Sanity document is also gone, nothing
// there names it either. Cleaning up that pre-existing population is a
// separate, one-off, manually-run exercise (see the PR description for the
// measured count) — a recurring diff can only prune drift from the point it
// starts running, never retroactively.
//
// Cost per sweep: one extra KV read + one KV write (a single JSON array of
// ids — currently ~200, far under KV's 25 MB value cap), plus
// ceil(prunedCount / MAX_IDS_PER_DELETE) additional deleteByIds calls.
// Nightly drift is normally zero to a handful of ids; even the one-time
// backlog measured on this issue (37) is a single batch.
const MANIFEST_KEY = "search-index:manifest";

// Reuses PSD_CACHE rather than provisioning a dedicated KV namespace for a
// ~200-id list: no new wrangler.toml binding, nothing for a human to create
// before merge.
// ponytail: revisit only if PSD_CACHE's own eviction/TTL policy (built for
// PSD response caching) ever conflicts with a value this sweep expects to
// persist indefinitely — HARD_TTL_LONG (365 days) is refreshed every
// successful sweep, so in practice it never lapses on a nightly cron.
const readManifest = (
  kvCache: KvCacheInterface,
): Effect.Effect<string[] | null> =>
  kvCache.get(MANIFEST_KEY).pipe(
    Effect.map((raw) => {
      if (raw === null) return null;
      try {
        const parsed = JSON.parse(raw) as unknown;
        return Array.isArray(parsed)
          ? parsed.filter((id): id is string => typeof id === "string")
          : null;
      } catch {
        return null;
      }
    }),
  );

const writeManifest = (kvCache: KvCacheInterface, ids: readonly string[]) =>
  kvCache.set(MANIFEST_KEY, JSON.stringify(ids), HARD_TTL_LONG);

// ─── Options ─────────────────────────────────────────────────────────────────

interface SyncOptions {
  fetchResponsibility?: () => Promise<SanityResponsibilityDoc[]>;
  fetchArticles?: () => Promise<SanityArticleDoc[]>;
  fetchPages?: () => Promise<SanityPageDoc[]>;
}

// ─── Sync effect ─────────────────────────────────────────────────────────────

export const runSanityIndexSync = (options?: SyncOptions) =>
  Effect.gen(function* () {
    const env = yield* WorkerEnvTag;

    // Refuse the whole run when this worker's dataset doesn't match its
    // configured index (#2833). This job is unreachable on staging today
    // (`env.staging.triggers.crons` is `[]`) — but that is the same "no
    // cron" reasoning this issue was filed to retire for the webhook, and
    // it stops being true the moment anything triggers this run manually
    // (see the staging backfill instructions in apps/api/CLAUDE.md).
    const mismatch = datasetIndexMismatch(env);
    if (mismatch) {
      return yield* Effect.fail(
        new Error(`[search-sync] refusing to sync: ${mismatch}`),
      );
    }

    const embedding = yield* EmbeddingService;
    const vectorize = yield* VectorizeService;
    const kvCache = yield* KvCacheService;

    // Fails safe: anything other than the literal "false" is dry-run, so an
    // absent var (local dev, a test that doesn't set it) or a typo never
    // silently starts deleting production vectors (#2831).
    const dryRun = env.SEARCH_INDEX_PRUNE_DRY_RUN !== "false";

    // Set false by either degraded-fetch branch below. Gates the whole
    // reconciliation step at the end of this sweep — see the comment there
    // for why a partial sweep must never diff or delete.
    let reconciliationSafe = true;

    let _sanityClient: ReturnType<typeof createClient> | undefined;
    const sanityClient = () =>
      (_sanityClient ??= createClient({
        ...sanityClientConfig(env),
        useCdn: false,
        perspective: "published",
      }));

    // A failed embedding drops just its own document from the batch.
    const embedDoc = (
      id: string,
      text: string,
      metadata: Record<string, string>,
    ) =>
      embedding.embed(text).pipe(
        Effect.map((values): VectorRecord | null => ({ id, values, metadata })),
        Effect.catchAll((e) =>
          Effect.log(`[search-sync] skipped ${id}: ${String(e)}`).pipe(
            Effect.as(null),
          ),
        ),
      );

    /**
     * Upserts the embedded documents in ≤1000-sized chunks, skipping the ones
     * that failed to embed. Returns how many vectors landed.
     */
    const upsertBatched = (
      embedded: (VectorRecord | null)[],
      label: string,
    ) => {
      const vectors = embedded.filter((v) => v !== null);
      return Effect.forEach(
        Arr.chunksOf(vectors, MAX_VECTORS_PER_UPSERT),
        (chunk) =>
          vectorize.upsert(chunk).pipe(
            Effect.retry(UPSERT_RETRY),
            Effect.as(chunk.length),
            Effect.catchAll((e) =>
              Effect.logError(
                `[search-sync] Upsert failed after retries — dropped ${chunk.length} of ${vectors.length} ${label}: ${String(e)}`,
              ).pipe(Effect.as(0)),
            ),
          ),
        { concurrency: 1 },
      ).pipe(Effect.map((landed) => landed.reduce((total, n) => total + n, 0)));
    };

    /**
     * Deletes ids in ≤1000-sized chunks, sequentially — same shape as
     * upsertBatched, same reason (one write-ahead-log slot per index). A
     * chunk that keeps failing after retries is logged and skipped rather
     * than aborting the rest: a stuck delete must not block the sweep, the
     * same tradeoff upsertBatched already makes.
     */
    const deleteBatched = (ids: readonly string[]) =>
      Effect.forEach(
        Arr.chunksOf(ids, MAX_IDS_PER_DELETE),
        (chunk) =>
          vectorize.deleteByIds([...chunk]).pipe(
            Effect.retry(DELETE_RETRY),
            Effect.catchAll((e) =>
              Effect.logError(
                `[search-sync] Prune failed after retries — could not delete ${chunk.length} of ${ids.length} orphaned vectors: ${String(e)}`,
              ),
            ),
          ),
        { concurrency: 1, discard: true },
      );

    // ── Responsibility paths ──────────────────────────────────────────────

    const fetchResponsibility =
      options?.fetchResponsibility ??
      (() =>
        sanityClient().fetch<SanityResponsibilityDoc[]>(RESPONSIBILITY_QUERY));

    const docs = yield* Effect.tryPromise({
      try: fetchResponsibility,
      catch: (e) => new Error(`Sanity fetch failed: ${String(e)}`),
    });

    yield* Effect.log(
      `[search-sync] Indexing ${docs.length} responsibility paths`,
    );

    const responsibilityVectors = yield* Effect.forEach(
      docs,
      (doc) =>
        embedDoc(
          doc._id,
          buildResponsibilityIndexText(doc),
          buildResponsibilityMetadata(doc),
        ),
      { concurrency: 5 },
    );

    const successCount = yield* upsertBatched(
      responsibilityVectors,
      "responsibility paths",
    );

    yield* Effect.log(
      `[search-sync] Indexed ${successCount}/${docs.length} responsibility paths`,
    );

    // ── Articles ──────────────────────────────────────────────────────────

    const fetchArticles =
      options?.fetchArticles ??
      (() => sanityClient().fetch<SanityArticleDoc[]>(ARTICLE_QUERY));

    const articleResult = yield* Effect.tryPromise({
      try: fetchArticles,
      catch: (e) => new Error(`Sanity article fetch failed: ${String(e)}`),
    }).pipe(
      Effect.catchAll((e) => {
        // The article phase's actual result is unknown, not empty — treating
        // it as "zero articles currently match" would make the reconciliation
        // step below believe every real article just dropped out of the
        // query and delete all of them. Skip reconciliation entirely instead
        // (the partial-sweep trap, #2831).
        reconciliationSafe = false;
        return Effect.log(`[search-sync] Skipping articles: ${String(e)}`).pipe(
          Effect.map(() => [] as SanityArticleDoc[]),
        );
      }),
    );

    yield* Effect.log(
      `[search-sync] Indexing ${articleResult.length} articles`,
    );

    const articleVectors = yield* Effect.forEach(
      articleResult,
      (doc) =>
        embedDoc(
          doc._id,
          buildArticleIndexText(doc),
          buildArticleMetadata(doc),
        ),
      { concurrency: 3 },
    );

    const articleSuccessCount = yield* upsertBatched(
      articleVectors,
      "articles",
    );

    yield* Effect.log(
      `[search-sync] Indexed ${articleSuccessCount}/${articleResult.length} articles`,
    );

    // ── Pages ─────────────────────────────────────────────────────────────

    const fetchPages =
      options?.fetchPages ??
      (() => sanityClient().fetch<SanityPageDoc[]>(PAGE_QUERY));

    const pageResult = yield* Effect.tryPromise({
      try: fetchPages,
      catch: (e) => new Error(`Sanity page fetch failed: ${String(e)}`),
    }).pipe(
      Effect.catchAll((e) => {
        // Same reasoning as the article phase above: an unknown result must
        // not be read as "no pages currently match."
        reconciliationSafe = false;
        return Effect.log(`[search-sync] Skipping pages: ${String(e)}`).pipe(
          Effect.map(() => [] as SanityPageDoc[]),
        );
      }),
    );

    yield* Effect.log(`[search-sync] Indexing ${pageResult.length} pages`);

    const pageVectors = yield* Effect.forEach(
      pageResult,
      (doc) =>
        embedDoc(doc._id, buildPageIndexText(doc), buildPageMetadata(doc)),
      { concurrency: 3 },
    );

    const pageSuccessCount = yield* upsertBatched(pageVectors, "pages");

    yield* Effect.log(
      `[search-sync] Indexed ${pageSuccessCount}/${pageResult.length} pages`,
    );

    // ── Reconciliation ───────────────────────────────────────────────────
    // See the "Reconciliation (#2831)" block comment above for the mechanism
    // and its cost. currentIds is built from the raw fetched docs (before
    // embedding), not from what actually landed in Vectorize — a document
    // that still matches its query but failed to embed or upsert this run
    // must stay OUT of the delete set; it's a transient failure on an
    // otherwise-live document, not proof the document stopped matching.
    if (!reconciliationSafe) {
      yield* Effect.log(
        "[search-sync] Skipping reconciliation — a fetch phase failed this sweep, so its result set can't be trusted to diff against",
      );
    } else {
      const currentIds = [
        ...docs.map((d) => d._id),
        ...articleResult.map((d) => d._id),
        ...pageResult.map((d) => d._id),
      ];

      const previousManifest = yield* readManifest(kvCache);

      if (previousManifest === null) {
        yield* Effect.log(
          "[search-sync] No previous manifest — bootstrap sweep, nothing pruned",
        );
      } else {
        const currentIdSet = new Set(currentIds);
        const toDelete = previousManifest.filter((id) => !currentIdSet.has(id));

        if (toDelete.length === 0) {
          yield* Effect.log("[search-sync] Reconciliation: nothing to prune");
        } else if (dryRun) {
          yield* Effect.log(
            `[search-sync] DRY RUN — would prune ${toDelete.length} orphaned vector(s): ${toDelete.join(", ")}`,
          );
        } else {
          yield* deleteBatched(toDelete);
          yield* Effect.log(
            `[search-sync] Pruned ${toDelete.length} orphaned vector(s)`,
          );
        }
      }

      yield* writeManifest(kvCache, currentIds);
    }
  });
