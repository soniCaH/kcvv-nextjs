import { expect, test, type Page } from "@playwright/test";

// #2584 — "the sticky section nav is chrome, not content" (#2478's full
// resolution). Two invariants only a real browser can confirm (the map's own
// testing decisions single out runtime geometry as e2e-only):
//
//  1. Scroll-spy produces the right active chip — the fill means "the
//     section being read", not "the one last clicked" (rule 3).
//  2. An anchor jump — a click, or a hash landed on directly — lands the
//     target section BELOW the sticky bar, at an offset derived from the
//     bar's own measured height (rule 7), never behind it.
//
// 3 routes, per the decision's own scope: `/ploegen/[slug]` and `/hulp` each
// carry a section nav; `/jeugd#visie` carries none, so it exercises
// `globals.css`'s header-only `scroll-padding-top` base rule instead.

let teamSlugWithNav: string | null = null;

test.beforeAll(async ({ baseURL }) => {
  if (!baseURL) {
    throw new Error("playwright config baseURL is required");
  }

  const sitemapResponse = await fetch(`${baseURL}/sitemap.xml`);
  const sitemapXml = await sitemapResponse.text();
  const teamSlugs = Array.from(
    sitemapXml.matchAll(/<loc>\s*[^<]*\/ploegen\/([a-z0-9-]+)\s*<\/loc>/g),
    (m) => m[1]!,
  );

  // Not every team ships the nav today (it auto-hides at ≤1 section — #2444/
  // #2478's pre-season blindness). Scan for one that does rather than
  // assuming the sitemap's first entry — routinely a senior side with none.
  for (const slug of teamSlugs) {
    const res = await fetch(`${baseURL}/ploegen/${slug}`);
    if (!res.ok) continue;
    const html = await res.text();
    if (html.includes('data-testid="team-section-nav"')) {
      teamSlugWithNav = slug;
      break;
    }
  }
});

/** Reads the bar's own bottom edge in viewport coordinates. */
async function stickyBarBottom(page: Page, testId: string) {
  const bar = page.getByTestId(testId);
  const box = await bar.boundingBox();
  if (!box) throw new Error(`sticky bar ${testId} has no bounding box`);
  return box.y + box.height;
}

test.describe("scroll-spy fills the chip that is actually being read (#2478 rule 3)", () => {
  test("TeamSectionNav on /ploegen/[slug]", async ({ page }) => {
    test.skip(
      !teamSlugWithNav,
      "no team in the sitemap renders TeamSectionNav today (pre-season)",
    );
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`/ploegen/${teamSlugWithNav}`);

    const nav = page.getByTestId("team-section-nav");
    const links = nav.getByRole("link");
    const count = await links.count();
    test.skip(count < 2, "fewer than two sections render — nothing to spy on");

    const lastLink = links.nth(count - 1);
    const lastHref = await lastLink.getAttribute("href");
    const targetId = lastHref!.slice(1);

    await page.locator(`#${targetId}`).scrollIntoViewIfNeeded();
    // The scroll-spy IntersectionObserver settles asynchronously.
    await expect(lastLink).toHaveAttribute("aria-current", "location");

    // No other chip is also marked active — the fill is exclusive.
    for (let i = 0; i < count - 1; i++) {
      await expect(links.nth(i)).not.toHaveAttribute("aria-current");
    }
  });

  test("OrganigramSectionNav on /hulp", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/hulp");

    // "Hulp" and "Structuur" both also appear in the global header/footer —
    // scope to the section nav's own landmark so this asserts the chip, not
    // an unrelated nav link that happens to share a name.
    const nav = page.getByRole("navigation", { name: "Secties van de hub" });
    const structuur = nav.getByRole("link", { name: "Structuur" });
    const hulp = nav.getByRole("link", { name: "Hulp" });

    await page.locator("#structuur").scrollIntoViewIfNeeded();
    await expect(structuur).toHaveAttribute("aria-current", "location");
    await expect(hulp).not.toHaveAttribute("aria-current");

    // Scrolling back up flips the fill again — it tracks reading position on
    // every pass, not just the first jump.
    await page.locator("#hulp").scrollIntoViewIfNeeded();
    await expect(hulp).toHaveAttribute("aria-current", "location");
    await expect(structuur).not.toHaveAttribute("aria-current");
  });
});

test.describe("an anchor jump lands below the bar, at the derived offset (#2478 rule 7)", () => {
  test("clicking a TeamSectionNav chip lands its section below the bar", async ({
    page,
  }) => {
    test.skip(
      !teamSlugWithNav,
      "no team in the sitemap renders TeamSectionNav today (pre-season)",
    );
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`/ploegen/${teamSlugWithNav}`);

    const nav = page.getByTestId("team-section-nav");
    const links = nav.getByRole("link");
    const count = await links.count();
    test.skip(count < 1, "no sections render");

    const lastLink = links.nth(count - 1);
    const href = await lastLink.getAttribute("href");
    const targetId = href!.slice(1);

    await lastLink.click();
    // Smooth-scroll needs to settle before the geometry read is meaningful.
    await page.waitForTimeout(600);

    const barBottom = await stickyBarBottom(page, "team-section-nav");
    const targetTop = await page
      .locator(`#${targetId}`)
      .evaluate((el) => el.getBoundingClientRect().top);

    // A couple of px of slack for sub-pixel rounding — never behind the bar.
    expect(targetTop).toBeGreaterThanOrEqual(barBottom - 2);
  });

  test("clicking an OrganigramSectionNav door lands its section below the bar", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto("/hulp");

    const nav = page.getByRole("navigation", { name: "Secties van de hub" });
    await nav.getByRole("link", { name: "Structuur" }).click();
    await page.waitForTimeout(600);

    const barBox = await nav.boundingBox();
    if (!barBox) throw new Error("OrganigramSectionNav has no bounding box");
    const barBottom = barBox.y + barBox.height;

    const targetTop = await page
      .locator("#structuur")
      .evaluate((el) => el.getBoundingClientRect().top);

    expect(targetTop).toBeGreaterThanOrEqual(barBottom - 2);
  });

  test("/jeugd#visie — no section nav on this route, lands below the header alone", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/jeugd#visie");
    // The browser's own fragment navigation + globals.css's base
    // scroll-padding-top rule do the work here — no JS to wait on beyond
    // hydration completing.
    await page.waitForTimeout(300);

    const header = page.locator("header").first();
    const headerBox = await header.boundingBox();
    if (!headerBox) throw new Error("header has no bounding box");

    const targetTop = await page
      .locator("#visie")
      .evaluate((el) => el.getBoundingClientRect().top);

    expect(targetTop).toBeGreaterThanOrEqual(
      headerBox.y + headerBox.height - 2,
    );
  });
});
