import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MatchEventsSection } from "./MatchEventsSection";
import type { MatchEvent } from "../MatchEvents/MatchEvents";

const events: MatchEvent[] = [
  {
    id: 1,
    type: "goal",
    minute: 12,
    team: "home",
    player: "Lars De Vos",
  },
  {
    id: 2,
    type: "yellow_card",
    minute: 28,
    team: "away",
    player: "Kevin Smets",
  },
  {
    id: 3,
    type: "goal",
    minute: 45,
    additionalTime: 2,
    team: "home",
    player: "Jens Vermeulen",
    isPenalty: true,
  },
];

describe("MatchEventsSection", () => {
  it("renders kicker, heading, and the wrapped events when data is present", () => {
    render(
      <MatchEventsSection
        homeTeamName="KCVV Elewijt"
        awayTeamName="RC Mechelen"
        events={events}
      />,
    );
    expect(screen.getByText("WEDSTRIJDVERLOOP")).toBeInTheDocument();
    expect(screen.getByText("Hoe het ging.")).toBeInTheDocument();
    expect(screen.getByText("Lars De Vos")).toBeInTheDocument();
    expect(screen.getByText("Kevin Smets")).toBeInTheDocument();
  });

  it("returns null when events is empty", () => {
    const { container } = render(
      <MatchEventsSection
        homeTeamName="KCVV Elewijt"
        awayTeamName="RC Mechelen"
        events={[]}
      />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("sorts stoppage-time events before the next regular minute", () => {
    render(
      <MatchEventsSection
        homeTeamName="KCVV Elewijt"
        awayTeamName="RC Mechelen"
        events={[
          { id: 1, type: "goal", minute: 46, team: "home", player: "A" },
          {
            id: 2,
            type: "goal",
            minute: 45,
            additionalTime: 2,
            team: "home",
            player: "B",
          },
        ]}
      />,
    );
    // 45+2' (B) renders before 46' (A) in the chronological order.
    const players = screen.getAllByText(/^[AB]$/);
    expect(players[0]?.textContent).toBe("B");
    expect(players[1]?.textContent).toBe("A");
  });

  it("renders a typographic team-logo chip per row when no URL is provided", () => {
    // 3 events total: 2 home (Lars + Jens) + 1 away (Kevin) → 3 chips, each
    // showing the first letter of its team name. KCVV chips show "K", away
    // chip shows "R".
    render(
      <MatchEventsSection
        homeTeamName="KCVV Elewijt"
        awayTeamName="RC Mechelen"
        events={events}
      />,
    );
    expect(screen.getAllByText("K")).toHaveLength(2);
    expect(screen.getByText("R")).toBeInTheDocument();
  });

  it("threads explicit logo URLs to the row chips", () => {
    render(
      <MatchEventsSection
        homeTeamName="KCVV Elewijt"
        awayTeamName="RC Mechelen"
        homeTeamLogo="https://example.com/kcvv.png"
        awayTeamLogo="https://example.com/rc.png"
        events={[
          { id: 1, type: "goal", minute: 10, team: "home", player: "A" },
          { id: 2, type: "goal", minute: 20, team: "away", player: "B" },
        ]}
      />,
    );
    // The crests are decorative (#2559 rule 4) — the team is named in the row —
    // so they are matched on src rather than on an alt they no longer carry.
    const [home, away] = Array.from(document.querySelectorAll("img"));
    expect(home).toHaveAttribute("src", expect.stringContaining("kcvv.png"));
    expect(home).toHaveAttribute("alt", "");
    expect(away).toHaveAttribute("src", expect.stringContaining("rc.png"));
    expect(away).toHaveAttribute("alt", "");
  });
});
