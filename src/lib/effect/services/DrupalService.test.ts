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
      expect(result[0].attributes.title).toBe("First Team");
    });
  });

  describe("getTeamBySlug", () => {
    it("should fetch team by slug using decoupled router", async () => {
      // Mock router response
      const mockRouterResponse = {
        resolved: "http://api.kcvvelewijt.be/team/first-team",
        isHomePath: false,
        entity: {
          canonical: "http://api.kcvvelewijt.be/team/first-team",
          type: "node",
          bundle: "team",
          id: "1",
          uuid: "team-abc-123",
        },
        label: "First Team",
        jsonapi: {
          individual:
            "http://api.kcvvelewijt.be/jsonapi/node/team/team-abc-123",
          resourceName: "node--team",
          basePath: "/jsonapi",
          entryPoint: "http://api.kcvvelewijt.be/jsonapi",
        },
      };

      // Mock team response
      const mockTeamResponse = {
        data: {
          id: "team-abc-123",
          type: "node--team",
          attributes: {
            title: "First Team",
            created: "2025-01-01T00:00:00Z",
            path: { alias: "/team/first-team" },
          },
          relationships: {
            field_image: {},
          },
        },
      };

      const mockFetch = global.fetch as unknown as ReturnType<typeof vi.fn>;
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockRouterResponse,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockTeamResponse,
        });

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getTeamBySlug("first-team");
      });

      const result = await Effect.runPromise(
        program.pipe(Effect.provide(DrupalServiceLive)),
      );

      expect(result.attributes.title).toBe("First Team");
      expect(result.id).toBe("team-abc-123");
    });

    it("should normalize slug with leading slash", async () => {
      // Mock router response
      const mockRouterResponse = {
        resolved: "http://api.kcvvelewijt.be/team/first-team",
        isHomePath: false,
        entity: {
          canonical: "http://api.kcvvelewijt.be/team/first-team",
          type: "node",
          bundle: "team",
          id: "1",
          uuid: "team-abc-123",
        },
        label: "First Team",
        jsonapi: {
          individual:
            "http://api.kcvvelewijt.be/jsonapi/node/team/team-abc-123",
          resourceName: "node--team",
          basePath: "/jsonapi",
          entryPoint: "http://api.kcvvelewijt.be/jsonapi",
        },
      };

      // Mock team response
      const mockTeamResponse = {
        data: {
          id: "team-abc-123",
          type: "node--team",
          attributes: {
            title: "First Team",
            created: "2025-01-01T00:00:00Z",
            path: { alias: "/team/first-team" },
          },
          relationships: {
            field_image: {},
          },
        },
      };

      const mockFetch = global.fetch as unknown as ReturnType<typeof vi.fn>;
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockRouterResponse,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockTeamResponse,
        });

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getTeamBySlug("/team/first-team");
      });

      const result = await Effect.runPromise(
        program.pipe(Effect.provide(DrupalServiceLive)),
      );

      expect(result.attributes.title).toBe("First Team");
      // Should call router with the full path
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("router/translate-path"),
        expect.anything(),
      );
    });

    it("should throw NotFoundError when team not found", async () => {
      // Mock 404 for all three path attempts: /team/, /jeugd/, /club/
      (global.fetch as unknown as ReturnType<typeof vi.fn>)
        .mockResolvedValueOnce({ ok: false, status: 404 }) // /team/non-existent
        .mockResolvedValueOnce({ ok: false, status: 404 }) // /jeugd/non-existent
        .mockResolvedValueOnce({ ok: false, status: 404 }); // /club/non-existent

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getTeamBySlug("non-existent");
      });

      await expect(
        Effect.runPromise(program.pipe(Effect.provide(DrupalServiceLive))),
      ).rejects.toThrow();
    });

    it("should propagate network errors immediately without trying other prefixes", async () => {
      // Mock network error on ALL attempts (retry logic will retry the same path)
      // After retries are exhausted, it should NOT try /jeugd/ or /club/
      (global.fetch as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error("Network error"),
      );

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getTeamBySlug("some-team");
      });

      await expect(
        Effect.runPromise(program.pipe(Effect.provide(DrupalServiceLive))),
      ).rejects.toThrow();

      // Verify it only tried /team/ path (with retries), never /jeugd/ or /club/
      const calls = (
        global.fetch as unknown as ReturnType<typeof vi.fn>
      ).mock.calls.map((call) => call[0]);
      const routerCalls = calls.filter(
        (url: string) =>
          url.includes("/router/translate-path") ||
          url.includes("/jsonapi/node/team"),
      );

      // All calls should be for /team/ prefix only
      const hasJeugdCall = routerCalls.some(
        (url: string) =>
          url.includes("path=%2Fjeugd") || url.includes("path=/jeugd"),
      );
      const hasClubCall = routerCalls.some(
        (url: string) =>
          url.includes("path=%2Fclub") || url.includes("path=/club"),
      );

      expect(hasJeugdCall).toBe(false);
      expect(hasClubCall).toBe(false);
    }, 60000);

    it("should propagate validation errors immediately without trying other prefixes", async () => {
      // Mock invalid JSON response that will fail schema validation
      (
        global.fetch as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ invalid: "response" }), // Invalid router response
      });

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getTeamBySlug("some-team");
      });

      await expect(
        Effect.runPromise(program.pipe(Effect.provide(DrupalServiceLive))),
      ).rejects.toThrow();
    });

    it("should throw NotFoundError when path is not a team", async () => {
      // Mock router response for non-team entity
      const mockRouterResponse = {
        resolved: "http://api.kcvvelewijt.be/news/some-article",
        isHomePath: false,
        entity: {
          canonical: "http://api.kcvvelewijt.be/news/some-article",
          type: "node",
          bundle: "article",
          id: "1",
          uuid: "article-uuid",
        },
        label: "Some Article",
        jsonapi: {
          individual:
            "http://api.kcvvelewijt.be/jsonapi/node/article/article-uuid",
          resourceName: "node--article",
          basePath: "/jsonapi",
          entryPoint: "http://api.kcvvelewijt.be/jsonapi",
        },
      };

      (
        global.fetch as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce({
        ok: true,
        json: async () => mockRouterResponse,
      });

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getTeamBySlug("some-article");
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

  describe("getTeamWithRoster", () => {
    // Helper to create mock router response for teams
    const createRouterResponse = (
      slug: string,
      uuid: string,
      title: string,
    ) => ({
      resolved: `http://api.kcvvelewijt.be/team/${slug}`,
      isHomePath: false,
      entity: {
        canonical: `http://api.kcvvelewijt.be/team/${slug}`,
        type: "node",
        bundle: "team",
        id: "1",
        uuid,
      },
      label: title,
      jsonapi: {
        individual: `http://api.kcvvelewijt.be/jsonapi/node/team/${uuid}`,
        resourceName: "node--team",
        basePath: "/jsonapi",
        entryPoint: "http://api.kcvvelewijt.be/jsonapi",
      },
    });

    it("should fetch team with full roster (staff and players)", async () => {
      const mockRouterResponse = createRouterResponse("u15a", "team-1", "U15A");

      const mockTeamResponse = {
        data: {
          id: "team-1",
          type: "node--team",
          attributes: {
            title: "U15A",
            created: "2025-01-01T00:00:00Z",
            path: { alias: "/team/u15a" },
          },
          relationships: {
            field_image: {
              data: { type: "media--image", id: "media-1" },
            },
            field_staff: {
              data: [{ type: "node--player", id: "staff-1" }],
            },
            field_players: {
              data: [
                { type: "node--player", id: "player-1" },
                { type: "node--player", id: "player-2" },
              ],
            },
          },
        },
        included: [
          {
            id: "media-1",
            type: "media--image",
            attributes: { name: "Team Photo" },
            relationships: {
              field_media_image: {
                data: { type: "file--file", id: "file-1" },
              },
            },
          },
          {
            id: "file-1",
            type: "file--file",
            attributes: {
              filename: "team-photo.jpg",
              uri: { url: "/sites/default/files/team-photo.jpg" },
            },
          },
          {
            id: "staff-1",
            type: "node--player",
            attributes: {
              title: "Coach Smith",
              created: "2025-01-01T00:00:00Z",
              path: { alias: "/player/coach-smith" },
              field_position_short: "T1",
            },
            relationships: {
              field_image: { data: null },
            },
          },
          {
            id: "player-1",
            type: "node--player",
            attributes: {
              title: "John Doe",
              field_shirtnumber: 10,
              created: "2025-01-01T00:00:00Z",
              path: { alias: "/player/john-doe" },
            },
            relationships: {
              field_image: { data: null },
            },
          },
          {
            id: "player-2",
            type: "node--player",
            attributes: {
              title: "Jane Smith",
              field_shirtnumber: 7,
              created: "2025-01-01T00:00:00Z",
              path: { alias: "/player/jane-smith" },
            },
            relationships: {
              field_image: { data: null },
            },
          },
        ],
      };

      const mockFetch = global.fetch as unknown as ReturnType<typeof vi.fn>;
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockRouterResponse,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockTeamResponse,
        });

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getTeamWithRoster("u15a");
      });

      const result = await Effect.runPromise(
        program.pipe(Effect.provide(DrupalServiceLive)),
      );

      expect(result.team.attributes.title).toBe("U15A");
      expect(result.staff).toHaveLength(1);
      expect(result.staff[0].attributes.title).toBe("Coach Smith");
      expect(result.players).toHaveLength(2);
      expect(result.teamImageUrl).toContain(
        "/sites/default/files/team-photo.jpg",
      );
    });

    it("should throw NotFoundError when team not found", async () => {
      // Mock 404 for all three path attempts: /team/, /jeugd/, /club/
      (global.fetch as unknown as ReturnType<typeof vi.fn>)
        .mockResolvedValueOnce({ ok: false, status: 404 }) // /team/non-existent
        .mockResolvedValueOnce({ ok: false, status: 404 }) // /jeugd/non-existent
        .mockResolvedValueOnce({ ok: false, status: 404 }); // /club/non-existent

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getTeamWithRoster("non-existent");
      });

      await expect(
        Effect.runPromise(program.pipe(Effect.provide(DrupalServiceLive))),
      ).rejects.toThrow();
    });

    it("should handle team without image", async () => {
      const mockRouterResponse = createRouterResponse("u13b", "team-1", "U13B");

      const mockTeamResponse = {
        data: {
          id: "team-1",
          type: "node--team",
          attributes: {
            title: "U13B",
            created: "2025-01-01T00:00:00Z",
            path: { alias: "/team/u13b" },
          },
          relationships: {
            field_image: { data: null },
            field_staff: { data: [] },
            field_players: { data: [] },
          },
        },
      };

      const mockFetch = global.fetch as unknown as ReturnType<typeof vi.fn>;
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockRouterResponse,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockTeamResponse,
        });

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getTeamWithRoster("u13b");
      });

      const result = await Effect.runPromise(
        program.pipe(Effect.provide(DrupalServiceLive)),
      );

      expect(result.team.attributes.title).toBe("U13B");
      expect(result.teamImageUrl).toBeUndefined();
      expect(result.staff).toHaveLength(0);
      expect(result.players).toHaveLength(0);
    });

    it("should handle missing media in included array", async () => {
      const mockRouterResponse = createRouterResponse("u17", "team-1", "U17");

      const mockTeamResponse = {
        data: {
          id: "team-1",
          type: "node--team",
          attributes: {
            title: "U17",
            created: "2025-01-01T00:00:00Z",
            path: { alias: "/team/u17" },
          },
          relationships: {
            field_image: {
              data: { type: "media--image", id: "media-missing" },
            },
            field_staff: { data: [] },
            field_players: { data: [] },
          },
        },
        included: [], // Media not in included
      };

      const mockFetch = global.fetch as unknown as ReturnType<typeof vi.fn>;
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockRouterResponse,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockTeamResponse,
        });

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getTeamWithRoster("u17");
      });

      const result = await Effect.runPromise(
        program.pipe(Effect.provide(DrupalServiceLive)),
      );

      expect(result.team.attributes.title).toBe("U17");
      expect(result.teamImageUrl).toBeUndefined();
    });

    it("should handle missing file in included array", async () => {
      const mockRouterResponse = createRouterResponse("u19", "team-1", "U19");

      const mockTeamResponse = {
        data: {
          id: "team-1",
          type: "node--team",
          attributes: {
            title: "U19",
            created: "2025-01-01T00:00:00Z",
            path: { alias: "/team/u19" },
          },
          relationships: {
            field_image: {
              data: { type: "media--image", id: "media-1" },
            },
            field_staff: { data: [] },
            field_players: { data: [] },
          },
        },
        included: [
          {
            id: "media-1",
            type: "media--image",
            attributes: { name: "Team Photo" },
            relationships: {
              field_media_image: {
                data: { type: "file--file", id: "file-missing" },
              },
            },
          },
          // File not in included
        ],
      };

      const mockFetch = global.fetch as unknown as ReturnType<typeof vi.fn>;
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockRouterResponse,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockTeamResponse,
        });

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getTeamWithRoster("u19");
      });

      const result = await Effect.runPromise(
        program.pipe(Effect.provide(DrupalServiceLive)),
      );

      expect(result.team.attributes.title).toBe("U19");
      expect(result.teamImageUrl).toBeUndefined();
    });

    it("should skip invalid player data in included array", async () => {
      const mockRouterResponse = createRouterResponse("u21", "team-1", "U21");

      const mockTeamResponse = {
        data: {
          id: "team-1",
          type: "node--team",
          attributes: {
            title: "U21",
            created: "2025-01-01T00:00:00Z",
            path: { alias: "/team/u21" },
          },
          relationships: {
            field_image: { data: null },
            field_staff: { data: [] },
            field_players: {
              data: [
                { type: "node--player", id: "valid-player" },
                { type: "node--player", id: "invalid-player" },
              ],
            },
          },
        },
        included: [
          {
            id: "valid-player",
            type: "node--player",
            attributes: {
              title: "Valid Player",
              created: "2025-01-01T00:00:00Z",
              path: { alias: "/player/valid" },
            },
            relationships: {
              field_image: { data: null },
            },
          },
          {
            id: "invalid-player",
            type: "node--player",
            // Missing required attributes - should be skipped
          },
        ],
      };

      const mockFetch = global.fetch as unknown as ReturnType<typeof vi.fn>;
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockRouterResponse,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockTeamResponse,
        });

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getTeamWithRoster("u21");
      });

      const result = await Effect.runPromise(
        program.pipe(Effect.provide(DrupalServiceLive)),
      );

      expect(result.team.attributes.title).toBe("U21");
      // Only valid player should be included
      expect(result.players).toHaveLength(1);
      expect(result.players[0].attributes.title).toBe("Valid Player");
    });

    it("should normalize slug with leading slash", async () => {
      const mockRouterResponse = createRouterResponse(
        "first-team",
        "team-1",
        "First Team",
      );

      const mockTeamResponse = {
        data: {
          id: "team-1",
          type: "node--team",
          attributes: {
            title: "First Team",
            created: "2025-01-01T00:00:00Z",
            path: { alias: "/team/first-team" },
          },
          relationships: {
            field_image: { data: null },
            field_staff: { data: [] },
            field_players: { data: [] },
          },
        },
      };

      const mockFetch = global.fetch as unknown as ReturnType<typeof vi.fn>;
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockRouterResponse,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockTeamResponse,
        });

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getTeamWithRoster("/team/first-team");
      });

      await Effect.runPromise(program.pipe(Effect.provide(DrupalServiceLive)));

      // Should call router with the full path
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("router/translate-path"),
        expect.anything(),
      );
    });

    it("should resolve player images from included", async () => {
      const mockRouterResponse = createRouterResponse("u15a", "team-1", "U15A");

      const mockTeamResponse = {
        data: {
          id: "team-1",
          type: "node--team",
          attributes: {
            title: "U15A",
            created: "2025-01-01T00:00:00Z",
            path: { alias: "/team/u15a" },
          },
          relationships: {
            field_image: { data: null },
            field_staff: { data: [] },
            field_players: {
              data: [{ type: "node--player", id: "player-1" }],
            },
          },
        },
        included: [
          {
            id: "player-1",
            type: "node--player",
            attributes: {
              title: "John Doe",
              field_shirtnumber: 10,
              created: "2025-01-01T00:00:00Z",
              path: { alias: "/player/john-doe" },
            },
            relationships: {
              field_image: {
                data: {
                  type: "file--file",
                  id: "file-player-1",
                  meta: { alt: "John Doe" },
                },
              },
            },
          },
          {
            id: "file-player-1",
            type: "file--file",
            attributes: {
              filename: "john-doe.jpg",
              uri: { url: "/sites/default/files/player-picture/john-doe.jpg" },
            },
          },
        ],
      };

      const mockFetch = global.fetch as unknown as ReturnType<typeof vi.fn>;
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockRouterResponse,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockTeamResponse,
        });

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getTeamWithRoster("u15a");
      });

      const result = await Effect.runPromise(
        program.pipe(Effect.provide(DrupalServiceLive)),
      );

      expect(result.players).toHaveLength(1);
      const playerImage = result.players[0].relationships.field_image?.data;
      expect(playerImage).toBeDefined();
      if (playerImage && "uri" in playerImage) {
        expect(playerImage.uri.url).toContain("/player-picture/john-doe.jpg");
      }
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

    it("should apply pagination offset when page and limit are provided", async () => {
      const mockResponse = { data: [] };

      (
        global.fetch as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getPlayers({ limit: 50, page: 3 });
      });

      await Effect.runPromise(program.pipe(Effect.provide(DrupalServiceLive)));

      // Page 3 with limit 50 should have offset 100 ((3-1) * 50)
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("page%5Boffset%5D=100"),
        expect.anything(),
      );
    });

    it("should map file--file references to image URLs", async () => {
      const mockResponse = {
        data: [
          {
            id: "player-1",
            type: "node--player",
            attributes: {
              title: "John Doe",
              field_shirtnumber: 10,
              created: "2025-01-01T00:00:00Z",
              path: { alias: "/player/john-doe" },
            },
            relationships: {
              field_image: {
                data: {
                  type: "file--file",
                  id: "file-123",
                  meta: { alt: "John Doe", width: 800, height: 800 },
                },
              },
            },
          },
        ],
        included: [
          {
            type: "file--file",
            id: "file-123",
            attributes: {
              filename: "john-doe.jpg",
              uri: {
                value: "public://player-picture/john-doe.jpg",
                url: "/sites/default/files/player-picture/john-doe.jpg",
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
        return yield* drupal.getPlayers();
      });

      const result = await Effect.runPromise(
        program.pipe(Effect.provide(DrupalServiceLive)),
      );

      expect(result.players).toHaveLength(1);
      const imageData = result.players[0].relationships.field_image?.data;
      expect(imageData).toBeDefined();
      expect(imageData).toHaveProperty("uri");
      expect((imageData as { uri: { url: string } }).uri.url).toBe(
        "https://api.kcvvelewijt.be/sites/default/files/player-picture/john-doe.jpg",
      );
    });

    it("should handle players without images", async () => {
      const mockResponse = {
        data: [
          {
            id: "player-1",
            type: "node--player",
            attributes: {
              title: "Jane Doe",
              created: "2025-01-01T00:00:00Z",
              path: { alias: "/player/jane-doe" },
            },
            relationships: {
              field_image: { data: null },
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
        return yield* drupal.getPlayers();
      });

      const result = await Effect.runPromise(
        program.pipe(Effect.provide(DrupalServiceLive)),
      );

      expect(result.players).toHaveLength(1);
      expect(result.players[0].relationships.field_image?.data).toBeNull();
    });

    it("should handle missing file in included array", async () => {
      const mockResponse = {
        data: [
          {
            id: "player-1",
            type: "node--player",
            attributes: {
              title: "John Doe",
              created: "2025-01-01T00:00:00Z",
              path: { alias: "/player/john-doe" },
            },
            relationships: {
              field_image: {
                data: {
                  type: "file--file",
                  id: "file-missing",
                  meta: { alt: "John Doe" },
                },
              },
            },
          },
        ],
        included: [], // File not in included array
      };

      (
        global.fetch as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getPlayers();
      });

      const result = await Effect.runPromise(
        program.pipe(Effect.provide(DrupalServiceLive)),
      );

      expect(result.players).toHaveLength(1);
      // Should keep original reference when file not found
      const imageData = result.players[0].relationships.field_image?.data;
      expect(imageData).toHaveProperty("type", "file--file");
      expect(imageData).toHaveProperty("id", "file-missing");
    });

    it("should map media--image references through to file URLs", async () => {
      const mockResponse = {
        data: [
          {
            id: "player-1",
            type: "node--player",
            attributes: {
              title: "John Doe",
              created: "2025-01-01T00:00:00Z",
              path: { alias: "/player/john-doe" },
            },
            relationships: {
              field_image: {
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
            type: "media--image",
            id: "media-123",
            attributes: {
              name: "Player Photo",
            },
            relationships: {
              field_media_image: {
                data: {
                  type: "file--file",
                  id: "file-456",
                  meta: { alt: "John Doe", width: 1000, height: 1000 },
                },
              },
            },
          },
          {
            type: "file--file",
            id: "file-456",
            attributes: {
              filename: "john-doe-media.jpg",
              uri: {
                value: "public://player-picture/john-doe-media.jpg",
                url: "/sites/default/files/player-picture/john-doe-media.jpg",
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
        return yield* drupal.getPlayers();
      });

      const result = await Effect.runPromise(
        program.pipe(Effect.provide(DrupalServiceLive)),
      );

      expect(result.players).toHaveLength(1);
      const imageData = result.players[0].relationships.field_image?.data;
      expect(imageData).toBeDefined();
      expect(imageData).toHaveProperty("uri");
      expect((imageData as { uri: { url: string } }).uri.url).toBe(
        "https://api.kcvvelewijt.be/sites/default/files/player-picture/john-doe-media.jpg",
      );
    });

    it("should keep original reference when media--image has no file reference", async () => {
      const mockResponse = {
        data: [
          {
            id: "player-1",
            type: "node--player",
            attributes: {
              title: "John Doe",
              created: "2025-01-01T00:00:00Z",
              path: { alias: "/player/john-doe" },
            },
            relationships: {
              field_image: {
                data: {
                  type: "media--image",
                  id: "media-no-file-ref",
                },
              },
            },
          },
        ],
        included: [
          {
            type: "media--image",
            id: "media-no-file-ref",
            attributes: {
              name: "Media Without File Reference",
            },
            relationships: {
              // No field_media_image relationship
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
        return yield* drupal.getPlayers();
      });

      const result = await Effect.runPromise(
        program.pipe(Effect.provide(DrupalServiceLive)),
      );

      expect(result.players).toHaveLength(1);
      // Should keep original reference when media has no file reference
      const imageData = result.players[0].relationships.field_image?.data;
      expect(imageData).toBeDefined();
      if (imageData && "type" in imageData && "id" in imageData) {
        expect(imageData.type).toBe("media--image");
        expect(imageData.id).toBe("media-no-file-ref");
      }
    });

    it("should keep original reference when media--image file not found in included", async () => {
      const mockResponse = {
        data: [
          {
            id: "player-1",
            type: "node--player",
            attributes: {
              title: "John Doe",
              created: "2025-01-01T00:00:00Z",
              path: { alias: "/player/john-doe" },
            },
            relationships: {
              field_image: {
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
            type: "media--image",
            id: "media-with-missing-file",
            attributes: {
              name: "Media With Missing File",
            },
            relationships: {
              field_media_image: {
                data: {
                  type: "file--file",
                  id: "file-nonexistent",
                  meta: { alt: "Missing file" },
                },
              },
            },
          },
          // file-nonexistent is NOT in included array
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
        return yield* drupal.getPlayers();
      });

      const result = await Effect.runPromise(
        program.pipe(Effect.provide(DrupalServiceLive)),
      );

      expect(result.players).toHaveLength(1);
      // Should keep original reference when file not found
      const imageData = result.players[0].relationships.field_image?.data;
      expect(imageData).toBeDefined();
      if (imageData && "type" in imageData && "id" in imageData) {
        expect(imageData.type).toBe("media--image");
        expect(imageData.id).toBe("media-with-missing-file");
      }
    });

    it("should keep original reference when media--image not found in included", async () => {
      const mockResponse = {
        data: [
          {
            id: "player-1",
            type: "node--player",
            attributes: {
              title: "John Doe",
              created: "2025-01-01T00:00:00Z",
              path: { alias: "/player/john-doe" },
            },
            relationships: {
              field_image: {
                data: {
                  type: "media--image",
                  id: "media-nonexistent",
                },
              },
            },
          },
        ],
        included: [], // media--image is NOT in included array
      };

      (
        global.fetch as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getPlayers();
      });

      const result = await Effect.runPromise(
        program.pipe(Effect.provide(DrupalServiceLive)),
      );

      expect(result.players).toHaveLength(1);
      // Should keep original reference when media not found
      const imageData = result.players[0].relationships.field_image?.data;
      expect(imageData).toBeDefined();
      if (imageData && "type" in imageData && "id" in imageData) {
        expect(imageData.type).toBe("media--image");
        expect(imageData.id).toBe("media-nonexistent");
      }
    });
  });

  describe("getPlayerBySlug", () => {
    it("should fetch player by slug using decoupled router", async () => {
      // Mock router response
      const mockRouterResponse = {
        resolved: "http://api.kcvvelewijt.be/player/john-doe",
        isHomePath: false,
        entity: {
          canonical: "http://api.kcvvelewijt.be/player/john-doe",
          type: "node",
          bundle: "player",
          id: "1",
          uuid: "abc-123-uuid",
        },
        label: "John Doe",
        jsonapi: {
          individual:
            "http://api.kcvvelewijt.be/jsonapi/node/player/abc-123-uuid",
          resourceName: "node--player",
          basePath: "/jsonapi",
          entryPoint: "http://api.kcvvelewijt.be/jsonapi",
        },
      };

      // Mock player response
      const mockPlayerResponse = {
        data: {
          id: "abc-123-uuid",
          type: "node--player",
          attributes: {
            title: "John Doe",
            field_shirtnumber: 10,
            created: "2025-01-01T00:00:00Z",
            path: {
              alias: "/player/john-doe",
            },
          },
          relationships: {
            field_image: { data: null },
          },
        },
      };

      (global.fetch as unknown as ReturnType<typeof vi.fn>)
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => mockRouterResponse,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockPlayerResponse,
        });

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getPlayerBySlug("john-doe");
      });

      const result = await Effect.runPromise(
        program.pipe(Effect.provide(DrupalServiceLive)),
      );

      expect(result.attributes.title).toBe("John Doe");
      expect(result.id).toBe("abc-123-uuid");
    });

    it("should throw NotFoundError when path not found", async () => {
      (
        global.fetch as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getPlayerBySlug("non-existent");
      });

      await expect(
        Effect.runPromise(program.pipe(Effect.provide(DrupalServiceLive))),
      ).rejects.toThrow();
    });

    it("should throw NotFoundError when path is not a player", async () => {
      // Mock router response for non-player entity
      const mockRouterResponse = {
        resolved: "http://api.kcvvelewijt.be/news/some-article",
        isHomePath: false,
        entity: {
          canonical: "http://api.kcvvelewijt.be/news/some-article",
          type: "node",
          bundle: "article",
          id: "1",
          uuid: "article-uuid",
        },
        label: "Some Article",
        jsonapi: {
          individual:
            "http://api.kcvvelewijt.be/jsonapi/node/article/article-uuid",
          resourceName: "node--article",
          basePath: "/jsonapi",
          entryPoint: "http://api.kcvvelewijt.be/jsonapi",
        },
      };

      (
        global.fetch as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockRouterResponse,
      });

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getPlayerBySlug("some-article");
      });

      await expect(
        Effect.runPromise(program.pipe(Effect.provide(DrupalServiceLive))),
      ).rejects.toThrow();
    });

    it("should handle network errors from router", async () => {
      // Mock all retry attempts (initial + 3 retries = 4 total)
      const mockFetch = global.fetch as unknown as ReturnType<typeof vi.fn>;
      mockFetch
        .mockRejectedValueOnce(new Error("Network error"))
        .mockRejectedValueOnce(new Error("Network error"))
        .mockRejectedValueOnce(new Error("Network error"))
        .mockRejectedValueOnce(new Error("Network error"));

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getPlayerBySlug("john-doe");
      });

      await expect(
        Effect.runPromise(program.pipe(Effect.provide(DrupalServiceLive))),
      ).rejects.toThrow();
    }, 15000);

    it("should handle non-404 HTTP errors from router", async () => {
      // Mock all retry attempts (initial + 3 retries = 4 total)
      const mockFetch = global.fetch as unknown as ReturnType<typeof vi.fn>;
      const errorResponse = {
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      };
      mockFetch
        .mockResolvedValueOnce(errorResponse)
        .mockResolvedValueOnce(errorResponse)
        .mockResolvedValueOnce(errorResponse)
        .mockResolvedValueOnce(errorResponse);

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getPlayerBySlug("john-doe");
      });

      await expect(
        Effect.runPromise(program.pipe(Effect.provide(DrupalServiceLive))),
      ).rejects.toThrow();
    }, 15000);

    it("should handle JSON parse errors from router", async () => {
      // Mock all retry attempts (initial + 3 retries = 4 total)
      const mockFetch = global.fetch as unknown as ReturnType<typeof vi.fn>;
      const parseErrorResponse = {
        ok: true,
        status: 200,
        json: async () => {
          throw new Error("Invalid JSON");
        },
      };
      mockFetch
        .mockResolvedValueOnce(parseErrorResponse)
        .mockResolvedValueOnce(parseErrorResponse)
        .mockResolvedValueOnce(parseErrorResponse)
        .mockResolvedValueOnce(parseErrorResponse);

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getPlayerBySlug("john-doe");
      });

      await expect(
        Effect.runPromise(program.pipe(Effect.provide(DrupalServiceLive))),
      ).rejects.toThrow();
    }, 15000);

    it("should handle invalid router response schema", async () => {
      // Return an invalid router response (missing required fields)
      const invalidRouterResponse = {
        resolved: "http://api.kcvvelewijt.be/player/john-doe",
        // Missing entity, label, jsonapi, etc.
      };

      (
        global.fetch as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => invalidRouterResponse,
      });

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getPlayerBySlug("john-doe");
      });

      await expect(
        Effect.runPromise(program.pipe(Effect.provide(DrupalServiceLive))),
      ).rejects.toThrow();
    });

    it("should timeout router requests after 30 seconds", async () => {
      // Mock a slow response that never resolves
      (global.fetch as unknown as ReturnType<typeof vi.fn>).mockImplementation(
        () => new Promise(() => {}), // Never resolves
      );

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getPlayerBySlug("john-doe");
      });

      await expect(
        Effect.runPromise(program.pipe(Effect.provide(DrupalServiceLive))),
      ).rejects.toThrow();
    }, 35000);

    it("should retry router on network error then succeed", async () => {
      // Mock first call fails, second succeeds
      const mockRouterResponse = {
        resolved: "http://api.kcvvelewijt.be/player/john-doe",
        isHomePath: false,
        entity: {
          canonical: "http://api.kcvvelewijt.be/player/john-doe",
          type: "node",
          bundle: "player",
          id: "1",
          uuid: "retry-uuid",
        },
        label: "John Doe",
        jsonapi: {
          individual:
            "http://api.kcvvelewijt.be/jsonapi/node/player/retry-uuid",
          resourceName: "node--player",
          basePath: "/jsonapi",
          entryPoint: "http://api.kcvvelewijt.be/jsonapi",
        },
      };

      const mockPlayerResponse = {
        data: {
          id: "retry-uuid",
          type: "node--player",
          attributes: {
            title: "John Doe",
            created: "2025-01-01T00:00:00Z",
            path: { alias: "/player/john-doe" },
          },
          relationships: {
            field_image: { data: null },
          },
        },
      };

      const mockFetch = global.fetch as unknown as ReturnType<typeof vi.fn>;
      mockFetch
        .mockRejectedValueOnce(new Error("Network error")) // First router call fails
        .mockResolvedValueOnce({
          // Second router call succeeds
          ok: true,
          status: 200,
          json: async () => mockRouterResponse,
        })
        .mockResolvedValueOnce({
          // Player fetch succeeds
          ok: true,
          json: async () => mockPlayerResponse,
        });

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getPlayerBySlug("john-doe");
      });

      const result = await Effect.runPromise(
        program.pipe(Effect.provide(DrupalServiceLive)),
      );

      expect(result.attributes.title).toBe("John Doe");
      expect(mockFetch).toHaveBeenCalledTimes(3); // 1 failed router + 1 retry router + 1 player fetch
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
            field_shirtnumber: 10,
            created: "2025-01-01T00:00:00Z",
            path: {
              alias: "/player/john-doe",
            },
          },
          relationships: {
            field_image: { data: null },
            field_team: { data: null },
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

    it("should map included file to image URL", async () => {
      const mockResponse = {
        data: {
          id: "player-uuid",
          type: "node--player",
          attributes: {
            title: "Max Player",
            field_shirtnumber: 7,
            created: "2025-01-01T00:00:00Z",
            path: { alias: "/player/max-player" },
          },
          relationships: {
            field_image: {
              data: {
                type: "file--file",
                id: "file-uuid",
                meta: { alt: "Max Player", width: 1250, height: 1250 },
              },
            },
          },
        },
        included: [
          {
            type: "file--file",
            id: "file-uuid",
            attributes: {
              filename: "max-player.png",
              uri: {
                value: "public://player-picture/max-player.png",
                url: "/sites/default/files/player-picture/max-player.png",
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
        return yield* drupal.getPlayerById("player-uuid");
      });

      const result = await Effect.runPromise(
        program.pipe(Effect.provide(DrupalServiceLive)),
      );

      expect(result.attributes.title).toBe("Max Player");
      const imageData = result.relationships.field_image?.data;
      expect(imageData).toBeDefined();
      expect(imageData).toHaveProperty("uri");
      expect((imageData as { uri: { url: string } }).uri.url).toBe(
        "https://api.kcvvelewijt.be/sites/default/files/player-picture/max-player.png",
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
