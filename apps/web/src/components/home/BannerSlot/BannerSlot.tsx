import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import { PageContainer } from "@/components/design-system";

export interface BannerSlotProps {
  /** Banner image URL */
  image: string;
  /** Alt text for accessibility */
  alt: string;
  /** Optional click-through URL — wraps in <a> when set */
  href?: string;
  /**
   * Which of the three homepage slots this is. Emitted as the inert
   * `data-banner-slot` marker that `<HomepageAnalytics>` delegates on, and as
   * the `position` param on the banner events (#2400) — the slots sit at very
   * different scroll depths, so an undifferentiated banner event says nothing.
   */
  slot?: "a" | "b" | "c";
  /** Additional CSS classes */
  className?: string;
}

/**
 * Optional editorial/campaign banner.
 * Contained (not full-bleed), square corners with a paper offset shadow and a
 * 2px ink border. Hidden when no banner is configured (call site handles
 * conditional rendering).
 */
export const BannerSlot = ({
  image,
  alt,
  href,
  slot,
  className,
}: BannerSlotProps) => {
  const inner = (
    <div
      className={cn(
        "border-ink shadow-paper-sm relative w-full overflow-hidden rounded-none border-2 transition-all duration-300 group-hover:shadow-none",
        "aspect-[6/1] min-h-[60px]",
        className,
      )}
    >
      <Image
        src={image}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 1280px"
        priority={false}
      />
    </div>
  );

  // ponytail: no own background — the banner sits directly on the page cream
  // (its SectionStack wrapper is `transparent` since #2342) so it blends into
  // the news grid below rather than echoing the cream StripedSeam that closes
  // the matches section above.
  if (href) {
    return (
      <PageContainer width="index" className="py-8">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          data-banner-slot={slot}
          className="group block transition-all duration-300 motion-safe:hover:translate-x-1 motion-safe:hover:translate-y-1"
        >
          {inner}
        </a>
      </PageContainer>
    );
  }

  return (
    <PageContainer width="index" className="py-8">
      {inner}
    </PageContainer>
  );
};
