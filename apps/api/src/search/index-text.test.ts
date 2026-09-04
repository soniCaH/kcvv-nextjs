import { describe, it, expect } from "vitest";
import {
  ARTICLE_INDEX_PROJECTION,
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

  it("turns &nbsp; into a space rather than an index token", () => {
    const result = stripTableHtml("<td>KFC&nbsp;Herent</td>");

    expect(result).toBe("KFC Herent");
    expect(result).not.toContain("nbsp");
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
  it("combines title, tags, lead, body text, and table text", () => {
    const result = buildArticleIndexText({
      title: "Verslag: KCVV wint derby",
      tags: ["verslag", "derby"],
      lead: "Een late kopbal besliste de derby.",
      bodyText: "KCVV Elewijt won de derby met 3-1.",
      tableHtml: "<table><tr><td>Jef Janssens</td></tr></table>",
    });

    expect(result).toContain("Verslag: KCVV wint derby");
    expect(result).toContain("verslag derby");
    expect(result).toContain("Een late kopbal besliste de derby.");
    expect(result).toContain("KCVV Elewijt won de derby met 3-1.");
    expect(result).toContain("Jef Janssens");
    expect(result).not.toContain("<td>");
  });

  it("indexes a squad name that lives only inside a table", () => {
    const result = buildArticleIndexText({
      title: "Transferoverzicht kern 2024-2025",
      tags: ["transfers"],
      lead: "",
      bodyText: "Een overzicht van de kern.",
      tableHtml:
        "<table><tr><td>Bocar Sarr</td><td>FC Mariekerke</td></tr></table>",
    });

    expect(result).toContain("Bocar Sarr");
    expect(result).toContain("FC Mariekerke");
  });

  it("handles null body text gracefully", () => {
    const result = buildArticleIndexText({
      title: "Kort bericht",
      tags: ["nieuws"],
      lead: "",
      bodyText: null,
      tableHtml: "",
    });

    expect(result).toContain("Kort bericht");
    expect(result).toContain("nieuws");
    expect(result).not.toContain("null");
  });

  it("adds nothing for an article with no table and no lead", () => {
    const result = buildArticleIndexText({
      title: "Kort bericht",
      tags: [],
      lead: "",
      bodyText: "Enkel proza.",
      tableHtml: "",
    });

    expect(result).toBe("Kort bericht. Enkel proza.");
    expect(result).not.toContain("undefined");
  });
});

describe("buildArticleExcerpt", () => {
  it("prefers the editor's lead", () => {
    const result = buildArticleExcerpt({
      lead: "Een late kopbal besliste de derby.",
      bodyText: "KCVV Elewijt won de derby met 3-1.",
    });

    expect(result).toBe("Een late kopbal besliste de derby.");
  });

  it("falls back to the body when the lead is empty", () => {
    const result = buildArticleExcerpt({
      lead: "",
      bodyText: "KCVV Elewijt won de derby met 3-1.",
    });

    expect(result).toBe("KCVV Elewijt won de derby met 3-1.");
  });

  it("caps at 200 characters and never yields null", () => {
    expect(
      buildArticleExcerpt({ lead: "x".repeat(300), bodyText: null }),
    ).toHaveLength(200);
    expect(buildArticleExcerpt({ lead: "", bodyText: null })).toBe("");
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

  it("wraps the Q&A branches in coalesce so a prose-only article keeps its body", () => {
    // `pt::text(body) + " " + pt::text(body[_type=="qaBlock"]...)` returns null
    // on the 121 of 125 articles that carry no qaBlock — GROQ propagates null
    // through `+`. array::join over coalesced branches is what avoids that.
    expect(ARTICLE_INDEX_PROJECTION).toContain("array::join");
    expect(ARTICLE_INDEX_PROJECTION).toContain("coalesce(body[_type==");
    expect(ARTICLE_INDEX_PROJECTION).not.toMatch(/pt::text\(body\)\s*\+/);
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
