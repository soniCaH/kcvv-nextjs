"use client";

/**
 * Input Component
 * Text input field with KCVV design system styling
 */

import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export type InputSize = "sm" | "md" | "lg";

export interface InputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
  /**
   * Size variant of the input
   * @default 'md'
   */
  size?: InputSize;
  /**
   * Show error styling and message
   */
  error?: string;
  /**
   * Hint text displayed below the input
   */
  hint?: string;
  /**
   * Icon or element displayed on the left inside the input
   */
  leadingIcon?: ReactNode;
  /**
   * Icon or element displayed on the right inside the input
   */
  trailingIcon?: ReactNode;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Input component with KCVV design system styling.
 *
 * @example
 * ```tsx
 * <Input placeholder="Zoek op naam..." />
 * <Input size="lg" error="Dit veld is verplicht" />
 * <Input leadingIcon={<Search size={16} />} placeholder="Zoeken..." />
 * ```
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = "md",
      error,
      hint,
      leadingIcon,
      trailingIcon,
      className,
      disabled,
      ...props
    },
    ref,
  ) => {
    const sizeClasses: Record<InputSize, string> = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2.5 text-base",
      lg: "px-5 py-3 text-lg",
    };

    const leadingPadding: Record<InputSize, string> = {
      sm: "pl-8",
      md: "pl-10",
      lg: "pl-12",
    };

    const trailingPadding: Record<InputSize, string> = {
      sm: "pr-8",
      md: "pr-10",
      lg: "pr-12",
    };

    const iconSize: Record<InputSize, string> = {
      sm: "left-2.5 [&>*]:w-3.5 [&>*]:h-3.5",
      md: "left-3 [&>*]:w-4 [&>*]:h-4",
      lg: "left-4 [&>*]:w-5 [&>*]:h-5",
    };

    const trailingIconSize: Record<InputSize, string> = {
      sm: "right-2.5 [&>*]:w-3.5 [&>*]:h-3.5",
      md: "right-3 [&>*]:w-4 [&>*]:h-4",
      lg: "right-4 [&>*]:w-5 [&>*]:h-5",
    };

    return (
      <div className="w-full">
        <div className="relative">
          {leadingIcon && (
            <div
              className={cn(
                "absolute top-1/2 -translate-y-1/2 text-foundation-gray-dark pointer-events-none",
                iconSize[size],
              )}
            >
              {leadingIcon}
            </div>
          )}

          <input
            ref={ref}
            disabled={disabled}
            className={cn(
              // Base
              "w-full rounded-[0.25em] border bg-white font-body",
              "text-kcvv-gray-dark placeholder:text-foundation-gray-dark",
              "transition-all duration-200",
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

              // Icon padding
              leadingIcon && leadingPadding[size],
              trailingIcon && trailingPadding[size],

              className,
            )}
            {...props}
          />

          {trailingIcon && (
            <div
              className={cn(
                "absolute top-1/2 -translate-y-1/2 text-foundation-gray-dark pointer-events-none",
                trailingIconSize[size],
              )}
            >
              {trailingIcon}
            </div>
          )}
        </div>

        {error && <p className="mt-1.5 text-sm text-kcvv-alert">{error}</p>}
        {!error && hint && (
          <p className="mt-1.5 text-sm text-foundation-gray-dark">{hint}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
