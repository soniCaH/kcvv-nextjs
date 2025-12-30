/**
 * ArticleCard Component
 * Article teaser card for news listing pages
 * Matches Gatsby CardTeaser design
 */

import Link from "next/link";
import Image from "next/image";
import { Clock, Tag } from "@/lib/icons";
import { cn } from "@/lib/utils/cn";

export interface ArticleCardProps {
  title: string;
  href: string;
  imageUrl?: string;
  imageAlt?: string;
  date?: string;
  tags?: Array<{ name: string }>;
  className?: string;
}

/**
 * Article card component for news listings
 *
 * Features:
 * - Responsive: Horizontal layout on mobile, vertical on desktop
 * - Image zoom effect on hover (desktop only)
 * - Content card overlaps image bottom (desktop only)
 * - Lifted shadow on hover
 */
export const ArticleCard = ({
  title,
  href,
  imageUrl,
  imageAlt,
  date,
  tags = [],
  className,
}: ArticleCardProps) => {
  return (
    <article
      className={cn(
        "relative group",
        "border-b border-[#e6e6e6] lg:border-b-0",
        "last:border-b-0",
        className,
      )}
    >
      <Link
        href={href}
        className="flex p-5 lg:block lg:p-0 text-black font-medium no-underline"
      >
        {/* Image Header */}
        {imageUrl && (
          <div className="relative shrink-0 w-[105px] min-w-[105px] mr-4 lg:w-full lg:mr-0 overflow-hidden">
            <div className="relative aspect-[16/10] lg:aspect-[4/3]">
              <Image
                src={imageUrl}
                alt={imageAlt || title}
                fill
                className="object-cover transition-transform duration-300 ease-in-out lg:group-hover:scale-110"
                sizes="(max-width: 960px) 105px, 400px"
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div
          className={cn(
            "flex flex-col justify-between bg-white flex-1",
            "lg:relative lg:transition-transform lg:duration-300 lg:ease-in-out",
            "lg:mt-[-40px] lg:ml-7 lg:p-6",
            "lg:shadow-[0_2px_20px_0_rgba(9,52,102,0.14)]",
            "lg:group-hover:translate-y-[-5px]",
          )}
        >
          {/* Title */}
          <h4
            className={cn(
              "text-base leading-[1.4] lg:text-xl",
              "overflow-hidden",
              "line-clamp-2",
              "lg:h-14",
              "mb-0",
            )}
          >
            {title}
          </h4>

          {/* Meta */}
          {(date || tags.length > 0) && (
            <div
              data-testid="article-meta"
              className="mt-4 flex flex-wrap gap-3 text-xs lg:text-sm text-kcvv-green-bright"
            >
              {date && (
                <span className="flex items-center gap-2">
                  <Clock size={14} />
                  {date}
                </span>
              )}
              {tags.length > 0 && (
                <div className="flex items-center gap-2">
                  <Tag size={14} />
                  {tags.map((tag, index) => (
                    <span key={index} className="mr-2">
                      #{tag.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </Link>
    </article>
  );
};
