// apps/web/src/lib/utils/card-subject-artefact.tsx
import type { ReactNode } from "react";
import {
  Crest,
  JerseyIllustration,
  JerseyShirt,
} from "@/components/design-system";

/**
 * The four subject kinds an imageless card can stand in for (#2462). Every
 * kind but `"document"` has a subject-specific artefact; a document falls
 * through to `<NewsCard>`'s own default hatch instead — see
 * `getCardSubjectArtefact` below.
 */
export type CardArtefactSubject =
  | {
      kind: "person";
      /**
       * The #2485 amendment to #2462 rule 1 — *person* resolves one level
       * finer, keyed on the document the card was built from, never on the
       * route and never on role text. A player document takes the jersey;
       * a staff document takes the coat.
       */
      personType: "player" | "staff";
      /**
       * Stable identity seeding `<JerseyIllustration>`'s per-player draw
       * (#2635) — an id, never a display name. Build via `playerFigureSeed`
       * for a player subject if convenient; any stable id works.
       */
      seed: string;
    }
  | {
      kind: "team";
      /** Optional chest letter (e.g. age group) — forwarded to `<JerseyShirt>`. */
      ageLabel?: string | null;
    }
  | {
      kind: "club";
      /** Club / opponent name — drives `<Crest>`'s initialled-disc fallback. */
      name: string;
      /**
       * Club logo URL. Passed through to `<Crest>` unchanged — see the
       * placeholder-crest docblock below.
       */
      logoUrl?: string | null;
    }
  | { kind: "document" };

// Measured at #2462: a 180×180 crest, contained in a 288px card, lands at
// ~121px with no upscale. `<JerseyShirt>`'s own default (240px) and its
// documented corner-anchor override (140px) bracket that number, so 128px
// (Tailwind `h-32`/`w-32`) keeps every artefact in this same visual
// register across subject kinds. `<Crest>`'s `size` prop takes the number
// directly; `<JerseyShirt>`'s override must stay a static Tailwind class
// (a template-literal arbitrary value is invisible to Tailwind's static
// scanner and silently ships no CSS at all) — keep the two in sync by hand
// if this ever changes.
const ARTEFACT_SLOT_SIZE = 128;
const ARTEFACT_SLOT_SIZE_CLASS = "mx-0 h-32 w-32";

/**
 * Maps an imageless card's subject to its own artefact — #2462's resolution
 * for "a card without a photo shows its own subject's artefact… rather
 * than a generic texture." One helper owns this mapping (#2462 rule 5) so
 * no call-site re-decides it; pass the result straight to `<NewsCard
 * fallback>` (or any consumer of the same slot shape).
 *
 * `"document"` resolves to `undefined` on purpose (#2462 rule 2) — a
 * document has no artefact, and that is not a gap: there is no illustration
 * for "a piece of writing", so the hatch (`<NewsCard>`'s own default when
 * `fallback` is omitted) keeps its job. It is the only one of the four
 * subject kinds that says nothing about its subject, which is exactly
 * right for the one kind that has nothing to depict.
 *
 * Every returned artefact sits on `bg-cream-soft` and is **contained, never
 * covered** (#2462 rule 3) — `object-contain` on the crest, a fixed-size
 * figure centred in the slot for the team shirt — and the slot itself keeps
 * whatever aspect ratio the caller already gave it (#2462 rule 4); nothing
 * here switches the image region to a different shape.
 *
 * ## The placeholder crest is accepted at every scale (#2472)
 *
 * A club's logo — a real crest, or PSD's generic grey-shield placeholder
 * returned for an unknown club id, or (rarer) a real per-club URL that
 * decodes to a fully transparent image — is rendered exactly the same way,
 * at every size, with **no detection of any kind**: no byte-hashing, no
 * redirect-target check, no `?v=` sniffing, no deny-list. `<Crest>`'s
 * `object-contain` sizing already makes every one of those cases read as a
 * harmless institutional shield (or, in the transparent case, an empty
 * cream slot) rather than a broken image — measured against real
 * production crests at every shipped size plus this artefact's ~121px
 * card scale, and neither failure mode read as a defect at any of them.
 * A missing or wrong crest is upstream data work in PSD, never something
 * this site invents at render time.
 *
 * Do not reintroduce a detector here. #2472's resolution comment records
 * six ways one was tried and found insufficient — cheapest of them (a
 * redirect-target read) still missed the fully-transparent case, which no
 * header or URL shape can see; only decoding pixels can, and that cost was
 * rejected. If this rule is ever revisited, read that comment first.
 */
export function getCardSubjectArtefact(
  subject: CardArtefactSubject,
): ReactNode | undefined {
  switch (subject.kind) {
    case "person":
      return (
        <JerseyIllustration
          variant="card"
          seed={subject.seed}
          garment={subject.personType === "staff" ? "coat" : "jersey"}
        />
      );
    case "team":
      return (
        <div className="bg-cream-soft absolute inset-0 flex items-center justify-center">
          <JerseyShirt
            letterOverlay={subject.ageLabel ?? undefined}
            className={ARTEFACT_SLOT_SIZE_CLASS}
          />
        </div>
      );
    case "club":
      return (
        <div className="bg-cream-soft absolute inset-0 flex items-center justify-center">
          <Crest
            name={subject.name}
            logo={subject.logoUrl ?? undefined}
            size={ARTEFACT_SLOT_SIZE}
          />
        </div>
      );
    case "document":
      return undefined;
    default: {
      // Exhaustiveness guard — a fifth subject kind breaks this
      // never-assignment until a case is added above.
      const _exhaustive: never = subject;
      void _exhaustive;
      return undefined;
    }
  }
}
