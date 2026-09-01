import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PullQuote } from "./PullQuote";

describe("PullQuote", () => {
  it("renders the quoted body inside <blockquote> (not <q> — #2515 rule 3)", () => {
    render(
      <PullQuote attribution={{ name: "Maxim" }}>
        Eindelijk weer een zege
      </PullQuote>,
    );
    const quote = screen
      .getByText("Eindelijk weer een zege")
      .closest("blockquote");
    expect(quote).not.toBeNull();
    expect(document.querySelector("q")).toBeNull();
  });

  it("renders the attribution name", () => {
    render(<PullQuote attribution={{ name: "Maxim" }}>x</PullQuote>);
    // MonoLabel applies CSS uppercase — the DOM text retains original case.
    expect(screen.getByText("Maxim")).toBeInTheDocument();
  });

  it("renders role and source when provided", () => {
    render(
      <PullQuote
        attribution={{ name: "Maxim", role: "A-PLOEG", source: "INTERVIEW" }}
      >
        x
      </PullQuote>,
    );
    expect(screen.getByText("A-PLOEG")).toBeInTheDocument();
    expect(screen.getByText("INTERVIEW")).toBeInTheDocument();
  });

  describe("state coverage — attribution / labels / null path (#2515 rule 1)", () => {
    it("omits the attribution row entirely when attribution is absent", () => {
      const { container } = render(
        <PullQuote attribution={undefined}>x</PullQuote>,
      );
      expect(
        container.querySelector('[data-pull-quote-name="display"]'),
      ).toBeNull();
      // No stray empty row — the flex column has exactly two children
      // (QuoteMark + blockquote), never a phantom third slot.
      const wrapper = container.querySelector("[data-pull-quote-tone]");
      expect(wrapper?.children).toHaveLength(2);
    });

    it("renders the attribution row when attribution is present", () => {
      const { container } = render(
        <PullQuote attribution={{ name: "Maxim" }}>x</PullQuote>,
      );
      const wrapper = container.querySelector("[data-pull-quote-tone]");
      expect(wrapper?.children).toHaveLength(3);
      expect(screen.getByText("Maxim")).toBeInTheDocument();
    });

    it("renders a MonoLabelRow of context labels when labels are present and attribution is absent", () => {
      render(
        <PullQuote labels={[{ label: "PLEZIER" }, { label: "TECHNIEK" }]}>
          x
        </PullQuote>,
      );
      expect(screen.getByText("PLEZIER")).toBeInTheDocument();
      expect(screen.getByText("TECHNIEK")).toBeInTheDocument();
    });

    it("renders nothing in the row slot when neither attribution nor labels are given — the null path", () => {
      const { container } = render(
        <PullQuote attribution={undefined}>x</PullQuote>,
      );
      expect(container.querySelector("[data-divider]")).toBeNull();
      expect(container.querySelectorAll("span").length).toBeGreaterThan(0); // QuoteMark still renders
    });

    it("omits the attribution row when the name is blank — a caller's raw, possibly-empty value needs no ternary (code review finding 4)", () => {
      const { container } = render(
        <PullQuote attribution={{ name: "" }}>x</PullQuote>,
      );
      const wrapper = container.querySelector("[data-pull-quote-tone]");
      expect(wrapper?.children).toHaveLength(2);
    });

    it("omits the attribution row when the name is whitespace-only", () => {
      const { container } = render(
        <PullQuote attribution={{ name: "   " }}>x</PullQuote>,
      );
      const wrapper = container.querySelector("[data-pull-quote-tone]");
      expect(wrapper?.children).toHaveLength(2);
    });

    it("does not compile with both attribution and labels — enforced by the type checker, not a runtime warning (code review finding 3)", () => {
      const element = (
        // @ts-expect-error — attribution and labels are mutually exclusive.
        <PullQuote attribution={{ name: "Maxim" }} labels={[{ label: "X" }]}>
          x
        </PullQuote>
      );
      expect(element).toBeTruthy();
    });
  });

  it("default placement is flow → tone cream", () => {
    const { container } = render(
      <PullQuote attribution={{ name: "x" }}>x</PullQuote>,
    );
    expect(
      container.querySelector('[data-pull-quote-tone="cream"]'),
    ).not.toBeNull();
    expect(
      container.querySelector('[data-pull-quote-placement="flow"]'),
    ).not.toBeNull();
  });

  it("placement='section' derives ink tone", () => {
    const { container } = render(
      <PullQuote placement="section" attribution={{ name: "x" }}>
        x
      </PullQuote>,
    );
    expect(
      container.querySelector('[data-pull-quote-tone="ink"]'),
    ).not.toBeNull();
  });

  it("placement='aside' derives jersey tone", () => {
    const { container } = render(
      <PullQuote placement="aside" attribution={{ name: "x" }}>
        x
      </PullQuote>,
    );
    expect(
      container.querySelector('[data-pull-quote-tone="jersey"]'),
    ).not.toBeNull();
  });

  it("renders non-string children (e.g. Portable Text marks already resolved by the caller) as-is", () => {
    render(
      <PullQuote attribution={{ name: "x" }}>
        <span data-testid="rich-child">rich text</span>
      </PullQuote>,
    );
    expect(screen.getByTestId("rich-child")).toBeInTheDocument();
  });

  describe("avatarSlot layout (5.d2 lock)", () => {
    it("renders the avatar slot when provided", () => {
      const { container } = render(
        <PullQuote
          attribution={{ name: "Wim", role: "TRAINER" }}
          avatarSlot={<div data-testid="custom-avatar">avatar</div>}
        >
          x
        </PullQuote>,
      );
      expect(
        container.querySelector('[data-testid="custom-avatar"]'),
      ).not.toBeNull();
    });

    it("flips the attribution name to italic display when an avatar slot is supplied", () => {
      const { container } = render(
        <PullQuote
          attribution={{ name: "Wim" }}
          avatarSlot={<span data-testid="avatar" />}
        >
          x
        </PullQuote>,
      );
      const nameEl = container.querySelector(
        '[data-pull-quote-name="display"]',
      );
      expect(nameEl).not.toBeNull();
      expect(nameEl?.className).toContain("font-display");
      expect(nameEl?.className).toContain("italic");
      expect(nameEl?.textContent).toBe("Wim");
    });

    it("renders role + source on a separate line beside the avatar", () => {
      render(
        <PullQuote
          attribution={{
            name: "Wim",
            role: "TRAINER",
            source: "SEIZOEN 25-26",
          }}
          avatarSlot={<span data-testid="avatar" />}
        >
          x
        </PullQuote>,
      );
      expect(screen.getByText("TRAINER")).toBeInTheDocument();
      expect(screen.getByText("SEIZOEN 25-26")).toBeInTheDocument();
    });

    it("falls back to inline mono caps row when no avatar slot is supplied", () => {
      const { container } = render(
        <PullQuote attribution={{ name: "Wim", role: "TRAINER" }}>x</PullQuote>,
      );
      expect(
        container.querySelector('[data-pull-quote-name="display"]'),
      ).toBeNull();
    });
  });
});
