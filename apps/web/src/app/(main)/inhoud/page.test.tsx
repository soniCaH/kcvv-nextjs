import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { SITE_CONFIG } from "@/lib/constants";

/**
 * The page composes four repository reads into `buildSiteContents`; the reads
 * themselves are the repositories' contract, so the runtime is mocked and the
 * page is asserted on what it does with what comes back — above all that an
 * empty read set produces an empty page, with no authored floor underneath it.
 */
const contents = {
  teams: [
    {
      id: "team-a",
      slug: "eerste-elftallen-a",
      displayName: "A-kern",
      division: "3NA",
      divisionFull: "Eerste Elftal A – 3e Nat. A",
    },
    {
      id: "team-u13",
      slug: "kcvv-elewijt-u13",
      displayName: "U13 Groen",
      division: null,
      divisionFull: null,
    },
  ],
  articles: [
    {
      id: "article-1",
      slug: "drie-punten",
      title: "Drie punten op de Dries",
      publishedAt: "2026-04-12T09:00:00Z",
    },
  ],
  events: [
    {
      id: "event-1",
      slug: "mosselfestijn-2026",
      title: "Mosselfestijn 2026",
      dateStart: "2026-09-04T17:00:00Z",
    },
  ],
  pages: [
    {
      id: "page-1",
      slug: "praktische-informatie",
      title: "Praktische Informatie",
      updatedAt: "2026-02-07T12:00:00Z",
    },
  ],
};

vi.mock("@/lib/effect/runtime", () => ({ runPromise: vi.fn() }));

vi.mock("@/lib/repositories/team.repository", () => ({ TeamRepository: {} }));
vi.mock("@/lib/repositories/article.repository", () => ({
  ArticleRepository: {},
}));
vi.mock("@/lib/repositories/event.repository", () => ({ EventRepository: {} }));
vi.mock("@/lib/repositories/page.repository", () => ({ PageRepository: {} }));

const { runPromise } = await import("@/lib/effect/runtime");
const mockRunPromise = vi.mocked(runPromise);

// Imported at module scope — see CLAUDE.md "Import the module under test at
// module scope".
const { default: InhoudPage, metadata } = await import("./page");

describe("/inhoud", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRunPromise.mockResolvedValue(contents);
  });

  it("announces itself with one visible heading from the shared opening", async () => {
    render(await InhoudPage());
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1.textContent).toContain("Inhoud");
  });

  it("canonicalises to /inhoud", () => {
    expect(metadata).toHaveProperty(
      "alternates.canonical",
      `${SITE_CONFIG.siteUrl}/inhoud`,
    );
  });

  it("prints the four derived groups", async () => {
    render(await InhoudPage());
    for (const title of ["Ploegen", "Nieuws", "Evenementen", "Clubpagina's"]) {
      expect(
        screen.getByRole("heading", { level: 2, name: new RegExp(title) }),
      ).toBeInTheDocument();
    }
  });

  it("pairs each entry with its value, showing an absent one as absent", async () => {
    const { container } = render(await InhoudPage());
    expect(
      screen.getByRole("link", { name: "A-kern Eerste Elftal A – 3e Nat. A" }),
    ).toHaveAttribute("href", "/ploegen/eerste-elftallen-a");
    // The youth team carries no division — the row stays, the value is marked.
    expect(screen.getByRole("link", { name: "U13 Groen" })).toBeInTheDocument();
    expect(container.querySelectorAll("[data-value-absent]")).toHaveLength(1);
  });

  it("renders no rows at all when every repository is empty", async () => {
    mockRunPromise.mockResolvedValue({
      teams: [],
      articles: [],
      events: [],
      pages: [],
    });
    render(await InhoudPage());
    expect(screen.queryAllByRole("heading", { level: 2 })).toEqual([]);
    expect(screen.queryAllByRole("link")).toEqual([]);
  });

  it("lists no players", async () => {
    const { container } = render(await InhoudPage());
    expect(container.querySelector('a[href^="/spelers/"]')).toBeNull();
  });
});
