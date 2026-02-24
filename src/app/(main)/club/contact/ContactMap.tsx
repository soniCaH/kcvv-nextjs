"use client";

/**
 * ContactMap — consent-gated Google Maps embed.
 * The iframe (and its third-party trackers) is only mounted after the user
 * explicitly consents by clicking "Kaart laden".
 */

import { useState } from "react";
import { MapPin } from "@/lib/icons";

const MAP_SRC =
  "https://maps.google.com/maps?q=Driesstraat+30%2C+1982+Elewijt%2C+Belgi%C3%AB&hl=nl&output=embed";
const MAP_TITLE = "Locatie KCVV Elewijt - Driesstraat 30, 1982 Elewijt";

export function ContactMap() {
  const [consented, setConsented] = useState(false);

  if (!consented) {
    return (
      <div className="rounded-xl border border-gray-200 shadow-sm min-h-[300px] flex flex-col items-center justify-center gap-4 bg-gray-50 p-8 text-center">
        <MapPin className="w-8 h-8 text-gray-300" aria-hidden="true" />
        <div className="space-y-1">
          <p className="font-semibold text-gray-700 text-sm">
            Driesstraat 30, 1982 Elewijt (Zemst)
          </p>
          <p className="text-xs text-gray-400">
            Het laden van de kaart stuurt gegevens naar Google.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setConsented(true)}
          className="px-4 py-2 bg-green-main text-white text-sm font-semibold rounded-lg hover:bg-green-hover transition-colors"
        >
          Kaart laden
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden shadow-sm border border-gray-200 min-h-[300px]">
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
    </div>
  );
}
