import { describe, it, expect } from "vitest";
import { slugifyFacet } from "./slugify-facet";

describe("slugifyFacet", () => {
  it("lowercases display-case values", () => {
    expect(slugifyFacet("Jeugdwerking")).toBe("jeugdwerking");
    expect(slugifyFacet("Supportersactiviteit")).toBe("supportersactiviteit");
    expect(slugifyFacet("Jeugd")).toBe("jeugd");
  });

  it("leaves already-lowercase slugs unchanged", () => {
    expect(slugifyFacet("medisch")).toBe("medisch");
    expect(slugifyFacet("speler")).toBe("speler");
  });

  it("unifies the same conceptual facet under different casing", () => {
    // The exact regression this exists to prevent (#2691 review): the news
    // tag and the hulp slug for the same word must land on one value.
    expect(slugifyFacet("Jeugd")).toBe(slugifyFacet("jeugd"));
  });

  it("collapses whitespace and punctuation into single hyphens", () => {
    expect(slugifyFacet("Eerste Elftal A")).toBe("eerste-elftal-a");
    expect(slugifyFacet("  padded  ")).toBe("padded");
  });
});
