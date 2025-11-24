import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import storybook from "eslint-plugin-storybook";

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    files: ["**/*.stories.@(ts|tsx|js|jsx|mjs|cjs)"],
    plugins: {
      storybook,
    },
    rules: storybook.configs.recommended.overrides[0].rules,
  },
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "storybook-static/**",
      "coverage/**",
      "next-env.d.ts"
    ]
  }
];

export default eslintConfig;
