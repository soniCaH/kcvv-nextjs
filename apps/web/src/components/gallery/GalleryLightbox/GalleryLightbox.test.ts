import { describe, expect, it } from "vitest";
import { galleryImageAlt } from "./GalleryLightbox";

/**
 * Rule 5 of #2548: a gallery photo is the site's one genuinely alone image, so
 * it says position and extent. `/galerij/[slug]` shipped 55 images reading
 * `Foto 1` … `Foto 55` — an index with nothing to index into.
 */
describe("galleryImageAlt", () => {
  it("says position and extent when nothing is authored", () => {
    expect(galleryImageAlt({ alt: null }, 11, 55)).toBe("Foto 12 van 55");
  });

  it("counts from one, not from zero", () => {
    expect(galleryImageAlt({ alt: null }, 0, 55)).toBe("Foto 1 van 55");
    expect(galleryImageAlt({ alt: null }, 54, 55)).toBe("Foto 55 van 55");
  });

  it("lets an authored alt override the derived string", () => {
    expect(galleryImageAlt({ alt: "Julien kopt binnen" }, 3, 55)).toBe(
      "Julien kopt binnen",
    );
  });

  it("falls back when the authored alt is blank or whitespace", () => {
    expect(galleryImageAlt({ alt: "" }, 3, 55)).toBe("Foto 4 van 55");
    expect(galleryImageAlt({ alt: "   " }, 3, 55)).toBe("Foto 4 van 55");
    expect(galleryImageAlt({}, 3, 55)).toBe("Foto 4 van 55");
  });

  it("never names the collection — the page's h1 already does", () => {
    expect(galleryImageAlt({ alt: null }, 0, 3)).not.toMatch(/galerij|fotos/i);
  });
});
