import { expect, test, type Page, type Locator } from "@playwright/test";
import { discoverRouteFixtures, type RouteFixtures } from "./helpers/fixtures";

// #2577 — "one scroll arrow in two registers, held space by real overflow"
// (#2444, as amended by #2476, #2478 and #2489). Source-scan and Storybook
// can fix a scroller's geometry per fixture, but only a real browser at a
// real viewport can confirm the arrow's mount/unmount actually tracks the
// track's live `scrollWidth`/`clientWidth` — the map's own testing
// decisions single this out as e2e-only ("runtime geometry no source scan
// can see").
//
// Rather than asserting a specific viewport overflows a specific route
// (fragile against CMS content and pre-season data gaps — several of these
// rows render zero items today), every case below asserts the *invariant*
// the acceptance criterion actually states: at the viewport under test, an
// arrow is mounted in a given direction if and only if the track can
// actually scroll that way. That holds regardless of which side of the
// overflow boundary today's real content happens to land on.

let fixtures: RouteFixtures;
/** Every `/ploegen/[slug]` in the sitemap — `fixtures.teamSlug` is only the
 * first one, and #2444/#2478 already recorded that whether a team's section
 * nav renders at all (let alone overflows) is pre-season-dependent per
 * team: the senior sides currently ship ≤1 section (no nav at all) while
 * several youth sides ship enough for the nav to appear. Scanning the full
 * list, not just the first slug, is what makes the TeamSectionNav case
 * below exercise the real thing instead of silently no-op-ing on whichever
 * team happens to sort first. */
let teamSlugs: string[] = [];

test.beforeAll(async ({ baseURL }) => {
  if (!baseURL) {
    throw new Error("playwright config baseURL is required");
  }
  fixtures = await discoverRouteFixtures(baseURL);

  const sitemapResponse = await fetch(`${baseURL}/sitemap.xml`);
  const sitemapXml = await sitemapResponse.text();
  teamSlugs = Array.from(
    sitemapXml.matchAll(/<loc>\s*[^<]*\/ploegen\/([a-z0-9-]+)\s*<\/loc>/g),
    (m) => m[1]!,
  );
});

async function readOverflow(track: Locator) {
  const { scrollWidth, clientWidth, scrollLeft } = await track.evaluate(
    (el) => ({
      scrollWidth: el.scrollWidth,
      clientWidth: el.clientWidth,
      scrollLeft: el.scrollLeft,
    }),
  );
  const DEAD_ZONE = 10;
  return {
    overflows: scrollWidth - clientWidth > DEAD_ZONE,
    canScrollRight: scrollLeft < scrollWidth - clientWidth - DEAD_ZONE,
    canScrollLeft: scrollLeft > DEAD_ZONE,
  };
}

/**
 * Asserts the arrow/overflow invariant for an "overlay" scroller — a table
 * or a diagram, content you scroll past rather than a row of tap targets
 * (#2444, as amended by #2476). No held space: a "Scroll right"/"Scroll
 * left" control mounts and unmounts per direction, exactly matching
 * `canScrollLeft`/`canScrollRight` independently. Scoped to `within` so a
 * page with more than one scroller doesn't cross-match.
 */
async function assertOverlayArrowMatchesOverflow(
  within: Page | Locator,
  track: Locator,
) {
  await expect(track).toHaveCount(1);
  const { canScrollLeft, canScrollRight } = await readOverflow(track);

  const rightArrow = within.getByLabel("Scroll right");
  const leftArrow = within.getByLabel("Scroll left");

  if (canScrollRight) {
    await expect(rightArrow).toBeVisible();
  } else {
    await expect(rightArrow).toHaveCount(0);
  }

  if (canScrollLeft) {
    await expect(leftArrow).toBeVisible();
  } else {
    await expect(leftArrow).toHaveCount(0);
  }
}

/**
 * Asserts the arrow/overflow invariant for a "rail" scroller — a row of
 * discrete things (chips, nav items, crumbs), which holds a 40px gutter on
 * *both* sides exactly when the track overflows at all (#2489 resolution
 * part 1), never per direction. Both arrows mount together and the spent
 * direction **disables in place** rather than unmounting (#2489 resolution
 * part 3) — the property under test here is presence-vs-absence-as-a-pair
 * plus each direction's `disabled` state, not per-direction mount/unmount.
 */
async function assertRailArrowMatchesOverflow(
  within: Page | Locator,
  track: Locator,
) {
  await expect(track).toHaveCount(1);
  const { overflows, canScrollLeft, canScrollRight } =
    await readOverflow(track);

  const rightArrow = within.getByLabel("Scroll right");
  const leftArrow = within.getByLabel("Scroll left");

  if (!overflows) {
    await expect(rightArrow).toHaveCount(0);
    await expect(leftArrow).toHaveCount(0);
    return;
  }

  await expect(rightArrow).toBeVisible();
  await expect(leftArrow).toBeVisible();
  if (canScrollRight) {
    await expect(rightArrow).toBeEnabled();
  } else {
    await expect(rightArrow).toBeDisabled();
  }
  if (canScrollLeft) {
    await expect(leftArrow).toBeEnabled();
  } else {
    await expect(leftArrow).toBeDisabled();
  }
}

test.describe("scroll arrow — mounts only on real overflow at that width", () => {
  test("FilterTabs on /nieuws — desktop (1280px)", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/nieuws");
    const group = page.getByRole("group", { name: /filter/i }).first();
    // The arrows are the group's own siblings inside FilterTabs' outer
    // `relative` wrapper, not its descendants — scope the label lookup to
    // that wrapper (the group's parent), not the group itself.
    const wrapper = group.locator("..");
    await assertRailArrowMatchesOverflow(wrapper, group);
  });

  test("FilterTabs on /nieuws — narrow phone (360px), where the category row is known to overflow", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto("/nieuws");
    const group = page.getByRole("group", { name: /filter/i }).first();
    const wrapper = group.locator("..");
    await assertRailArrowMatchesOverflow(wrapper, group);
  });

  test("HorizontalSlider (RelatedRow) on /nieuws/[slug] — desktop and mobile", async ({
    page,
  }) => {
    const slug = Object.values(fixtures.articleSlugByType).find(
      (s): s is string => s !== null,
    );
    test.skip(!slug, "no article slugs in sitemap");

    for (const viewport of [
      { width: 1440, height: 900 },
      { width: 375, height: 800 },
    ]) {
      await page.setViewportSize(viewport);
      await page.goto(`/nieuws/${slug}`);
      const track = page.locator('[data-slot="scroll-track"]').first();
      // The related row is optional (auto-hides at zero items) — skip this
      // viewport iteration honestly rather than fail if it isn't present.
      if ((await track.count()) === 0) continue;
      // The arrows are the track's own siblings inside HorizontalSlider's
      // `relative` wrapper, not its descendants — and scoping to that
      // wrapper (rather than the whole page) also keeps this test honest
      // if the article body also carries an HtmlTableBlock scroller.
      const wrapper = track.locator("..");
      await assertOverlayArrowMatchesOverflow(wrapper, track);
    }
  });

  test("TeamSectionNav on /ploegen/[slug] — narrow phone (360px)", async ({
    page,
  }) => {
    test.skip(teamSlugs.length === 0, "no team slugs in sitemap");
    await page.setViewportSize({ width: 360, height: 800 });

    // Not every team ships the nav today (it auto-hides at ≤1 section,
    // #2444/#2478's pre-season blindness) — scan for a team that does
    // rather than asserting only against the first sitemap entry, which is
    // routinely a senior side with no nav at all.
    let nav;
    for (const slug of teamSlugs) {
      await page.goto(`/ploegen/${slug}`);
      const candidate = page.getByTestId("team-section-nav");
      if ((await candidate.count()) > 0) {
        nav = candidate;
        break;
      }
    }
    test.skip(
      !nav,
      "no team in the sitemap renders TeamSectionNav today (≤1 section on every team — pre-season)",
    );

    const list = nav!.locator("ul").first();
    await assertRailArrowMatchesOverflow(nav!, list);
  });

  test("HtmlTableBlock in an article body — desktop and mobile", async ({
    page,
  }) => {
    const slug = Object.values(fixtures.articleSlugByType).find(
      (s): s is string => s !== null,
    );
    test.skip(!slug, "no article slugs in sitemap");

    for (const viewport of [
      { width: 1440, height: 900 },
      { width: 375, height: 800 },
    ]) {
      await page.setViewportSize(viewport);
      await page.goto(`/nieuws/${slug}`);
      const region = page.locator('[data-html-table="true"] [role="region"]');
      if ((await region.count()) === 0) continue;
      // HtmlTableBlock never mounts a left arrow (sticky first column
      // covers that edge, see the component's own docblock) — only assert
      // the right side.
      const { scrollWidth, clientWidth } = await region
        .first()
        .evaluate((el) => ({
          scrollWidth: el.scrollWidth,
          clientWidth: el.clientWidth,
        }));
      const expectCanScrollRight = scrollWidth - clientWidth > 10;
      const rightArrow = page
        .locator('[data-html-table="true"]')
        .first()
        .getByLabel("Scroll right");
      if (expectCanScrollRight) {
        await expect(rightArrow).toBeVisible();
      } else {
        await expect(rightArrow).toHaveCount(0);
      }
    }
  });
});
