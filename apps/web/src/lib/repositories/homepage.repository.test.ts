import { describe, expect, it, vi } from "vitest";
import { Effect } from "effect";
import type { HOMEPAGE_QUERY_RESULT } from "../sanity/sanity.types";

// Mock the sanity client before importing the repository
vi.mock("../sanity/client", () => ({
  sanityClient: {
    fetch: vi.fn(),
  },
}));

import { sanityClient } from "../sanity/client";
import {
  HOMEPAGE_QUERY,
  HomepageRepository,
  HomepageRepositoryLive,
  toPlaceholderVM,
  type HomepageBannersVM,
  type BannerSlotVM,
  type MatchesSliderPlaceholderVM,
} from "./homepage.repository";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockFetch = sanityClient.fetch as any as ReturnType<typeof vi.fn>;

function runWithRepo<A>(effect: Effect.Effect<A, never, HomepageRepository>) {
  return Effect.runPromise(Effect.provide(effect, HomepageRepositoryLive));
}

function makeHomepageResult(
  overrides: Partial<NonNullable<HOMEPAGE_QUERY_RESULT>> = {},
): HOMEPAGE_QUERY_RESULT {
  return {
    bannerSlotA: {
      imageUrl: "https://cdn.sanity.io/banner-a.webp",
      alt: "Banner A alt",
      href: "https://example.com/a",
    },
    bannerSlotB: {
      imageUrl: "https://cdn.sanity.io/banner-b.webp",
      alt: "Banner B alt",
      href: null,
    },
    bannerSlotC: {
      imageUrl: "https://cdn.sanity.io/banner-c.webp",
      alt: "Banner C alt",
      href: "https://example.com/c",
    },
    matchesSliderPlaceholder: null,
    ...overrides,
  };
}

describe("HOMEPAGE_QUERY", () => {
  it("includes hotspot-aware CDN crop params for all three banner slots", () => {
    const query = HOMEPAGE_QUERY as unknown as string;
    // Banners render in a fixed 6:1 `object-cover` frame (<BannerSlot>), so the
    // URL bakes a 6:1 focalpoint crop — otherwise the browser center-crops and
    // ignores the editorial hotspot (same bug fixed on article cover images).
    const cropParams = `"?w=1200&h=200&q=80&fm=webp&fit=crop&crop=focalpoint&fp-x="`;
    const matches = query.match(
      /image\.asset->url \+ "\?w=1200&h=200&q=80&fm=webp&fit=crop&crop=focalpoint&fp-x="/g,
    );
    expect(matches).toHaveLength(3);
    expect(query).toContain(`"imageUrl": image.asset->url + ${cropParams}`);
  });

  it("also projects the matchesSliderPlaceholder fields (#2858 — folded into the same round-trip)", () => {
    const query = HOMEPAGE_QUERY as unknown as string;
    expect(query).toContain(
      `"matchesSliderPlaceholder": matchesSliderPlaceholder`,
    );
    expect(query).toContain("nextSeasonKickoff");
    expect(query).toContain("announcementText");
    expect(query).toContain("announcementHref");
    expect(query).toContain("highlightImage");
  });

  it('reads the homePage document exactly once (no second `[_type == "homePage"][0]` projection)', () => {
    const query = HOMEPAGE_QUERY as unknown as string;
    const documentReads = query.match(/\[_type == "homePage"\]\[0\]/g);
    expect(documentReads).toHaveLength(1);
  });
});

describe("HomepageRepository", () => {
  describe("getHomepage", () => {
    it("issues exactly one sanityClient.fetch call for both banners and the placeholder (#2858)", async () => {
      mockFetch.mockResolvedValueOnce(makeHomepageResult());

      await runWithRepo(
        Effect.gen(function* () {
          const repo = yield* HomepageRepository;
          return yield* repo.getHomepage();
        }),
      );

      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("carries getBanners's cache tag/revalidate treatment (already covered by /api/revalidate's homePage case)", async () => {
      mockFetch.mockResolvedValueOnce(makeHomepageResult());

      await runWithRepo(
        Effect.gen(function* () {
          const repo = yield* HomepageRepository;
          return yield* repo.getHomepage();
        }),
      );

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        {},
        {
          next: { revalidate: 60 * 60 * 24, tags: ["banners"] },
        },
      );
    });

    it("maps all three banner slots correctly from the merged GROQ result", async () => {
      mockFetch.mockResolvedValueOnce(makeHomepageResult());

      const { banners } = await runWithRepo(
        Effect.gen(function* () {
          const repo = yield* HomepageRepository;
          return yield* repo.getHomepage();
        }),
      );

      expect(banners.bannerSlotA).toEqual<BannerSlotVM>({
        imageUrl: "https://cdn.sanity.io/banner-a.webp",
        alt: "Banner A alt",
        href: "https://example.com/a",
      });

      expect(banners.bannerSlotB).toEqual<BannerSlotVM>({
        imageUrl: "https://cdn.sanity.io/banner-b.webp",
        alt: "Banner B alt",
        href: undefined,
      });

      expect(banners.bannerSlotC).toEqual<BannerSlotVM>({
        imageUrl: "https://cdn.sanity.io/banner-c.webp",
        alt: "Banner C alt",
        href: "https://example.com/c",
      });
    });

    it("returns all-null banner fallback and a null placeholder when the homepage document is missing", async () => {
      mockFetch.mockResolvedValueOnce(null);

      const { banners, placeholder } = await runWithRepo(
        Effect.gen(function* () {
          const repo = yield* HomepageRepository;
          return yield* repo.getHomepage();
        }),
      );

      expect(banners).toEqual<HomepageBannersVM>({
        bannerSlotA: null,
        bannerSlotB: null,
        bannerSlotC: null,
      });
      expect(placeholder).toBeNull();
    });

    it("returns null for individual missing banner slots", async () => {
      mockFetch.mockResolvedValueOnce(
        makeHomepageResult({ bannerSlotA: null, bannerSlotC: null }),
      );

      const { banners } = await runWithRepo(
        Effect.gen(function* () {
          const repo = yield* HomepageRepository;
          return yield* repo.getHomepage();
        }),
      );

      expect(banners.bannerSlotA).toBeNull();
      expect(banners.bannerSlotB).not.toBeNull();
      expect(banners.bannerSlotC).toBeNull();
    });

    it("null imageUrl or alt in a slot produces null for that slot", async () => {
      mockFetch.mockResolvedValueOnce(
        makeHomepageResult({
          bannerSlotA: {
            imageUrl: null,
            alt: "Banner A alt",
            href: null,
          },
        }),
      );

      const { banners } = await runWithRepo(
        Effect.gen(function* () {
          const repo = yield* HomepageRepository;
          return yield* repo.getHomepage();
        }),
      );

      expect(banners.bannerSlotA).toBeNull();
    });

    it("returns null placeholder when matchesSliderPlaceholder is not set", async () => {
      mockFetch.mockResolvedValueOnce(
        makeHomepageResult({ matchesSliderPlaceholder: null }),
      );

      const { placeholder } = await runWithRepo(
        Effect.gen(function* () {
          const repo = yield* HomepageRepository;
          return yield* repo.getHomepage();
        }),
      );

      expect(placeholder).toBeNull();
    });

    it("maps all placeholder fields correctly when fully populated, alongside the banners", async () => {
      mockFetch.mockResolvedValueOnce(
        makeHomepageResult({
          matchesSliderPlaceholder: {
            nextSeasonKickoff: "2026-08-10",
            announcementText: "Kalender 25-26 volgende week online",
            announcementHref: "https://example.com/kalender",
            highlightImage: {
              alt: "Supporters op de Driesstraat",
              asset: {
                url: "https://cdn.sanity.io/images/abc.jpg",
                lqip: "data:image/jpeg;base64,/9j...",
              },
            },
          },
        }),
      );

      const { banners, placeholder } = await runWithRepo(
        Effect.gen(function* () {
          const repo = yield* HomepageRepository;
          return yield* repo.getHomepage();
        }),
      );

      expect(placeholder).toEqual<MatchesSliderPlaceholderVM>({
        nextSeasonKickoff: new Date("2026-08-10"),
        announcementText: "Kalender 25-26 volgende week online",
        announcementHref: "https://example.com/kalender",
        highlightImage: {
          alt: "Supporters op de Driesstraat",
          url: "https://cdn.sanity.io/images/abc.jpg",
          lqip: "data:image/jpeg;base64,/9j...",
        },
      });
      // The merge is real, not incidental — the banners half of the same
      // fetch is still correctly mapped in the same call.
      expect(banners.bannerSlotA).not.toBeNull();
    });
  });

  describe("toPlaceholderVM", () => {
    it("omits highlightImage when alt is missing", () => {
      const result = toPlaceholderVM({
        matchesSliderPlaceholder: {
          nextSeasonKickoff: null,
          announcementText: null,
          announcementHref: null,
          highlightImage: {
            alt: null,
            asset: {
              url: "https://cdn.sanity.io/images/x.jpg",
              lqip: null,
            },
          },
        },
      } as HOMEPAGE_QUERY_RESULT);

      expect(result?.highlightImage).toBeUndefined();
    });

    it("omits nextSeasonKickoff when not set", () => {
      const result = toPlaceholderVM({
        matchesSliderPlaceholder: {
          nextSeasonKickoff: null,
          announcementText: "Later meer info",
          announcementHref: null,
          highlightImage: null,
        },
      } as HOMEPAGE_QUERY_RESULT);

      expect(result?.nextSeasonKickoff).toBeUndefined();
      expect(result?.announcementText).toBe("Later meer info");
    });

    it("accepts past kickoff dates (business logic filters, not the decoder)", () => {
      const result = toPlaceholderVM({
        matchesSliderPlaceholder: {
          nextSeasonKickoff: "2024-08-10",
          announcementText: null,
          announcementHref: null,
          highlightImage: null,
        },
      } as HOMEPAGE_QUERY_RESULT);

      expect(result?.nextSeasonKickoff).toEqual(new Date("2024-08-10"));
    });
  });
});
