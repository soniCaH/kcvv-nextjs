/**
 * Pure predicate behind the third throw in `.storybook/test-runner.ts`'s
 * `postVisit` block (#2803) — see the comment on the two throws there for the
 * "silent VR skip" family this joins. Storybook's own `viewport` addon
 * parameter — `parameters.viewport.defaultViewport` — only scopes the
 * Storybook preview pane; the VR runner reads `parameters.vr.viewports`
 * instead and ignores `parameters.viewport` entirely. A story that sets the
 * former without declaring `vr.viewports` (or opting out via `vr.disable`)
 * looks scoped to its author but still gets every viewport captured.
 *
 * Lives in its own module — rather than inline in `.storybook/test-runner.ts`
 * — purely so it is importable from a Vitest test (`test/hooks/test-runner-
 * viewport-scoping.test.ts`) without pulling test-runner.ts's own
 * Storybook/Playwright-facing imports into the type-check graph. postVisit
 * still owns the actual `throw`, alongside its two siblings, so all three
 * read the same way at the call site.
 */
export function unscopedDefaultViewportMessage(
  storyId: string,
  defaultViewport: string | undefined,
  hasVrViewportsDeclared: boolean,
): string | null {
  if (!defaultViewport || hasVrViewportsDeclared) return null;
  return (
    `[VR] Story "${storyId}" sets parameters.viewport.defaultViewport = ` +
    `"${defaultViewport}" without declaring parameters.vr.viewports or ` +
    `parameters.vr.disable. The VR runner ignores parameters.viewport and ` +
    `still captures every viewport unless one of those two says otherwise.`
  );
}
