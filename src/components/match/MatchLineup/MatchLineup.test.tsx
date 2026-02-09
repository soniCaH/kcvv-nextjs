/**
 * MatchLineup Component Tests
 */

import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MatchLineup, type LineupPlayer } from "./MatchLineup";

describe("MatchLineup", () => {
  const mockHomeLineup: LineupPlayer[] = [
    {
      id: 1,
      name: "Player One",
      number: 1,
      isCaptain: false,
      status: "starter",
    },
    {
      id: 2,
      name: "Player Two",
      number: 10,
      isCaptain: true,
      status: "starter",
    },
    {
      id: 3,
      name: "Player Three",
      number: 9,
      minutesPlayed: 75,
      isCaptain: false,
      status: "substituted",
    },
    {
      id: 4,
      name: "Sub One",
      number: 12,
      isCaptain: false,
      status: "substitute",
    },
  ];

  const mockAwayLineup: LineupPlayer[] = [
    {
      id: 101,
      name: "Away Player One",
      number: 1,
      isCaptain: true,
      status: "starter",
    },
    {
      id: 102,
      name: "Away Player Two",
      number: 7,
      isCaptain: false,
      status: "starter",
    },
  ];

  const defaultProps = {
    homeTeamName: "KCVV Elewijt",
    awayTeamName: "KFC Turnhout",
    homeLineup: mockHomeLineup,
    awayLineup: mockAwayLineup,
  };

  describe("rendering", () => {
    it("renders title", () => {
      render(<MatchLineup {...defaultProps} />);
      expect(screen.getByText("Opstellingen")).toBeInTheDocument();
    });

    it("renders team names", () => {
      render(<MatchLineup {...defaultProps} />);
      expect(screen.getByText("KCVV Elewijt")).toBeInTheDocument();
      expect(screen.getByText("KFC Turnhout")).toBeInTheDocument();
    });

    it("renders player names", () => {
      render(<MatchLineup {...defaultProps} />);
      expect(screen.getByText("Player One")).toBeInTheDocument();
      expect(screen.getByText("Player Two")).toBeInTheDocument();
      expect(screen.getByText("Away Player One")).toBeInTheDocument();
    });

    it("renders jersey numbers", () => {
      render(<MatchLineup {...defaultProps} />);
      // Both teams have player #1, so we check for multiple
      const onesElements = screen.getAllByText("1");
      expect(onesElements.length).toBeGreaterThanOrEqual(2);
      expect(screen.getByText("10")).toBeInTheDocument();
      expect(screen.getByText("7")).toBeInTheDocument();
    });
  });

  describe("player grouping", () => {
    it("groups starters and substitutes separately", () => {
      render(<MatchLineup {...defaultProps} />);
      // Both teams have "Basiself" sections, home team also has "Invallers"
      const basiselfSections = screen.getAllByText(/Basiself/);
      expect(basiselfSections.length).toBeGreaterThanOrEqual(2); // Both teams
      const invallersSections = screen.getAllByText(/Invallers/);
      expect(invallersSections.length).toBeGreaterThanOrEqual(1); // Home team has substitutes
    });

    it("shows correct count in section headers", () => {
      render(<MatchLineup {...defaultProps} />);
      // Home team has 3 starters (including substituted) and 1 substitute
      expect(screen.getByText("Basiself (3)")).toBeInTheDocument();
      expect(screen.getByText("Invallers (1)")).toBeInTheDocument();
      // Away team has 2 starters
      expect(screen.getByText("Basiself (2)")).toBeInTheDocument();
    });

    it("includes substituted players in starters section", () => {
      render(<MatchLineup {...defaultProps} />);
      expect(screen.getByText("Player Three")).toBeInTheDocument();
    });
  });

  describe("captain indicator", () => {
    it("shows (C) for captain", () => {
      render(<MatchLineup {...defaultProps} />);
      const captainIndicators = screen.getAllByText("(C)");
      expect(captainIndicators).toHaveLength(2); // One for each team captain
    });
  });

  describe("substituted players", () => {
    it("shows minutes played for substituted players", () => {
      render(<MatchLineup {...defaultProps} />);
      expect(screen.getByText("75'")).toBeInTheDocument();
    });

    it("shows down arrow icon for substituted players", () => {
      render(<MatchLineup {...defaultProps} />);
      expect(screen.getByLabelText("Gewisseld")).toBeInTheDocument();
    });
  });

  describe("subbed_in players", () => {
    it("shows up arrow icon for players who came on", () => {
      const lineupWithSubbedIn: LineupPlayer[] = [
        {
          id: 1,
          name: "Starter",
          number: 1,
          isCaptain: false,
          status: "starter",
        },
        {
          id: 2,
          name: "Came On",
          number: 12,
          minutesPlayed: 30,
          isCaptain: false,
          status: "subbed_in",
        },
      ];
      render(<MatchLineup {...defaultProps} homeLineup={lineupWithSubbedIn} />);
      expect(screen.getByLabelText("Ingevallen")).toBeInTheDocument();
    });

    it("shows minutes played for players who came on", () => {
      const lineupWithSubbedIn: LineupPlayer[] = [
        {
          id: 1,
          name: "Starter",
          number: 1,
          isCaptain: false,
          status: "starter",
        },
        {
          id: 2,
          name: "Came On",
          number: 12,
          minutesPlayed: 30,
          isCaptain: false,
          status: "subbed_in",
        },
      ];
      render(<MatchLineup {...defaultProps} homeLineup={lineupWithSubbedIn} />);
      expect(screen.getByText("30'")).toBeInTheDocument();
    });

    it("groups subbed_in players in substitutes section", () => {
      const lineupWithSubbedIn: LineupPlayer[] = [
        {
          id: 1,
          name: "Starter",
          number: 1,
          isCaptain: false,
          status: "starter",
        },
        {
          id: 2,
          name: "Came On",
          number: 12,
          isCaptain: false,
          status: "subbed_in",
        },
        {
          id: 3,
          name: "Unused Sub",
          number: 13,
          isCaptain: false,
          status: "substitute",
        },
      ];
      render(<MatchLineup {...defaultProps} homeLineup={lineupWithSubbedIn} />);
      // Should have 1 starter and 2 substitutes (subbed_in + substitute)
      expect(screen.getByText("Basiself (1)")).toBeInTheDocument();
      expect(screen.getByText("Invallers (2)")).toBeInTheDocument();
    });
  });

  describe("unknown status players", () => {
    it("groups unknown status players in substitutes section", () => {
      const lineupWithUnknown: LineupPlayer[] = [
        {
          id: 1,
          name: "Starter",
          number: 1,
          isCaptain: false,
          status: "starter",
        },
        {
          id: 2,
          name: "Unknown Player",
          number: 99,
          isCaptain: false,
          status: "unknown",
        },
      ];
      render(<MatchLineup {...defaultProps} homeLineup={lineupWithUnknown} />);
      // Should have 1 starter and 1 substitute (unknown)
      expect(screen.getByText("Basiself (1)")).toBeInTheDocument();
      expect(screen.getByText("Invallers (1)")).toBeInTheDocument();
      expect(screen.getByText("Unknown Player")).toBeInTheDocument();
    });
  });

  describe("empty lineups", () => {
    it("shows message when both lineups are empty", () => {
      render(<MatchLineup {...defaultProps} homeLineup={[]} awayLineup={[]} />);
      expect(
        screen.getByText("Geen opstellingen beschikbaar voor deze wedstrijd."),
      ).toBeInTheDocument();
    });

    it("shows message for empty team lineup", () => {
      render(<MatchLineup {...defaultProps} homeLineup={[]} />);
      expect(
        screen.getByText("Geen opstelling beschikbaar"),
      ).toBeInTheDocument();
    });
  });

  describe("loading state", () => {
    it("renders skeleton when loading", () => {
      const { container } = render(<MatchLineup {...defaultProps} isLoading />);
      expect(
        container.querySelectorAll(".animate-pulse").length,
      ).toBeGreaterThan(0);
    });

    it("does not render player names when loading", () => {
      render(<MatchLineup {...defaultProps} isLoading />);
      expect(screen.queryByText("Player One")).not.toBeInTheDocument();
    });
  });

  describe("minimal data", () => {
    it("renders players without jersey numbers", () => {
      const minimalLineup: LineupPlayer[] = [
        { name: "No Number Player", isCaptain: false, status: "starter" },
      ];
      render(<MatchLineup {...defaultProps} homeLineup={minimalLineup} />);
      expect(screen.getByText("No Number Player")).toBeInTheDocument();
    });

    it("renders players without id using index-based key", () => {
      const noIdLineup: LineupPlayer[] = [
        { name: "Player A", number: 1, isCaptain: false, status: "starter" },
        { name: "Player B", number: 2, isCaptain: false, status: "starter" },
      ];
      render(<MatchLineup {...defaultProps} homeLineup={noIdLineup} />);
      expect(screen.getByText("Player A")).toBeInTheDocument();
      expect(screen.getByText("Player B")).toBeInTheDocument();
    });
  });

  describe("custom className", () => {
    it("applies custom className", () => {
      const { container } = render(
        <MatchLineup {...defaultProps} className="custom-class" />,
      );
      expect(container.firstChild).toHaveClass("custom-class");
    });
  });

  describe("styling", () => {
    it("applies different styling for home and away teams", () => {
      const { container } = render(<MatchLineup {...defaultProps} />);
      // Home team should have green-tinted background
      expect(
        container.querySelector(".bg-kcvv-green-bright\\/5"),
      ).toBeInTheDocument();
      // Away team should have gray background
      expect(container.querySelector(".bg-gray-50")).toBeInTheDocument();
    });
  });

  describe("card indicators", () => {
    it("shows yellow card icon for players with yellow card", () => {
      const lineupWithYellowCard: LineupPlayer[] = [
        {
          id: 1,
          name: "Yellow Card Player",
          number: 5,
          isCaptain: false,
          status: "starter",
          card: "yellow",
        },
      ];
      render(
        <MatchLineup {...defaultProps} homeLineup={lineupWithYellowCard} />,
      );
      expect(screen.getByLabelText("Gele kaart")).toBeInTheDocument();
    });

    it("shows red card icon for players with red card", () => {
      const lineupWithRedCard: LineupPlayer[] = [
        {
          id: 1,
          name: "Red Card Player",
          number: 8,
          isCaptain: false,
          status: "starter",
          card: "red",
        },
      ];
      render(<MatchLineup {...defaultProps} homeLineup={lineupWithRedCard} />);
      expect(screen.getByLabelText("Rode kaart")).toBeInTheDocument();
    });

    it("shows double yellow (yellow-red) card icon for players with second yellow", () => {
      const lineupWithDoubleYellow: LineupPlayer[] = [
        {
          id: 1,
          name: "Double Yellow Player",
          number: 3,
          isCaptain: false,
          status: "starter",
          card: "double_yellow",
        },
      ];
      render(
        <MatchLineup {...defaultProps} homeLineup={lineupWithDoubleYellow} />,
      );
      expect(screen.getByLabelText("Tweede gele kaart")).toBeInTheDocument();
    });

    it("shows card icon alongside captain indicator", () => {
      const lineupWithCardAndCaptain: LineupPlayer[] = [
        {
          id: 1,
          name: "Captain Yellow",
          number: 10,
          isCaptain: true,
          status: "starter",
          card: "yellow",
        },
      ];
      render(
        <MatchLineup
          {...defaultProps}
          homeLineup={lineupWithCardAndCaptain}
          awayLineup={[]}
        />,
      );
      expect(screen.getByText("(C)")).toBeInTheDocument();
      expect(screen.getByLabelText("Gele kaart")).toBeInTheDocument();
    });

    it("shows card icon for substituted players", () => {
      const lineupWithSubstitutedCard: LineupPlayer[] = [
        {
          id: 1,
          name: "Carded Sub",
          number: 9,
          minutesPlayed: 60,
          isCaptain: false,
          status: "substituted",
          card: "yellow",
        },
      ];
      render(
        <MatchLineup
          {...defaultProps}
          homeLineup={lineupWithSubstitutedCard}
        />,
      );
      expect(screen.getByLabelText("Gewisseld")).toBeInTheDocument();
      expect(screen.getByLabelText("Gele kaart")).toBeInTheDocument();
      expect(screen.getByText("60'")).toBeInTheDocument();
    });

    it("does not show card icon when player has no card", () => {
      const lineupWithoutCard: LineupPlayer[] = [
        {
          id: 1,
          name: "No Card Player",
          number: 11,
          isCaptain: false,
          status: "starter",
        },
      ];
      render(<MatchLineup {...defaultProps} homeLineup={lineupWithoutCard} />);
      expect(screen.queryByLabelText("Gele kaart")).not.toBeInTheDocument();
      expect(screen.queryByLabelText("Rode kaart")).not.toBeInTheDocument();
      expect(
        screen.queryByLabelText("Tweede gele kaart"),
      ).not.toBeInTheDocument();
    });

    it("shows multiple different card types in same lineup", () => {
      const lineupWithMultipleCards: LineupPlayer[] = [
        {
          id: 1,
          name: "Yellow Player",
          number: 5,
          isCaptain: false,
          status: "starter",
          card: "yellow",
        },
        {
          id: 2,
          name: "Red Player",
          number: 8,
          isCaptain: false,
          status: "starter",
          card: "red",
        },
        {
          id: 3,
          name: "Double Yellow Player",
          number: 3,
          isCaptain: false,
          status: "starter",
          card: "double_yellow",
        },
      ];
      render(
        <MatchLineup {...defaultProps} homeLineup={lineupWithMultipleCards} />,
      );
      expect(screen.getByLabelText("Gele kaart")).toBeInTheDocument();
      expect(screen.getByLabelText("Rode kaart")).toBeInTheDocument();
      expect(screen.getByLabelText("Tweede gele kaart")).toBeInTheDocument();
    });

    it("handles invalid card type gracefully", () => {
      // Test the exhaustiveness check in CardIcon by using type assertion
      // This tests the defensive default case that should never be reached in normal usage
      const lineupWithInvalidCard: LineupPlayer[] = [
        {
          id: 1,
          name: "Invalid Card Player",
          number: 7,
          isCaptain: false,
          status: "starter",
          // @ts-expect-error - Intentionally testing invalid card type for exhaustiveness check
          card: "invalid",
        },
      ];
      // Component should render without crashing even with invalid card type
      render(
        <MatchLineup {...defaultProps} homeLineup={lineupWithInvalidCard} />,
      );
      expect(screen.getByText("Invalid Card Player")).toBeInTheDocument();
    });
  });
});
