/**
 * Photo Gallery Detail Page — Loading Skeleton.
 *
 * Mirrors `/galerij/[slug]`: the shared opening's quiet register (kicker +
 * gallery title + optional date/description) over `<GalleryLightbox>`'s
 * thumbnail grid (`grid-cols-2 sm:grid-cols-3 lg:grid-cols-4`, `aspect-square`
 * tiles).
 *
 * The headline is the gallery's own CMS title — data — so per #2432 §2 this
 * renders no heading text at all, bars only.
 */

import {
  PageContainer,
  Skeleton,
  LoadingAnnouncement,
} from "@/components/design-system";

export default function GalleryDetailLoading() {
  return (
    <div className="bg-cream">
      <LoadingAnnouncement label="Fotogalerij laden…" />

      <PageContainer as="main" className="py-12 sm:py-16">
        <div className="mb-10 flex flex-col" aria-hidden="true">
          <Skeleton className="h-3 w-44" />
          <Skeleton className="mt-2 h-12 w-2/3 max-w-full" />
          <Skeleton className="mt-3 h-4 w-32" />
        </div>

        <ul
          aria-hidden="true"
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <li key={i}>
              <Skeleton className="aspect-square w-full" />
            </li>
          ))}
        </ul>
      </PageContainer>
    </div>
  );
}
