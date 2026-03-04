"use client";

/**
 * Alert Component
 * Contextual feedback messages with KCVV design system styling
 */

import { forwardRef, type ReactNode } from "react";
import { X, CheckCircle, AlertTriangle, Info, XCircle } from "@/lib/icons";
import { cn } from "@/lib/utils/cn";

export type AlertVariant = "info" | "success" | "warning" | "error";

export interface AlertProps {
  /**
   * Visual variant controlling colour and icon
   * @default 'info'
   */
  variant?: AlertVariant;
  /**
   * Optional bold title displayed above the description
   */
  title?: string;
  /**
   * Alert body content
   */
  children: ReactNode;
  /**
   * Show a close button (caller is responsible for hiding the alert)
   * @default false
   */
  dismissible?: boolean;
  /**
   * Callback fired when the close button is clicked
   */
  onDismiss?: () => void;
  /**
   * Additional CSS classes
   */
  className?: string;
}

const variantConfig: Record<
  AlertVariant,
  {
    bg: string;
    border: string;
    icon: ReactNode;
    titleColor: string;
    textColor: string;
  }
> = {
  info: {
    bg: "bg-kcvv-green-bright/8",
    border: "border-l-4 border-kcvv-green-bright",
    icon: <Info size={18} aria-hidden="true" />,
    titleColor: "text-kcvv-green-dark",
    textColor: "text-kcvv-gray-blue",
  },
  success: {
    bg: "bg-kcvv-success/10",
    border: "border-l-4 border-kcvv-success",
    icon: <CheckCircle size={18} aria-hidden="true" />,
    titleColor: "text-kcvv-green-dark",
    textColor: "text-kcvv-gray-blue",
  },
  warning: {
    bg: "bg-kcvv-warning/10",
    border: "border-l-4 border-kcvv-warning",
    icon: <AlertTriangle size={18} aria-hidden="true" />,
    titleColor: "text-amber-800",
    textColor: "text-amber-900",
  },
  error: {
    bg: "bg-kcvv-alert/8",
    border: "border-l-4 border-kcvv-alert",
    icon: <XCircle size={18} aria-hidden="true" />,
    titleColor: "text-kcvv-alert",
    textColor: "text-kcvv-gray-blue",
  },
};

/**
 * Alert component for contextual feedback messages.
 *
 * @example
 * ```tsx
 * <Alert variant="success" title="Verzonden!">
 *   Je bericht is succesvol verstuurd.
 * </Alert>
 *
 * <Alert variant="error" dismissible onDismiss={() => setVisible(false)}>
 *   Er ging iets mis. Probeer opnieuw.
 * </Alert>
 * ```
 */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  {
    variant = "info",
    title,
    children,
    dismissible = false,
    onDismiss,
    className,
  },
  ref,
) {
  const config = variantConfig[variant];

  return (
    <div
      ref={ref}
      role="alert"
      className={cn(
        "relative flex gap-3 rounded-[0.25em] px-4 py-3",
        config.bg,
        config.border,
        className,
      )}
    >
      {/* Icon */}
      <div className={cn("shrink-0 mt-0.5", config.titleColor)}>
        {config.icon}
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0">
        {title && (
          <p className={cn("font-semibold text-sm mb-0.5", config.titleColor)}>
            {title}
          </p>
        )}
        <div className={cn("text-sm", config.textColor)}>{children}</div>
      </div>

      {/* Dismiss button */}
      {dismissible && (
        <button
          type="button"
          onClick={() => onDismiss?.()}
          aria-label="Sluit melding"
          className={cn(
            "shrink-0 -mt-0.5 -mr-1 p-1 rounded transition-colors",
            "hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-kcvv-green-bright focus:ring-offset-1",
            config.titleColor,
          )}
        >
          <X size={14} aria-hidden="true" />
        </button>
      )}
    </div>
  );
});
