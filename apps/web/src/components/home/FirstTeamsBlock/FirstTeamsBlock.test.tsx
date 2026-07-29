import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { trackEvent } from "@/lib/analytics/track-event";
import { FirstTeamsBlock } from "./FirstTeamsBlock";
import type { FirstTeamVM } from "./first-teams";
import type { ScheduleMatch } from "@/components/match/types";

vi.mock("@/lib/analytics/track-event", () => ({ trackEvent: vi.fn() }));

const aResult: ScheduleMatch = {
  id: 101,
  date: new Date("2026-06-21T15:00:00Z"),
  homeTeam: { id: 1235, name: "KCVV Elewijt" },
  awayTeam: { id: 42, name: "SK Londerzeel" },
  homeScore: 3,
  awayScore: 1,
  isHome: true,
  status: "finished",
  competition: "3de Nationale",
};

const aFixture: ScheduleMatch = {
  id: 102,
  date: new Date("2026-06-29T13:00:00Z"),
  time: "15:00",
  homeTeam: { id: 77, name: "Sporting Hasselt" },
  awayTeam: { id: 1235, name: "KCVV Elewijt" },
  isHome: false,
  status: "scheduled",
  competition: "3de Nationale",
};

const aTeam: FirstTeamVM = {
  label: "A-ploeg",
  slug: "a-ploeg",
  division: "3de Nationale",
  result: aResult,
  fixture: aFixture,
};

const aTeamResultOnly: FirstTeamVM = {
  label: "A-ploeg",
  slug: "a-ploeg",
  division: "3de Nationale",
  result: aResult,
};

const bTeamFixtureOnly: FirstTeamVM = {
  label: "B-ploeg",
  slug: "b-ploeg",
  division: "2de Provinciale",
  fixture: {
    id: 202,
    date: new Date("2026-06-28T17:30:00Z"),
    time: "19:30",
    homeTeam: { id: 1236, name: "KCVV Elewijt B" },
    awayTeam: { id: 99, name: "VK Liedekerke" },
    isHome: true,
    status: "scheduled",
    competition: "2de Provinciale",
  },
};

describe("FirstTeamsBlock", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders the team label and division", () => {
    render(<FirstTeamsBlock teams={[aTeam]} />);
    expect(screen.getByText("A-ploeg")).toBeInTheDocument();
    // Division appears in the row header (and in each agenda-row caption).
    expect(screen.getAllByText("3de Nationale").length).toBeGreaterThan(0);
  });

  it("renders the result state via the shared match row (scoreline + opponent)", () => {
    render(<FirstTeamsBlock teams={[aTeamResultOnly]} />);
    // <TeamAgendaRow> renders "3 – 1" in both the desktop and mobile layouts.
    // The dash class tolerates en-/em-dash or hyphen without locking the glyph.
    expect(screen.getAllByText(/3\s*[–—-]\s*1/).length).toBeGreaterThan(0);
    expect(screen.getAllByText("SK Londerzeel").length).toBeGreaterThan(0);
    // No fixture → the upcoming side shows the skip placeholder.
    expect(screen.getByText("Geen geplande wedstrijd")).toBeInTheDocument();
  });

  it("renders the upcoming state via the shared match row (kickoff + opponent)", () => {
    render(<FirstTeamsBlock teams={[bTeamFixtureOnly]} />);
    expect(screen.getAllByText("19:30").length).toBeGreaterThan(0);
    expect(screen.getAllByText("VK Liedekerke").length).toBeGreaterThan(0);
    // No result → the result side shows the skip placeholder.
    expect(screen.getByText("Nog geen uitslag")).toBeInTheDocument();
  });

  it("deep-links each row to its own match detail", () => {
    render(<FirstTeamsBlock teams={[aTeam]} />);
    expect(screen.getByRole("link", { name: /SK Londerzeel/ })).toHaveAttribute(
      "href",
      "/wedstrijd/101",
    );
    expect(
      screen.getByRole("link", { name: /Sporting Hasselt/ }),
    ).toHaveAttribute("href", "/wedstrijd/102");
  });

  it("fires match_card_click with the result source on a result-row click", () => {
    render(<FirstTeamsBlock teams={[aTeamResultOnly]} />);
    fireEvent.click(screen.getByRole("link", { name: /SK Londerzeel/ }));
    expect(trackEvent).toHaveBeenCalledWith("match_card_click", {
      team_slug: "a-ploeg",
      match_id: 101,
      source: "first_teams_result",
    });
  });

  it("fires match_card_click with the fixture source on a fixture-row click", () => {
    render(<FirstTeamsBlock teams={[bTeamFixtureOnly]} />);
    fireEvent.click(screen.getByRole("link", { name: /VK Liedekerke/ }));
    expect(trackEvent).toHaveBeenCalledWith("match_card_click", {
      team_slug: "b-ploeg",
      match_id: 202,
      source: "first_teams_fixture",
    });
  });

  it("renders nothing when no team has a result or fixture", () => {
    const { container } = render(
      <FirstTeamsBlock
        teams={[
          { label: "A-ploeg", slug: "a-ploeg", division: "3de Nationale" },
        ]}
      />,
    );
    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByText("A-ploeg")).not.toBeInTheDocument();
  });
});
