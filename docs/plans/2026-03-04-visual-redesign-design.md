# KCVV Visual Redesign — Design

**Date:** 2026-03-04
**Status:** Approved
**Scope:** Full visual redesign — new design language, Storybook consolidation, consistent component styles across all pages

---

## 1. Summary

After the Gatsby → Next.js migration is complete (phases 4–7), the site will receive a full visual redesign. The goal is a coherent design language rooted in the club's physical identity (jerseys, posters, graphic patterns) and expressed consistently across every page and component.

This project runs **in parallel with the migration** at the design/planning level: inspiration is collected, decisions captured, and the design language defined — but no implementation until migration is complete.

---

## 2. Principles

- **Club identity first** — the design language derives from existing KCVV visual assets (jersey patterns, poster graphics, color relationships), not generic football templates
- **Storybook as source of truth** — every component must have a story; Foundation MDX docs are the canonical reference for tokens
- **Consistent, not uniform** — pages can have personality, but all use the same token system
- **Translate, don't copy** — jersey/poster patterns are reinterpreted as web-native elements (CSS patterns, SVG motifs, backgrounds), not applied literally

---

## 3. GitHub Project Structure

**Project:** "Visual Redesign" (separate from Platform Overhaul, issues cross-referenced where relevant)

**Columns:**

- `Ideas` — unscoped thoughts, no issue yet
- `Design Backlog` — issue created, not started
- `In Progress`
- `Done`

---

## 4. Document Structure

```
docs/plans/
  redesign-inspiration.md   ← Links, exports, notes on reference sites and visual assets
  redesign-brief.md         ← Design language: colors, typography, patterns, graphic motifs
  redesign-pages.md         ← Page/component inventory: keep, remove, add, future ideas
```

All three files are living documents — sparse at first, filled in as ideas accumulate.

---

## 5. Idea Capture Workflow

| What                                          | Where                                                                                    |
| --------------------------------------------- | ---------------------------------------------------------------------------------------- |
| New page/component idea                       | `redesign-pages.md` → GitHub issue when concrete → `Ideas` column                        |
| Inspiration site or visual reference          | `redesign-inspiration.md` with a note on what to borrow                                  |
| Design decision (pattern, color, type choice) | `redesign-brief.md`                                                                      |
| Ready to implement                            | Issue moves to `Design Backlog` → `In Progress`, linked to Platform Overhaul if relevant |

---

## 6. Implementation Trigger

Implementation begins when:

1. Migration phases 4–7 are complete
2. `redesign-brief.md` has at minimum: color palette, typography decisions, and one defined graphic motif

Storybook Foundation stories (tokens) can be updated incrementally during migration without breaking existing pages.
