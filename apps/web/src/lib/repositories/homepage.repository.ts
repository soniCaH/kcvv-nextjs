import { Context, Effect, Layer } from "effect";
import { defineQuery } from "groq";
import { fetchGroq } from "../sanity/fetch-groq";
import { SANITY_LIST_REVALIDATE, SANITY_TAGS } from "../sanity/cache-tags";
import type { HOMEPAGE_QUERY_RESULT } from "../sanity/sanity.types";

// ─── GROQ Query ──────────────────────────────────────────────────────────────

/**
 * Banners + the off-season placeholder, in one read of the `homePage`
 * singleton (#2858). Both used to be their own `*[_type == "homePage"][0]`
 * query — two Sanity round-trips per render/revalidation of the same
 * document. Folded into one projection here; `toBannersVM`/`toPlaceholderVM`
 * below still parse their own half of the result independently, so neither
 * mapper needed to change shape.
 */
export const HOMEPAGE_QUERY = defineQuery(`*[_type == "homePage"][0] {
    "bannerSlotA": bannerSlotA-> {
      "imageUrl": image.asset->url + "?w=1200&h=200&q=80&fm=webp&fit=crop&crop=focalpoint&fp-x=" + string(coalesce(image.hotspot.x, 0.5)) + "&fp-y=" + string(coalesce(image.hotspot.y, 0.5)),
      alt,
      href
    },
    "bannerSlotB": bannerSlotB-> {
      "imageUrl": image.asset->url + "?w=1200&h=200&q=80&fm=webp&fit=crop&crop=focalpoint&fp-x=" + string(coalesce(image.hotspot.x, 0.5)) + "&fp-y=" + string(coalesce(image.hotspot.y, 0.5)),
      alt,
      href
    },
    "bannerSlotC": bannerSlotC-> {
      "imageUrl": image.asset->url + "?w=1200&h=200&q=80&fm=webp&fit=crop&crop=focalpoint&fp-x=" + string(coalesce(image.hotspot.x, 0.5)) + "&fp-y=" + string(coalesce(image.hotspot.y, 0.5)),
      alt,
      href
    },
    "matchesSliderPlaceholder": matchesSliderPlaceholder {
      nextSeasonKickoff,
      announcementText,
      announcementHref,
      "highlightImage": highlightImage {
        alt,
        "asset": asset->{
          "url": url + "?w=1344&h=320&q=80&fm=webp&fit=crop&crop=focalpoint&fp-x=" + string(coalesce(^.hotspot.x, 0.5)) + "&fp-y=" + string(coalesce(^.hotspot.y, 0.5)),
          "lqip": metadata.lqip
        }
      }
    }
  }`);

export interface BannerSlotVM {
  imageUrl: string;
  alt: string;
  href?: string;
}

export interface HomepageBannersVM {
  bannerSlotA: BannerSlotVM | null;
  bannerSlotB: BannerSlotVM | null;
  bannerSlotC: BannerSlotVM | null;
}

type RawSlot = NonNullable<HOMEPAGE_QUERY_RESULT>["bannerSlotA"];

function toBannerSlotVM(slot: RawSlot): BannerSlotVM | null {
  if (!slot || !slot.imageUrl || !slot.alt) return null;
  return {
    imageUrl: slot.imageUrl,
    alt: slot.alt,
    href: slot.href ?? undefined,
  };
}

export function toBannersVM(data: HOMEPAGE_QUERY_RESULT): HomepageBannersVM {
  if (!data) {
    return { bannerSlotA: null, bannerSlotB: null, bannerSlotC: null };
  }
  return {
    bannerSlotA: toBannerSlotVM(data.bannerSlotA),
    bannerSlotB: toBannerSlotVM(data.bannerSlotB),
    bannerSlotC: toBannerSlotVM(data.bannerSlotC),
  };
}

export interface MatchesSliderPlaceholderVM {
  nextSeasonKickoff?: Date;
  announcementText?: string;
  announcementHref?: string;
  highlightImage?: {
    alt: string;
    url: string;
    lqip?: string;
  };
}

export function toPlaceholderVM(
  data: HOMEPAGE_QUERY_RESULT,
): MatchesSliderPlaceholderVM | null {
  const placeholder = data?.matchesSliderPlaceholder;
  if (!placeholder) return null;

  const image = placeholder.highlightImage;
  const hasImage = image?.alt && image.asset?.url;

  return {
    nextSeasonKickoff: placeholder.nextSeasonKickoff
      ? new Date(placeholder.nextSeasonKickoff)
      : undefined,
    announcementText: placeholder.announcementText ?? undefined,
    announcementHref: placeholder.announcementHref ?? undefined,
    highlightImage: hasImage
      ? {
          alt: image.alt!,
          url: image.asset!.url!,
          lqip: image.asset!.lqip ?? undefined,
        }
      : undefined,
  };
}

export interface HomepageVM {
  banners: HomepageBannersVM;
  placeholder: MatchesSliderPlaceholderVM | null;
}

export interface HomepageRepositoryInterface {
  readonly getHomepage: () => Effect.Effect<HomepageVM>;
}

export class HomepageRepository extends Context.Tag("HomepageRepository")<
  HomepageRepository,
  HomepageRepositoryInterface
>() {}

export const HomepageRepositoryLive = Layer.succeed(HomepageRepository, {
  // One read of the `homePage` singleton for both halves (#2858). Tagged with
  // `SANITY_TAGS.banners` — the tag `getBanners` already carried, and the one
  // `getPlaceholder` was given in #2505 round-3 review finding S4 for the
  // same reason: `/api/revalidate`'s `case "homePage"` already busts this tag
  // + path `/` on every publish of this document, so both halves were already
  // covered by the same webhook before this merge. Folding the queries
  // doesn't change what gets revalidated or when — only the round-trip count.
  getHomepage: () =>
    fetchGroq<HOMEPAGE_QUERY_RESULT>(HOMEPAGE_QUERY, undefined, {
      revalidate: SANITY_LIST_REVALIDATE,
      tags: [SANITY_TAGS.banners],
    }).pipe(
      Effect.map((data) => ({
        banners: toBannersVM(data),
        placeholder: toPlaceholderVM(data),
      })),
    ),
});
