/**
 * <TeamEditorial> — Phase 6.C editorial section for `/ploegen/[slug]`.
 *
 * Three independently auto-hiding blocks:
 *  - **Het verhaal** (`team.body`) — Portable Text prose. Reuses the 6.A
 *    `pullquote` decorator serializer (inline `<HighlighterStroke>`); the first
 *    pullquote run is lifted into a `<PullQuote>` card centred below the
 *    paragraph it echoes ("same text, two surfaces", 6.A.d5). It shares
 *    "Het verhaal"'s section rather than owning one of its own and sits in
 *    no aside column, so it renders at the default flow placement (cream)
 *    per #2515 rule 5 — not a jersey card kept for its old pixels.
 *    Attribution is intentionally omitted — a team has no single speaker
 *    and named-coach data is not fabricated (#1944 open Q).
 *  - **Contact** (`team.contactInfo`) — Portable Text prose.
 *
 * The whole section returns `null` when every block is empty.
 */

import { PortableText } from "@portabletext/react";
import type {
  PortableTextBlock,
  PortableTextComponents,
} from "@portabletext/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { EditorialHeading } from "@/components/design-system/EditorialHeading";
import { HighlighterStroke } from "@/components/design-system/HighlighterStroke";
import { PullQuote } from "@/components/design-system/PullQuote";
import {
  findNthPullquoteText,
  hasRenderableBioContent,
} from "@/lib/portable-text/findPullquoteText";

export interface TeamEditorialProps {
  /** `team.body` Portable Text — "Het verhaal" block. */
  body?: PortableTextBlock[] | null;
  /** `team.contactInfo` Portable Text — contact block. */
  contactInfo?: PortableTextBlock[] | null;
  className?: string;
}

// Reuses the 6.A pullquote decorator serializer (BioBlock): the marked run
// renders inline with a jersey HighlighterStroke pulled across it.
const pullquoteComponents: PortableTextComponents = {
  marks: {
    pullquote: ({ children }: { children?: ReactNode }) => (
      <HighlighterStroke color="jersey">{children}</HighlighterStroke>
    ),
  },
};

function hasBody(body: PortableTextBlock[] | null | undefined): boolean {
  return (
    Array.isArray(body) && body.length > 0 && hasRenderableBioContent(body)
  );
}

export function TeamEditorial({
  body,
  contactInfo,
  className,
}: TeamEditorialProps) {
  const showVerhaal = hasBody(body);
  const showContact = hasBody(contactInfo);

  if (!showVerhaal && !showContact) return null;

  const pullquoteText = showVerhaal ? findNthPullquoteText(body!, 0) : null;

  return (
    <div
      data-testid="team-editorial"
      className={cn(
        "mx-auto flex w-full max-w-[var(--container-prose)] flex-col gap-12",
        className,
      )}
    >
      {showVerhaal ? (
        <section data-testid="team-editorial-verhaal">
          <EditorialHeading
            level={2}
            size="display-sm"
            emphasis={{ text: "." }}
          >
            Het verhaal
          </EditorialHeading>
          <div className="text-ink font-body mt-4 text-base leading-relaxed [&_p]:mb-4 [&_p:last-child]:mb-0">
            <PortableText value={body!} components={pullquoteComponents} />
          </div>
          {pullquoteText !== null ? (
            <div className="mt-8 flex justify-center">
              {/* No speaker to attribute (see docblock) and no context
                  labels — the null path. `attribution={undefined}`
                  (rather than omitting the prop) is required by
                  PullQuoteProps' attribution-XOR-labels union. */}
              <PullQuote attribution={undefined} rotation={2}>
                {pullquoteText}
              </PullQuote>
            </div>
          ) : null}
        </section>
      ) : null}

      {showContact ? (
        <section data-testid="team-editorial-contact">
          <EditorialHeading
            level={2}
            size="display-sm"
            emphasis={{ text: "." }}
          >
            Contact
          </EditorialHeading>
          <div className="text-ink font-body mt-4 text-base leading-relaxed [&_p]:mb-4 [&_p:last-child]:mb-0">
            <PortableText value={contactInfo!} />
          </div>
        </section>
      ) : null}
    </div>
  );
}
