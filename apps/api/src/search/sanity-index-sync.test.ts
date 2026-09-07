import { describe, it, expect } from "vitest";
import { Effect, Exit, Layer, Logger } from "effect";
import { runSanityIndexSync } from "./sanity-index-sync";
import {
  EmbeddingError,
  EmbeddingService,
  type EmbeddingServiceInterface,
} from "./embedding";
import {
  VectorizeError,
  VectorizeService,
  type VectorizeServiceInterface,
  type VectorRecord,
} from "./vectorize";
import { WorkerEnvTag, type WorkerEnv } from "../env";
import { KvCacheService, type KvCacheInterface } from "../cache/kv-cache";
import { addToManifest } from "./index-manifest";

const FAKE_VECTOR = Array(1024).fill(0.1);

const mockDoc = {
  _id: "sanity-abc-123",
  slug: "kantine-evenementen",
  title: "Kantine & evenementen",
  question: "wie regelt de kantine",
  keywords: ["kantine", "bar", "evenementen"],
  summary: "De kantine wordt beheerd door de evenementencommissie.",
};

// Two more responsibilities that stay put across sweeps — padding the
// manifest so a single doc dropping out doesn't itself trip the
// PRUNE_SAFETY_CAP_FRACTION guard (finding 4). Not the thing under test in
// most of these cases, just enough manifest weight to isolate it.
const stableDoc1 = { ...mockDoc, _id: "stable-1" };
const stableDoc2 = { ...mockDoc, _id: "stable-2" };

const mockArticle = {
  _id: "article-001",
  slug: "kcvv-wint-derby",
  title: "KCVV wint derby",
  tags: ["verslag", "derby"],
  lead: "Een late kopbal besliste de derby.",
  prose: "KCVV Elewijt won de derby met 3-1.",
  qaQuestions: [] as string[],
  qaAnswers: "",
  tableHtml: [] as string[],
  imageUrl: null as string | null,
};

const mockPage = {
  _id: "page-001",
  slug: "over-kcvv",
  title: "Over KCVV Elewijt",
  bodyText: "KCVV Elewijt is een voetbalclub uit Elewijt.",
  fileAttachmentLabels: [] as string[],
};

function makeEnvLayer(overrides: Partial<WorkerEnv> = {}) {
  return Layer.succeed(WorkerEnvTag, {
    AI: {} as Ai,
    SEARCH_INDEX: {} as VectorizeIndex,
    PSD_API_BASE_URL: "",
    PSD_IMAGE_BASE_URL: "",
    FOOTBALISTO_LOGO_CDN_URL: "",
    PSD_API_KEY: "",
    PSD_API_CLUB: "",
    PSD_API_AUTH: "",
    PSD_CACHE: {} as KVNamespace,
    PSD_GATE: {} as DurableObjectNamespace,
    SANITY_PROJECT_ID: "",
    // Correctly-paired by default so every pre-existing test in this file
    // (not exercising the dataset/index guard) passes through it unaffected.
    SANITY_DATASET: "production",
    SEARCH_INDEX_NAME: "kcvv-search",
    SANITY_API_TOKEN: "",
    SANITY_WEBHOOK_SECRET: "",
    ...overrides,
  });
}

function makeEmbeddingMock(): EmbeddingServiceInterface {
  return { embed: () => Effect.succeed(FAKE_VECTOR) };
}

/**
 * Records every upsert batch and every deleteByIds call. Each upsert call
 * yields to the macrotask queue so overlapping calls are observable —
 * `probe.maxInFlight` stays 1 only if the batches really are upserted one at
 * a time.
 */
function makeVectorizeCapture(overrides?: Partial<VectorizeServiceInterface>) {
  const upsertCalls: VectorRecord[][] = [];
  const deleteCalls: string[][] = [];
  const probe = { inFlight: 0, maxInFlight: 0 };
  const mock: VectorizeServiceInterface = {
    upsert: (vectors) =>
      Effect.promise(async () => {
        probe.inFlight++;
        probe.maxInFlight = Math.max(probe.maxInFlight, probe.inFlight);
        await new Promise((resolve) => setTimeout(resolve, 0));
        probe.inFlight--;
        upsertCalls.push(vectors);
      }),
    query: () => Effect.succeed([]),
    getByIds: () => Effect.succeed([]),
    deleteByIds: (ids) =>
      Effect.sync(() => {
        deleteCalls.push(ids);
      }),
    ...overrides,
  };
  return { upsertCalls, deleteCalls, probe, mock };
}

/** No manifest, no-op writes — the default for tests that don't exercise
 * the prune/reconciliation step at all. */
const noopKvCache: KvCacheInterface = {
  get: () => Effect.succeed(null),
  set: () => Effect.succeed(undefined),
  delete: () => Effect.succeed(undefined),
  increment: () => Effect.succeed(undefined),
};

/**
 * Stateful, in-memory KV so a test can run two sweeps back to back and have
 * the second see the manifest the first one wrote — real KV persists between
 * scheduled invocations, a plain no-op mock cannot exercise that.
 */
function makeKvCacheMock(): KvCacheInterface {
  const store = new Map<string, string>();
  return {
    get: (key) => Effect.succeed(store.get(key) ?? null),
    set: (key, value) =>
      Effect.sync(() => {
        store.set(key, value);
      }),
    delete: (key) =>
      Effect.sync(() => {
        store.delete(key);
      }),
    increment: () => Effect.succeed(undefined),
  };
}

function noopFetch<T>(data: T[]) {
  return async () => data;
}

describe("runSanityIndexSync", () => {
  it("embeds and upserts each responsibility path with correct metadata", async () => {
    const { upsertCalls, mock } = makeVectorizeCapture();

    await Effect.runPromise(
      runSanityIndexSync({
        fetchResponsibility: noopFetch([mockDoc]),
      }).pipe(
        Effect.provide(makeEnvLayer()),
        Effect.provide(Layer.succeed(KvCacheService, noopKvCache)),
        Effect.provide(Layer.succeed(EmbeddingService, makeEmbeddingMock())),
        Effect.provide(Layer.succeed(VectorizeService, mock)),
      ),
    );

    const upserted = upsertCalls.flat();
    const doc = upserted.find((v) => v.id === "sanity-abc-123");
    expect(doc).toBeDefined();
    expect(doc!.metadata["slug"]).toBe("kantine-evenementen");
    expect(doc!.metadata["type"]).toBe("responsibility");
    expect(doc!.values).toEqual(FAKE_VECTOR);
  });

  it("includes title + question + keywords in embedded text", async () => {
    const embeddedTexts: string[] = [];
    const captureEmbed: EmbeddingServiceInterface = {
      embed: (text) =>
        Effect.sync(() => {
          embeddedTexts.push(text);
          return FAKE_VECTOR;
        }),
    };

    await Effect.runPromise(
      runSanityIndexSync({
        fetchResponsibility: noopFetch([mockDoc]),
      }).pipe(
        Effect.provide(makeEnvLayer()),
        Effect.provide(Layer.succeed(KvCacheService, noopKvCache)),
        Effect.provide(Layer.succeed(EmbeddingService, captureEmbed)),
        Effect.provide(
          Layer.succeed(VectorizeService, {
            upsert: () => Effect.succeed(undefined),
            query: () => Effect.succeed([]),
            getByIds: () => Effect.succeed([]),
            deleteByIds: () => Effect.succeed(undefined as void),
          }),
        ),
      ),
    );

    const text = embeddedTexts[0]!;
    expect(text).toContain("Kantine");
    expect(text).toContain("wie regelt de kantine");
    expect(text).toContain("kantine bar evenementen");
  });

  it("indexes articles with correct metadata", async () => {
    const { upsertCalls, mock } = makeVectorizeCapture();

    await Effect.runPromise(
      runSanityIndexSync({
        fetchResponsibility: noopFetch([]),
        fetchArticles: noopFetch([mockArticle]),
        fetchPages: noopFetch([]),
      }).pipe(
        Effect.provide(makeEnvLayer()),
        Effect.provide(Layer.succeed(KvCacheService, noopKvCache)),
        Effect.provide(Layer.succeed(EmbeddingService, makeEmbeddingMock())),
        Effect.provide(Layer.succeed(VectorizeService, mock)),
      ),
    );

    const upserted = upsertCalls.flat();
    const doc = upserted.find((v) => v.id === "article-001");
    expect(doc).toBeDefined();
    expect(doc!.metadata["slug"]).toBe("kcvv-wint-derby");
    expect(doc!.metadata["type"]).toBe("article");
    expect(doc!.metadata["title"]).toBe("KCVV wint derby");
    // The excerpt is the editor's lead, not a slice of the index text — that
    // blob now carries Q&A and table words behind the prose (#2806).
    expect(doc!.metadata["excerpt"]).toBe("Een late kopbal besliste de derby.");
    expect(doc!.metadata["imageUrl"]).toBeUndefined();
  });

  it("stores imageUrl in article metadata when present", async () => {
    const { upsertCalls, mock } = makeVectorizeCapture();

    await Effect.runPromise(
      runSanityIndexSync({
        fetchResponsibility: noopFetch([]),
        fetchArticles: noopFetch([
          {
            ...mockArticle,
            imageUrl: "https://cdn.example.com/cover.jpg",
          },
        ]),
        fetchPages: noopFetch([]),
      }).pipe(
        Effect.provide(makeEnvLayer()),
        Effect.provide(Layer.succeed(KvCacheService, noopKvCache)),
        Effect.provide(Layer.succeed(EmbeddingService, makeEmbeddingMock())),
        Effect.provide(Layer.succeed(VectorizeService, mock)),
      ),
    );

    const upserted = upsertCalls.flat();
    const doc = upserted.find((v) => v.id === "article-001");
    expect(doc!.metadata["imageUrl"]).toBe("https://cdn.example.com/cover.jpg");
  });

  it("omits imageUrl from article metadata when null", async () => {
    const { upsertCalls, mock } = makeVectorizeCapture();

    await Effect.runPromise(
      runSanityIndexSync({
        fetchResponsibility: noopFetch([]),
        fetchArticles: noopFetch([{ ...mockArticle, imageUrl: null }]),
        fetchPages: noopFetch([]),
      }).pipe(
        Effect.provide(makeEnvLayer()),
        Effect.provide(Layer.succeed(KvCacheService, noopKvCache)),
        Effect.provide(Layer.succeed(EmbeddingService, makeEmbeddingMock())),
        Effect.provide(Layer.succeed(VectorizeService, mock)),
      ),
    );

    const upserted = upsertCalls.flat();
    const doc = upserted.find((v) => v.id === "article-001");
    expect(doc!.metadata["imageUrl"]).toBeUndefined();
  });

  it("indexes pages with correct metadata", async () => {
    const { upsertCalls, mock } = makeVectorizeCapture();

    await Effect.runPromise(
      runSanityIndexSync({
        fetchResponsibility: noopFetch([]),
        fetchArticles: noopFetch([]),
        fetchPages: noopFetch([mockPage]),
      }).pipe(
        Effect.provide(makeEnvLayer()),
        Effect.provide(Layer.succeed(KvCacheService, noopKvCache)),
        Effect.provide(Layer.succeed(EmbeddingService, makeEmbeddingMock())),
        Effect.provide(Layer.succeed(VectorizeService, mock)),
      ),
    );

    const upserted = upsertCalls.flat();
    const doc = upserted.find((v) => v.id === "page-001");
    expect(doc).toBeDefined();
    expect(doc!.metadata["slug"]).toBe("over-kcvv");
    expect(doc!.metadata["type"]).toBe("page");
    expect(doc!.metadata["title"]).toBe("Over KCVV Elewijt");
  });

  it("indexes articles with null body gracefully", async () => {
    const { upsertCalls, mock } = makeVectorizeCapture();
    const articleNoBody = {
      ...mockArticle,
      _id: "article-no-body",
      lead: "",
      prose: "",
    };

    await Effect.runPromise(
      runSanityIndexSync({
        fetchResponsibility: noopFetch([]),
        fetchArticles: noopFetch([articleNoBody]),
        fetchPages: noopFetch([]),
      }).pipe(
        Effect.provide(makeEnvLayer()),
        Effect.provide(Layer.succeed(KvCacheService, noopKvCache)),
        Effect.provide(Layer.succeed(EmbeddingService, makeEmbeddingMock())),
        Effect.provide(Layer.succeed(VectorizeService, mock)),
      ),
    );

    const upserted = upsertCalls.flat();
    const doc = upserted.find((v) => v.id === "article-no-body");
    expect(doc).toBeDefined();
    expect(doc!.metadata["excerpt"]).toBe("");
  });

  it("continues indexing when article fetch fails", async () => {
    const { upsertCalls, mock } = makeVectorizeCapture();

    await Effect.runPromise(
      runSanityIndexSync({
        fetchResponsibility: noopFetch([mockDoc]),
        fetchArticles: async () => {
          throw new Error("Sanity timeout");
        },
        fetchPages: noopFetch([mockPage]),
      }).pipe(
        Effect.provide(makeEnvLayer()),
        Effect.provide(Layer.succeed(KvCacheService, noopKvCache)),
        Effect.provide(Layer.succeed(EmbeddingService, makeEmbeddingMock())),
        Effect.provide(Layer.succeed(VectorizeService, mock)),
      ),
    );

    const upserted = upsertCalls.flat();
    // Responsibility paths and pages should still be indexed
    expect(upserted.find((v) => v.id === "sanity-abc-123")).toBeDefined();
    expect(upserted.find((v) => v.id === "page-001")).toBeDefined();
  });

  it("continues indexing when page fetch fails", async () => {
    const { upsertCalls, mock } = makeVectorizeCapture();

    await Effect.runPromise(
      runSanityIndexSync({
        fetchResponsibility: noopFetch([mockDoc]),
        fetchArticles: noopFetch([mockArticle]),
        fetchPages: async () => {
          throw new Error("Sanity timeout");
        },
      }).pipe(
        Effect.provide(makeEnvLayer()),
        Effect.provide(Layer.succeed(KvCacheService, noopKvCache)),
        Effect.provide(Layer.succeed(EmbeddingService, makeEmbeddingMock())),
        Effect.provide(Layer.succeed(VectorizeService, mock)),
      ),
    );

    const upserted = upsertCalls.flat();
    expect(upserted.find((v) => v.id === "sanity-abc-123")).toBeDefined();
    expect(upserted.find((v) => v.id === "article-001")).toBeDefined();
  });

  it("batches upserts per doc-type instead of once per document", async () => {
    const { upsertCalls, mock } = makeVectorizeCapture();

    await Effect.runPromise(
      runSanityIndexSync({
        fetchResponsibility: noopFetch([
          mockDoc,
          { ...mockDoc, _id: "resp-002" },
          { ...mockDoc, _id: "resp-003" },
        ]),
        fetchArticles: noopFetch([
          mockArticle,
          { ...mockArticle, _id: "article-002" },
        ]),
        fetchPages: noopFetch([mockPage, { ...mockPage, _id: "page-002" }]),
      }).pipe(
        Effect.provide(makeEnvLayer()),
        Effect.provide(Layer.succeed(KvCacheService, noopKvCache)),
        Effect.provide(Layer.succeed(EmbeddingService, makeEmbeddingMock())),
        Effect.provide(Layer.succeed(VectorizeService, mock)),
      ),
    );

    // 7 documents, one batched upsert per doc-type
    expect(upsertCalls).toHaveLength(3);
    expect(upsertCalls.map((batch) => batch.length)).toEqual([3, 2, 2]);
  });

  it("chunks a batch above the 1000-vector cap and upserts the chunks sequentially", async () => {
    const { upsertCalls, probe, mock } = makeVectorizeCapture();
    const manyPages = Array.from({ length: 1001 }, (_, i) => ({
      ...mockPage,
      _id: `page-${i}`,
    }));

    await Effect.runPromise(
      runSanityIndexSync({
        fetchResponsibility: noopFetch([]),
        fetchArticles: noopFetch([]),
        fetchPages: noopFetch(manyPages),
      }).pipe(
        Effect.provide(makeEnvLayer()),
        Effect.provide(Layer.succeed(KvCacheService, noopKvCache)),
        Effect.provide(Layer.succeed(EmbeddingService, makeEmbeddingMock())),
        Effect.provide(Layer.succeed(VectorizeService, mock)),
      ),
    );

    expect(upsertCalls.map((batch) => batch.length)).toEqual([1000, 1]);
    expect(probe.maxInFlight).toBe(1);
  });

  it("omits a document whose embedding fails and still upserts the rest", async () => {
    const { upsertCalls, mock } = makeVectorizeCapture();
    const flakyEmbed: EmbeddingServiceInterface = {
      embed: (text) =>
        text.includes("derby")
          ? Effect.fail(new EmbeddingError("Workers AI unavailable"))
          : Effect.succeed(FAKE_VECTOR),
    };

    await Effect.runPromise(
      runSanityIndexSync({
        fetchResponsibility: noopFetch([]),
        fetchArticles: noopFetch([
          mockArticle,
          {
            ...mockArticle,
            _id: "article-002",
            title: "Gelijkspel",
            tags: ["verslag"],
            lead: "Een puntendeling op bezoek.",
            prose: "KCVV Elewijt speelde 1-1 gelijk.",
          },
        ]),
        fetchPages: noopFetch([]),
      }).pipe(
        Effect.provide(makeEnvLayer()),
        Effect.provide(Layer.succeed(KvCacheService, noopKvCache)),
        Effect.provide(Layer.succeed(EmbeddingService, flakyEmbed)),
        Effect.provide(Layer.succeed(VectorizeService, mock)),
      ),
    );

    const upserted = upsertCalls.flat();
    expect(upserted.map((v) => v.id)).toEqual(["article-002"]);
  });

  it("logs the dropped count and completes the run when a batch keeps failing", async () => {
    const messages: string[] = [];
    const TestLogger = Logger.make(({ message }) => {
      messages.push(String(message));
    });
    const { mock: failingVectorize } = makeVectorizeCapture({
      upsert: () => Effect.fail(new VectorizeError("40041 Too Many Requests")),
    });

    const exit = await Effect.runPromiseExit(
      runSanityIndexSync({
        fetchResponsibility: noopFetch([mockDoc]),
        fetchArticles: noopFetch([]),
        fetchPages: noopFetch([]),
      }).pipe(
        Effect.provide(makeEnvLayer()),
        Effect.provide(Layer.succeed(KvCacheService, noopKvCache)),
        Effect.provide(Layer.succeed(EmbeddingService, makeEmbeddingMock())),
        Effect.provide(Layer.succeed(VectorizeService, failingVectorize)),
        Effect.provide(Logger.replace(Logger.defaultLogger, TestLogger)),
      ),
    );

    expect(Exit.isSuccess(exit)).toBe(true);
    expect(
      messages.some((m) => m.includes("dropped 1 of 1") && m.includes("40041")),
    ).toBe(true);
    expect(
      messages.some((m) => m.includes("Indexed 0/1 responsibility paths")),
    ).toBe(true);
  });

  it("refuses to sync when the worker's dataset doesn't match its configured index", async () => {
    // Reproduces #2833 review finding 7: the bulk sync writes to the same
    // SEARCH_INDEX binding as the webhook but had no equivalent guard. It is
    // unreachable on staging today only because crons are [] there — the
    // same reasoning this issue was filed to retire for the webhook.
    const { upsertCalls, mock } = makeVectorizeCapture();

    const exit = await Effect.runPromiseExit(
      runSanityIndexSync({
        fetchResponsibility: noopFetch([mockDoc]),
      }).pipe(
        Effect.provide(
          makeEnvLayer({
            SANITY_DATASET: "staging",
            SEARCH_INDEX_NAME: "kcvv-search",
          }),
        ),
        Effect.provide(Layer.succeed(EmbeddingService, makeEmbeddingMock())),
        Effect.provide(Layer.succeed(VectorizeService, mock)),
        Effect.provide(Layer.succeed(KvCacheService, noopKvCache)),
      ),
    );

    expect(Exit.isFailure(exit)).toBe(true);
    expect(upsertCalls).toHaveLength(0);
  });

  describe("reconciliation (#2831) — pruning what no longer matches", () => {
    it("deletes the vector for a document that drops out of the query on the next sweep", async () => {
      const kv = makeKvCacheMock();
      const { deleteCalls, mock: mock1 } = makeVectorizeCapture();

      // Sweep 1: three responsibilities are active and get indexed. No
      // previous manifest exists yet, so nothing is deleted.
      await Effect.runPromise(
        runSanityIndexSync({
          fetchResponsibility: noopFetch([mockDoc, stableDoc1, stableDoc2]),
          fetchArticles: noopFetch([]),
          fetchPages: noopFetch([]),
        }).pipe(
          Effect.provide(makeEnvLayer({ SEARCH_INDEX_PRUNE_DRY_RUN: "false" })),
          Effect.provide(Layer.succeed(EmbeddingService, makeEmbeddingMock())),
          Effect.provide(Layer.succeed(VectorizeService, mock1)),
          Effect.provide(Layer.succeed(KvCacheService, kv)),
        ),
      );
      expect(deleteCalls).toHaveLength(0);

      // Sweep 2: mockDoc went inactive (or was deleted) and no longer
      // matches RESPONSIBILITY_QUERY — the fetcher now omits it, the other
      // two are still there.
      const { deleteCalls: deleteCalls2, mock: mock2 } = makeVectorizeCapture();
      await Effect.runPromise(
        runSanityIndexSync({
          fetchResponsibility: noopFetch([stableDoc1, stableDoc2]),
          fetchArticles: noopFetch([]),
          fetchPages: noopFetch([]),
        }).pipe(
          Effect.provide(makeEnvLayer({ SEARCH_INDEX_PRUNE_DRY_RUN: "false" })),
          Effect.provide(Layer.succeed(EmbeddingService, makeEmbeddingMock())),
          Effect.provide(Layer.succeed(VectorizeService, mock2)),
          Effect.provide(Layer.succeed(KvCacheService, kv)),
        ),
      );

      expect(deleteCalls2.flat()).toEqual(["sanity-abc-123"]);
    });

    it("keeps a dropped id pending across a dry-run sweep and prunes it once the flag flips to false (review finding 1)", async () => {
      const kv = makeKvCacheMock();

      // Sweep 1 (bootstrap): three responsibilities indexed.
      const { mock: mock1 } = makeVectorizeCapture();
      await Effect.runPromise(
        runSanityIndexSync({
          fetchResponsibility: noopFetch([mockDoc, stableDoc1, stableDoc2]),
          fetchArticles: noopFetch([]),
          fetchPages: noopFetch([]),
        }).pipe(
          Effect.provide(makeEnvLayer()),
          Effect.provide(Layer.succeed(EmbeddingService, makeEmbeddingMock())),
          Effect.provide(Layer.succeed(VectorizeService, mock1)),
          Effect.provide(Layer.succeed(KvCacheService, kv)),
        ),
      );

      // Sweep 2: mockDoc drops out, but dry-run is on (the default) — nothing
      // is actually deleted. Before the fix, the manifest was overwritten
      // with currentIds regardless of dry-run, silently losing mockDoc from
      // tracking; this sweep's dry-run pass must not do that.
      const { deleteCalls: deleteCalls2, mock: mock2 } = makeVectorizeCapture();
      await Effect.runPromise(
        runSanityIndexSync({
          fetchResponsibility: noopFetch([stableDoc1, stableDoc2]),
          fetchArticles: noopFetch([]),
          fetchPages: noopFetch([]),
        }).pipe(
          Effect.provide(makeEnvLayer()), // dry-run stays on (unset → true)
          Effect.provide(Layer.succeed(EmbeddingService, makeEmbeddingMock())),
          Effect.provide(Layer.succeed(VectorizeService, mock2)),
          Effect.provide(Layer.succeed(KvCacheService, kv)),
        ),
      );
      expect(deleteCalls2).toHaveLength(0);

      // Sweep 3: same fetch result, dry-run flipped to "false". mockDoc must
      // still be prunable — it must not have fallen out of the manifest
      // during sweep 2's dry-run pass.
      const { deleteCalls: deleteCalls3, mock: mock3 } = makeVectorizeCapture();
      await Effect.runPromise(
        runSanityIndexSync({
          fetchResponsibility: noopFetch([stableDoc1, stableDoc2]),
          fetchArticles: noopFetch([]),
          fetchPages: noopFetch([]),
        }).pipe(
          Effect.provide(makeEnvLayer({ SEARCH_INDEX_PRUNE_DRY_RUN: "false" })),
          Effect.provide(Layer.succeed(EmbeddingService, makeEmbeddingMock())),
          Effect.provide(Layer.succeed(VectorizeService, mock3)),
          Effect.provide(Layer.succeed(KvCacheService, kv)),
        ),
      );

      expect(deleteCalls3.flat()).toEqual(["sanity-abc-123"]);
    });

    it("keeps a dropped id pending after a failed delete and retries it on the next sweep (review finding 2)", async () => {
      const kv = makeKvCacheMock();

      // Sweep 1 (bootstrap): three responsibilities indexed.
      const { mock: mock1 } = makeVectorizeCapture();
      await Effect.runPromise(
        runSanityIndexSync({
          fetchResponsibility: noopFetch([mockDoc, stableDoc1, stableDoc2]),
          fetchArticles: noopFetch([]),
          fetchPages: noopFetch([]),
        }).pipe(
          Effect.provide(makeEnvLayer({ SEARCH_INDEX_PRUNE_DRY_RUN: "false" })),
          Effect.provide(Layer.succeed(EmbeddingService, makeEmbeddingMock())),
          Effect.provide(Layer.succeed(VectorizeService, mock1)),
          Effect.provide(Layer.succeed(KvCacheService, kv)),
        ),
      );

      // Sweep 2: mockDoc drops out, dry-run off, but Vectorize's delete is
      // down — every deleteByIds call fails, even after retries.
      const messages: string[] = [];
      const TestLogger = Logger.make(({ message }) => {
        messages.push(String(message));
      });
      const { mock: failingVectorize } = makeVectorizeCapture({
        deleteByIds: () => Effect.fail(new VectorizeError("Vectorize outage")),
      });
      await Effect.runPromise(
        runSanityIndexSync({
          fetchResponsibility: noopFetch([stableDoc1, stableDoc2]),
          fetchArticles: noopFetch([]),
          fetchPages: noopFetch([]),
        }).pipe(
          Effect.provide(makeEnvLayer({ SEARCH_INDEX_PRUNE_DRY_RUN: "false" })),
          Effect.provide(Layer.succeed(EmbeddingService, makeEmbeddingMock())),
          Effect.provide(Layer.succeed(VectorizeService, failingVectorize)),
          Effect.provide(Layer.succeed(KvCacheService, kv)),
          Effect.provide(Logger.replace(Logger.defaultLogger, TestLogger)),
        ),
      );

      // The log reports what was actually confirmed deleted (zero), not the
      // size of the attempted delete set.
      expect(messages.some((m) => m.includes("Pruned 0 orphaned"))).toBe(true);

      // Sweep 3: Vectorize recovers. mockDoc must still be in the manifest
      // for this sweep to find and delete — the failed attempt in sweep 2
      // must not have dropped it from tracking.
      const { deleteCalls: deleteCalls3, mock: mock3 } = makeVectorizeCapture();
      await Effect.runPromise(
        runSanityIndexSync({
          fetchResponsibility: noopFetch([stableDoc1, stableDoc2]),
          fetchArticles: noopFetch([]),
          fetchPages: noopFetch([]),
        }).pipe(
          Effect.provide(makeEnvLayer({ SEARCH_INDEX_PRUNE_DRY_RUN: "false" })),
          Effect.provide(Layer.succeed(EmbeddingService, makeEmbeddingMock())),
          Effect.provide(Layer.succeed(VectorizeService, mock3)),
          Effect.provide(Layer.succeed(KvCacheService, kv)),
        ),
      );

      expect(deleteCalls3.flat()).toEqual(["sanity-abc-123"]);
    });

    it("prunes a document whose entire visible life fit between two sweeps, tracked only via the webhook's addToManifest (review finding 3)", async () => {
      const kv = makeKvCacheMock();

      // No sweep has ever observed "transient-doc" as current — simulate the
      // webhook's upsert path (webhooks/index-handler.ts) registering it the
      // moment it was published, the same way it registers every successful
      // upsert. Two more ids are added the same way to keep the eventual
      // drop under the safety cap.
      await Effect.runPromise(addToManifest(kv, "production", "transient-doc"));
      await Effect.runPromise(addToManifest(kv, "production", "stable-1"));
      await Effect.runPromise(addToManifest(kv, "production", "stable-2"));

      // A sweep runs after "transient-doc" has both published AND expired
      // (its whole visible life fit between two sweeps) — no query returns
      // it. The other two ids are still current.
      const { deleteCalls, mock } = makeVectorizeCapture();
      await Effect.runPromise(
        runSanityIndexSync({
          fetchResponsibility: noopFetch([stableDoc1, stableDoc2]),
          fetchArticles: noopFetch([]),
          fetchPages: noopFetch([]),
        }).pipe(
          Effect.provide(makeEnvLayer({ SEARCH_INDEX_PRUNE_DRY_RUN: "false" })),
          Effect.provide(Layer.succeed(EmbeddingService, makeEmbeddingMock())),
          Effect.provide(Layer.succeed(VectorizeService, mock)),
          Effect.provide(Layer.succeed(KvCacheService, kv)),
        ),
      );

      expect(deleteCalls.flat()).toEqual(["transient-doc"]);
    });

    it("refuses to prune when the delete set exceeds the safety cap, to guard against a truncated fetch (review finding 4)", async () => {
      const kv = makeKvCacheMock();
      const fourDocs = [
        mockDoc,
        stableDoc1,
        stableDoc2,
        { ...mockDoc, _id: "stable-3" },
      ];

      // Sweep 1 (bootstrap): four responsibilities indexed.
      const { mock: mock1 } = makeVectorizeCapture();
      await Effect.runPromise(
        runSanityIndexSync({
          fetchResponsibility: noopFetch(fourDocs),
          fetchArticles: noopFetch([]),
          fetchPages: noopFetch([]),
        }).pipe(
          Effect.provide(makeEnvLayer({ SEARCH_INDEX_PRUNE_DRY_RUN: "false" })),
          Effect.provide(Layer.succeed(EmbeddingService, makeEmbeddingMock())),
          Effect.provide(Layer.succeed(VectorizeService, mock1)),
          Effect.provide(Layer.succeed(KvCacheService, kv)),
        ),
      );

      // Sweep 2: the fetch comes back with only 1 of the 4 — as if a
      // truncated GROQ response or a projection regression dropped the
      // other three, not a real mass deactivation. 3 of 4 (75%) exceeds the
      // 50% cap, so nothing must be deleted.
      const { deleteCalls: deleteCalls2, mock: mock2 } = makeVectorizeCapture();
      await Effect.runPromise(
        runSanityIndexSync({
          fetchResponsibility: noopFetch([mockDoc]),
          fetchArticles: noopFetch([]),
          fetchPages: noopFetch([]),
        }).pipe(
          Effect.provide(makeEnvLayer({ SEARCH_INDEX_PRUNE_DRY_RUN: "false" })),
          Effect.provide(Layer.succeed(EmbeddingService, makeEmbeddingMock())),
          Effect.provide(Layer.succeed(VectorizeService, mock2)),
          Effect.provide(Layer.succeed(KvCacheService, kv)),
        ),
      );
      expect(deleteCalls2).toHaveLength(0);

      // Sweep 3: the fetch recovers to all 4 — the three "missing" ids must
      // still be tracked (the refused sweep must not have dropped them).
      const { deleteCalls: deleteCalls3, mock: mock3 } = makeVectorizeCapture();
      await Effect.runPromise(
        runSanityIndexSync({
          fetchResponsibility: noopFetch(fourDocs),
          fetchArticles: noopFetch([]),
          fetchPages: noopFetch([]),
        }).pipe(
          Effect.provide(makeEnvLayer({ SEARCH_INDEX_PRUNE_DRY_RUN: "false" })),
          Effect.provide(Layer.succeed(EmbeddingService, makeEmbeddingMock())),
          Effect.provide(Layer.succeed(VectorizeService, mock3)),
          Effect.provide(Layer.succeed(KvCacheService, kv)),
        ),
      );
      expect(deleteCalls3).toHaveLength(0);
    });

    it("deletes nothing on the very first sweep — there is no previous manifest to diff against", async () => {
      const kv = makeKvCacheMock();
      const { deleteCalls, mock } = makeVectorizeCapture();

      await Effect.runPromise(
        runSanityIndexSync({
          fetchResponsibility: noopFetch([mockDoc]),
          fetchArticles: noopFetch([mockArticle]),
          fetchPages: noopFetch([mockPage]),
        }).pipe(
          Effect.provide(makeEnvLayer({ SEARCH_INDEX_PRUNE_DRY_RUN: "false" })),
          Effect.provide(Layer.succeed(EmbeddingService, makeEmbeddingMock())),
          Effect.provide(Layer.succeed(VectorizeService, mock)),
          Effect.provide(Layer.succeed(KvCacheService, kv)),
        ),
      );

      expect(deleteCalls).toHaveLength(0);
    });

    it("writes no manifest and deletes nothing when the article phase fails — the partial-sweep trap", async () => {
      const kv = makeKvCacheMock();

      // Sweep 1 succeeds fully and writes a manifest containing the article.
      const { mock: mock1 } = makeVectorizeCapture();
      await Effect.runPromise(
        runSanityIndexSync({
          fetchResponsibility: noopFetch([]),
          fetchArticles: noopFetch([mockArticle]),
          fetchPages: noopFetch([]),
        }).pipe(
          Effect.provide(makeEnvLayer({ SEARCH_INDEX_PRUNE_DRY_RUN: "false" })),
          Effect.provide(Layer.succeed(EmbeddingService, makeEmbeddingMock())),
          Effect.provide(Layer.succeed(VectorizeService, mock1)),
          Effect.provide(Layer.succeed(KvCacheService, kv)),
        ),
      );

      // Sweep 2: the article phase's Sanity fetch fails outright. Even
      // though the article is now absent from articleResult (the phase's
      // catchAll degrades it to []), that absence must not be read as "this
      // article stopped matching the query" — it's unknown, not gone.
      const { deleteCalls, mock: mock2 } = makeVectorizeCapture();
      await Effect.runPromise(
        runSanityIndexSync({
          fetchResponsibility: noopFetch([]),
          fetchArticles: async () => {
            throw new Error("Sanity timeout");
          },
          fetchPages: noopFetch([]),
        }).pipe(
          Effect.provide(makeEnvLayer({ SEARCH_INDEX_PRUNE_DRY_RUN: "false" })),
          Effect.provide(Layer.succeed(EmbeddingService, makeEmbeddingMock())),
          Effect.provide(Layer.succeed(VectorizeService, mock2)),
          Effect.provide(Layer.succeed(KvCacheService, kv)),
        ),
      );

      expect(deleteCalls).toHaveLength(0);

      // Sweep 3, fetches succeed again with nothing changed: if sweep 2 had
      // wrongly overwritten the manifest with the empty article list, this
      // sweep would now (wrongly) delete article-001.
      const { deleteCalls: deleteCalls3, mock: mock3 } = makeVectorizeCapture();
      await Effect.runPromise(
        runSanityIndexSync({
          fetchResponsibility: noopFetch([]),
          fetchArticles: noopFetch([mockArticle]),
          fetchPages: noopFetch([]),
        }).pipe(
          Effect.provide(makeEnvLayer({ SEARCH_INDEX_PRUNE_DRY_RUN: "false" })),
          Effect.provide(Layer.succeed(EmbeddingService, makeEmbeddingMock())),
          Effect.provide(Layer.succeed(VectorizeService, mock3)),
          Effect.provide(Layer.succeed(KvCacheService, kv)),
        ),
      );

      expect(deleteCalls3).toHaveLength(0);
    });

    it("logs the delete set without calling deleteByIds when the dry-run flag is on", async () => {
      const kv = makeKvCacheMock();
      const messages: string[] = [];
      const TestLogger = Logger.make(({ message }) => {
        messages.push(String(message));
      });

      const { mock: mock1 } = makeVectorizeCapture();
      await Effect.runPromise(
        runSanityIndexSync({
          fetchResponsibility: noopFetch([mockDoc, stableDoc1, stableDoc2]),
          fetchArticles: noopFetch([]),
          fetchPages: noopFetch([]),
        }).pipe(
          Effect.provide(makeEnvLayer({ SEARCH_INDEX_PRUNE_DRY_RUN: "false" })),
          Effect.provide(Layer.succeed(EmbeddingService, makeEmbeddingMock())),
          Effect.provide(Layer.succeed(VectorizeService, mock1)),
          Effect.provide(Layer.succeed(KvCacheService, kv)),
        ),
      );

      // Sweep 2: dry-run left at its default ("true" when unset — fail safe).
      const { deleteCalls, mock: mock2 } = makeVectorizeCapture();
      await Effect.runPromise(
        runSanityIndexSync({
          fetchResponsibility: noopFetch([stableDoc1, stableDoc2]),
          fetchArticles: noopFetch([]),
          fetchPages: noopFetch([]),
        }).pipe(
          Effect.provide(makeEnvLayer()),
          Effect.provide(Layer.succeed(EmbeddingService, makeEmbeddingMock())),
          Effect.provide(Layer.succeed(VectorizeService, mock2)),
          Effect.provide(Layer.succeed(KvCacheService, kv)),
          Effect.provide(Logger.replace(Logger.defaultLogger, TestLogger)),
        ),
      );

      expect(deleteCalls).toHaveLength(0);
      expect(
        messages.some(
          (m) => m.includes("DRY RUN") && m.includes("sanity-abc-123"),
        ),
      ).toBe(true);
    });
  });
});
