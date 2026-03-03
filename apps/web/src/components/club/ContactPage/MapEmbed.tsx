"use client";

import { useState } from "react";
import { MapPin } from "@/lib/icons";

const MAP_SRC =
  "https://maps.google.com/maps?q=Driesstraat+30%2C+1982+Elewijt%2C+Belgi%C3%AB&hl=nl&output=embed";
const MAP_TITLE = "Locatie KCVV Elewijt - Driesstraat 30, 1982 Elewijt";

export function MapEmbed() {
  const [isMapConsent, setIsMapConsent] = useState(false);

  return (
    <div className="rounded-xl overflow-hidden shadow-sm border border-gray-200 min-h-[300px]">
      {isMapConsent ? (
        <iframe
          title={MAP_TITLE}
          src={MAP_SRC}
          width="100%"
          height="100%"
          style={{ minHeight: "300px", border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 min-h-[300px] bg-gray-50 p-8 text-center">
          <MapPin className="w-8 h-8 text-gray-400" aria-hidden="true" />
          <div>
            <p className="font-semibold text-gray-blue">Driesstraat 30</p>
            <p className="text-gray-dark">1982 Elewijt (Zemst)</p>
          </div>
          <button
            type="button"
            onClick={() => setIsMapConsent(true)}
            className="px-4 py-2 bg-green-main hover:bg-green-hover text-white text-sm font-semibold rounded-lg transition-colors"
          >
            Laad kaart
          </button>
          <p className="text-xs text-gray-400 max-w-xs">
            Door op &ldquo;Laad kaart&rdquo; te klikken, laad je inhoud van
            Google Maps en aanvaard je hun privacybeleid.
          </p>
        </div>
      )}
    </div>
  );
}
