"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

/* ---------- Types ---------- */

type BackendStatus = "UPCOMING" | "ONGOING";
type UIStatus = "all" | "ongoing" | "upcoming";

interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  status: BackendStatus;
  date: string;
  startDate?: string | null;
  endDate?: string | null;
  location?: string | null;
  mode: "ONLINE" | "OFFLINE";
}

/* ---------- Helpers ---------- */

function mapStatus(status: BackendStatus): Exclude<UIStatus, "all"> {
  return status === "ONGOING" ? "ongoing" : "upcoming";
}

function formatDisplayDate(event: Event) {
  if (event.startDate && event.endDate) {
    return `${new Date(event.startDate).toLocaleDateString()} – ${new Date(
      event.endDate
    ).toLocaleDateString()}`;
  }

  return new Date(event.date).toLocaleDateString();
}

/* ---------- Page ---------- */

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const [filterStatus, setFilterStatus] = useState<UIStatus>("all");
  const [filterDate, setFilterDate] = useState("");

  /* Fetch public events */
  useEffect(() => {
    async function loadEvents() {
      const res = await fetch("/api/events");
      const data = await res.json();
      setEvents(data);
      setLoading(false);
    }

    loadEvents();
  }, []);

  /* Filtering */
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const uiStatus = mapStatus(event.status);

      if (filterStatus !== "all" && uiStatus !== filterStatus) {
        return false;
      }

      if (filterDate) {
        const compareDate = event.startDate ?? event.date;
        return compareDate >= filterDate;
      }

      return true;
    });
  }, [events, filterStatus, filterDate]);

  /* Loading State */
  if (loading) {
    return <div className="p-12 text-center">Loading events…</div>;
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Hero */}
      <section className="border-b border-slate-200 bg-slate-50/50 px-4 py-16 text-center md:px-8">
        <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
          Community & Learning
        </span>
        <h1 className="mt-4 text-3xl font-bold sm:text-5xl">
          Events & Workshops
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
          Join our community events to learn, grow, and connect.
        </p>
      </section>

      {/* Filters */}
      <section className="sticky top-0 z-10 border-b bg-white/95 px-4 py-4 backdrop-blur md:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex rounded-lg bg-slate-100 p-1">
            {(["all", "ongoing", "upcoming"] as UIStatus[]).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`rounded-md px-4 py-2 text-sm font-medium capitalize transition ${
                  filterStatus === status
                    ? "bg-white text-emerald-700 shadow"
                    : "text-slate-600 hover:text-emerald-600"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="rounded-lg bg-slate-100 px-3 py-2 text-sm"
          />
        </div>
      </section>

      {/* Events Grid */}
      <section className="px-4 py-12 md:px-8">
        {filteredEvents.length === 0 ? (
          <div className="text-center text-slate-500">
            No events found.
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => {
              const uiStatus = mapStatus(event.status);

              return (
                <div
                  key={event.id}
                  className="flex flex-col rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md"
                >
                  <span
                    className={`mb-4 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                      uiStatus === "ongoing"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {uiStatus === "ongoing" ? "Ongoing" : "Upcoming"}
                  </span>

                  <h3 className="mb-2 text-xl font-bold">
                    {event.title}
                  </h3>

                  <p className="mb-2 text-sm text-slate-500">
                    {formatDisplayDate(event)}
                  </p>

                  {event.location && (
                    <p className="mb-4 text-sm text-slate-500">
                      {event.location}
                    </p>
                  )}

                  <p className="mb-6 line-clamp-3 text-sm text-slate-600">
                    {event.description}
                  </p>

                  <Link
                    href={`/events/${event.slug}`}
                    className={`mt-auto w-full rounded-lg px-4 py-2.5 text-center text-sm font-semibold ${
                      uiStatus === "ongoing"
                        ? "bg-emerald-700 text-white hover:bg-emerald-800"
                        : "border border-emerald-700 text-emerald-700 hover:bg-emerald-50"
                    }`}
                  >
                    {uiStatus === "ongoing" ? "View Details" : "Register"}
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
