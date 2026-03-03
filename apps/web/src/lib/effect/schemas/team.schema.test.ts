import { describe, it, expect } from "vitest";
import { Schema as S } from "effect";
import {
  TeamAttributes,
  TeamRelationships,
  Team,
  TeamIncludedResource,
  TeamsResponse,
  TeamResponse,
} from "./team.schema";

describe("team.schema", () => {
  describe("TeamAttributes", () => {
    it("should decode valid team attributes", () => {
      const input = {
        drupal_internal__nid: 42,
        drupal_internal__vid: 101,
        langcode: "nl",
        revision_timestamp: "2024-01-15T10:30:00+00:00",
        status: true,
        title: "U15 Team",
        created: "2024-01-15T10:30:00+00:00",
        changed: "2024-02-01T14:20:00+00:00",
        promote: false,
        sticky: false,
        path: {
          alias: "/team/u15",
          pid: 123,
          langcode: "nl",
        },
        field_league_id: 5,
        field_league: "Youth League A",
        field_division: "Division 1",
        field_season: "2024-2025",
        body: {
          value: "<p>Our U15 team</p>",
          format: "full_html",
          processed: "<p>Our U15 team</p>",
          summary: "Team summary",
        },
      };

      const result = S.decodeUnknownSync(TeamAttributes)(input);

      expect(result.title).toBe("U15 Team");
      expect(result.title).toBe("U15 Team");
      expect(result.field_league).toBe("Youth League A");
      expect(result.field_division).toBe("Division 1");
      expect(result.field_season).toBe("2024-2025");
      expect(result.body?.value).toBe("<p>Our U15 team</p>");
    });

    it("should decode team attributes with minimal fields", () => {
      const input = {
        title: "First Team",
        created: "2024-01-15T10:30:00+00:00",
        path: {
          alias: "/team/first-team",
        },
      };

      const result = S.decodeUnknownSync(TeamAttributes)(input);

      expect(result.title).toBe("First Team");
      expect(result.title).toBe("First Team");
    });
  });

  describe("TeamRelationships", () => {
    it("should decode team relationships with resolved image", () => {
      const input = {
        field_image: {
          data: {
            uri: {
              url: "https://example.com/images/team.jpg",
            },
            alt: "Team photo",
            width: 1920,
            height: 1080,
          },
        },
        field_players: {
          data: [
            {
              id: "player-1",
              type: "node--player",
            },
            {
              id: "player-2",
              type: "node--player",
            },
          ],
        },
      };

      const result = S.decodeUnknownSync(TeamRelationships)(input);

      expect(result.field_image?.data).toBeDefined();
      expect(result.field_players?.data).toHaveLength(2);
      expect(result.field_players?.data?.[0].type).toBe("node--player");
    });

    it("should decode team relationships with image reference", () => {
      const input = {
        field_image: {
          data: {
            type: "media--image",
            id: "media-123",
          },
        },
      };

      const result = S.decodeUnknownSync(TeamRelationships)(input);

      expect(result.field_image?.data).toBeDefined();
    });

    it("should decode team relationships with empty data", () => {
      const input = {};

      const result = S.decodeUnknownSync(TeamRelationships)(input);

      expect(result.field_image).toBeUndefined();
      expect(result.field_players).toBeUndefined();
    });
  });

  describe("Team", () => {
    it("should decode complete team entity", () => {
      const input = {
        id: "team-abc-123",
        type: "node--team",
        attributes: {
          title: "U17 Team",
          created: "2024-01-15T10:30:00+00:00",
          path: {
            alias: "/team/u17",
          },
          field_league: "Youth League B",
        },
        relationships: {
          field_image: {
            data: {
              uri: {
                url: "https://example.com/images/u17.jpg",
              },
              alt: "U17 team",
            },
          },
        },
      };

      const result = S.decodeUnknownSync(Team)(input);

      expect(result.id).toBe("team-abc-123");
      expect(result.type).toBe("node--team");
      expect(result.attributes.title).toBe("U17 Team");
      expect(result.attributes.title).toBe("U17 Team");
    });

    it("should reject invalid team type", () => {
      const input = {
        id: "team-abc-123",
        type: "node--article", // Invalid type
        attributes: {
          title: "U17 Team",
          created: "2024-01-15T10:30:00+00:00",
          path: { alias: "/team/u17" },
        },
        relationships: {},
      };

      expect(() => S.decodeUnknownSync(Team)(input)).toThrow();
    });
  });

  describe("TeamIncludedResource", () => {
    it("should decode media--image included resource", () => {
      const input = {
        id: "media-123",
        type: "media--image",
        attributes: {
          name: "Team photo",
          status: true,
        },
        relationships: {
          field_media_image: {
            data: {
              id: "file-456",
              type: "file--file",
            },
          },
        },
      };

      const result = S.decodeUnknownSync(TeamIncludedResource)(input);

      expect(result.type).toBe("media--image");
      expect(result.id).toBe("media-123");
    });

    it("should decode file--file included resource", () => {
      const input = {
        id: "file-456",
        type: "file--file",
        attributes: {
          filename: "team.jpg",
          uri: {
            url: "https://example.com/files/team.jpg",
          },
          filemime: "image/jpeg",
          filesize: 102400,
        },
      };

      const result = S.decodeUnknownSync(TeamIncludedResource)(input);

      expect(result.type).toBe("file--file");
      expect(result.id).toBe("file-456");
    });

    it("should decode unknown resource type as DrupalResource", () => {
      const input = {
        id: "unknown-123",
        type: "node--unknown",
        attributes: {
          title: "Unknown",
        },
      };

      const result = S.decodeUnknownSync(TeamIncludedResource)(input);

      expect(result.type).toBe("node--unknown");
      expect(result.id).toBe("unknown-123");
    });
  });

  describe("TeamsResponse", () => {
    it("should decode complete teams response", () => {
      const input = {
        data: [
          {
            id: "team-1",
            type: "node--team",
            attributes: {
              title: "First Team",
              created: "2024-01-15T10:30:00+00:00",
              path: { alias: "/team/first" },
            },
            relationships: {},
          },
          {
            id: "team-2",
            type: "node--team",
            attributes: {
              title: "Second Team",
              created: "2024-01-16T11:00:00+00:00",
              path: { alias: "/team/second" },
            },
            relationships: {},
          },
        ],
        included: [
          {
            id: "media-123",
            type: "media--image",
            attributes: {
              name: "Team photo",
            },
          },
        ],
        jsonapi: {
          version: "1.0",
        },
        links: {
          self: {
            href: "https://example.com/jsonapi/node/team",
          },
          next: {
            href: "https://example.com/jsonapi/node/team?page[offset]=10",
          },
        },
        meta: {
          count: "25",
        },
      };

      const result = S.decodeUnknownSync(TeamsResponse)(input);

      expect(result.data).toHaveLength(2);
      expect(result.data[0].attributes.title).toBe("First Team");
      expect(result.data[1].attributes.title).toBe("Second Team");
      expect(result.included).toHaveLength(1);
      expect(result.jsonapi?.version).toBe("1.0");
      expect(result.links?.self?.href).toBe(
        "https://example.com/jsonapi/node/team",
      );
      expect(result.links?.next?.href).toBe(
        "https://example.com/jsonapi/node/team?page[offset]=10",
      );
      expect(result.meta?.count).toBe(25);
    });

    it("should decode teams response with minimal fields", () => {
      const input = {
        data: [
          {
            id: "team-1",
            type: "node--team",
            attributes: {
              title: "Team",
              created: "2024-01-15T10:30:00+00:00",
              path: { alias: "/team/test" },
            },
            relationships: {},
          },
        ],
      };

      const result = S.decodeUnknownSync(TeamsResponse)(input);

      expect(result.data).toHaveLength(1);
      expect(result.included).toBeUndefined();
      expect(result.jsonapi).toBeUndefined();
      expect(result.links).toBeUndefined();
    });
  });

  describe("TeamResponse", () => {
    it("should decode single team response", () => {
      const input = {
        data: {
          id: "team-abc-123",
          type: "node--team",
          attributes: {
            title: "U19 Team",
            created: "2024-01-15T10:30:00+00:00",
            path: { alias: "/team/u19" },
            field_league: "Premier League",
          },
          relationships: {
            field_image: {
              data: {
                type: "media--image",
                id: "media-789",
              },
            },
          },
        },
        included: [
          {
            id: "media-789",
            type: "media--image",
            attributes: {
              name: "U19 team photo",
            },
            relationships: {
              field_media_image: {
                data: {
                  id: "file-999",
                  type: "file--file",
                },
              },
            },
          },
          {
            id: "file-999",
            type: "file--file",
            attributes: {
              uri: {
                url: "https://example.com/files/u19.jpg",
              },
              filename: "u19.jpg",
            },
          },
        ],
        jsonapi: {
          version: "1.0",
        },
        links: {
          self: {
            href: "https://example.com/jsonapi/node/team/team-abc-123",
          },
        },
      };

      const result = S.decodeUnknownSync(TeamResponse)(input);

      expect(result.data.id).toBe("team-abc-123");
      expect(result.data.attributes.title).toBe("U19 Team");
      expect(result.data.attributes.field_league).toBe("Premier League");
      expect(result.included).toHaveLength(2);
      expect(result.jsonapi?.version).toBe("1.0");
    });
  });
});
