import type { GalleryCardVM } from "@/lib/repositories/photoGallery.repository";
import { TapedCardGrid } from "@/components/design-system";
import { GalleryCard } from "../GalleryCard/GalleryCard";

export interface GalleryCardGridItem extends GalleryCardVM {
  /**
   * Pre-formatted Dutch date. Formatted by the server (see
   * `toGalleryCardGridItems`) so the grid never drags Luxon into the client
   * bundle when `<GalleryListingClient>` renders it.
   */
  date?: string;
}

export interface GalleryCardGridProps {
  galleries: GalleryCardGridItem[];
  /** Heading level for each card's title. Default `h3`. */
  as?: "h2" | "h3";
}

/**
 * `<TapedCardGrid>` of `<GalleryCard>`s. Used by the `/galerij` list and the
 * match/event detail sections.
 *
 * The grid owns the per-slot rotation (#2569): the local `ROTATION_POOL` this
 * component used to cycle by hand was the drift `<TapedCardGrid>` exists to
 * remove, and a dated artefact takes the `md` gutter its tape needs.
 */
export const GalleryCardGrid = ({
  galleries,
  as = "h3",
}: GalleryCardGridProps) => (
  <TapedCardGrid columns={3} gap="md">
    {galleries.map((gallery) => (
      <GalleryCard
        key={gallery.id}
        title={gallery.title}
        href={`/galerij/${gallery.slug}`}
        coverUrl={gallery.coverUrl}
        coverLqip={gallery.coverLqip}
        imageCount={gallery.imageCount}
        date={gallery.date}
        as={as}
      />
    ))}
  </TapedCardGrid>
);
