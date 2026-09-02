/**
 * Analytics regression for <RelatedRow>.
 *
 * Locks the GA4 event contract (event names + payload shapes + dedup
 * behaviour) inherited byte-identical from <VerderLezenRow> at #1832 /
 * #2581. Tests assert the policy, not the wire format of any one call, so a
 * regression to per-type code paths or to a different dedup mechanism is
 * caught here. The one behavioural change under test: click tracking now
 * runs through one delegated listener reading `data-related-row-*`
 * attributes (#2581), not a per-card `onClick` closure.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import { RelatedRow } from "./RelatedRow";
import type { RelatedRowItem } from "@/components/related/types";

vi.mock("@/lib/analytics/track-event", () => ({
  trackEvent: vi.fn(),
}));

// `useArticleAnalytics` internally calls `trackEvent` for
// `related_article_click`, so mocking `trackEvent` covers both
// emission paths. The hook itself is still real (we want to assert
// the article→article guard fires the correct wrapped event).

import { trackEvent } from "@/lib/analytics/track-event";

const trackEventMock = vi.mocked(trackEvent);

const articleItem: RelatedRowItem = {
  title: "Verslag van de derby",
  href: "/nieuws/verslag-derby",
  badge: "NIEUWS",
  analyticsId: "art-1",
  analyticsSource: "editorial",
  analyticsType: "article",
  analyticsTargetSlug: "verslag-derby",
};

const pageItem: RelatedRowItem = {
  title: "Clubinfo",
  href: "/club/clubinfo",
  badge: "PAGINA",
  analyticsId: "page-1",
  analyticsSource: "ai",
  analyticsType: "page",
  analyticsTargetSlug: "clubinfo",
};

const playerItem: RelatedRowItem = {
  title: "Jan Janssens",
  href: "/spelers/12345",
  badge: "SPELER",
  analyticsId: "player-1",
  analyticsSource: "reference",
  analyticsType: "player",
  // Legacy parity: player uses psdId as target_slug.
  analyticsTargetSlug: "12345",
};

const teamItem: RelatedRowItem = {
  title: "A-ploeg",
  href: "/ploegen/a-ploeg",
  badge: "PLOEG",
  analyticsId: "team-1",
  analyticsSource: "reference",
  analyticsType: "team",
  analyticsTargetSlug: "a-ploeg",
};

const eventItem: RelatedRowItem = {
  title: "Spaghetti-avond",
  href: "/evenementen/spaghetti-avond",
  badge: "EVENEMENT",
  analyticsId: "event-1",
  analyticsSource: "editorial",
  analyticsType: "event",
  analyticsTargetSlug: "spaghetti-avond",
};

const galleryItem: RelatedRowItem = {
  title: "Beelden van de derby",
  href: "/galerij/derby-beelden",
  badge: "BEELDEN",
  analyticsId: "gallery-1",
  analyticsSource: "domain",
  analyticsType: "gallery",
  analyticsTargetSlug: "derby-beelden",
};

describe("RelatedRow — analytics", () => {
  beforeEach(() => {
    trackEventMock.mockClear();
  });

  describe("related_content_shown (impression)", () => {
    it("fires once on mount with single-source payload", () => {
      render(
        <RelatedRow
          items={[articleItem]}
          pageType="article"
          pageSlug="verslag-derby"
        />,
      );

      expect(trackEventMock).toHaveBeenCalledWith("related_content_shown", {
        source: "editorial",
        count: 1,
        content_types: "article",
        page_type: "article",
        page_slug: "verslag-derby",
      });
    });

    it("derives source as 'mixed' when items have different sources", () => {
      render(
        <RelatedRow
          items={[articleItem, pageItem, playerItem]}
          pageType="article"
          pageSlug="test"
        />,
      );

      expect(trackEventMock).toHaveBeenCalledWith("related_content_shown", {
        source: "mixed",
        count: 3,
        content_types: "article,page,player",
        page_type: "article",
        page_slug: "test",
      });
    });

    it("content_types preserves input order (not alphabetical), incl. gallery (#2574 union member)", () => {
      render(
        <RelatedRow
          items={[galleryItem, playerItem, articleItem]}
          pageType="article"
          pageSlug="t"
        />,
      );

      const call = trackEventMock.mock.calls.find(
        (c) => c[0] === "related_content_shown",
      );
      const payload = call?.[1] as { content_types: string };

      expect(payload.content_types).toBe("gallery,player,article");
    });

    it("deduplicates content_types when multiple items share a type", () => {
      render(
        <RelatedRow
          items={[
            articleItem,
            {
              ...articleItem,
              href: "/nieuws/art-2",
              analyticsId: "art-2",
              analyticsTargetSlug: "art-2",
            },
          ]}
          pageType="article"
          pageSlug="test"
        />,
      );

      expect(trackEventMock).toHaveBeenCalledWith("related_content_shown", {
        source: "editorial",
        count: 2,
        content_types: "article",
        page_type: "article",
        page_slug: "test",
      });
    });

    it("does not fire when items array is empty", () => {
      render(<RelatedRow items={[]} pageType="article" pageSlug="test" />);

      expect(trackEventMock).not.toHaveBeenCalled();
    });

    it("fires once on mount, not on re-render (dedup guard)", () => {
      const { rerender } = render(
        <RelatedRow items={[articleItem]} pageType="article" pageSlug="test" />,
      );

      rerender(
        <RelatedRow items={[articleItem]} pageType="article" pageSlug="test" />,
      );

      expect(
        trackEventMock.mock.calls.filter(
          (c) => c[0] === "related_content_shown",
        ),
      ).toHaveLength(1);
    });

    it("does not fire when pageType / pageSlug are omitted (Storybook isolation)", () => {
      render(<RelatedRow items={[articleItem]} />);

      expect(trackEventMock).not.toHaveBeenCalled();
    });
  });

  describe("related_content_click (delegated)", () => {
    it("fires with slug for article targets", () => {
      render(
        <RelatedRow
          items={[articleItem]}
          pageType="article"
          pageSlug="page-host"
        />,
      );

      trackEventMock.mockClear();

      const link = screen.getByRole("link", { name: articleItem.title });
      fireEvent.click(link);

      expect(trackEventMock).toHaveBeenCalledWith("related_content_click", {
        source: "editorial",
        target_type: "article",
        target_slug: "verslag-derby",
        position: 1,
        page_type: "article",
        page_slug: "page-host",
      });
    });

    it("uses psdId as target_slug for player entity clicks", () => {
      render(
        <RelatedRow
          items={[playerItem]}
          pageType="article"
          pageSlug="page-host"
        />,
      );

      trackEventMock.mockClear();

      const link = screen.getByRole("link", { name: /Jan Janssens/i });
      fireEvent.click(link);

      expect(trackEventMock).toHaveBeenCalledWith("related_content_click", {
        source: "reference",
        target_type: "player",
        target_slug: "12345",
        position: 1,
        page_type: "article",
        page_slug: "page-host",
      });
    });

    it("fires with target_type='gallery' for a gallery card click (#2574 union member)", () => {
      render(
        <RelatedRow
          items={[galleryItem]}
          pageType="event"
          pageSlug="page-host"
        />,
      );

      trackEventMock.mockClear();

      const link = screen.getByRole("link", { name: galleryItem.title });
      fireEvent.click(link);

      expect(trackEventMock).toHaveBeenCalledWith("related_content_click", {
        source: "domain",
        target_type: "gallery",
        target_slug: "derby-beelden",
        position: 1,
        page_type: "event",
        page_slug: "page-host",
      });
    });

    it("fires with target_type='event' and slug for event content clicks", () => {
      render(
        <RelatedRow
          items={[eventItem]}
          pageType="article"
          pageSlug="page-host"
        />,
      );

      trackEventMock.mockClear();

      const link = screen.getByRole("link", { name: eventItem.title });
      fireEvent.click(link);

      expect(trackEventMock).toHaveBeenCalledWith("related_content_click", {
        source: "editorial",
        target_type: "event",
        target_slug: "spaghetti-avond",
        position: 1,
        page_type: "article",
        page_slug: "page-host",
      });
    });

    it("uses slug as target_slug for team entity clicks", () => {
      render(
        <RelatedRow
          items={[teamItem]}
          pageType="article"
          pageSlug="page-host"
        />,
      );

      trackEventMock.mockClear();

      const link = screen.getByRole("link", { name: /A-ploeg/ });
      fireEvent.click(link);

      expect(trackEventMock).toHaveBeenCalledWith("related_content_click", {
        source: "reference",
        target_type: "team",
        target_slug: "a-ploeg",
        position: 1,
        page_type: "article",
        page_slug: "page-host",
      });
    });

    it("position is 1-indexed and stable across slots", () => {
      const items: RelatedRowItem[] = Array.from({ length: 4 }, (_, i) => ({
        ...articleItem,
        href: `/nieuws/slug-${i + 1}`,
        title: `Titel ${i + 1}`,
        analyticsId: `art-${i + 1}`,
        analyticsTargetSlug: `slug-${i + 1}`,
      }));

      render(
        <RelatedRow items={items} pageType="article" pageSlug="page-host" />,
      );

      trackEventMock.mockClear();

      const link3 = screen.getByRole("link", { name: "Titel 3" });
      fireEvent.click(link3);

      const call = trackEventMock.mock.calls.find(
        (c) => c[0] === "related_content_click",
      );
      const payload = call?.[1] as { position: number };
      expect(payload.position).toBe(3);
    });

    it("does not fire click event when analytics is disabled (no pageType)", () => {
      render(<RelatedRow items={[articleItem]} />);

      const link = screen.getByRole("link", { name: articleItem.title });
      fireEvent.click(link);

      expect(trackEventMock).not.toHaveBeenCalled();
    });

    it("does not fire when the click lands outside the inner anchor (slot padding)", () => {
      const { container } = render(
        <RelatedRow
          items={[articleItem]}
          pageType="article"
          pageSlug="page-host"
        />,
      );

      trackEventMock.mockClear();

      const slot = container.querySelector('[data-slot="related-row-card"]');
      expect(slot).not.toBeNull();
      fireEvent.click(slot!);

      expect(
        trackEventMock.mock.calls.filter(
          (c) => c[0] === "related_content_click",
        ),
      ).toHaveLength(0);
    });

    it("does not fire when an item is missing analytics fields (e.g. a staff card, #1831)", () => {
      const { container } = render(
        <RelatedRow
          items={[{ title: "Staflid", href: "/staf/9999" }]}
          pageType="article"
          pageSlug="page-host"
        />,
      );

      const link = container.querySelector("a")!;
      fireEvent.click(link);

      expect(
        trackEventMock.mock.calls.filter(
          (c) => c[0] === "related_content_click",
        ),
      ).toHaveLength(0);
    });
  });

  describe("related_article_click (typed article→article)", () => {
    it("fires alongside related_content_click for article→article navigation", () => {
      render(
        <RelatedRow
          items={[articleItem]}
          pageType="article"
          pageSlug="source-article"
          sourceArticleType="interview"
        />,
      );

      trackEventMock.mockClear();

      const link = screen.getByRole("link", { name: articleItem.title });
      fireEvent.click(link);

      const calls = trackEventMock.mock.calls.map((c) => c[0]);
      expect(calls).toContain("related_content_click");
      expect(calls).toContain("related_article_click");

      const articleClick = trackEventMock.mock.calls.find(
        (c) => c[0] === "related_article_click",
      );
      const payload = articleClick?.[1] as {
        article_type: string;
        related_article_id_hashed: string;
        position: number;
      };
      expect(payload.article_type).toBe("interview");
      expect(typeof payload.related_article_id_hashed).toBe("string");
      expect(payload.related_article_id_hashed.length).toBeGreaterThan(0);
      expect(payload.related_article_id_hashed).not.toBe("art-1");
      expect(payload.position).toBe(1);
    });

    it("does not fire related_article_click when target is a non-article", () => {
      render(
        <RelatedRow
          items={[playerItem]}
          pageType="article"
          pageSlug="source-article"
          sourceArticleType="interview"
        />,
      );

      trackEventMock.mockClear();

      const link = screen.getByRole("link", { name: /Jan Janssens/i });
      fireEvent.click(link);

      const calls = trackEventMock.mock.calls.map((c) => c[0]);
      expect(calls).toContain("related_content_click");
      expect(calls).not.toContain("related_article_click");
    });

    it("does not fire related_article_click when sourceArticleType is undefined", () => {
      render(
        <RelatedRow
          items={[articleItem]}
          pageType="article"
          pageSlug="source-article"
        />,
      );

      trackEventMock.mockClear();

      const link = screen.getByRole("link", { name: articleItem.title });
      fireEvent.click(link);

      const calls = trackEventMock.mock.calls.map((c) => c[0]);
      expect(calls).toContain("related_content_click");
      expect(calls).not.toContain("related_article_click");
    });
  });
});
