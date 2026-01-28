/**
 * CoachProfile Component Tests
 */

import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { CoachProfile } from "./CoachProfile";

// Mock next/image
vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    fill: _fill,
    ...props
  }: {
    src: string;
    alt: string;
    fill?: boolean;
  }) => <img src={src} alt={alt} {...props} />,
}));

describe("CoachProfile", () => {
  const defaultProps = {
    name: "Jan Peeters",
    role: "Hoofdtrainer",
  };

  describe("rendering", () => {
    it("renders name and role", () => {
      render(<CoachProfile {...defaultProps} />);
      expect(screen.getByText("Jan Peeters")).toBeInTheDocument();
      expect(screen.getByText("Hoofdtrainer")).toBeInTheDocument();
    });

    it("renders photo when imageUrl is provided", () => {
      render(<CoachProfile {...defaultProps} imageUrl="/photo.jpg" />);
      const img = screen.getByRole("img");
      expect(img).toHaveAttribute("src", "/photo.jpg");
      expect(img).toHaveAttribute("alt", "Jan Peeters foto");
    });

    it("renders placeholder when no imageUrl", () => {
      const { container } = render(<CoachProfile {...defaultProps} />);
      // Should have User icon placeholder (SVG)
      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });

    it("renders biography when provided", () => {
      render(
        <CoachProfile
          {...defaultProps}
          biography="Een ervaren trainer met veel passie."
        />,
      );
      expect(
        screen.getByText("Een ervaren trainer met veel passie."),
      ).toBeInTheDocument();
    });
  });

  describe("contact info", () => {
    it("renders email link when provided", () => {
      render(<CoachProfile {...defaultProps} email="jan@example.com" />);
      const emailLink = screen.getByRole("link", { name: /jan@example.com/i });
      expect(emailLink).toHaveAttribute("href", "mailto:jan@example.com");
    });

    it("renders phone link when provided", () => {
      render(<CoachProfile {...defaultProps} phone="+32 479 12 34 56" />);
      const phoneLink = screen.getByRole("link", {
        name: /\+32 479 12 34 56/i,
      });
      expect(phoneLink).toHaveAttribute("href", "tel:+32479123456");
    });

    it("renders both email and phone", () => {
      render(
        <CoachProfile
          {...defaultProps}
          email="jan@example.com"
          phone="+32 479 12 34 56"
        />,
      );
      expect(
        screen.getByRole("link", { name: /jan@example.com/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /\+32 479 12 34 56/i }),
      ).toBeInTheDocument();
    });

    it("does not render contact section when no email or phone", () => {
      render(<CoachProfile {...defaultProps} />);
      expect(screen.queryByRole("link")).not.toBeInTheDocument();
    });
  });

  describe("variants", () => {
    it("renders card variant by default", () => {
      const { container } = render(<CoachProfile {...defaultProps} />);
      // Card variant has aspect-square for photo
      expect(container.querySelector(".aspect-square")).toBeInTheDocument();
    });

    it("renders inline variant", () => {
      const { container } = render(
        <CoachProfile {...defaultProps} variant="inline" />,
      );
      // Inline variant should not have aspect-square
      expect(container.querySelector(".aspect-square")).not.toBeInTheDocument();
      // Should have flex layout
      expect(container.firstChild).toHaveClass("flex");
    });

    it("renders photo in inline variant", () => {
      render(
        <CoachProfile
          {...defaultProps}
          variant="inline"
          imageUrl="/photo.jpg"
        />,
      );
      const img = screen.getByRole("img");
      expect(img).toHaveAttribute("src", "/photo.jpg");
    });

    it("renders placeholder in inline variant without photo", () => {
      const { container } = render(
        <CoachProfile {...defaultProps} variant="inline" />,
      );
      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });
  });

  describe("className prop", () => {
    it("applies custom className to card variant", () => {
      const { container } = render(
        <CoachProfile {...defaultProps} className="custom-class" />,
      );
      expect(container.firstChild).toHaveClass("custom-class");
    });

    it("applies custom className to inline variant", () => {
      const { container } = render(
        <CoachProfile
          {...defaultProps}
          variant="inline"
          className="custom-class"
        />,
      );
      expect(container.firstChild).toHaveClass("custom-class");
    });
  });

  describe("accessibility", () => {
    it("has proper alt text for photo", () => {
      render(<CoachProfile {...defaultProps} imageUrl="/photo.jpg" />);
      expect(screen.getByAltText("Jan Peeters foto")).toBeInTheDocument();
    });

    it("icons are hidden from screen readers", () => {
      const { container } = render(
        <CoachProfile {...defaultProps} email="test@example.com" />,
      );
      const icons = container.querySelectorAll('svg[aria-hidden="true"]');
      expect(icons.length).toBeGreaterThan(0);
    });
  });

  describe("edge cases", () => {
    it("handles long biography with truncation", () => {
      const longBio =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ".repeat(10);
      const { container } = render(
        <CoachProfile {...defaultProps} biography={longBio} />,
      );
      // Should have line-clamp class for truncation
      expect(container.querySelector(".line-clamp-3")).toBeInTheDocument();
    });

    it("handles long email with truncation", () => {
      const { container } = render(
        <CoachProfile
          {...defaultProps}
          email="very.long.email.address@example.domain.com"
        />,
      );
      expect(container.querySelector(".truncate")).toBeInTheDocument();
    });
  });
});
