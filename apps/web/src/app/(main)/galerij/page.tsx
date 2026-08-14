/**
 * Photo gallery list page (`/galerij`).
 *
 * Renders every published `photoGallery` (newest first) as retro-terrace
 * `<GalleryCard>`s — cover in colour newsprint, photo count, title and date.
 * Galleries change rarely, so the page uses a long (24h) ISR revalidate;
 * publishing a gallery revalidates it immediately once the #1921 Scope E
 * webhook map lands (see PR notes).
 */

import { Effect } from "effect";

import { SITE_CONFIG } from "@/lib/constants";
import { runPromise } from "@/lib/effect/runtime";
import { PhotoGalleryRepository } from "@/lib/repositories/photoGallery.repository";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd } from "@/lib/seo/jsonld";
import { buildPageMetadata } from "@/lib/seo/page-metadata";
import { PageContainer } from "@/components/design-system";
import { PageHero } from "@/components/layout/PageHero";
import { GalleryCardGrid } from "@/components/gallery/GalleryCardGrid/GalleryCardGrid";

export const metadata = buildPageMetadata({
  title: "Fotogalerij",
  description:
    "Foto's van wedstrijden, evenementen en clubmomenten van KCVV Elewijt.",
  path: "/galerij",
  ogTitle: "Fotogalerij - KCVV Elewijt",
  ogDescription: "Foto's van wedstrijden, evenementen en clubmomenten",
  keywords: ["foto's", "galerij", "fotogalerij", "beelden", "KCVV Elewijt"],
});

// Galleries change rarely — 24h ISR (align with #1921).
export const revalidate = 86400;

export default async function GalerijPage() {
  const galleries = await runPromise(
    Effect.gen(function* () {
      const repo = yield* PhotoGalleryRepository;
      return yield* repo.findAll();
    }),
  );

  return (
    <div className="bg-cream flex min-h-screen flex-col">
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", url: SITE_CONFIG.siteUrl },
          { name: "Galerij", url: `${SITE_CONFIG.siteUrl}/galerij` },
        ])}
      />
      {/* The opening and the listing are ONE padded section, not two stacked on
          the same colour (#2479 rule 3). */}
      <PageContainer as="main" width="index" className="flex-1 py-12 sm:py-16">
        <PageHero
          register="minimal"
          kicker="KCVV Elewijt · Beelden"
          headline="Fotogalerij"
        />
        {galleries.length === 0 ? (
          <p className="text-body-md text-ink-soft">
            Er zijn nog geen fotogalerijen gepubliceerd.
          </p>
        ) : (
          <GalleryCardGrid galleries={galleries} as="h2" />
        )}
      </PageContainer>
    </div>
  );
}
