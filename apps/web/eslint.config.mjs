import { fileURLToPath } from "url";
import path from "path";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import storybook from "eslint-plugin-storybook";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The `apps/web/CLAUDE.md` rule "Import the module under test at module scope",
// in a form that fails the build instead of being re-litigated per file.
//
// The `it`/`test` ancestor is what makes this precise: module-scope
// `await import()` blocks (canonical-urls.test.ts, legacy-redirects.test.ts)
// must not trip. The three call shapes cover `it(…)`, `it.skip(…)`/`it.only(…)`
// and `it.each(table)(…)`.
// Kept on one line: esquery does not parse a selector containing newlines, and
// it fails *silently* — the rule simply stops matching anything.
const IN_BODY_ROUTE_IMPORT =
  ":matches(CallExpression[callee.name=/^(it|test)$/], CallExpression[callee.object.name=/^(it|test)$/], CallExpression[callee.callee.object.name=/^(it|test)$/]) ImportExpression > Literal[value=/\\/(page|layout|route|robots|sitemap|opengraph-image)$/]";

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
