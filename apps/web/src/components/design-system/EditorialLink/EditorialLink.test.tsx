import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EditorialLink } from "./EditorialLink";

describe("EditorialLink", () => {
  it("renders an anchor with the given href and children", () => {
    render(<EditorialLink href="/news">Lees meer</EditorialLink>);
    const link = screen.getByRole("link", { name: /lees meer/i });
    expect(link).toHaveAttribute("href", "/news");
  });

  it("defaults to inline variant + light tone", () => {
    const { container } = render(
      <EditorialLink href="/x">Inline</EditorialLink>,
    );
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveAttribute("data-variant", "inline");
    expect(el).toHaveAttribute("data-tone", "light");
  });

  it("inline variant omits the trailing arrow by default", () => {
    render(<EditorialLink href="/x">Inline</EditorialLink>);
    expect(screen.queryByText("→")).not.toBeInTheDocument();
  });

  it("cta variant renders the trailing arrow by default", () => {
    render(
      <EditorialLink href="/x" variant="cta">
        Bekijk alles
      </EditorialLink>,
    );
    expect(screen.getByText("→")).toBeInTheDocument();
  });

  it("cta variant can suppress the arrow with withArrow={false}", () => {
    render(
      <EditorialLink href="/x" variant="cta" withArrow={false}>
        No arrow
      </EditorialLink>,
    );
    expect(screen.queryByText("→")).not.toBeInTheDocument();
  });

  it("inline variant can opt-in to an arrow with withArrow", () => {
    render(
      <EditorialLink href="/x" withArrow>
        Inline + arrow
      </EditorialLink>,
    );
    expect(screen.getByText("→")).toBeInTheDocument();
  });

  it("dark tone sets data-tone='dark'", () => {
    const { container } = render(
      <EditorialLink href="/x" tone="dark">
        Dark
      </EditorialLink>,
    );
    expect(container.firstChild).toHaveAttribute("data-tone", "dark");
  });

  it("forwards className to the rendered anchor", () => {
    const { container } = render(
      <EditorialLink href="/x" className="custom-class">
        X
      </EditorialLink>,
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });

  // #2394 — a tripwire for deleting the hit area, not a proof it works: jsdom
  // computes no layout, so only the real coarse-pointer measurement at 390px
  // can show the target is big enough. Both halves are asserted because the
  // padding without the margin would reflow every section header.
  it("cta variant carries the hit area and its layout-neutralising margin", () => {
    const { container } = render(
      <EditorialLink href="/x" variant="cta">
        X
      </EditorialLink>,
    );
    expect(container.firstChild).toHaveClass("py-2", "-my-2");
  });
});
