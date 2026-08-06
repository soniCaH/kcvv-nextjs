#!/usr/bin/env node
// Wrapper for the four LOCAL Docker visual-regression entrypoints — `vr:check`,
// `vr:update`, `vr:update:single`, `vr:update:story` in apps/web/package.json.
// CI does not go through here: `vr:ci` / `vr:ci:update` run `vr:run*` directly,
// without Docker.
//
// Why it exists (#2380): `docker-compose.vr.yml` pins the runner to
// `platform: linux/amd64` so local captures are byte-identical to CI (#2370),
// at a measured ~3.6× emulation cost — the ~40 min full suite becomes ~2.5 h.
// Two ways to trip over that silently:
//
//   - `vr:check` has no scoped form at all. `test-storybook` only forwards a
//     positional pattern to Jest when it FOLLOWS `-u`, so a bare positional in
//     check mode is dropped and the whole suite runs.
//   - `vr:update` with no pattern regenerates every baseline.
//
// So the guard refuses check mode outright, and refuses an update with no
// positional pattern. `VR_FULL_RUN=1` is the only override.
//
// The guard has to live here rather than prepended to the package.json script
// body: pnpm appends `-- <args>` to the END of the script string, so a guard in
// front of the `&&` chain would never see the scoping pattern.
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/** Extra docker-compose args each mode adds, ahead of the caller's pattern. */
const MODES = {
  check: [],
  update: ["-u"],
  "update:single": ["-u", "--maxWorkers=1"],
  "update:story": ["-u"],
};

const refusal = (mode, why) => `
Refusing \`pnpm vr:${mode}\` — ${why}

Under the emulated amd64 pin (docker-compose.vr.yml) a full local suite is
~2.5 h. Full-suite comparison is CI's job; locally, scope to one component:

  pnpm --filter @kcvv/web run vr:update:story -- <story-id-prefix>

Story IDs live in apps/web/storybook-static/index.json. To use that as a CHECK,
inspect \`git status test/vr/__snapshots__/\` afterwards — modified means drift,
untracked means new — then \`git checkout -- test/vr/__snapshots__/\` to discard.

See "The amd64 pin — scoped runs only" in docs/agents/testing-ops.md.

Deliberate full local run: VR_FULL_RUN=1 pnpm --filter @kcvv/web run vr:${mode}
`;

/**
 * Pure guard decision.
 *
 * @param {{ mode: string, args: string[], fullRun?: boolean }} input
 * @returns {{ ok: true, dockerArgs: string[] } | { ok: false, message: string }}
 */
export function decide({ mode, args, fullRun = false }) {
  const modeArgs = MODES[mode];
  if (!modeArgs) {
    throw new Error(
      `Unknown VR mode "${mode}" — expected one of ${Object.keys(MODES).join(", ")}`,
    );
  }

  if (!fullRun) {
    if (mode === "check") {
      return {
        ok: false,
        message: refusal(
          mode,
          "check mode has no scoped form, so this is always the full suite.",
        ),
      };
    }
    // A pattern is a positional operand; flags never scope.
    if (!args.some((arg) => !arg.startsWith("-"))) {
      return {
        ok: false,
        message: refusal(
          mode,
          "no story-id pattern given, so this would regenerate every baseline.",
        ),
      };
    }
  }

  return { ok: true, dockerArgs: [...modeArgs, ...args] };
}

function main() {
  const [mode, ...args] = process.argv.slice(2);
  const decision = decide({
    mode,
    args,
    fullRun: process.env.VR_FULL_RUN === "1",
  });

  if (!decision.ok) {
    console.error(decision.message);
    process.exit(1);
  }

  const cwd = join(dirname(fileURLToPath(import.meta.url)), "..");
  const run = (command, commandArgs) => {
    const { status, error } = spawnSync(command, commandArgs, {
      cwd,
      stdio: "inherit",
    });
    if (error) {
      console.error(`Failed to run \`${command}\`: ${error.message}`);
      process.exit(1);
    }
    if (status !== 0) process.exit(status ?? 1);
  };

  run("pnpm", ["run", "vr:build-storybook"]);
  run("docker", [
    "compose",
    "-f",
    "docker-compose.vr.yml",
    "run",
    "--build",
    "--rm",
    "vr",
    ...decision.dockerArgs,
  ]);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
