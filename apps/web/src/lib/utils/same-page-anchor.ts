import type { MouseEvent } from "react";

/**
 * Bypasses Next's App Router for in-page-anchor nav links that target the page
 * we're already on (e.g. `/hulp#structuur`, `/ploegen/x#spelers`).
 *
 * When a page is hard-loaded with a hash already in the URL, Next seeds the
 * route's `canonicalUrl` *with* that hash. A subsequent same-page `<Link>` click
 * then computes `route.canonicalUrl + url.hash`, duplicating the fragment
 * (`/hulp#structuur#structuur…`). Intercepting the click and scrolling natively
 * sidesteps that path entirely. Cross-page links (different pathname) fall
 * through to normal SPA `<Link>` navigation.
 *
 * Wire it into a `<Link onClick>`: it calls `preventDefault()` only for the
 * same-page case, which cancels Next's navigation (Link skips navigating when
 * the click's default was prevented).
 *
 * ponytail: only same-page anchors are intercepted; everything else is a no-op.
 */
export function handleSamePageAnchorClick(
  event: MouseEvent<HTMLAnchorElement>,
  href: string,
): void {
  if (event.defaultPrevented) return;
  // Modifier / middle clicks: let the browser (new tab, etc.) handle it.
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

  const hashIndex = href.indexOf("#");
  if (hashIndex === -1) return;
  const path = href.slice(0, hashIndex);
  const id = href.slice(hashIndex + 1);
  if (!id) return;

  // Cross-page anchor → keep client-side navigation.
  if (path && path !== window.location.pathname) return;

  const el = document.getElementById(id);
  if (!el) return;

  event.preventDefault();
  // Sync (and self-heal any already-duplicated) fragment without a router round
  // trip. Passing the current history state keeps Next's internal `__NA` marker,
  // so its patched `replaceState` treats this as an internal write and doesn't
  // re-process the URL.
  if (window.location.hash !== `#${id}`) {
    window.history.replaceState(window.history.state, "", `#${id}`);
  }
  el.scrollIntoView({ behavior: "smooth" });
  el.focus({ preventScroll: true });
}
