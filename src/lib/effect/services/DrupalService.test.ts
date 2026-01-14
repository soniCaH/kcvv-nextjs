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
