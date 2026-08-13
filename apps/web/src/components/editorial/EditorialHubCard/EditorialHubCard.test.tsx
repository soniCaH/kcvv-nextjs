import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { ImageProps } from "next/image";
import { EditorialHubCard } from "./EditorialHubCard";

vi.mock("next/image", () => ({
  default: ({ alt, src, ...rest }: ImageProps) => {
    const props = { alt, src: typeof src === "string" ? src : "", ...rest };
    return <img {...props} />;
  },
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: { children: React.ReactNode; href: string } & Record<string, unknown>) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

const navGlyph = <svg data-testid="nav-glyph" />;

describe("EditorialHubCard", () => {
  describe("news variant", () => {
    it("renders the cover photo, jersey-deep tag, title, arrow and link", () => {
      render(
        <EditorialHubCard
          variant="news"
          href="/nieuws/u15-wint"
          tag="Jeugd"
          title="U15 wint in stijl"
          arrowText="Lees meer"
          imageUrl="/images/cover.jpg"
        />,
      );
      const link = screen.getByRole("link", { name: /u15 wint in stijl/i });
      expect(link).toHaveAttribute("href", "/nieuws/u15-wint");
      // #2559 rule 1: the card's own title names the cover.
      const cover = document.querySelector("img");
      expect(cover).toHaveAttribute("src", "/images/cover.jpg");
      expect(cover).toHaveAttribute("alt", "");
      expect(screen.getByText("Jeugd")).toBeInTheDocument();
      expect(screen.getByText("Lees meer")).toBeInTheDocument();
      expect(screen.queryByTestId("nav-glyph")).not.toBeInTheDocument();
    });

    it("emits inert analytics markers (card-type, tag, hashed article id)", () => {
      render(
        <EditorialHubCard
          variant="news"
          href="/nieuws/u15-wint"
          tag="Bovenbouw"
          title="U15 wint in stijl"
          arrowText="Lees meer"
          imageUrl="/images/cover.jpg"
          articleIdHashed="deadbeef"
        />,
      );
      const link = screen.getByRole("link", { name: /u15 wint in stijl/i });
      expect(link).toHaveAttribute("data-card-type", "news");
      expect(link).toHaveAttribute("data-tag", "Bovenbouw");
      expect(link).toHaveAttribute("data-article-id-hashed", "deadbeef");
    });

    it("renders without a cover image (fallback panel), keeping the tag", () => {
      render(
        <EditorialHubCard
          variant="news"
          href="/nieuws/x"
          tag="Jeugd"
          title="Geen cover"
          arrowText="Lees meer"
        />,
      );
      expect(screen.queryByRole("img")).not.toBeInTheDocument();
      expect(screen.getByText("Jeugd")).toBeInTheDocument();
    });
  });

  describe("nav variant", () => {
    it("renders the glyph, cream tag and no photo", () => {
      render(
        <EditorialHubCard
          variant="nav"
          href="/jeugd#visie"
          tag="Visie"
          title="Onze jeugdvisie"
          arrowText="Ontdek"
          icon={navGlyph}
        />,
      );
      const link = screen.getByRole("link", { name: /onze jeugdvisie/i });
      expect(link).toHaveAttribute("href", "/jeugd#visie");
      expect(screen.getByTestId("nav-glyph")).toBeInTheDocument();
      expect(screen.getByText("Visie")).toBeInTheDocument();
      expect(screen.queryByRole("img")).not.toBeInTheDocument();
    });

    it("renders an empty pill when tag is an empty string (7j3 nav contract)", () => {
      const { container } = render(
        <EditorialHubCard
          variant="nav"
          href="/club/organigram"
          tag=""
          title="Organigram"
          arrowText="Bekijk"
          icon={navGlyph}
        />,
      );
      expect(
        screen.getByRole("link", { name: /organigram/i }),
      ).toBeInTheDocument();
      expect(screen.getByTestId("nav-glyph")).toBeInTheDocument();
      // The pill still renders per the contract — just empty.
      const pill = container.querySelector('[data-variant="pill-cream"]');
      expect(pill).toBeInTheDocument();
      expect(pill).toHaveTextContent("");
    });
  });
});
