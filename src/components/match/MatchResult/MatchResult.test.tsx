/**
 * MatchResult Component Tests
 */

import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MatchResult } from "./MatchResult";

// Mock next/image
vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string }) => (
    <img src={src} alt={alt} {...props} />
  ),
}));

// Mock next/link
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    className,
  }: {
    children: React.ReactNode;
    href: string;
    className?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

describe("MatchResult", () => {
  const kcvv = { id: 1235, name: "KCVV Elewijt", logo: "/logo1.png" };
  const opponent = { id: 59, name: "KFC Turnhout", logo: "/logo2.png" };

  const defaultProps = {
    homeTeam: kcvv,
    awayTeam: opponent,
    homeScore: 3,
    awayScore: 1,
    date: "2024-02-15",
    kcvvTeamId: 1235,
  };

  describe("rendering", () => {
    it("renders team names", () => {
      render(<MatchResult {...defaultProps} />);
      expect(screen.getByText("KCVV Elewijt")).toBeInTheDocument();
      expect(screen.getByText("KFC Turnhout")).toBeInTheDocument();
    });

    it("renders score", () => {
      const { container } = render(<MatchResult {...defaultProps} />);
      // Find the score container with font-mono class for precise matching
      const scoreContainer = container.querySelector(".font-mono.font-bold");
      expect(scoreContainer).toBeInTheDocument();
      expect(scoreContainer?.textContent).toContain("3");
      expect(scoreContainer?.textContent).toContain("1");
    });

    it("renders date in Dutch format", () => {
      render(<MatchResult {...defaultProps} />);
      // Should show "15 feb" in Dutch
      expect(screen.getByText(/feb/i)).toBeInTheDocument();
    });

    it("renders team logos", () => {
      render(<MatchResult {...defaultProps} />);
      const images = screen.getAllByRole("img");
      expect(images).toHaveLength(2);
      expect(images[0]).toHaveAttribute("alt", "KCVV Elewijt logo");
      expect(images[1]).toHaveAttribute("alt", "KFC Turnhout logo");
    });

    it("renders placeholder when no logo", () => {
      render(
        <MatchResult
          {...defaultProps}
          homeTeam={{ id: 1, name: "Ajax FC" }}
          awayTeam={{ id: 2, name: "Brugge FC" }}
        />,
      );
      expect(screen.getByText("A")).toBeInTheDocument(); // Ajax FC first letter
      expect(screen.getByText("B")).toBeInTheDocument(); // Brugge FC first letter
    });

    it("renders competition when provided", () => {
      render(<MatchResult {...defaultProps} competition="3de Nationale" />);
      expect(screen.getByText("3de Nationale")).toBeInTheDocument();
    });
  });

  describe("result indicator", () => {
    it("shows green indicator for win", () => {
      const { container } = render(
        <MatchResult {...defaultProps} homeScore={3} awayScore={1} />,
      );
      const indicator = container.querySelector(".bg-green-500");
      expect(indicator).toBeInTheDocument();
    });

    it("shows yellow indicator for draw", () => {
      const { container } = render(
        <MatchResult {...defaultProps} homeScore={2} awayScore={2} />,
      );
      const indicator = container.querySelector(".bg-yellow-500");
      expect(indicator).toBeInTheDocument();
    });

    it("shows red indicator for loss", () => {
      const { container } = render(
        <MatchResult {...defaultProps} homeScore={0} awayScore={2} />,
      );
      const indicator = container.querySelector(".bg-red-500");
      expect(indicator).toBeInTheDocument();
    });

    it("shows gray indicator when no kcvvTeamId", () => {
      const { container } = render(
        <MatchResult
          homeTeam={kcvv}
          awayTeam={opponent}
          homeScore={3}
          awayScore={1}
          date="2024-02-15"
        />,
      );
      const indicator = container.querySelector(".bg-gray-300");
      expect(indicator).toBeInTheDocument();
    });

    it("correctly identifies away win", () => {
      const { container } = render(
        <MatchResult
          homeTeam={opponent}
          awayTeam={kcvv}
          homeScore={1}
          awayScore={4}
          date="2024-02-15"
          kcvvTeamId={1235}
        />,
      );
      const indicator = container.querySelector(".bg-green-500");
      expect(indicator).toBeInTheDocument();
    });

    it("correctly identifies away loss", () => {
      const { container } = render(
        <MatchResult
          homeTeam={opponent}
          awayTeam={kcvv}
          homeScore={3}
          awayScore={0}
          date="2024-02-15"
          kcvvTeamId={1235}
        />,
      );
      const indicator = container.querySelector(".bg-red-500");
      expect(indicator).toBeInTheDocument();
    });
  });

  describe("team highlighting", () => {
    it("highlights KCVV team name when home", () => {
      render(<MatchResult {...defaultProps} />);
      const kcvvText = screen.getByText("KCVV Elewijt");
      expect(kcvvText).toHaveClass("font-semibold");
    });

    it("highlights KCVV team name when away", () => {
      render(
        <MatchResult
          homeTeam={opponent}
          awayTeam={kcvv}
          homeScore={1}
          awayScore={3}
          date="2024-02-15"
          kcvvTeamId={1235}
        />,
      );
      const kcvvText = screen.getByText("KCVV Elewijt");
      expect(kcvvText).toHaveClass("font-semibold");
    });
  });

  describe("link behavior", () => {
    it("renders as link when href is provided", () => {
      render(<MatchResult {...defaultProps} href="/game/123" />);
      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "/game/123");
    });

    it("renders as div when no href", () => {
      render(<MatchResult {...defaultProps} />);
      expect(screen.queryByRole("link")).not.toBeInTheDocument();
    });
  });

  describe("loading state", () => {
    it("renders skeleton when loading", () => {
      const { container } = render(<MatchResult {...defaultProps} isLoading />);
      expect(
        container.querySelectorAll(".animate-pulse").length,
      ).toBeGreaterThan(0);
    });

    it("does not render team names when loading", () => {
      render(<MatchResult {...defaultProps} isLoading />);
      expect(screen.queryByText("KCVV Elewijt")).not.toBeInTheDocument();
    });
  });

  describe("className prop", () => {
    it("applies custom className", () => {
      const { container } = render(
        <MatchResult {...defaultProps} className="custom-class" />,
      );
      expect(container.firstChild).toHaveClass("custom-class");
    });
  });

  describe("score highlighting", () => {
    it("highlights winning score in green for home win", () => {
      const { container } = render(
        <MatchResult {...defaultProps} homeScore={3} awayScore={1} />,
      );
      const greenScores = container.querySelectorAll(".text-green-600");
      expect(greenScores.length).toBeGreaterThan(0);
    });

    it("highlights winning score in green for away win", () => {
      const { container } = render(
        <MatchResult
          homeTeam={opponent}
          awayTeam={kcvv}
          homeScore={1}
          awayScore={3}
          date="2024-02-15"
          kcvvTeamId={1235}
        />,
      );
      const greenScores = container.querySelectorAll(".text-green-600");
      expect(greenScores.length).toBeGreaterThan(0);
    });
  });

  describe("date formatting edge cases", () => {
    it("handles empty date string", () => {
      render(<MatchResult {...defaultProps} date="" />);
      // Should not crash with empty date
      expect(screen.getByText("KCVV Elewijt")).toBeInTheDocument();
    });
  });
});
