/**
 * Select Component Tests
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Select } from "./Select";

describe("Select", () => {
  describe("Rendering", () => {
    it("should render as a select element", () => {
      render(
        <Select>
          <option value="1">Optie 1</option>
        </Select>,
      );
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    it("should render options", () => {
      render(
        <Select>
          <option value="gold">Goud</option>
          <option value="silver">Zilver</option>
        </Select>,
      );
      expect(screen.getByRole("option", { name: "Goud" })).toBeInTheDocument();
      expect(
        screen.getByRole("option", { name: "Zilver" }),
      ).toBeInTheDocument();
    });

    it("should render placeholder as disabled first option", () => {
      render(<Select placeholder="Kies een optie" />);
      const option = screen.getByRole("option", { name: "Kies een optie" });
      expect(option).toBeInTheDocument();
      expect(option).toBeDisabled();
    });

    it("should forward ref", () => {
      const ref = { current: null };
      render(<Select ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLSelectElement);
    });
  });

  describe("Sizes", () => {
    it("should render medium size by default", () => {
      render(<Select data-testid="select" />);
      expect(screen.getByTestId("select")).toHaveClass(
        "pl-4",
        "py-2.5",
        "text-base",
      );
    });

    it("should render small size", () => {
      render(<Select size="sm" data-testid="select" />);
      expect(screen.getByTestId("select")).toHaveClass(
        "pl-3",
        "py-1.5",
        "text-sm",
      );
    });

    it("should render large size", () => {
      render(<Select size="lg" data-testid="select" />);
      expect(screen.getByTestId("select")).toHaveClass(
        "pl-5",
        "py-3",
        "text-lg",
      );
    });
  });

  describe("Custom chevron", () => {
    it("should render a chevron icon", () => {
      const { container } = render(<Select />);
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("should hide native select arrow via appearance-none", () => {
      render(<Select data-testid="select" />);
      expect(screen.getByTestId("select")).toHaveClass("appearance-none");
    });
  });

  describe("Error state", () => {
    it("should render error message", () => {
      render(<Select error="Kies een geldige optie." />);
      expect(screen.getByText("Kies een geldige optie.")).toBeInTheDocument();
    });

    it("should apply error border class", () => {
      render(<Select error="Fout" data-testid="select" />);
      expect(screen.getByTestId("select")).toHaveClass("border-kcvv-alert");
    });

    it("should not show hint when error is present", () => {
      render(<Select error="Fout" hint="Hulptekst" />);
      expect(screen.queryByText("Hulptekst")).not.toBeInTheDocument();
    });
  });

  describe("Hint", () => {
    it("should render hint text when no error", () => {
      render(<Select hint="Kies je ploeg." />);
      expect(screen.getByText("Kies je ploeg.")).toBeInTheDocument();
    });
  });

  describe("Disabled state", () => {
    it("should be disabled when disabled prop is set", () => {
      render(<Select disabled />);
      expect(screen.getByRole("combobox")).toBeDisabled();
    });

    it("should have disabled styles", () => {
      render(<Select disabled data-testid="select" />);
      expect(screen.getByTestId("select")).toHaveClass(
        "disabled:opacity-50",
        "disabled:cursor-not-allowed",
      );
    });
  });

  describe("Custom props", () => {
    it("should accept custom className", () => {
      render(<Select className="custom-class" data-testid="select" />);
      expect(screen.getByTestId("select")).toHaveClass("custom-class");
    });

    it("should pass native select attributes", () => {
      render(<Select name="tier" id="tier-select" data-testid="select" />);
      const select = screen.getByTestId("select");
      expect(select).toHaveAttribute("name", "tier");
      expect(select).toHaveAttribute("id", "tier-select");
    });
  });
});
