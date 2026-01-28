/**
 * CoachProfile Component
 *
 * Coach/staff profile card with photo, role, and contact info.
 *
 * Features:
 * - Photo with fallback placeholder
 * - Name and role display
 * - Optional contact info (email, phone)
 * - Optional biography text
 * - Card and inline variants
 */

import Image from "next/image";
import { Mail, Phone, User } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface CoachProfileProps {
  /** Coach name */
  name: string;
  /** Role/position (e.g., "Hoofdtrainer", "Assistent-trainer") */
  role: string;
  /** Photo URL */
  imageUrl?: string;
  /** Contact email */
  email?: string;
  /** Contact phone */
  phone?: string;
  /** Biography text */
  biography?: string;
  /** Display variant */
  variant?: "card" | "inline";
  /** Additional CSS classes */
  className?: string;
}

/**
 * Render a coach/staff profile card or inline display.
 *
 * The card variant shows a larger photo with name, role, optional biography, and contact icons.
 * The inline variant shows a compact horizontal layout with smaller photo.
 *
 * @param name - Coach or staff member name
 * @param role - Role or position title
 * @param imageUrl - Optional profile photo URL
 * @param email - Optional contact email
 * @param phone - Optional contact phone number
 * @param biography - Optional biography text
 * @param variant - Display style: "card" (default) or "inline"
 * @param className - Optional additional CSS classes
 * @returns The rendered profile element
 */
export function CoachProfile({
  name,
  role,
  imageUrl,
  email,
  phone,
  biography,
  variant = "card",
  className,
}: CoachProfileProps) {
  // Inline variant - compact horizontal layout
  if (variant === "inline") {
    return (
      <div
        className={cn(
          "flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg",
          className,
        )}
      >
        {/* Photo */}
        <div className="flex-shrink-0">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={`${name} foto`}
              width={48}
              height={48}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
              <User
                className="w-6 h-6 text-gray-400"
                aria-hidden="true"
                focusable={false}
              />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-gray-900 truncate">{name}</h3>
          <p className="text-sm text-gray-500 truncate">{role}</p>
        </div>
      </div>
    );
  }

  // Card variant - full profile card
  return (
    <div
      className={cn(
        "bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm",
        className,
      )}
    >
      {/* Photo section */}
      <div className="aspect-square relative bg-gray-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={`${name} foto`}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <User
              className="w-20 h-20 text-gray-300"
              aria-hidden="true"
              focusable={false}
            />
          </div>
        )}
      </div>

      {/* Content section */}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900">{name}</h3>
        <p className="text-sm text-kcvv-green-bright font-medium">{role}</p>

        {/* Biography */}
        {biography && (
          <p className="mt-3 text-sm text-gray-600 line-clamp-3">{biography}</p>
        )}

        {/* Contact info */}
        {(email || phone) && (
          <div className="mt-4 space-y-2">
            {email && (
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-kcvv-green-bright transition-colors"
              >
                <Mail
                  className="w-4 h-4 flex-shrink-0"
                  aria-hidden="true"
                  focusable={false}
                />
                <span className="truncate">{email}</span>
              </a>
            )}
            {phone && (
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-kcvv-green-bright transition-colors"
              >
                <Phone
                  className="w-4 h-4 flex-shrink-0"
                  aria-hidden="true"
                  focusable={false}
                />
                <span>{phone}</span>
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
