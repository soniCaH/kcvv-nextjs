/**
 * Sponsors Component
 * Displays sponsor logos in a grid with hover effects
 * Can be used on homepage and in PageFooter
 */

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";

export interface Sponsor {
  id: string;
  name: string;
  logo: string;
  url?: string;
}

export interface SponsorsProps {
  /**
   * Array of sponsors to display
   */
  sponsors: Sponsor[];
  /**
   * Title for the sponsors section
   * @default "Onze sponsors"
   */
  title?: string;
  /**
   * Description text below title
   * @default "KCVV Elewijt wordt mede mogelijk gemaakt door onze trouwe sponsors."
   */
  description?: string;
  /**
   * Show "View All" link
   * @default true
   */
  showViewAll?: boolean;
  /**
   * URL for "View All" link
   * @default "/sponsors"
   */
  viewAllHref?: string;
  /**
   * Number of columns in grid
   * @default 4
   */
  columns?: 2 | 3 | 4 | 5 | 6;
  /**
   * Theme variant
   * @default "light"
   */
  variant?: "light" | "dark";
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Sponsors grid component
 *
 * Features:
 * - Responsive grid (2-6 columns)
 * - Hover opacity effect (0.5 → 1)
 * - Optional links to sponsor websites
 * - Light/dark theme variants
 * - Accessible with proper alt text
 *
 * @example
 * ```tsx
 * <Sponsors
 *   sponsors={sponsorData}
 *   columns={4}
 *   variant="dark"
 * />
 * ```
 */
export const Sponsors = ({
  sponsors,
  title = "Onze sponsors",
  description = "KCVV Elewijt wordt mede mogelijk gemaakt door onze trouwe sponsors.",
  showViewAll = true,
  viewAllHref = "/sponsors",
  columns = 4,
  variant = "light",
  className,
}: SponsorsProps) => {
  if (sponsors.length === 0) {
    return null;
  }

  const gridColsClass = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
  }[columns];

  const textColorClass = variant === "dark" ? "text-white" : "text-gray-900";
  const descriptionColorClass =
    variant === "dark" ? "text-white/80" : "text-gray-600";

  return (
    <section className={cn("py-8", className)}>
      {/* Section Header */}
      <div className="mb-6">
        <h3 className={cn("text-xl font-bold mb-2", textColorClass)}>
          {title}
        </h3>
        {description && (
          <p className={cn("text-sm opacity-80", descriptionColorClass)}>
            {description}
          </p>
        )}
      </div>

      {/* Sponsors Grid */}
      <div className={cn("grid gap-3", gridColsClass)}>
        {sponsors.map((sponsor) => {
          const logoElement = (
            <div
              className={cn(
                "aspect-[3/2] rounded flex items-center justify-center p-4",
                "opacity-50 hover:opacity-100 transition-opacity duration-300",
                variant === "dark" ? "bg-white/10" : "bg-gray-100",
              )}
            >
              <Image
                src={sponsor.logo}
                alt={sponsor.name}
                width={200}
                height={133}
                className={cn(
                  "w-full h-full object-contain",
                  variant === "dark" && "filter invert",
                )}
              />
            </div>
          );

          // Wrap in link if URL is provided
          if (sponsor.url) {
            return (
              <a
                key={sponsor.id}
                href={sponsor.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
                aria-label={`Visit ${sponsor.name} website`}
              >
                {logoElement}
              </a>
            );
          }

          return <div key={sponsor.id}>{logoElement}</div>;
        })}
      </div>

      {/* View All Link */}
      {showViewAll && (
        <Link
          href={viewAllHref}
          className={cn(
            "inline-block mt-6 text-sm hover:underline",
            variant === "dark"
              ? "text-kcvv-green-bright"
              : "text-kcvv-green-dark",
          )}
        >
          Alle sponsors &raquo;
        </Link>
      )}
    </section>
  );
};
