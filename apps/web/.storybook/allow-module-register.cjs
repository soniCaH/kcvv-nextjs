// Jest `setupFiles` entry, wired up in test-runner-jest.config.mjs.
//
// Storybook's `serverRequire` — which @storybook/test-runner uses to load
// .storybook/test-runner.ts — unconditionally installs a TypeScript loader
// before it even looks at the file extension:
//
//   async function importModule(path) {
//     if (!isTypescriptLoaderRegistered) {
//       register(importMetaResolve("storybook/internal/bin/loader"), ...)
//     }
//     try   { mod = await import(path) }                    // fails on .ts here
//     catch { mod = createRequire(import.meta.url)(path) }  // jest's require
//   }
//
// jest-runtime 30.5.1 turned `module.register()` inside a worker into a hard
// throw, so every visual-regression suite died at config load with 0 tests run
// (landed on main via lockfile maintenance, #2761).
//
// That loader was never doing any work in this process: the dynamic `import()`
// of a TypeScript file fails inside Jest, and the `require` fallback is what
// actually compiles test-runner.ts — through Jest's own @swc/jest transform.
// Neutralising the registration restores that fallback without re-introducing
// what Jest's guard protects against (a loader hook attaching to the loader
// running Jest itself and leaking into every later test file in the worker).
//
// It has to be `require("node:module")`. `module.constructor` is the real
// builtin in a plain Node process, but inside a Jest worker `module` is Jest's
// own CJS shim, so `module.constructor.register` patches an object Storybook
// never reads — measured: 0 tests run, same failure as no shim at all.
//
// HOW THIS WORKAROUND RETIRES ITSELF
// The no-op counts its calls on a global. `setup()` in test-runner.ts asserts
// the count is non-zero, so the day @storybook/test-runner stops calling
// module.register() the VR suite fails with an instruction to delete this file
// and test-runner-jest.config.mjs. Nothing else would ever notice: no version
// is pinned here, so Renovate has nothing to flag and dead code would simply
// sit here forever. Keep the counter and the assertion together.

globalThis.__KCVV_MODULE_REGISTER_CALLS__ = 0;

// eslint-disable-next-line @typescript-eslint/no-require-imports -- a CJS setup file is the only thing Jest loads before setupFilesAfterEnv
const nodeModule = require("node:module");

nodeModule.register = function noopRegister() {
  globalThis.__KCVV_MODULE_REGISTER_CALLS__ += 1;
  return undefined;
};
