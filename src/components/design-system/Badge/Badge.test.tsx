/**
 * Badge Component Tests
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "./Badge";

describe("Badge", () => {
  describe("Rendering", () => {
    it("should render children text", () => {
      render(<Badge>Nieuws</Badge>);
      expect(screen.getByText("Nieuws")).toBeInTheDocument();
    });

    it("should render as a span element", () => {
      render(<Badge>Tag</Badge>);
      expect(screen.getByText("Tag").tagName).toBe("SPAN");
    });
  });

  describe("Variants", () => {
    it("should render default variant", () => {
      const { container } = render(<Badge variant="default">Default</Badge>);
      expect(container.firstChild).toHaveClass(
        "bg-foundation-gray-light",
        "text-kcvv-gray",
      );
    });

    it("should render primary variant", () => {
      const { container } = render(<Badge variant="primary">Primary</Badge>);
      expect(container.firstChild).toHaveClass("text-kcvv-green-dark");
    });

    it("should render success variant", () => {
      const { container } = render(<Badge variant="success">Gewonnen</Badge>);
      expect(container.firstChild).toHaveClass("text-kcvv-green-dark");
    });

    it("should render warning variant", () => {
      const { container } = render(<Badge variant="warning">Uitgesteld</Badge>);
      expect(container.firstChild).toHaveClass("text-amber-800");
    });

    it("should render alert variant", () => {
      const { container } = render(<Badge variant="alert">Afgelast</Badge>);
      expect(container.firstChild).toHaveClass("text-kcvv-alert");
    });

    it("should render outline variant", () => {
      const { container } = render(<Badge variant="outline">Goud</Badge>);
      expect(container.firstChild).toHaveClass(
        "border",
        "border-kcvv-green-bright",
        "text-kcvv-green-bright",
      );
    });

    it("should render live variant", () => {
      const { container } = render(<Badge variant="live">Live</Badge>);
      expect(container.firstChild).toHaveClass("bg-red-500", "text-white");
    });
  });

  describe("Sizes", () => {
    it("should render medium size by default", () => {
      const { container } = render(<Badge>Badge</Badge>);
      expect(container.firstChild).toHaveClass("px-2.5", "py-1");
    });

    it("should render small size", () => {
      const { container } = render(<Badge size="sm">Badge</Badge>);
      expect(container.firstChild).toHaveClass("px-1.5", "py-0.5");
    });
  });

  describe("Dot indicator", () => {
    it("should not show dot by default", () => {
      const { container } = render(<Badge>Badge</Badge>);
      expect(
        container.querySelector("[aria-hidden='true']"),
      ).not.toBeInTheDocument();
    });

    it("should show dot when dot prop is true", () => {
      const { container } = render(<Badge dot>Badge</Badge>);
      const dotEl = container.querySelector("[aria-hidden='true']");
      expect(dotEl).toBeInTheDocument();
    });

    it("should always show dot for live variant", () => {
      const { container } = render(<Badge variant="live">Live</Badge>);
      const dotEl = container.querySelector("[aria-hidden='true']");
      expect(dotEl).toBeInTheDocument();
    });

    it("should apply white dot for live variant", () => {
      const { container } = render(<Badge variant="live">Live</Badge>);
      const dotEl = container.querySelector(
        "[aria-hidden='true']",
      ) as HTMLElement;
      expect(dotEl).toHaveClass("bg-white");
    });

    it("should animate the dot for live variant", () => {
      const { container } = render(<Badge variant="live">Live</Badge>);
      const dotEl = container.querySelector(
        "[aria-hidden='true']",
      ) as HTMLElement;
      expect(dotEl).toHaveClass("animate-pulse");
    });
  });

  describe("Custom props", () => {
    it("should accept custom className", () => {
      const { container } = render(<Badge className="custom">Badge</Badge>);
      expect(container.firstChild).toHaveClass("custom");
    });
  });
});
