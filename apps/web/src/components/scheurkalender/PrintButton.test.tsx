/**
 * PrintButton Component Tests
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PrintButton } from "./PrintButton";

describe("PrintButton", () => {
  beforeEach(() => {
    window.print = vi.fn();
  });

  it("renders a button with text 'Afdrukken'", () => {
    render(<PrintButton />);
    expect(
      screen.getByRole("button", { name: "Afdrukken" }),
    ).toBeInTheDocument();
  });

  it("calls window.print() when clicked", async () => {
    const user = userEvent.setup();
    render(<PrintButton />);
    await user.click(screen.getByRole("button", { name: "Afdrukken" }));
    expect(window.print).toHaveBeenCalledTimes(1);
  });
});
