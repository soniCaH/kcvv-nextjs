// @vitest-environment node
/**
 * Guard fixture for `apps/web/scripts/vr-docker.mjs` (#2380). `decide()` is the
 * pure decision; the two spawn cases prove it is wired to the CLI's exit code
 * and that a refusal never reaches the Storybook build or Docker.
 */
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { decide } from "../../scripts/vr-docker.mjs";

const SCRIPT = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
  "scripts",
  "vr-docker.mjs",
);

/** Run the wrapper with a PATH that has no `docker`/`pnpm`, so an allowed run
 *  fails loudly instead of starting a 2.5 h suite on the developer's machine. */
const runScript = (args: string[]) =>
  spawnSync(process.execPath, [SCRIPT, ...args], {
    encoding: "utf8",
    env: { ...process.env, PATH: "/nonexistent" },
  });

describe("decide", () => {
  it("refuses check mode even with a pattern — check mode cannot be scoped", () => {
    expect(decide({ mode: "check", args: ["ui-button"] }).ok).toBe(false);
  });

  it.each(["update", "update:single", "update:story"])(
    "refuses %s with no positional pattern",
    (mode) => {
      expect(decide({ mode, args: [] }).ok).toBe(false);
    },
  );

  it.each([
    ["a flag", ["--maxWorkers=1"]],
    ["an empty string", ["--", ""]],
    ["a space-separated option value", ["--", "--maxWorkers", "1"]],
    ["a URL option value", ["--", "--url", "http://127.0.0.1:6006"]],
  ])("does not mistake %s for a pattern", (_label, args) => {
    expect(decide({ mode: "update", args }).ok).toBe(false);
  });

  it("still sees the pattern when it follows an option and its value", () => {
    expect(
      decide({
        mode: "update",
        args: ["--", "--maxWorkers", "1", "ui-button"],
      }),
    ).toEqual({
      ok: true,
      dockerArgs: ["-u", "--", "--maxWorkers", "1", "ui-button"],
    });
  });

  it("names the cost, the scoped alternative and the override when refusing", () => {
    const result = decide({ mode: "update", args: [] });

    if (result.ok) throw new Error("expected a refusal");
    expect(result.message).toContain("2.5 h");
    expect(result.message).toContain("vr:update:story");
    expect(result.message).toContain("VR_FULL_RUN=1");
    expect(result.message).toContain("docs/agents/testing-ops.md");
  });

  // `pnpm vr:update:story -- ui-button` reaches the wrapper as ["update:story",
  // "--", "ui-button"] — pnpm keeps the separator, and before #2380 it appended
  // that same tail to the script string. Both the bare and the `--`-separated
  // shape must reproduce the arguments docker saw then.
  it.each([
    ["update:story", ["ui-button"], ["-u", "ui-button"]],
    ["update:story", ["--", "ui-button"], ["-u", "--", "ui-button"]],
    ["update:single", ["ui-button"], ["-u", "--maxWorkers=1", "ui-button"]],
    [
      "update:single",
      ["--", "ui-button"],
      ["-u", "--maxWorkers=1", "--", "ui-button"],
    ],
  ])("preserves today's docker args for %s %j", (mode, args, dockerArgs) => {
    expect(decide({ mode, args })).toEqual({ ok: true, dockerArgs });
  });

  it.each(["check", "update", "update:single", "update:story"])(
    "lets VR_FULL_RUN=1 through for %s",
    (mode) => {
      expect(decide({ mode, args: [], fullRun: true }).ok).toBe(true);
    },
  );

  it("rejects an unknown mode", () => {
    expect(() => decide({ mode: "nope", args: [] })).toThrow(/nope/);
  });
});

describe("cli", () => {
  it("refuses before touching the Storybook build or Docker", () => {
    // PATH is empty, so reaching either child process would surface an ENOENT
    // for `pnpm`/`docker` rather than the guard's own message.
    const result = runScript(["update"]);

    expect(result.status).not.toBe(0);
    expect(result.stderr).not.toContain("ENOENT");
    expect(result.stderr).toContain("VR_FULL_RUN=1");
  });

  it("gets past the guard once scoped", () => {
    // Scoped, so the guard passes — the run then dies on the missing `pnpm`,
    // which is the proof it got as far as the build step.
    const result = runScript(["update:story", "ui-button"]);

    expect(result.status).not.toBe(0);
    expect(result.stderr).not.toContain("VR_FULL_RUN=1");
  });
});
