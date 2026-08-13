"use client";

import { formatArticleDate } from "@/lib/utils/dates";

/**
 * PrintDate — renders the current date at browser/print time.
 * Must be a client component so it's not frozen to the ISR build timestamp.
 */
export function PrintDate() {
  return <>{formatArticleDate(new Date())}</>;
}
