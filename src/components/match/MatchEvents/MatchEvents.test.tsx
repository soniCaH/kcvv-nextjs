/**
 * MatchEvents Component Tests
 */

import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MatchEvents, type MatchEvent } from "./MatchEvents";

describe("MatchEvents", () => {
  const events: MatchEvent[] = [
    {
      id: 1,
      type: "goal",
      minute: 12,
      team: "home",
      player: "Jonas Vermeersch",
      assist: "Pieter Janssen",
    },
    {
      id: 2,
      type: "yellow_card",
      minute: 23,
      team: "away",
      player: "Marc Declercq",
    },
    {
      id: 3,
      type: "substitution",
      minute: 45,
      team: "home",
      playerIn: "Kevin Mertens",
      playerOut: "Thomas Peeters",
    },
    {
      id: 4,
      type: "goal",
      minute: 67,
      team: "away",
      player: "Yannick Hermans",
    },
    {
      id: 5,
      type: "red_card",
      minute: 78,
      team: "away",
      player: "Marc Declercq",
    },
  ];

  const defaultProps = {
    homeTeamName: "KCVV Elewijt",
    awayTeamName: "KFC Turnhout",
    events,
  };

  describe("rendering", () => {
    it("renders player names", () => {
      render(<MatchEvents {...defaultProps} />);
      expect(screen.getByText("Jonas Vermeersch")).toBeInTheDocument();
      expect(screen.getByText("Yannick Hermans")).toBeInTheDocument();
    });

    it("renders event minutes", () => {
      render(<MatchEvents {...defaultProps} />);
      expect(screen.getByText("12'")).toBeInTheDocument();
      expect(screen.getByText("23'")).toBeInTheDocument();
      expect(screen.getByText("45'")).toBeInTheDocument();
    });

    it("renders assist info for goals", () => {
      render(<MatchEvents {...defaultProps} />);
      expect(screen.getByText(/Pieter Janssen/)).toBeInTheDocument();
    });

    it("renders substitution players", () => {
      render(<MatchEvents {...defaultProps} />);
      expect(screen.getByText("Kevin Mertens")).toBeInTheDocument();
      expect(screen.getByText("Thomas Peeters")).toBeInTheDocument();
    });

    it("renders team names", () => {
      render(<MatchEvents {...defaultProps} />);
      // Team names appear next to each event
      const homeTeamMentions = screen.getAllByText("KCVV Elewijt");
      expect(homeTeamMentions.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("event icons", () => {
    it("shows icons by default", () => {
      render(<MatchEvents {...defaultProps} />);
      // Icons should have aria-labels (multiple goals exist)
      const goalIcons = screen.getAllByLabelText("Doelpunt");
      expect(goalIcons.length).toBeGreaterThan(0);
      expect(screen.getByLabelText("Gele kaart")).toBeInTheDocument();
      expect(screen.getByLabelText("Rode kaart")).toBeInTheDocument();
      expect(screen.getByLabelText("Wissel")).toBeInTheDocument();
    });

    it("hides icons when showIcons is false", () => {
      render(<MatchEvents {...defaultProps} showIcons={false} />);
      expect(screen.queryByLabelText("Doelpunt")).not.toBeInTheDocument();
    });
  });

  describe("filtering", () => {
    it("shows all events by default", () => {
      render(<MatchEvents {...defaultProps} />);
      expect(screen.getByText("Jonas Vermeersch")).toBeInTheDocument();
      expect(screen.getAllByText("Marc Declercq").length).toBe(2); // yellow and red card
      expect(screen.getByText("Kevin Mertens")).toBeInTheDocument();
    });

    it("filters to goals only", () => {
      render(<MatchEvents {...defaultProps} filter="goals" />);
      expect(screen.getByText("Jonas Vermeersch")).toBeInTheDocument();
      expect(screen.getByText("Yannick Hermans")).toBeInTheDocument();
      expect(screen.queryByText("Kevin Mertens")).not.toBeInTheDocument();
    });

    it("filters to cards only", () => {
      render(<MatchEvents {...defaultProps} filter="cards" />);
      // Marc Declercq has both yellow and red cards
      expect(screen.getAllByText("Marc Declercq").length).toBe(2);
      expect(screen.queryByText("Jonas Vermeersch")).not.toBeInTheDocument();
    });

    it("filters to substitutions only", () => {
      render(<MatchEvents {...defaultProps} filter="substitutions" />);
      expect(screen.getByText("Kevin Mertens")).toBeInTheDocument();
      expect(screen.getByText("Thomas Peeters")).toBeInTheDocument();
      expect(screen.queryByText("Jonas Vermeersch")).not.toBeInTheDocument();
    });
  });

  describe("grouping", () => {
    it("groups chronologically by default", () => {
      const { container } = render(<MatchEvents {...defaultProps} />);
      // Should have single list, not grid
      expect(container.querySelector(".grid")).not.toBeInTheDocument();
    });

    it("groups by team when specified", () => {
      const { container } = render(
        <MatchEvents {...defaultProps} groupBy="team" />,
      );
      // Should have grid layout
      expect(container.querySelector(".grid")).toBeInTheDocument();
      // Should show both team headers
      expect(screen.getByText("KCVV Elewijt")).toBeInTheDocument();
      expect(screen.getByText("KFC Turnhout")).toBeInTheDocument();
    });
  });

  describe("special events", () => {
    it("shows penalty indicator", () => {
      const penaltyEvents: MatchEvent[] = [
        {
          id: 1,
          type: "goal",
          minute: 45,
          team: "home",
          player: "Test Player",
          isPenalty: true,
        },
      ];
      render(<MatchEvents {...defaultProps} events={penaltyEvents} />);
      expect(screen.getByText("(pen)")).toBeInTheDocument();
    });

    it("shows own goal indicator", () => {
      const ownGoalEvents: MatchEvent[] = [
        {
          id: 1,
          type: "goal",
          minute: 45,
          team: "away",
          player: "Test Player",
          isOwnGoal: true,
        },
      ];
      render(<MatchEvents {...defaultProps} events={ownGoalEvents} />);
      expect(screen.getByText("(e.d.)")).toBeInTheDocument();
    });

    it("shows additional time", () => {
      const addTimeEvents: MatchEvent[] = [
        {
          id: 1,
          type: "goal",
          minute: 90,
          additionalTime: 3,
          team: "home",
          player: "Test Player",
        },
      ];
      render(<MatchEvents {...defaultProps} events={addTimeEvents} />);
      expect(screen.getByText("90+3'")).toBeInTheDocument();
    });
  });

  describe("empty state", () => {
    it("shows message when no events", () => {
      render(
        <MatchEvents
          homeTeamName="KCVV Elewijt"
          awayTeamName="KFC Turnhout"
          events={[]}
        />,
      );
      expect(
        screen.getByText("Nog geen gebeurtenissen in deze wedstrijd."),
      ).toBeInTheDocument();
    });
  });

  describe("loading state", () => {
    it("renders skeleton when loading", () => {
      const { container } = render(<MatchEvents {...defaultProps} isLoading />);
      expect(
        container.querySelectorAll(".animate-pulse").length,
      ).toBeGreaterThan(0);
    });

    it("does not render events when loading", () => {
      render(<MatchEvents {...defaultProps} isLoading />);
      expect(screen.queryByText("Jonas Vermeersch")).not.toBeInTheDocument();
    });
  });

  describe("className prop", () => {
    it("applies custom className", () => {
      const { container } = render(
        <MatchEvents {...defaultProps} className="custom-class" />,
      );
      expect(container.firstChild).toHaveClass("custom-class");
    });
  });

  describe("sorting", () => {
    it("sorts events by minute", () => {
      const unsortedEvents: MatchEvent[] = [
        { id: 1, type: "goal", minute: 67, team: "home", player: "Player C" },
        { id: 2, type: "goal", minute: 12, team: "away", player: "Player A" },
        { id: 3, type: "goal", minute: 45, team: "home", player: "Player B" },
      ];
      render(<MatchEvents {...defaultProps} events={unsortedEvents} />);
      // Get minute elements by their specific text content
      const minute12 = screen.getByText("12'");
      const minute45 = screen.getByText("45'");
      const minute67 = screen.getByText("67'");

      // Verify all minutes are present (order verified by DOM position)
      expect(minute12).toBeInTheDocument();
      expect(minute45).toBeInTheDocument();
      expect(minute67).toBeInTheDocument();

      // Verify order by checking that 12' comes before 45' which comes before 67'
      const allMinuteElements = screen.getAllByText(/^\d+'$/);
      expect(allMinuteElements[0]).toHaveTextContent("12'");
      expect(allMinuteElements[1]).toHaveTextContent("45'");
      expect(allMinuteElements[2]).toHaveTextContent("67'");
    });
  });
});
