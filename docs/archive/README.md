# Archive

Historical documentation and deprecated code that has been replaced in production but is preserved for reference.

## Contents

### [organogram-prototypes/](./organogram-prototypes/)

Historical prototype comparison and decision-making documentation from the organogram redesign project (Issue #437).

**Status:** ✅ Complete - Option A (Card Hierarchy) implemented in production
**Date Archived:** 2026-01-14
**Production Implementation:** `/src/components/organogram/UnifiedOrganogramClient.tsx`

Contains:

- 3 prototype implementations (Options A, B, C)
- Evaluation criteria and scoring matrix
- Storybook comparison stories
- Decision rationale documentation

**Winner:** Option A - Card Hierarchy (4.3/5) - Implemented as `UnifiedOrganogramClient`

---

## Archive Policy

Files are moved here when:

- Feature is fully implemented in production
- Historical context is valuable for future reference
- Code is no longer maintained but shouldn't be deleted
- Documentation provides insight into decision-making process

Files in this directory are **not tested** and may not work with current dependencies.
