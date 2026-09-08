import { getJestConfig } from "@storybook/test-runner";

// apps/web has no `"type": "module"`, so this file must be .mjs to use ESM.
//
// @storybook/test-runner globs `test-runner-jest*` inside the Storybook config
// dir and uses whatever it finds instead of its own default. We take that
// default wholesale and add only `setupFiles`: Jest runs those before the
// `setupFilesAfterEnv` entries the test-runner itself depends on, which is the
// window we need. See allow-module-register.cjs for what happens in there.
const config = {
  ...getJestConfig(),
  setupFiles: ["<rootDir>/apps/web/.storybook/allow-module-register.cjs"],
};

export default config;
