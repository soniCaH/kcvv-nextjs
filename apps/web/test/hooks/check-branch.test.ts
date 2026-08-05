/**
 * Regression fixture for the two branch guards that stop a commit landing on
 * `main` (#2361):
 *
 *   - `.claude/hooks/check-branch.sh` — the Claude Code `PreToolUse` hook. Fast,
 *     friendly, best-effort: it parses a Bash tool payload and decides
 *     allow/deny before the command runs.
 *   - `.husky/branch-guard.sh` — the real backstop. Runs inside git, in the
 *     repository the commit actually lands in.
 *
 * Both live outside every workspace, so nothing else in CI would ever exercise
 * them. This file is their only home: it is collected by the existing
 * `apps/web` vitest config (no `include` override; only `test/e2e/**` is
 * excluded) and therefore rides `pnpm --filter @kcvv/web test` and `check-all`.
 *
 * Fixtures are throwaway `git init` repos under `os.tmpdir()` — the commits
 * made here are never in this repository.
 */
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterAll, beforeAll, describe, expect, it } from "vitest";

/** Worktree-safe: resolves the checkout we are running in, not a `../..` walk. */
const repoRoot = spawnSync("git", ["rev-parse", "--show-toplevel"], {
  encoding: "utf8",
}).stdout.trim();

const CHECK_BRANCH = join(repoRoot, ".claude", "hooks", "check-branch.sh");
const BRANCH_GUARD = join(repoRoot, ".husky", "branch-guard.sh");

/**
 * Fixture paths are only known once `beforeAll` has run, but `it.each` builds
 * its table at collect time — so cases carry `{TOKEN}` placeholders that are
 * expanded per-case at run time. Placeholders also keep a literal `$VAR` in a
 * command meaningful: that is the "unresolvable target" case, which must deny.
 */
const tokens: Record<string, string> = {};
const expand = (value: string) =>
  value.replace(/\{(\w+)\}/g, (_, key: string) => tokens[key] ?? `{${key}}`);

/** Isolate fixture repos from the developer's global git config and hooks. */
const gitEnv = {
  ...process.env,
  GIT_CONFIG_GLOBAL: "/dev/null",
  GIT_CONFIG_SYSTEM: "/dev/null",
};

const git = (cwd: string, ...args: string[]) => {
  const result = spawnSync("git", args, { cwd, encoding: "utf8", env: gitEnv });
  if (result.status !== 0) {
    throw new Error(`git ${args.join(" ")} failed in ${cwd}: ${result.stderr}`);
  }
  return result.stdout.trim();
};

const initRepo = (name: string, branch: string) => {
  const dir = join(tokens.TMPROOT, name);
  mkdirSync(dir);
  git(dir, "init", "-b", branch);
  git(dir, "config", "user.email", "hook-test@example.com");
  git(dir, "config", "user.name", "Hook Test");
  git(dir, "commit", "--allow-empty", "--no-verify", "-m", "init");
  return dir;
};

beforeAll(() => {
  tokens.TMPROOT = mkdtempSync(join(tmpdir(), "kcvv-branch-guard-"));
  tokens.MAIN = initRepo("main-repo", "main");
  tokens.FEAT = initRepo("feat-repo", "feat/issue-2361");

  tokens.DETACHED = initRepo("detached-repo", "main");
  git(tokens.DETACHED, "checkout", "--detach");

  // A linked worktree of the `main` repo, checked out on a feature branch —
  // the guards must report the worktree's branch, not the parent's.
  tokens.WORKTREE = join(tokens.TMPROOT, "main-repo-wt");
  git(
    tokens.MAIN,
    "worktree",
    "add",
    tokens.WORKTREE,
    "-b",
    "feat/from-worktree",
  );

  tokens.NOREPO = join(tokens.TMPROOT, "not-a-repo");
  mkdirSync(tokens.NOREPO);
});

afterAll(() => {
  if (tokens.TMPROOT) rmSync(tokens.TMPROOT, { recursive: true, force: true });
});

type Decision = "allow" | "deny";

/** Pipe a `PreToolUse` payload into the hook and read back its decision. */
const runHook = (payload: string, env: Record<string, string> = {}) => {
  const result = spawnSync("bash", [CHECK_BRANCH], {
    input: payload,
    encoding: "utf8",
    env: { ...process.env, ...env },
  });
  // The hook always exits 0 — a denial is expressed in its JSON, not its code.
  expect(result.status, result.stderr).toBe(0);

  const stdout = result.stdout.trim();
  if (!stdout) return "allow" satisfies Decision;
  return JSON.parse(stdout).hookSpecificOutput.permissionDecision as Decision;
};

const runHookOn = (
  command: string,
  cwd: string,
  env: Record<string, string> = {},
) =>
  runHook(
    JSON.stringify({
      tool_input: { command: expand(command) },
      cwd: expand(cwd),
    }),
    env,
  );

type Case = {
  name: string;
  command: string;
  cwd: string;
  /** Extra environment for the hook process — `HOME` drives `~` expansion. */
  env?: Record<string, string>;
};

/**
 * Every shape in the issue's "Selected cases" table, plus the fail-closed and
 * pass-through shapes the rewrite is responsible for.
 */
const DENIED: Case[] = [
  // The workflow `.claude/CLAUDE.md` prescribes — a `"` before `git commit`
  // truncated the old sed parse and silently disarmed the guard.
  {
    name: 'a quoted argument before the commit — pnpm --filter "@kcvv/web" check-all && git commit',
    command: 'pnpm --filter "@kcvv/web" check-all && git commit -m x',
    cwd: "{MAIN}",
  },
  {
    name: "a redirect before the commit",
    command:
      'printf "msg" > /tmp/kcvv-hook-msg && git commit -F /tmp/kcvv-hook-msg',
    cwd: "{MAIN}",
  },
  {
    name: "git -C into main from a feature checkout",
    command: "git -C {MAIN} commit -m x",
    cwd: "{FEAT}",
  },
  {
    name: "git -C into main from a linked worktree",
    command: "git -C {MAIN} commit -m x",
    cwd: "{WORKTREE}",
  },
  {
    name: "a cd-to-elsewhere then git -C bypass",
    command: "cd {NOREPO} && git -C {MAIN} commit -m x",
    cwd: "{FEAT}",
  },
  {
    name: "a bash -c wrapper",
    command: 'bash -c "git commit -m x"',
    cwd: "{MAIN}",
  },
  {
    name: "two spaces between git and commit",
    command: "git  commit -m x",
    cwd: "{MAIN}",
  },
  {
    name: "a tab between git and commit",
    command: "git\tcommit -m x",
    cwd: "{MAIN}",
  },
  {
    name: "a -c global flag",
    command: "git -c user.name=x commit -m x",
    cwd: "{MAIN}",
  },
  {
    name: "a --no-pager global flag",
    command: "git --no-pager commit -m x",
    cwd: "{MAIN}",
  },
  {
    name: "a semicolon separator",
    command: "cd {MAIN} ; git commit -m x",
    cwd: "{FEAT}",
  },
  {
    name: "a newline separator",
    command: "cd {MAIN}\ngit commit -m x",
    cwd: "{FEAT}",
  },
  {
    name: "a decoy command key in the command itself",
    command: `echo '{"command": "harmless"}' && git commit -m x`,
    cwd: "{MAIN}",
  },
  { name: "a bare commit on main", command: "git commit -m x", cwd: "{MAIN}" },
  {
    name: "a tilde path into main",
    command: "cd ~/main-repo && git commit -m x",
    cwd: "{FEAT}",
    env: { HOME: "{TMPROOT}" },
  },
  // Fail closed: we cannot attribute the commit to a directory, so we refuse.
  {
    name: "an unexpanded shell variable as the target",
    command: "cd $WT && git commit -m x",
    cwd: "{FEAT}",
  },
  {
    name: "a target directory that does not exist",
    command: "cd /no/such/dir && git commit -m x",
    cwd: "{FEAT}",
  },
];

const ALLOWED: Case[] = [
  // The `cd`-must-come-first constraint is gone.
  {
    name: "cd arriving after an nvm preamble",
    command:
      "source ~/.nvm/nvm.sh && nvm use && cd {FEAT} && git commit -F msg",
    cwd: "{MAIN}",
  },
  {
    name: "a tilde path into a feature checkout",
    command: "cd ~/feat-repo && git commit -F msg",
    cwd: "{MAIN}",
    env: { HOME: "{TMPROOT}" },
  },
  {
    name: "a subshell",
    command: "( cd {FEAT} && git commit -F msg )",
    cwd: "{MAIN}",
  },
  {
    name: "a semicolon separator",
    command: "cd {FEAT} ; git commit -F msg",
    cwd: "{MAIN}",
  },
  {
    name: "a commit inside a linked worktree",
    command: "cd {WORKTREE} && git commit -m x",
    cwd: "{MAIN}",
  },
  // A detached-HEAD commit cannot advance main.
  {
    name: "a detached HEAD",
    command: "cd {DETACHED} && git commit -m x",
    cwd: "{MAIN}",
  },
  {
    name: "the word commit in prose",
    command: "echo git commit later",
    cwd: "{MAIN}",
  },
  {
    name: "commit-tree, which is not commit",
    command: "git commit-tree abc123",
    cwd: "{MAIN}",
  },
  {
    name: "a directory that is not a repository",
    command: "cd {NOREPO} && git commit -m x",
    cwd: "{MAIN}",
  },
  {
    name: "a bare commit on a feature branch",
    command: "git commit -m x",
    cwd: "{FEAT}",
  },
  {
    name: "a command with no commit in it",
    command: "pnpm --filter @kcvv/web check-all",
    cwd: "{MAIN}",
  },
];

describe(".claude/hooks/check-branch.sh", () => {
  it.each(DENIED)("blocks $name", ({ command, cwd, env }) => {
    const expandedEnv = Object.fromEntries(
      Object.entries(env ?? {}).map(([key, value]) => [key, expand(value)]),
    );
    expect(runHookOn(command, cwd, expandedEnv)).toBe("deny");
  });

  it.each(ALLOWED)("allows $name", ({ command, cwd, env }) => {
    const expandedEnv = Object.fromEntries(
      Object.entries(env ?? {}).map(([key, value]) => [key, expand(value)]),
    );
    expect(runHookOn(command, cwd, expandedEnv)).toBe("allow");
  });

  // Deliberate, documented in the issue's "Residual gaps": a payload the hook
  // cannot parse is not a command it can attribute to a directory, and failing
  // closed there would deny unrelated Bash calls on any payload-shape change.
  // `.husky/branch-guard.sh` covers the case. Do not "fix" this.
  it("allows a payload it cannot parse", () => {
    expect(runHook("not json at all, but it does say commit")).toBe("allow");
  });

  it("allows empty input", () => {
    expect(runHook("")).toBe("allow");
  });
});

describe(".husky/branch-guard.sh", () => {
  const runGuard = (
    args: string[],
    options: { cwd?: string; env?: Record<string, string> } = {},
  ) =>
    spawnSync("bash", [BRANCH_GUARD, ...args], {
      encoding: "utf8",
      cwd: options.cwd,
      env: { ...process.env, ...options.env },
    }).status;

  it("refuses a repository on main", () => {
    expect(runGuard([tokens.MAIN])).toBe(1);
  });

  it("allows a repository on a feature branch", () => {
    expect(runGuard([tokens.FEAT])).toBe(0);
  });

  it("allows a detached HEAD", () => {
    expect(runGuard([tokens.DETACHED])).toBe(0);
  });

  it("allows a linked worktree on a feature branch", () => {
    expect(runGuard([tokens.WORKTREE])).toBe(0);
  });

  it("defaults to the current directory", () => {
    expect(runGuard([], { cwd: tokens.MAIN })).toBe(1);
    expect(runGuard([], { cwd: tokens.FEAT })).toBe(0);
  });

  it("is bypassed by ALLOW_MAIN_COMMIT=1", () => {
    expect(runGuard([tokens.MAIN], { env: { ALLOW_MAIN_COMMIT: "1" } })).toBe(
      0,
    );
  });
});
