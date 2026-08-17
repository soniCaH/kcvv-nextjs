import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import type { EventListItemVM } from "@/lib/repositories/event.repository";
import { trackEvent } from "@/lib/analytics/track-event";
import { EventsBrowser } from "./EventsBrowser";

vi.mock("@/lib/analytics/track-event", () => ({ trackEvent: vi.fn() }));
const mockTrackEvent = vi.mocked(trackEvent);

function ev(
  overrides: Partial<EventListItemVM> & { id: string },
): EventListItemVM {
  return {
    title: "Evenement",
    href: `/evenementen/${overrides.id}`,
    eventType: "Clubevent",
    dateStart: "2026-09-12T18:00:00Z",
    dateEnd: null,
    location: "Sportpark Driesput, Elewijt",
    source: "event",
    ...overrides,
  };
}

const EVENTS: EventListItemVM[] = [
  ev({
    id: "spaghetti-avond",
    title: "Spaghetti-avond",
    eventType: "Clubevent",
  }),
  ev({
    id: "supportersreis",
    title: "Supportersreis",
    eventType: "Supportersactiviteit",
    dateStart: "2026-10-04T08:00:00Z",
  }),
];

describe("<EventsBrowser>", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the genuine-empty state, filter row kept visible (#2427 rule 5)", () => {
    render(<EventsBrowser events={[]} />);

    // "Nog geen" — events can still arrive.
    expect(
      screen.getByRole("heading", { name: /nog geen evenementen gepland/i }),
    ).toBeInTheDocument();
    // The structural special-case that hid the filter row on a genuinely
    // empty list was considered and rejected: the chips are a fixed set
    // regardless of data, so hiding them here bought nothing.
    expect(
      screen.getByRole("group", { name: /filter evenementen op type/i }),
    ).toBeInTheDocument();
  });

  it("offers the undo when a facet is selected against a genuinely empty feed", async () => {
    // Off-season /evenementen: the feed is empty, but the filter row still
    // renders (rule 5) and is interactive. Selecting a chip must still name
    // the facet and offer the undo — the old branch, keyed on `events.length`
    // rather than the active facet, rendered the genuine-empty copy with no
    // action here (#2562 review).
    render(<EventsBrowser events={[]} />);

    await userEvent.click(screen.getByRole("button", { name: "Clubevent" }));

    expect(
      screen.getByRole("heading", {
        name: /geen evenementen in de categorie clubevent/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Toon alles" }),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Toon alles" }));

    expect(
      screen.getByRole("heading", { name: /nog geen evenementen gepland/i }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Toon alles" })).toBeNull();
  });

  it("renders the filter row and every event by default", () => {
    render(<EventsBrowser events={EVENTS} />);

    expect(
      screen.getByRole("group", { name: /filter evenementen op type/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /spaghetti-avond/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /supportersreis/i }),
    ).toBeInTheDocument();
  });

  it("narrows the list to the selected type and hides non-matching months", async () => {
    render(<EventsBrowser events={EVENTS} />);

    await userEvent.click(screen.getByRole("button", { name: "Clubevent" }));

    expect(
      screen.getByRole("link", { name: /spaghetti-avond/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /supportersreis/i }),
    ).not.toBeInTheDocument();
    // The Clubevent is in September, the Supportersactiviteit in October — the
    // now-empty October header must drop.
    expect(screen.queryByText(/oktober/i)).not.toBeInTheDocument();
    expect(screen.getByText(/september/i)).toBeInTheDocument();
  });

  it("buckets a type-less event under the Andere chip", async () => {
    render(
      <EventsBrowser
        events={[
          ev({ id: "vergadering", title: "Vergadering", eventType: null }),
        ]}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: "Andere" }));

    expect(
      screen.getByRole("link", { name: /vergadering/i }),
    ).toBeInTheDocument();
  });

  it("shows a per-category message + reset when a type has no events", async () => {
    render(<EventsBrowser events={EVENTS} />);

    await userEvent.click(screen.getByRole("button", { name: "Jeugdwerking" }));

    // The message lives in a polite live region so screen readers announce it
    // when a filter selection empties the list (client-side state change).
    expect(screen.getByRole("status")).toHaveTextContent(
      /geen evenementen in de categorie jeugdwerking/i,
    );
    // Filter row stays visible in the filtered-to-zero state.
    expect(
      screen.getByRole("group", { name: /filter evenementen op type/i }),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Toon alles" }));

    expect(
      screen.getByRole("link", { name: /spaghetti-avond/i }),
    ).toBeInTheDocument();
  });

  it("fires event_filter with the selected event_type on a real change", async () => {
    render(<EventsBrowser events={EVENTS} />);

    await userEvent.click(screen.getByRole("button", { name: "Clubevent" }));

    expect(mockTrackEvent).toHaveBeenCalledWith("event_filter", {
      event_type: "Clubevent",
    });
  });

  it("does not re-fire event_filter when the active chip is re-pressed (dedup guard)", async () => {
    render(<EventsBrowser events={EVENTS} />);

    const allesChip = screen.getByRole("button", { name: "Alles" });
    // "Alles" is already selected → no-op, no analytics.
    await userEvent.click(allesChip);
    expect(mockTrackEvent).not.toHaveBeenCalled();

    await userEvent.click(screen.getByRole("button", { name: "Clubevent" }));
    expect(mockTrackEvent).toHaveBeenCalledTimes(1);

    // Re-pressing the now-active Clubevent chip must not fire again.
    await userEvent.click(screen.getByRole("button", { name: "Clubevent" }));
    expect(mockTrackEvent).toHaveBeenCalledTimes(1);
  });

  it("renders the filtered-to-zero state when seeded via initialSelected", () => {
    render(<EventsBrowser events={EVENTS} initialSelected="Jeugdwerking" />);

    const group = screen.getByRole("group", {
      name: /filter evenementen op type/i,
    });
    expect(
      within(group).getByRole("button", { name: "Jeugdwerking" }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("status")).toHaveTextContent(
      /geen evenementen in de categorie jeugdwerking/i,
    );
  });
});
