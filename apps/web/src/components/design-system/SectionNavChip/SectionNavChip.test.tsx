import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SectionNavChip } from "./SectionNavChip";

describe("SectionNavChip", () => {
  it("renders an anchor pointing at the section id", () => {
    render(<SectionNavChip id="spelers" label="Spelers" isActive={false} />);
    expect(screen.getByRole("link", { name: "Spelers" })).toHaveAttribute(
      "href",
      "#spelers",
    );
  });

  it("renders the light chip recipe at rest — 1px border, 1px shadow, no press-down", () => {
    render(<SectionNavChip id="spelers" label="Spelers" isActive={false} />);
    const link = screen.getByRole("link", { name: "Spelers" });
    expect(link).toHaveClass("border");
    expect(link).not.toHaveClass("border-2");
    expect(link.className).toContain("shadow-[1px_1px_0_0_var(--color-ink)]");
    expect(link).not.toHaveClass("hover:translate-x-1");
  });

  it("fills active with bg-jersey-deep and aria-current, no shadow", () => {
    render(<SectionNavChip id="spelers" label="Spelers" isActive={true} />);
    const link = screen.getByRole("link", { name: "Spelers" });
    expect(link).toHaveAttribute("aria-current", "location");
    expect(link).toHaveClass("bg-jersey-deep");
    expect(link.className).not.toContain(
      "shadow-[1px_1px_0_0_var(--color-ink)]",
    );
  });

  it("moves focus into the target section on click", async () => {
    const user = userEvent.setup();
    const target = document.createElement("div");
    target.id = "spelers";
    document.body.appendChild(target);
    const focusSpy = vi.spyOn(target, "focus");

    render(<SectionNavChip id="spelers" label="Spelers" isActive={false} />);
    await user.click(screen.getByRole("link", { name: "Spelers" }));

    expect(focusSpy).toHaveBeenCalledWith({ preventScroll: true });
    target.remove();
  });
});
