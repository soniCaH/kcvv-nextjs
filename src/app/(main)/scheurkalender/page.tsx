/**
 * Scheurkalender Page
 * Print-friendly upcoming matches calendar for kiosk / display use
 */

import type { Metadata } from "next";
import { Effect } from "effect";
import { runPromise } from "@/lib/effect/runtime";
import { FootbalistoService } from "@/lib/effect/services/FootbalistoService";
import type { Match } from "@/lib/effect/schemas/match.schema";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Scheurkalender | KCVV Elewijt",
  description:
    "Printbare wedstrijdkalender van KCVV Elewijt met alle aankomende wedstrijden.",
};

async function fetchUpcomingMatches(): Promise<Match[]> {
  const matches = await runPromise(
    Effect.gen(function* () {
      const footbalisto = yield* FootbalistoService;
      return yield* footbalisto.getNextMatches();
    }).pipe(
      Effect.catchAll((error) => {
        console.error("[Scheurkalender] Failed to fetch matches:", error);
        return Effect.succeed([]);
      }),
    ),
  );

  // Only upcoming/scheduled matches, sorted by date
  return [...matches]
    .filter((m) => m.status === "scheduled" || m.status === "live")
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}

function formatFullDate(date: Date): string {
  return date.toLocaleDateString("nl-BE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function ScheurkalenderPage() {
  const matches = await fetchUpcomingMatches();

  // Group by date string
  const grouped = new Map<string, Match[]>();
  for (const match of matches) {
    const key = match.date.toISOString().slice(0, 10);
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(match);
  }
  const days = [...grouped.entries()].sort(([a], [b]) => a.localeCompare(b));

  return (
    <div className="min-h-screen bg-white">
      {/* Screen header (hidden on print) */}
      <div className="print:hidden bg-linear-to-br from-green-main via-green-hover to-green-dark-hover text-white py-10 px-4">
        <div className="max-w-3xl mx-auto flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold font-title mb-2">
              Scheurkalender
            </h1>
            <p className="text-white/90">
              Printbare versie van de wedstrijdkalender
            </p>
          </div>
          <button
            onClick={() => window.print()}
            className="shrink-0 px-5 py-2.5 bg-white text-green-main font-semibold rounded-lg hover:bg-gray-50 transition-colors print:hidden"
            suppressHydrationWarning
          >
            Afdrukken
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 print:px-0 print:py-4">
        {/* Print header (visible only on print) */}
        <div className="hidden print:block mb-6 text-center border-b-2 border-black pb-4">
          <h1 className="text-2xl font-bold">
            KCVV Elewijt — Wedstrijdkalender
          </h1>
          <p className="text-sm text-gray-500">
            Afgedrukt op{" "}
            {new Date().toLocaleDateString("nl-BE", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        {matches.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500">
              Geen aankomende wedstrijden gevonden.
            </p>
          </div>
        ) : (
          <div className="space-y-6 print:space-y-4">
            {days.map(([day, dayMatches]) => (
              <div key={day} className="print:break-inside-avoid">
                {/* Date header */}
                <div className="bg-green-main text-white px-4 py-2 rounded-lg print:rounded-none print:bg-gray-800 mb-2 capitalize">
                  <span className="font-bold capitalize">
                    {formatFullDate(new Date(day + "T12:00:00"))}
                  </span>
                </div>

                {/* Matches for this day */}
                <div className="space-y-2 print:space-y-1">
                  {dayMatches.map((match) => (
                    <div
                      key={match.id}
                      className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg print:rounded-none print:bg-white print:border-b print:border-gray-200"
                    >
                      {/* Time */}
                      <div className="w-12 text-sm font-mono text-gray-500 shrink-0">
                        {match.time ?? "—"}
                      </div>

                      {/* Team label */}
                      {match.round && (
                        <div className="w-20 shrink-0">
                          <span className="text-xs font-semibold text-green-main bg-green-main/10 px-2 py-0.5 rounded print:bg-transparent print:text-black">
                            {match.round}
                          </span>
                        </div>
                      )}

                      {/* Home team */}
                      <div className="flex items-center gap-1.5 flex-1 min-w-0">
                        {match.home_team.logo && (
                          <Image
                            src={match.home_team.logo}
                            alt=""
                            width={20}
                            height={20}
                            className="object-contain shrink-0 print:hidden"
                          />
                        )}
                        <span className="text-sm font-medium truncate">
                          {match.home_team.name}
                        </span>
                      </div>

                      <span className="text-xs text-gray-400 shrink-0">vs</span>

                      {/* Away team */}
                      <div className="flex items-center gap-1.5 flex-1 min-w-0 justify-end">
                        <span className="text-sm font-medium truncate text-right">
                          {match.away_team.name}
                        </span>
                        {match.away_team.logo && (
                          <Image
                            src={match.away_team.logo}
                            alt=""
                            width={20}
                            height={20}
                            className="object-contain shrink-0 print:hidden"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back link (screen only) */}
        <div className="mt-8 print:hidden">
          <Link
            href="/calendar"
            className="text-sm text-gray-500 hover:text-green-main transition-colors"
          >
            ← Terug naar kalender
          </Link>
        </div>
      </div>
    </div>
  );
}

export const revalidate = 300; // 5 minutes
