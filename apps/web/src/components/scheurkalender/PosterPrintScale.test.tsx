/**
 * PosterPrintScale Tests
 *
 * The fit is the only thing standing between a long season and fixtures
 * clipped off the bottom of the poster, so both bounds get a case.
 */
import { describe, it, expect, afterEach } from "vitest";
import { render } from "@testing-library/react";
import { PosterPrintScale } from "./PosterPrintScale";

const PX_PER_MM = 96 / 25.4;
const SHEET_WIDTH_PX = 796;
const WIDTH_FIT = (340 * PX_PER_MM) / SHEET_WIDTH_PX;

/** A sheet in the document with a stubbed height — jsdom lays nothing out. */
function mountSheet(scrollHeight: number): HTMLElement {
  const sheet = document.createElement("div");
  sheet.className = "sk-poster-sheet";
  Object.defineProperty(sheet, "scrollHeight", {
    configurable: true,
    value: scrollHeight,
  });
  document.body.appendChild(sheet);
  return sheet;
}

function readScale(): number {
  return Number(
    document.documentElement.style.getPropertyValue("--sk-poster-scale"),
  );
}

afterEach(() => {
  document.documentElement.style.removeProperty("--sk-poster-scale");
  document.querySelectorAll(".sk-poster-sheet").forEach((el) => el.remove());
});

describe("PosterPrintScale", () => {
  it("scales a long season down so it fits the block height", () => {
    const sheetHeight = 1464; // 26/27: 56 fixtures, taller than the block
    mountSheet(sheetHeight);
    render(<PosterPrintScale />);

    window.dispatchEvent(new Event("beforeprint"));

    expect(readScale()).toBeCloseTo((567 * PX_PER_MM) / sheetHeight, 4);
    expect(readScale()).toBeLessThan(WIDTH_FIT);
  });

  it("never scales a short season past the block width", () => {
    mountSheet(200);
    render(<PosterPrintScale />);

    window.dispatchEvent(new Event("beforeprint"));

    expect(readScale()).toBeCloseTo(WIDTH_FIT, 4);
  });

  it("leaves the sheet's own width untouched after measuring", () => {
    const sheet = mountSheet(1464);
    sheet.style.width = "500px";
    render(<PosterPrintScale />);

    window.dispatchEvent(new Event("beforeprint"));

    expect(sheet.style.width).toBe("500px");
  });

  it("stops measuring once unmounted", () => {
    mountSheet(1464);
    const { unmount } = render(<PosterPrintScale />);
    unmount();

    window.dispatchEvent(new Event("beforeprint"));

    expect(
      document.documentElement.style.getPropertyValue("--sk-poster-scale"),
    ).toBe("");
  });
});
