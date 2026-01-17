/**
 * PlayerTeaser Component Tests
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PlayerTeaser } from "./PlayerTeaser";

describe("PlayerTeaser", () => {
  const defaultProps = {
    name: "Kevin De Bruyne",
    position: "Middenvelder",
    href: "/player/kevin-de-bruyne",
  };

  describe("Rendering", () => {
    it("should render player name", () => {
      render(<PlayerTeaser {...defaultProps} />);
      expect(screen.getByText("Kevin De Bruyne")).toBeInTheDocument();
    });

    it("should render position abbreviation", () => {
      render(<PlayerTeaser {...defaultProps} />);
      // Uses short codes: MID for Middenvelder
      expect(screen.getByText("MID")).toBeInTheDocument();
    });

    it("should render as article element", () => {
      const { container } = render(<PlayerTeaser {...defaultProps} />);
      expect(container.querySelector("article")).toBeInTheDocument();
    });

    it("should render link with correct href", () => {
      render(<PlayerTeaser {...defaultProps} />);
      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "/player/kevin-de-bruyne");
    });

    it("should have title attribute with player info", () => {
      render(<PlayerTeaser {...defaultProps} />);
      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("title", "Kevin De Bruyne - Middenvelder");
    });
  });

  describe("Jersey Number", () => {
    it("should display number with hash prefix when provided", () => {
      render(<PlayerTeaser {...defaultProps} number={10} />);
      expect(screen.getByText("#10")).toBeInTheDocument();
    });

    it("should have aria-label on number", () => {
      render(<PlayerTeaser {...defaultProps} number={10} />);
      expect(screen.getByLabelText("Nummer 10")).toBeInTheDocument();
    });

    it("should not display number when not provided", () => {
      render(<PlayerTeaser {...defaultProps} />);
      expect(screen.queryByText(/#\d+/)).not.toBeInTheDocument();
    });
  });

  describe("Player Image", () => {
    it("should render image when imageUrl is provided", () => {
      render(
        <PlayerTeaser
          {...defaultProps}
          imageUrl="https://example.com/photo.jpg"
        />,
      );
      const img = screen.getByRole("img");
      expect(img).toHaveAttribute("alt", "Kevin De Bruyne");
    });

    it("should render placeholder when no image provided", () => {
      const { container } = render(<PlayerTeaser {...defaultProps} />);
      // Check for SVG placeholder
      expect(container.querySelector("svg")).toBeInTheDocument();
    });
  });

  describe("Statistics", () => {
    it("should not show stats by default", () => {
      render(
        <PlayerTeaser {...defaultProps} stats={{ goals: 5, games: 20 }} />,
      );
      // Stats use emoji format "5 ⚽"
      expect(screen.queryByText(/5 ⚽/)).not.toBeInTheDocument();
    });

    it("should show goals with emoji when showStats is true", () => {
      render(
        <PlayerTeaser
          {...defaultProps}
          showStats
          stats={{ goals: 5, games: 20 }}
        />,
      );
      expect(screen.getByText(/5 ⚽/)).toBeInTheDocument();
    });

    it("should show games with abbreviation when showStats is true", () => {
      render(
        <PlayerTeaser
          {...defaultProps}
          showStats
          stats={{ goals: 5, games: 20 }}
        />,
      );
      expect(screen.getByText("20 wed.")).toBeInTheDocument();
    });

    it("should not show stats section when stats are undefined", () => {
      render(<PlayerTeaser {...defaultProps} showStats />);
      expect(screen.queryByText(/wed\./)).not.toBeInTheDocument();
    });
  });

  describe("Selected State", () => {
    it("should not have selected border styling by default", () => {
      render(<PlayerTeaser {...defaultProps} />);
      const link = screen.getByRole("link");
      expect(link).not.toHaveClass("border-2");
    });

    it("should have selected border styling when isSelected is true", () => {
      render(<PlayerTeaser {...defaultProps} isSelected />);
      const link = screen.getByRole("link");
      expect(link).toHaveClass("border-2");
    });
  });

  describe("Loading State", () => {
    it("should render loading skeleton when isLoading is true", () => {
      render(<PlayerTeaser {...defaultProps} isLoading />);
      expect(screen.getByLabelText("Laden...")).toBeInTheDocument();
    });

    it("should not render player info when loading", () => {
      render(<PlayerTeaser {...defaultProps} isLoading />);
      expect(screen.queryByText("Kevin De Bruyne")).not.toBeInTheDocument();
    });

    it("should have skeleton animation class", () => {
      const { container } = render(
        <PlayerTeaser {...defaultProps} isLoading />,
      );
      expect(container.firstChild).toHaveClass("animate-pulse");
    });
  });

  describe("Custom Props", () => {
    it("should accept custom className", () => {
      const { container } = render(
        <PlayerTeaser {...defaultProps} className="custom-class" />,
      );
      const article = container.querySelector("article");
      expect(article).toHaveClass("custom-class");
    });

    it("should forward ref", () => {
      const ref = { current: null };
      render(<PlayerTeaser {...defaultProps} ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLElement);
    });
  });
});
