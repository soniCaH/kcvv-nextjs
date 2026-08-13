/**
 * `articleTypeCardLabel` unit tests.
 *
 * The lookup is exhaustive over `ArticleType` so the compiler catches a new
 * type that forgets its word (#2404). What the compiler cannot catch is the
 * input the CMS actually sends: `articleType` is optional on the Sanity schema
 * and a legacy or draft document can carry `null`, `undefined`, or a value from
 * a since-renamed enum. Those must fall through to `undefined` rather than
 * reaching the record — a bare index would return truthy garbage for
 * `"toString"` or `"__proto__"`.
 */

import { describe, it, expect } from "vitest";
import { articleTypeCardLabel } from "./article-type-label";

describe("articleTypeCardLabel", () => {
  describe("named types", () => {
    it("labels a transfer — the type whose card changes colour", () => {
      expect(articleTypeCardLabel("transfer")).toBe("Transfer");
    });

    it.each([
      ["matchPreview", "Voorbeschouwing"],
      ["matchRecap", "Matchverslag"],
    ] as const)("labels %s", (type, label) => {
      expect(articleTypeCardLabel(type)).toBe(label);
    });
  });

  describe("deliberately unnamed types", () => {
    // These render on the calm cream surface, where the type does no visual
    // work that needs explaining. Naming them is its own card-semantics
    // decision — see the helper's docblock.
    it.each(["interview", "announcement", "event"] as const)(
      "leaves %s unlabelled",
      (type) => {
        expect(articleTypeCardLabel(type)).toBeUndefined();
      },
    );
  });

  describe("absent or unrecognised CMS values", () => {
    it.each([
      ["null", null],
      ["undefined", undefined],
      ["an empty string", ""],
      ["an unknown type", "podcast"],
      // Would resolve on `Object.prototype` if the lookup were a bare index.
      ["a prototype key", "toString"],
      ["__proto__", "__proto__"],
    ] as const)("returns undefined for %s", (_name, value) => {
      expect(articleTypeCardLabel(value)).toBeUndefined();
    });
  });
});
