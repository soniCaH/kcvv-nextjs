import { fileURLToPath } from "url";
import path from "path";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import storybook from "eslint-plugin-storybook";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The `apps/web/CLAUDE.md` rule "Import the module under test at module scope",
// in a form that fails the build instead of being re-litigated per file.
//
// Requiring an `it`/`test` ancestor is what makes this precise: module-scope
// `await import()` blocks (canonical-urls.test.ts, legacy-redirects.test.ts)
// must not trip, and neither must hook bodies — those are charged against
// `hookTimeout`, and CLAUDE.md scopes the convention to `it()` bodies.
//
// Vitest composes modifiers into chains (`it.skip`, `test.concurrent.skip`,
// `it.each(table)(…)`, `test.concurrent.for(table)(…)`), and esquery cannot
// express an unbounded `.object` walk — so the two call forms are crossed with
// each chain depth. Three modifiers is past anything Vitest's API composes.
const TEST_CALL_FORMS = ["callee", "callee.callee"]; // `it(…)` and `it.each(t)(…)`
const MODIFIER_DEPTHS = ["", ".object", ".object.object", ".object.object.object"];

const TEST_CALLS = TEST_CALL_FORMS.flatMap((form) =>
  MODIFIER_DEPTHS.map(
    (depth) => `CallExpression[${form}${depth}.name=/^(it|test)$/]`,
  ),
).join(", ");

// Assembled without newlines on purpose: esquery does not parse a selector
// containing them, and it fails *silently* — the rule keeps loading, `lint`
// keeps exiting 0, and nothing is checked ever again.
const IN_BODY_ROUTE_IMPORT = `:matches(${TEST_CALLS}) ImportExpression > Literal[value=/\\/(page|layout|route|robots|sitemap|opengraph-image)$/]`;

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  ...storybook.configs["flat/recommended"],
  {
    settings: {
      next: {
        rootDir: __dirname,
      },
    },
  },
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "storybook-static/**",
      "coverage/**",
      "scripts/**",
      "next-env.d.ts",
    ],
  },
  {
    // Allow unused variables that start with underscore (common convention)
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    // Test-file rules: img rules off (we mock Next.js Image), plus the
    // module-scope import guard above.
    files: ["**/*.test.{ts,tsx}", "**/*.spec.{ts,tsx}"],
    rules: {
      "@next/next/no-img-element": "off",
      "jsx-a11y/alt-text": "off",
      "no-restricted-syntax": [
        "error",
        {
          selector: IN_BODY_ROUTE_IMPORT,
          message:
            "Hoist this page/route module import to module scope — Vitest charges an in-body dynamic import against testTimeout, which breaks under CI contention (apps/web/CLAUDE.md).",
        },
      ],
    },
  },
];

export default eslintConfig;
