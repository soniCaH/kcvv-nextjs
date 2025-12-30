"use client";

/**
 * Responsibility Finder Component
 *
 * Interactive question builder with smart autocomplete
 * "Ik ben [ROLE] en ik [QUESTION]"
 */

import { useState, useMemo, useEffect, useRef } from "react";
import type {
  UserRole,
  ResponsibilityPath,
  AutocompleteSuggestion,
} from "@/types/responsibility";
import { responsibilityPaths, userRoles } from "@/data/responsibility-paths";
import { X, User, ArrowRight, Clipboard } from "lucide-react";
import { getIcon } from "@/lib/icons";

interface ResponsibilityFinderProps {
  onResultSelect?: (path: ResponsibilityPath) => void;
  compact?: boolean;
}

/**
 * Interactive UI for selecting a user role and composing a question to find a matching responsibility path.
 *
 * Renders a role selector, a contextual question input that appears after a role is chosen, a ranked autocomplete
 * suggestions list based on the typed query and selected role, and a detailed result card when a suggestion is selected.
 *
 * @param onResultSelect - Optional callback invoked with the chosen ResponsibilityPath when a suggestion is selected.
 * @param compact - If true, renders a more compact layout and typography.
 * @returns The component element that provides role selection, question input with smart autocomplete, and a selected result display.
 */
export function ResponsibilityFinder({
  onResultSelect,
  compact = false,
}: ResponsibilityFinderProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole | "">("");
  const [questionText, setQuestionText] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedResult, setSelectedResult] =
    useState<ResponsibilityPath | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const focusTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Smart matching algorithm
  const suggestions = useMemo((): AutocompleteSuggestion[] => {
    if (!questionText.trim() && !selectedRole) return [];

    const query = questionText.toLowerCase();

    const matches = responsibilityPaths.reduce<AutocompleteSuggestion[]>(
      (acc, path) => {
        let score = 0;

        // Filter by role first (required match)
        if (selectedRole && !path.role.includes(selectedRole as UserRole)) {
          return acc; // Skip if role doesn't match
        }

        if (selectedRole) {
          score += 30; // Boost if role matches
        }

        // Match against question text
        if (query) {
          const questionLower = path.question.toLowerCase();

          // Exact match in question
          if (questionLower.includes(query)) {
            score += 50;
          }

          // Keyword matching (case-insensitive)
          const matchedKeywords = path.keywords.filter((kw) => {
            const kwLower = kw.toLowerCase();
            return kwLower.includes(query) || query.includes(kwLower);
          });
          score += matchedKeywords.length * 10;

          // Word-by-word matching
          const queryWords = query.split(" ").filter((w) => w.length > 2);
          queryWords.forEach((word) => {
            if (questionLower.includes(word)) score += 5;
            path.keywords.forEach((kw) => {
              const kwLower = kw.toLowerCase();
              if (kwLower.includes(word)) score += 3;
            });
          });
        }

        // Only include if there's some match
        if (score > 0 || (!query && selectedRole)) {
          return [...acc, { path, score }];
        }

        return acc;
      },
      [],
    );

    // Sort by score (highest first)
    return matches.sort((a, b) => b.score - a.score).slice(0, 6);
  }, [questionText, selectedRole]);

  // Handle role selection
  const handleRoleSelect = (role: string) => {
    setSelectedRole(role as UserRole);
    setSelectedResult(null);

    // Clear any existing timeout
    if (focusTimeoutRef.current) {
      clearTimeout(focusTimeoutRef.current);
    }

    // Schedule focus with cleanup tracking
    focusTimeoutRef.current = setTimeout(() => {
      inputRef.current?.focus();
      focusTimeoutRef.current = null;
    }, 100);
  };

  // Handle suggestion click
  const handleSuggestionClick = (path: ResponsibilityPath) => {
    setQuestionText(path.question);
    setSelectedResult(path);
    setShowSuggestions(false);
    if (onResultSelect) {
      onResultSelect(path);
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!(e.target as Element).closest(".suggestions-container")) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // Cleanup focus timeout on unmount
  useEffect(() => {
    return () => {
      if (focusTimeoutRef.current) {
        clearTimeout(focusTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={`responsibility-finder ${compact ? "compact" : ""}`}>
      {/* Question Builder */}
      <div className="question-builder space-y-6">
        {/* "Ik ben" - Role Selector */}
        <div className="role-selector">
          <h2
            className={`${compact ? "text-2xl md:text-4xl" : "text-4xl md:text-6xl"} font-bold text-gray-blue mb-4`}
            style={{
              fontFamily: "quasimoda, acumin-pro, Montserrat, sans-serif",
            }}
          >
            IK BEN
          </h2>

          <div className="flex flex-wrap gap-3">
            {userRoles.map((role) => (
              <button
                key={role.value}
                onClick={() => handleRoleSelect(role.value)}
                className={`
                  px-6 py-3 rounded-lg font-bold text-lg transition-all
                  ${
                    selectedRole === role.value
                      ? "bg-green-main text-white shadow-lg scale-105"
                      : "bg-white text-gray-dark border-2 border-gray-light hover:border-green-main hover:text-green-main"
                  }
                `}
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                {role.label.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* "en ik" - Question Input */}
        {selectedRole && (
          <div className="question-input suggestions-container">
            <h2
              className={`${compact ? "text-2xl md:text-4xl" : "text-4xl md:text-6xl"} font-bold text-gray-blue mb-4`}
              style={{
                fontFamily: "quasimoda, acumin-pro, Montserrat, sans-serif",
              }}
            >
              EN IK
            </h2>

            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={questionText}
                onChange={(e) => {
                  setQuestionText(e.target.value);
                  setShowSuggestions(true);
                  setSelectedResult(null);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="typ je vraag..."
                className={`
                  w-full ${compact ? "text-xl md:text-3xl" : "text-3xl md:text-5xl"} font-bold
                  px-6 py-4 pr-16 border-4 border-gray-light rounded-lg
                  focus:outline-none focus:border-green-main
                  placeholder:text-gray-medium placeholder:font-normal
                  transition-all
                `}
                style={{ fontFamily: "Montserrat, sans-serif" }}
              />

              {questionText && (
                <button
                  onClick={() => {
                    setQuestionText("");
                    inputRef.current?.focus();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-medium hover:text-gray-dark transition-colors rounded-full hover:bg-gray-100"
                  aria-label="Clear search"
                >
                  <X size={24} />
                </button>
              )}

              {/* Autocomplete Suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-light rounded-lg shadow-2xl max-h-96 overflow-y-auto">
                  {suggestions.map((suggestion, idx) => (
                    <button
                      key={suggestion.path.id}
                      onClick={() => handleSuggestionClick(suggestion.path)}
                      aria-label={suggestion.path.question}
                      className={`
                        w-full text-left px-6 py-4 hover:bg-green-main/10 transition-colors
                        ${idx !== 0 ? "border-t border-gray-light" : ""}
                        group
                      `}
                    >
                      <div className="flex items-start gap-3">
                        {suggestion.path.icon &&
                          (() => {
                            const IconComponent = getIcon(suggestion.path.icon);
                            return (
                              <IconComponent
                                size={48}
                                className="text-green-main"
                                strokeWidth={2}
                              />
                            );
                          })()}
                        <div className="flex-1">
                          <div className="text-lg font-semibold text-gray-blue group-hover:text-green-main">
                            {suggestion.path.question}
                          </div>
                          <div className="text-sm text-gray-medium mt-1">
                            {suggestion.path.summary}
                          </div>
                          <div className="flex gap-2 mt-2">
                            <span className="text-xs px-2 py-1 bg-green-main/10 text-green-main rounded">
                              {suggestion.path.category}
                            </span>
                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-dark rounded">
                              → {suggestion.path.primaryContact.role}
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Selected Result */}
      {selectedResult && (
        <div className="mt-8 animate-fadeIn">
          <ResultCard path={selectedResult} />
        </div>
      )}
    </div>
  );
}

/**
 * Render a card that displays a responsibility path including its header, primary contact, and ordered steps.
 *
 * Shows the path icon, question, and summary; a primary contact panel with role, name, email, phone and optional organogram link; and an ordered list of actionable steps with optional links and contact information.
 *
 * @param path - The ResponsibilityPath to render in the result card
 * @returns A React element representing the formatted result card for the given responsibility path
 */
function ResultCard({ path }: { path: ResponsibilityPath }) {
  return (
    <div className="bg-white rounded-xl shadow-lg border-4 border-green-main p-8">
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        {path.icon &&
          (() => {
            const IconComponent = getIcon(path.icon);
            return (
              <IconComponent
                size={64}
                className="text-green-main"
                strokeWidth={2}
              />
            );
          })()}
        <div className="flex-1">
          <h3
            className="text-3xl font-bold text-gray-blue mb-2"
            style={{
              fontFamily: "quasimoda, acumin-pro, Montserrat, sans-serif",
            }}
          >
            {path.question}
          </h3>
          <p className="text-xl text-gray-dark">{path.summary}</p>
        </div>
      </div>

      {/* Primary Contact */}
      <div className="bg-green-main/10 rounded-lg p-6 mb-6">
        <h4 className="font-bold text-gray-blue mb-3 flex items-center gap-2">
          <User size={20} className="text-green-main" />
          Contactpersoon
        </h4>
        <div className="space-y-2">
          <div className="font-semibold text-lg">
            {path.primaryContact.role}
          </div>
          {path.primaryContact.name && <div>{path.primaryContact.name}</div>}
          {path.primaryContact.email && (
            <div>
              <a
                href={`mailto:${path.primaryContact.email}`}
                className="text-green-main hover:text-green-hover hover:underline"
              >
                {path.primaryContact.email}
              </a>
            </div>
          )}
          {path.primaryContact.phone && (
            <div>
              <a
                href={`tel:${path.primaryContact.phone}`}
                className="text-green-main hover:text-green-hover hover:underline"
              >
                {path.primaryContact.phone}
              </a>
            </div>
          )}
          {path.primaryContact.orgLink && (
            <div>
              <a
                href={path.primaryContact.orgLink}
                className="text-green-main hover:text-green-hover hover:underline inline-flex items-center gap-1"
              >
                Bekijk in organogram
                <ArrowRight size={16} />
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Steps */}
      <div>
        <h4 className="font-bold text-gray-blue mb-4 flex items-center gap-2">
          <Clipboard size={20} className="text-green-main" />
          Wat moet je doen?
        </h4>
        <ol className="space-y-4">
          {path.steps.map((step) => (
            <li key={step.order} className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-green-main text-white rounded-full flex items-center justify-center font-bold">
                {step.order}
              </div>
              <div className="flex-1 pt-1">
                <p className="text-gray-dark">{step.description}</p>
                {step.link && (
                  <a
                    href={step.link}
                    className="text-green-main hover:text-green-hover hover:underline text-sm inline-flex items-center gap-1 mt-1"
                  >
                    Meer info
                    <ArrowRight size={12} />
                  </a>
                )}
                {step.contact && (
                  <div className="mt-2 text-sm">
                    <strong>{step.contact.role}:</strong>{" "}
                    {step.contact.email && (
                      <a
                        href={`mailto:${step.contact.email}`}
                        className="text-green-main hover:text-green-hover hover:underline"
                      >
                        {step.contact.email}
                      </a>
                    )}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
