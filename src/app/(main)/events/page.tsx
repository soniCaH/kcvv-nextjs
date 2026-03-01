/**
 * Events Page
 * Upcoming club events fetched from Drupal node--event content type
 */

import type { Metadata } from "next";
import { Effect } from "effect";
import { runPromise } from "@/lib/effect/runtime";
import { DrupalService } from "@/lib/effect/services/DrupalService";
import type { Event } from "@/lib/effect/schemas/event.schema";
import { EventsList, type EventsListItem } from "@/components/event/EventsList";

export const metadata: Metadata = {
  title: "Evenementen | KCVV Elewijt",
  description:
    "Bekijk alle aankomende evenementen van KCVV Elewijt — clubactiviteiten, jeugdevents en meer.",
  keywords: ["evenementen", "activiteiten", "club", "jeugd", "KCVV Elewijt"],
  openGraph: {
    title: "Evenementen - KCVV Elewijt",
    description: "Alle aankomende evenementen van KCVV Elewijt",
    type: "website",
  },
};

export const revalidate = 300;

function transformEvent(event: Event): EventsListItem {
  const alias = event.attributes.path?.alias ?? "";
  const slug = alias.startsWith("/events/")
    ? alias.slice("/events/".length)
    : event.id;
  const imageData = event.relationships.field_image?.data;
  const imageUrl =
    imageData && "uri" in imageData ? imageData.uri.url : undefined;

  return {
    title: event.attributes.title,
    href: `/events/${slug}`,
    date: event.attributes.field_event_date
      ? new Date(event.attributes.field_event_date as unknown as string)
      : undefined,
    endDate: event.attributes.field_event_end_date
      ? new Date(event.attributes.field_event_end_date as unknown as string)
      : undefined,
    location: event.attributes.field_location,
    imageUrl,
    excerpt: event.attributes.body?.summary || undefined,
  };
}

async function fetchEvents(): Promise<EventsListItem[]> {
  const events = await runPromise(
    Effect.gen(function* () {
      const drupal = yield* DrupalService;
      return yield* drupal.getEvents({ upcoming: true });
    }).pipe(
      Effect.catchAll((error) => {
        console.error("[Events] Failed to fetch events:", error);
        return Effect.succeed([] as Event[]);
      }),
    ),
  );

  return events.map(transformEvent);
}

export default async function EventsPage() {
  const events = await fetchEvents();

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-white">
      {/* Hero */}
      <div className="bg-linear-to-br from-green-main via-green-hover to-green-dark-hover text-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 font-title">
            Evenementen
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl">
            Alle aankomende activiteiten van KCVV Elewijt
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <EventsList events={events} />
      </div>
    </div>
  );
}
