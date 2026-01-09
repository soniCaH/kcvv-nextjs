/**
 * SponsorsStats Component
 * Hero section displaying sponsor statistics and message
 */

import { cn } from "@/lib/utils/cn";

export interface SponsorsStatsProps {
  /**
   * Total number of sponsors
   */
  totalSponsors: number;
  /**
   * Additional CSS classes
   */
  className?: string;
}

export const SponsorsStats = ({
  totalSponsors,
  className,
}: SponsorsStatsProps) => {
  return (
    <div className={cn("text-center py-12 px-6", className)}>
      <div className="max-w-3xl mx-auto">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-kcvv-green-bright text-white text-4xl mb-6 shadow-lg">
          🤝
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-kcvv-gray-blue mb-4">
          {totalSponsors} trouwe partner{totalSponsors !== 1 ? "s" : ""}
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-6">
          steunen KCVV Elewijt
        </p>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Samen maken we voetbal mogelijk. Dankzij de steun van onze sponsors
          kunnen we blijven investeren in onze club, onze jeugd en onze
          toekomst.
        </p>
      </div>
    </div>
  );
};
