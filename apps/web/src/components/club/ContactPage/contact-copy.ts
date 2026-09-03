/**
 * `/club/contact`'s fixed hero copy — extracted into its own plain module
 * (no `"use client"`) so `loading.tsx` (a Server Component) can import it
 * without pulling in `ContactPage.tsx`'s client boundary. A Server Component
 * importing a named export from a `"use client"` module gets a client-
 * reference proxy for the whole module, not the real value — `headline`
 * arrived as a non-string and crashed `next build` on `headline.trimEnd()`
 * inside `<PageHero>`'s emphasis logic. Keeping the copy here, imported by
 * both `ContactPage.tsx` and `loading.tsx`, avoids the boundary entirely.
 */
export const CONTACT_HEADLINE = "Contact";
export const CONTACT_LEAD = "Heb je een vraag? We helpen je graag verder.";
