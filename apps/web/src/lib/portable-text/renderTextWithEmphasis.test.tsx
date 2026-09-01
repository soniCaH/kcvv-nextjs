import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { renderTextWithEmphasis } from "./renderTextWithEmphasis";

describe("renderTextWithEmphasis", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it("returns the plain body unchanged when matchText is undefined", () => {
    const result = renderTextWithEmphasis("Een tribune die zingt", undefined);
    expect(result).toBe("Een tribune die zingt");
  });

  it("wraps the matched substring in <HighlighterStroke> (no font change)", () => {
    const { container } = render(
      <>
        {renderTextWithEmphasis(
          "Een tribune die zingt is meer waard",
          "tribune",
        )}
      </>,
    );
    expect(container.querySelector("[data-highlighter-stroke]")).not.toBeNull();
    // No <em> — the emphasis is the highlighter alone; font stays italic
    // wherever the caller renders the resulting node.
    expect(container.querySelector("em")).toBeNull();
    expect(container.textContent).toBe("Een tribune die zingt is meer waard");
  });

  it("returns the plain body unchanged when matchText is not found", () => {
    const result = renderTextWithEmphasis(
      "Een tribune die zingt",
      "nonexistent",
    );
    expect(result).toBe("Een tribune die zingt");
  });

  it("warns in dev when matchText is not found in the body", () => {
    vi.stubEnv("NODE_ENV", "development");
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    renderTextWithEmphasis("Een tribune die zingt", "nonexistent");
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("not found"));
  });
});
