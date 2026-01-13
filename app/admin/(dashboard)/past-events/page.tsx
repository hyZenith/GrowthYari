import { prisma } from "@/lib/prisma";
import { MapPin, Video, Users, UserX, Calendar, Image as ImageIcon, Ticket, Eye } from "lucide-react";
import Link from "next/link";

export default async function PastEventsPage() {
    const now = new Date();

    // Fetch past events - events where end date (or date) has passed
    const pastEvents = await prisma.event.findMany({
        where: {
            OR: [
                { endDate: { lt: now } },
                { endDate: null, date: { lt: now } },
            ],
        },
        orderBy: { date: "desc" },
        include: {
            tickets: true,
            registrations: {
                include: {
                    user: {
                        select: { id: true, name: true, email: true },
                    },
                    ticket: {
                        select: { id: true, title: true, price: true },
                    },
                },
                orderBy: { createdAt: "desc" },
            },
            _count: {
                select: { registrations: true },
            },
        },
    });

    return (
        <div className="space-y-6 md:space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-xl md:text-2xl font-bold text-slate-900">Past Events</h1>
                <p className="text-sm md:text-base text-slate-500">View completed events and their registration history.</p>
            </div>

            {pastEvents.length === 0 ? (
                <div className="rounded-lg border border-slate-200 bg-white p-8 md:p-12 text-center">
                    <Calendar className="mx-auto h-10 w-10 md:h-12 md:w-12 text-slate-300" />
                    <h3 className="mt-3 md:mt-4 text-base md:text-lg font-medium text-slate-900">No past events</h3>
                    <p className="mt-1 md:mt-2 text-xs md:text-sm text-slate-500">Events will appear here once their date has passed.</p>
                </div>
            ) : (
                <div className="space-y-4 md:space-y-6">
                    {pastEvents.map((event) => {
                        const activeRegistrations = event.registrations.filter(r => r.status === "ACTIVE");
                        const cancelledRegistrations = event.registrations.filter(r => r.status === "CANCELLED");

                        return (
                            <div key={event.id} className="rounded-lg md:rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                                {/* Event Header with Image */}
                                <div className="flex flex-col md:flex-row">
                                    {/* Event Image */}
                                    {event.imageUrl ? (
                                        <div className="relative h-40 w-full md:h-auto md:w-48 lg:w-64 flex-shrink-0 overflow-hidden">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={event.imageUrl}
                                                alt={event.title}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex h-40 w-full md:h-auto md:w-48 lg:w-64 flex-shrink-0 items-center justify-center bg-slate-100">
                                            <ImageIcon className="h-10 w-10 md:h-12 md:w-12 text-slate-300" />
                                        </div>
                                    )}

                                    {/* Event Details */}
                                    <div className="flex-1 p-4 md:p-6">
                                        <div className="flex flex-col gap-3 md:gap-4">
                                            <div className="flex-1">
                                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                                                        PAST
                                                    </span>
                                                    <span className="flex items-center gap-1 text-xs text-slate-500">
                                                        {event.mode === "ONLINE" ? <Video className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}
                                                        {event.mode}
                                                    </span>
                                                </div>
                                                <h2 className="text-lg md:text-xl font-semibold text-slate-900">{event.title}</h2>
                                                <p className="mt-1 md:mt-2 text-xs md:text-sm text-slate-600 line-clamp-2">{event.description}</p>

                                                <div className="mt-3 md:mt-4 flex flex-wrap gap-3 md:gap-4 text-xs md:text-sm text-slate-500">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-3.5 w-3.5 md:h-4 md:w-4" />
                                                        <span className="hidden sm:inline">
                                                            {new Date(event.date).toLocaleDateString('en-US', {
                                                                weekday: 'short',
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric',
                                                            })}
                                                        </span>
                                                        <span className="sm:hidden">
                                                            {new Date(event.date).toLocaleDateString('en-US', {
                                                                month: 'short',
                                                                day: 'numeric',
                                                                year: 'numeric',
                                                            })}
                                                        </span>
                                                    </span>
                                                    {event.location && (
                                                        <span className="flex items-center gap-1">
                                                            <MapPin className="h-3.5 w-3.5 md:h-4 md:w-4" />
                                                            <span className="truncate max-w-[200px]">{event.location}</span>
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <Link
                                                href={`/admin/events/${event.id}`}
                                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-100 px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors"
                                            >
                                                <Eye className="h-3.5 w-3.5 md:h-4 md:w-4" />
                                                View Details
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                {/* Stats Bar */}
                                <div className="border-t border-slate-100 bg-slate-50 px-4 py-3 md:px-6 md:py-4">
                                    <div className="flex flex-wrap gap-3 md:gap-6 text-xs md:text-sm">
                                        {/* Tickets */}
                                        <div className="flex items-center gap-1.5 md:gap-2">
                                            <Ticket className="h-3.5 w-3.5 md:h-4 md:w-4 text-slate-400" />
                                            <span className="text-slate-600">
                                                <strong>{event.tickets.length}</strong> Ticket{event.tickets.length !== 1 ? 's' : ''}
                                                {event.isFree && <span className="ml-1 text-emerald-600">(Free)</span>}
                                            </span>
                                        </div>

                                        {/* Active Registrations */}
                                        <div className="flex items-center gap-1.5 md:gap-2">
                                            <Users className="h-3.5 w-3.5 md:h-4 md:w-4 text-emerald-500" />
                                            <span className="text-slate-600">
                                                <strong className="text-emerald-600">{activeRegistrations.length}</strong> Active
                                            </span>
                                        </div>

                                        {/* Cancelled Registrations */}
                                        <div className="flex items-center gap-1.5 md:gap-2">
                                            <UserX className="h-3.5 w-3.5 md:h-4 md:w-4 text-red-400" />
                                            <span className="text-slate-600">
                                                <strong className="text-red-500">{cancelledRegistrations.length}</strong> Cancelled
                                            </span>
                                        </div>

                                        {/* Capacity */}
                                        {event.capacity && (
                                            <div className="text-slate-500">
                                                Capacity: {activeRegistrations.length}/{event.capacity}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Expandable Registrations Section */}
                                {(activeRegistrations.length > 0 || cancelledRegistrations.length > 0) && (
                                    <details className="group">
                                        <summary className="cursor-pointer border-t border-slate-100 px-6 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 list-none flex items-center justify-between">
                                            <span>View Registrations ({event.registrations.length})</span>
                                            <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                                        </summary>
                                        <div className="border-t border-slate-100 px-6 py-4 bg-white">
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                {/* Active Registrations */}
                                                <div>
                                                    <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                                                        <Users className="h-4 w-4 text-emerald-500" />
                                                        Active Registrations ({activeRegistrations.length})
                                                    </h4>
                                                    {activeRegistrations.length === 0 ? (
                                                        <p className="text-sm text-slate-400">No active registrations</p>
                                                    ) : (
                                                        <ul className="space-y-2 max-h-60 overflow-y-auto">
                                                            {activeRegistrations.map((reg) => (
                                                                <li key={reg.id} className="flex items-center justify-between rounded-lg bg-emerald-50 p-3">
                                                                    <div className="min-w-0 flex-1">
                                                                        <p className="text-sm font-medium text-slate-900 truncate">{reg.user.name}</p>
                                                                        <p className="text-xs text-slate-500 truncate">{reg.user.email}</p>
                                                                    </div>
                                                                    {reg.ticket && (
                                                                        <span className="ml-2 text-xs bg-white px-2 py-1 rounded text-slate-600">
                                                                            {reg.ticket.title}
                                                                        </span>
                                                                    )}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>

                                                {/* Cancelled Registrations */}
                                                <div>
                                                    <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                                                        <UserX className="h-4 w-4 text-red-400" />
                                                        Cancelled Registrations ({cancelledRegistrations.length})
                                                    </h4>
                                                    {cancelledRegistrations.length === 0 ? (
                                                        <p className="text-sm text-slate-400">No cancelled registrations</p>
                                                    ) : (
                                                        <ul className="space-y-2 max-h-60 overflow-y-auto">
                                                            {cancelledRegistrations.map((reg) => (
                                                                <li key={reg.id} className="flex items-center justify-between rounded-lg bg-red-50 p-3">
                                                                    <div className="min-w-0 flex-1">
                                                                        <p className="text-sm font-medium text-slate-500 truncate">{reg.user.name}</p>
                                                                        <p className="text-xs text-slate-400 truncate">{reg.user.email}</p>
                                                                    </div>
                                                                    {reg.ticket && (
                                                                        <span className="ml-2 text-xs bg-white px-2 py-1 rounded text-slate-400">
                                                                            {reg.ticket.title}
                                                                        </span>
                                                                    )}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Ticket Info */}
                                            {event.tickets.length > 0 && (
                                                <div className="mt-6 pt-4 border-t border-slate-100">
                                                    <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                                                        <Ticket className="h-4 w-4 text-slate-400" />
                                                        Ticket Types
                                                    </h4>
                                                    <div className="flex flex-wrap gap-3">
                                                        {event.tickets.map((ticket) => (
                                                            <div key={ticket.id} className="rounded-lg border border-slate-200 px-4 py-2 bg-white">
                                                                <p className="text-sm font-medium text-slate-900">{ticket.title}</p>
                                                                <p className="text-xs text-slate-500">
                                                                    {ticket.price === 0 ? "Free" : `₹${ticket.price}`}
                                                                </p>
                                                                {ticket.description && (
                                                                    <p className="text-xs text-slate-400 mt-1">{ticket.description}</p>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </details>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
