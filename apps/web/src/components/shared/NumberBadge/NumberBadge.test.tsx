/**
 * NumberBadge Component Tests
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NumberBadge } from "./NumberBadge";

describe("NumberBadge", () => {
  describe("Rendering", () => {
    it("should render numeric value", () => {
      const { container } = render(<NumberBadge value={7} />);
      expect(container.querySelector(".number-badge")).toHaveTextContent("7");
    });

    it("should render text value", () => {
      const { container } = render(<NumberBadge value="T1" />);
      expect(container.querySelector(".number-badge")).toHaveTextContent("T1");
    });

    it("should render two-digit number", () => {
      const { container } = render(<NumberBadge value={23} />);
      expect(container.querySelector(".number-badge")).toHaveTextContent("23");
    });

    it("should be aria-hidden for accessibility", () => {
      const { container } = render(<NumberBadge value={7} />);
      expect(container.querySelector(".number-badge")).toHaveAttribute(
        "aria-hidden",
        "true",
      );
    });
  });

  describe("Color Variants", () => {
    it("should apply green color by default", () => {
      const { container } = render(<NumberBadge value={7} />);
      const badge = container.querySelector(".number-badge");
      expect(badge).toHaveStyle({ color: "#4B9B48" });
    });

    it("should apply navy color for staff", () => {
      const { container } = render(<NumberBadge value="T1" color="navy" />);
      const badge = container.querySelector(".number-badge");
      expect(badge).toHaveStyle({ color: "#1e3a5f" });
    });

    it("should apply blue color for youth", () => {
      const { container } = render(<NumberBadge value="U15" color="blue" />);
      const badge = container.querySelector(".number-badge");
      expect(badge).toHaveStyle({ color: "#3b82f6" });
    });
  });

  describe("Size Variants", () => {
    it("should apply large size by default", () => {
      const { container } = render(<NumberBadge value={7} />);
      const badge = container.querySelector(".number-badge");
      // Large size has top-[15px] and left-[15px] (matching margins)
      expect(badge).toHaveClass("top-[15px]");
      expect(badge).toHaveClass("left-[15px]");
    });

    it("should apply small size", () => {
      const { container } = render(<NumberBadge value={7} size="sm" />);
      const badge = container.querySelector(".number-badge");
      expect(badge).toHaveClass("top-[8px]");
      expect(badge).toHaveClass("left-[12px]");
    });

    it("should apply medium size", () => {
      const { container } = render(<NumberBadge value={7} size="md" />);
      const badge = container.querySelector(".number-badge");
      expect(badge).toHaveClass("top-[10px]");
      expect(badge).toHaveClass("left-[12px]");
    });
  });

  describe("Animation", () => {
    it("should have hover animation by default", () => {
      const { container } = render(<NumberBadge value={7} />);
      const badge = container.querySelector(".number-badge");
      expect(badge).toHaveClass("group-hover:scale-110");
    });

    it("should not have hover animation when disabled", () => {
      const { container } = render(<NumberBadge value={7} animated={false} />);
      const badge = container.querySelector(".number-badge");
      expect(badge).not.toHaveClass("group-hover:scale-110");
    });
  });

  describe("Text vs Number Styling", () => {
    it("should use stenciletta font for numbers", () => {
      const { container } = render(<NumberBadge value={7} />);
      const badge = container.querySelector(".number-badge");
      expect(badge).toHaveStyle({ fontFamily: "stenciletta, sans-serif" });
    });

    it("should use stenciletta font for text codes", () => {
      const { container } = render(<NumberBadge value="T1" />);
      const badge = container.querySelector(".number-badge");
      expect(badge).toHaveStyle({ fontFamily: "stenciletta, sans-serif" });
    });

    it("should use tighter letter spacing for text codes", () => {
      const { container } = render(<NumberBadge value="TVJO" />);
      const badge = container.querySelector(".number-badge");
      expect(badge).toHaveStyle({ letterSpacing: "-2px" });
    });

    it("should use wider letter spacing for numbers", () => {
      const { container } = render(<NumberBadge value={7} />);
      const badge = container.querySelector(".number-badge");
      expect(badge).toHaveStyle({ letterSpacing: "-6px" });
    });

    it("should use smaller font size for text codes", () => {
      const { container } = render(<NumberBadge value="TVJO" size="lg" />);
      const badge = container.querySelector(".number-badge");
      // Text codes use smaller sizes (5rem mobile vs 8rem for numbers)
      expect(badge).toHaveClass("text-[5rem]");
    });

    it("should use larger font size for numbers", () => {
      const { container } = render(<NumberBadge value={7} size="lg" />);
      const badge = container.querySelector(".number-badge");
      // Numbers use larger sizes
      expect(badge).toHaveClass("text-[8rem]");
    });
  });

  describe("Custom Props", () => {
    it("should accept custom className", () => {
      const { container } = render(
        <NumberBadge value={7} className="custom-class" />,
      );
      const badge = container.querySelector(".number-badge");
      expect(badge).toHaveClass("custom-class");
    });

    it("should forward ref", () => {
      const ref = { current: null };
      render(<NumberBadge value={7} ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("should pass through additional props", () => {
      render(<NumberBadge value={7} data-testid="badge" />);
      expect(screen.getByTestId("badge")).toBeInTheDocument();
    });
  });

  describe("3D Effect", () => {
    it("should have text-shadow for 3D effect", () => {
      const { container } = render(<NumberBadge value={7} />);
      // Check that textShadow is applied (non-empty)
      const badge = container.querySelector(".number-badge");
      const style = badge?.getAttribute("style");
      expect(style).toContain("text-shadow:");
    });

    it("should have inline styles for 3D outline effect", () => {
      const { container } = render(<NumberBadge value={7} />);
      const badge = container.querySelector(".number-badge");
      // Check core styles are applied (webkit properties don't serialize in jsdom)
      expect(badge).toHaveStyle({ color: "#4B9B48" });
      expect(badge).toHaveStyle({ whiteSpace: "nowrap" });
      expect(badge).toHaveStyle({ lineHeight: "0.71" });
    });
  });
});
