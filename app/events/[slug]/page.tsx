import { notFound } from "next/navigation";

/* ---------- Types ---------- */

interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  status: "UPCOMING" | "ONGOING";
  mode: "ONLINE" | "OFFLINE";
  date: string;
  startDate?: string | null;
  endDate?: string | null;
  meetingUrl?: string | null;
  location?: string | null;
}

/* ---------- Helpers ---------- */

function formatDateRange(event: Event) {
  if (event.startDate && event.endDate) {
    return `${new Date(event.startDate).toLocaleDateString()} – ${new Date(
      event.endDate
    ).toLocaleDateString()}`;
  }

  return new Date(event.date).toLocaleDateString();
}

/* ---------- Data Fetch ---------- */

async function getEvent(slug: string): Promise<Event> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/events/${slug}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    notFound();
  }

  return res.json();
}

/* ---------- Page ---------- */

export default async function EventDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const event = await getEvent(params.slug);

  return (
    <main className="mx-auto max-w-4xl px-4 py-16">
      {/* Status Badge */}
      <span className="mb-4 inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
        {event.status === "ONGOING" ? "Ongoing Event" : "Upcoming Event"}
      </span>

      {/* Title */}
      <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
        {event.title}
      </h1>

      {/* Meta */}
      <div className="mt-6 space-y-2 text-slate-600">
        <p>
          <strong>Date:</strong> {formatDateRange(event)}
        </p>

        <p>
          <strong>Mode:</strong>{" "}
          {event.mode === "ONLINE" ? "Online" : "Offline"}
        </p>

        {event.location && (
          <p>
            <strong>Location:</strong> {event.location}
          </p>
        )}
      </div>

      {/* Description */}
      <section className="prose prose-slate mt-10 max-w-none">
        <p>{event.description}</p>
      </section>

      {/* CTA */}
      <div className="mt-12">
        {event.status === "ONGOING" ? (
          event.mode === "ONLINE" && event.meetingUrl ? (
            <a
              href={event.meetingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-lg bg-emerald-700 px-6 py-3 font-semibold text-white hover:bg-emerald-800"
            >
              Join Event
            </a>
          ) : (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-6 py-4 text-emerald-800">
              This event is currently ongoing.
            </div>
          )
        ) : (
          <button
            className="rounded-lg border border-emerald-700 px-6 py-3 font-semibold text-emerald-700 hover:bg-emerald-50"
            disabled
          >
            Registration opens soon
          </button>
        )}
      </div>
    </main>
  );
}
