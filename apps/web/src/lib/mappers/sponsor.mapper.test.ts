/**
 * Sponsor Mapper Tests
 * Validates transformation from Drupal sponsor format to component format
 */

import { describe, it, expect } from "vitest";
import {
  mapSponsorToComponentSponsor,
  mapSponsorsToComponentSponsors,
} from "./sponsor.mapper";
import type { Sponsor as DrupalSponsor } from "@/lib/effect/schemas";

/**
 * Test fixture factory for creating mock Drupal sponsors
 * Reduces boilerplate and ensures consistent test data
 */
const createMockDrupalSponsor = (
  overrides: {
    id?: string;
    title?: string;
    field_website?: { uri: string; title?: string; options?: unknown } | null;
    field_media_image?: {
      data: {
        uri: { url: string };
        alt: string;
        width?: number;
        height?: number;
      } | null;
    };
  } = {},
): DrupalSponsor => ({
  id: overrides.id || "123",
  type: "node--sponsor",
  attributes: {
    drupal_internal__nid: 1,
    drupal_internal__vid: 1,
    langcode: "nl",
    revision_timestamp: new Date("2024-01-01T00:00:00+00:00"),
    status: true,
    title: overrides.title || "Test Sponsor",
    created: new Date("2024-01-01T00:00:00+00:00"),
    changed: new Date("2024-01-01T00:00:00+00:00"),
    promote: true,
    sticky: false,
    path: { alias: "/sponsors/test-sponsor", pid: 1, langcode: "nl" },
    field_website: overrides.field_website,
  },
  relationships:
    "field_media_image" in overrides
      ? { field_media_image: overrides.field_media_image }
      : {
          field_media_image: {
            data: {
              uri: {
                url: "https://api.kcvvelewijt.be/sites/default/files/logo.png",
              },
              alt: "Test Sponsor Logo",
            },
          },
        },
});

describe("sponsor.mapper", () => {
  describe("mapSponsorToComponentSponsor", () => {
    it("maps sponsor with all fields", () => {
      const drupalSponsor = createMockDrupalSponsor({
        field_website: {
          uri: "https://example.com",
          title: "Example",
          options: {},
        },
      });

      const result = mapSponsorToComponentSponsor(drupalSponsor);

      expect(result).toEqual({
        id: "123",
        name: "Test Sponsor",
        logo: "https://api.kcvvelewijt.be/sites/default/files/logo.png",
        url: "https://example.com",
      });
    });

    it("handles sponsor without website", () => {
      const drupalSponsor = createMockDrupalSponsor();

      const result = mapSponsorToComponentSponsor(drupalSponsor);

      expect(result).toEqual({
        id: "123",
        name: "Test Sponsor",
        logo: "https://api.kcvvelewijt.be/sites/default/files/logo.png",
        url: undefined,
      });
    });

    it("uses placeholder when logo is missing", () => {
      const drupalSponsor = createMockDrupalSponsor({
        field_media_image: { data: null },
      });

      const result = mapSponsorToComponentSponsor(drupalSponsor);

      expect(result.logo).toBe("/images/placeholder-sponsor.png");
    });

    it("uses placeholder when logo data is undefined", () => {
      const drupalSponsor = createMockDrupalSponsor({
        field_media_image: undefined,
      });

      const result = mapSponsorToComponentSponsor(drupalSponsor);

      expect(result.logo).toBe("/images/placeholder-sponsor.png");
    });

    it("uses placeholder when logo has no uri", () => {
      const drupalSponsor = createMockDrupalSponsor({
        field_media_image: {
          data: {
            uri: { url: "" },
            alt: "Test",
          },
        },
      });

      const result = mapSponsorToComponentSponsor(drupalSponsor);

      expect(result.logo).toBe("/images/placeholder-sponsor.png");
    });

    it("handles special characters in sponsor name", () => {
      const drupalSponsor = createMockDrupalSponsor({
        title: 'Café & Bar "De Plezante"',
      });

      const result = mapSponsorToComponentSponsor(drupalSponsor);

      expect(result.name).toBe('Café & Bar "De Plezante"');
    });
  });

  describe("mapSponsorsToComponentSponsors", () => {
    it("maps array of sponsors", () => {
      const drupalSponsors: readonly DrupalSponsor[] = [
        createMockDrupalSponsor({
          id: "1",
          title: "Sponsor One",
          field_media_image: {
            data: {
              uri: { url: "https://api.kcvvelewijt.be/logo1.png" },
              alt: "Logo 1",
            },
          },
        }),
        createMockDrupalSponsor({
          id: "2",
          title: "Sponsor Two",
          field_website: {
            uri: "https://sponsor2.com",
            title: "Sponsor Two",
            options: {},
          },
          field_media_image: {
            data: {
              uri: { url: "https://api.kcvvelewijt.be/logo2.png" },
              alt: "Logo 2",
            },
          },
        }),
      ];

      const result = mapSponsorsToComponentSponsors(drupalSponsors);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: "1",
        name: "Sponsor One",
        logo: "https://api.kcvvelewijt.be/logo1.png",
        url: undefined,
      });
      expect(result[1]).toEqual({
        id: "2",
        name: "Sponsor Two",
        logo: "https://api.kcvvelewijt.be/logo2.png",
        url: "https://sponsor2.com",
      });
    });

    it("handles empty array", () => {
      const result = mapSponsorsToComponentSponsors([]);

      expect(result).toEqual([]);
    });

    it("preserves order of sponsors", () => {
      const drupalSponsors: readonly DrupalSponsor[] = [
        createMockDrupalSponsor({ id: "a", title: "Alpha" }),
        createMockDrupalSponsor({ id: "b", title: "Beta" }),
        createMockDrupalSponsor({ id: "c", title: "Gamma" }),
      ];

      const result = mapSponsorsToComponentSponsors(drupalSponsors);

      expect(result.map((s) => s.id)).toEqual(["a", "b", "c"]);
      expect(result.map((s) => s.name)).toEqual(["Alpha", "Beta", "Gamma"]);
    });
  });
});
