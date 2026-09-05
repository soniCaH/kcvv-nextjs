/**
 * Regression fixture for the third throw in `.storybook/test-runner.ts`'s
 * `postVisit` block (#2803): a `vr`-tagged story that sets a Storybook
 * viewport override — `globals.viewport.value` (the live Storybook 10 API)
 * or `parameters.viewport.defaultViewport` (removed in Storybook 10, inert
 * either way) — believes that scopes the VR capture. It does not — the
 * runner reads `parameters.vr.viewports` instead and ignores both, so the
 * story silently still gets every viewport captured.
 *
 * The decision itself (`unscopedViewportOverrideMessage`, in this same
 * directory's `viewport-scoping.ts`) is a pure function specifically so it
 * can be exercised here without a Playwright page — the `throw` that
 * consumes it stays inline in `postVisit`, alongside its two siblings (empty
 * `vr.viewports`, unknown viewport names), so all three read the same way at
 * the call site. This file cannot reach that call site directly: `postVisit`
 * only runs inside the real `test-storybook` runner against a live page.
 *
 * Filed beside the module it guards, not under `test/hooks/` — that
 * directory means git hooks in this repo (its only other file tests
 * `.husky/branch-guard.sh` and `.claude/hooks/check-branch.sh`).
 */
import { describe, expect, it } from "vitest";
import {
  VR_VIEWPORT_NAMES,
  unscopedViewportOverrideMessage,
} from "./viewport-scoping";

describe("VR_VIEWPORT_NAMES", () => {
  it("is the ordered mobile/tablet/desktop set the runner captures", () => {
    expect(VR_VIEWPORT_NAMES).toEqual(["mobile", "tablet", "desktop"]);
  });
});

describe("unscopedViewportOverrideMessage", () => {
  it("throws-worthy: globals.viewport.value set, vr.viewports not declared", () => {
    const message = unscopedViewportOverrideMessage(
      "features-home-clubshopbanner--mobile",
      "mobile1",
      false,
    );
    expect(message).toContain(
      '[VR] Story "features-home-clubshopbanner--mobile" sets a Storybook viewport override ("mobile1"',
    );
    expect(message).toContain("parameters.vr.viewports");
    expect(message).toContain("parameters.vr.disable");
  });

  it("is silent when no viewport override is set", () => {
    expect(
      unscopedViewportOverrideMessage("ui-button--default", undefined, false),
    ).toBeNull();
  });

  it("is silent when vr.viewports is already declared", () => {
    expect(
      unscopedViewportOverrideMessage(
        "features-teams-teamagendarow--placeholder-long-subject-narrow",
        "kcvvMobile",
        true,
      ),
    ).toBeNull();
  });
});
