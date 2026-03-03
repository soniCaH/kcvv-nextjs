import { useEffect } from "react";

/**
 * useKeyboardNavigation Hook
 *
 * Provides keyboard shortcuts for navigating the organigram interface.
 * Enhances accessibility by allowing keyboard-only navigation.
 *
 * Keyboard Shortcuts:
 * - Arrow Left/Right: Navigate between views
 * - 1, 2, 3: Jump to specific views (Cards, Chart, Responsibilities)
 * - Escape: Close modals/overlays
 * - /: Focus search input
 *
 * @param onNavigate - Callback to navigate between views
 * @param onSearch - Callback to focus search input
 * @param onEscape - Callback for escape key (close modals)
 * @param currentView - Current active view (for arrow navigation)
 * @param enabled - Whether keyboard navigation is enabled (default: true)
 */
export function useKeyboardNavigation(
  onNavigate: (view: string) => void,
  onSearch?: () => void,
  onEscape?: () => void,
  currentView?: string,
  enabled = true,
) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        // Allow Escape to work in inputs
        if (e.key === "Escape" && onEscape) {
          onEscape();
        }
        return;
      }

      switch (e.key) {
        case "ArrowLeft": {
          // Navigate to previous view
          e.preventDefault();
          const views = ["cards", "chart", "responsibilities"];
          const currentIndex = currentView ? views.indexOf(currentView) : -1;
          if (currentIndex > 0) {
            onNavigate(views[currentIndex - 1]);
          }
          break;
        }

        case "ArrowRight": {
          // Navigate to next view
          e.preventDefault();
          const views = ["cards", "chart", "responsibilities"];
          const currentIndex = currentView ? views.indexOf(currentView) : -1;
          if (currentIndex < views.length - 1) {
            onNavigate(views[currentIndex + 1]);
          }
          break;
        }

        case "1":
          // Jump to Cards view
          e.preventDefault();
          onNavigate("cards");
          break;

        case "2":
          // Jump to Chart view
          e.preventDefault();
          onNavigate("chart");
          break;

        case "3":
          // Jump to Responsibilities view
          e.preventDefault();
          onNavigate("responsibilities");
          break;

        case "/":
          // Focus search input
          e.preventDefault();
          if (onSearch) {
            onSearch();
          }
          break;

        case "Escape":
          // Close modals/overlays
          if (onEscape) {
            onEscape();
          }
          break;

        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [enabled, onNavigate, onSearch, onEscape, currentView]);
}
