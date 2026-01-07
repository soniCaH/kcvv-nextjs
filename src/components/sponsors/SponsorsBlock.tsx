/**
 * SponsorsBlock Server Component
 * Fetches and displays sponsors from Drupal CMS
 * Matches Gatsby implementation: promoted sponsors of types crossing, green, white
 */

import { Effect } from "effect";
import { runPromise } from "@/lib/effect/runtime";
import { DrupalService } from "@/lib/effect/services/DrupalService";
import { Sponsors } from "./Sponsors";
import { mapSponsorsToComponentSponsors } from "@/lib/mappers";

export interface SponsorsBlockProps {
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
   * Additional CSS classes
   */
  className?: string;
}

/**
 * SponsorsBlock server component
 *
 * Fetches promoted sponsors from Drupal CMS with types: crossing, green, white
 * Sorted by type then title (matching Gatsby implementation)
 *
 * @example
 * ```tsx
 * // In page footer (dark theme)
 * <SponsorsBlock variant="dark" />
 *
 * // On homepage (light theme)
 * <SponsorsBlock variant="light" columns={4} />
 * ```
 */
export async function SponsorsBlock({
  title = "Onze sponsors",
  description = "KCVV Elewijt wordt mede mogelijk gemaakt door onze trouwe sponsors.",
  columns = 4,
  variant = "light",
  showViewAll = true,
  viewAllHref = "/sponsors",
  className,
}: SponsorsBlockProps) {
  // Fetch promoted sponsors with types crossing, green, white
  // Matches Gatsby query:
  // filter: { promote: { eq: true }, status: { eq: true }, field_type: { in: ["crossing", "green", "white"] } }
  // sort: [{ field_type: ASC }, { title: ASC }]
  const sponsors = await runPromise(
    Effect.gen(function* () {
      const drupal = yield* DrupalService;
      const drupalSponsors = yield* drupal.getSponsors({
        promoted: true,
        type: ["crossing", "green", "white"],
        sort: "field_type,title", // CSV format for multiple sort fields
      });
      return mapSponsorsToComponentSponsors(drupalSponsors);
    }).pipe(
      // Graceful fallback: return empty array on error
      Effect.catchAll((error) => {
        console.error("[SponsorsBlock] Failed to fetch sponsors:", error);
        return Effect.succeed([]);
      }),
    ),
  );

  return (
    <Sponsors
      sponsors={sponsors}
      title={title}
      description={description}
      columns={columns}
      variant={variant}
      showViewAll={showViewAll}
      viewAllHref={viewAllHref}
      className={className}
    />
  );
}
