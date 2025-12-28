"use client";

import { useMemo, useState, useRef } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Calendar, MapPin, Video } from "lucide-react";
import dynamic from 'next/dynamic';

const VariableProximity = dynamic(
    () => import("@/components/ui/shadcn-io/variable-proximity"),
    { ssr: false }
);

/* ---------- Types ---------- */

type BackendStatus = "UPCOMING" | "ONGOING";
type UIStatus = "all" | "ongoing" | "upcoming";

export interface Event {
    id: string;
    title: string;
    slug: string;
    description: string;
    status: BackendStatus;
    date: string; // or Date if passed as Date object, but Prisma returns objects, serialised usually? Server Components pass Dates as Dates usually, but let's stick to simple handling. Actually, from Server Component to Client Component, Dates need to be strings or simple objects. Prisma returns Date objects. Next.js serialization might require them to be strings or we handle it. Let's assume passed as strings or convert in page.
    // Actually, Server Components to Client Components props must be serializable. Date objects are not directly serializable in some versions, but usually fine in recent Next.js if straightforward. 
    // Safest: pass as serialized JSON or simple strings. Let's assume we map them to strings in page.tsx or keep as is and see.
    // Checking previous page.tsx: interface Event had date: string.
    // But Prisma `event.date` is DateTime. API `res.json()` converted it to string.
    // So in Server Component, we need to convert Date to string to pass to Client Component.
    startDate?: string | null;
    endDate?: string | null;
    location?: string | null;
    mode: "ONLINE" | "OFFLINE";
    imageUrl?: string | null;
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

interface EventsViewProps {
    initialEvents: Event[];
}

export function EventsView({ initialEvents }: EventsViewProps) {
    const [filterStatus, setFilterStatus] = useState<UIStatus>("all");
    const [filterDate, setFilterDate] = useState("");
    const containerRef = useRef(null);

    /* Filtering */
    const filteredEvents = useMemo(() => {
        return initialEvents.filter((event) => {
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
    }, [initialEvents, filterStatus, filterDate]);

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900">
            <Header />

            {/* Load Roboto Flex for VariableProximity */}
            <link
                href="https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wght@8..144,100..1000&display=swap"
                rel="stylesheet"
            />

            {/* Hero */}
            <section
                ref={containerRef}
                className="relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 px-4 py-24 text-center md:px-8"
            >
                {/* Decorative blobs */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-emerald-200/20 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-96 w-96 rounded-full bg-teal-200/20 blur-3xl"></div>

                <div className="relative z-10">
                    <span className="inline-block rounded-full bg-white/60 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-900/10">
                        Community & Learning
                    </span>

                    <div className="mt-8 cursor-default">
                        <div className="text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl md:text-7xl lg:text-8xl">
                            <VariableProximity
                                label={'Events & Workshops'}
                                className={'tracking-tight leading-none'}
                                fromFontVariationSettings="'wght' 400, 'opsz' 8"
                                toFontVariationSettings="'wght' 900, 'opsz' 144"
                                containerRef={containerRef}
                                radius={200}
                                falloff='linear'
                            />
                        </div>
                    </div>

                    <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
                        Join our community events to learn, grow, and connect with like-minded professionals.
                    </p>
                </div>
            </section>

            {/* Filters */}
            <section className="sticky top-16 z-10 border-b border-slate-200 bg-white/95 px-4 py-4 backdrop-blur md:px-8">
                <div className="mx-auto max-w-7xl flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 p-1.5 ring-1 ring-slate-900/5">
                        {(["all", "ongoing", "upcoming"] as UIStatus[]).map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`rounded-lg px-5 py-2.5 text-sm font-semibold capitalize transition-all duration-200 ${filterStatus === status
                                    ? "bg-white text-emerald-700 shadow-md"
                                    : "text-slate-600 hover:text-emerald-600"
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>

                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="date"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                            className="rounded-lg border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        />
                    </div>
                </div>
            </section>

            {/* Events Grid */}
            <section className="px-4 py-16 md:px-8 bg-gradient-to-b from-white to-green-50/30">
                <div className="mx-auto max-w-7xl">
                    {filteredEvents.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="rounded-full bg-gradient-to-br from-green-100 to-emerald-100 p-6 mb-6">
                                <Calendar className="h-12 w-12 text-emerald-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">No events found</h3>
                            <p className="text-slate-600">Try adjusting your filters or check back later for new events.</p>
                        </div>
                    ) : (
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {filteredEvents.map((event) => {
                                const uiStatus = mapStatus(event.status);

                                return (
                                    <div
                                        key={event.id}
                                        className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                                    >
                                        {/* Image Section */}
                                        <div className="relative h-52 w-full overflow-hidden bg-slate-100 sm:h-64">
                                            {event.imageUrl ? (
                                                <img
                                                    src={event.imageUrl}
                                                    alt={event.title}
                                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 text-slate-400">
                                                    <Calendar className="h-10 w-10 opacity-20" />
                                                </div>
                                            )}

                                            {/* Overlaid Badges */}
                                            <div className="absolute left-4 top-4 flex items-center gap-2">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold shadow-sm backdrop-blur-md ${uiStatus === "ongoing"
                                                        ? "bg-white/90 text-emerald-700 ring-1 ring-emerald-500/20"
                                                        : "bg-white/90 text-slate-700 ring-1 ring-slate-900/10"
                                                        }`}
                                                >
                                                    <span className={`h-1.5 w-1.5 rounded-full ${uiStatus === "ongoing" ? "bg-emerald-500 animate-pulse" : "bg-blue-500"}`}></span>
                                                    {uiStatus === "ongoing" ? "Ongoing" : "Upcoming"}
                                                </span>
                                            </div>

                                            <div className="absolute right-4 top-4">
                                                <span className="inline-flex items-center rounded-full bg-slate-900/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-md">
                                                    {event.mode === "ONLINE" ? (
                                                        <div className="flex items-center gap-1">
                                                            <Video className="h-3 w-3" />
                                                            <span>Online</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-1">
                                                            <MapPin className="h-3 w-3" />
                                                            <span>Offline</span>
                                                        </div>
                                                    )}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Content Section */}
                                        <div className="flex flex-1 flex-col p-6">
                                            <div className="mb-4">
                                                <h3 className="mb-2 text-xl font-bold leading-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                                                    {event.title}
                                                </h3>
                                                <div className="flex flex-wrap gap-y-2 text-sm text-slate-500">
                                                    <div className="mr-4 flex items-center gap-1.5">
                                                        <Calendar className="h-4 w-4 text-emerald-600" />
                                                        <span>{formatDisplayDate(event)}</span>
                                                    </div>
                                                    {event.location && (
                                                        <div className="flex items-center gap-1.5">
                                                            <MapPin className="h-4 w-4 text-emerald-600" />
                                                            <span className="truncate max-w-[150px]">{event.location}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <p className="mb-6 line-clamp-2 text-sm leading-relaxed text-slate-600 flex-1">
                                                {event.description}
                                            </p>

                                            <div className="mt-auto">
                                                <Link
                                                    href={`/events/${event.slug}`}
                                                    className={`group/btn relative inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${uiStatus === "ongoing"
                                                        ? "bg-emerald-600 text-white shadow-emerald-200 hover:bg-emerald-700 hover:shadow-lg hover:-translate-y-0.5"
                                                        : "bg-slate-50 text-slate-900 hover:bg-slate-100 hover:text-emerald-700"
                                                        }`}
                                                >
                                                    {uiStatus === "ongoing" ? "View Details" : "Register Now"}
                                                    <svg
                                                        className={`h-4 w-4 transition-transform duration-200 ${uiStatus === "ongoing" ? "group-hover/btn:translate-x-1" : ""}`}
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                    </svg>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
}
