"use client";

/**
 * ContactQuickActions Component
 *
 * Inline email/phone contact actions with icons.
 * Provides quick access to contact methods without opening the full modal.
 *
 * Features:
 * - Email (mailto link with icon)
 * - Phone (tel link with icon)
 * - WhatsApp (if phone number exists)
 * - Copy to clipboard on long-press
 * - Accessible tooltips
 */

import { Mail, Phone, MessageCircle } from "@/lib/icons";
import { useState } from "react";
import type { ContactQuickActionsProps } from "./types";

/**
 * ContactQuickActions - Display inline contact action buttons
 *
 * @param email - Email address
 * @param phone - Phone number
 * @param name - Name for ARIA labels and tooltips
 * @param size - Button size (sm | md | lg)
 * @param className - Additional CSS classes
 */
export function ContactQuickActions({
  email,
  phone,
  name,
  size = "md",
  className = "",
}: ContactQuickActionsProps) {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  // If no contact info, render nothing
  if (!email && !phone) {
    return null;
  }

  // Size variants
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
  };

  const iconSize = {
    sm: 14,
    md: 16,
    lg: 20,
  };

  // Copy to clipboard handler
  const handleCopy = async (text: string, type: "email" | "phone") => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "email") {
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
      } else {
        setCopiedPhone(true);
        setTimeout(() => setCopiedPhone(false), 2000);
      }
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Format WhatsApp link (remove spaces and dashes)
  const whatsappPhone = phone?.replace(/[\s-]/g, "");

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Email Button */}
      {email && (
        <div className="relative group">
          <a
            href={`mailto:${email}`}
            onClick={(e) => e.stopPropagation()}
            onContextMenu={(e) => {
              e.preventDefault();
              handleCopy(email, "email");
            }}
            className={`
              ${sizeClasses[size]}
              flex items-center justify-center
              bg-kcvv-green/10 text-kcvv-green
              hover:bg-kcvv-green hover:text-white
              rounded-full
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-kcvv-green focus:ring-offset-2
            `}
            aria-label={`Email ${name}`}
            title={copiedEmail ? "Gekopieerd!" : email}
          >
            <Mail size={iconSize[size]} />
          </a>

          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
            {copiedEmail ? "Gekopieerd!" : email}
          </div>
        </div>
      )}

      {/* Phone Button */}
      {phone && (
        <div className="relative group">
          <a
            href={`tel:${phone}`}
            onClick={(e) => e.stopPropagation()}
            onContextMenu={(e) => {
              e.preventDefault();
              handleCopy(phone, "phone");
            }}
            className={`
              ${sizeClasses[size]}
              flex items-center justify-center
              bg-kcvv-green/10 text-kcvv-green
              hover:bg-kcvv-green hover:text-white
              rounded-full
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-kcvv-green focus:ring-offset-2
            `}
            aria-label={`Bel ${name}`}
            title={copiedPhone ? "Gekopieerd!" : phone}
          >
            <Phone size={iconSize[size]} />
          </a>

          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
            {copiedPhone ? "Gekopieerd!" : phone}
          </div>
        </div>
      )}

      {/* WhatsApp Button */}
      {phone && whatsappPhone && (
        <div className="relative group">
          <a
            href={`https://wa.me/${whatsappPhone.startsWith("+") ? whatsappPhone.slice(1) : whatsappPhone}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className={`
              ${sizeClasses[size]}
              flex items-center justify-center
              bg-[#25D366]/10 text-[#25D366]
              hover:bg-[#25D366] hover:text-white
              rounded-full
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2
            `}
            aria-label={`WhatsApp ${name}`}
            title="WhatsApp"
          >
            <MessageCircle size={iconSize[size]} />
          </a>

          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
            WhatsApp
          </div>
        </div>
      )}
    </div>
  );
}
