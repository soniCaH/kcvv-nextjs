/**
 * Organogram Page
 *
 * Unified interface showing KCVV club structure with multiple views:
 * - Card Hierarchy: Collapsible card-based view
 * - Interactive Chart: D3-based visual diagram
 * - Responsibility Finder: Help system integration
 */

import type { Metadata } from "next";
import { Suspense } from "react";
import { UnifiedOrganogramClient } from "@/components/organogram";
import { clubStructure } from "@/data/club-structure";

export const metadata: Metadata = {
  title: "Organogram & Hulp | KCVV Elewijt",
  description:
    "Ontdek de organisatiestructuur van KCVV Elewijt en vind snel de juiste contactpersoon. Bekijk het organogram als kaartjes of diagram, en zoek wie je kan helpen met jouw vraag.",
  keywords: [
    "KCVV Elewijt",
    "organogram",
    "bestuur",
    "jeugdbestuur",
    "hoofdbestuur",
    "organisatie",
    "voetbalclub",
    "contactpersoon",
    "hulp",
  ],
  openGraph: {
    title: "Organogram & Hulp - KCVV Elewijt",
    description:
      "Interactieve organisatiestructuur en hulp bij KCVV Elewijt - Kies je eigen weergave en vind snel de juiste persoon",
    type: "website",
  },
};

/**
 * Renders the unified Organogram and Responsibility Finder page.
 * User-friendly for all ages (6-99) and all devices.
 *
 * @returns The React element for the organogram page.
 */
export default function OrganogramPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-main via-green-hover to-green-dark-hover text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1
            className="text-3xl md:text-5xl font-bold mb-4"
            style={{
              fontFamily: "quasimoda, acumin-pro, Montserrat, sans-serif",
            }}
          >
            Clubstructuur & Hulp
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl">
            Ontdek wie er bij KCVV werkt en vind snel de juiste contactpersoon
            voor jouw vraag.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Suspense fallback={<div className="text-center py-12">Laden...</div>}>
          <UnifiedOrganogramClient members={clubStructure} />
        </Suspense>
      </div>
    </div>
  );
}
