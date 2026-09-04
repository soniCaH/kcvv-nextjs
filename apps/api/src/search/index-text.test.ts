import { describe, it, expect } from "vitest";
import {
  ARTICLE_INDEX_PROJECTION,
  ARTICLE_PUBLISHED_FILTER,
  buildArticleExcerpt,
  buildArticleIndexText,
  buildPageIndexText,
  buildResponsibilityIndexText,
  stripTableHtml,
} from "./index-text";

describe("buildResponsibilityIndexText", () => {
  it("combines title, question, keywords, and summary", () => {
    const result = buildResponsibilityIndexText({
      title: "Kantine & evenementen",
      question: "wie regelt de kantine",
      keywords: ["kantine", "bar", "evenementen"],
      summary: "De kantine wordt beheerd door de evenementencommissie.",
    });

    expect(result).toContain("Kantine & evenementen");
    expect(result).toContain("wie regelt de kantine");
    expect(result).toContain("kantine bar evenementen");
    expect(result).toContain("De kantine wordt beheerd");
  });
});

describe("stripTableHtml", () => {
  it("keeps the cell text and drops every tag", () => {
    const result = stripTableHtml(
      "<table><thead><tr><th>Club</th></tr></thead>" +
        "<tbody><tr><td>KCVV Elewijt</td><td>Zondag 15:00</td></tr></tbody></table>",
    );

    expect(result).not.toContain("<");
    expect(result).not.toContain(">");
    expect(result).toContain("Club");
    expect(result).toContain("KCVV Elewijt");
    expect(result).toContain("Zondag 15:00");
  });

  it("turns entities into spaces rather than index tokens", () => {
    expect(stripTableHtml("<td>KFC&nbsp;Herent</td>")).toBe("KFC Herent");
    expect(stripTableHtml("<td>Jan&amp;Piet</td>")).toBe("Jan Piet");
    expect(stripTableHtml("<td>A&#39;B</td>")).toBe("A B");
    expect(stripTableHtml("<td>&nbsp;</td>")).toBe("");
  });

  it("collapses the whitespace the tags leave behind", () => {
    const result = stripTableHtml("<tr>\n  <td>A</td>\n  <td>B</td>\n</tr>");

    expect(result).toBe("A B");
  });

  it("returns an empty string for an article with no table", () => {
    expect(stripTableHtml("")).toBe("");
  });
});

describe("buildArticleIndexText", () => {
  const base = {
    title: "Verslag: KCVV wint derby",
    tags: ["verslag", "derby"],
    lead: "Een late kopbal besliste de derby.",
    prose: "KCVV Elewijt won de derby met 3-1.",
    qaQuestions: ["Hoe ging het?"],
    qaAnswers: "Uitstekend, echt waar.",
    tableHtml: ["<table><tr><td>Jef Janssens</td></tr></table>"],
  };

  it("combines title, tags, lead, prose, Q&A, and table text", () => {
    const result = buildArticleIndexText(base);

    expect(result).toContain("Verslag: KCVV wint derby");
    expect(result).toContain("verslag derby");
    expect(result).toContain("Een late kopbal besliste de derby.");
    expect(result).toContain("KCVV Elewijt won de derby met 3-1.");
    expect(result).toContain("Hoe ging het?");
    expect(result).toContain("Uitstekend, echt waar.");
    expect(result).toContain("Jef Janssens");
    expect(result).not.toContain("<td>");
  });

  it("keeps the whole interview when the body holds no prose at all", () => {
    // `pt::text(body)` returns null, not "", for a body with no top-level
    // block, so a Q&A-only article is exactly the case a GROQ-side join would
    // blank out — the article this fix exists for.
    const result = buildArticleIndexText({
      ...base,
      prose: "",
      tableHtml: [],
    });

    expect(result).toContain("Hoe ging het?");
    expect(result).toContain("Uitstekend, echt waar.");
  });

  it("indexes a squad name that lives only inside a table", () => {
    const result = buildArticleIndexText({
      title: "Transferoverzicht kern 2024-2025",
      tags: ["transfers"],
      lead: "",
      prose: "Een overzicht van de kern.",
      qaQuestions: [],
      qaAnswers: "",
      tableHtml: [
        "<table><tr><td>Bocar Sarr</td><td>FC Mariekerke</td></tr></table>",
      ],
    });

    expect(result).toContain("Bocar Sarr");
    expect(result).toContain("FC Mariekerke");
  });

  it("drops the null elements GROQ leaves in the projected arrays", () => {
    // A `pairs[]` entry with no question, or an htmlTable with no html, comes
    // back as a null element — which is why the join is here and not in GROQ.
    const result = buildArticleIndexText({
      ...base,
      qaQuestions: [null, "Hoe ging het?"],
      tableHtml: [null, "<td>Goed</td>"],
    });

    expect(result).toContain("Hoe ging het?");
    expect(result).toContain("Goed");
    expect(result).not.toContain("null");
  });

  it("emits no bare separators for an article that is prose and nothing else", () => {
    const result = buildArticleIndexText({
      title: "Kort bericht",
      tags: [],
      lead: "",
      prose: "Enkel proza.",
      qaQuestions: [],
      qaAnswers: "",
      tableHtml: [],
    });

    expect(result).toBe("Kort bericht. Enkel proza.");
    expect(result).not.toContain("undefined");
    expect(result).not.toContain("null");
  });

  it("yields an empty string for an article with nothing indexable", () => {
    expect(
      buildArticleIndexText({
        title: "",
        tags: [],
        lead: "",
        prose: "",
        qaQuestions: [],
        qaAnswers: "",
        tableHtml: [],
      }),
    ).toBe("");
  });
});

describe("buildArticleExcerpt", () => {
  it("prefers the editor's lead", () => {
    expect(
      buildArticleExcerpt({
        lead: "Een late kopbal besliste de derby.",
        prose: "KCVV Elewijt won de derby met 3-1.",
      }),
    ).toBe("Een late kopbal besliste de derby.");
  });

  it("falls back to the prose, never to the Q&A or the table text", () => {
    // The fallback is the article's own opening paragraph. An interview with
    // an empty lead must not show "Hoe ging het? Uitstekend" as its summary.
    expect(buildArticleExcerpt({ lead: "", prose: "Inleidend proza." })).toBe(
      "Inleidend proza.",
    );
  });

  it("caps at 200 characters and never yields null", () => {
    expect(
      buildArticleExcerpt({ lead: "x".repeat(300), prose: "" }),
    ).toHaveLength(200);
    expect(buildArticleExcerpt({ lead: "", prose: "" })).toBe("");
  });
});

describe("ARTICLE_PUBLISHED_FILTER", () => {
  it("uses publishedAt, the field the schema actually defines", () => {
    // `publishAt` matched 0 of 125 published articles, and GROQ reports a
    // misspelling as an empty result — the nightly sweep indexed nothing while
    // its logs read as a clean run (#2806).
    expect(ARTICLE_PUBLISHED_FILTER).toContain("publishedAt <= now()");
    expect(ARTICLE_PUBLISHED_FILTER).not.toMatch(/(?<!un)publishAt/);
  });

  it("still excludes articles past their unpublishAt", () => {
    expect(ARTICLE_PUBLISHED_FILTER).toContain(
      "!defined(unpublishAt) || unpublishAt > now()",
    );
  });
});

describe("ARTICLE_INDEX_PROJECTION", () => {
  it("flattens the Portable Text title so the declared string type is true", () => {
    expect(ARTICLE_INDEX_PROJECTION).toContain("pt::text(title)");
  });

  it("projects the lead, the Q&A pairs, and the table html", () => {
    expect(ARTICLE_INDEX_PROJECTION).toContain('"lead"');
    expect(ARTICLE_INDEX_PROJECTION).toContain("qaBlock");
    expect(ARTICLE_INDEX_PROJECTION).toContain("htmlTable");
  });

  it("never joins the branches in GROQ, where null propagates", () => {
    // Both `+` and array::join return null if any operand is null, and
    // `pt::text(body)` is null for a body with no top-level block. Joining
    // here would blank a Q&A-only or table-only article entirely.
    expect(ARTICLE_INDEX_PROJECTION).not.toContain("array::join");
    expect(ARTICLE_INDEX_PROJECTION).not.toMatch(/pt::text\(body\)\s*\+/);
  });

  it("coalesces every branch so no field is ever null", () => {
    for (const field of ["prose", "qaQuestions", "qaAnswers", "tableHtml"]) {
      expect(ARTICLE_INDEX_PROJECTION).toMatch(
        new RegExp(`"${field}": coalesce\\(`),
      );
    }
  });
});

describe("buildPageIndexText", () => {
  it("combines title and body text", () => {
    const result = buildPageIndexText({
      title: "Over KCVV Elewijt",
      bodyText: "KCVV Elewijt is een voetbalclub uit Elewijt.",
    });

    expect(result).toContain("Over KCVV Elewijt");
    expect(result).toContain("KCVV Elewijt is een voetbalclub uit Elewijt.");
  });

  it("handles null body text gracefully", () => {
    const result = buildPageIndexText({
      title: "Lege pagina",
      bodyText: null,
    });

    expect(result).toBe("Lege pagina");
  });
});
