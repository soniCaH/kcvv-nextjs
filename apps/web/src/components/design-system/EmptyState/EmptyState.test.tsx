import type { ReactNode } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EmptyState } from "./EmptyState";

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: ReactNode;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("EmptyState — tier: surface (Tier 1)", () => {
  it("renders the heading with a terminal period", () => {
    render(
      <EmptyState tier="surface" heading="Nog geen sponsors">
        Body copy.
      </EmptyState>,
    );
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveTextContent("Nog geen sponsors.");
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

  it("renders no action row when actions are omitted (the null path)", () => {
    render(
      <EmptyState tier="surface" heading="Nog geen sponsors">
        Body.
      </EmptyState>,
    );
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.queryByRole("link")).toBeNull();
  });

  it("renders the mandatory undo action for a filter-empty surface", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <EmptyState
        tier="surface"
        heading="Geen artikelen in Jeugd"
        actions={[{ label: "Toon alles", onClick, variant: "ghost" }]}
      >
        Body.
      </EmptyState>,
    );
    await user.click(screen.getByRole("button", { name: "Toon alles" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("renders a link action with its href", () => {
    render(
      <EmptyState
        tier="surface"
        heading="Geen treffers"
        actions={[{ label: "Naar nieuws", href: "/nieuws" }]}
      >
        Body.
      </EmptyState>,
    );
    expect(screen.getByRole("link", { name: "Naar nieuws" })).toHaveAttribute(
      "href",
      "/nieuws",
    );
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

  it("emits the analytics marker on an action when supplied", () => {
    render(
      <EmptyState
        tier="surface"
        heading="Geen artikelen"
        actions={[
          {
            label: "Toon alles",
            onClick: vi.fn(),
            analyticsAction: "reset-filter",
          },
        ]}
      >
        Body.
      </EmptyState>,
    );
    expect(screen.getByRole("button", { name: "Toon alles" })).toHaveAttribute(
      "data-empty-state-action",
      "reset-filter",
    );
  });

  it("can suppress the accent emphasis on the heading", () => {
    const { container } = render(
      <EmptyState
        tier="surface"
        heading="Nog geen fotogalerijen"
        headingEmphasis={false}
      >
        Body.
      </EmptyState>,
    );
    expect(container.querySelector("h2 em")).toBeNull();
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

  it("renders no action, ever — the type system has no actions prop for this tier", () => {
    render(<EmptyState tier="slot">Geen gebeurtenissen</EmptyState>);
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.queryByRole("link")).toBeNull();
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
    const status = screen.getByRole("status");
    expect(
      within(status).getByText("Geen opstelling beschikbaar"),
    ).toBeInTheDocument();
  });
});
