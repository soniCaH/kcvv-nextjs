/**
 * Input Component Tests
 */

import { createRef } from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "./Input";
import { Search } from "lucide-react";

describe("Input", () => {
  describe("Rendering", () => {
    it("should render as an input element", () => {
      render(<Input />);
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    it("should render placeholder text", () => {
      render(<Input placeholder="Zoek hier..." />);
      expect(screen.getByPlaceholderText("Zoek hier...")).toBeInTheDocument();
    });

    it("should render with a default value", () => {
      render(<Input defaultValue="KCVV" />);
      expect(screen.getByDisplayValue("KCVV")).toBeInTheDocument();
    });

    it("should forward ref", () => {
      const ref = createRef<HTMLInputElement>();
      render(<Input ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });
  });

  describe("Sizes", () => {
    it("should render medium size by default", () => {
      render(<Input data-testid="input" />);
      const inputEl = screen.getByTestId("input");
      expect(inputEl).toHaveClass("px-4", "py-2.5", "text-base");
    });

    it("should render small size", () => {
      render(<Input size="sm" data-testid="input" />);
      expect(screen.getByTestId("input")).toHaveClass(
        "px-3",
        "py-1.5",
        "text-sm",
      );
    });

    it("should render large size", () => {
      render(<Input size="lg" data-testid="input" />);
      expect(screen.getByTestId("input")).toHaveClass(
        "px-5",
        "py-3",
        "text-lg",
      );
    });
  });

  describe("Error state", () => {
    it("should render error message", () => {
      render(<Input error="Dit veld is verplicht." />);
      expect(screen.getByText("Dit veld is verplicht.")).toBeInTheDocument();
    });

    it("should apply error border class", () => {
      render(<Input error="Fout" data-testid="input" />);
      expect(screen.getByTestId("input")).toHaveClass("border-kcvv-alert");
    });

    it("should not show hint when error is present", () => {
      render(<Input error="Fout" hint="Hulptekst" />);
      expect(screen.queryByText("Hulptekst")).not.toBeInTheDocument();
      expect(screen.getByText("Fout")).toBeInTheDocument();
    });
  });

  describe("Hint", () => {
    it("should render hint text when no error", () => {
      render(<Input hint="Minimaal 2 tekens." />);
      expect(screen.getByText("Minimaal 2 tekens.")).toBeInTheDocument();
    });
  });

  describe("Icons", () => {
    it("should render leading icon", () => {
      render(
        <Input leadingIcon={<Search data-testid="leading-icon" size={16} />} />,
      );
      expect(screen.getByTestId("leading-icon")).toBeInTheDocument();
    });

    it("should render trailing icon", () => {
      render(
        <Input
          trailingIcon={<Search data-testid="trailing-icon" size={16} />}
        />,
      );
      expect(screen.getByTestId("trailing-icon")).toBeInTheDocument();
    });

    it("should add md leading padding when leadingIcon is set", () => {
      render(<Input leadingIcon={<Search size={16} />} data-testid="input" />);
      expect(screen.getByTestId("input")).toHaveClass("pl-10");
    });

    it("should add sm leading padding when leadingIcon is set", () => {
      render(
        <Input
          size="sm"
          leadingIcon={<Search size={14} />}
          data-testid="input"
        />,
      );
      expect(screen.getByTestId("input")).toHaveClass("pl-8");
    });

    it("should add lg leading padding when leadingIcon is set", () => {
      render(
        <Input
          size="lg"
          leadingIcon={<Search size={20} />}
          data-testid="input"
        />,
      );
      expect(screen.getByTestId("input")).toHaveClass("pl-12");
    });

    it("should add trailing padding when trailingIcon is set", () => {
      render(<Input trailingIcon={<Search size={16} />} data-testid="input" />);
      expect(screen.getByTestId("input")).toHaveClass("pr-10");
    });
  });

  describe("Disabled state", () => {
    it("should be disabled when disabled prop is set", () => {
      render(<Input disabled />);
      expect(screen.getByRole("textbox")).toBeDisabled();
    });

    it("should have disabled styles", () => {
      render(<Input disabled data-testid="input" />);
      expect(screen.getByTestId("input")).toHaveClass(
        "disabled:opacity-50",
        "disabled:cursor-not-allowed",
      );
    });
  });

  describe("Custom props", () => {
    it("should accept custom className", () => {
      render(<Input className="custom-class" data-testid="input" />);
      expect(screen.getByTestId("input")).toHaveClass("custom-class");
    });

    it("should pass through native input attributes", () => {
      render(<Input type="email" name="email" id="email-field" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("type", "email");
      expect(input).toHaveAttribute("name", "email");
      expect(input).toHaveAttribute("id", "email-field");
    });
  });

  describe("Accessibility", () => {
    it("should have focus ring styles", () => {
      render(<Input data-testid="input" />);
      expect(screen.getByTestId("input")).toHaveClass("focus:ring-2");
    });

    it("should receive focus on click", async () => {
      const user = userEvent.setup();
      render(<Input data-testid="input" />);
      await user.click(screen.getByTestId("input"));
      expect(screen.getByTestId("input")).toHaveFocus();
    });

    it("should be associated with a label via id", () => {
      render(
        <>
          <label htmlFor="test-input">Naam</label>
          <Input id="test-input" />
        </>,
      );
      expect(screen.getByLabelText("Naam")).toBeInTheDocument();
    });
  });
});
