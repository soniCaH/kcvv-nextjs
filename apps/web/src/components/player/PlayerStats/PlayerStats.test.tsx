/**
 * PlayerStats Component Tests
 */

import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import {
  PlayerStats,
  type OutfieldStats,
  type GoalkeeperStats,
} from "./PlayerStats";

const mockOutfieldStats: OutfieldStats[] = [
  {
    season: "2024-2025",
    matches: 18,
    goals: 5,
    assists: 8,
    yellowCards: 2,
    redCards: 0,
    minutesPlayed: 1520,
  },
  {
    season: "2023-2024",
    matches: 28,
    goals: 12,
    assists: 10,
    yellowCards: 4,
    redCards: 1,
    minutesPlayed: 2340,
  },
];

const mockGoalkeeperStats: GoalkeeperStats[] = [
  {
    season: "2024-2025",
    matches: 22,
    cleanSheets: 8,
    goalsConceded: 18,
    saves: 72,
    yellowCards: 1,
    redCards: 0,
    minutesPlayed: 1980,
  },
];

describe("PlayerStats", () => {
  describe("rendering", () => {
    it("renders section heading", () => {
      render(<PlayerStats position="outfield" stats={mockOutfieldStats} />);

      expect(screen.getByText("Statistieken")).toBeInTheDocument();
    });

    it("renders outfield stats table", () => {
      render(<PlayerStats position="outfield" stats={mockOutfieldStats} />);

      expect(screen.getByRole("table")).toBeInTheDocument();
    });

    it("renders goalkeeper stats table", () => {
      render(<PlayerStats position="goalkeeper" stats={mockGoalkeeperStats} />);

      expect(screen.getByRole("table")).toBeInTheDocument();
    });
  });

  describe("outfield player stats", () => {
    it("displays season column", () => {
      render(<PlayerStats position="outfield" stats={mockOutfieldStats} />);

      expect(screen.getByText("2024-2025")).toBeInTheDocument();
      expect(screen.getByText("2023-2024")).toBeInTheDocument();
    });

    it("displays matches column", () => {
      render(<PlayerStats position="outfield" stats={mockOutfieldStats} />);

      expect(screen.getByText("18")).toBeInTheDocument();
      expect(screen.getByText("28")).toBeInTheDocument();
    });

    it("displays goals column", () => {
      render(<PlayerStats position="outfield" stats={mockOutfieldStats} />);

      expect(screen.getByText("5")).toBeInTheDocument();
      expect(screen.getByText("12")).toBeInTheDocument();
    });

    it("displays assists column", () => {
      render(<PlayerStats position="outfield" stats={mockOutfieldStats} />);

      expect(screen.getByText("8")).toBeInTheDocument();
      expect(screen.getByText("10")).toBeInTheDocument();
    });

    it("displays card columns", () => {
      render(<PlayerStats position="outfield" stats={mockOutfieldStats} />);

      // Yellow cards
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("4")).toBeInTheDocument();
      // Red cards
      expect(screen.getByText("1")).toBeInTheDocument();
    });

    it("formats minutes played correctly", () => {
      render(<PlayerStats position="outfield" stats={mockOutfieldStats} />);

      // 1520 minutes = 25u 20m
      expect(screen.getByText("25u 20m")).toBeInTheDocument();
      // 2340 minutes = 39u
      expect(screen.getByText("39u")).toBeInTheDocument();
    });
  });

  describe("goalkeeper stats", () => {
    it("displays clean sheets column", () => {
      render(<PlayerStats position="goalkeeper" stats={mockGoalkeeperStats} />);

      expect(screen.getByText("8")).toBeInTheDocument();
    });

    it("displays goals conceded column", () => {
      render(<PlayerStats position="goalkeeper" stats={mockGoalkeeperStats} />);

      expect(screen.getByText("18")).toBeInTheDocument();
    });

    it("displays saves column", () => {
      render(<PlayerStats position="goalkeeper" stats={mockGoalkeeperStats} />);

      expect(screen.getByText("72")).toBeInTheDocument();
    });

    it("has goalkeeper-specific headers", () => {
      render(<PlayerStats position="goalkeeper" stats={mockGoalkeeperStats} />);

      expect(screen.getByText("Clean sheets")).toBeInTheDocument();
      expect(screen.getByText("Tegendoelpunten")).toBeInTheDocument();
      expect(screen.getByText("Reddingen")).toBeInTheDocument();
    });
  });

  describe("empty state", () => {
    it("renders empty message when no stats", () => {
      render(<PlayerStats position="outfield" stats={[]} />);

      expect(
        screen.getByText("Geen statistieken beschikbaar."),
      ).toBeInTheDocument();
    });

    it("still renders section heading in empty state", () => {
      render(<PlayerStats position="outfield" stats={[]} />);

      expect(screen.getByText("Statistieken")).toBeInTheDocument();
    });

    it("does not render table in empty state", () => {
      render(<PlayerStats position="outfield" stats={[]} />);

      expect(screen.queryByRole("table")).not.toBeInTheDocument();
    });
  });

  describe("loading state", () => {
    it("renders loading skeleton when isLoading is true", () => {
      render(<PlayerStats position="outfield" stats={[]} isLoading />);

      expect(
        screen.getByLabelText("Statistieken laden..."),
      ).toBeInTheDocument();
    });

    it("does not render table in loading state", () => {
      render(
        <PlayerStats position="outfield" stats={mockOutfieldStats} isLoading />,
      );

      expect(screen.queryByRole("table")).not.toBeInTheDocument();
    });

    it("shows skeleton placeholders", () => {
      render(<PlayerStats position="outfield" stats={[]} isLoading />);

      expect(screen.getByTestId("stats-skeleton-header")).toBeInTheDocument();
      expect(screen.getAllByTestId("stats-skeleton-row")).toHaveLength(3);
    });
  });

  describe("accessibility", () => {
    it("uses semantic table for stats", () => {
      render(<PlayerStats position="outfield" stats={mockOutfieldStats} />);

      expect(screen.getByRole("table")).toBeInTheDocument();
      expect(screen.getAllByRole("row").length).toBeGreaterThan(1);
    });

    it("has accessible labels for card indicators", () => {
      render(<PlayerStats position="outfield" stats={mockOutfieldStats} />);

      expect(screen.getByLabelText("Gele kaarten")).toBeInTheDocument();
      expect(screen.getByLabelText("Rode kaarten")).toBeInTheDocument();
    });

    it("has table headers for each column", () => {
      render(<PlayerStats position="outfield" stats={mockOutfieldStats} />);

      const headers = screen.getAllByRole("columnheader");
      expect(headers.length).toBeGreaterThan(0);
    });
  });

  describe("ref forwarding", () => {
    it("forwards ref to the root element", () => {
      const ref = { current: null };
      render(
        <PlayerStats position="outfield" stats={mockOutfieldStats} ref={ref} />,
      );

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("forwards ref in loading state", () => {
      const ref = { current: null };
      render(
        <PlayerStats position="outfield" stats={[]} isLoading ref={ref} />,
      );

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("forwards ref in empty state", () => {
      const ref = { current: null };
      render(<PlayerStats position="outfield" stats={[]} ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe("className merging", () => {
    it("applies custom className to root element", () => {
      const { container } = render(
        <PlayerStats
          position="outfield"
          stats={mockOutfieldStats}
          className="custom-class"
        />,
      );

      expect(container.firstChild).toHaveClass("custom-class");
    });

    it("applies custom className in loading state", () => {
      const { container } = render(
        <PlayerStats
          position="outfield"
          stats={[]}
          isLoading
          className="custom-class"
        />,
      );

      expect(container.firstChild).toHaveClass("custom-class");
    });
  });

  describe("minutes formatting", () => {
    it("formats minutes less than an hour", () => {
      const stats: OutfieldStats[] = [
        {
          season: "2024-2025",
          matches: 1,
          goals: 0,
          assists: 0,
          yellowCards: 0,
          redCards: 0,
          minutesPlayed: 45,
        },
      ];
      render(<PlayerStats position="outfield" stats={stats} />);

      expect(screen.getByText("45m")).toBeInTheDocument();
    });

    it("formats exact hours without minutes", () => {
      const stats: OutfieldStats[] = [
        {
          season: "2024-2025",
          matches: 1,
          goals: 0,
          assists: 0,
          yellowCards: 0,
          redCards: 0,
          minutesPlayed: 120,
        },
      ];
      render(<PlayerStats position="outfield" stats={stats} />);

      expect(screen.getByText("2u")).toBeInTheDocument();
    });
  });
});
