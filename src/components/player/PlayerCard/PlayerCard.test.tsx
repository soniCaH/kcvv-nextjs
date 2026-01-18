/**
 * PlayerCard Component Tests
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PlayerCard } from "./PlayerCard";

describe("PlayerCard", () => {
  const defaultProps = {
    firstName: "Kevin",
    lastName: "De Bruyne",
    position: "Middenvelder",
    href: "/player/kevin-de-bruyne",
    number: 7,
  };

  describe("Rendering", () => {
    it("should render player name", () => {
      render(<PlayerCard {...defaultProps} />);
      expect(screen.getByText("Kevin")).toBeInTheDocument();
      expect(screen.getByText("De Bruyne")).toBeInTheDocument();
    });

    it("should render as article element", () => {
      const { container } = render(<PlayerCard {...defaultProps} />);
      expect(container.querySelector("article")).toBeInTheDocument();
    });

    it("should render link with correct href", () => {
      render(<PlayerCard {...defaultProps} />);
      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "/player/kevin-de-bruyne");
    });

    it("should have accessible label with full player info", () => {
      render(<PlayerCard {...defaultProps} />);
      const link = screen.getByRole("link");
      expect(link).toHaveAttribute(
        "aria-label",
        "Bekijk profiel van Kevin De Bruyne, Middenvelder, nummer 7",
      );
    });
  });

  describe("Jersey Number", () => {
    it("should display large jersey number when provided", () => {
      const { container } = render(
        <PlayerCard {...defaultProps} number={10} />,
      );
      // The large number div has the position class and is aria-hidden
      const numberEl = container.querySelector(".player__teaser__position");
      expect(numberEl).toHaveTextContent("10");
      expect(numberEl).toHaveAttribute("aria-hidden", "true");
    });

    it("should not display jersey number when not provided", () => {
      const { container } = render(
        <PlayerCard {...defaultProps} number={undefined} />,
      );
      // Check there's no number element
      const numberEl = container.querySelector(".player__teaser__position");
      expect(numberEl).toBeNull();
    });

    it("should not include number in accessible label when not provided", () => {
      render(<PlayerCard {...defaultProps} number={undefined} />);
      const link = screen.getByRole("link");
      expect(link).toHaveAttribute(
        "aria-label",
        "Bekijk profiel van Kevin De Bruyne, Middenvelder",
      );
    });
  });

  describe("Captain Badge", () => {
    it("should display captain badge when isCaptain is true", () => {
      render(<PlayerCard {...defaultProps} isCaptain />);
      expect(screen.getByLabelText("Aanvoerder")).toBeInTheDocument();
    });

    it("should not display captain badge by default", () => {
      render(<PlayerCard {...defaultProps} />);
      expect(screen.queryByLabelText("Aanvoerder")).not.toBeInTheDocument();
    });
  });

  describe("Player Image", () => {
    it("should render image when imageUrl is provided", () => {
      render(
        <PlayerCard
          {...defaultProps}
          imageUrl="https://example.com/photo.jpg"
        />,
      );
      const img = screen.getByRole("img");
      expect(img).toHaveAttribute("alt", "Kevin De Bruyne");
    });

    it("should render placeholder when no image provided", () => {
      const { container } = render(<PlayerCard {...defaultProps} />);
      // Check for SVG placeholder
      expect(container.querySelector("svg")).toBeInTheDocument();
    });
  });

  describe("Variants", () => {
    it("should render default variant with full height", () => {
      render(<PlayerCard {...defaultProps} />);
      const link = screen.getByRole("link");
      expect(link).toHaveClass("h-[285px]");
    });

    it("should render compact variant with smaller height", () => {
      render(<PlayerCard {...defaultProps} variant="compact" />);
      const link = screen.getByRole("link");
      expect(link).toHaveClass("h-[220px]");
    });
  });

  describe("Loading State", () => {
    it("should render loading skeleton when isLoading is true", () => {
      render(<PlayerCard {...defaultProps} isLoading />);
      expect(screen.getByLabelText("Laden...")).toBeInTheDocument();
    });

    it("should not render player info when loading", () => {
      render(<PlayerCard {...defaultProps} isLoading />);
      expect(screen.queryByText("Kevin")).not.toBeInTheDocument();
      expect(screen.queryByText("De Bruyne")).not.toBeInTheDocument();
    });

    it("should have skeleton animation class", () => {
      const { container } = render(<PlayerCard {...defaultProps} isLoading />);
      expect(container.firstChild).toHaveClass("animate-pulse");
    });
  });

  describe("Custom Props", () => {
    it("should accept custom className", () => {
      const { container } = render(
        <PlayerCard {...defaultProps} className="custom-class" />,
      );
      const article = container.querySelector("article");
      expect(article).toHaveClass("custom-class");
    });

    it("should forward ref", () => {
      const ref = { current: null };
      render(<PlayerCard {...defaultProps} ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLElement);
    });
  });
});
