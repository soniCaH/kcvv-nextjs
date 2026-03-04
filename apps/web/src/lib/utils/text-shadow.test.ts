/**
 * text-shadow.ts Tests
 */

import { describe, it, expect } from "vitest";
import {
  generateTextShadow,
  getBadgeTextShadow,
  BADGE_SHADOWS,
} from "./text-shadow";

describe("text-shadow", () => {
  describe("generateTextShadow", () => {
    it("should generate text-shadow CSS value string", () => {
      const shadow = generateTextShadow(0.25, 8, "#4B9B48");
      // Returns the value, not the property (no "text-shadow:" prefix)
      expect(shadow).toContain("#4B9B48");
      expect(shadow).toContain("px");
    });

    it("should include multiple shadow layers", () => {
      const shadow = generateTextShadow(0.25, 8, "#4B9B48");
      // Shadow string should have multiple comma-separated values
      const commaCount = (shadow.match(/,/g) || []).length;
      expect(commaCount).toBeGreaterThan(5);
    });

    it("should use the specified color", () => {
      const shadow = generateTextShadow(0.25, 6, "#1e3a5f");
      expect(shadow).toContain("#1e3a5f");
    });
  });

  describe("getBadgeTextShadow", () => {
    it("should return text-shadow for green color", () => {
      const shadow = getBadgeTextShadow("green");
      expect(shadow).toContain("#4B9B48");
    });

    it("should return text-shadow for navy color", () => {
      const shadow = getBadgeTextShadow("navy");
      expect(shadow).toContain("#1e3a5f");
    });

    it("should return text-shadow for blue color", () => {
      const shadow = getBadgeTextShadow("blue");
      expect(shadow).toContain("#3b82f6");
    });

    it("should use lg size by default", () => {
      const shadowDefault = getBadgeTextShadow("green");
      const shadowLg = getBadgeTextShadow("green", "lg");
      expect(shadowDefault).toEqual(shadowLg);
    });

    it("should generate different shadows for different sizes", () => {
      const shadowSm = getBadgeTextShadow("green", "sm");
      const shadowMd = getBadgeTextShadow("green", "md");
      const shadowLg = getBadgeTextShadow("green", "lg");

      // Each size should produce a different shadow
      expect(shadowSm).not.toEqual(shadowMd);
      expect(shadowMd).not.toEqual(shadowLg);
    });
  });

  describe("BADGE_SHADOWS", () => {
    it("should have pre-calculated shadows for green", () => {
      expect(BADGE_SHADOWS.green.sm).toBeDefined();
      expect(BADGE_SHADOWS.green.md).toBeDefined();
      expect(BADGE_SHADOWS.green.lg).toBeDefined();
    });

    it("should have pre-calculated shadows for navy", () => {
      expect(BADGE_SHADOWS.navy.sm).toBeDefined();
      expect(BADGE_SHADOWS.navy.md).toBeDefined();
      expect(BADGE_SHADOWS.navy.lg).toBeDefined();
    });

    it("should have pre-calculated shadows for blue", () => {
      expect(BADGE_SHADOWS.blue.sm).toBeDefined();
      expect(BADGE_SHADOWS.blue.md).toBeDefined();
      expect(BADGE_SHADOWS.blue.lg).toBeDefined();
    });

    it("should match getBadgeTextShadow output", () => {
      // Pre-calculated should match dynamic generation
      expect(BADGE_SHADOWS.green.lg).toEqual(getBadgeTextShadow("green", "lg"));
      expect(BADGE_SHADOWS.navy.md).toEqual(getBadgeTextShadow("navy", "md"));
      expect(BADGE_SHADOWS.blue.sm).toEqual(getBadgeTextShadow("blue", "sm"));
    });
  });
});
