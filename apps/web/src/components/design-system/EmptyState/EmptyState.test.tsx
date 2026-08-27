import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EmptyState } from "./EmptyState";

describe("EmptyState — tier: surface (Tier 1)", () => {
  it("renders the heading, at level 2 by default, with a terminal period", () => {
    render(
      <EmptyState tier="surface" heading="Nog geen sponsors">
        Body copy.
      </EmptyState>,
    );
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveTextContent("Nog geen sponsors.");
  });

  it("renders at a different heading tag when a page already has an adjacent h2", () => {
    render(
      <EmptyState tier="surface" heading="Geen artikelen" as="h3">
        Body.
      </EmptyState>,
    );
    expect(screen.getByRole("heading", { level: 3 })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 2 })).toBeNull();
  });

  it("renders the body copy", () => {
    render(
      <EmptyState tier="surface" heading="Nog geen sponsors">
        We zoeken partners.
      </EmptyState>,
    );
    expect(screen.getByText("We zoeken partners.")).toBeInTheDocument();
  });

  it("defaults the artefact slot to a taped JerseyShirt", () => {
    render(
      <EmptyState tier="surface" heading="Nog geen sponsors">
        Body.
      </EmptyState>,
    );
    // JerseyShirt is a silent artefact (#2559 rule 4) — assert the drawing
    // renders, not an accessible name it deliberately doesn't carry.
    expect(document.querySelector("figure[aria-hidden]")).toBeInTheDocument();
  });

  it("renders a custom artefact when the slot is passed", () => {
    render(
      <EmptyState
        tier="surface"
        heading="Nog geen resultaten"
        artefact={<span data-testid="custom-artefact">Bal</span>}
      >
        Body.
      </EmptyState>,
    );
    expect(screen.getByTestId("custom-artefact")).toBeInTheDocument();
    // The default jersey artefact must not render alongside a custom one.
    expect(document.querySelector("figure[aria-hidden]")).toBeNull();
  });

  it("renders no undo when reason is omitted (the null / pending path)", () => {
    render(
      <EmptyState tier="surface" heading="Nog geen sponsors">
        Body.
      </EmptyState>,
    );
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("renders the mandatory undo for reason='filtered'", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <EmptyState
        tier="surface"
        heading="Geen artikelen in Jeugd"
        reason="filtered"
        undo={{ label: "Toon alles", onClick }}
        analyticsSource="nieuws"
        analyticsFacet="Jeugd"
      >
        Body.
      </EmptyState>,
    );
    await user.click(screen.getByRole("button", { name: "Toon alles" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("always renders the data-empty-state-undo marker for reason='filtered' (#2691)", () => {
    // Unconditional, structural on `reason`, not an opt-in flag — no prop
    // can omit this marker. A single global listener (mounted once, near the
    // root layout) delegates the click into `empty_state_undo` off it,
    // mirroring how ErrorState renders `data-error-action` for
    // <ErrorAnalytics>. As of #2719, the wiring is no longer merely
    // structural-on-the-marker — `analyticsSource`/`analyticsFacet` are
    // REQUIRED props on this variant (see the type-level test below), so a
    // sixth filtered surface cannot compile without supplying the payload
    // the global listener needs. The old guard in
    // cross-page-consistency.test.ts (a regex-on-source check that a host
    // mounted `<EmptyStateUndoAnalytics>`) is superseded by this and has
    // been deleted.
    render(
      <EmptyState
        tier="surface"
        heading="Geen artikelen in Jeugd"
        reason="filtered"
        undo={{ label: "Toon alles", onClick: vi.fn() }}
        analyticsSource="nieuws"
        analyticsFacet="Jeugd"
      >
        Body.
      </EmptyState>,
    );
    expect(screen.getByRole("button", { name: "Toon alles" })).toHaveAttribute(
      "data-empty-state-undo",
      "undo",
    );
  });

  it("renders analyticsSource/analyticsFacet as inert data-* attributes on the undo button (#2719)", () => {
    // Mirrors ErrorState's `data-error-action={action.analyticsAction}`
    // (ErrorState.tsx:92) exactly: a plain string prop rendered as a data-*
    // attribute. `<EmptyState>` imports nothing from `@/components/analytics`
    // — the global listener reads these attributes, this component never
    // calls `trackEvent` itself.
    render(
      <EmptyState
        tier="surface"
        heading="Geen artikelen in Jeugd"
        reason="filtered"
        undo={{ label: "Toon alles", onClick: vi.fn() }}
        analyticsSource="nieuws"
        analyticsFacet="Jeugd"
      >
        Body.
      </EmptyState>,
    );
    const button = screen.getByRole("button", { name: "Toon alles" });
    expect(button).toHaveAttribute("data-empty-state-undo-source", "nieuws");
    expect(button).toHaveAttribute("data-empty-state-undo-facet", "Jeugd");
  });

  it("requires analyticsSource/analyticsFacet for reason='filtered' and forbids them otherwise — compile-time (#2719)", () => {
    // Type-level assertions, not runtime behavior: TypeScript, not vitest,
    // is the thing under test here. `@ts-expect-error` fails the *type
    // check* if the flagged line stops being an error — i.e. if the props
    // ever become optional again — which is what makes analytics wiring a
    // compile error at the call site instead of a convention a lint/regex
    // guard has to police (the whole point of #2719).
    render(
      // @ts-expect-error — reason="filtered" requires analyticsSource
      <EmptyState
        tier="surface"
        heading="Geen artikelen"
        reason="filtered"
        undo={{ label: "Toon alles", onClick: vi.fn() }}
        analyticsFacet="Jeugd"
      >
        Body.
      </EmptyState>,
    );

    render(
      // @ts-expect-error — reason="filtered" requires analyticsFacet
      <EmptyState
        tier="surface"
        heading="Geen artikelen"
        reason="filtered"
        undo={{ label: "Toon alles", onClick: vi.fn() }}
        analyticsSource="nieuws"
      >
        Body.
      </EmptyState>,
    );

    render(
      // @ts-expect-error — the pending (reason omitted) variant has no
      // analyticsSource/analyticsFacet prop at all
      <EmptyState
        tier="surface"
        heading="Nog geen sponsors"
        analyticsSource="nieuws"
      >
        Body.
      </EmptyState>,
    );

    expect(true).toBe(true);
  });

  it("is not a live region by default", () => {
    render(
      <EmptyState tier="surface" heading="Nog geen sponsors">
        Body.
      </EmptyState>,
    );
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("becomes a live region when a client-side filter empties the surface", () => {
    render(
      <EmptyState tier="surface" heading="Geen artikelen" live>
        Body.
      </EmptyState>,
    );
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("draws its own paper frame by default", () => {
    const { container } = render(
      <EmptyState tier="surface" heading="Nog geen sponsors">
        Body.
      </EmptyState>,
    );
    expect(container.firstElementChild).toHaveClass(
      "border-ink",
      "shadow-paper-sm",
    );
  });

  it("surface='bare' drops the frame for a host already inside another panel", () => {
    const { container } = render(
      <EmptyState
        tier="surface"
        heading="Geen wedstrijden gepland"
        surface="bare"
      >
        Body.
      </EmptyState>,
    );
    expect(container.firstElementChild).not.toHaveClass("border-ink");
    expect(container.firstElementChild).not.toHaveClass("shadow-paper-sm");
  });

  it("surface='inverse' keeps the frame but swaps to the soft shadow token, for a dark ground", () => {
    const { container } = render(
      <EmptyState
        tier="surface"
        heading="Nog geen evenementen gepland"
        surface="inverse"
      >
        Body.
      </EmptyState>,
    );
    expect(container.firstElementChild).toHaveClass(
      "border-ink",
      "shadow-paper-sm-soft",
    );
    expect(container.firstElementChild).not.toHaveClass("shadow-paper-sm");
  });
});

describe("EmptyState — tier: slot (Tier 2)", () => {
  it("renders the held-open label", () => {
    render(<EmptyState tier="slot">Geen opstelling beschikbaar</EmptyState>);
    expect(screen.getByText("Geen opstelling beschikbaar")).toBeInTheDocument();
  });

  it("renders no heading, ever", () => {
    const { container } = render(
      <EmptyState tier="slot">Geen gebeurtenissen</EmptyState>,
    );
    expect(container.querySelector("h1,h2,h3,h4,h5,h6")).toBeNull();
  });

  it("renders no action, ever — the type has no undo prop on this tier", () => {
    render(<EmptyState tier="slot">Geen gebeurtenissen</EmptyState>);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("is not a live region by default", () => {
    render(<EmptyState tier="slot">Geen opstelling beschikbaar</EmptyState>);
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("becomes a live region when opted in", () => {
    render(
      <EmptyState tier="slot" live>
        Geen opstelling beschikbaar
      </EmptyState>,
    );
    expect(screen.getByRole("status")).toHaveTextContent(
      "Geen opstelling beschikbaar",
    );
  });

  it("fills a flex host by default, so it holds the slot's shape", () => {
    const { container } = render(
      <EmptyState tier="slot">Geen opstelling beschikbaar</EmptyState>,
    );
    expect(container.firstElementChild).toHaveClass("flex-1");
  });
});
