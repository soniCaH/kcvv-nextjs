/**
 * Match Not Found Page
 * Displayed when a match cannot be found
 */

import Link from "next/link";

/**
 * Renders a centered "match not found" view for when the requested match cannot be located.
 *
 * Displays a Dutch heading ("Wedstrijd niet gevonden"), an explanatory paragraph, and a control to navigate back to the home page.
 *
 * @returns A JSX element containing the "match not found" UI with a link to the home page.
 */
export default function MatchNotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-6 px-4">
        <h1 className="text-4xl font-bold text-gray-900 font-title">
          Wedstrijd niet gevonden
        </h1>
        <p className="text-lg text-gray-600 max-w-md mx-auto">
          De wedstrijd die je zoekt bestaat niet of is niet meer beschikbaar.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {/* TODO: Enable when /calendar route is implemented */}
          {/* <Link
            href="/calendar"
            className="inline-flex items-center justify-center px-6 py-3 bg-kcvv-green-bright text-white font-semibold rounded-lg hover:bg-kcvv-green-dark transition-colors"
          >
            Bekijk kalender
          </Link> */}
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 transition-colors"
          >
            Terug naar home
          </Link>
        </div>
      </div>
    </div>
  );
}