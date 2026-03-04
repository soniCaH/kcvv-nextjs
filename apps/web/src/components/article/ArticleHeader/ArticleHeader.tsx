/**
 * ArticleHeader Component
 * Article title and hero image section
 * Matches Gatsby visual: green background title, hero image with blur background
 */

import Image from "next/image";
import { cn } from "@/lib/utils/cn";

export interface ArticleHeaderProps {
  /**
   * Article title
   */
  title: string;
  /**
   * Hero image URL
   */
  imageUrl: string;
  /**
   * Hero image alt text
   */
  imageAlt?: string;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Article header with title and hero image
 *
 * Visual specifications (matching Gatsby):
 * - Title background: Green (#4acf52) with header-pattern.png
 * - Title: White text, line-height 0.92
 * - Title padding: 1.25rem 1.5rem (mobile) / 0 0 1.25rem (desktop)
 * - Container: Max-width 70rem (1120px)
 * - Hero image: Full width mobile / 35rem (560px) height desktop
 * - Background blur effect: Desktop only, blur 0.5rem, scale 1.1
 * - Margin bottom: var(--margin-hero--mobile/desktop)
 */
export const ArticleHeader = ({
  title,
  imageUrl,
  imageAlt = "",
  className,
}: ArticleHeaderProps) => {
  return (
    <header className={cn("relative z-[1] mb-12 lg:mb-16", className)}>
      {/* Title Section - Green Background */}
      <div
        className="relative z-0 flex flex-col pb-[10px]"
        style={{
          background: "#4acf52",
          backgroundImage: "url(/images/header-pattern.png)",
          backgroundPosition: "50% -7vw",
          backgroundAttachment: "fixed",
          backgroundRepeat: "no-repeat",
          backgroundSize: "100vw auto",
        }}
      >
        <div className="w-full max-w-inner-lg mx-auto px-6 py-5 lg:px-0 lg:pb-5">
          <h1 className="text-white text-4xl lg:text-5xl leading-[0.92] m-0 font-bold">
            {title}
          </h1>
        </div>
      </div>

      {/* Hero Image Section */}
      <div className="relative w-full overflow-hidden z-0 m-0">
        {/* Blurred Background - Desktop only */}
        <div className="hidden lg:block absolute inset-0 z-[-1]">
          <Image
            src={imageUrl}
            alt=""
            fill
            className="object-cover"
            style={{
              filter: "blur(0.5rem)",
              transform: "scale(1.1)",
            }}
          />
        </div>

        {/* Hero Image */}
        <div className="max-w-inner-lg mx-auto text-left lg:h-[35rem]">
          <div className="relative w-full h-auto lg:h-[35rem]">
            <Image
              src={imageUrl}
              alt={imageAlt}
              width={1120}
              height={560}
              className="w-full h-auto lg:h-[35rem] object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </header>
  );
};
