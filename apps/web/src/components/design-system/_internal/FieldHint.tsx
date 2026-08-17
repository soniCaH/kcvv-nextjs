/**
 * FieldHint — the helper line under a form atom.
 *
 * One implementation shared by `<Input>`, `<Select>` and `<Textarea>`, which
 * carried three byte-identical copies of it before D4 gave the hint its
 * bracket (`docs/research/decision-sheet.md` §8, unit 10 of #2608).
 *
 * The line opens with the mono `[?]`. There is deliberately no icon here:
 * D4 is additive punctuation that rides *beside* an icon that already
 * exists, and a hint has never carried one — inventing a glyph so the
 * bracket has company is the inverse of the decision, and the surest way to
 * turn the brackets into the second icon language the ticket warns about.
 * The error line is where this field does have an icon, and that is
 * `<AlertBadge>`'s Phosphor Fill glyph, which the bracket must not touch.
 *
 * The bracket is decoration: this `<p>` is the field's `aria-describedby`
 * target, so its accessible description must stay the hint sentence alone.
 * `<BracketAffordance>` is `aria-hidden`, and the hint text stays a direct
 * text-node child of the `<p>` — which is also what the atoms'
 * `getByText("…")` tests read.
 */

import type { ReactNode } from "react";
import { BracketAffordance } from "@/components/design-system/BracketAffordance";

export interface FieldHintProps {
  /** Id the field points at with `aria-describedby`. */
  id: string;
  /** Hint sentence — the whole of the accessible description. */
  children: ReactNode;
}

export function FieldHint({ id, children }: FieldHintProps) {
  return (
    <p id={id} className="font-body text-ink/60 mt-2 text-sm italic">
      <BracketAffordance glyph="help" className="mr-1.5" />
      {children}
    </p>
  );
}
