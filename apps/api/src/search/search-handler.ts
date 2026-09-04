import { Effect } from "effect";
import { SearchResultType } from "@kcvv/api-contract";
import type { SearchRequest, SearchResponse } from "@kcvv/api-contract";
import { EmbeddingService, type EmbeddingError } from "./embedding";
import { VectorizeService, type VectorizeError } from "./vectorize";
import { AiAnswerService } from "./ai-answer";

export const MIN_SCORE = 0.35;
export const LLM_SCORE_THRESHOLD = 0.5;

export type SearchError = EmbeddingError | VectorizeError;

/**
 * The types the response contract admits. Vectorize outlives the schema: a
 * retired type's vectors stay until something names them, and one of those
 * rows fails the entire SearchResponse. Drop the row, keep the search.
 */
const RESULT_TYPES = new Set<string>(SearchResultType.literals);

const TYPE_FILTER: Record<string, string> = {
  responsibility: "responsibility",
  article: "article",
  general: "page",
};

export const handleSearch = (
  request: typeof SearchRequest.Type,
): Effect.Effect<
  typeof SearchResponse.Type,
  SearchError,
  EmbeddingService | VectorizeService | AiAnswerService
> =>
  Effect.gen(function* () {
    const embedding = yield* EmbeddingService;
    const vectorize = yield* VectorizeService;
    const aiAnswer = yield* AiAnswerService;

    const vector = yield* embedding.embed(request.query);

    const filter = request.type
      ? { type: TYPE_FILTER[request.type] ?? request.type }
      : undefined;

    const matches = yield* vectorize.query(vector, {
      topK: request.limit,
      returnMetadata: "all",
      ...(filter ? { filter } : {}),
    });

    const results = matches
      .filter(
        (m) =>
          m.score >= MIN_SCORE &&
          RESULT_TYPES.has(String(m.metadata?.["type"] ?? "responsibility")),
      )
      .map((m) => ({
        id: m.id,
        slug: m.metadata?.["slug"] ?? "",
        type: (m.metadata?.["type"] ?? "responsibility") as
          "responsibility" | "article" | "page",
        score: m.score,
        title: m.metadata?.["title"] ?? "",
        excerpt: m.metadata?.["excerpt"] ?? "",
      }));

    const topScore = results[0]?.score ?? 0;
    let answer: string | undefined;

    if (topScore >= LLM_SCORE_THRESHOLD) {
      const context = results
        .slice(0, 3)
        .map((r, i) => `${i + 1}. ${r.title}: ${r.excerpt}`)
        .join("\n");

      answer = yield* aiAnswer
        .generateAnswer(request.query, context)
        .pipe(Effect.catchAll(() => Effect.succeed(undefined)));
    }

    return { results, ...(answer ? { answer } : {}) };
  });
