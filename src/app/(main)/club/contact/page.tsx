/**
 * Contact Page
 * Club contact information and categorized email contacts
 */

import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Mail, ExternalLink } from "@/lib/icons";
import { ContactMap } from "./ContactMap";

export const metadata: Metadata = {
  title: "Contact | KCVV Elewijt",
  description:
    "Contacteer KCVV Elewijt. Adres: Driesstraat 30, 1982 Elewijt. Vind de juiste contactpersoon voor algemene vragen, jeugdwerking, sponsoring en meer.",
  keywords: [
    "contact",
    "KCVV Elewijt",
    "adres",
    "e-mail",
    "jeugd",
    "sponsoring",
    "Elewijt",
  ],
  openGraph: {
    title: "Contact - KCVV Elewijt",
    description: "Contacteer KCVV Elewijt voor al je vragen",
    type: "website",
  },
};

const CONTACT_CATEGORIES = [
  {
    label: "Algemene vragen",
    email: "info@kcvvelewijt.be",
    description: "Algemene informatie over de club",
  },
  {
    label: "Jeugdwerking",
    email: "jeugd@kcvvelewijt.be",
    description: "Inschrijvingen, stages en jeugdactiviteiten",
  },
  {
    label: "Sponsoring",
    email: "sponsoring@kcvvelewijt.be",
    description: "Partnerschappen en sponsormogelijkheden",
  },
  {
    label: "Webmaster",
    email: "kevin@kcvvelewijt.be",
    description: "Technische vragen over de website",
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-green-main via-green-hover to-green-dark-hover text-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 font-title">
            Contact
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl">
            Heb je een vraag? We helpen je graag verder.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">
        {/* Club info + map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Club details */}
          <div className="bg-white rounded-xl shadow-sm p-8 space-y-6">
            <h2 className="text-2xl font-bold text-gray-blue font-title">
              Clubgegevens
            </h2>

            <div className="flex items-start gap-3">
              <MapPin
                className="w-5 h-5 text-green-main mt-0.5 flex-shrink-0"
                aria-hidden="true"
              />
              <div>
                <p className="font-semibold text-gray-blue">Adres</p>
                <p className="text-gray-dark">Driesstraat 30</p>
                <p className="text-gray-dark">1982 Elewijt (Zemst)</p>
                <a
                  href="https://maps.google.com/?q=Driesstraat+30,+1982+Elewijt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-green-main hover:text-green-hover mt-1"
                >
                  Routebeschrijving
                  <ExternalLink className="w-3 h-3" aria-hidden="true" />
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail
                className="w-5 h-5 text-green-main mt-0.5 flex-shrink-0"
                aria-hidden="true"
              />
              <div>
                <p className="font-semibold text-gray-blue">E-mail</p>
                <a
                  href="mailto:info@kcvvelewijt.be"
                  className="text-green-main hover:text-green-hover hover:underline"
                >
                  info@kcvvelewijt.be
                </a>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 space-y-3">
              <Link
                href="/hulp"
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-green-main/5 transition-colors group"
              >
                <div>
                  <p className="font-semibold text-gray-blue text-sm">
                    Weet je niet wie je moet contacteren?
                  </p>
                  <p className="text-xs text-gray-dark">
                    Gebruik onze hulpvinder
                  </p>
                </div>
                <span
                  className="text-green-main group-hover:translate-x-0.5 transition-transform"
                  aria-hidden="true"
                >
                  →
                </span>
              </Link>
              <Link
                href="/club/organigram"
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-green-main/5 transition-colors group"
              >
                <div>
                  <p className="font-semibold text-gray-blue text-sm">
                    Bekijk het volledige organigram
                  </p>
                  <p className="text-xs text-gray-dark">
                    Alle bestuursleden en contactgegevens
                  </p>
                </div>
                <span
                  className="text-green-main group-hover:translate-x-0.5 transition-transform"
                  aria-hidden="true"
                >
                  →
                </span>
              </Link>
            </div>
          </div>

          {/* Map embed — consent-gated, see ContactMap.tsx */}
          <ContactMap />
        </div>

        {/* Contact categories */}
        <div>
          <h2 className="text-2xl font-bold text-gray-blue font-title mb-6">
            Contacteer ons per categorie
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {CONTACT_CATEGORIES.map((cat) => (
              <a
                key={cat.email}
                href={`mailto:${cat.email}`}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:border-green-main hover:shadow-md transition-all group"
              >
                <div className="flex items-start gap-3">
                  <Mail
                    className="w-5 h-5 text-green-main mt-0.5 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="font-bold text-gray-blue group-hover:text-green-main transition-colors">
                      {cat.label}
                    </p>
                    <p className="text-sm text-gray-dark mb-1">
                      {cat.description}
                    </p>
                    <p className="text-sm text-green-main">{cat.email}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
