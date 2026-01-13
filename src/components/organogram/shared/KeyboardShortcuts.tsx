"use client";

/**
 * KeyboardShortcuts Component
 *
 * Displays available keyboard shortcuts for the organogram interface.
 * Shows when user presses '?' and can be dismissed with Escape.
 *
 * Features:
 * - Modal overlay with keyboard shortcut reference
 * - Grouped by category (Navigation, Search, etc.)
 * - Accessible with proper focus management
 * - Keyboard dismissible (Escape key)
 *
 * Accessibility:
 * - Focus trap within modal
 * - ARIA labels for screen readers
 * - Clear visual hierarchy
 */

import { useEffect, useState, useRef } from "react";
import { X, CircleHelp } from "@/lib/icons";

export interface KeyboardShortcutsProps {
  className?: string;
}

interface Shortcut {
  keys: string[];
  description: string;
}

interface ShortcutGroup {
  title: string;
  shortcuts: Shortcut[];
}

const shortcutGroups: ShortcutGroup[] = [
  {
    title: "Navigatie",
    shortcuts: [
      { keys: ["←", "→"], description: "Navigeer tussen weergaves" },
      { keys: ["1"], description: "Ga naar Overzicht (kaartjes)" },
      { keys: ["2"], description: "Ga naar Diagram" },
      { keys: ["3"], description: "Ga naar Hulp" },
    ],
  },
  {
    title: "Zoeken",
    shortcuts: [
      { keys: ["/"], description: "Focus zoekbalk" },
      { keys: ["Esc"], description: "Sluit modals en overlays" },
    ],
  },
  {
    title: "Hulp",
    shortcuts: [{ keys: ["?"], description: "Toon sneltoetsen (dit venster)" }],
  },
];

/**
 * Render a keyboard shortcuts help modal that shows when user presses '?'
 *
 * @param className - Additional CSS classes
 */
export function KeyboardShortcuts({ className = "" }: KeyboardShortcutsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger when typing in inputs
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.key === "?") {
        e.preventDefault();
        setIsOpen(true);
      } else if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Focus trap and lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Store the previously focused element
      previouslyFocusedElement.current = document.activeElement as HTMLElement;

      // Lock body scroll
      document.body.style.overflow = "hidden";

      // Move focus to the modal
      if (modalRef.current) {
        modalRef.current.focus();
      }

      // Trap focus within the modal
      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key !== "Tab" || !modalRef.current) return;

        const focusableElements =
          modalRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
          );
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          // Shift+Tab: moving backwards
          if (document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable?.focus();
          }
        } else {
          // Tab: moving forwards
          if (document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable?.focus();
          }
        }
      };

      document.addEventListener("keydown", handleTabKey);

      return () => {
        document.removeEventListener("keydown", handleTabKey);
        document.body.style.overflow = "";
      };
    } else {
      // Return focus to the previously focused element
      if (previouslyFocusedElement.current) {
        previouslyFocusedElement.current.focus();
      }
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        tabIndex={-1}
        className={`
          fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          z-50
          bg-white rounded-xl shadow-2xl
          max-w-2xl w-full mx-4
          max-h-[90vh] overflow-y-auto
          focus:outline-none
          ${className}
        `}
        role="dialog"
        aria-modal="true"
        aria-labelledby="keyboard-shortcuts-title"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
          <div className="flex items-center gap-3">
            <CircleHelp
              size={24}
              className="text-kcvv-green-bright"
              aria-hidden="true"
            />
            <h2
              id="keyboard-shortcuts-title"
              className="text-xl font-bold text-kcvv-gray-blue"
            >
              Sneltoetsen
            </h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="
              w-10 h-10 flex items-center justify-center
              text-kcvv-gray hover:text-kcvv-gray-blue
              hover:bg-gray-100 rounded-full
              transition-colors
              focus:outline-none focus:ring-2 focus:ring-kcvv-green focus:ring-offset-2
            "
            aria-label="Sluit sneltoetsen venster"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-8">
          {/* Info */}
          <p className="text-sm text-kcvv-gray">
            Gebruik deze sneltoetsen om sneller te navigeren door het
            organogram. Druk op <kbd className="kbd">?</kbd> om dit venster te
            openen, of <kbd className="kbd">Esc</kbd> om te sluiten.
          </p>

          {/* Shortcut Groups */}
          {shortcutGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold text-kcvv-gray-blue mb-3 uppercase tracking-wide">
                {group.title}
              </h3>
              <div className="space-y-2">
                {group.shortcuts.map((shortcut, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 px-3 rounded hover:bg-gray-50"
                  >
                    <span className="text-sm text-kcvv-gray-dark">
                      {shortcut.description}
                    </span>
                    <div className="flex items-center gap-2">
                      {shortcut.keys.map((key, keyIndex) => (
                        <kbd
                          key={keyIndex}
                          className="inline-flex items-center justify-center min-w-8 h-8 px-2 font-mono text-sm font-semibold text-kcvv-gray-dark bg-white border-2 border-kcvv-gray-light rounded shadow-sm"
                        >
                          {key}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-xl">
          <p className="text-xs text-kcvv-gray text-center">
            💡 Tip: Deze sneltoetsen werken alleen wanneer je niet in een
            invoerveld typt. Druk op{" "}
            <kbd className="inline-flex items-center justify-center min-w-6 h-6 px-1.5 font-mono text-xs font-semibold text-kcvv-gray-dark bg-white border-2 border-kcvv-gray-light rounded shadow-sm">
              ?
            </kbd>{" "}
            voor deze hulp.
          </p>
        </div>
      </div>
    </>
  );
}
