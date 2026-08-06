import { describe, it, expect } from "vitest";

// No `vi.mock` in this file, so the module-scope form the lint rule requires
// can be a plain static import.
import Image, { size, contentType } from "./opengraph-image";

describe("default opengraph-image", () => {
  it("exports size as 1200x630", () => {
    expect(size).toEqual({ width: 1200, height: 630 });
  });

  it("exports contentType as image/png", () => {
    expect(contentType).toBe("image/png");
  });

  it("default export returns a Response", async () => {
    const response = await Image();
    expect(response).toBeInstanceOf(Response);
    expect(response.headers.get("content-type")).toContain("image/png");
  });
});
