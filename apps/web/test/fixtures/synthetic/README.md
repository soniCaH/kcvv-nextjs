# Synthetic Fixtures

A small, hand-authored fixture pool — the exception to `test/fixtures/images/`'s
"always sourced from production, never hand-edited" rule, and kept in its own
directory precisely so it never collides with that rule.

## Why this directory exists, and not `test/fixtures/images/`

`test/fixtures/images/`'s `fixtures:sync` script deletes any file on disk that
has no `manifest.json` entry ("orphan cleanup" — see that directory's
README). A hand-authored file dropped in there would be silently removed the
next time someone runs a sync. This directory is outside that script's scan
path, so nothing here is ever auto-deleted, and nothing here is ever mistaken
for production-sourced content.

## What's here

- `color-swatch-logo.svg` — the checked-in source, rasterised to the `.webp`
  below via `sharp` (`npx tsx -e '...'`, or any script that pipes the SVG
  through `sharp().webp()`). Regenerate the `.webp` from this file rather
  than hand-editing the binary if the swatch ever needs to change.
- `color-swatch-logo.webp` — a synthetic, unambiguously saturated logo-shaped
  graphic (max per-pixel saturation ~205/255). Built while implementing
  [#2655](https://github.com/soniCaH/www.kcvvelewijt.be/issues/2655) after
  confirming, against the live production dataset, that all 33 real sponsor
  logos are near-achromatic line art (max saturation under 20/255, one
  123/255 outlier traced to an 11-pixel WebP compression artefact, not real
  colour). A CSS `grayscale` filter is a visual no-op on every real sponsor
  logo, which makes the `images/` pool unable to prove — via a VR baseline —
  that removing the filter changes anything. This swatch exists solely to
  make that proof possible. It depicts nothing real; there is no privacy or
  licensing question.

  Used only by `SponsorTile`'s `GreyscaleAtRest`/`ColorAtRest` stories,
  imported via `@test-fixtures/synthetic`. Every other sponsor story keeps
  using the real production fixtures (`fixtureImage("sponsor-logo", …)` from
  `@test-fixtures/images`).

## Adding another synthetic fixture

Keep the bar high — this pool exists for cases where real content
structurally cannot make a point (as above), not as a shortcut around
`fixtures:sync`. Regenerate deterministically (a checked-in SVG source
rasterised with `sharp`, or similar) rather than hand-drawing a binary, and
document the "why" in this file the way `color-swatch-logo.webp` is
documented above.
