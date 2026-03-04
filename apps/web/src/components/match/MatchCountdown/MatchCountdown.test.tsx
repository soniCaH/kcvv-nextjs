/**
 * MatchCountdown Component Tests
 */

import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { MatchCountdown } from "./MatchCountdown";

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

describe("MatchCountdown", () => {
  const baseDate = new Date("2024-02-15T15:00:00");

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-02-10T12:00:00"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const defaultProps = {
    matchDate: baseDate,
    homeTeam: "KCVV Elewijt",
    awayTeam: "KFC Turnhout",
    competition: "3de Nationale",
  };

  describe("rendering", () => {
    it("renders team names", () => {
      render(<MatchCountdown {...defaultProps} />);
      expect(screen.getByText("KCVV Elewijt")).toBeInTheDocument();
      expect(screen.getByText("KFC Turnhout")).toBeInTheDocument();
    });

    it("renders competition", () => {
      render(<MatchCountdown {...defaultProps} />);
      expect(screen.getByText("3de Nationale")).toBeInTheDocument();
    });

    it("renders vs separator", () => {
      render(<MatchCountdown {...defaultProps} />);
      expect(screen.getByText("vs")).toBeInTheDocument();
    });

    it("renders countdown boxes", () => {
      render(<MatchCountdown {...defaultProps} />);
      expect(screen.getByText("dagen")).toBeInTheDocument();
      expect(screen.getByText("uur")).toBeInTheDocument();
      expect(screen.getByText("min")).toBeInTheDocument();
    });

    it("renders formatted match date", () => {
      render(<MatchCountdown {...defaultProps} />);
      // Should contain the date in Dutch format
      expect(screen.getByText(/februari/i)).toBeInTheDocument();
    });
  });

  describe("countdown calculation", () => {
    it("shows days when match is days away", () => {
      render(<MatchCountdown {...defaultProps} />);
      // 5 days from Feb 10 to Feb 15
      expect(screen.getByText("05")).toBeInTheDocument();
    });

    it("updates countdown every second", () => {
      render(<MatchCountdown {...defaultProps} />);

      // Initial render
      expect(screen.getByText("05")).toBeInTheDocument(); // days

      // Advance by 1 day
      act(() => {
        vi.advanceTimersByTime(24 * 60 * 60 * 1000);
      });

      expect(screen.getByText("04")).toBeInTheDocument(); // now 4 days
    });

    it("hides days when match is same day", () => {
      vi.setSystemTime(new Date("2024-02-15T10:00:00")); // Same day, 5 hours before
      render(<MatchCountdown {...defaultProps} />);
      expect(screen.queryByText("dagen")).not.toBeInTheDocument();
    });

    it("shows seconds when starting soon", () => {
      vi.setSystemTime(new Date("2024-02-15T14:30:00")); // 30 minutes before
      render(<MatchCountdown {...defaultProps} />);
      expect(screen.getByText("sec")).toBeInTheDocument();
    });
  });

  describe("live state", () => {
    it("shows live indicator when isLive", () => {
      render(<MatchCountdown {...defaultProps} isLive />);
      expect(screen.getByText("Nu bezig")).toBeInTheDocument();
    });

    it("hides countdown when live", () => {
      render(<MatchCountdown {...defaultProps} isLive />);
      expect(screen.queryByText("dagen")).not.toBeInTheDocument();
      expect(screen.queryByText("uur")).not.toBeInTheDocument();
    });
  });

  describe("finished state", () => {
    it("shows finished message when match is past", () => {
      vi.setSystemTime(new Date("2024-02-16T12:00:00")); // Day after match
      render(<MatchCountdown {...defaultProps} />);
      expect(screen.getByText("Wedstrijd afgelopen")).toBeInTheDocument();
    });
  });

  describe("compact variant", () => {
    it("renders compact variant", () => {
      const { container } = render(
        <MatchCountdown {...defaultProps} variant="compact" />,
      );
      expect(container.firstChild).toHaveClass("p-4");
    });

    it("hides competition in compact variant", () => {
      render(<MatchCountdown {...defaultProps} variant="compact" />);
      expect(screen.queryByText("3de Nationale")).not.toBeInTheDocument();
    });

    it("shows seconds in compact variant", () => {
      render(<MatchCountdown {...defaultProps} variant="compact" />);
      expect(screen.getByText("sec")).toBeInTheDocument();
    });

    it("hides full date in compact variant", () => {
      render(<MatchCountdown {...defaultProps} variant="compact" />);
      expect(screen.queryByText(/februari/i)).not.toBeInTheDocument();
    });
  });

  describe("link behavior", () => {
    it("renders as link when href is provided", () => {
      render(<MatchCountdown {...defaultProps} href="/game/123" />);
      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "/game/123");
    });

    it("renders as div when no href", () => {
      render(<MatchCountdown {...defaultProps} />);
      expect(screen.queryByRole("link")).not.toBeInTheDocument();
    });
  });

  describe("loading state", () => {
    it("renders skeleton when loading", () => {
      const { container } = render(
        <MatchCountdown {...defaultProps} isLoading />,
      );
      expect(
        container.querySelectorAll(".animate-pulse").length,
      ).toBeGreaterThan(0);
    });

    it("does not render team names when loading", () => {
      render(<MatchCountdown {...defaultProps} isLoading />);
      expect(screen.queryByText("KCVV Elewijt")).not.toBeInTheDocument();
    });
  });

  describe("className prop", () => {
    it("applies custom className", () => {
      const { container } = render(
        <MatchCountdown {...defaultProps} className="custom-class" />,
      );
      expect(container.firstChild).toHaveClass("custom-class");
    });
  });

  describe("countdown box formatting", () => {
    it("pads single digit values with zero", () => {
      vi.setSystemTime(new Date("2024-02-15T12:55:00")); // 2h 5m before match
      render(<MatchCountdown {...defaultProps} />);
      expect(screen.getByText("02")).toBeInTheDocument(); // hours
      expect(screen.getByText("05")).toBeInTheDocument(); // minutes
    });
  });
});
