/**
 * Scheurkalender Page — Loading Skeleton
 * Mirrors the poster sheet: masthead bar + two calendar-year columns, each a
 * month heading followed by fixture rows opening on the date tab.
 */

import { PageContainer } from "@/components/design-system";

/** One column: a month heading, then rows of date-tab + match. */
function ColumnSkeleton({ rows }: { rows: number }) {
  return (
    <>
      <div className="bg-ink/10 mt-5 mb-[7px] h-7 w-40 animate-pulse first:mt-0.5" />
      {Array.from({ length: rows }).map((_, row) => (
        <div key={row} className="flex items-center gap-3 py-[5px]">
          <div className="bg-ink/10 h-2.5 w-[17px] animate-pulse" />
          <div className="bg-ink/10 h-3.5 w-5 animate-pulse" />
          <div className="bg-ink/10 h-2.5 w-10 animate-pulse" />
          <div className="bg-ink/10 h-3 flex-1 animate-pulse" />
        </div>
      ))}
    </>
  );
}

export default function ScheurkalenderLoading() {
  return (
    <div className="bg-cream min-h-screen">
      <PageContainer className="pt-12 pb-12">
        <div className="border-ink border-2 bg-white">
          {/* Masthead */}
          <div className="border-ink flex items-baseline justify-between gap-4 border-b-2 px-4 py-3.5">
            <div className="bg-ink/10 h-4 w-56 animate-pulse" />
            <div className="bg-ink/10 h-3 w-32 animate-pulse" />
          </div>
          {/* Two calendar-year columns */}
          <div className="grid grid-cols-2 px-5 pt-1.5 pb-[18px]">
            <div className="border-ink/15 border-r pr-[17px]">
              <ColumnSkeleton rows={7} />
            </div>
            <div className="pl-[17px]">
              <ColumnSkeleton rows={5} />
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
