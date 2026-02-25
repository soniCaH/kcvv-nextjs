/**
 * Label Component Tests
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Label } from "./Label";

describe("Label", () => {
  describe("Rendering", () => {
    it("should render as a label element", () => {
      const { container } = render(<Label>Naam</Label>);
      expect(container.querySelector("label")).toBeInTheDocument();
    });

    it("should render children text", () => {
      render(<Label>E-mailadres</Label>);
      expect(screen.getByText("E-mailadres")).toBeInTheDocument();
    });

    it("should forward ref", () => {
      const ref = { current: null };
      render(<Label ref={ref}>Test</Label>);
      expect(ref.current).toBeInstanceOf(HTMLLabelElement);
    });
  });

  describe("Styles", () => {
    it("should have base label styles", () => {
      const { container } = render(<Label>Label</Label>);
      const label = container.querySelector("label") as HTMLElement;
      expect(label).toHaveClass(
        "text-sm",
        "font-semibold",
        "text-kcvv-gray-blue",
      );
    });

    it("should have bottom margin", () => {
      const { container } = render(<Label>Label</Label>);
      const label = container.querySelector("label") as HTMLElement;
      expect(label).toHaveClass("mb-1.5");
    });
  });

  describe("Required", () => {
    it("should not show asterisk by default", () => {
      render(<Label>Naam</Label>);
      expect(screen.queryByText("*")).not.toBeInTheDocument();
    });

    it("should show asterisk when required is true", () => {
      render(<Label required>Naam</Label>);
      expect(screen.getByText("*")).toBeInTheDocument();
    });

    it("should mark asterisk as aria-hidden", () => {
      const { container } = render(<Label required>Naam</Label>);
      const asterisk = container.querySelector("[aria-hidden='true']");
      expect(asterisk).toBeInTheDocument();
      expect(asterisk).toHaveTextContent("*");
    });

    it("should apply alert colour to asterisk", () => {
      const { container } = render(<Label required>Naam</Label>);
      const asterisk = container.querySelector(
        "[aria-hidden='true']",
      ) as HTMLElement;
      expect(asterisk).toHaveClass("text-kcvv-alert");
    });
  });

  describe("Custom props", () => {
    it("should accept custom className", () => {
      const { container } = render(<Label className="custom">Label</Label>);
      expect(container.querySelector("label")).toHaveClass("custom");
    });

    it("should accept htmlFor attribute", () => {
      const { container } = render(<Label htmlFor="my-input">Label</Label>);
      expect(container.querySelector("label")).toHaveAttribute(
        "for",
        "my-input",
      );
    });

    it("should associate with input via htmlFor", () => {
      render(
        <>
          <Label htmlFor="email">E-mailadres</Label>
          <input id="email" type="email" />
        </>,
      );
      expect(screen.getByLabelText("E-mailadres")).toBeInTheDocument();
    });
  });
});
