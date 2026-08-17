/**
 * Shared action shape for the design system's page/surface "state"
 * primitives (`<ErrorState>`, `<EmptyState>`) — one canonical `label` +
 * mutually-exclusive `href`/`onClick` definition instead of two
 * hand-copied ones (#2562 review round 3).
 *
 * Deliberately NOT a shared rendering component. `<ErrorState>` needs the
 * `href` branch (renders `<LinkButton>`) plus a per-action `variant` and an
 * analytics data-attribute; `<EmptyState>`'s actions are undo-only buttons
 * with neither. A shared `StateActionRow` would have to carry ErrorState's
 * `LinkButton` import into EmptyState's bundle to support a branch EmptyState
 * never uses — the exact bundle-bloat #2562 review round 3 found and cut
 * (`EmptyStateLinkAction` had zero call sites). Each component keeps its own
 * few-line render loop; only the type is shared.
 */

export interface StateActionBase {
  label: string;
}

/** A navigation action — renders a link to `href`. */
export interface StateLinkAction extends StateActionBase {
  href: string;
  onClick?: never;
}

/** A button action — renders a button that runs `onClick`. */
export interface StateButtonAction extends StateActionBase {
  onClick: () => void;
  href?: never;
}

/**
 * Exactly one of a `href` (link) or an `onClick` (button) — the mutually-
 * exclusive `never` fields make "both" and "neither" compile errors, so an
 * action row can never render a no-op button or silently drop a handler.
 */
export type StateAction = StateLinkAction | StateButtonAction;
