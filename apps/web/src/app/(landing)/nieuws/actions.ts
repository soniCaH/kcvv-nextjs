"use server";

import { Effect } from "effect";
import { runPromise } from "@/lib/effect/runtime";
import {
  ArticleRepository,
  type ArticleVM,
} from "@/lib/repositories/article.repository";
import {
  clampListingWindow,
  paginateResults,
  type Paginated,
} from "@/lib/utils/pagination";

export async function fetchArticlesAction(params: {
  offset: number;
  limit: number;
  category?: string;
}): Promise<Paginated<ArticleVM>> {
  // `"use server"` makes this a public endpoint — clamp before GROQ.
  const { offset, limit } = clampListingWindow(params);

  const articles = await runPromise(
    Effect.gen(function* () {
      const repo = yield* ArticleRepository;
      return yield* repo.findPaginated({
        offset,
        limit: limit + 1,
        category: params.category,
      });
    }).pipe(
      Effect.catchAll((error) => {
        console.error("[fetchArticlesAction] Failed to fetch articles:", error);
        return Effect.succeed([] as ArticleVM[]);
      }),
    ),
  );

  return paginateResults(articles, limit);
}
