#!/usr/bin/env node
// Prints the on-disk path of the diff PNG for a failed VR story so Claude can
// read it via the Read tool. Invoked as `pnpm vr:diff <story-id>` — story-id
// is the Storybook kebab-cased identifier (e.g. `layout-pagefooter--standalone`).
//
// jest-image-snapshot writes diffs to test/vr/__diff_output__/ as
// `<story-id>--<viewport>-diff.png`. We list every match so the caller sees
// each viewport that regressed.
import { readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const STORY_ID = process.argv[2];
if (!STORY_ID) {
  console.error("Usage: pnpm vr:diff <story-id>");
  console.error("Example: pnpm vr:diff layout-pagefooter--standalone");
  process.exit(2);
}

// fileURLToPath, not `.pathname` — the latter leaves the URL percent-encoded,
// so any checkout under a path with a space resolves to a directory that
// doesn't exist ("/Sites/KCVV%20VR/…").
const DIFF_DIR = resolve(
  fileURLToPath(new URL(".", import.meta.url)),
  "..",
  "test/vr/__diff_output__",
);

let entries;
try {
  entries = readdirSync(DIFF_DIR);
} catch {
  console.error(
    `No diff output yet — run \`pnpm vr:update:story -- <story-id-prefix>\` first. (looked in ${DIFF_DIR})`,
  );
  process.exit(1);
}

const matches = entries
  .filter((f) => f.startsWith(`${STORY_ID}--`) && f.endsWith("-diff.png"))
  .map((f) => join(DIFF_DIR, f))
  .filter((p) => statSync(p).isFile());

if (matches.length === 0) {
  console.error(`No diff PNGs for story id "${STORY_ID}".`);
  console.error(`Available diffs in ${DIFF_DIR}:`);
  for (const f of entries) console.error(`  - ${f}`);
  process.exit(1);
}

for (const p of matches) console.log(p);
