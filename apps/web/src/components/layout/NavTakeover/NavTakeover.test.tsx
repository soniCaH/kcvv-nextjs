import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRef } from "react";
import { NavTakeover } from "./NavTakeover";
import { NavTakeoverItem } from "./NavTakeoverItem";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

describe("NavTakeover", () => {
  it("renders nothing when closed", () => {
    const { container } = render(
      <NavTakeover
        open={false}
        onOpenChange={() => {}}
        wordmark={<span>WM</span>}
      >
        <NavTakeoverItem label="Home" href="/" />
      </NavTakeover>,
    );
    expect(container.querySelector('[role="dialog"]')).toBeNull();
  });

  it("renders dialog with wordmark + close button when open", () => {
    render(
      <NavTakeover open onOpenChange={() => {}} wordmark={<span>WM</span>}>
        <NavTakeoverItem label="Home" href="/" />
      </NavTakeover>,
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("WM")).toBeInTheDocument();
    expect(screen.getByLabelText(/sluit menu/i)).toBeInTheDocument();
  });

  it("locks body scroll while open and restores it on close", () => {
    const { rerender } = render(
      <NavTakeover open onOpenChange={() => {}} wordmark={<span>WM</span>}>
        <NavTakeoverItem label="Home" href="/" />
      </NavTakeover>,
    );
    expect(document.body.style.overflow).toBe("hidden");
    rerender(
      <NavTakeover
        open={false}
        onOpenChange={() => {}}
        wordmark={<span>WM</span>}
      >
        <NavTakeoverItem label="Home" href="/" />
      </NavTakeover>,
    );
    expect(document.body.style.overflow).toBe("");
  });

  it("calls onOpenChange(false) when ✕ is clicked", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <NavTakeover open onOpenChange={onOpenChange} wordmark={<span>WM</span>}>
        <NavTakeoverItem label="Home" href="/" />
      </NavTakeover>,
    );
    await user.click(screen.getByLabelText(/sluit menu/i));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("calls onOpenChange(false) when Escape is pressed", () => {
    const onOpenChange = vi.fn();
    render(
      <NavTakeover open onOpenChange={onOpenChange} wordmark={<span>WM</span>}>
        <NavTakeoverItem label="Home" href="/" />
      </NavTakeover>,
    );
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("returns focus to the trigger when closed", () => {
    function Harness({ open }: { open: boolean }) {
      const triggerRef = useRef<HTMLButtonElement>(null);
      return (
        <>
          <button ref={triggerRef} data-testid="trigger">
            open
          </button>
          <NavTakeover
            open={open}
            onOpenChange={() => {}}
            wordmark={<span>WM</span>}
            returnFocusRef={triggerRef}
          >
            <NavTakeoverItem label="Home" href="/" />
          </NavTakeover>
        </>
      );
    }
    const { rerender } = render(<Harness open />);
    rerender(<Harness open={false} />);
    expect(document.activeElement).toBe(screen.getByTestId("trigger"));
  });

  it("does not steal focus on initial mount when open=false", () => {
    function Harness() {
      const triggerRef = useRef<HTMLButtonElement>(null);
      return (
        <>
          <button ref={triggerRef} data-testid="trigger">
            open
          </button>
          <NavTakeover
            open={false}
            onOpenChange={() => {}}
            wordmark={<span>WM</span>}
            returnFocusRef={triggerRef}
          >
            <NavTakeoverItem label="Home" href="/" />
          </NavTakeover>
        </>
      );
    }
    render(<Harness />);
    expect(document.activeElement).not.toBe(screen.getByTestId("trigger"));
  });
});

describe("NavTakeoverItem", () => {
  it("renders a leaf link with the given href", () => {
    render(<NavTakeoverItem label="Home" href="/" />);
    const link = screen.getByRole("link", { name: "Home" });
    expect(link).toHaveAttribute("href", "/");
  });

  it("applies active jersey-deep tone", () => {
    render(<NavTakeoverItem label="Nieuws" href="/nieuws" active />);
    const link = screen.getByRole("link", { name: "Nieuws" });
    expect(link.className).toContain("text-jersey-deep");
  });
});
