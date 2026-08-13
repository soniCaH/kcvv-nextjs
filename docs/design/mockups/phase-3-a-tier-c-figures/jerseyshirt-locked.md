# `<JerseyShirt>` — locked design (Phase 3, Checkpoint A)

**Status:** awaiting owner sign-off.
**Issue:** #1525 · sub-issue 3.A.2.

## Scope (reduced from master design)

The component is **decorative only**. Originally master design §5.1 step 9 placed `<JerseyShirt>` inside the WebshopStrip as a 4-up product row — that is now scoped out. Real product photography is required to drive webshop conversions; illustrations don't sell shirts.

Remaining use case (master design §5.1 step 8 — YouthBlock):

- A single decorative jersey tile on a `<TapedCard>`, sitting inside the full-bleed jersey-bg youth-block band.
- An optional `letterOverlay` (e.g. `"U11"`, `"A"`) painted across the chest in display 900.

If a future surface needs another jersey illustration, it inherits this single rendering — no `home / away / retro / training` variants ship in v1.

## Composition

`<JerseyShirt>` is a single SVG composition built on the same two-pass print vocabulary as `<PlayerFigure>`'s illustration-state, with **inverted palette**:

- **Underprint pass** — ink (`#0a0a0a`) flat fill of the torso silhouette (head + shoulder bumps clipped from the figure).
- **Overprint pass** — jersey-deep (`#008755`) stroked outline of the torso, V-collar, four vertical stripes, registered 2-3px down-right of the underprint via `mix-blend-mode: multiply`.
- **Optional letter overlay** — Freight Display 900 glyph, cream fill, 4-direction ink stroke shim, centred on the chest.

### Torso path provenance (identical to PlayerFigure illustration)

The torso silhouette must be **byte-identical** to the path used in `option-b-stamped-block-print.html` `#player-figure` lines 720-756 (the canonical PlayerFigure illustration). Paths to copy verbatim:

```svg
<!-- underprint body -->
<path d="M 30 300 L 40 168 Q 60 138 110 130 Q 160 138 180 168 L 190 300 Z" />

<!-- overprint outline -->
<path d="M 30 300 L 40 168 Q 60 138 110 130 Q 160 138 180 168 L 190 300" />

<!-- V-collar -->
<path d="M 92 132 L 110 156 L 128 132" />

<!-- four vertical stripes -->
<path d="M 70 168 L 70 300" stroke-width="2" />
<path d="M 88 158 L 88 300" stroke-width="2" />
<path d="M 132 158 L 132 300" stroke-width="2" />
<path d="M 150 168 L 150 300" stroke-width="2" />
```

`viewBox="0 120 220 180"` to crop the head out and frame the torso/jersey only.

**Do not redraw the silhouette** — the cohesion contract requires literal path reuse, not a similar-looking facsimile. When implementing, extract the SVG path defs to a shared module under `apps/web/src/components/design-system/_jersey-paths.ts` (or equivalent) and import the same path strings into both `<PlayerFigure>` and `<JerseyShirt>`.

## Component API

```typescript
type JerseyShirtProps = {
  /** Optional editor-supplied letter overlay (e.g. "U11", "A"). Rendered in Freight Display 900 over the chest. */
  letterOverlay?: string;
};
```

The `ariaLabel` prop was removed by [#2559](https://github.com/soniCaH/www.kcvvelewijt.be/issues/2559), which made this doc's own "purely decorative" claim binding: the shirt is one drawing standing in for everybody, so it identifies nobody and takes `aria-hidden` rather than a name.

No variants, no kit selector, no sponsor slot.

## Field source mapping

`<JerseyShirt>` is purely decorative — it has **no Sanity fields of its own**. Letter overlay is supplied by the calling page (e.g. YouthBlock might pull a team's age-group label from the team document). When no overlay is supplied, the jersey renders without one.

## A11y

- Wrap the SVG composition in `<figure aria-hidden="true">`. Superseded by [#2559](https://github.com/soniCaH/www.kcvvelewijt.be/issues/2559): the figure was originally `aria-label={ariaLabel}`, but one drawing standing in for everybody identifies nobody, so the whole illustration is hidden from assistive tech rather than labelled.
- Underprint and overprint SVGs are decorative — `aria-hidden="true"`.
- The letter overlay is always decorative. Whatever it stands for is named by the surrounding context (the YouthBlock kicker already says `U11`, the error page's mono code line already says `404`); a standalone consumer names it in the surface, not on the shirt.

## Reference renders

- Specimen view: `screenshots/jersey-shirt-mockup.png`
- Mockup HTML (with full SVG markup): `/tmp/jersey-shirt-mockup.html` — port to a permanent location alongside the other locked-spec mockups when implementation begins.

## Master design deltas

1. §4.4 catalogue — change `<JerseyShirt>` description from "stylised jersey thumbnail" to "single decorative jersey illustration sharing PlayerFigure's two-pass vocabulary; used in YouthBlock only."
2. §5.1 step 9 (WebshopStrip) — replace `<JerseyShirt>` with product photography; the WebshopStrip is no longer a JerseyShirt consumer.
3. §5.1 step 8 (YouthBlock) — confirm `<JerseyShirt letterOverlay="U11" />` as the only consumer.

## Approval checklist

- [ ] Scope reduced to YouthBlock only — no webshop variants ship.
- [ ] Single SVG composition; no `home / away / retro / training` variant prop.
- [ ] Two-pass print vocabulary identical to PlayerFigure illustration; **palette inverted** (ink underprint + jersey-deep overprint).
- [ ] Torso path + V-collar + stripe positions reused **verbatim** from `option-b-stamped-block-print.html` `#player-figure` markup. Implementation extracts paths to a shared module.
- [ ] Optional `letterOverlay` prop, no Sanity field; calling page supplies the value.
- [ ] No sponsors, no Celtic green/white stripes, no photo-realism.
- [ ] `<figure>` wrapper and SVGs all `aria-hidden` (amended by #2559 — was `aria-label` on the figure).

Reply "approved" — Checkpoint A is then fully locked.
