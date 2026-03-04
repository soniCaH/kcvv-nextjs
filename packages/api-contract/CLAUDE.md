# api-contract Package

Shared Effect Schema types and HttpApi definition consumed by both `apps/web` and `kcvv-api`.

## Rules

- All schemas use Effect Schema (`import { Schema as S } from "effect"`)
- No `S.Unknown` — every field must be typed
- Schemas here are the single source of truth — never duplicate in `apps/web/src/lib/schemas/`
- HttpApi groups live in `src/api/`, schemas in `src/schemas/`
- Export everything from `src/index.ts`
