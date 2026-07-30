import { createClient } from "@sanity/client";
import { Array as Arr, Effect, Schedule } from "effect";
import { WorkerEnvTag } from "../env";
import { sanityClientConfig } from "../sanity/config";
import { EmbeddingService } from "./embedding";
import {
  ARTICLE_COVER_IMAGE_PROJECTION,
  buildArticleIndexText,
  buildPageIndexText,
  buildResponsibilityIndexText,
} from "./index-text";
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
  tags: string[];
  bodyText: string | null;
  imageUrl: string | null;
}

interface SanityPageDoc {
  _id: string;
  slug: string;
  title: string;
  bodyText: string | null;
}

// ─── Sanity GROQ queries ─────────────────────────────────────────────────────

const RESPONSIBILITY_QUERY = `*[_type == "responsibility" && active == true] {
  _id,
  "slug": coalesce(slug.current, ""),
  title,
  question,
  "keywords": coalesce(keywords, []),
  "summary": coalesce(summary, "")
}`;

const ARTICLE_QUERY = `*[_type == "article" && publishAt <= now() && (!defined(unpublishAt) || unpublishAt > now())] {
  _id,
  "slug": coalesce(slug.current, ""),
  title,
  "tags": coalesce(tags, []),
  "bodyText": pt::text(body),
  ${ARTICLE_COVER_IMAGE_PROJECTION}
}`;

const PAGE_QUERY = `*[_type == "page"] {
  _id,
  "slug": coalesce(slug.current, ""),
  title,
  "bodyText": pt::text(body)
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
    const embedding = yield* EmbeddingService;
    const vectorize = yield* VectorizeService;

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
        embedDoc(doc._id, buildResponsibilityIndexText(doc), {
          slug: doc.slug,
          type: "responsibility",
          title: doc.title,
          excerpt: doc.summary.slice(0, 200),
        }),
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
        embedDoc(doc._id, buildArticleIndexText(doc), {
          slug: doc.slug,
          type: "article",
          title: doc.title,
          excerpt: (doc.bodyText ?? "").slice(0, 200),
          tags: (doc.tags ?? []).join(","),
          ...(doc.imageUrl ? { imageUrl: doc.imageUrl } : {}),
        }),
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
        return Effect.log(`[search-sync] Skipping pages: ${String(e)}`).pipe(
          Effect.map(() => [] as SanityPageDoc[]),
        );
      }),
    );

    yield* Effect.log(`[search-sync] Indexing ${pageResult.length} pages`);

    const pageVectors = yield* Effect.forEach(
      pageResult,
      (doc) =>
        embedDoc(doc._id, buildPageIndexText(doc), {
          slug: doc.slug,
          type: "page",
          title: doc.title,
          excerpt: (doc.bodyText ?? "").slice(0, 200),
        }),
      { concurrency: 3 },
    );

    const pageSuccessCount = yield* upsertBatched(pageVectors, "pages");

    yield* Effect.log(
      `[search-sync] Indexed ${pageSuccessCount}/${pageResult.length} pages`,
    );
  });
