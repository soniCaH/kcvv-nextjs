"use client";

/**
 * ContactOverlay Component (Option C: Enhanced d3)
 *
 * Floating overlay with quick contact actions for org chart nodes.
 * Appears on hover (desktop) or tap (mobile) on a node.
 *
 * Features:
 * - Positioned near the target node
 * - Quick contact actions (email, phone, WhatsApp)
 * - Member info summary
 * - Close button
 * - Smooth fade-in animation
 * - Touch-friendly on mobile
 * - Click outside to close
 */

import { useEffect, useRef } from "react";
import { X } from "@/lib/icons";
import { ContactQuickActions } from "../shared/ContactQuickActions";
import type { OrgChartNode } from "@/types/organogram";

export interface ContactOverlayProps {
  member: OrgChartNode;
  position?: { x: number; y: number };
  isVisible: boolean;
  onClose: () => void;
  onViewDetails?: (member: OrgChartNode) => void;
  className?: string;
}

/**
 * ContactOverlay - Quick contact actions overlay
 *
 * @param member - The member to show contact info for
 * @param position - Overlay position (x, y coordinates)
 * @param isVisible - Whether overlay is visible
 * @param onClose - Close handler
 * @param onViewDetails - View full details handler
 * @param className - Additional CSS classes
 */
export function ContactOverlay({
  member,
  position = { x: 0, y: 0 },
  isVisible,
  onClose,
  onViewDetails,
  className = "",
}: ContactOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close
  useEffect(() => {
    if (!isVisible) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        overlayRef.current &&
        !overlayRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    // Small delay to avoid immediate close on the same click that opened it
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isVisible, onClose]);

  // Handle escape key to close
  useEffect(() => {
    if (!isVisible) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isVisible, onClose]);

  // Don't render if not visible
  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop (mobile only) */}
      <div
        className="fixed inset-0 bg-black/20 z-40 lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Overlay */}
      <div
        ref={overlayRef}
        className={`
          fixed z-50
          bg-white
          rounded-xl
          shadow-2xl
          border-2 border-gray-200
          animate-in fade-in slide-in-from-bottom-2
          duration-200
          ${className}
        `}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          maxWidth: "320px",
          width: "calc(100vw - 32px)", // Mobile: 16px margin on each side
        }}
        role="dialog"
        aria-label={`Contactinformatie voor ${member.name}`}
      >
        {/* Header */}
        <div className="flex items-start gap-3 p-4 border-b border-gray-100">
          {/* Profile Image */}
          <div className="flex-shrink-0">
            <img
              src={member.imageUrl || "/images/logo-flat.png"}
              alt={member.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-kcvv-green"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/images/logo-flat.png";
              }}
            />
          </div>

          {/* Member Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-kcvv-gray-blue text-base leading-tight mb-1 font-heading">
              {member.name}
            </h3>
            <p className="text-sm text-kcvv-gray leading-snug">
              {member.title}
            </p>
            {member.positionShort && (
              <span
                className="
                  inline-block mt-2
                  px-2 py-0.5
                  bg-kcvv-green/10
                  text-kcvv-green
                  rounded
                  text-xs font-semibold font-mono
                  leading-tight
                "
              >
                {member.positionShort}
              </span>
            )}
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="
              flex-shrink-0
              w-8 h-8
              flex items-center justify-center
              text-kcvv-gray-dark hover:text-kcvv-gray-blue
              hover:bg-gray-100
              rounded-full
              transition-colors
              focus:outline-none focus:ring-2 focus:ring-kcvv-green focus:ring-offset-2
            "
            aria-label="Sluiten"
          >
            <X size={18} />
          </button>
        </div>

        {/* Quick Actions */}
        <div className="p-4">
          <ContactQuickActions
            email={member.email}
            phone={member.phone}
            name={member.name}
            size="lg"
          />
        </div>

        {/* View Details Button */}
        {onViewDetails && (
          <div className="p-4 pt-0">
            <button
              onClick={() => {
                onViewDetails(member);
                onClose();
              }}
              className="
                w-full
                px-4 py-2.5
                bg-kcvv-green hover:bg-kcvv-green-hover
                text-white
                rounded-lg
                font-semibold text-sm
                transition-colors
                focus:outline-none focus:ring-2 focus:ring-kcvv-green focus:ring-offset-2
              "
            >
              Volledige details
            </button>
          </div>
        )}
      </div>
    </>
  );
}
