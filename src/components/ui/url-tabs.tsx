"use client";

/**
 * URL-synced Tabs Component
 *
 * A wrapper around Radix UI Tabs that syncs the active tab with the URL.
 * Supports both query parameters (?tab=value) and hash fragments (#value).
 *
 * Features:
 * - Initial tab from URL on page load
 * - URL updates when tab changes (without page reload)
 * - Fallback to default tab if URL tab is invalid
 * - Browser back/forward navigation support
 */

import * as React from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export interface UrlTabsProps {
  /** Default tab value if none specified in URL */
  defaultValue: string;
  /** Valid tab values - used to validate URL parameter */
  validTabs: string[];
  /** Query parameter name (default: "tab") */
  paramName?: string;
  /** Children (Tabs.List and Tabs.Content components) */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

/**
 * URL-synced tabs container that reads/writes the active tab to the URL.
 *
 * @example
 * ```tsx
 * <UrlTabs defaultValue="info" validTabs={["info", "lineup", "matches"]}>
 *   <Tabs.List>
 *     <Tabs.Trigger value="info">Info</Tabs.Trigger>
 *     <Tabs.Trigger value="lineup">Lineup</Tabs.Trigger>
 *   </Tabs.List>
 *   <Tabs.Content value="info">...</Tabs.Content>
 *   <Tabs.Content value="lineup">...</Tabs.Content>
 * </UrlTabs>
 * ```
 */
export function UrlTabs({
  defaultValue,
  validTabs,
  paramName = "tab",
  children,
  className,
}: UrlTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get initial tab from URL, falling back to default if invalid
  const urlTab = searchParams.get(paramName);
  const initialTab =
    urlTab && validTabs.includes(urlTab) ? urlTab : defaultValue;

  const [activeTab, setActiveTab] = React.useState(initialTab);

  // Sync state when URL changes (e.g., browser back/forward)
  React.useEffect(() => {
    const urlTab = searchParams.get(paramName);
    const newTab = urlTab && validTabs.includes(urlTab) ? urlTab : defaultValue;
    setActiveTab(newTab);
  }, [searchParams, paramName, validTabs, defaultValue]);

  // Update URL when tab changes
  const handleTabChange = React.useCallback(
    (value: string) => {
      setActiveTab(value);

      // Build new URL with updated tab parameter
      const params = new URLSearchParams(searchParams.toString());

      if (value === defaultValue) {
        // Remove param if it's the default tab (cleaner URLs)
        params.delete(paramName);
      } else {
        params.set(paramName, value);
      }

      const newUrl = params.toString()
        ? `${pathname}?${params.toString()}`
        : pathname;

      // Update URL without triggering a page reload
      router.replace(newUrl, { scroll: false });
    },
    [router, pathname, searchParams, paramName, defaultValue],
  );

  return (
    <Tabs.Root
      value={activeTab}
      onValueChange={handleTabChange}
      className={className}
    >
      {children}
    </Tabs.Root>
  );
}

// Note: Import Tabs directly from @radix-ui/react-tabs in your components
// Re-exporting doesn't work well across server/client boundaries
