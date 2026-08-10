/**
 * A dynamic segment exporting `revalidate` but no `generateStaticParams` is
 * server-rendered per request (`ƒ` in `next build`), so the ISR window is inert
 * config. Returning `[]` costs no build-time fetches and flips it to `●`.
 *
 * @see https://github.com/soniCaH/www.kcvvelewijt.be/issues/2391
 */

import { describe, it, expect } from "vitest";
import { globSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const appDir = resolve(__dirname, "..");

// Every dynamic-segment page under app/, route group or not. An empty list
// fails the run on its own — vitest rejects an `it.each` with no cases.
const dynamicSegmentPages = globSync("**/page.tsx", { cwd: appDir }).filter(
  (relPath) => relPath.includes("["),
);

describe("ISR route config", () => {
  it.each(dynamicSegmentPages)(
    "%s — declaring `revalidate` requires `generateStaticParams`",
    (relPath) => {
      const source = readFileSync(resolve(appDir, relPath), "utf8");
      if (!/^export const revalidate\b/m.test(source)) return;

      expect(source).toMatch(
        /^export (async )?function generateStaticParams\b/m,
      );
    },
  );
});
