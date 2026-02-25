"use client";

/**
 * Select Component
 * Native select element with KCVV design system styling and custom chevron
 */

import { forwardRef, type SelectHTMLAttributes } from "react";
import { ChevronDown } from "@/lib/icons";
import { cn } from "@/lib/utils/cn";

export type SelectSize = "sm" | "md" | "lg";

export interface SelectProps extends Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "size"
> {
  /**
   * Size variant of the select
   * @default 'md'
   */
  size?: SelectSize;
  /**
   * Error message — also applies error border styling
   */
  error?: string;
  /**
   * Hint text shown below when there is no error
   */
  hint?: string;
  /**
   * Placeholder option text (renders as the first disabled option)
   */
  placeholder?: string;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Select component with KCVV design system styling.
 *
 * @example
 * ```tsx
 * <Select placeholder="Kies een niveau">
 *   <option value="gold">Goud</option>
 *   <option value="silver">Zilver</option>
 * </Select>
 * ```
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      size = "md",
      error,
      hint,
      placeholder,
      className,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const sizeClasses: Record<SelectSize, string> = {
      sm: "pl-3 pr-8 py-1.5 text-sm",
      md: "pl-4 pr-10 py-2.5 text-base",
      lg: "pl-5 pr-12 py-3 text-lg",
    };

    const iconSize: Record<SelectSize, number> = {
      sm: 14,
      md: 16,
      lg: 18,
    };

    const iconPosition: Record<SelectSize, string> = {
      sm: "right-2.5",
      md: "right-3",
      lg: "right-4",
    };

    return (
      <div className="w-full">
        <div className="relative">
          <select
            ref={ref}
            disabled={disabled}
            className={cn(
              // Base
              "w-full appearance-none rounded-[0.25em] border bg-white font-body",
              "text-kcvv-gray-dark",
              "transition-all duration-200 cursor-pointer",
              "focus:outline-none focus:ring-2 focus:ring-offset-0",

              // Default border + focus
              !error &&
                "border-foundation-gray focus:border-kcvv-green-bright focus:ring-kcvv-green-bright/20",

              // Error state
              error &&
                "border-kcvv-alert focus:border-kcvv-alert focus:ring-kcvv-alert/20",

              // Disabled
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-foundation-gray-light",

              // Size
              sizeClasses[size],

              className,
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {children}
          </select>

          <div
            className={cn(
              "absolute top-1/2 -translate-y-1/2 pointer-events-none text-foundation-gray-dark",
              iconPosition[size],
            )}
          >
            <ChevronDown size={iconSize[size]} />
          </div>
        </div>

        {error && <p className="mt-1.5 text-sm text-kcvv-alert">{error}</p>}
        {!error && hint && (
          <p className="mt-1.5 text-sm text-foundation-gray-dark">{hint}</p>
        )}
      </div>
    );
  },
);

Select.displayName = "Select";
