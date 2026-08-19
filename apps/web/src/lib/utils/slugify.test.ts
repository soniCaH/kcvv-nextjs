import { describe, it, expect } from "vitest";
import { slugify } from "./slugify";

describe("slugify", () => {
  it("lowercases display-case values", () => {
    expect(slugify("Jeugdwerking")).toBe("jeugdwerking");
    expect(slugify("Jeugd")).toBe("jeugd");
  });

  it("leaves already-lowercase slugs unchanged", () => {
    expect(slugify("medisch")).toBe("medisch");
  });

  it("unifies the same conceptual value under different casing", () => {
    // The exact collision an analytics facet dimension must avoid: the same
    // word from two hosts, one display-cased, one already a slug.
    expect(slugify("Jeugd")).toBe(slugify("jeugd"));
  });

  it("strips diacritics and maps '&' to ' en ', matching nameToSlug", () => {
    expect(slugify("Café-avond")).toBe("cafe-avond");
    expect(slugify("Jeugd & Ouders")).toBe("jeugd-en-ouders");
  });

  it("collapses whitespace and punctuation into single hyphens", () => {
    expect(slugify("Eerste Elftal A")).toBe("eerste-elftal-a");
    expect(slugify("  padded  ")).toBe("padded");
  });
});
