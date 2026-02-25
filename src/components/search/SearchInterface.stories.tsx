/**
 * SearchInterface Storybook Stories
 *
 * SearchInterface orchestrates SearchForm + SearchFilters + SearchResults
 * and manages fetch calls to /api/search. Fetch is mocked per-story.
 */

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SearchInterface } from "./SearchInterface";
import type { SearchResponse } from "@/types/search";

const meta = {
  title: "Features/Search/SearchInterface",
  component: SearchInterface,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SearchInterface>;

export default meta;
type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const mockResponse: SearchResponse = {
  results: [
    {
      id: "1",
      type: "article",
      title: "KCVV Elewijt wint belangrijke wedstrijd met 3-2",
      description:
        "In een spannende wedstrijd heeft KCVV Elewijt met 3-2 gewonnen van de stadsrivaal.",
      url: "/news/kcvv-elewijt-wint",
      imageUrl: "https://placehold.co/400x300/4acf52/ffffff?text=Match",
      tags: ["A-ploeg", "Wedstrijdverslag"],
      date: "2026-01-15T10:00:00Z",
    },
    {
      id: "2",
      type: "article",
      title: "Voorbeschouwing: KCVV thuis tegen Racing Mechelen",
      description:
        "Zaterdag ontvangt KCVV Elewijt Racing Mechelen op eigen veld.",
      url: "/news/voorbeschouwing-racing-mechelen",
      imageUrl: "https://placehold.co/400x300/4acf52/ffffff?text=Preview",
      tags: ["A-ploeg", "Voorbeschouwing"],
      date: "2026-01-10T08:00:00Z",
    },
    {
      id: "3",
      type: "player",
      title: "Kevin De Smedt",
      description: "Aanvaller — A-ploeg",
      url: "/players/kevin-de-smedt",
      imageUrl: "https://placehold.co/200x200/4acf52/ffffff?text=KDS",
    },
    {
      id: "4",
      type: "player",
      title: "Jonas Van Acker",
      description: "Doelman — A-ploeg",
      url: "/players/jonas-van-acker",
      imageUrl: "https://placehold.co/200x200/4acf52/ffffff?text=JVA",
    },
    {
      id: "5",
      type: "team",
      title: "A-Ploeg",
      description: "Eerste ploeg — Nationale 1",
      url: "/team/a-ploeg",
      imageUrl: "https://placehold.co/200x200/4acf52/ffffff?text=A",
    },
  ],
  count: 5,
  query: "KCVV",
};

const mockEmpty: SearchResponse = { results: [], count: 0, query: "" };

function mockFetch(response: SearchResponse, delay = 0) {
  const original = global.fetch;
  global.fetch = async () => {
    if (delay > 0) await new Promise((r) => setTimeout(r, delay));
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  };
  return () => {
    global.fetch = original;
  };
}

function mockFetchError() {
  const original = global.fetch;
  global.fetch = async () =>
    new Response("Internal Server Error", { status: 500 });
  return () => {
    global.fetch = original;
  };
}

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

/**
 * Initial idle state — no query entered yet.
 * Shows the "Wat wil je zoeken?" help panel with category hints.
 */
export const Idle: Story = {
  args: {
    initialQuery: "",
  },
};

/**
 * Active search with results across all content types.
 * URL param `?q=KCVV` triggers a fetch on mount.
 */
export const WithResults: Story = {
  args: {
    initialQuery: "KCVV",
  },
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/search",
        query: { q: "KCVV" },
      },
    },
  },
  beforeEach() {
    return mockFetch(mockResponse);
  },
};

/**
 * Results filtered to players only via the `type` URL param.
 */
export const FilteredByPlayer: Story = {
  args: {
    initialQuery: "KCVV",
    initialType: "player",
  },
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/search",
        query: { q: "KCVV", type: "player" },
      },
    },
  },
  beforeEach() {
    return mockFetch(mockResponse);
  },
};

/**
 * Valid query but the API returns zero results.
 * Shows the empty state inside SearchResults.
 */
export const NoResults: Story = {
  args: {
    initialQuery: "xqzptw",
  },
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/search",
        query: { q: "xqzptw" },
      },
    },
  },
  beforeEach() {
    return mockFetch(mockEmpty);
  },
};

/**
 * Fetch in progress — spinner is shown, results panel hidden.
 */
export const Loading: Story = {
  args: {
    initialQuery: "KCVV",
  },
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/search",
        query: { q: "KCVV" },
      },
    },
  },
  beforeEach() {
    // Never resolves — keeps the loading spinner visible
    const original = global.fetch;
    global.fetch = async () => new Promise(() => {});
    return () => {
      global.fetch = original;
    };
  },
};

/**
 * API returns a 500 — displays the inline error message.
 */
export const Error: Story = {
  args: {
    initialQuery: "KCVV",
  },
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/search",
        query: { q: "KCVV" },
      },
    },
  },
  beforeEach() {
    return mockFetchError();
  },
};
