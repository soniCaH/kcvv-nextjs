import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * Custom `--text-*` font-size steps declared in the `@theme` block of
 * `src/app/globals.css` (the "one ramp", #2417/#2396). Derived by reading
 * every `--text-<step>` declaration there and excluding the stock Tailwind
 * scale (`xs`…`6xl`), which the factory's own `font-size` group already
 * recognises correctly.
 *
 * Kept in this one exported place — `cn.test.ts` and the merge config below
 * both read from here — so the two cannot drift. If `globals.css` grows a
 * 13th step, add it here too, or `cn.test.ts`'s parametrised case fails.
 */
export const CUSTOM_SIZE_TOKENS = [
  "body-sm",
  "body-md",
  "body-lg",
  "display-sm",
  "display-md",
  "display-lg",
  "display-xl",
  "display-2xl",
  "label",
  "label-sm",
  "mono-sm",
  "mono-md",
] as const;

/**
 * The stock `twMerge` has no idea these tokens exist, so it can't file
 * `text-body-sm` etc. under its `font-size` conflict group — it falls
 * through to a looser `text-*` pattern shared with the `text-color` group
 * and silently drops whichever of a size/colour pair came first (#2769).
 * Registering them here fixes that at the source, for every `cn()` caller.
 */
const twMerge = extendTailwindMerge({
  extend: { classGroups: { "font-size": [{ text: [...CUSTOM_SIZE_TOKENS] }] } },
});

/**
 * Combines class names with proper Tailwind CSS merging
 * Usage: cn('text-red-500', 'bg-blue-500', conditionalClass && 'mt-4')
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
