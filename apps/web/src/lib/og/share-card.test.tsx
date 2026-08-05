import { describe, it, expect } from "vitest";
import {
  fitNameSize,
  renderShareCard,
  OG_SIZE,
  OG_CONTENT_TYPE,
} from "./share-card";

describe("share-card", () => {
  it("exports the OG contract every route re-exports", () => {
    expect(OG_SIZE).toEqual({ width: 1200, height: 630 });
    expect(OG_CONTENT_TYPE).toBe("image/png");
  });

  describe("fitNameSize", () => {
    it("keeps short names at the display ceiling", () => {
      expect(fitNameSize(["Jan", "Peeters"])).toBe(64);
    });

    it("steps a long name down so it stays inside the column", () => {
      // 0.6em advance × 24 chars must fit the 760px name column.
      const size = fitNameSize(["Kevin", "Vanden Bossche-Verlin"]);
      expect(size).toBeLessThan(64);
      expect(size * 0.6 * "Vanden Bossche-Verlin".length).toBeLessThanOrEqual(
        760,
      );
    });

    it("never drops below the legibility floor", () => {
      expect(fitNameSize(["x".repeat(200)])).toBe(28);
    });

    it("measures the longest line, not the last", () => {
      expect(fitNameSize(["Van Ransbeeck", "Jan"])).toBe(
        fitNameSize(["Van Ransbeeck"]),
      );
    });
  });

  describe("renderShareCard", () => {
    it("renders a PNG for a player with a shirt number", async () => {
      const response = await renderShareCard({
        stampText: "10",
        nameTop: "Kevin",
        nameBottom: "Van Ransbeeck",
        meta: "Middenvelder",
      });
      expect(response).toBeInstanceOf(Response);
      expect(response.headers.get("content-type")).toContain("image/png");
    });

    it("renders a PNG when the stamp falls back to the crest", async () => {
      const response = await renderShareCard({
        nameTop: "KCVV Elewijt",
        nameBottom: "U15",
        meta: "Middenbouw",
      });
      expect(response).toBeInstanceOf(Response);
      expect(response.headers.get("content-type")).toContain("image/png");
    });

    it("renders a PNG with no meta line", async () => {
      const response = await renderShareCard({
        nameTop: "KCVV",
        nameBottom: "Elewijt",
      });
      expect(response).toBeInstanceOf(Response);
    });
  });
});
