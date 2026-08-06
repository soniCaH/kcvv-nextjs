/**
 * Guard fixture for `apps/web/scripts/vr-docker.mjs` (#2380).
 *
 * The wrapper owns the four local Docker VR entrypoints. Its job is to refuse
 * an unscoped run before anything expensive happens — under the amd64 pin the
 * full suite is a ~2.5 h emulated run (#2370). `decide()` is the pure decision;
 * the spawn cases below prove it is actually wired to the CLI's exit code and
 * that a refusal never reaches the Storybook build or Docker.
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
const runScript = (args: string[], env: Record<string, string> = {}) =>
  spawnSync(process.execPath, [SCRIPT, ...args], {
    encoding: "utf8",
    env: { ...process.env, PATH: "/nonexistent", ...env },
  });

describe("decide", () => {
  it("refuses check mode even with a pattern — check mode cannot be scoped", () => {
    const result = decide({ mode: "check", args: ["ui-button"] });

    expect(result.ok).toBe(false);
  });

  it.each(["update", "update:single", "update:story"])(
    "refuses %s with no positional pattern",
    (mode) => {
      expect(decide({ mode, args: [] }).ok).toBe(false);
    },
  );

  it("does not mistake a flag for a pattern", () => {
    expect(decide({ mode: "update", args: ["--maxWorkers=1"] }).ok).toBe(false);
  });

  it("names the cost, the scoped alternative and the override when refusing", () => {
    const result = decide({ mode: "update", args: [] });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.message).toContain("2.5 h");
    expect(result.message).toContain("vr:update:story");
    expect(result.message).toContain("VR_FULL_RUN=1");
    expect(result.message).toContain("docs/agents/testing-ops.md");
  });

  it("allows a scoped update and preserves today's argument order", () => {
    expect(decide({ mode: "update:story", args: ["ui-button"] })).toEqual({
      ok: true,
      dockerArgs: ["-u", "ui-button"],
    });
    expect(decide({ mode: "update:single", args: ["ui-button"] })).toEqual({
      ok: true,
      dockerArgs: ["-u", "--maxWorkers=1", "ui-button"],
    });
  });

  it.each(["check", "update", "update:single", "update:story"])(
    "lets VR_FULL_RUN=1 through for %s",
    (mode) => {
      expect(decide({ mode, args: [], fullRun: true }).ok).toBe(true);
    },
  );

  it("passes check-mode args through untouched under the override", () => {
    expect(decide({ mode: "check", args: [], fullRun: true })).toEqual({
      ok: true,
      dockerArgs: [],
    });
  });

  it("rejects an unknown mode", () => {
    expect(() => decide({ mode: "nope", args: [] })).toThrow(/nope/);
  });
});

describe("cli", () => {
  it("exits non-zero and explains itself on a bare vr:check", () => {
    const result = runScript(["check"]);

    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("VR_FULL_RUN=1");
  });

  it("refuses before touching the Storybook build or Docker", () => {
    // PATH is empty, so reaching either child process would surface an ENOENT
    // for `pnpm`/`docker` rather than the guard's own message.
    const result = runScript(["update"]);

    expect(result.status).not.toBe(0);
    expect(result.stderr).not.toContain("ENOENT");
    expect(result.stderr).toContain("vr:update:story");
  });

  it("exits zero-free but past the guard once scoped", () => {
    // Scoped, so the guard passes — the run then dies on the missing `pnpm`,
    // which is the proof it got as far as the build step.
    const result = runScript(["update:story", "ui-button"]);

    expect(result.status).not.toBe(0);
    expect(result.stderr).not.toContain("VR_FULL_RUN=1");
  });
});
