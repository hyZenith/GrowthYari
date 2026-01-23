import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Video, ArrowRight, Sparkles } from "lucide-react";


interface UpcomingEvent {
    id: string;
    title: string;
    slug: string;
    description: string;
    date: Date;
    startDate: Date | null;
    mode: "ONLINE" | "OFFLINE";
    location: string | null;
    imageUrl: string | null;
    isFree: boolean;
    hostedBy: string;
    categories: string[];
}

function formatEventDate(date: Date) {
    return {
        day: date.getDate(),
        month: date.toLocaleString('default', { month: 'short' }),
        weekday: date.toLocaleString('default', { weekday: 'long' }),
        time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        fullDate: date.toLocaleDateString('default', { day: 'numeric', month: 'long', year: 'numeric' })
    };
}

export async function UpcomingEventsSection() {
    const now = new Date();

    // Fetch up to 3 upcoming events (excluding past events)
    const events = await prisma.event.findMany({
        where: {
            AND: [
                {
                    status: {
                        in: ["UPCOMING", "ONGOING", "SCHEDULED"],
                        notIn: ["COMPLETED", "CANCELLED"],
                    },
                },
                {
                    // Only show events that haven't ended yet
                    OR: [
                        { endDate: { gte: now } },
                        { endDate: null, date: { gte: now } },
                    ],
                },
            ],
        },
        orderBy: {
            startDate: "asc",
        },
        take: 3,
        select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            date: true,
            startDate: true,
            mode: true,
            location: true,
            imageUrl: true,
            isFree: true,
            hostedBy: true,
            categories: true,
        },
    }) as UpcomingEvent[];

    return (
        <section className="py-20 px-4 md:px-8 bg-gradient-to-b from-slate-50 to-white">
            <div className="max-w-5xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-sm font-semibold text-emerald-700 mb-4">
                        <Sparkles className="h-4 w-4" />
                        Don&apos;t Miss Out
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">
                        Upcoming Events
                    </h2>
                    <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                        Join our community events and level up your skills with industry experts.
                    </p>
                </div>

                {/* Events Timeline or Empty State */}
                {events.length === 0 ? (
                    /* Empty State */
                    <div className="text-center py-16 px-8 rounded-3xl bg-white shadow-sm ring-1 ring-slate-100">
                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-50">
                            <Calendar className="h-10 w-10 text-slate-300" />
                        </div>
                        <h3 className="text-2xl font-semibold text-slate-900 mb-2">No Events Scheduled</h3>
                        <p className="text-slate-500 max-w-md mx-auto mb-6">
                            We&apos;re planning something exciting! Check back soon for upcoming events, or subscribe to our newsletter.
                        </p>
                        <Link
                            href="/events"
                            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
                        >
                            Browse All Events
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                ) : (
                    /* Timeline Layout */
                    <div className="relative">
                        {/* Vertical Dotted Line */}
                        <div className="absolute left-[140px] top-0 bottom-0 w-0 border-l-2 border-dashed border-slate-200 hidden md:block" />

                        <div className="flex flex-col gap-8">
                            {events.map((event, index) => {
                                const dateInfo = formatEventDate(event.startDate ?? event.date);

                                return (
                                    <div key={event.id} className="relative flex flex-col md:flex-row gap-6 group">
                                        {/* Date Column */}
                                        <div className="md:w-[120px] shrink-0 text-left md:text-right">
                                            <div className="text-2xl font-bold text-slate-900">{dateInfo.day} {dateInfo.month}</div>
                                            <div className="text-sm text-emerald-600 font-medium">{dateInfo.weekday}</div>
                                        </div>

                                        {/* Timeline Dot */}
                                        <div className="absolute left-[136px] top-2 hidden md:flex items-center justify-center">
                                            <div className="h-3 w-3 rounded-full bg-emerald-500 ring-4 ring-emerald-50 group-hover:ring-emerald-100 transition-all" />
                                        </div>

                                        {/* Event Card */}
                                        <Link
                                            href={`/events/${event.slug}`}
                                            className="flex-1 md:ml-8"
                                        >
                                            <div className="relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 hover:shadow-xl hover:shadow-emerald-900/5 hover:ring-emerald-500/30 transition-all duration-300">
                                                <div className="flex flex-col sm:flex-row gap-5">
                                                    {/* Content */}
                                                    <div className="flex-1 min-w-0">
                                                        {/* Time */}
                                                        <div className="text-sm font-medium text-emerald-600 mb-2 flex items-center gap-1.5">
                                                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                            {dateInfo.time}
                                                        </div>

                                                        {/* Title */}
                                                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors mb-2 line-clamp-1">
                                                            {event.title}
                                                        </h3>

                                                        {/* Location/Mode */}
                                                        <div className="flex items-center gap-2 text-sm text-slate-600 mb-3">
                                                            {event.mode === "ONLINE" ? (
                                                                <>
                                                                    <Video className="h-4 w-4 text-emerald-500" />
                                                                    <span>Online Event</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <MapPin className="h-4 w-4 text-emerald-500" />
                                                                    <span className="truncate" title={event.location || "Location TBA"}>
                                                                        {event.location && event.location.length > 40 ? event.location.slice(0, 40) + "..." : event.location || "Location TBA"}
                                                                    </span>
                                                                </>
                                                            )}
                                                        </div>

                                                        {/* Hosted By */}
                                                        <div className="text-xs text-slate-400">
                                                            by <span className="font-semibold text-slate-600">{event.hostedBy || "GrowthYari"}</span>
                                                        </div>

                                                        {/* View Event Link */}
                                                        <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 group-hover:text-emerald-700">
                                                            View Event
                                                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                                        </div>
                                                    </div>

                                                    {/* Image */}
                                                    {event.imageUrl && (
                                                        <div className="sm:w-36 sm:h-28 w-full h-40 relative rounded-xl overflow-hidden shrink-0 ring-1 ring-slate-100">
                                                            <Image
                                                                src={event.imageUrl}
                                                                alt={event.title}
                                                                className="object-cover"
                                                                fill
                                                                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>

                        {/* View All Link */}
                        <div className="text-center mt-12">
                            <Link
                                href="/events"
                                className="inline-flex items-center gap-2 rounded-full border-2 border-emerald-600 px-8 py-3 text-sm font-semibold text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all"
                            >
                                View All Events
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
