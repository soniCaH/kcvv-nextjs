import { createClient } from "@sanity/client";
import { Effect, Layer, Schema as S } from "effect";
import type { WorkerEnv } from "../env";
import { WorkerEnvTag } from "../env";
import { sanityClientConfig } from "../sanity/config";
import { EmbeddingService, EmbeddingServiceLive } from "../search/embedding";
import {
  ARTICLE_INDEX_PROJECTION,
  ARTICLE_PUBLISHED_FILTER,
  buildArticleIndexText,
  buildArticleMetadata,
  buildPageIndexText,
  buildResponsibilityIndexText,
} from "../search/index-queries";
import { VectorizeService, VectorizeServiceLive } from "../search/vectorize";
import { WebhookPayload } from "./schemas";
import { verifySvixSignature } from "./svix-verify";

// ─── Error types ───────────────────────────────────────────────────────────

class WebhookParseError {
  readonly _tag = "WebhookParseError";
  constructor(
    readonly code: "invalid_json" | "invalid_shape",
    readonly detail: string,
  ) {}
}

class WebhookAuthError {
  readonly _tag = "WebhookAuthError";
}

class WebhookServiceError {
  readonly _tag = "WebhookServiceError";
  constructor(
    readonly code:
      | "sanity_fetch_failed"
      | "embedding_failed"
      | "upsert_failed"
      | "delete_failed"
      | "invalid_document",
    readonly detail: string,
  ) {}
}

// ─── Pure helpers ──────────────────────────────────────────────────────────

const ALLOWED_TYPES = ["responsibility", "article", "page"] as const;
const ALLOWED_OPS = ["create", "update", "delete"] as const;

type AllowedType = (typeof ALLOWED_TYPES)[number];
type AllowedOp = (typeof ALLOWED_OPS)[number];

const isAllowedType = (value: string): value is AllowedType =>
  (ALLOWED_TYPES as readonly string[]).includes(value);

const isAllowedOp = (value: string): value is AllowedOp =>
  (ALLOWED_OPS as readonly string[]).includes(value);

const ResponsibilityDoc = S.Struct({
  title: S.String,
  question: S.String,
  keywords: S.Array(S.String),
  summary: S.String,
  slug: S.String,
});

// Every field below is coalesced in ARTICLE_INDEX_PROJECTION, so the declared
// shape is what GROQ returns rather than a cast over it (#2806).
const ArticleDoc = S.Struct({
  title: S.String,
  lead: S.String,
  tags: S.Array(S.String),
  prose: S.String,
  qaQuestions: S.Array(S.String),
  qaAnswers: S.String,
  tableHtml: S.Array(S.String),
  slug: S.String,
  imageUrl: S.optional(S.NullOr(S.String)),
});

const PageDoc = S.Struct({
  title: S.String,
  bodyText: S.NullOr(S.String),
  slug: S.String,
});

interface TypeDescriptor {
  readonly query: string;
  readonly buildIndex: (doc: Record<string, unknown>) => {
    indexText: string;
    metadata: Record<string, string>;
  };
}

const typeDescriptors: Record<AllowedType, TypeDescriptor> = {
  responsibility: {
    query: `*[_id == $id][0]{ _id, "slug": coalesce(slug.current,""), title, question, "keywords": coalesce(keywords,[]), "summary": coalesce(summary,"") }`,
    buildIndex: (doc) => {
      const r = S.decodeUnknownSync(ResponsibilityDoc)(doc);
      return {
        indexText: buildResponsibilityIndexText(r),
        metadata: {
          slug: r.slug,
          type: "responsibility",
          title: r.title,
          excerpt: r.summary.slice(0, 200),
        },
      };
    },
  },
  article: {
    query: `*[_id == $id && ${ARTICLE_PUBLISHED_FILTER}][0]{ ${ARTICLE_INDEX_PROJECTION} }`,
    buildIndex: (doc) => {
      const r = S.decodeUnknownSync(ArticleDoc)(doc);
      return {
        indexText: buildArticleIndexText(r),
        metadata: buildArticleMetadata(r),
      };
    },
  },
  page: {
    query: `*[_id == $id][0]{ _id, "slug": coalesce(slug.current,""), title, "bodyText": pt::text(body) }`,
    buildIndex: (doc) => {
      const r = S.decodeUnknownSync(PageDoc)(doc);
      return {
        indexText: buildPageIndexText(r),
        metadata: {
          slug: r.slug,
          type: "page",
          title: r.title,
          excerpt: (r.bodyText ?? "").slice(0, 200),
        },
      };
    },
  },
};

function buildDocumentIndex(
  _type: AllowedType,
  doc: Record<string, unknown>,
): { indexText: string; metadata: Record<string, string> } {
  return typeDescriptors[_type].buildIndex(doc);
}

function queryForType(type: AllowedType): string {
  return typeDescriptors[type].query;
}

const errorMessage = (err: unknown) =>
  err instanceof Error ? err.message : String(err);

// ─── Error → Response mapping ──────────────────────────────────────────────

const toErrorResponse = (
  error: WebhookParseError | WebhookAuthError | WebhookServiceError,
): Response => {
  switch (error._tag) {
    case "WebhookParseError":
      return Response.json(
        { ok: false, error: error.code, code: "parse_failed" },
        { status: 400 },
      );
    case "WebhookAuthError":
      return new Response("Unauthorized", { status: 401 });
    case "WebhookServiceError":
      return Response.json(
        { ok: false, error: "Internal server error" },
        { status: 500 },
      );
  }
};

// ─── Effect pipeline ───────────────────────────────────────────────────────

const webhookEffect = (request: Request, webhookSecret: string) =>
  Effect.gen(function* () {
    const env = yield* WorkerEnvTag;
    const embedding = yield* EmbeddingService;
    const vectorize = yield* VectorizeService;

    // 1. Read raw body
    const rawBody = yield* Effect.tryPromise({
      try: () => request.text(),
      catch: () => new WebhookParseError("invalid_json", "failed to read body"),
    });

    // 2. Verify SVIX signature
    const valid = yield* Effect.tryPromise({
      try: () => verifySvixSignature(request.headers, rawBody, webhookSecret),
      catch: () => new WebhookAuthError(),
    });
    if (!valid) return yield* Effect.fail(new WebhookAuthError());

    // 3. Parse JSON
    const parsed = yield* Effect.try({
      try: () => JSON.parse(rawBody) as unknown,
      catch: () => new WebhookParseError("invalid_json", "malformed JSON body"),
    });

    // 4. Validate payload via Effect Schema
    const payload = yield* S.decodeUnknown(WebhookPayload)(parsed).pipe(
      Effect.mapError(
        () =>
          new WebhookParseError("invalid_shape", "schema validation failed"),
      ),
    );

    const { _id, _type } = payload;

    // 5. Check operation
    const operation = request.headers.get("sanity-operation") ?? "update";
    if (!isAllowedOp(operation)) {
      return Response.json({ ok: true, action: "skipped_unknown_operation" });
    }

    // 6. Delete path — ahead of the type gate on purpose. A retired type still
    // has vectors in the index from when it was indexed, and its delete
    // webhook is the only event that will ever name them; gating it on the
    // current ALLOWED_TYPES stranded every `responsibilityPath` vector, and one
    // stranded vector fails the whole search response, not just its own row.
    // Deleting an id the index does not hold is a no-op.
    if (operation === "delete") {
      yield* vectorize
        .deleteByIds([_id])
        .pipe(
          Effect.mapError(
            (err) =>
              new WebhookServiceError("delete_failed", errorMessage(err)),
          ),
        );
      return Response.json({ ok: true, action: "deleted" });
    }

    // 7. Check document type
    if (!isAllowedType(_type)) {
      return Response.json({ ok: true, action: "skipped_unknown_type" });
    }
    const docType = _type;

    // 8. Fetch document from Sanity
    const sanityClient = createClient({
      ...sanityClientConfig(env),
      useCdn: false,
    });
    const doc = yield* Effect.tryPromise({
      try: () =>
        sanityClient.fetch<Record<string, unknown> | null>(
          queryForType(docType),
          { id: _id },
        ),
      catch: (err) =>
        new WebhookServiceError("sanity_fetch_failed", errorMessage(err)),
    });

    // No document came back: it is gone, or ARTICLE_PUBLISHED_FILTER now holds
    // it out because it expired or is future-dated. Either way its vector must
    // go — runSanityIndexSync only upserts, so nothing else would ever remove
    // it and search would keep serving an article the site no longer shows.
    if (!doc) {
      yield* vectorize
        .deleteByIds([_id])
        .pipe(
          Effect.mapError(
            (err) =>
              new WebhookServiceError("delete_failed", errorMessage(err)),
          ),
        );
      return Response.json({ ok: true, action: "skipped_not_found" });
    }

    // 9. Build index text + metadata
    const { indexText, metadata } = yield* Effect.try({
      try: () => buildDocumentIndex(docType, doc),
      catch: (err) =>
        new WebhookServiceError(
          "invalid_document",
          `document validation failed for ${docType}: ${errorMessage(err)}`,
        ),
    });

    // 10. Embed
    const vector = yield* embedding
      .embed(indexText)
      .pipe(
        Effect.mapError(
          (err) =>
            new WebhookServiceError("embedding_failed", errorMessage(err)),
        ),
      );

    // 11. Upsert vector
    yield* vectorize
      .upsert([{ id: _id, values: vector, metadata }])
      .pipe(
        Effect.mapError(
          (err) => new WebhookServiceError("upsert_failed", errorMessage(err)),
        ),
      );

    return Response.json({ ok: true, action: "indexed" });
  });

// ─── Public handler ────────────────────────────────────────────────────────

export type WebhookLayer = Layer.Layer<EmbeddingService | VectorizeService>;

export async function handleIndexWebhook(
  request: Request,
  env: WorkerEnv,
  layer?: WebhookLayer,
): Promise<Response> {
  const envLayer = Layer.succeed(WorkerEnvTag, env);
  const serviceLayer =
    layer ?? Layer.mergeAll(EmbeddingServiceLive, VectorizeServiceLive);

  return Effect.runPromise(
    webhookEffect(request, env.SANITY_WEBHOOK_SECRET).pipe(
      Effect.provide(serviceLayer),
      Effect.provide(envLayer),
      Effect.tapError((error) =>
        Effect.sync(() => {
          if (error._tag === "WebhookServiceError") {
            console.error(`[webhook] ${error.code}: ${error.detail}`);
          }
        }),
      ),
      Effect.catchAll((error) => Effect.succeed(toErrorResponse(error))),
      Effect.catchAllDefect(() =>
        Effect.succeed(
          Response.json(
            { ok: false, error: "internal error", code: "internal" },
            { status: 500 },
          ),
        ),
      ),
    ),
  );
}
