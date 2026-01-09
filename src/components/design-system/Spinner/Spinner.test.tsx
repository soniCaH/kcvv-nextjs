/**
 * Spinner Component Tests
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Spinner, FullPageSpinner } from "./Spinner";

describe("Spinner", () => {
  describe("Rendering", () => {
    it("should render spinner", () => {
      const { container } = render(<Spinner />);
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it('should have role="status"', () => {
      render(<Spinner />);
      expect(screen.getByRole("status")).toBeInTheDocument();
    });

    it("should have default aria-label", () => {
      render(<Spinner />);
      expect(screen.getByRole("status")).toHaveAttribute(
        "aria-label",
        "Loading...",
      );
    });

    it("should have custom label", () => {
      render(<Spinner label="Loading articles..." />);
      expect(screen.getByRole("status")).toHaveAttribute(
        "aria-label",
        "Loading articles...",
      );
      expect(screen.getByText("Loading articles...")).toHaveClass("sr-only");
    });
  });

  describe("Sizes", () => {
    it("should render medium size by default", () => {
      const { container } = render(<Spinner />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveClass("h-8", "w-8");
    });

    it("should render small size", () => {
      const { container } = render(<Spinner size="sm" />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveClass("h-4", "w-4");
    });

    it("should render large size", () => {
      const { container } = render(<Spinner size="lg" />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveClass("h-12", "w-12");
    });

    it("should render extra large size", () => {
      const { container } = render(<Spinner size="xl" />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveClass("h-16", "w-16");
    });
  });

  describe("Variants", () => {
    it("should render primary variant by default", () => {
      const { container } = render(<Spinner />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveClass("text-kcvv-green-bright");
    });

    it("should render secondary variant", () => {
      const { container } = render(<Spinner variant="secondary" />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveClass("text-gray-600");
    });

    it("should render white variant", () => {
      const { container } = render(<Spinner variant="white" />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveClass("text-white");
    });

    it("should render logo variant with image", () => {
      const { container } = render(<Spinner variant="logo" />);
      const img = container.querySelector("img");
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute("alt", "KCVV Logo");
      expect(img).toHaveClass("animate-kcvv-logo-spin");
    });

    it("should render logo variant with xl size", () => {
      const { container } = render(<Spinner variant="logo" size="xl" />);
      const img = container.querySelector("img");
      expect(img).toHaveClass("h-24", "w-24");
      expect(img).toHaveAttribute("width", "96");
      expect(img).toHaveAttribute("height", "96");
    });
  });

  describe("Animation", () => {
    it("should have spin animation", () => {
      const { container } = render(<Spinner />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveClass("animate-spin");
    });
  });

  describe("Accessibility", () => {
    it("should have screen reader text", () => {
      render(<Spinner label="Loading content" />);
      const srText = screen.getByText("Loading content");
      expect(srText).toHaveClass("sr-only");
    });

    it("should be announced to screen readers", () => {
      render(<Spinner />);
      const status = screen.getByRole("status");
      expect(status).toHaveAttribute("aria-label");
    });
  });

  describe("Custom Props", () => {
    it("should accept custom className", () => {
      const { container } = render(<Spinner className="custom-class" />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass("custom-class");
    });

    it("should forward ref", () => {
      const ref = { current: null };
      render(<Spinner ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe("Combination Props", () => {
    it("should combine size and variant", () => {
      const { container } = render(<Spinner size="lg" variant="secondary" />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveClass("h-12", "w-12", "text-gray-600");
    });

    it("should combine all props", () => {
      const { container } = render(
        <Spinner
          size="xl"
          variant="primary"
          label="Custom loading"
          className="custom"
        />,
      );
      const wrapper = container.firstChild as HTMLElement;
      const svg = container.querySelector("svg");

      expect(wrapper).toHaveClass("custom");
      expect(svg).toHaveClass("h-16", "w-16", "text-kcvv-green-bright");
      expect(wrapper).toHaveAttribute("aria-label", "Custom loading");
    });
  });
});

describe("FullPageSpinner", () => {
  describe("Rendering", () => {
    it("should render full page spinner", () => {
      const { container } = render(<FullPageSpinner />);
      const overlay = container.firstChild as HTMLElement;
      expect(overlay).toHaveClass("fixed", "inset-0", "z-50");
    });

    it("should contain a spinner", () => {
      render(<FullPageSpinner />);
      expect(screen.getByRole("status")).toBeInTheDocument();
    });

    it("should use xl size by default", () => {
      const { container } = render(<FullPageSpinner />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveClass("h-16", "w-16");
    });

    it("should accept custom size", () => {
      const { container } = render(<FullPageSpinner size="md" />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveClass("h-8", "w-8");
    });

    it("should accept custom label", () => {
      render(<FullPageSpinner label="Loading application..." />);
      expect(screen.getByRole("status")).toHaveAttribute(
        "aria-label",
        "Loading application...",
      );
    });
  });

  describe("Styling", () => {
    it("should have backdrop blur", () => {
      const { container } = render(<FullPageSpinner />);
      const overlay = container.firstChild as HTMLElement;
      expect(overlay).toHaveClass("backdrop-blur-sm");
    });

    it("should be centered", () => {
      const { container } = render(<FullPageSpinner />);
      const overlay = container.firstChild as HTMLElement;
      expect(overlay).toHaveClass("flex", "items-center", "justify-center");
    });

    it("should have high z-index", () => {
      const { container } = render(<FullPageSpinner />);
      const overlay = container.firstChild as HTMLElement;
      expect(overlay).toHaveClass("z-50");
    });
  });
});
