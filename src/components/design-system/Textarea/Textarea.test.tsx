/**
 * Textarea Component Tests
 */

import { createRef } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Textarea } from "./Textarea";

describe("Textarea", () => {
  describe("Rendering", () => {
    it("should render as a textarea element", () => {
      render(<Textarea />);
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    it("should render placeholder text", () => {
      render(<Textarea placeholder="Schrijf hier..." />);
      expect(
        screen.getByPlaceholderText("Schrijf hier..."),
      ).toBeInTheDocument();
    });

    it("should render with a default value", () => {
      render(<Textarea defaultValue="Bericht inhoud" />);
      expect(screen.getByDisplayValue("Bericht inhoud")).toBeInTheDocument();
    });

    it("should forward ref", () => {
      const ref = createRef<HTMLTextAreaElement>();
      render(<Textarea ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
    });
  });

  describe("Resize", () => {
    it("should use vertical resize by default", () => {
      render(<Textarea data-testid="ta" />);
      expect(screen.getByTestId("ta")).toHaveClass("resize-y");
    });

    it("should support no resize", () => {
      render(<Textarea resize="none" data-testid="ta" />);
      expect(screen.getByTestId("ta")).toHaveClass("resize-none");
    });

    it("should support both resize", () => {
      render(<Textarea resize="both" data-testid="ta" />);
      expect(screen.getByTestId("ta")).toHaveClass("resize");
    });
  });

  describe("Error state", () => {
    it("should render error message", () => {
      render(<Textarea error="Dit veld is verplicht." />);
      expect(screen.getByText("Dit veld is verplicht.")).toBeInTheDocument();
    });

    it("should apply error border class and aria-invalid", () => {
      render(<Textarea error="Fout" data-testid="ta" />);
      const ta = screen.getByTestId("ta");
      expect(ta).toHaveClass("border-kcvv-alert");
      expect(ta).toHaveAttribute("aria-invalid", "true");
    });

    it("should not show hint when error is present", () => {
      render(<Textarea error="Fout" hint="Hulptekst" />);
      expect(screen.queryByText("Hulptekst")).not.toBeInTheDocument();
      expect(screen.getByText("Fout")).toBeInTheDocument();
    });
  });

  describe("Hint", () => {
    it("should render hint text when no error", () => {
      render(<Textarea hint="Maximaal 500 tekens." />);
      expect(screen.getByText("Maximaal 500 tekens.")).toBeInTheDocument();
    });
  });

  describe("Disabled state", () => {
    it("should be disabled when disabled prop is set", () => {
      render(<Textarea disabled />);
      expect(screen.getByRole("textbox")).toBeDisabled();
    });

    it("should have disabled styles", () => {
      render(<Textarea disabled data-testid="ta" />);
      expect(screen.getByTestId("ta")).toHaveClass(
        "disabled:opacity-50",
        "disabled:cursor-not-allowed",
      );
    });
  });

  describe("Rows", () => {
    it("should pass rows attribute to textarea", () => {
      render(<Textarea rows={6} />);
      expect(screen.getByRole("textbox")).toHaveAttribute("rows", "6");
    });
  });

  describe("Custom props", () => {
    it("should accept custom className", () => {
      render(<Textarea className="custom-class" data-testid="ta" />);
      expect(screen.getByTestId("ta")).toHaveClass("custom-class");
    });

    it("should have focus ring styles", () => {
      render(<Textarea data-testid="ta" />);
      expect(screen.getByTestId("ta")).toHaveClass("focus:ring-2");
    });
  });

  describe("Interactions", () => {
    it("should accept typed input", async () => {
      const user = userEvent.setup();
      render(<Textarea />);
      await user.type(screen.getByRole("textbox"), "Hallo KCVV");
      expect(screen.getByRole("textbox")).toHaveValue("Hallo KCVV");
    });

    it("should call onChange when typing", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Textarea onChange={handleChange} />);
      await user.type(screen.getByRole("textbox"), "test");
      expect(handleChange).toHaveBeenCalled();
    });

    it("should receive focus on click", async () => {
      const user = userEvent.setup();
      render(<Textarea />);
      await user.click(screen.getByRole("textbox"));
      expect(screen.getByRole("textbox")).toHaveFocus();
    });
  });
});
