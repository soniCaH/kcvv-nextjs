import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { EventsList, type EventsListItem } from "./EventsList";

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

const mockEvents: EventsListItem[] = [
  {
    title: "Club BBQ",
    href: "/events/club-bbq",
    date: new Date("2026-06-15T14:00:00"),
    location: "Sporthal Elewijt",
  },
  {
    title: "Sponsorfeest",
    href: "/events/sponsorfeest",
    date: new Date("2026-07-01T19:00:00"),
  },
];

describe("EventsList", () => {
  describe("with events", () => {
    it("renders all event cards", () => {
      render(<EventsList events={mockEvents} />);
      expect(screen.getByText("Club BBQ")).toBeInTheDocument();
      expect(screen.getByText("Sponsorfeest")).toBeInTheDocument();
    });

    it("renders a link for each event", () => {
      render(<EventsList events={mockEvents} />);
      const links = screen.getAllByRole("link");
      expect(links).toHaveLength(2);
      expect(links[0]).toHaveAttribute("href", "/events/club-bbq");
      expect(links[1]).toHaveAttribute("href", "/events/sponsorfeest");
    });
  });

  describe("empty state", () => {
    it("renders default empty message when no events", () => {
      render(<EventsList events={[]} />);
      expect(
        screen.getByText("Geen evenementen gevonden."),
      ).toBeInTheDocument();
    });

    it("renders custom empty message when provided", () => {
      render(
        <EventsList events={[]} emptyMessage="Geen aankomende activiteiten." />,
      );
      expect(
        screen.getByText("Geen aankomende activiteiten."),
      ).toBeInTheDocument();
    });

    it("does not render any links in empty state", () => {
      render(<EventsList events={[]} />);
      expect(screen.queryAllByRole("link")).toHaveLength(0);
    });
  });

  describe("loading state", () => {
    it("renders skeleton placeholders when isLoading is true", () => {
      const { container } = render(<EventsList events={[]} isLoading />);
      expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
    });

    it("does not render empty message when loading", () => {
      render(<EventsList events={[]} isLoading />);
      expect(
        screen.queryByText("Geen evenementen gevonden."),
      ).not.toBeInTheDocument();
    });

    it("does not render any links when loading", () => {
      render(<EventsList events={[]} isLoading />);
      expect(screen.queryAllByRole("link")).toHaveLength(0);
    });
  });
});
