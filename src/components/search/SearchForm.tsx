"use client";

/**
 * SearchForm Component
 * Search input field with submit button
 */

import { useState, FormEvent, useEffect } from "react";
import { Icon } from "@/components/design-system";
import { Search, X } from "lucide-react";

export interface SearchFormProps {
  /**
   * Initial search value
   */
  initialValue?: string;
  /**
   * Callback when search is submitted
   */
  onSearch: (query: string) => void;
  /**
   * Loading state
   */
  isLoading?: boolean;
  /**
   * Placeholder text
   */
  placeholder?: string;
}

/**
 * Search form with input and submit button
 */
export const SearchForm = ({
  initialValue = "",
  onSearch,
  isLoading = false,
  placeholder = "Zoek nieuws, spelers, teams...",
}: SearchFormProps) => {
  const [value, setValue] = useState(initialValue);

  // Sync with initialValue changes
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (value.trim().length >= 2) {
      onSearch(value);
    }
  };

  const handleClear = () => {
    setValue("");
    onSearch("");
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        {/* Search Icon */}
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
          <Icon icon={Search} size="md" />
        </div>

        {/* Input */}
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-14 pr-28 py-5 text-xl border-2 border-gray-200 rounded-lg focus:border-green-main focus:outline-none focus:ring-2 focus:ring-green-main/20 transition-colors"
          disabled={isLoading}
          autoFocus
        />

        {/* Clear Button */}
        {value.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-24 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Wis zoekopdracht"
          >
            <Icon icon={X} size="md" />
          </button>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || value.trim().length < 2}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-3 bg-green-main text-white rounded-md hover:bg-green-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold text-base"
        >
          Zoek
        </button>
      </div>

      {/* Hint Text */}
      {value.trim().length > 0 && value.trim().length < 2 && (
        <p className="mt-2 text-sm text-gray-500">
          Typ minimaal 2 karakters om te zoeken
        </p>
      )}
    </form>
  );
};
