/**
 * Colocated tests for the deterministic per-player figure variant + its
 * containment guard (#2635).
 *
 * Layer boundary: pure arithmetic on seeded values, no DOM, no React — the
 * guard is asserted directly against `computeFigureBoundingBox`, never by
 * rendering and measuring. See `player-figure-variant.ts` for the algorithm
 * provenance (#2542's addendum, corrected by #2590).
 */
import { describe, expect, it } from "vitest";
import {
  CONTAINMENT_MARGIN,
  FIGURE_VIEWBOX_HEIGHT,
  FIGURE_VIEWBOX_WIDTH,
  applyBottomClamp,
  applyContainmentGuard,
  computeFigureBoundingBox,
  computePlayerFigureVariant,
  djb2Seed,
  generateRawPlayerFigureVariant,
  playerFigureSeed,
  SHIRT_PATTERNS,
  SLEEVE_LENGTHS,
  STRIPE_COUNTS,
} from "./player-figure-variant";

// The real eerste-elftallen-a squad (26 outfield + keeper names), verbatim
// from `docs/design/mockups/2542-squad-photo-coverage/2542-2-variatie-studie.html`
// — the fixture the addendum's "0 clipped / 15 short → 0" numbers were
// measured against.
const A_PLOEG_SQUAD: readonly string[] = [
  "Levi Antonissen",
  "Jalal Azzaoui",
  "Jannes Bautmans",
  "Alexander Bell",
  "Amirgan Bouakhounov",
  "Gregory Boudart",
  "Arno Braspenninckx",
  "Mylan Carrasco",
  "Bixente Ceusters",
  "Rik Corthout",
  "Kevin De Jonge",
  "Michiel De Looze",
  "Stef De Reys",
  "Adil El Attabi",
  "Bilal El Bouhadifi",
  "Lucas Goovaerts",
  "Walid Houssane",
  "Tiglat Kriakos",
  "Bangali Kromah",
  "Derrick Kyere",
  "Omar Lekhechine",
  "Wout Merckaert",
  "Alec Mertens",
  "Beau Ndiaye",
  "Fahd Sakande",
  "Younes Touzani",
  "Jannes Van Hof",
  "Marnicqo Vantomme",
  "Christopher Louis Veka",
];

const BOX_EPSILON = 0.5;

describe("djb2Seed", () => {
  it("is deterministic for the same input", () => {
    expect(djb2Seed("Maxim Breugelmans")).toBe(djb2Seed("Maxim Breugelmans"));
  });

  it("produces different seeds for different names", () => {
    expect(djb2Seed("Maxim Breugelmans")).not.toBe(djb2Seed("Lars De Smet"));
  });

  it("always returns a non-negative 32-bit integer", () => {
    for (const name of A_PLOEG_SQUAD) {
      const seed = djb2Seed(name);
      expect(Number.isInteger(seed)).toBe(true);
      expect(seed).toBeGreaterThanOrEqual(0);
      expect(seed).toBeLessThanOrEqual(0xffffffff);
    }
  });
});

describe("computePlayerFigureVariant — determinism", () => {
  it("draws the same figure for the same seed on every call", () => {
    const first = computePlayerFigureVariant("player-id-1");
    const second = computePlayerFigureVariant("player-id-1");
    expect(second).toEqual(first);
  });

  it("draws a different figure for a different seed", () => {
    const a = computePlayerFigureVariant("player-id-1");
    const b = computePlayerFigureVariant("player-id-2");
    expect(a).not.toEqual(b);
  });
});

describe("playerFigureSeed — the seed's one owner", () => {
  it("seeds from the player's id, not a display name", () => {
    expect(playerFigureSeed({ id: "abc123" })).toBe("abc123");
  });

  it("two players sharing an id (the same player) get the same seed", () => {
    expect(playerFigureSeed({ id: "abc123" })).toBe(
      playerFigureSeed({ id: "abc123" }),
    );
  });

  it("two different ids get different seeds", () => {
    expect(playerFigureSeed({ id: "abc123" })).not.toBe(
      playerFigureSeed({ id: "xyz789" }),
    );
  });
});

describe("generateRawPlayerFigureVariant — lever ranges", () => {
  // Sample a broad seed range rather than just the squad — the ranges are a
  // property of the PRNG draw, not of any one name.
  const seeds = Array.from({ length: 2000 }, (_, i) => i * 104_729); // scattered, not sequential

  it("keeps every lever inside its documented span", () => {
    for (const seed of seeds) {
      const v = generateRawPlayerFigureVariant(seed);
      expect(v.scale).toBeGreaterThanOrEqual(0.84);
      expect(v.scale).toBeLessThanOrEqual(1.16);
      expect(v.rotation).toBeGreaterThanOrEqual(-0.9);
      expect(v.rotation).toBeLessThanOrEqual(0.9);
      expect(v.underprintOpacity).toBeGreaterThanOrEqual(0.74);
      expect(v.underprintOpacity).toBeLessThanOrEqual(1);
      expect(v.overprintOpacity).toBeGreaterThanOrEqual(0.82);
      expect(v.overprintOpacity).toBeLessThanOrEqual(1);
      expect(v.registrationX).toBeGreaterThanOrEqual(-3);
      expect(v.registrationX).toBeLessThanOrEqual(4);
      expect(v.registrationY).toBeGreaterThanOrEqual(-3);
      expect(v.registrationY).toBeLessThanOrEqual(4);
      expect([1, -1]).toContain(v.flip);
      expect(v.headTilt).toBeGreaterThanOrEqual(-5);
      expect(v.headTilt).toBeLessThanOrEqual(5);
      expect(v.headDy).toBeGreaterThanOrEqual(-6);
      expect(v.headDy).toBeLessThanOrEqual(6);
      expect(v.shoulderWidth).toBeGreaterThanOrEqual(0.88);
      expect(v.shoulderWidth).toBeLessThanOrEqual(1.12);
      expect(v.build).toBeGreaterThanOrEqual(0.86);
      expect(v.build).toBeLessThanOrEqual(1.14);
      expect(v.lean).toBeGreaterThanOrEqual(-3);
      expect(v.lean).toBeLessThanOrEqual(3);
      expect(v.drop).toBeGreaterThanOrEqual(-14);
      expect(v.drop).toBeLessThanOrEqual(16);
      expect(STRIPE_COUNTS).toContain(v.stripeCount);
      expect(SLEEVE_LENGTHS).toContain(v.sleeve);
      expect(SHIRT_PATTERNS).toContain(v.pattern);
    }
  });

  it("draws long sleeves roughly 45% of the time", () => {
    const longCount = seeds.filter(
      (seed) => generateRawPlayerFigureVariant(seed).sleeve === "long",
    ).length;
    const share = longCount / seeds.length;
    expect(share).toBeGreaterThan(0.35);
    expect(share).toBeLessThan(0.55);
  });

  it("draws every shirt pattern and both sleeve lengths across a sample", () => {
    const variants = seeds.map((seed) => generateRawPlayerFigureVariant(seed));
    for (const pattern of SHIRT_PATTERNS) {
      expect(variants.some((v) => v.pattern === pattern)).toBe(true);
    }
    for (const sleeve of SLEEVE_LENGTHS) {
      expect(variants.some((v) => v.sleeve === sleeve)).toBe(true);
    }
    for (const count of STRIPE_COUNTS) {
      expect(variants.some((v) => v.stripeCount === count)).toBe(true);
    }
  });
});

describe("containment guard — the top edge (#2542 addendum)", () => {
  const seeds = Array.from({ length: 3000 }, (_, i) => i * 65_537);

  it("never lets the head clear the top margin, across a wide seed range", () => {
    for (const seed of seeds) {
      const guarded = applyContainmentGuard(
        generateRawPlayerFigureVariant(seed),
      );
      const box = computeFigureBoundingBox(guarded);
      expect(box.minY).toBeGreaterThanOrEqual(CONTAINMENT_MARGIN - BOX_EPSILON);
    }
  });

  it("never lets a shoulder cross the side margins, across a wide seed range", () => {
    for (const seed of seeds) {
      const guarded = applyContainmentGuard(
        generateRawPlayerFigureVariant(seed),
      );
      const box = computeFigureBoundingBox(guarded);
      expect(box.minX).toBeGreaterThanOrEqual(CONTAINMENT_MARGIN - BOX_EPSILON);
      expect(box.maxX).toBeLessThanOrEqual(
        FIGURE_VIEWBOX_WIDTH - CONTAINMENT_MARGIN + BOX_EPSILON,
      );
    }
  });
});

describe("bottom clamp — the ground line (#2590 correction)", () => {
  const seeds = Array.from({ length: 3000 }, (_, i) => i * 65_537);

  it("never lets the figure stop short of the viewBox bottom", () => {
    for (const seed of seeds) {
      const variant = computePlayerFigureVariant(String(seed));
      const box = computeFigureBoundingBox(variant);
      expect(box.maxY).toBeGreaterThanOrEqual(
        FIGURE_VIEWBOX_HEIGHT - BOX_EPSILON,
      );
    }
  });

  it("leaves a figure that already bleeds past the bottom untouched", () => {
    // Find a seed whose pre-clamp box already runs past the viewBox bottom
    // and assert the clamp is a no-op for it (bleed stays free).
    let found = false;
    for (let seed = 0; seed < 5000 && !found; seed += 1) {
      const guarded = applyContainmentGuard(
        generateRawPlayerFigureVariant(seed),
      );
      const beforeClamp = computeFigureBoundingBox(guarded);
      if (beforeClamp.maxY > FIGURE_VIEWBOX_HEIGHT + 1) {
        found = true;
        const clamped = applyBottomClamp(guarded);
        // Same drop → clamp added nothing, because the bleed already clears.
        expect(clamped.drop).toBeCloseTo(guarded.drop, 5);
      }
    }
    expect(found).toBe(true);
  });
});

describe("the real A-ploeg squad — the fixture the AC numbers were measured against", () => {
  const variants = A_PLOEG_SQUAD.map((name) => ({
    name,
    variant: computePlayerFigureVariant(name),
  }));
  const boxes = variants.map(({ variant }) =>
    computeFigureBoundingBox(variant),
  );

  it("clips no figure at the top", () => {
    for (const box of boxes) {
      expect(box.minY).toBeGreaterThanOrEqual(CONTAINMENT_MARGIN - BOX_EPSILON);
    }
  });

  it("leaves no figure short at the bottom", () => {
    for (const box of boxes) {
      expect(box.maxY).toBeGreaterThanOrEqual(
        FIGURE_VIEWBOX_HEIGHT - BOX_EPSILON,
      );
    }
  });

  it("still spreads scale across the squad after the guard runs", () => {
    const scales = variants.map(({ variant }) => variant.scale);
    expect(Math.max(...scales) - Math.min(...scales)).toBeGreaterThan(0.2);
  });

  it("still mirrors a meaningful share of the squad", () => {
    const mirrored = variants.filter(
      ({ variant }) => variant.flip === -1,
    ).length;
    expect(mirrored).toBeGreaterThan(0);
    expect(mirrored).toBeLessThan(A_PLOEG_SQUAD.length);
  });

  it("every shirt pattern and sleeve length survives the guard", () => {
    for (const pattern of SHIRT_PATTERNS) {
      expect(variants.some(({ variant }) => variant.pattern === pattern)).toBe(
        true,
      );
    }
    for (const sleeve of SLEEVE_LENGTHS) {
      expect(variants.some(({ variant }) => variant.sleeve === sleeve)).toBe(
        true,
      );
    }
  });
});
