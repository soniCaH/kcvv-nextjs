/**
 * PlayerBio Component
 *
 * Player biography and personal information section.
 * Displays key facts about the player.
 */

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";
import { Calendar, Instagram, Twitter, Facebook } from "@/lib/icons";

export interface SocialLink {
  platform: "instagram" | "twitter" | "facebook" | "website";
  url: string;
}

export interface PlayerBioProps extends HTMLAttributes<HTMLDivElement> {
  /** Birth date (YYYY-MM-DD or display format) */
  birthDate?: string;
  /** Date player joined the club (YYYY-MM-DD or display format) */
  joinDate?: string;
  /** Date player left the club (if applicable) */
  leaveDate?: string;
  /** Biography text */
  biography?: string;
  /** Social media links */
  socialLinks?: SocialLink[];
}

/**
 * Calculate age from birth date
 */
function calculateAge(birthDate: string): number | null {
  try {
    const birth = new Date(birthDate);
    if (isNaN(birth.getTime())) return null;

    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  } catch {
    return null;
  }
}

/**
 * Format date for display
 */
function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;

    return date.toLocaleDateString("nl-BE", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

/**
 * Get social icon component
 */
function SocialIcon({ platform }: { platform: string }) {
  switch (platform) {
    case "instagram":
      return <Instagram size={18} />;
    case "twitter":
      return <Twitter size={18} />;
    case "facebook":
      return <Facebook size={18} />;
    default:
      return null;
  }
}

/**
 * Player biography and information section
 */
export const PlayerBio = forwardRef<HTMLDivElement, PlayerBioProps>(
  (
    {
      birthDate,
      joinDate,
      leaveDate,
      biography,
      socialLinks,
      className,
      ...props
    },
    ref,
  ) => {
    const age = birthDate ? calculateAge(birthDate) : null;
    const formattedBirthDate = birthDate ? formatDate(birthDate) : null;
    const formattedJoinDate = joinDate ? formatDate(joinDate) : null;
    const formattedLeaveDate = leaveDate ? formatDate(leaveDate) : null;
    const isCurrentPlayer = !leaveDate;
    const hasAnyInfo = birthDate || joinDate;

    // Empty state
    if (!hasAnyInfo && !biography && !socialLinks?.length) {
      return (
        <div
          ref={ref}
          className={cn(
            "bg-[#edeff4] rounded-lg p-6 text-center text-[#62656A]",
            className,
          )}
          {...props}
        >
          <p className="text-sm">Geen biografie beschikbaar.</p>
        </div>
      );
    }

    return (
      <div ref={ref} className={cn("space-y-6", className)} {...props}>
        {/* Info grid */}
        {hasAnyInfo && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Birth date */}
            {birthDate && (
              <div className="bg-white border border-[#edeff4] rounded-lg p-4">
                <div className="flex items-center gap-2 text-kcvv-green-bright mb-1">
                  <Calendar size={16} />
                  <span className="text-xs font-medium uppercase tracking-wide text-[#62656A]">
                    Geboortedatum
                  </span>
                </div>
                <div className="font-semibold text-[#292c31]">
                  {formattedBirthDate}
                </div>
                {age !== null && (
                  <div className="text-sm text-[#62656A]">{age} jaar</div>
                )}
              </div>
            )}

            {/* Membership period */}
            {joinDate && (
              <div className="bg-white border border-[#edeff4] rounded-lg p-4">
                <div className="flex items-center gap-2 text-kcvv-green-bright mb-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-xs font-medium uppercase tracking-wide text-[#62656A]">
                    {isCurrentPlayer ? "Bij KCVV sinds" : "Periode bij KCVV"}
                  </span>
                </div>
                <div className="font-semibold text-[#292c31]">
                  {formattedJoinDate}
                  {!isCurrentPlayer && formattedLeaveDate && (
                    <span className="font-normal text-[#62656A]">
                      {" — "}
                      {formattedLeaveDate}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Biography text */}
        {biography && (
          <div className="bg-white border border-[#edeff4] rounded-lg p-6">
            <h3
              className="text-lg font-semibold text-[#31404b] mb-3"
              style={{ fontFamily: "var(--font-family-title)" }}
            >
              Over de speler
            </h3>
            <div className="prose prose-sm max-w-none text-[#292c31]">
              {biography.split("\n\n").map((paragraph, index) => (
                <p key={index} className="mb-3 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Social links */}
        {socialLinks && socialLinks.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-[#62656A]">Volg op:</span>
            <div className="flex items-center gap-2">
              {socialLinks.map((link) => (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "w-9 h-9 flex items-center justify-center",
                    "rounded-full bg-[#edeff4] text-[#62656A]",
                    "transition-all duration-200",
                    "hover:bg-kcvv-green-bright hover:text-white",
                  )}
                  aria-label={`Volg op ${link.platform}`}
                >
                  <SocialIcon platform={link.platform} />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  },
);

PlayerBio.displayName = "PlayerBio";
