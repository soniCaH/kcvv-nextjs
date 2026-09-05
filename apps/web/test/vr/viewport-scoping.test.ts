/**
 * Regression fixture for the third throw in `.storybook/test-runner.ts`'s
 * `postVisit` block (#2803): a `vr`-tagged story that sets Storybook's own
 * `parameters.viewport.defaultViewport` believes that scopes the VR capture.
 * It does not — the runner reads `parameters.vr.viewports` instead and
 * ignores `parameters.viewport` entirely, so the story silently still gets
 * every viewport captured.
 *
 * The decision itself (`unscopedDefaultViewportMessage`, in
 * `test/vr/viewport-scoping.ts`) is a pure function specifically so it can be
 * exercised here without a Playwright page — the `throw` that consumes it
 * stays inline in `postVisit`, alongside its two siblings (empty
 * `vr.viewports`, unknown viewport names), so all three read the same way at
 * the call site. This file cannot reach that call site directly: `postVisit`
 * only runs inside the real `test-storybook` runner against a live page.
 */
import { describe, expect, it } from "vitest";
import { unscopedDefaultViewportMessage } from "../vr/viewport-scoping";

describe("unscopedDefaultViewportMessage", () => {
  it("throws-worthy: defaultViewport set, vr.viewports not declared", () => {
    const message = unscopedDefaultViewportMessage(
      "features-home-clubshopbanner--mobile",
      "mobile1",
      false,
    );
    expect(message).toContain(
      '[VR] Story "features-home-clubshopbanner--mobile" sets parameters.viewport.defaultViewport = "mobile1"',
    );
    expect(message).toContain("parameters.vr.viewports");
    expect(message).toContain("parameters.vr.disable");
  });

  it("is silent when defaultViewport is not set", () => {
    expect(
      unscopedDefaultViewportMessage("ui-button--default", undefined, false),
    ).toBeNull();
  });

  it("is silent when vr.viewports is already declared", () => {
    expect(
      unscopedDefaultViewportMessage(
        "features-teams-teamagendarow--placeholder-long-subject-narrow",
        "kcvvMobile",
        true,
      ),
    ).toBeNull();
  });
});
