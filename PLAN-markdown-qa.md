# Implementation Plan: Markdown-Based Responsibility Q&A System

## Overview

Convert the responsibility Q&A feature from TypeScript (`responsibility-paths.ts`) to markdown files for easier editing by non-technical users.

## Architecture Decision: Build-Time Script with Type Generation

**Approach:** Parse markdown files at build time → Validate with Effect Schema → Generate TypeScript file

**Why this approach:**

- ✅ Aligns with existing Effect Schema pattern (used throughout codebase)
- ✅ Zero runtime overhead (pre-compiled to TypeScript)
- ✅ Maintains strict type safety
- ✅ Simple integration with existing architecture
- ✅ Clear separation: markdown = source, generated TS = compiled artifact

## Markdown File Format

### Directory Structure

```
content/responsibility/
├── README.md (documentation)
├── ongeval-speler-training.md
├── herstel-blessure.md
└── ... (12 files total)
```

### Example Markdown File

```markdown
---
id: ongeval-speler-training
roles:
  - speler
  - ouder
question: heb een ongeval op training/wedstrijd
keywords:
  - ongeval
  - blessure
  - letsel
category: medisch
icon: 🏥
primaryContact:
  role: Verzekeringverantwoordelijke
  email: verzekering@kcvvelewijt.be
  department: algemeen
  orgLink: /club/organigram
---

# Summary

Meld het ongeval onmiddellijk bij je trainer en neem contact op met de verzekeringverantwoordelijke.

## Steps

### 1. Meld het ongeval onmiddellijk bij je trainer of ploegverantwoordelijke

### 2. Raadpleeg indien nodig een arts of ga naar de spoeddienst

### 3. Contacteer de verzekeringverantwoordelijke binnen 48 uur

**Contact:** Verzekeringverantwoordelijke
**Email:** verzekering@kcvvelewijt.be

### 4. Vul het ongevalformulier in (beschikbaar via de club)

**Link:** /club/downloads
```

## Dependencies to Add

```json
{
  "devDependencies": {
    "gray-matter": "^4.0.3",
    "remark": "^15.0.1",
    "remark-parse": "^11.0.0",
    "unist-util-visit": "^5.0.0"
  }
}
```

## File Structure

```
├── content/
│   └── responsibility/          # NEW: Markdown source files
│       ├── README.md
│       └── *.md (12 files)
├── scripts/
│   ├── generate-responsibility-data.ts    # NEW: Build script
│   ├── migrate-responsibility-to-markdown.ts  # NEW: One-time migration
│   └── parsers/
│       └── responsibility-markdown.ts     # NEW: Parser logic
├── src/
│   ├── data/
│   │   └── responsibility-paths.ts        # GENERATED (git-tracked)
│   ├── lib/
│   │   └── effect/
│   │       └── schemas/
│   │           └── responsibility.schema.ts  # NEW: Effect Schema validation
│   ├── types/
│   │   └── responsibility.ts              # UNCHANGED
│   └── components/
│       └── responsibility/                # UNCHANGED (components work as-is)
└── package.json                           # Add build:responsibility script
```

## Implementation Steps

### Phase 1: Foundation

1. Create Effect Schema for validation (`src/lib/effect/schemas/responsibility.schema.ts`)
2. Install markdown dependencies (gray-matter, remark, etc.)
3. Create content directory structure

### Phase 2: Parser

4. Build markdown parser (`scripts/parsers/responsibility-markdown.ts`)
5. Write parser unit tests
6. Handle frontmatter, steps extraction, contact parsing

### Phase 3: Build Script

7. Create build script (`scripts/generate-responsibility-data.ts`)
8. Read markdown files → Parse → Validate → Generate TS
9. Add npm scripts to package.json

### Phase 4: Migration

10. Create migration script (`scripts/migrate-responsibility-to-markdown.ts`)
11. Convert existing TS data → markdown files
12. Run build script to verify round-trip

### Phase 5: Integration

13. Update Next.js config for watch mode (optional)
14. Test hot reload in development
15. Verify all existing tests pass

### Phase 6: Documentation

16. Write comprehensive documentation (editing guide)
17. Create markdown template with examples
18. Update developer docs

### Phase 7: Quality Gates

19. Run `npm run check-all`
20. Verify no regressions
21. Commit and create PR

## Key Features

- **YAML Frontmatter** for metadata (id, roles, keywords, category, icon, primaryContact)
- **Markdown Sections** for summary and steps
- **Effect Schema Validation** ensures data integrity at build time
- **Type Safety** maintained (generated file provides same types)
- **Hot Reload** in development (watch mode)
- **Git-tracked Generated File** for CI/CD compatibility

## Benefits

✅ Non-technical users can edit markdown directly on GitHub
✅ No syntax errors (YAML + markdown are forgiving)
✅ Build-time validation catches structural errors
✅ Type safety maintained (no regressions)
✅ Performance identical (pre-compiled)
✅ All existing tests continue to work

## Decisions

✅ **Generated file in git:** YES - Track `responsibility-paths.ts` for seamless CI/CD
✅ **Watch mode:** Auto-start with `npm run dev` - Integrated developer experience
✅ **Migration timing:** Now - Generate sample markdown files for format review first

## Next Steps

1. Create migration script to generate markdown files from existing TypeScript
2. Generate 1-2 sample markdown files for format review
3. Get approval on markdown format
4. Complete migration of all 12 items
5. Implement parser and build script
6. Integrate watch mode with Next.js dev server
7. Add comprehensive tests
8. Create PR for review
