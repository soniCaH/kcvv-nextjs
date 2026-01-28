/**
 * MatchStats Component Tests
 */

import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MatchStats, type MatchStatsData } from "./MatchStats";

describe("MatchStats", () => {
  const fullStats: MatchStatsData = {
    possession: { home: 58, away: 42 },
    shots: { home: 15, away: 8 },
    shotsOnTarget: { home: 7, away: 3 },
    corners: { home: 6, away: 4 },
    fouls: { home: 12, away: 15 },
    yellowCards: { home: 2, away: 3 },
    redCards: { home: 0, away: 1 },
  };

  const defaultProps = {
    homeTeamName: "KCVV Elewijt",
    awayTeamName: "KFC Turnhout",
    stats: fullStats,
  };

  describe("rendering", () => {
    it("renders team names", () => {
      render(<MatchStats {...defaultProps} />);
      expect(screen.getByText("KCVV Elewijt")).toBeInTheDocument();
      expect(screen.getByText("KFC Turnhout")).toBeInTheDocument();
    });

    it("renders stat labels in Dutch", () => {
      render(<MatchStats {...defaultProps} />);
      expect(screen.getByText("Balbezit")).toBeInTheDocument();
      expect(screen.getByText("Schoten")).toBeInTheDocument();
      expect(screen.getByText("Schoten op doel")).toBeInTheDocument();
      expect(screen.getByText("Hoekschoppen")).toBeInTheDocument();
      expect(screen.getByText("Overtredingen")).toBeInTheDocument();
      expect(screen.getByText("Gele kaarten")).toBeInTheDocument();
      expect(screen.getByText("Rode kaarten")).toBeInTheDocument();
    });

    it("renders stat values", () => {
      render(<MatchStats {...defaultProps} />);
      // Possession shown as percentage
      expect(screen.getByText("58%")).toBeInTheDocument();
      expect(screen.getByText("42%")).toBeInTheDocument();
      // Shots - "15" may appear multiple times
      const fifteens = screen.getAllByText("15");
      expect(fifteens.length).toBeGreaterThanOrEqual(1);
      // "8" appears multiple times (shots, shots on target partial match)
      const eights = screen.getAllByText("8");
      expect(eights.length).toBeGreaterThanOrEqual(1);
    });

    it("renders percentage stats with % sign", () => {
      render(<MatchStats {...defaultProps} />);
      expect(screen.getByText("58%")).toBeInTheDocument();
      expect(screen.getByText("42%")).toBeInTheDocument();
    });

    it("renders comparison bars", () => {
      const { container } = render(<MatchStats {...defaultProps} />);
      // Each stat row should have a bar container
      const bars = container.querySelectorAll(".h-2.rounded-full");
      expect(bars.length).toBeGreaterThan(0);
    });
  });

  describe("highlighting", () => {
    it("highlights higher home value with green", () => {
      const { container } = render(
        <MatchStats
          {...defaultProps}
          stats={{ possession: { home: 60, away: 40 } }}
        />,
      );
      const greenBar = container.querySelector(".bg-kcvv-green-bright");
      expect(greenBar).toBeInTheDocument();
    });

    it("highlights winning stat values", () => {
      render(
        <MatchStats
          {...defaultProps}
          stats={{ shots: { home: 15, away: 5 } }}
        />,
      );
      const homeValue = screen.getByText("15");
      expect(homeValue).toHaveClass("font-bold");
    });

    it("handles even stats correctly", () => {
      render(
        <MatchStats
          {...defaultProps}
          stats={{ possession: { home: 50, away: 50 } }}
        />,
      );
      // Both values should be gray when even
      const fifties = screen.getAllByText("50%");
      expect(fifties).toHaveLength(2);
      fifties.forEach((el) => {
        expect(el).toHaveClass("text-gray-700");
      });
    });

    it("inversed stats (fouls) - lower is better", () => {
      // When home has fewer fouls, home should be highlighted as winning
      const { container } = render(
        <MatchStats
          {...defaultProps}
          stats={{ fouls: { home: 8, away: 15 } }}
        />,
      );
      // Home should have green bar since fewer fouls is better
      const greenBar = container.querySelector(".bg-kcvv-green-bright");
      expect(greenBar).toBeInTheDocument();
    });
  });

  describe("minimal variant", () => {
    it("only shows key stats in minimal variant", () => {
      render(<MatchStats {...defaultProps} variant="minimal" />);
      // Should show possession, shots, shots on target
      expect(screen.getByText("Balbezit")).toBeInTheDocument();
      expect(screen.getByText("Schoten")).toBeInTheDocument();
      expect(screen.getByText("Schoten op doel")).toBeInTheDocument();
      // Should not show corners, fouls, etc.
      expect(screen.queryByText("Hoekschoppen")).not.toBeInTheDocument();
      expect(screen.queryByText("Overtredingen")).not.toBeInTheDocument();
    });
  });

  describe("empty state", () => {
    it("shows message when no stats available", () => {
      render(
        <MatchStats
          homeTeamName="KCVV Elewijt"
          awayTeamName="KFC Turnhout"
          stats={{}}
        />,
      );
      expect(
        screen.getByText("Geen statistieken beschikbaar voor deze wedstrijd."),
      ).toBeInTheDocument();
    });
  });

  describe("loading state", () => {
    it("renders skeleton when loading", () => {
      const { container } = render(<MatchStats {...defaultProps} isLoading />);
      expect(
        container.querySelectorAll(".animate-pulse").length,
      ).toBeGreaterThan(0);
    });

    it("does not render stats when loading", () => {
      render(<MatchStats {...defaultProps} isLoading />);
      expect(screen.queryByText("Balbezit")).not.toBeInTheDocument();
    });
  });

  describe("className prop", () => {
    it("applies custom className", () => {
      const { container } = render(
        <MatchStats {...defaultProps} className="custom-class" />,
      );
      expect(container.firstChild).toHaveClass("custom-class");
    });
  });

  describe("partial stats", () => {
    it("only renders available stats", () => {
      render(
        <MatchStats
          {...defaultProps}
          stats={{
            possession: { home: 55, away: 45 },
            shots: { home: 10, away: 8 },
          }}
        />,
      );
      expect(screen.getByText("Balbezit")).toBeInTheDocument();
      expect(screen.getByText("Schoten")).toBeInTheDocument();
      expect(screen.queryByText("Hoekschoppen")).not.toBeInTheDocument();
    });
  });
});
