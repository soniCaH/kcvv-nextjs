/**
 * PrintDate Component Tests
 *
 * The component renders the *Belgian* calendar day (via `formatArticleDate`),
 * not the host's. The reference values below are pinned the same way — a bare
 * `new Date().getDate()` would disagree with the render on any CI run between
 * 22:00 UTC and midnight, and disagree on the year for a 31 December run.
 */
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { PrintDate } from "./PrintDate";
import { toDisplayZone } from "@/lib/utils/dates";

describe("PrintDate", () => {
  const belgianNow = () => toDisplayZone(new Date());

  it("renders a non-empty date string", () => {
    const { container } = render(<PrintDate />);
    expect(container.textContent?.trim()).not.toBe("");
  });

  it("renders the current Belgian year", () => {
    const { container } = render(<PrintDate />);
    expect(container.textContent).toContain(belgianNow().toFormat("yyyy"));
  });

  it("renders the current Belgian day number", () => {
    const { container } = render(<PrintDate />);
    expect(container.textContent).toContain(belgianNow().toFormat("d"));
  });
});
