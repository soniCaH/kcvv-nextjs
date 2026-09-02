import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { ContentsGroup } from "@/lib/utils/site-contents";

import { SiteContents } from "./SiteContents";

const GROUPS: ContentsGroup[] = [
  {
    id: "ploegen",
    title: "Ploegen",
    entries: [
      {
        id: "team-a",
        label: "A-ploeg",
        value: "2e Provinciale B",
        href: "/ploegen/eerste-elftallen-a",
      },
      {
        id: "team-u15",
        label: "U15",
        value: null,
        href: "/ploegen/kcvve-u15",
      },
    ],
  },
  {
    id: "nieuws",
    title: "Nieuws",
    entries: [
      {
        id: "article-1",
        label: "Drie punten op de Dries",
        value: "12·04·26",
        href: "/nieuws/drie-punten-op-de-dries",
      },
    ],
  },
];

describe("SiteContents", () => {
  it("renders one section per group, each headed by its title", () => {
    render(<SiteContents groups={GROUPS} />);
    expect(
      screen.getByRole("heading", { level: 2, name: /Ploegen/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: /Nieuws/ }),
    ).toBeInTheDocument();
  });

  it("prints each group's entry count", () => {
    render(<SiteContents groups={GROUPS} />);
    const ploegen = screen
      .getByRole("heading", { level: 2, name: /Ploegen/ })
      .closest("section")!;
    expect(within(ploegen).getByText("2")).toBeInTheDocument();
  });

  it("links every entry to its own route", () => {
    render(<SiteContents groups={GROUPS} />);
    expect(
      screen.getByRole("link", { name: "A-ploeg 2e Provinciale B" }),
    ).toHaveAttribute("href", "/ploegen/eerste-elftallen-a");
    expect(
      screen.getByRole("link", { name: "Drie punten op de Dries 12·04·26" }),
    ).toHaveAttribute("href", "/nieuws/drie-punten-op-de-dries");
  });

  it("shows an entry whose value is absent rather than dropping it", () => {
    const { container } = render(<SiteContents groups={GROUPS} />);
    expect(screen.getByRole("link", { name: "U15" })).toBeInTheDocument();
    expect(container.querySelectorAll("[data-value-absent]")).toHaveLength(1);
  });

  it("marks every row with its group and 1-based rank for analytics", () => {
    const { container } = render(<SiteContents groups={GROUPS} />);
    const rows = [
      ...container.querySelectorAll<HTMLElement>("[data-contents-group]"),
    ];
    expect(
      rows.map((r) => [r.dataset.contentsGroup, r.dataset.contentsPosition]),
    ).toEqual([
      ["ploegen", "1"],
      ["ploegen", "2"],
      ["nieuws", "1"],
    ]);
  });

  it("renders nothing when there are no groups", () => {
    const { container } = render(<SiteContents groups={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  // #2614: a long index page (this one — ~240 rows across four groups) earns
  // one chapter break in a warmer, non-semantic paper tint. `nieuws` is the
  // largest group and sits second in print order, so it is the one section
  // the page needs to visually set apart from its neighbours.
  it("chapters the nieuws group in the manila tint and leaves the others on the page ground", () => {
    const ALL_GROUPS: ContentsGroup[] = [
      ...GROUPS,
      { id: "evenementen", title: "Evenementen", entries: [] },
      { id: "clubpaginas", title: "Clubpagina's", entries: [] },
    ];
    render(<SiteContents groups={ALL_GROUPS} />);

    const nieuws = screen
      .getByRole("heading", { level: 2, name: /Nieuws/ })
      .closest("section")!;
    expect(nieuws).toHaveClass("bg-manila");
    // #2793 review: the tint must bleed to the viewport, not clip to the
    // content column — and the heading/rows must sit inside their own
    // padded wrapper rather than touching the tint's edge directly.
    expect(nieuws).toHaveClass("w-screen");
    const paddedWrapper = nieuws.querySelector<HTMLElement>(":scope > div");
    expect(paddedWrapper).toHaveClass("px-4");
    expect(paddedWrapper).toContainElement(nieuws.querySelector("h2"));

    for (const title of ["Ploegen", "Evenementen", "Clubpagina's"]) {
      const section = screen
        .getByRole("heading", { level: 2, name: new RegExp(title) })
        .closest("section")!;
      expect(section).not.toHaveClass("bg-manila");
    }
  });
});
