import { describe, it, expect } from "vitest";
import { SITE_CONFIG, DEFAULT_OG_IMAGE } from "@/lib/constants";
import { metadata } from "./layout";
// Module scope is deliberate: Vitest charges an import inside an `it()` body
// against `testTimeout`, while this is paid during the untimed collect phase
// (#2362). There are no `vi.mock` calls here, so a static import is safe.
import { metadata as privacyMetadata } from "./(main)/privacy/page";

describe("root layout metadata", () => {
  it("SITE_CONFIG.siteUrl is a valid absolute URL for metadataBase", () => {
    const url = new URL(SITE_CONFIG.siteUrl);
    expect(url.href).toBe("https://www.kcvvelewijt.be/");
  });

  it("includes openGraph.images matching DEFAULT_OG_IMAGE in root metadata", () => {
    const og = metadata.openGraph as { images?: unknown[] };
    expect(og.images).toBeDefined();
    expect(og.images).toHaveLength(1);
    expect(og.images![0]).toEqual(DEFAULT_OG_IMAGE);
  });

  // #2228 SEO-1: the " | KCVV Elewijt" suffix lives ONLY in the root title
  // template. Pages that also hardcode it produce a doubled "<x> | KCVV Elewijt
  // | KCVV Elewijt" <title>.
  it("owns the brand suffix centrally via the title template", () => {
    const title = metadata.title as { template?: string };
    expect(title.template).toBe("%s | KCVV Elewijt");
  });

  it("static pages do not hardcode the brand suffix in their title", () => {
    expect(privacyMetadata.title).toBe("Privacyverklaring");
    expect(String(privacyMetadata.title)).not.toContain("| KCVV Elewijt");
  });
});
