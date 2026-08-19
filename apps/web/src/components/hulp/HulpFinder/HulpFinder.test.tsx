import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { HulpFinder } from "./HulpFinder";
import { FINDER_FIXTURE_PATHS } from "./__fixtures__/paths.fixture";
import { trackEvent } from "@/lib/analytics/track-event";

vi.mock("@/lib/analytics/track-event", () => ({ trackEvent: vi.fn() }));

const mockReplace = vi.fn();
let mockSearchParams = new URLSearchParams();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: mockReplace,
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => "/hulp",
  useSearchParams: () => mockSearchParams,
}));

let mockPanel: {
  openMemberById: ReturnType<typeof vi.fn>;
  openMember: ReturnType<typeof vi.fn>;
} | null = null;
vi.mock("@/components/organigram/HubMemberPanel", () => ({
  useHubMemberPanel: () => mockPanel,
}));

const trackView = vi.fn();
const trackContactClicked = vi.fn();
const trackOrganigramLink = vi.fn();
const trackStepLinkClicked = vi.fn();
vi.mock("@/hooks/useResponsibilityAnalytics", () => ({
  useResponsibilityAnalytics: () => ({
    trackRoleSelected: vi.fn(),
    trackSearch: vi.fn(),
    trackNoResults: vi.fn(),
    trackSuggestionClicked: vi.fn(),
    trackView,
    trackContactClicked,
    trackOrganigramLink,
    trackStepLinkClicked,
    startDwell: vi.fn(),
    stopDwell: vi.fn(),
    resetSession: vi.fn(),
  }),
}));

// happy-dom doesn't implement scrollIntoView — stub it so the finder's
// scroll-into-view effects don't throw, and so we can assert them.
const scrollIntoView = vi.fn();
beforeEach(() => {
  Element.prototype.scrollIntoView = scrollIntoView;
  scrollIntoView.mockClear();
  mockReplace.mockClear();
  vi.mocked(trackEvent).mockClear();
  trackView.mockClear();
  trackContactClicked.mockClear();
  trackOrganigramLink.mockClear();
  trackStepLinkClicked.mockClear();
  mockSearchParams = new URLSearchParams();
  mockPanel = null;
});

const q = (re: RegExp) => screen.getByRole("button", { name: re });
const qMaybe = (re: RegExp) => screen.queryByRole("button", { name: re });

describe("HulpFinder", () => {
  it('caps the "Alles" preview to the top 3 per category with an "Alle N →" affordance', () => {
    render(<HulpFinder responsibilityPaths={FINDER_FIXTURE_PATHS} />);
    // administratief has 5 → only the first 3 render in the preview.
    expect(q(/hoe schrijf ik mijn kind in/i)).toBeInTheDocument();
    expect(q(/wat kost een lidmaatschap/i)).toBeInTheDocument();
    expect(q(/hoe vraag ik een transfer aan/i)).toBeInTheDocument();
    expect(qMaybe(/fiscaal attest/i)).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /alle 5 vragen in administratief/i }),
    ).toBeInTheDocument();
  });

  it('"Alle N →" opens that category\'s full list and scrolls the finder into view', () => {
    render(<HulpFinder responsibilityPaths={FINDER_FIXTURE_PATHS} />);
    fireEvent.click(
      screen.getByRole("button", { name: /alle 5 vragen in administratief/i }),
    );
    expect(q(/fiscaal attest/i)).toBeInTheDocument();
    // Switching category hides the other categories' questions.
    expect(qMaybe(/mijn kind is geblesseerd/i)).not.toBeInTheDocument();
    // The page got shorter — scroll the finder back to the top so the filtered
    // list is in view (not stranded lower on the page).
    expect(scrollIntoView).toHaveBeenCalledWith(
      expect.objectContaining({ block: "start" }),
    );
  });

  it("a category chip filters to that category only", () => {
    render(<HulpFinder responsibilityPaths={FINDER_FIXTURE_PATHS} />);
    fireEvent.click(screen.getByRole("button", { name: "Medisch" }));
    expect(q(/mijn kind is geblesseerd/i)).toBeInTheDocument();
    expect(qMaybe(/ik wil sponsor worden/i)).not.toBeInTheDocument();
  });

  it("is single-open: opening a second question closes the first", () => {
    render(<HulpFinder responsibilityPaths={FINDER_FIXTURE_PATHS} />);
    fireEvent.click(q(/mijn kind is geblesseerd/i));
    expect(
      screen.getByText(/eerste zorg gaat altijd voor/i),
    ).toBeInTheDocument();
    fireEvent.click(q(/hoe schrijf ik mijn kind in/i));
    expect(
      screen.getByText(/inschrijven kan het hele seizoen/i),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/eerste zorg gaat altijd voor/i),
    ).not.toBeInTheDocument();
  });

  it("fires responsibility_view when a question opens", () => {
    render(<HulpFinder responsibilityPaths={FINDER_FIXTURE_PATHS} />);
    fireEvent.click(q(/hoe schrijf ik mijn kind in/i));
    expect(trackView).toHaveBeenCalledWith("inschrijven");
  });

  it("fires responsibility_contact_clicked from the answer's contact", () => {
    render(<HulpFinder responsibilityPaths={FINDER_FIXTURE_PATHS} />);
    fireEvent.click(q(/hoe schrijf ik mijn kind in/i));
    fireEvent.click(screen.getByRole("link", { name: /e-mail/i }));
    expect(trackContactClicked).toHaveBeenCalledWith("inschrijven", "email");
  });

  it("fires responsibility_organigram_link with the node id from 'Toon in structuur'", () => {
    render(<HulpFinder responsibilityPaths={FINDER_FIXTURE_PATHS} />);
    fireEvent.click(q(/mijn kind is geblesseerd/i));
    fireEvent.click(screen.getByRole("link", { name: /toon in structuur/i }));
    expect(trackOrganigramLink).toHaveBeenCalledWith("blessure", "node-gc");
  });

  it("opens the member panel in-page when inside a HubMemberPanel provider", () => {
    const openMemberById = vi.fn();
    mockPanel = { openMemberById, openMember: vi.fn() };
    render(<HulpFinder responsibilityPaths={FINDER_FIXTURE_PATHS} />);
    fireEvent.click(q(/mijn kind is geblesseerd/i));
    fireEvent.click(screen.getByRole("link", { name: /toon in structuur/i }));
    expect(openMemberById).toHaveBeenCalledWith(
      "node-gc",
      expect.objectContaining({ view: "cards" }),
    );
    expect(trackOrganigramLink).toHaveBeenCalledWith("blessure", "node-gc");
  });

  it("shows a per-category empty state when the active audience empties a category", () => {
    mockSearchParams = new URLSearchParams("audience=supporter");
    render(<HulpFinder responsibilityPaths={FINDER_FIXTURE_PATHS} />);
    // No medisch path is tagged 'supporter' → the category is empty for them.
    fireEvent.click(screen.getByRole("button", { name: "Medisch" }));
    // Names the active category by label (#2427 rule 5 — the copy is the
    // tell), not a generic "deze categorie".
    expect(screen.getByRole("status")).toHaveTextContent(
      /geen hulpvragen in medisch/i,
    );
  });

  it("fires empty_state_undo with the hulp_category surface + facet when the category undo is clicked (#2691)", () => {
    mockSearchParams = new URLSearchParams("audience=supporter");
    render(<HulpFinder responsibilityPaths={FINDER_FIXTURE_PATHS} />);
    fireEvent.click(screen.getByRole("button", { name: "Medisch" }));

    fireEvent.click(
      screen.getByRole("button", { name: "Toon alle categorieën" }),
    );

    expect(trackEvent).toHaveBeenCalledWith("empty_state_undo", {
      surface: "hulp_category",
      filter_type: "medisch",
    });
  });

  it("names the active audience by label when it empties across every category", () => {
    // No path in this subset is tagged 'speler' — the audience branch (not
    // the per-category branch above) should fire, and should name the
    // audience ("Speler"), not the generic "deze rol" (#2427 rule 5, #2562
    // review — the category branch already did this, the audience branch
    // hadn't). `audience` reads from the URL (`?audience=`), so it is seeded
    // via `mockSearchParams`, matching the sibling audience test below.
    mockSearchParams = new URLSearchParams("audience=speler");
    const pathsWithoutSpelerRole = FINDER_FIXTURE_PATHS.filter(
      (p) => !p.role.includes("speler"),
    );
    render(<HulpFinder responsibilityPaths={pathsWithoutSpelerRole} />);
    expect(screen.getByRole("status")).toHaveTextContent(
      /geen hulpvragen voor speler/i,
    );
    // "Toon alle doelgroepen", not "Toon alles" — the handler clears only
    // `audience`, so the label names the one facet it actually clears
    // (round 4 review).
    expect(
      screen.getByRole("button", { name: "Toon alle doelgroepen" }),
    ).toBeInTheDocument();
  });

  it("fires empty_state_undo with the hulp_audience surface + facet when the audience undo is clicked (#2691)", () => {
    mockSearchParams = new URLSearchParams("audience=speler");
    const pathsWithoutSpelerRole = FINDER_FIXTURE_PATHS.filter(
      (p) => !p.role.includes("speler"),
    );
    render(<HulpFinder responsibilityPaths={pathsWithoutSpelerRole} />);

    fireEvent.click(
      screen.getByRole("button", { name: "Toon alle doelgroepen" }),
    );

    expect(trackEvent).toHaveBeenCalledWith("empty_state_undo", {
      surface: "hulp_audience",
      filter_type: "speler",
    });
  });

  it("the undo clears only the active audience, leaving an active category untouched", () => {
    // Both facets active at once: the audience branch still fires first
    // (it's checked before `category`), and its undo must clear audience
    // only — router.replace never gains a category param because
    // `setAudience` has no way to touch `category` state at all.
    mockSearchParams = new URLSearchParams("audience=speler");
    const pathsWithoutSpelerRole = FINDER_FIXTURE_PATHS.filter(
      (p) => !p.role.includes("speler"),
    );
    render(<HulpFinder responsibilityPaths={pathsWithoutSpelerRole} />);

    fireEvent.click(screen.getByRole("button", { name: "Medisch" }));

    fireEvent.click(
      screen.getByRole("button", { name: "Toon alle doelgroepen" }),
    );

    // `audience` is gone from the replace URL; `setAudience` never touches
    // `category`, so nothing category-related is added either.
    expect(mockReplace).toHaveBeenCalledWith(
      expect.not.stringContaining("audience="),
      { scroll: false },
    );
    expect(mockReplace).toHaveBeenCalledWith(
      expect.not.stringContaining("categor"),
      { scroll: false },
    );
    // The category selection survives the undo click.
    expect(screen.getByRole("button", { name: "Medisch" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("filters by the ?audience param (hero deep-link)", () => {
    mockSearchParams = new URLSearchParams("audience=supporter");
    render(<HulpFinder responsibilityPaths={FINDER_FIXTURE_PATHS} />);
    expect(q(/ik wil sponsor worden/i)).toBeInTheDocument();
    expect(qMaybe(/hoe schrijf ik mijn kind in/i)).not.toBeInTheDocument();
  });

  it("an audience chip writes the ?audience param", () => {
    render(<HulpFinder responsibilityPaths={FINDER_FIXTURE_PATHS} />);
    fireEvent.click(screen.getByRole("button", { name: "Ouder" }));
    expect(mockReplace).toHaveBeenCalledWith(
      expect.stringContaining("audience=ouder"),
      { scroll: false },
    );
  });

  it("shows an empty state when there are no paths", () => {
    render(<HulpFinder responsibilityPaths={[]} />);
    expect(screen.getByRole("status")).toHaveTextContent(
      /nog geen hulpvragen/i,
    );
  });
});
