import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EmptyState } from "./EmptyState";
import type {
  EmptyStateSurfaceFilteredProps,
  EmptyStateSurfacePendingProps,
} from "./EmptyState";

// Type-level assertions (#2719) — TypeScript, not vitest, is what's under
// test here. `@ts-expect-error` fails the *type check* if the flagged line
// stops being an error (i.e. if `undo`'s analytics fields ever become
// optional again, or the pending variant grows an `undo` field), which is
// what makes analytics wiring a compile error at the call site instead of a
// convention a lint/regex guard has to police. Bare const declarations, not
// `render()` calls — no runtime behavior is under test.
const _missingAnalyticsSource: EmptyStateSurfaceFilteredProps = {
  tier: "surface",
  heading: "Geen artikelen",
  reason: "filtered",
  children: "Body.",
  // @ts-expect-error — reason="filtered" requires undo.analyticsSource
  undo: { label: "Toon alles", onClick: () => {}, analyticsFacet: "Jeugd" },
};
const _missingAnalyticsFacet: EmptyStateSurfaceFilteredProps = {
  tier: "surface",
  heading: "Geen artikelen",
  reason: "filtered",
  children: "Body.",
  // @ts-expect-error — reason="filtered" requires undo.analyticsFacet
  undo: { label: "Toon alles", onClick: () => {}, analyticsSource: "nieuws" },
};
const _pendingWithUndo: EmptyStateSurfacePendingProps = {
  tier: "surface",
  heading: "Nog geen sponsors",
  children: "Body.",
  // @ts-expect-error — the pending (reason omitted) variant has no `undo`
  // field at all, so it has nothing to attach analytics fields to
  undo: {
    label: "Toon alles",
    onClick: () => {},
    analyticsSource: "nieuws",
    analyticsFacet: "Jeugd",
  },
};

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
        undo={{
          label: "Toon alles",
          onClick,
          analyticsSource: "nieuws",
          analyticsFacet: "Jeugd",
        }}
      >
        Body.
      </EmptyState>,
    );
    await user.click(screen.getByRole("button", { name: "Toon alles" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("renders undo.analyticsSource/analyticsFacet as inert data-* attributes on the undo button (#2719)", () => {
    // Mirrors ErrorState's `data-error-action={action.analyticsAction}`
    // (ErrorState.tsx:92): a plain string field rendered as a data-*
    // attribute. `<EmptyState>` imports nothing from `@/components/analytics`
    // at runtime — the global listener (`EmptyStateUndoTracker`) reads these
    // attributes off a click target; this component never calls `trackEvent`
    // itself. See the type-level assertions above this file's `describe` for
    // the compile-time half of the guarantee.
    render(
      <EmptyState
        tier="surface"
        heading="Geen artikelen in Jeugd"
        reason="filtered"
        undo={{
          label: "Toon alles",
          onClick: vi.fn(),
          analyticsSource: "nieuws",
          analyticsFacet: "Jeugd",
        }}
      >
        Body.
      </EmptyState>,
    );
    const button = screen.getByRole("button", { name: "Toon alles" });
    expect(button).toHaveAttribute("data-empty-state-undo-source", "nieuws");
    expect(button).toHaveAttribute("data-empty-state-undo-facet", "Jeugd");
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

  it("defaults background to transparent (border-ink-muted, no fill) — every existing consumer's baseline stays put", () => {
    const { container } = render(
      <EmptyState tier="slot">Geen opstelling beschikbaar</EmptyState>,
    );
    expect(container.firstElementChild).toHaveClass("border-ink-muted");
    expect(container.firstElementChild).not.toHaveClass("bg-cream-soft");
  });

  it('switches to a solid ink border on a cream-soft fill with background="cream-soft" (#2636 finding 12)', () => {
    const { container } = render(
      <EmptyState tier="slot" background="cream-soft">
        De kalender voor dit seizoen is nog niet bekendgemaakt.
      </EmptyState>,
    );
    expect(container.firstElementChild).toHaveClass(
      "border-ink",
      "bg-cream-soft",
    );
    expect(container.firstElementChild).not.toHaveClass("border-ink-muted");
  });
});
