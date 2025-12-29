"use client";

import { useMemo, useState, useRef } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Calendar, MapPin, Video, Users, ChevronLeft, ChevronRight, X } from "lucide-react";
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from "motion/react";

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
    date: string;
    startDate?: string | null;
    endDate?: string | null;
    location?: string | null;
    mode: "ONLINE" | "OFFLINE";
    imageUrl?: string | null;
    capacity?: number | null;
    price: number;
    registrationsCount: number;
}

/* ---------- Helpers ---------- */

function mapStatus(status: BackendStatus): Exclude<UIStatus, "all"> {
    return status === "ONGOING" ? "ongoing" : "upcoming";
}

function formatDisplayDate(event: Event) {
    // For the "Big Date" display
    const dateObj = new Date(event.startDate ?? event.date);
    return {
        day: dateObj.getDate(),
        month: dateObj.toLocaleString('default', { month: 'short' }),
        time: dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
}

interface EventsViewProps {
    initialEvents: Event[];
}

export function EventsView({ initialEvents }: EventsViewProps) {
    const [filterStatus, setFilterStatus] = useState<UIStatus>("all");
    const [filterDate, setFilterDate] = useState("");
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [viewDate, setViewDate] = useState(new Date());
    const calendarRef = useRef<HTMLDivElement>(null);
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
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            <Header />

            {/* Load Roboto Flex for VariableProximity */}
            <link
                href="https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wght@8..144,100..1000&display=swap"
                rel="stylesheet"
            />

            {/* Hero */}
            <section
                ref={containerRef}
                className="relative overflow-hidden bg-gradient-to-b from-white to-slate-100 px-4 py-20 text-center md:px-8 pb-32"
            >
                {/* Decorative blobs - More subtle */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-emerald-100/40 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-96 w-96 rounded-full bg-teal-100/40 blur-3xl"></div>

                <div className="relative z-10 max-w-4xl mx-auto">
                    <div className="flex justify-center mb-6">
                        <span className="inline-block rounded-full bg-blue-100 px-4 py-1.5 text-xs font-semibold text-blue-800">
                            Community & Learning
                        </span>
                    </div>

                    <div className="cursor-default text-5xl font-bold tracking-tighter text-slate-900 sm:text-6xl md:text-7xl">
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

                    <p className="mx-auto mt-6 max-w-2xl  text-lg   leading-relaxed">
                        Curated experiences to help you learn, connect, and grow. Join thousands of other professionals in our community.
                    </p>
                </div>
            </section>

            {/* Main Content Area (Filters + List) */}
            <section className="relative -mt-20 px-4 pb-20 md:px-8">
                <div className="mx-auto max-w-5xl">

                    {/* Filters Bar */}
                    <div className="relative z-[50] mb-8 flex flex-col gap-4 rounded-2xl bg-white/80 p-4 shadow-xl shadow-slate-200/50 backdrop-blur-xl ring-1 ring-slate-200/60 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex gap-1 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
                            {(["all", "ongoing", "upcoming"] as UIStatus[]).map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilterStatus(status)}
                                    className={`whitespace-nowrap rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-200 ${filterStatus === status
                                        ? "bg-emerald-100 text-emerald-800 shadow-sm ring-1 ring-emerald-500/20"
                                        : "bg-transparent text-slate-600 hover:bg-emerald-50 hover:text-emerald-600"
                                        }`}
                                >
                                    {status === 'all' ? 'All Events' : status.charAt(0).toUpperCase() + status.slice(1)}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-3 border-l border-slate-200 pl-0 sm:pl-4">
                            <div className="relative w-full sm:w-auto">
                                <button
                                    onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                                    className="flex w-full items-center gap-2.5 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-900 transition-all hover:bg-slate-200 sm:w-44"
                                >
                                    <Calendar className="h-4 w-4 text-emerald-600" />
                                    <span>{filterDate ? new Date(filterDate).toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' }) : "Pick a date"}</span>
                                    {filterDate && (
                                        <X
                                            className="ml-auto h-3.5 w-3.5 text-slate-400 hover:text-red-500"
                                            onClick={(e) => { e.stopPropagation(); setFilterDate(""); }}
                                        />
                                    )}
                                </button>

                                <AnimatePresence mode="wait">
                                    {isCalendarOpen && (
                                        <>
                                            {/* Backdrop for closing */}
                                            <div
                                                className="fixed inset-0 z-[60]"
                                                onClick={() => setIsCalendarOpen(false)}
                                            />

                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="absolute right-0 top-full z-[70] mt-3 w-72 overflow-hidden rounded-3xl bg-white p-4.5 text-slate-900 shadow-2xl ring-1 ring-slate-200"
                                            >
                                                {/* Calendar Header */}
                                                <div className="mb-4 flex items-center justify-between">
                                                    <h4 className="text-lg font-bold tracking-tight text-slate-900">
                                                        {viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                                                    </h4>
                                                    <div className="flex items-center gap-1.5">
                                                        <button
                                                            onClick={() => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() - 1)))}
                                                            className="rounded-full p-1 hover:bg-slate-100 transition-colors text-slate-600"
                                                        >
                                                            <ChevronLeft className="h-4.5 w-4.5" />
                                                        </button>
                                                        <div className="h-1 w-1 rounded-full bg-slate-200"></div>
                                                        <button
                                                            onClick={() => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() + 1)))}
                                                            className="rounded-full p-1 hover:bg-slate-100 transition-colors text-slate-600"
                                                        >
                                                            <ChevronRight className="h-4.5 w-4.5" />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Weekday Headers */}
                                                <div className="mb-1.5 grid grid-cols-7 text-center">
                                                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                                                        <span key={i} className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{day}</span>
                                                    ))}
                                                </div>

                                                {/* Days Grid */}
                                                <div className="grid grid-cols-7 gap-y-0.5">
                                                    {Array.from({ length: new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay() }).map((_, i) => (
                                                        <div key={`empty-${i}`} />
                                                    ))}
                                                    {Array.from({ length: new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate() }).map((_, i) => {
                                                        const day = i + 1;
                                                        const dateStr = `${viewDate.getFullYear()}-${String(viewDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                                        const isSelected = filterDate === dateStr;
                                                        const isToday = new Date().toISOString().split('T')[0] === dateStr;

                                                        return (
                                                            <button
                                                                key={day}
                                                                onClick={() => {
                                                                    setFilterDate(dateStr);
                                                                    setIsCalendarOpen(false);
                                                                }}
                                                                className={`relative flex h-8 w-8 items-center justify-center text-xs font-bold transition-all duration-200
                                                                    ${isSelected ? "text-white z-10" : "text-slate-700 hover:bg-slate-100 rounded-lg"}
                                                                `}
                                                            >
                                                                {isSelected && (
                                                                    <motion.div
                                                                        layoutId="highlight"
                                                                        className="absolute inset-0 rounded-xl bg-emerald-600 shadow-md shadow-emerald-100"
                                                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                                                    />
                                                                )}
                                                                <span className="relative z-10">{day}</span>
                                                                {isToday && !isSelected && (
                                                                    <div className="absolute bottom-1 h-0.5 w-0.5 rounded-full bg-emerald-500" />
                                                                )}
                                                            </button>
                                                        );
                                                    })}
                                                </div>

                                                {/* Footer Stats? Optional - let's keep it clean */}
                                                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                                                    <button
                                                        onClick={() => { setFilterDate(""); setIsCalendarOpen(false); }}
                                                        className="text-[9px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
                                                    >
                                                        Clear Filter
                                                    </button>
                                                    <div className="flex items-center gap-1.5">
                                                        <div className="h-1 w-1 rounded-full bg-emerald-500" />
                                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Today</span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    {/* Events List */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: {
                                    staggerChildren: 0.1
                                }
                            }
                        }}
                        className="flex flex-col gap-6"
                    >
                        {filteredEvents.length === 0 ? (
                            <motion.div
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0 }
                                }}
                                className="rounded-3xl bg-white p-16 text-center shadow-sm ring-1 ring-slate-100"
                            >
                                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50">
                                    <Calendar className="h-8 w-8 text-slate-300" />
                                </div>
                                <h3 className="text-xl font-semibold text-slate-900">No events found</h3>
                                <p className="mt-2 text-slate-500">We couldn't find any events matching your criteria.</p>
                                <button
                                    onClick={() => { setFilterStatus("all"); setFilterDate(""); }}
                                    className="mt-6 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
                                >
                                    Clear all filters
                                </button>
                            </motion.div>
                        ) : (
                            filteredEvents.map((event) => {
                                const { day, month, time } = formatDisplayDate(event);
                                const isNearCapacity = event.capacity ? (event.registrationsCount / event.capacity) > 0.8 : false;
                                const spotsLeft = event.capacity ? event.capacity - event.registrationsCount : null;
                                const isFull = spotsLeft !== null && spotsLeft <= 0;

                                return (
                                    <motion.div
                                        key={event.id}
                                        variants={{
                                            hidden: { opacity: 0, y: 20 },
                                            visible: { opacity: 1, y: 0 }
                                        }}
                                        transition={{ duration: 0.4, ease: "easeOut" }}
                                    >
                                        <Link href={`/events/${event.slug}`} className="block group">
                                            <div className="relative overflow-hidden rounded-3xl bg-white p-2 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-emerald-900/5 ring-1 ring-slate-100 hover:ring-emerald-500/30">
                                                <div className="flex flex-col md:flex-row gap-6">

                                                    {/* Left Content */}
                                                    <div className="flex-1 p-6 md:pr-2 flex flex-col justify-between min-h-[220px]">
                                                        {/* Header: Status & Time */}
                                                        <div className="flex items-start justify-between mb-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex flex-col items-center justify-center rounded-xl bg-slate-50 border border-slate-100 px-3 py-1.5 min-w-[60px]">
                                                                    <span className="text-xs font-bold uppercase text-slate-400">{month}</span>
                                                                    <span className="text-xl font-bold text-slate-900">{day}</span>
                                                                </div>
                                                                <div className="h-8 w-[1px] bg-slate-200"></div>
                                                                <span className="text-sm font-medium text-slate-600 flex items-center gap-1.5">
                                                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                                                    {time}
                                                                </span>
                                                            </div>

                                                            {/* Badges */}
                                                            <div className="flex flex-wrap gap-2 justify-end">
                                                                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${event.status === "ONGOING"
                                                                    ? "bg-emerald-100 text-emerald-800"
                                                                    : "bg-blue-100 text-blue-800"
                                                                    }`}>
                                                                    {event.status === "ONGOING" ? "Live Now" : "Upcoming"}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Title & Desc */}
                                                        <div>
                                                            <h3 className="font-serif text-2xl font-bold text-slate-900 group-hover:text-emerald-800 transition-colors mb-2">
                                                                {event.title}
                                                            </h3>
                                                            <p className="text-slate-600 text-sm line-clamp-2 max-w-xl">
                                                                {event.description}
                                                            </p>
                                                        </div>

                                                        {/* Footer: Metadata & Registration Info */}
                                                        <div className="mt-6 border-t border-slate-100 pt-5">
                                                            <div className="flex flex-row items-center justify-between gap-x-2">
                                                                {/* Location - Enlarged and Prioritized */}
                                                                <div className="flex flex-col gap-1.5 flex-[1.6] min-w-0">
                                                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Location</span>
                                                                    <div className="flex items-center gap-2 grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all overflow-hidden">
                                                                        {event.mode === "ONLINE" ? <Video className="h-4 w-4 text-emerald-600 shrink-0" /> : <MapPin className="h-4 w-4 text-emerald-600 shrink-0" />}
                                                                        <span className="font-bold text-slate-800 text-sm truncate">{event.mode === "ONLINE" ? "Online Stream" : event.location || "TBA"}</span>
                                                                    </div>
                                                                </div>

                                                                {/* Entry Fee */}
                                                                <div className="flex flex-col gap-1.5 sm:border-l sm:border-slate-100 sm:pl-6 flex-1">
                                                                    <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Entry Fee</span>
                                                                    <div className="flex items-center gap-1">
                                                                        <span className={`text-sm font-bold ${event.price === 0 ? "text-emerald-600" : "text-slate-900"}`}>
                                                                            {event.price === 0 ? "FREE" : `₹${event.price}`}
                                                                        </span>
                                                                        {event.price > 0 && <span className="text-[9px] font-bold text-slate-400">/ person</span>}
                                                                    </div>
                                                                </div>

                                                                {/* Total Seats */}
                                                                <div className="flex flex-col gap-1.5 sm:border-l sm:border-slate-100 sm:pl-6 flex-1 min-w-[125px]">
                                                                    <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Total Seats</span>
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="flex flex-col">
                                                                            <div className="flex items-baseline gap-0.5">
                                                                                <span className={`text-sm font-black ${isFull ? "text-red-600" : isNearCapacity ? "text-amber-600" : "text-slate-900"}`}>
                                                                                    {event.capacity || "∞"}
                                                                                </span>
                                                                                <span className="text-slate-400 font-bold text-[8px] uppercase tracking-tighter leading-none">Seats</span>
                                                                            </div>
                                                                        </div>

                                                                        <div className="flex flex-col justify-center border-l border-slate-100 pl-3">
                                                                            <span className={`text-[9px] font-bold uppercase tracking-widest leading-none ${isFull ? "text-red-500" : isNearCapacity ? "text-amber-500" : "text-emerald-500"}`}>
                                                                                {isFull ? "SOLD OUT" : isNearCapacity ? "HURRY!" : "OPEN"}
                                                                            </span>
                                                                            <span className="text-[8px] font-semibold text-slate-400 uppercase tracking-tighter leading-none mt-0.5">
                                                                                {isFull ? "FULLY BOOKED" : isNearCapacity ? "NEAR CAPACITY" : "AVAILABLE"}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Right Image */}
                                                    <div className="relative aspect-video w-full md:w-[460px] shrink-0 md:rounded-2xl overflow-hidden bg-slate-100 self-center mr-1">
                                                        {event.imageUrl ? (
                                                            <img
                                                                src={event.imageUrl}
                                                                alt={event.title}
                                                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-300">
                                                                <Calendar className="h-12 w-12" />
                                                            </div>
                                                        )}

                                                        {/* Action Overlay on Desktop */}
                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                                            <span className="rounded-full bg-emerald-100 px-5 py-2.5 text-sm font-bold text-emerald-900 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                                                View Event
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                );
                            })
                        )}
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
