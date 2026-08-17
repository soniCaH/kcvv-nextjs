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
      >
        Body.
      </EmptyState>,
    );
    await user.click(screen.getByRole("button", { name: "Toon alles" }));
    expect(onClick).toHaveBeenCalledOnce();
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
