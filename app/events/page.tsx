"use client";

import { useState } from "react";
import Link from "next/link";

export default function EventsPage() {
    const [filterStatus, setFilterStatus] = useState<"all" | "ongoing" | "upcoming">("all");
    const [filterDate, setFilterDate] = useState("");

    const events = [
        // Ongoing Events
        {
            id: 1,
            title: "Mindfulness for Beginners",
            date: "2025-12-01", // ISO date for easier filtering logic if needed, displayed as range in UI
            displayDate: "Dec 1st - Jan 15th, 2026",
            location: "Online Workshop",
            description: "Join our daily sessions to learn the basics of mindfulness and build a sustainable practice for mental clarity.",
            status: "ongoing"
        },
        {
            id: 2,
            title: "Resilience Building Bootcamp",
            date: "2025-12-10",
            displayDate: "Dec 10th - Jan 5th, 2026",
            location: "GrowthYari HQ, Delhi",
            description: "An intensive in-person workshop focused on developing emotional resilience and stress management techniques.",
            status: "ongoing"
        },
        // Upcoming Events
        {
            id: 3,
            title: "Annual Youth Summit 2026",
            date: "2026-02-15",
            displayDate: "February 15, 2026",
            location: "Convention Center, Mumbai",
            description: "Connect with thousands of young changemakers at our biggest event of the year.",
            status: "upcoming"
        },
        {
            id: 4,
            title: "Digital Wellness Retreat",
            date: "2026-03-10",
            displayDate: "March 10-12, 2026",
            location: "Online",
            description: "A 3-day guided digital detox to help you reconnect with yourself and nature.",
            status: "upcoming"
        },
        {
            id: 5,
            title: "Career & Confidence Workshop",
            date: "2026-04-05",
            displayDate: "April 5, 2026",
            location: "Hybrid (Online & Bangalore)",
            description: "Expert-led sessions on boosting confidence and navigating early career challenges.",
            status: "upcoming"
        }
    ];

    const filteredEvents = events.filter(event => {
        // Status Filter
        if (filterStatus !== "all" && event.status !== filterStatus) {
            return false;
        }

        if (filterDate) {
            return event.date >= filterDate;
        }

        return true;
    });

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900">
            {/* Hero Section - Centered */}
            <section className="relative border-b border-slate-200 bg-slate-50/50 px-4 py-16 text-center md:px-8 lg:py-20">
                <div className="mx-auto max-w-4xl">
                    <div className="flex justify-center">
                        <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-800">
                            Community & Learning
                        </span>
                    </div>
                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                        Events & Workshops
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
                        Join our community events to learn, grow, and connect. Discover what’s happening now and what’s coming next in our journey together.
                    </p>
                </div>
            </section>

            {/* Filter Section */}
            <section className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 px-4 py-4 backdrop-blur-sm md:px-8">
                <div className="flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center">
                    {/* Status Tabs */}
                    <div className="flex items-center space-x-1 rounded-lg bg-slate-100 p-1">
                        {(["all", "ongoing", "upcoming"] as const).map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${filterStatus === status
                                        ? "bg-white text-emerald-700 shadow-sm"
                                        : "text-slate-600 hover:text-emerald-600"
                                    } capitalize`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>

                    {/* Date Picker */}
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <input
                            type="date"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                            className="cursor-pointer rounded-lg border-0 bg-slate-100 py-2 pl-10 pr-3 text-sm text-slate-700 focus:ring-2 focus:ring-emerald-500 hover:bg-slate-200 transition-colors"
                        />
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="px-4 py-12 md:px-8">
                <div className="max-w-7xl">
                    {filteredEvents.length > 0 ? (
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {filteredEvents.map((event) => (
                                <div key={event.id} className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-emerald-200 hover:shadow-md">
                                    <div className="mb-4 flex items-start justify-between">
                                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${event.status === 'ongoing'
                                            ? 'bg-emerald-100 text-emerald-800'
                                            : 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                                            }`}>
                                            {event.status === 'ongoing' ? 'Ongoing' : 'Upcoming'}
                                        </span>
                                    </div>
                                    <h3 className="mb-2 text-xl font-bold text-slate-900 group-hover:text-emerald-700">{event.title}</h3>
                                    <div className="mb-4 space-y-2 text-sm text-slate-500">
                                        <div className="flex items-center gap-2">
                                            <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span>{event.displayDate}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span>{event.location}</span>
                                        </div>
                                    </div>
                                    <p className="mb-6 line-clamp-3 text-sm leading-relaxed text-slate-600">
                                        {event.description}
                                    </p>
                                    <div className="mt-auto">
                                        <button className={`w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 ${event.status === 'ongoing'
                                            ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                                            : 'border border-emerald-700 text-emerald-700 hover:bg-emerald-50'
                                            }`}>
                                            {event.status === 'ongoing' ? 'View Details' : 'Register'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 text-center">
                            <div className="rounded-full bg-white p-4 shadow-sm">
                                <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="mt-4 text-lg font-semibold text-slate-900">No events found</h3>
                            <p className="mt-2 text-slate-500">Try adjusting your filters to see more events.</p>
                            <button
                                onClick={() => { setFilterStatus("all"); setFilterDate(""); }}
                                className="mt-6 font-medium text-emerald-700 hover:text-emerald-800"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
