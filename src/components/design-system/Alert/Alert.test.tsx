/**
 * Alert Component Tests
 */

import { createRef } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Alert } from "./Alert";

describe("Alert", () => {
  describe("Rendering", () => {
    it("should render children content", () => {
      render(<Alert>Inschrijvingen zijn open.</Alert>);
      expect(screen.getByText("Inschrijvingen zijn open.")).toBeInTheDocument();
    });

    it("should have role='alert'", () => {
      render(<Alert>Melding</Alert>);
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    it("should render title when provided", () => {
      render(<Alert title="Info">Inhoud</Alert>);
      expect(screen.getByText("Info")).toBeInTheDocument();
      expect(screen.getByText("Inhoud")).toBeInTheDocument();
    });

    it("should not render title element when not provided", () => {
      render(<Alert>Geen titel</Alert>);
      expect(
        screen.queryByText("Geen titel", { selector: "p" }),
      ).not.toBeInTheDocument();
    });

    it("should forward ref to root div", () => {
      const ref = createRef<HTMLDivElement>();
      render(<Alert ref={ref}>Melding</Alert>);
      expect(ref.current).toBe(screen.getByRole("alert"));
    });
  });

  describe("Variants", () => {
    it("should render info variant with green border", () => {
      render(<Alert variant="info">Info</Alert>);
      expect(screen.getByRole("alert")).toHaveClass("border-kcvv-green-bright");
    });

    it("should render success variant", () => {
      render(<Alert variant="success">Succes</Alert>);
      expect(screen.getByRole("alert")).toHaveClass("border-kcvv-success");
    });

    it("should render warning variant", () => {
      render(<Alert variant="warning">Waarschuwing</Alert>);
      expect(screen.getByRole("alert")).toHaveClass("border-kcvv-warning");
    });

    it("should render error variant", () => {
      render(<Alert variant="error">Fout</Alert>);
      expect(screen.getByRole("alert")).toHaveClass("border-kcvv-alert");
    });

    it("should default to info variant", () => {
      render(<Alert>Default</Alert>);
      expect(screen.getByRole("alert")).toHaveClass("border-kcvv-green-bright");
    });
  });

  describe("Dismissible", () => {
    it("should not show close button by default", () => {
      render(<Alert>Melding</Alert>);
      expect(
        screen.queryByRole("button", { name: /sluit melding/i }),
      ).not.toBeInTheDocument();
    });

    it("should show close button when dismissible is true", () => {
      render(<Alert dismissible>Melding</Alert>);
      expect(
        screen.getByRole("button", { name: /sluit melding/i }),
      ).toBeInTheDocument();
    });

    it("should call onDismiss when close button is clicked", async () => {
      const user = userEvent.setup();
      const handleDismiss = vi.fn();

      render(
        <Alert dismissible onDismiss={handleDismiss}>
          Melding
        </Alert>,
      );

      await user.click(screen.getByRole("button", { name: /sluit melding/i }));
      expect(handleDismiss).toHaveBeenCalledTimes(1);
    });

    it("should not throw when close button clicked without onDismiss", async () => {
      const user = userEvent.setup();
      render(<Alert dismissible>Melding</Alert>);
      await expect(
        user.click(screen.getByRole("button", { name: /sluit melding/i })),
      ).resolves.not.toThrow();
    });
  });

  describe("Icon", () => {
    it("should render an SVG icon", () => {
      const { container } = render(<Alert>Melding</Alert>);
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("should mark icon as aria-hidden", () => {
      const { container } = render(<Alert>Melding</Alert>);
      const icon = container.querySelector("svg");
      expect(icon).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("Custom props", () => {
    it("should accept custom className", () => {
      render(<Alert className="custom-alert">Melding</Alert>);
      expect(screen.getByRole("alert")).toHaveClass("custom-alert");
    });
  });
});
