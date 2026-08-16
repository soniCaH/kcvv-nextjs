import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import type { ImageProps } from "next/image";
import { NewsListingClient } from "./NewsListingClient";
import type { ArticleVM } from "@/lib/repositories/article.repository";

vi.mock("next/image", () => ({
  default: ({ alt, src, ...props }: ImageProps) => {
    const imgProps = { alt, src: typeof src === "string" ? src : "", ...props };
    return <img {...imgProps} />;
  },
}));

const mockFetchArticles = vi.fn();

function makeArticle(overrides: Partial<ArticleVM> = {}): ArticleVM {
  const id = overrides.id ?? `article-${Math.random().toString(36).slice(2)}`;
  return {
    id,
    title: overrides.title ?? "Test Article",
    slug: overrides.title?.toLowerCase().replace(/\s/g, "-") ?? "test",
    publishedAt: "2026-03-15T10:00:00Z",
    featured: false,
    coverImageUrl: null,
    tags: overrides.tags ?? [],
    articleType: null,
    subjects: null,
    firstTransferFact: null,
    firstEventFact: null,
    ...overrides,
  };
}

const categories = [
  {
    id: "Eerste ploeg",
    attributes: { name: "Eerste ploeg", slug: "Eerste ploeg" },
  },
  { id: "Jeugd", attributes: { name: "Jeugd", slug: "Jeugd" } },
];

describe("NewsListingClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const clickLoadMore = () =>
    fireEvent.click(screen.getByRole("button", { name: "Meer nieuws laden" }));

  it("renders every article in one chronological grid (#2569)", () => {
    render(
      <NewsListingClient
        initialArticles={[
          makeArticle({ id: "a1", title: "Article One" }),
          makeArticle({ id: "a2", title: "Article Two" }),
          makeArticle({ id: "a3", title: "Article Three" }),
          makeArticle({ id: "a4", title: "Article Four" }),
        ]}
        categories={categories}
        hasMore={false}
        fetchArticles={mockFetchArticles}
      />,
    );

    // `<EditorialHeading>` appends a trailing period — match optional `.`.
    for (const title of [
      "Article One",
      "Article Two",
      "Article Three",
      "Article Four",
    ]) {
      expect(
        screen.getByRole("heading", { name: new RegExp(`^${title}\\.?$`) }),
      ).toBeInTheDocument();
    }
  });

  it("drops the 'Uitgelicht' row — an archive is chronological (#2569)", () => {
    const { container } = render(
      <NewsListingClient
        initialArticles={[
          makeArticle({ id: "a1", title: "Article One" }),
          makeArticle({ id: "a2", title: "Article Two" }),
        ]}
        categories={categories}
        hasMore={false}
        fetchArticles={mockFetchArticles}
      />,
    );

    expect(
      screen.queryByRole("heading", { name: /uitgelicht/i }),
    ).not.toBeInTheDocument();

    // One grid, on the shared 1 → 2 → 3 ladder at the `md` gutter.
    const grids = container.querySelectorAll("[data-columns]");
    expect(grids).toHaveLength(1);
    expect(grids[0]!.getAttribute("data-columns")).toBe("3");
    expect(grids[0]!.getAttribute("data-gap")).toBe("md");
  });

  it("renders one uniform card size — no featured variant, no dek (#2569)", () => {
    const { container } = render(
      <NewsListingClient
        initialArticles={[
          makeArticle({
            id: "a1",
            title: "Article One",
            lead: "Deze samenvatting hoort niet in de grid.",
          }),
          makeArticle({ id: "a2", title: "Article Two" }),
          makeArticle({ id: "a3", title: "Article Three" }),
        ]}
        categories={categories}
        hasMore={false}
        fetchArticles={mockFetchArticles}
      />,
    );

    expect(
      screen.queryByText("Deze samenvatting hoort niet in de grid."),
    ).not.toBeInTheDocument();

    const links = container.querySelectorAll("a[data-variant]");
    expect(links).toHaveLength(3);
    for (const link of links) {
      expect(link.getAttribute("data-variant")).toBe("standard");
    }

    // The locked 16:9 image region survives on every card, and no card is
    // height-matched to a neighbour (the retired 2fr|1fr split's `flex-1
    // aspect-auto`, #2027).
    const cards = container.querySelectorAll("article");
    expect(cards.length).toBe(3);
    for (const card of cards) {
      expect(card.className).not.toMatch(/\baspect-auto\b/);
      expect(card.className).not.toMatch(/\bflex-1\b/);
    }
    const imageRegions = container.querySelectorAll(
      '[data-testid="newscard-image-region"]',
    );
    expect(imageRegions.length).toBe(3);
    for (const region of imageRegions) {
      expect(region.getAttribute("data-aspect")).toBe("landscape-16-9");
    }
  });

  it("shows the load-more button only when there are more articles (NEWS-1)", () => {
    render(
      <NewsListingClient
        initialArticles={[makeArticle({ id: "g1" })]}
        categories={categories}
        hasMore={true}
        fetchArticles={mockFetchArticles}
      />,
    );
    expect(
      screen.getByRole("button", { name: "Meer nieuws laden" }),
    ).toBeInTheDocument();

    cleanup();

    render(
      <NewsListingClient
        initialArticles={[makeArticle({ id: "g1" })]}
        categories={categories}
        hasMore={false}
        fetchArticles={mockFetchArticles}
      />,
    );
    expect(
      screen.queryByRole("button", { name: "Meer nieuws laden" }),
    ).not.toBeInTheDocument();
  });

  it("renders category filter tabs as buttons", () => {
    render(
      <NewsListingClient
        initialArticles={[makeArticle()]}
        categories={categories}
        hasMore={false}
        fetchArticles={mockFetchArticles}
      />,
    );

    expect(screen.getByRole("tab", { name: "Alles" })).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: "Eerste ploeg" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Jeugd" })).toBeInTheDocument();
  });

  it("shows empty state when no articles match category", async () => {
    mockFetchArticles.mockResolvedValue({ items: [], hasMore: false });

    render(
      <NewsListingClient
        initialArticles={[]}
        categories={categories}
        hasMore={false}
        fetchArticles={mockFetchArticles}
      />,
    );

    // Click a category tab
    fireEvent.click(screen.getByRole("tab", { name: "Jeugd" }));

    await waitFor(() => {
      expect(screen.getByText(/geen artikelen/i)).toBeInTheDocument();
    });
  });

  it("deduplicates articles returned by loadMore against the grid", async () => {
    const initial = [
      makeArticle({ id: "a1", title: "Article One" }),
      makeArticle({ id: "a2", title: "Article Two" }),
      makeArticle({ id: "a3", title: "Article Three" }),
      makeArticle({ id: "a4", title: "Article Four" }),
      makeArticle({ id: "a5", title: "Article Five" }),
      makeArticle({ id: "a6", title: "Article Six" }),
    ];

    // loadMore returns a mix of duplicates (a3, a6) and new articles (a7, a8)
    mockFetchArticles.mockResolvedValue({
      items: [
        makeArticle({ id: "a3", title: "Article Three" }),
        makeArticle({ id: "a6", title: "Article Six" }),
        makeArticle({ id: "a7", title: "Article Seven" }),
        makeArticle({ id: "a8", title: "Article Eight" }),
      ],
      hasMore: false,
    });

    render(
      <NewsListingClient
        initialArticles={initial}
        categories={categories}
        hasMore={true}
        fetchArticles={mockFetchArticles}
      />,
    );

    // Click the load-more button (replaces the old infinite-scroll trigger).
    clickLoadMore();

    // New articles should appear, duplicates should not create extra DOM nodes.
    // EditorialHeading appends a period, so match by heading role with optional `.`.
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /^Article Seven\.?$/ }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: /^Article Eight\.?$/ }),
      ).toBeInTheDocument();
    });

    // Verify no duplicate IDs in the rendered output
    const allArticleTitles = [
      "Article One",
      "Article Two",
      "Article Three",
      "Article Four",
      "Article Five",
      "Article Six",
      "Article Seven",
      "Article Eight",
    ];
    for (const title of allArticleTitles) {
      const elements = screen.getAllByRole("heading", {
        name: new RegExp(`^${title}\\.?$`),
      });
      expect(elements).toHaveLength(1);
    }
  });

  it("deduplicates articles after category change", async () => {
    mockFetchArticles.mockResolvedValue({
      items: [
        makeArticle({ id: "c1", title: "Cat One" }),
        makeArticle({ id: "c1", title: "Cat One" }), // duplicate in the batch
        makeArticle({ id: "c2", title: "Cat Two" }),
        makeArticle({ id: "c3", title: "Cat Three" }),
        makeArticle({ id: "c4", title: "Cat Four" }),
      ],
      hasMore: false,
    });

    render(
      <NewsListingClient
        initialArticles={[makeArticle({ id: "a1", title: "First Article" })]}
        categories={categories}
        hasMore={false}
        fetchArticles={mockFetchArticles}
      />,
    );

    fireEvent.click(screen.getByRole("tab", { name: "Jeugd" }));

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /^Cat Four\.?$/ }),
      ).toBeInTheDocument();
    });

    expect(
      screen.getAllByRole("heading", { name: /^Cat One\.?$/ }),
    ).toHaveLength(1);
  });

  it("shows loading indicator while fetching", async () => {
    // Make fetchArticles hang
    let resolvePromise: (value: unknown) => void;
    mockFetchArticles.mockReturnValue(
      new Promise((resolve) => {
        resolvePromise = resolve;
      }),
    );

    render(
      <NewsListingClient
        initialArticles={[makeArticle({ id: "g1" })]}
        categories={categories}
        hasMore={true}
        fetchArticles={mockFetchArticles}
      />,
    );

    // Click the load-more button to start the fetch.
    clickLoadMore();

    await waitFor(() => {
      expect(screen.getByRole("status")).toBeInTheDocument();
    });

    // Resolve to prevent act warnings
    resolvePromise!({ items: [], hasMore: false });
  });
});
