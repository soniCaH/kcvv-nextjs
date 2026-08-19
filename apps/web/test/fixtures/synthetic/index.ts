/**
 * A tiny hand-authored fixture pool, kept deliberately separate from
 * `test/fixtures/images/` — see that directory's README for why: its
 * `fixtures:sync` script deletes any file with no `manifest.json` entry
 * ("orphan cleanup"), so a synthetic asset placed there would be silently
 * removed on the next sync run.
 *
 * `colorSwatchLogo` exists for one reason: every real sponsor logo currently
 * in the production Sanity dataset (33/33, checked directly against the
 * `sponsor` document type while implementing #2655) is near-achromatic
 * line art — max per-pixel saturation under 20/255 on all but one, and that
 * one's 123/255 outlier turned out to be an 11-pixel WebP compression
 * artefact, not a real colour. A CSS `grayscale` filter is a visual no-op on
 * all of them, which makes the production fixture pool useless for proving
 * (via VR) that removing the filter actually changes a rendered pixel. This
 * swatch is unambiguously saturated so a `colorAtRest` VR baseline is
 * evidence, not a coincidence.
 *
 * Deliberately NOT run through the `images/` pool's provenance system
 * (no Sanity `_id`, no privacy/licensing question) — it depicts nothing
 * real. Used only by `SponsorTile`'s `GreyscaleAtRest`/`ColorAtRest`
 * stories; every other sponsor story keeps using the real production
 * fixtures via `fixtureImage("sponsor-logo", …)`.
 */
export const colorSwatchLogo =
  "/test-fixtures/synthetic/color-swatch-logo.webp";
