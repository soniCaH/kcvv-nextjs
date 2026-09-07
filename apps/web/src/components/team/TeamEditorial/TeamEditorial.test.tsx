/**
 * TeamEditorial unit tests.
 *
 * Covers:
 *  - Whole-section auto-hide when body + contact both empty
 *  - "Het verhaal" block: renders body prose; lifts the first pullquote run
 *    into a PullQuote card; no pullquote → no card
 *  - Contact block renders PT; auto-hides when empty
 *  - Per-block independence (one present, other absent)
 *
 * The training-schedule block was deleted, not restyled (#2582 / #2476 rule
 * 10) — training times live in PSD and members are sent there.
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import type { PortableTextBlock } from "@portabletext/react";
import { TeamEditorial } from "./TeamEditorial";

function block(
  ...spans: ReadonlyArray<{ text: string; marks?: string[] }>
): PortableTextBlock {
  return {
    _type: "block",
    _key: `block-${spans.map((s) => s.text.slice(0, 3)).join("-")}`,
    style: "normal",
    children: spans.map((span, i) => ({
      _type: "span",
      _key: `span-${i}`,
      text: span.text,
      marks: span.marks ?? [],
    })),
    markDefs: [],
  } as unknown as PortableTextBlock;
}

const BODY_WITH_PULLQUOTE: PortableTextBlock[] = [
  block(
    { text: "De A-ploeg speelt al jaren in de hoogste reeks. " },
    { text: "Dit is onze thuis.", marks: ["pullquote"] },
  ),
];

const BODY_NO_PULLQUOTE: PortableTextBlock[] = [
  block({ text: "Een korte beschrijving zonder citaat." }),
];

const CONTACT: PortableTextBlock[] = [
  block({ text: "Secretariaat: info@kcvvelewijt.be" }),
];

describe("TeamEditorial", () => {
  it("auto-hides the whole section when everything is empty", () => {
    const { container } = render(
      <TeamEditorial body={[]} contactInfo={null} />,
    );
    expect(container.firstChild).toBeNull();
  });

  describe("Het verhaal (body)", () => {
    it("renders the body prose", () => {
      render(<TeamEditorial body={BODY_WITH_PULLQUOTE} />);
      expect(
        screen.getByTestId("team-editorial-verhaal").textContent,
      ).toContain("De A-ploeg speelt al jaren");
    });

    it("lifts the first pullquote run into a PullQuote card", () => {
      render(<TeamEditorial body={BODY_WITH_PULLQUOTE} />);
      // "Dit is onze thuis." appears twice: inline highlight + lifted card.
      const matches = screen.getAllByText(/Dit is onze thuis\./);
      expect(matches.length).toBeGreaterThanOrEqual(2);
    });

    it("renders no PullQuote card when the body has no pullquote", () => {
      render(<TeamEditorial body={BODY_NO_PULLQUOTE} />);
      const matches = screen.getAllByText(/Een korte beschrijving/);
      // Only the inline prose occurrence — no lifted duplicate.
      expect(matches).toHaveLength(1);
    });

    it("auto-hides the verhaal block when body is empty", () => {
      render(<TeamEditorial contactInfo={CONTACT} />);
      expect(screen.queryByTestId("team-editorial-verhaal")).toBeNull();
    });
  });

  it("never renders a training-schedule block — deleted, not restyled (#2582)", () => {
    render(<TeamEditorial body={BODY_NO_PULLQUOTE} contactInfo={CONTACT} />);
    expect(screen.queryByTestId("team-editorial-training")).toBeNull();
  });

  describe("Contact", () => {
    it("renders the contact prose", () => {
      render(<TeamEditorial contactInfo={CONTACT} />);
      expect(
        screen.getByTestId("team-editorial-contact").textContent,
      ).toContain("info@kcvvelewijt.be");
    });

    it("auto-hides when contactInfo is empty", () => {
      render(<TeamEditorial body={BODY_NO_PULLQUOTE} />);
      expect(screen.queryByTestId("team-editorial-contact")).toBeNull();
    });
  });
});
