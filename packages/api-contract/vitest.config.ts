import {defineConfig} from 'vitest/config'

export default defineConfig({
  test: {
    globals: false,
    // Vitest 4's defaultExclude dropped `**/dist/**`, and `tsgo --build` never
    // prunes orphaned compiled output. Without this, a CI run that has already
    // built @kcvv/api-contract (any earlier step that resolves `^build` does
    // this) collects both `src/**/*.test.ts` and its stale `dist/**/*.test.js`
    // twin, double-counting tests and risking a pass against deleted source.
    include: ['src/**/*.test.ts'],
  },
})
