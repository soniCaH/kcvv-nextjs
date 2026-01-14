/**
 * DrupalService Tests
 * Comprehensive test suite for Drupal API integration
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { Effect } from "effect";
import { DrupalService, DrupalServiceLive } from "./DrupalService";

// Mock fetch globally
global.fetch = vi.fn();

describe("DrupalService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getArticles", () => {
    it("should fetch articles successfully", async () => {
      const mockResponse = {
        data: [
          {
            id: "1",
            type: "node--article",
            attributes: {
              title: "Test Article",
              created: "2025-01-01T00:00:00Z",
              path: {
                alias: "/news/test-article",
              },
            },
            relationships: {
              field_image: {},
              field_category: {
                data: [],
              },
            },
          },
        ],
        links: {
          self: { href: "/jsonapi/node/article" },
          next: { href: "/jsonapi/node/article?page[offset]=10" },
        },
      };

      (
        global.fetch as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getArticles({ limit: 10 });
      });

      const result = await Effect.runPromise(
        program.pipe(Effect.provide(DrupalServiceLive)),
      );

      expect(result.articles).toHaveLength(1);
      expect(result.articles[0].attributes.title).toBe("Test Article");
      expect(result.links).toBeDefined();
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/jsonapi/node/article"),
        expect.objectContaining({
          headers: expect.objectContaining({
            Accept: "application/vnd.api+json",
          }),
        }),
      );
    });

    it("should handle network errors", async () => {
      (
        global.fetch as unknown as ReturnType<typeof vi.fn>
      ).mockRejectedValueOnce(new Error("Network error"));

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getArticles();
      });

      await expect(
        Effect.runPromise(program.pipe(Effect.provide(DrupalServiceLive))),
      ).rejects.toThrow();
    }, 15000);

    it("should handle HTTP errors", async () => {
      (
        global.fetch as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      });

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getArticles();
      });

      await expect(
        Effect.runPromise(program.pipe(Effect.provide(DrupalServiceLive))),
      ).rejects.toThrow();
    }, 15000);

    it("should apply pagination parameters", async () => {
      const mockResponse = { data: [] };

      (
        global.fetch as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getArticles({ page: 2, limit: 18 });
      });

      await Effect.runPromise(program.pipe(Effect.provide(DrupalServiceLive)));

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("page%5Blimit%5D=18"),
        expect.anything(),
      );
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("page%5Boffset%5D=18"),
        expect.anything(),
      );
    });

    it("should filter by category", async () => {
      const mockResponse = { data: [] };

      (
        global.fetch as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getArticles({ categoryId: 123 });
      });

      await Effect.runPromise(program.pipe(Effect.provide(DrupalServiceLive)));

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(
          "filter%5Bfield_tags.drupal_internal__tid%5D=123",
        ),
        expect.anything(),
      );
    });

    it("should resolve article images from included media and file entities", async () => {
      const mockResponse = {
        data: [
          {
            id: "article-1",
            type: "node--article",
            attributes: {
              title: "Article with Image",
              created: "2025-01-01T00:00:00Z",
              path: { alias: "/news/article-with-image" },
            },
            relationships: {
              field_media_article_image: {
                data: {
                  type: "media--image",
                  id: "media-123",
                },
              },
              field_tags: { data: [] },
            },
          },
        ],
        included: [
          {
            id: "media-123",
            type: "media--image",
            attributes: {
              name: "Article Hero Image",
            },
            relationships: {
              field_media_image: {
                data: {
                  id: "file-456",
                  type: "file--file",
                  meta: {
                    alt: "Hero image alt text",
                    width: 1200,
                    height: 800,
                  },
                },
              },
            },
          },
          {
            id: "file-456",
            type: "file--file",
            attributes: {
              filename: "hero.jpg",
              uri: {
                url: "https://api.example.com/files/hero.jpg",
              },
              filemime: "image/jpeg",
            },
          },
        ],
        links: {
          self: { href: "/jsonapi/node/article" },
        },
      };

      (
        global.fetch as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getArticles({});
      });

      const result = await Effect.runPromise(
        program.pipe(Effect.provide(DrupalServiceLive)),
      );

      expect(result.articles).toHaveLength(1);
      const imageData =
        result.articles[0].relationships.field_media_article_image?.data;
      expect(imageData).toBeDefined();
      if (imageData && "uri" in imageData) {
        expect(imageData.uri.url).toBe(
          "https://api.example.com/files/hero.jpg",
        );
        expect(imageData.alt).toBe("Hero image alt text");
      }
    });

    it("should keep original reference when media has no file reference", async () => {
      const mockResponse = {
        data: [
          {
            id: "article-1",
            type: "node--article",
            attributes: {
              title: "Article with missing file ref",
              created: "2025-01-01T00:00:00Z",
              path: { alias: "/news/missing-file-ref" },
            },
            relationships: {
              field_media_article_image: {
                data: {
                  type: "media--image",
                  id: "media-no-file",
                },
              },
              field_tags: { data: [] },
            },
          },
        ],
        included: [
          {
            id: "media-no-file",
            type: "media--image",
            attributes: {
              name: "Media Without File",
            },
            relationships: {},
          },
        ],
        links: {
          self: { href: "/jsonapi/node/article" },
        },
      };

      (
        global.fetch as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getArticles({});
      });

      const result = await Effect.runPromise(
        program.pipe(Effect.provide(DrupalServiceLive)),
      );

      expect(result.articles).toHaveLength(1);
      const imageData =
        result.articles[0].relationships.field_media_article_image?.data;
      expect(imageData).toBeDefined();
    });

    it("should keep original reference when file not found in included", async () => {
      const mockResponse = {
        data: [
          {
            id: "article-1",
            type: "node--article",
            attributes: {
              title: "Article with missing file",
              created: "2025-01-01T00:00:00Z",
              path: { alias: "/news/missing-file" },
            },
            relationships: {
              field_media_article_image: {
                data: {
                  type: "media--image",
                  id: "media-with-missing-file",
                },
              },
              field_tags: { data: [] },
            },
          },
        ],
        included: [
          {
            id: "media-with-missing-file",
            type: "media--image",
            attributes: {
              name: "Media With Missing File",
            },
            relationships: {
              field_media_image: {
                data: {
                  id: "file-nonexistent",
                  type: "file--file",
                },
              },
            },
          },
        ],
        links: {
          self: { href: "/jsonapi/node/article" },
        },
      };

      (
        global.fetch as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getArticles({});
      });

      const result = await Effect.runPromise(
        program.pipe(Effect.provide(DrupalServiceLive)),
      );

      expect(result.articles).toHaveLength(1);
      const imageData =
        result.articles[0].relationships.field_media_article_image?.data;
      expect(imageData).toBeDefined();
    });

    it("should resolve tags from included taxonomy terms", async () => {
      const mockResponse = {
        data: [
          {
            id: "article-1",
            type: "node--article",
            attributes: {
              title: "Article with Tags",
              created: "2025-01-01T00:00:00Z",
              path: { alias: "/news/article-with-tags" },
            },
            relationships: {
              field_media_article_image: {},
              field_tags: {
                data: [
                  { id: "tag-1", type: "taxonomy_term--category" },
                  { id: "tag-2", type: "taxonomy_term--category" },
                ],
              },
            },
          },
        ],
        included: [
          {
            id: "tag-1",
            type: "taxonomy_term--category",
            attributes: {
              name: "Sports",
              drupal_internal__tid: 1,
            },
          },
          {
            id: "tag-2",
            type: "taxonomy_term--category",
            attributes: {
              name: "News",
              drupal_internal__tid: 2,
            },
          },
        ],
        links: {
          self: { href: "/jsonapi/node/article" },
        },
      };

      (
        global.fetch as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getArticles({});
      });

      const result = await Effect.runPromise(
        program.pipe(Effect.provide(DrupalServiceLive)),
      );

      expect(result.articles).toHaveLength(1);
      const tagsData = result.articles[0].relationships.field_tags?.data;
      expect(tagsData).toHaveLength(2);
    });

    it("should handle already resolved tags (with attributes)", async () => {
      const mockResponse = {
        data: [
          {
            id: "article-1",
            type: "node--article",
            attributes: {
              title: "Article with Pre-resolved Tags",
              created: "2025-01-01T00:00:00Z",
              path: { alias: "/news/pre-resolved-tags" },
            },
            relationships: {
              field_media_article_image: {},
              field_tags: {
                data: [
                  {
                    id: "tag-1",
                    type: "taxonomy_term--category",
                    attributes: {
                      name: "Already Resolved",
                      drupal_internal__tid: 1,
                    },
                  },
                ],
              },
            },
          },
        ],
        links: {
          self: { href: "/jsonapi/node/article" },
        },
      };

      (
        global.fetch as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getArticles({});
      });

      const result = await Effect.runPromise(
        program.pipe(Effect.provide(DrupalServiceLive)),
      );

      expect(result.articles).toHaveLength(1);
      const tagsData = result.articles[0].relationships.field_tags?.data;
      expect(tagsData).toHaveLength(1);
    });

    it("should keep original reference when media not found in included", async () => {
      const mockResponse = {
        data: [
          {
            id: "article-1",
            type: "node--article",
            attributes: {
              title: "Article with missing media",
              created: "2025-01-01T00:00:00Z",
              path: { alias: "/news/missing-media" },
            },
            relationships: {
              field_media_article_image: {
                data: {
                  type: "media--image",
                  id: "media-nonexistent",
                },
              },
              field_tags: { data: [] },
            },
          },
        ],
        included: [],
        links: {
          self: { href: "/jsonapi/node/article" },
        },
      };

      (
        global.fetch as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getArticles({});
      });

      const result = await Effect.runPromise(
        program.pipe(Effect.provide(DrupalServiceLive)),
      );

      expect(result.articles).toHaveLength(1);
      const imageData =
        result.articles[0].relationships.field_media_article_image?.data;
      expect(imageData).toBeDefined();
      if (imageData && "type" in imageData && "id" in imageData) {
        expect(imageData.type).toBe("media--image");
        expect(imageData.id).toBe("media-nonexistent");
      }
    });

    it("should keep tag reference when not found in included", async () => {
      const mockResponse = {
        data: [
          {
            id: "article-1",
            type: "node--article",
            attributes: {
              title: "Article with Unresolvable Tag",
              created: "2025-01-01T00:00:00Z",
              path: { alias: "/news/unresolvable-tag" },
            },
            relationships: {
              field_media_article_image: {},
              field_tags: {
                data: [
                  { id: "tag-nonexistent", type: "taxonomy_term--category" },
                ],
              },
            },
          },
        ],
        included: [],
        links: {
          self: { href: "/jsonapi/node/article" },
        },
      };

      (
        global.fetch as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getArticles({});
      });

      const result = await Effect.runPromise(
        program.pipe(Effect.provide(DrupalServiceLive)),
      );

      expect(result.articles).toHaveLength(1);
      const tagsData = result.articles[0].relationships.field_tags?.data;
      expect(tagsData).toHaveLength(1);
    });
  });

  describe("getArticleById", () => {
    it("should fetch article by ID", async () => {
      const mockResponse = {
        data: {
          id: "1",
          type: "node--article",
          attributes: {
            title: "Test Article",
            created: "2025-01-01T00:00:00Z",
            path: {
              alias: "/news/test-article",
            },
          },
          relationships: {
            field_media_article_image: {},
            field_tags: { data: [] },
          },
        },
      };

      (
        global.fetch as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getArticleById("1");
      });

      const result = await Effect.runPromise(
        program.pipe(Effect.provide(DrupalServiceLive)),
      );

      expect(result.attributes.title).toBe("Test Article");
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/jsonapi/node/article/1"),
        expect.anything(),
      );
    });
  });

  describe("getArticleBySlug", () => {
    it("should fetch article by slug", async () => {
      const mockResponse = {
        data: [
          {
            id: "1",
            type: "node--article",
            attributes: {
              title: "Test Article",
              created: "2025-01-01T00:00:00Z",
              path: {
                alias: "/news/test-article",
              },
            },
            relationships: {
              field_media_article_image: {},
              field_tags: { data: [] },
            },
          },
        ],
      };

      (
        global.fetch as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getArticleBySlug("test-article");
      });

      const result = await Effect.runPromise(
        program.pipe(Effect.provide(DrupalServiceLive)),
      );

      expect(result.attributes.title).toBe("Test Article");
    });

    it("should throw NotFoundError when article not found", async () => {
      const mockResponse = { data: [] };

      (
        global.fetch as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getArticleBySlug("non-existent");
      });

      await expect(
        Effect.runPromise(program.pipe(Effect.provide(DrupalServiceLive))),
      ).rejects.toThrow();
    });

    it("should normalize slug with leading slash", async () => {
      // Note: getArticleBySlug uses getArticles() as a workaround for Drupal API bug
      // It fetches all articles and filters in memory rather than using API filter
      const mockResponse = {
        data: [
          {
            id: "1",
            type: "node--article",
            attributes: {
              title: "Test Article",
              created: "2025-01-01T00:00:00Z",
              path: {
                alias: "/news/test-article",
              },
            },
            relationships: {
              field_media_article_image: {},
              field_tags: { data: [] },
            },
          },
        ],
        links: {
          self: { href: "/jsonapi/node/article" },
        },
      };

      (
        global.fetch as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getArticleBySlug("test-article"); // Without leading slash
      });

      const result = await Effect.runPromise(
        program.pipe(Effect.provide(DrupalServiceLive)),
      );

      // Should normalize slug to /news/test-article
      expect(result.attributes.path.alias).toBe("/news/test-article");

      // Should fetch articles (workaround for API filter bug)
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/jsonapi/node/article"),
        expect.anything(),
      );
    });

    it("should paginate through multiple pages to find article", async () => {
      // First page - no match
      const mockResponse1 = {
        data: [
          {
            id: "1",
            type: "node--article",
            attributes: {
              title: "Other Article",
              created: "2025-01-01T00:00:00Z",
              path: {
                alias: "/news/other-article",
              },
            },
            relationships: {
              field_media_article_image: {},
              field_tags: { data: [] },
            },
          },
        ],
        links: {
          self: { href: "/jsonapi/node/article" },
          next: { href: "/jsonapi/node/article?page[offset]=50" },
        },
      };

      // Second page - match found
      const mockResponse2 = {
        data: [
          {
            id: "2",
            type: "node--article",
            attributes: {
              title: "Target Article",
              created: "2025-01-02T00:00:00Z",
              path: {
                alias: "/news/target-article",
              },
            },
            relationships: {
              field_media_article_image: {},
              field_tags: { data: [] },
            },
          },
        ],
        links: {
          self: { href: "/jsonapi/node/article?page[offset]=50" },
        },
      };

      (global.fetch as unknown as ReturnType<typeof vi.fn>)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse1,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse2,
        });

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getArticleBySlug("target-article");
      });

      const result = await Effect.runPromise(
        program.pipe(Effect.provide(DrupalServiceLive)),
      );

      expect(result.attributes.title).toBe("Target Article");
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    it("should stop pagination when no more pages available", async () => {
      const mockResponse = {
        data: [
          {
            id: "1",
            type: "node--article",
            attributes: {
              title: "Last Article",
              created: "2025-01-01T00:00:00Z",
              path: {
                alias: "/news/last-article",
              },
            },
            relationships: {
              field_media_article_image: {},
              field_tags: { data: [] },
            },
          },
        ],
        links: {
          self: { href: "/jsonapi/node/article" },
          // No next link - last page
        },
      };

      (
        global.fetch as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getArticleBySlug("non-existent");
      });

      await expect(
        Effect.runPromise(program.pipe(Effect.provide(DrupalServiceLive))),
      ).rejects.toThrow();

      // Should only call once since there's no next page
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it("should stop pagination when empty data returned", async () => {
      const mockResponse = {
        data: [], // Empty data array
      };

      (
        global.fetch as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getArticleBySlug("non-existent");
      });

      await expect(
        Effect.runPromise(program.pipe(Effect.provide(DrupalServiceLive))),
      ).rejects.toThrow();

      // Should only call once since data is empty
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe("getTeams", () => {
    it("should fetch all teams", async () => {
      const mockResponse = {
        data: [
          {
            id: "1",
            type: "node--team",
            attributes: {
              title: "First Team",
              field_team_id: 123,
              created: "2025-01-01T00:00:00Z",
              path: {
                alias: "/team/first-team",
              },
            },
            relationships: {
              field_image: {},
            },
          },
        ],
      };

      (
        global.fetch as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getTeams();
      });

      const result = await Effect.runPromise(
        program.pipe(Effect.provide(DrupalServiceLive)),
      );

      expect(result).toHaveLength(1);
      expect(result[0].attributes.field_team_id).toBe(123);
    });
  });

  describe("getTeamBySlug", () => {
    it("should fetch team by slug", async () => {
      const mockResponse = {
        data: [
          {
            id: "1",
            type: "node--team",
            attributes: {
              title: "First Team",
              field_team_id: 123,
              created: "2025-01-01T00:00:00Z",
              path: {
                alias: "/team/first-team",
              },
            },
            relationships: {
              field_image: {},
            },
          },
        ],
      };

      (
        global.fetch as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getTeamBySlug("first-team");
      });

      const result = await Effect.runPromise(
        program.pipe(Effect.provide(DrupalServiceLive)),
      );

      expect(result.attributes.title).toBe("First Team");
    });

    it("should normalize slug with leading slash", async () => {
      const mockResponse = { data: [] };

      (
        global.fetch as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getTeamBySlug("/team/first-team");
      });

      await expect(
        Effect.runPromise(program.pipe(Effect.provide(DrupalServiceLive))),
      ).rejects.toThrow();

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("filter%5Bpath.alias%5D=%2Fteam%2Ffirst-team"),
        expect.anything(),
      );
    });

    it("should throw NotFoundError when team not found", async () => {
      const mockResponse = { data: [] };

      (
        global.fetch as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getTeamBySlug("non-existent");
      });

      await expect(
        Effect.runPromise(program.pipe(Effect.provide(DrupalServiceLive))),
      ).rejects.toThrow();
    });
  });

  describe("getTeamById", () => {
    it("should fetch team by ID", async () => {
      const mockResponse = {
        data: {
          id: "1",
          type: "node--team",
          attributes: {
            title: "First Team",
            field_team_id: 123,
            created: "2025-01-01T00:00:00Z",
            path: {
              alias: "/team/first-team",
            },
          },
          relationships: {
            field_image: {},
          },
        },
      };

      (
        global.fetch as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getTeamById("1");
      });

      const result = await Effect.runPromise(
        program.pipe(Effect.provide(DrupalServiceLive)),
      );

      expect(result.attributes.title).toBe("First Team");
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/jsonapi/node/team/1"),
        expect.anything(),
      );
    });
  });

  describe("getPlayers", () => {
    it("should fetch players with team filter", async () => {
      const mockResponse = { data: [] };

      (
        global.fetch as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getPlayers({ teamId: "team-123" });
      });

      await Effect.runPromise(program.pipe(Effect.provide(DrupalServiceLive)));

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("filter%5Bfield_team.id%5D=team-123"),
        expect.anything(),
      );
    });

    it("should apply limit parameter", async () => {
      const mockResponse = { data: [] };

      (
        global.fetch as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getPlayers({ limit: 15 });
      });

      await Effect.runPromise(program.pipe(Effect.provide(DrupalServiceLive)));

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("page%5Blimit%5D=15"),
        expect.anything(),
      );
    });
  });

  describe("getPlayerBySlug", () => {
    it("should fetch player by slug", async () => {
      const mockResponse = {
        data: [
          {
            id: "1",
            type: "node--player",
            attributes: {
              title: "John Doe",
              field_number: 10,
              created: "2025-01-01T00:00:00Z",
              path: {
                alias: "/player/john-doe",
              },
            },
            relationships: {
              field_image: {},
              field_team: {},
            },
          },
        ],
      };

      (
        global.fetch as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getPlayerBySlug("john-doe");
      });

      const result = await Effect.runPromise(
        program.pipe(Effect.provide(DrupalServiceLive)),
      );

      expect(result.attributes.title).toBe("John Doe");
    });

    it("should throw NotFoundError when player not found", async () => {
      const mockResponse = { data: [] };

      (
        global.fetch as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getPlayerBySlug("non-existent");
      });

      await expect(
        Effect.runPromise(program.pipe(Effect.provide(DrupalServiceLive))),
      ).rejects.toThrow();
    });
  });

  describe("getPlayerById", () => {
    it("should fetch player by ID", async () => {
      const mockResponse = {
        data: {
          id: "1",
          type: "node--player",
          attributes: {
            title: "John Doe",
            field_number: 10,
            created: "2025-01-01T00:00:00Z",
            path: {
              alias: "/player/john-doe",
            },
          },
          relationships: {
            field_image: {},
            field_team: {},
          },
        },
      };

      (
        global.fetch as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getPlayerById("1");
      });

      const result = await Effect.runPromise(
        program.pipe(Effect.provide(DrupalServiceLive)),
      );

      expect(result.attributes.title).toBe("John Doe");
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/jsonapi/node/player/1"),
        expect.anything(),
      );
    });
  });

  describe("getEvents", () => {
    it("should fetch upcoming events", async () => {
      const mockResponse = { data: [] };

      (
        global.fetch as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getEvents({ upcoming: true });
      });

      await Effect.runPromise(program.pipe(Effect.provide(DrupalServiceLive)));

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("filter%5Bfield_event_date%5D"),
        expect.anything(),
      );
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("sort=field_event_date"),
        expect.anything(),
      );
    });

    it("should fetch past events with descending sort", async () => {
      const mockResponse = { data: [] };

      (
        global.fetch as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getEvents({ upcoming: false });
      });

      await Effect.runPromise(program.pipe(Effect.provide(DrupalServiceLive)));

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("sort=-field_event_date"),
        expect.anything(),
      );
    });

    it("should apply limit parameter", async () => {
      const mockResponse = { data: [] };

      (
        global.fetch as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getEvents({ limit: 5 });
      });

      await Effect.runPromise(program.pipe(Effect.provide(DrupalServiceLive)));

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("page%5Blimit%5D=5"),
        expect.anything(),
      );
    });
  });

  describe("getEventBySlug", () => {
    it("should fetch event by slug", async () => {
      const mockResponse = {
        data: [
          {
            id: "1",
            type: "node--event",
            attributes: {
              title: "Test Event",
              field_event_date: "2025-12-31T00:00:00Z",
              created: "2025-01-01T00:00:00Z",
              path: {
                alias: "/events/test-event",
              },
            },
            relationships: {
              field_image: {},
            },
          },
        ],
      };

      (
        global.fetch as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getEventBySlug("test-event");
      });

      const result = await Effect.runPromise(
        program.pipe(Effect.provide(DrupalServiceLive)),
      );

      expect(result.attributes.title).toBe("Test Event");
    });

    it("should throw NotFoundError when event not found", async () => {
      const mockResponse = { data: [] };

      (
        global.fetch as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getEventBySlug("non-existent");
      });

      await expect(
        Effect.runPromise(program.pipe(Effect.provide(DrupalServiceLive))),
      ).rejects.toThrow();
    });
  });

  describe("getSponsors", () => {
    it("should filter by single type", async () => {
      const mockResponse = { data: [] };

      (
        global.fetch as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getSponsors({ type: "main" });
      });

      await Effect.runPromise(program.pipe(Effect.provide(DrupalServiceLive)));

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("filter%5Bfield_type%5D=main"),
        expect.anything(),
      );
    });

    it("should filter by multiple types", async () => {
      const mockResponse = { data: [] };

      (
        global.fetch as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getSponsors({ type: ["main", "premium"] });
      });

      await Effect.runPromise(program.pipe(Effect.provide(DrupalServiceLive)));

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(
          "filter%5Bfield_type%5D%5Bcondition%5D%5Boperator%5D=IN",
        ),
        expect.anything(),
      );
    });

    it("should filter by promoted status", async () => {
      const mockResponse = { data: [] };

      (
        global.fetch as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getSponsors({ promoted: true });
      });

      await Effect.runPromise(program.pipe(Effect.provide(DrupalServiceLive)));

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("filter%5Bpromote%5D=1"),
        expect.anything(),
      );
    });

    it("should apply limit and sort parameters", async () => {
      const mockResponse = { data: [] };

      (
        global.fetch as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getSponsors({ limit: 10, sort: "title" });
      });

      await Effect.runPromise(program.pipe(Effect.provide(DrupalServiceLive)));

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("page%5Blimit%5D=10"),
        expect.anything(),
      );
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("sort=title"),
        expect.anything(),
      );
    });

    it("should resolve sponsor logos from included media and file entities", async () => {
      const mockResponse = {
        data: [
          {
            id: "sponsor-1",
            type: "node--sponsor",
            attributes: {
              title: "Main Sponsor",
              created: "2025-01-01T00:00:00Z",
              path: { alias: "/sponsor/main" },
              field_type: "crossing",
            },
            relationships: {
              field_media_image: {
                data: {
                  type: "media--image",
                  id: "media-123",
                },
              },
            },
          },
        ],
        included: [
          {
            id: "media-123",
            type: "media--image",
            attributes: {
              name: "Sponsor Logo",
              status: true,
            },
            relationships: {
              field_media_image: {
                data: {
                  id: "file-456",
                  type: "file--file",
                  meta: {
                    alt: "Main Sponsor Logo",
                    width: 200,
                    height: 100,
                  },
                },
              },
            },
          },
          {
            id: "file-456",
            type: "file--file",
            attributes: {
              filename: "sponsor-logo.png",
              uri: {
                url: "https://api.example.com/files/sponsor-logo.png",
              },
              filemime: "image/png",
              filesize: 10240,
            },
          },
        ],
      };

      (
        global.fetch as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getSponsors({});
      });

      const result = await Effect.runPromise(
        program.pipe(Effect.provide(DrupalServiceLive)),
      );

      expect(result).toHaveLength(1);
      expect(result[0].attributes.title).toBe("Main Sponsor");
      // The logo should be resolved to the file URL
      const imageData = result[0].relationships.field_media_image?.data;
      expect(imageData).toBeDefined();
      if (imageData && "uri" in imageData) {
        expect(imageData.uri.url).toBe(
          "https://api.example.com/files/sponsor-logo.png",
        );
        expect(imageData.alt).toBe("Main Sponsor Logo");
        expect(imageData.width).toBe(200);
        expect(imageData.height).toBe(100);
      }
    });

    it("should handle relative file URLs by making them absolute", async () => {
      const mockResponse = {
        data: [
          {
            id: "sponsor-1",
            type: "node--sponsor",
            attributes: {
              title: "Local Sponsor",
              created: "2025-01-01T00:00:00Z",
              path: { alias: "/sponsor/local" },
              field_type: "green",
            },
            relationships: {
              field_media_image: {
                data: {
                  type: "media--image",
                  id: "media-789",
                },
              },
            },
          },
        ],
        included: [
          {
            id: "media-789",
            type: "media--image",
            attributes: {
              name: "Local Logo",
            },
            relationships: {
              field_media_image: {
                data: {
                  id: "file-101",
                  type: "file--file",
                  meta: {
                    alt: "Local Sponsor Logo",
                  },
                },
              },
            },
          },
          {
            id: "file-101",
            type: "file--file",
            attributes: {
              filename: "local-logo.jpg",
              uri: {
                url: "/sites/default/files/local-logo.jpg",
              },
              filemime: "image/jpeg",
            },
          },
        ],
      };

      (
        global.fetch as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getSponsors({});
      });

      const result = await Effect.runPromise(
        program.pipe(Effect.provide(DrupalServiceLive)),
      );

      expect(result).toHaveLength(1);
      const imageData = result[0].relationships.field_media_image?.data;
      expect(imageData).toBeDefined();
      if (imageData && "uri" in imageData) {
        // Relative URL should be made absolute with the base URL
        expect(imageData.uri.url).toContain(
          "/sites/default/files/local-logo.jpg",
        );
      }
    });

    it("should keep original reference when media not found in included", async () => {
      const mockResponse = {
        data: [
          {
            id: "sponsor-1",
            type: "node--sponsor",
            attributes: {
              title: "Missing Media Sponsor",
              created: "2025-01-01T00:00:00Z",
              path: { alias: "/sponsor/missing" },
              field_type: "white",
            },
            relationships: {
              field_media_image: {
                data: {
                  type: "media--image",
                  id: "media-nonexistent",
                },
              },
            },
          },
        ],
        included: [],
      };

      (
        global.fetch as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getSponsors({});
      });

      const result = await Effect.runPromise(
        program.pipe(Effect.provide(DrupalServiceLive)),
      );

      expect(result).toHaveLength(1);
      // Original reference should be kept when media not found
      const imageData = result[0].relationships.field_media_image?.data;
      expect(imageData).toBeDefined();
      if (imageData && "type" in imageData && "id" in imageData) {
        expect(imageData.type).toBe("media--image");
        expect(imageData.id).toBe("media-nonexistent");
      }
    });

    it("should keep original reference when file not found in included", async () => {
      const mockResponse = {
        data: [
          {
            id: "sponsor-1",
            type: "node--sponsor",
            attributes: {
              title: "Missing File Sponsor",
              created: "2025-01-01T00:00:00Z",
              path: { alias: "/sponsor/missing-file" },
              field_type: "panel",
            },
            relationships: {
              field_media_image: {
                data: {
                  type: "media--image",
                  id: "media-with-missing-file",
                },
              },
            },
          },
        ],
        included: [
          {
            id: "media-with-missing-file",
            type: "media--image",
            attributes: {
              name: "Media With Missing File",
            },
            relationships: {
              field_media_image: {
                data: {
                  id: "file-nonexistent",
                  type: "file--file",
                },
              },
            },
          },
        ],
      };

      (
        global.fetch as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getSponsors({});
      });

      const result = await Effect.runPromise(
        program.pipe(Effect.provide(DrupalServiceLive)),
      );

      expect(result).toHaveLength(1);
      // Original reference should be kept when file not found
      const imageData = result[0].relationships.field_media_image?.data;
      expect(imageData).toBeDefined();
    });

    it("should keep original when media has no file reference", async () => {
      const mockResponse = {
        data: [
          {
            id: "sponsor-1",
            type: "node--sponsor",
            attributes: {
              title: "No File Ref Sponsor",
              created: "2025-01-01T00:00:00Z",
              path: { alias: "/sponsor/no-file-ref" },
              field_type: "other",
            },
            relationships: {
              field_media_image: {
                data: {
                  type: "media--image",
                  id: "media-no-file",
                },
              },
            },
          },
        ],
        included: [
          {
            id: "media-no-file",
            type: "media--image",
            attributes: {
              name: "Media Without File Reference",
            },
            relationships: {},
          },
        ],
      };

      (
        global.fetch as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getSponsors({});
      });

      const result = await Effect.runPromise(
        program.pipe(Effect.provide(DrupalServiceLive)),
      );

      expect(result).toHaveLength(1);
      // Original reference should be kept when media has no file reference
      const imageData = result[0].relationships.field_media_image?.data;
      expect(imageData).toBeDefined();
    });

    it("should handle sponsor without media reference", async () => {
      const mockResponse = {
        data: [
          {
            id: "sponsor-1",
            type: "node--sponsor",
            attributes: {
              title: "No Image Sponsor",
              created: "2025-01-01T00:00:00Z",
              path: { alias: "/sponsor/no-image" },
              field_type: "crossing",
            },
            relationships: {},
          },
        ],
      };

      (
        global.fetch as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getSponsors({});
      });

      const result = await Effect.runPromise(
        program.pipe(Effect.provide(DrupalServiceLive)),
      );

      expect(result).toHaveLength(1);
      expect(result[0].attributes.title).toBe("No Image Sponsor");
      expect(result[0].relationships.field_media_image).toBeUndefined();
    });
  });

  describe("getTags", () => {
    it("should fetch tags with default vocabulary", async () => {
      const mockResponse = {
        data: [
          {
            id: "1",
            type: "taxonomy_term--category",
            attributes: {
              name: "Test Category",
              drupal_internal__tid: 1,
            },
          },
        ],
      };

      (
        global.fetch as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getTags();
      });

      const result = await Effect.runPromise(
        program.pipe(Effect.provide(DrupalServiceLive)),
      );

      expect(result).toHaveLength(1);
      expect(result[0].attributes.name).toBe("Test Category");
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/jsonapi/taxonomy_term/category"),
        expect.anything(),
      );
    });

    it("should fetch tags with custom vocabulary", async () => {
      const mockResponse = { data: [] };

      (
        global.fetch as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getTags({ vocabulary: "tags" });
      });

      await Effect.runPromise(program.pipe(Effect.provide(DrupalServiceLive)));

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/jsonapi/taxonomy_term/tags"),
        expect.anything(),
      );
    });

    it("should apply limit parameter", async () => {
      const mockResponse = { data: [] };

      (
        global.fetch as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getTags({ limit: 20 });
      });

      await Effect.runPromise(program.pipe(Effect.provide(DrupalServiceLive)));

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("page%5Blimit%5D=20"),
        expect.anything(),
      );
    });
  });

  describe("error handling", () => {
    it("should timeout after 30 seconds", async () => {
      (global.fetch as unknown as ReturnType<typeof vi.fn>).mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(
              () => resolve({ ok: true, json: async () => ({}) }),
              35000,
            );
          }),
      );

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getArticles();
      });

      await expect(
        Effect.runPromise(program.pipe(Effect.provide(DrupalServiceLive))),
      ).rejects.toThrow();
    }, 40000);

    it("should handle JSON parse errors", async () => {
      // Mock must account for retry attempts (3 retries + 1 initial = 4 calls)
      (global.fetch as unknown as ReturnType<typeof vi.fn>)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => {
            throw new Error("Invalid JSON");
          },
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => {
            throw new Error("Invalid JSON");
          },
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => {
            throw new Error("Invalid JSON");
          },
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => {
            throw new Error("Invalid JSON");
          },
        });

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getArticles();
      });

      await expect(
        Effect.runPromise(program.pipe(Effect.provide(DrupalServiceLive))),
      ).rejects.toThrow();
    }, 15000);

    it("should handle schema validation errors", async () => {
      const invalidResponse = {
        data: [
          {
            // Missing required fields
            id: "1",
            type: "node--article",
            // No attributes or relationships
          },
        ],
      };

      // Mock must account for retry attempts (3 retries + 1 initial = 4 calls)
      (global.fetch as unknown as ReturnType<typeof vi.fn>)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => invalidResponse,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => invalidResponse,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => invalidResponse,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => invalidResponse,
        });

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getArticles();
      });

      await expect(
        Effect.runPromise(program.pipe(Effect.provide(DrupalServiceLive))),
      ).rejects.toThrow();
    }, 15000);
  });
});
