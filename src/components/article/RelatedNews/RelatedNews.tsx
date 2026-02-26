/**
 * RelatedNews Component
 *
 * Displays a grid of related article cards beneath an article detail.
 * Renders nothing when the articles array is empty.
 */

import { cn } from "@/lib/utils/cn";
import { ArticleCard, type ArticleCardProps } from "../ArticleCard";

export interface RelatedNewsProps {
  /** Articles to display */
  articles: ArticleCardProps[];
  /** Section heading */
  title?: string;
  /** Additional CSS classes */
  className?: string;
}

export const RelatedNews = ({
  articles,
  title = "Gerelateerd nieuws",
  className,
}: RelatedNewsProps) => {
  if (articles.length === 0) return null;

  return (
    <section className={cn("py-6", className)}>
      {title && (
        <h2 className="text-xl font-bold text-[#31404b] mb-6">{title}</h2>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, i) => (
          <ArticleCard key={`${article.href}-${i}`} {...article} />
        ))}
      </div>
    </section>
  );
};
