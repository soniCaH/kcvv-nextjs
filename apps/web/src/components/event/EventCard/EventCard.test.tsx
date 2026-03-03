import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { EventCard, type EventCardProps } from "./EventCard";

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

const defaultProps: EventCardProps = {
  title: "Club BBQ",
  href: "/events/club-bbq",
  date: new Date("2026-06-15T14:00:00"),
};

describe("EventCard", () => {
  describe("rendering", () => {
    it("renders the event title", () => {
      render(<EventCard {...defaultProps} />);
      expect(screen.getByText("Club BBQ")).toBeInTheDocument();
    });

    it("links to the event detail page", () => {
      render(<EventCard {...defaultProps} />);
      expect(screen.getByRole("link")).toHaveAttribute(
        "href",
        "/events/club-bbq",
      );
    });

    it("renders the start date in Dutch format", () => {
      render(<EventCard {...defaultProps} />);
      expect(screen.getByText(/juni/i)).toBeInTheDocument();
    });

    it("renders location when provided", () => {
      render(<EventCard {...defaultProps} location="Sporthal Elewijt" />);
      expect(screen.getByText("Sporthal Elewijt")).toBeInTheDocument();
    });

    it("does not render location when absent", () => {
      render(<EventCard {...defaultProps} />);
      expect(screen.queryByTestId("event-location")).not.toBeInTheDocument();
    });

    it("renders event image when imageUrl is provided", () => {
      render(<EventCard {...defaultProps} imageUrl="/event.jpg" />);
      expect(screen.getByRole("img")).toHaveAttribute("src", "/event.jpg");
    });

    it("renders a placeholder when no imageUrl", () => {
      render(<EventCard {...defaultProps} />);
      expect(screen.queryByRole("img")).not.toBeInTheDocument();
      expect(screen.getByTestId("event-image-placeholder")).toBeInTheDocument();
    });

    it("renders excerpt when provided", () => {
      render(
        <EventCard {...defaultProps} excerpt="Gezellig samen genieten!" />,
      );
      expect(screen.getByText("Gezellig samen genieten!")).toBeInTheDocument();
    });

    it("does not render excerpt element when absent", () => {
      render(<EventCard {...defaultProps} />);
      expect(screen.queryByTestId("event-excerpt")).not.toBeInTheDocument();
    });

    it("renders end date indicator when endDate is provided", () => {
      render(
        <EventCard
          {...defaultProps}
          endDate={new Date("2026-06-15T18:00:00")}
        />,
      );
      expect(screen.getByTestId("event-end-date")).toBeInTheDocument();
    });

    it("renders without crashing when date is undefined", () => {
      render(<EventCard title="Activiteit" href="/events/activiteit" />);
      expect(screen.getByText("Activiteit")).toBeInTheDocument();
    });
  });
});
