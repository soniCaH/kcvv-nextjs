import { describe, it, expect } from "vitest";

import {
  slugify,
  nameToSlug,
  resolvePersonPsdId,
  resolveYouthSlug,
} from "./legacy-redirect";

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

describe("nameToSlug", () => {
  it("slugifies firstName + lastName", () => {
    expect(nameToSlug("Jan", "Janssens")).toBe("jan-janssens");
  });

  it("strips diacritics and handles multi-word names", () => {
    expect(nameToSlug("Rémi Eduard", "Mendes Mouro")).toBe(
      "remi-eduard-mendes-mouro",
    );
    expect(nameToSlug("Jannes", "Van Hof")).toBe("jannes-van-hof");
  });

  it("collapses punctuation and trims hyphens", () => {
    expect(nameToSlug("Jean-Luc", "O'Connor")).toBe("jean-luc-o-connor");
  });
});

describe("resolvePersonPsdId", () => {
  const rows = [
    { psdId: "123", firstName: "Jan", lastName: "Janssens" },
    { psdId: "456", firstName: "Rémi", lastName: "Mendes" },
    { psdId: null, firstName: "No", lastName: "Id" },
  ];

  it("resolves a legacy name-slug to its psdId", () => {
    expect(resolvePersonPsdId("jan-janssens", rows)).toBe("123");
    expect(resolvePersonPsdId("remi-mendes", rows)).toBe("456");
  });

  it("is case-insensitive on the incoming slug", () => {
    expect(resolvePersonPsdId("Jan-Janssens", rows)).toBe("123");
  });

  it("falls back to a direct psdId match", () => {
    expect(resolvePersonPsdId("456", rows)).toBe("456");
  });

  it("returns null when nothing matches", () => {
    expect(resolvePersonPsdId("piet-pieters", rows)).toBeNull();
  });
});

describe("resolveYouthSlug", () => {
  const teams = [
    { slug: "kcvve-u9p", age: "U9" },
    { slug: "kcvve-u9-groen", age: "U9" },
    { slug: "kcvve-u9-wit", age: "U9" },
    { slug: "kcvve-u8", age: "U8" },
    // Messy real data: name "KCVVE U16" / slug "kcvve-u16" but age field "U17".
    { slug: "kcvve-u16", age: "U17" },
  ];

  it("passes through an already-current slug", () => {
    expect(resolveYouthSlug("kcvve-u9-groen", teams)).toBe("kcvve-u9-groen");
  });

  it("resolves a bare age token to the first team of that age by slug order", () => {
    expect(resolveYouthSlug("u9", teams)).toBe("kcvve-u9-groen");
    expect(resolveYouthSlug("u8", teams)).toBe("kcvve-u8");
  });

  it("prefers a colour match when the legacy token carries one", () => {
    expect(resolveYouthSlug("u9-wit", teams)).toBe("kcvve-u9-wit");
  });

  it("matches the age token in the slug even when the age field is wrong", () => {
    expect(resolveYouthSlug("u16", teams)).toBe("kcvve-u16");
  });

  it("returns null for non-youth or unknown tokens", () => {
    expect(resolveYouthSlug("u99", teams)).toBeNull();
    expect(resolveYouthSlug("visie", teams)).toBeNull();
  });
});
