"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Footer } from "@/components/footer";
import { Calendar, MapPin, Video, Users, ChevronLeft, ChevronRight, X, Search, ChevronDown, Check } from "lucide-react";
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from "motion/react";

const VariableProximity = dynamic(
    () => import("@/components/ui/shadcn-io/variable-proximity"),
    { ssr: false }
);

/* ---------- Types ---------- */

type BackendStatus = "UPCOMING" | "ONGOING";

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
    isFree: boolean;
    price?: number; // Optional now, or removed. Let's make it optional for now to avoid breaking too much code if it still comes from somewhere? 
    // Actually schema removed it. So we should remove it here.
    // But we need to update usage below.
    registrationsCount: number;
    hostedBy?: string;
    categories: string[];
}

const PREDEFINED_CATEGORIES = [
    "Entrepreneurship",
    "Product Management",
    "Engineering",
    "Design",
    "Marketing",
    "Community",
    "Leadership"
];

/* ---------- Helpers ---------- */

function formatDisplayDate(event: Event) {
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
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All Categories");
    const [filterDate, setFilterDate] = useState("");

    // UI States
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [viewDate, setViewDate] = useState(new Date());

    const containerRef = useRef(null);
    const categoryDropdownRef = useRef<HTMLDivElement>(null);

    // Close category dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
                setIsCategoryOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    /* Filtering */
    const filteredEvents = useMemo(() => {
        return initialEvents.filter((event) => {
            // Search Filter
            if (searchQuery) {
                const searchLower = searchQuery.toLowerCase().trim();
                const matchesSearch =
                    event.title.toLowerCase().includes(searchLower) ||
                    (event.location && event.location.toLowerCase().includes(searchLower)) ||
                    (event.description && event.description.toLowerCase().includes(searchLower));

                if (!matchesSearch) return false;
            }

            // Category Filter
            if (selectedCategory !== "All Categories") {
                // Ensure categories exist and check for inclusion
                if (!event.categories || !Array.isArray(event.categories) || !event.categories.some(cat => cat === selectedCategory)) {
                    return false;
                }
            }

            // Date Filter
            if (filterDate) {
                // Safely handle date comparison
                const eventDate = new Date(event.startDate ?? event.date);
                // Create local date string YYYY-MM-DD
                const year = eventDate.getFullYear();
                const month = String(eventDate.getMonth() + 1).padStart(2, '0');
                const day = String(eventDate.getDate()).padStart(2, '0');
                const eventDateStr = `${year}-${month}-${day}`;

                if (eventDateStr !== filterDate) return false;
            }

            return true;
        });
    }, [initialEvents, searchQuery, selectedCategory, filterDate]);

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">

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
                {/* Decorative blobs */}
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

                    {/* Filter Bar v2: Search & Categories */}
                    <div className="relative z-[40] mb-8 flex flex-col gap-4 rounded-2xl bg-white/80 p-4 shadow-xl shadow-slate-200/50 backdrop-blur-xl ring-1 ring-slate-200/60 lg:flex-row lg:items-center">

                        {/* Search Bar */}
                        <div className="relative flex-1 group">
                            <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search events, locations..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="h-12 w-full rounded-xl border-2 border-slate-200 bg-white pl-11 pr-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 transition-all"
                            />
                        </div>

                        {/* Filters Group */}
                        <div className="flex flex-col sm:flex-row gap-3 lg:w-auto">

                            {/* Category Dropdown */}
                            <div className="relative min-w-[200px]" ref={categoryDropdownRef}>
                                <button
                                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                                    className="flex h-12 w-full items-center justify-between rounded-xl border border-emerald-100 bg-white px-4 text-sm font-medium text-slate-700 hover:border-emerald-500 hover:bg-emerald-50/50 hover:text-emerald-700 transition-all focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
                                >
                                    <span className="truncate">{selectedCategory}</span>
                                    <ChevronDown className={`ml-2 h-4 w-4 text-emerald-400 transition-transform ${isCategoryOpen ? "rotate-180" : ""}`} />
                                </button>

                                <AnimatePresence>
                                    {isCategoryOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 5, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 5, scale: 0.95 }}
                                            transition={{ duration: 0.1 }}
                                            className="absolute right-0 top-full z-50 mt-2 w-full min-w-[220px] overflow-hidden rounded-xl border border-emerald-100 bg-white p-1 shadow-xl shadow-emerald-900/10 ring-1 ring-emerald-900/5"
                                        >
                                            <button
                                                onClick={() => { setSelectedCategory("All Categories"); setIsCategoryOpen(false); }}
                                                className={`flex w-full items-center rounded-lg px-3 py-2 text-sm transition-colors ${selectedCategory === "All Categories" ? "bg-emerald-50 text-emerald-700 font-medium" : "text-slate-700 hover:bg-emerald-50/50"}`}
                                            >
                                                <span className="flex-1 text-left">All Categories</span>
                                                {selectedCategory === "All Categories" && <Check className="h-3.5 w-3.5 text-emerald-600" />}
                                            </button>
                                            <div className="my-1 border-t border-emerald-50" />
                                            {PREDEFINED_CATEGORIES.map((cat) => (
                                                <button
                                                    key={cat}
                                                    onClick={() => { setSelectedCategory(cat); setIsCategoryOpen(false); }}
                                                    className={`flex w-full items-center rounded-lg px-3 py-2 text-sm transition-colors ${selectedCategory === cat ? "bg-emerald-50 text-emerald-700 font-medium" : "text-slate-700 hover:bg-emerald-50/50"}`}
                                                >
                                                    <span className="flex-1 text-left">{cat}</span>
                                                    {selectedCategory === cat && <Check className="h-3.5 w-3.5 text-emerald-600" />}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Date Picker */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                                    className="flex h-12 w-full items-center gap-2.5 rounded-xl border border-emerald-100 bg-white px-4 text-sm font-medium text-slate-700 hover:border-emerald-500 hover:bg-emerald-50/50 hover:text-emerald-700 transition-all min-w-[160px] focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
                                >
                                    <Calendar className="h-4 w-4 text-emerald-500" />
                                    <span>{filterDate ? new Date(filterDate).toLocaleDateString('default', { month: 'short', day: 'numeric' }) : "Date"}</span>
                                    {filterDate && (
                                        <X
                                            className="ml-auto h-3.5 w-3.5 text-emerald-400 hover:text-red-500"
                                            onClick={(e) => { e.stopPropagation(); setFilterDate(""); }}
                                        />
                                    )}
                                </button>

                                <AnimatePresence mode="wait">
                                    {isCalendarOpen && (
                                        <>
                                            <div className="fixed inset-0 z-[60]" onClick={() => setIsCalendarOpen(false)} />
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="absolute right-0 top-full z-[70] mt-3 w-72 overflow-hidden rounded-3xl bg-white p-4.5 text-slate-900 shadow-2xl ring-1 ring-slate-200"
                                            >
                                                {/* Minimal Calendar Implementation Reuse */}
                                                <div className="mb-4 flex items-center justify-between">
                                                    <h4 className="text-lg font-bold tracking-tight text-slate-900">
                                                        {viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                                                    </h4>
                                                    <div className="flex items-center gap-1.5">
                                                        <button
                                                            onClick={() => {
                                                                const newDate = new Date(viewDate);
                                                                newDate.setMonth(newDate.getMonth() - 1);
                                                                setViewDate(newDate);
                                                            }}
                                                            className="rounded-full p-1 hover:bg-slate-100 transition-colors text-slate-600"
                                                        >
                                                            <ChevronLeft className="h-4.5 w-4.5" />
                                                        </button>
                                                        <div className="h-1 w-1 rounded-full bg-slate-200"></div>
                                                        <button
                                                            onClick={() => {
                                                                const newDate = new Date(viewDate);
                                                                newDate.setMonth(newDate.getMonth() + 1);
                                                                setViewDate(newDate);
                                                            }}
                                                            className="rounded-full p-1 hover:bg-slate-100 transition-colors text-slate-600"
                                                        >
                                                            <ChevronRight className="h-4.5 w-4.5" />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="mb-1.5 grid grid-cols-7 text-center">
                                                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                                                        <span key={i} className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{day}</span>
                                                    ))}
                                                </div>

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
                                                                onClick={() => { setFilterDate(dateStr); setIsCalendarOpen(false); }}
                                                                className={`relative flex h-8 w-8 items-center justify-center text-xs font-bold transition-all duration-200 ${isSelected ? "text-white z-10" : "text-slate-700 hover:bg-slate-100 rounded-lg"}`}
                                                            >
                                                                {isSelected && (
                                                                    <motion.div layoutId="highlight" className="absolute inset-0 rounded-xl bg-emerald-600 shadow-md shadow-emerald-100" />
                                                                )}
                                                                <span className="relative z-10">{day}</span>
                                                                {isToday && !isSelected && <div className="absolute bottom-1 h-0.5 w-0.5 rounded-full bg-emerald-500" />}
                                                            </button>
                                                        );
                                                    })}
                                                </div>

                                                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                                                    <button onClick={() => { setFilterDate(""); setIsCalendarOpen(false); }} className="text-[9px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">Clear</button>
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
                        key={`events-${filteredEvents.length}-${filteredEvents[0]?.id ?? 'empty'}`}
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
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
                                    <Search className="h-8 w-8 text-slate-300" />
                                </div>
                                <h3 className="text-xl font-semibold text-slate-900">No events found</h3>
                                <p className="mt-2 text-slate-500">Try adjusting your search or filters.</p>
                                <button
                                    onClick={() => { setSearchQuery(""); setSelectedCategory("All Categories"); setFilterDate(""); }}
                                    className="mt-6 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
                                >
                                    Reset all filters
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
                                                                {/* Category Badges (Desktop: Show 2, Mobile: Hide) */}
                                                                {event.categories && event.categories.slice(0, 2).map(cat => (
                                                                    <span key={cat} className="hidden sm:inline-flex items-center rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700 ring-1 ring-inset ring-violet-700/10">
                                                                        {cat}
                                                                    </span>
                                                                ))}

                                                                {/* +N More Badge (Desktop: Count > 2, Mobile: Count All) */}
                                                                {event.categories && event.categories.length > 0 && (
                                                                    <>
                                                                        {/* Desktop Overflow */}
                                                                        {event.categories.length > 2 && (
                                                                            <span className="hidden sm:inline-flex relative group/tooltip items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10 cursor-default">
                                                                                +{event.categories.length - 2}
                                                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tooltip:block z-50">
                                                                                    <div className="bg-slate-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
                                                                                        {event.categories.slice(2).join(', ')}
                                                                                    </div>
                                                                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                                                                                </div>
                                                                            </span>
                                                                        )}
                                                                        {/* Mobile Summary (+N) */}
                                                                        <span className="inline-flex sm:hidden items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10">
                                                                            +{event.categories.length}
                                                                        </span>
                                                                    </>
                                                                )}

                                                                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${event.status === "ONGOING"
                                                                    ? "bg-emerald-100 text-emerald-800"
                                                                    : "bg-blue-100 text-blue-800"
                                                                    }`}>
                                                                    {event.status === "ONGOING" ? "Live Now" : "Upcoming"}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Title & Desc */}
                                                        <div className="min-w-0">
                                                            <h3 className="font-serif text-2xl font-bold text-slate-900 group-hover:text-emerald-800 transition-colors mb-2 line-clamp-1">
                                                                {event.title}
                                                            </h3>
                                                            <p className="text-slate-600 text-sm line-clamp-2 max-w-xl overflow-hidden" title={event.description}>
                                                                {event.description && event.description.length > 120 ? event.description.slice(0, 120) + "..." : event.description}
                                                            </p>

                                                            {/* Hosted By Badge */}
                                                            <div className="mt-4 flex items-center">
                                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100/80 px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10">
                                                                    <span className="text-slate-400">by</span>
                                                                    <span className="font-semibold text-slate-900">{event.hostedBy || "GrowthYari"}</span>
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Footer: Metadata & Registration Info */}
                                                        <div className="mt-2 border-t border-slate-100 pt-5">
                                                            <div className="grid grid-cols-2 gap-y-4 gap-x-2 sm:flex sm:flex-row sm:items-center sm:justify-between">
                                                                {/* Location */}
                                                                <div className="col-span-2 sm:col-span-1 flex flex-col gap-1.5 flex-[1.6] min-w-0 max-w-[200px]">
                                                                    <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Location</span>
                                                                    <div className="flex items-center gap-2 grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all min-w-0">
                                                                        {event.mode === "ONLINE" ? <Video className="h-4 w-4 text-emerald-600 shrink-0" /> : <MapPin className="h-4 w-4 text-emerald-600 shrink-0" />}
                                                                        <span className="font-bold text-slate-800 text-sm truncate" title={event.mode === "ONLINE" ? "Online Stream" : event.location || "TBA"}>
                                                                            {event.mode === "ONLINE" ? "Online Stream" : (event.location && event.location.length > 40 ? event.location.slice(0, 40) + "..." : event.location || "TBA")}
                                                                        </span>
                                                                    </div>
                                                                </div>

                                                                {/* Entry Fee */}
                                                                <div className="col-span-1 flex flex-col gap-1.5 sm:border-l sm:border-slate-100 sm:pl-6 flex-1">
                                                                    <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Entry Fee</span>
                                                                    <div className="flex items-center gap-1">
                                                                        <span className={`text-sm font-semibold ${event.isFree ? "text-emerald-600" : "text-slate-900"}`}>
                                                                            {event.isFree ? "FREE" : "Price Varies"}
                                                                        </span>
                                                                        {!event.isFree && <span className="text-[9px] font-bold text-slate-400">/ person</span>}
                                                                    </div>
                                                                </div>

                                                                {/* Total Seats */}
                                                                <div className="col-span-1 flex flex-col gap-1.5 sm:border-l sm:border-slate-100 sm:pl-6 flex-1 min-w-[125px]">
                                                                    <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Total Seats</span>
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="flex flex-col">
                                                                            <div className="flex items-baseline gap-0.5">
                                                                                <span className={`text-sm font-bold ${isFull ? "text-red-600" : isNearCapacity ? "text-amber-600" : "text-slate-900"}`}>
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
                                                            <Image
                                                                src={event.imageUrl}
                                                                alt={event.title}
                                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                                fill
                                                                sizes="(max-width: 768px) 100vw, 50vw"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-300">
                                                                <Calendar className="h-12 w-12" />
                                                            </div>
                                                        )}

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
