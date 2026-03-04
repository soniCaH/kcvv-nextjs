/**
 * PrintDate Component Tests
 */
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { PrintDate } from "./PrintDate";

describe("PrintDate", () => {
  it("renders a non-empty date string", () => {
    const { container } = render(<PrintDate />);
    expect(container.textContent?.trim()).not.toBe("");
  });

  it("renders the current year", () => {
    const { container } = render(<PrintDate />);
    expect(container.textContent).toContain(
      new Date().getFullYear().toString(),
    );
  });

  it("renders the current day number", () => {
    const { container } = render(<PrintDate />);
    expect(container.textContent).toContain(new Date().getDate().toString());
  });
});
