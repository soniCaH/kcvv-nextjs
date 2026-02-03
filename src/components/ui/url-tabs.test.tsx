/**
 * Tests for UrlTabs component
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as Tabs from "@radix-ui/react-tabs";
import { UrlTabs } from "./url-tabs";

// Mock Next.js navigation hooks
const mockReplace = vi.fn();
let mockSearchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
  usePathname: () => "/team/a-ploeg",
  useSearchParams: () => mockSearchParams,
}));

describe("UrlTabs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams = new URLSearchParams();
  });

  it("renders with default tab active", () => {
    render(
      <UrlTabs defaultValue="info" validTabs={["info", "lineup", "matches"]}>
        <Tabs.List>
          <Tabs.Trigger value="info">Info</Tabs.Trigger>
          <Tabs.Trigger value="lineup">Lineup</Tabs.Trigger>
          <Tabs.Trigger value="matches">Matches</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="info">Info content</Tabs.Content>
        <Tabs.Content value="lineup">Lineup content</Tabs.Content>
        <Tabs.Content value="matches">Matches content</Tabs.Content>
      </UrlTabs>,
    );

    expect(screen.getByText("Info content")).toBeInTheDocument();
    expect(screen.queryByText("Lineup content")).not.toBeInTheDocument();
  });

  it("shows correct tab content when URL has tab param", () => {
    mockSearchParams = new URLSearchParams("tab=matches");

    render(
      <UrlTabs defaultValue="info" validTabs={["info", "lineup", "matches"]}>
        <Tabs.List>
          <Tabs.Trigger value="info">Info</Tabs.Trigger>
          <Tabs.Trigger value="lineup">Lineup</Tabs.Trigger>
          <Tabs.Trigger value="matches">Matches</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="info">Info content</Tabs.Content>
        <Tabs.Content value="lineup">Lineup content</Tabs.Content>
        <Tabs.Content value="matches">Matches content</Tabs.Content>
      </UrlTabs>,
    );

    expect(screen.getByText("Matches content")).toBeInTheDocument();
    expect(screen.queryByText("Info content")).not.toBeInTheDocument();
  });

  it("falls back to default if URL tab is invalid", () => {
    mockSearchParams = new URLSearchParams("tab=invalid-tab");

    render(
      <UrlTabs defaultValue="info" validTabs={["info", "lineup", "matches"]}>
        <Tabs.List>
          <Tabs.Trigger value="info">Info</Tabs.Trigger>
          <Tabs.Trigger value="lineup">Lineup</Tabs.Trigger>
          <Tabs.Trigger value="matches">Matches</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="info">Info content</Tabs.Content>
        <Tabs.Content value="lineup">Lineup content</Tabs.Content>
        <Tabs.Content value="matches">Matches content</Tabs.Content>
      </UrlTabs>,
    );

    // Should fall back to default
    expect(screen.getByText("Info content")).toBeInTheDocument();
  });

  it("applies className to root element", () => {
    const { container } = render(
      <UrlTabs
        defaultValue="info"
        validTabs={["info"]}
        className="custom-class"
      >
        <Tabs.List>
          <Tabs.Trigger value="info">Info</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="info">Info content</Tabs.Content>
      </UrlTabs>,
    );

    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("updates URL when tab is clicked", async () => {
    const user = userEvent.setup();

    render(
      <UrlTabs defaultValue="info" validTabs={["info", "lineup", "matches"]}>
        <Tabs.List>
          <Tabs.Trigger value="info">Info</Tabs.Trigger>
          <Tabs.Trigger value="lineup">Lineup</Tabs.Trigger>
          <Tabs.Trigger value="matches">Matches</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="info">Info content</Tabs.Content>
        <Tabs.Content value="lineup">Lineup content</Tabs.Content>
        <Tabs.Content value="matches">Matches content</Tabs.Content>
      </UrlTabs>,
    );

    // Click lineup tab
    await user.click(screen.getByRole("tab", { name: "Lineup" }));

    // Should update URL with tab parameter
    expect(mockReplace).toHaveBeenCalledWith("/team/a-ploeg?tab=lineup", {
      scroll: false,
    });
  });

  it("removes tab param when clicking default tab", async () => {
    const user = userEvent.setup();
    mockSearchParams = new URLSearchParams("tab=lineup");

    render(
      <UrlTabs defaultValue="info" validTabs={["info", "lineup", "matches"]}>
        <Tabs.List>
          <Tabs.Trigger value="info">Info</Tabs.Trigger>
          <Tabs.Trigger value="lineup">Lineup</Tabs.Trigger>
          <Tabs.Trigger value="matches">Matches</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="info">Info content</Tabs.Content>
        <Tabs.Content value="lineup">Lineup content</Tabs.Content>
        <Tabs.Content value="matches">Matches content</Tabs.Content>
      </UrlTabs>,
    );

    // Click info tab (default)
    await user.click(screen.getByRole("tab", { name: "Info" }));

    // Should remove tab parameter for cleaner URL
    expect(mockReplace).toHaveBeenCalledWith("/team/a-ploeg", {
      scroll: false,
    });
  });

  it("supports custom param name", async () => {
    const user = userEvent.setup();

    render(
      <UrlTabs
        defaultValue="info"
        validTabs={["info", "lineup"]}
        paramName="section"
      >
        <Tabs.List>
          <Tabs.Trigger value="info">Info</Tabs.Trigger>
          <Tabs.Trigger value="lineup">Lineup</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="info">Info content</Tabs.Content>
        <Tabs.Content value="lineup">Lineup content</Tabs.Content>
      </UrlTabs>,
    );

    await user.click(screen.getByRole("tab", { name: "Lineup" }));

    expect(mockReplace).toHaveBeenCalledWith("/team/a-ploeg?section=lineup", {
      scroll: false,
    });
  });
});
