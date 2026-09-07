/**
 * `/` (homepage) — failed-section regressions for #2505 review findings 1 + 3.
 *
 * Mocks each repository/service's `*Live` Layer directly (not `runPromise`
 * itself), so the real `degradeSection` / `Effect.catchAll` pipelines in
 * `page.tsx` actually run — the point of these tests is that the correct
 * guard is in place, not that the page can render at all.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { Effect, Layer } from "effect";
import { HttpBadGateway } from "@kcvv/api-contract";
import type { ArticleVM } from "@/lib/repositories/article.repository";

const minimalArticle: ArticleVM = {
  id: "art-1",
  title: "Groenwit wint van Londerzeel",
  slug: "groenwit-wint-van-londerzeel",
  publishedAt: "2026-05-01T10:00:00Z",
  featured: false,
  coverImageUrl: "https://cdn.example.com/cover.jpg",
  tags: [],
  articleType: null,
  subjects: null,
  firstTransferFact: null,
  firstEventFact: null,
};

// `<SponsorsSection>` is its own async Server Component (reads
// `SponsorRepository` internally) — react-dom's `render()` cannot resolve an
// async component below the root the way the real RSC renderer does, so it
// throws "Only Server Components can be async at the moment" the moment
// `HomePage()`'s tree is rendered. Irrelevant to these two findings, so it
// is stubbed to a plain sync placeholder rather than pulled into these
// mocks' scope.
vi.mock("@/components/home/SponsorsSection/SponsorsSection", () => ({
  SponsorsSection: () => null,
}));

vi.mock("@/lib/repositories/article.repository", async (importOriginal) => {
  const mod =
    await importOriginal<
      typeof import("@/lib/repositories/article.repository")
    >();
  return {
    ...mod,
    ArticleRepositoryLive: Layer.succeed(mod.ArticleRepository, {
      // At least one article so the page's "nothing at all" early return
      // (`articles.length === 0 && matches.length === 0`) doesn't fire —
      // these tests are about the FirstTeamsBlock/agenda sections, not that
      // fallback screen.
      findAll: () => Effect.succeed([minimalArticle]),
      findBySlug: () => Effect.die("not used by this suite"),
      findPaginated: () => Effect.die("not used by this suite"),
      findTags: () => Effect.die("not used by this suite"),
      findRelated: () => Effect.die("not used by this suite"),
      findByLinkedMatch: () => Effect.die("not used by this suite"),
    }),
  };
});

const { mockGetNextMatches } = vi.hoisted(() => ({
  mockGetNextMatches: vi.fn(),
}));

vi.mock("@/lib/effect/services/BffService", async (importOriginal) => {
  const mod =
    await importOriginal<typeof import("@/lib/effect/services/BffService")>();
  return {
    ...mod,
    BffServiceLive: Layer.succeed(mod.BffService, {
      getMatches: () => Effect.die("not used by this suite"),
      getNextMatches: mockGetNextMatches,
      getMatchesWindow: () => Effect.die("not used by this suite"),
      getMatchDetail: () => Effect.die("not used by this suite"),
      getRanking: () => Effect.die("not used by this suite"),
      getRelated: () => Effect.die("not used by this suite"),
      getOpponentHistory: () => Effect.die("not used by this suite"),
      getPlayerStats: () => Effect.die("not used by this suite"),
    }),
  };
});

const { mockGetPlaceholder } = vi.hoisted(() => ({
  mockGetPlaceholder: vi.fn(),
}));

vi.mock("@/lib/repositories/homepage.repository", async (importOriginal) => {
  const mod =
    await importOriginal<
      typeof import("@/lib/repositories/homepage.repository")
    >();
  return {
    ...mod,
    HomepageRepositoryLive: Layer.succeed(mod.HomepageRepository, {
      getBanners: () =>
        Effect.succeed({
          bannerSlotA: null,
          bannerSlotB: null,
          bannerSlotC: null,
        }),
      getPlaceholder: mockGetPlaceholder,
    }),
  };
});

vi.mock("@/lib/repositories/event.repository", async (importOriginal) => {
  const mod =
    await importOriginal<
      typeof import("@/lib/repositories/event.repository")
    >();
  return {
    ...mod,
    EventRepositoryLive: Layer.succeed(mod.EventRepository, {
      findAll: () => Effect.die("not used by this suite"),
      findUpcomingForList: () => Effect.die("not used by this suite"),
      findNextFeatured: () => Effect.succeed(null),
      findBySlug: () => Effect.die("not used by this suite"),
      findAllSlugs: () => Effect.die("not used by this suite"),
    }),
  };
});

vi.mock("@/lib/repositories/team.repository", async (importOriginal) => {
  const mod =
    await importOriginal<typeof import("@/lib/repositories/team.repository")>();
  return {
    ...mod,
    // Empty on purpose: no senior teams means no per-team BFF fan-out
    // (`getTeamMatches`), which keeps this suite's own mocks the only ones
    // in play.
    TeamRepositoryLive: Layer.succeed(mod.TeamRepository, {
      findAll: () => Effect.succeed([]),
      findBySlug: () => Effect.die("not used by this suite"),
      findAllForLanding: () => Effect.die("not used by this suite"),
      findYouthTeamsForContact: () => Effect.die("not used by this suite"),
      findByMemberId: () => Effect.die("not used by this suite"),
    }),
  };
});

// Imported at module scope — see CLAUDE.md "Import the module under test at
// module scope". The mock factories above close over hoisted `vi.fn()`s, so
// a dynamic `await import()` is unnecessary here (no TDZ risk: nothing in
// these factories reads a module-scope `const`).
const { default: HomePage } = await import("./page");

describe("/ — a failed placeholder read keeps the page (#2505 review finding 1)", () => {
  beforeEach(() => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    mockGetNextMatches.mockReturnValue(Effect.succeed([]));
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("survives a placeholder read that dies (real Sanity defect shape) and falls back to the nothing-authored copy", async () => {
    mockGetPlaceholder.mockReturnValue(
      Effect.die(new Error("Sanity is unreachable")),
    );

    const element = await HomePage();
    render(element);

    // The band rendered at all (no rejection reached the caller) and picked
    // the honest "nothing authored" fallback — not the outage copy, since
    // the match reads themselves succeeded.
    expect(
      screen.getByText("Nog geen wedstrijden ingepland."),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/even niet beschikbaar/i),
    ).not.toBeInTheDocument();
  });

  it("still renders the authored notice when the placeholder read succeeds", async () => {
    mockGetPlaceholder.mockReturnValue(
      Effect.succeed({
        announcementText: "Groenwit maakt zich klaar voor het nieuwe seizoen.",
      }),
    );

    const element = await HomePage();
    render(element);

    expect(
      screen.getByText("Groenwit maakt zich klaar voor het nieuwe seizoen."),
    ).toBeInTheDocument();
  });
});

describe("/ — the agenda's outage signal is its own read (#2505 review finding 3)", () => {
  beforeEach(() => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    mockGetPlaceholder.mockReturnValue(Effect.succeed(null));
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("does not claim the agenda is unavailable when getNextMatches succeeds empty", async () => {
    // No senior teams in this suite, so `firstTeamsMatches` is always `[]`
    // and can never itself flip `matchReadFailed` — this isolates the one
    // signal under test: `matchesResult === null` vs. `[]`.
    mockGetNextMatches.mockReturnValue(Effect.succeed([]));

    const element = await HomePage();
    render(element);

    // The agenda section drops (genuinely empty, not unavailable) — its
    // failure notice must not appear anywhere on the page.
    expect(
      screen.queryByText(/Komende wedstrijden zijn even niet beschikbaar/i),
    ).not.toBeInTheDocument();
  });

  it("does claim the agenda is unavailable when its own getNextMatches read fails", async () => {
    mockGetNextMatches.mockReturnValue(
      Effect.fail(new HttpBadGateway({ error: "upstream is down" })),
    );

    const element = await HomePage();
    render(element);

    // `<FirstTeamsBlock>` also renders an "even niet beschikbaar" sentence
    // in this scenario (its own `unavailable` is `matchesResult === null`
    // too, since there are no senior teams to diverge on) — scope to the
    // agenda region so this assertion is about its own notice specifically.
    const agenda = screen.getByRole("region", { name: "Komende wedstrijden" });
    // Accented substring lands in its own text node (`<AccentEm>`), so this
    // reads the notice paragraph's full text content rather than matching
    // the (split-across-nodes) full sentence directly.
    expect(
      within(agenda).getByText("even niet beschikbaar").closest("p"),
    ).toHaveTextContent(
      "Komende wedstrijden zijn even niet beschikbaar. Probeer het later opnieuw.",
    );
  });
});
