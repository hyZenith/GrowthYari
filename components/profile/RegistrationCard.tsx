"use client";

import { useRef, useState } from "react";
import { cancelRegistration } from "@/app/actions/events";
import { MapPin, Video, Calendar, Clock, Ticket, ExternalLink, Download } from "lucide-react";
import Link from "next/link";
import { TicketDesign } from "@/components/events/TicketDesign";
import { generateTicketPDF } from "@/lib/ticket-generator";

export function RegistrationCard({ registration, userName }: { registration: any, userName?: string }) {
    const [status, setStatus] = useState(registration.status);
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);
    const ticketRef = useRef<HTMLDivElement>(null);

    async function handleCancel() {
        if (!confirm("Are you sure? This will free up your seat.")) return;
        setLoading(true);
        const res = await cancelRegistration(registration.event.id);
        setLoading(false);
        if (res.success) {
            setStatus("CANCELLED");
        } else {
            alert(res.error || res.message);
        }
    }

    const event = registration.event;
    const isOnline = event.mode === "ONLINE";

    // Check if payment is required and completed
    // For paid events, ONLY paymentStatus === "COMPLETED" should be considered as paid
    // Note: amountPaid is set when order is created (before payment), not when payment completes
    const isPaid = event.isFree || registration.paymentStatus === "COMPLETED";
    const isActive = status === 'ACTIVE' && isPaid;

    // Dummy ticket logic (using ID)
    const ticketId = registration.id.split('-')[0].toUpperCase();

    return (
        <div className={`rounded-xl border p-5 transition-all ${status === 'CANCELLED' ? 'bg-slate-50 border-slate-200 opacity-75' : 'bg-white border-slate-200 shadow-sm hover:shadow-md'}`}>
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${isActive
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                            }`}>
                            {status}
                        </span>
                        <span className="text-xs text-slate-400 capitalize">{event.status.toLowerCase().replace('_', ' ')}</span>
                        {isActive && (
                            <span className="text-xs text-slate-400 font-mono">#{ticketId}</span>
                        )}
                    </div>

                    <Link href={`/events/${event.slug}`} className="text-lg font-bold text-slate-900 hover:text-emerald-700 transition-colors">
                        {event.title}
                    </Link>

                    <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-500">
                        <div className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4 text-slate-400" />
                            {new Date(event.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4 text-slate-400" />
                            {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="flex items-center gap-1.5">
                            {isOnline ? <Video className="h-4 w-4 text-slate-400" /> : <MapPin className="h-4 w-4 text-slate-400" />}
                            {isOnline ? "Online" : event.location || "Offline"}
                        </div>
                    </div>

                    {/* Ticket / Link Section */}
                    {isActive && (
                        <div className="mt-4 flex gap-3">
                            {isOnline && event.meetingUrl ? (
                                <a
                                    href={event.meetingUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
                                >
                                    <Video className="h-4 w-4" />
                                    Join Meeting
                                </a>
                            ) : (
                                <button
                                    onClick={async () => {
                                        if (ticketRef.current) {
                                            setGenerating(true);
                                            await generateTicketPDF(ticketRef.current, `ticket-${ticketId}.pdf`);
                                            setGenerating(false);
                                        }
                                    }}
                                    disabled={generating}
                                    className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:underline disabled:opacity-50"
                                >
                                    {generating ? (
                                        <>Generating...</>
                                    ) : (
                                        <>
                                            <Ticket className="h-4 w-4" />
                                            View Ticket
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Hidden Ticket Design for PDF Generation */}
                <TicketDesign
                    ref={ticketRef}
                    event={event}
                    attendeeName={userName || registration.user?.name || "Guest"}
                    ticketId={ticketId}
                />

                <div className="flex items-center gap-3">
                    <Link
                        href={`/events/${event.slug}`}
                        className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-emerald-600 transition-colors"
                    >
                        View
                    </Link>
                    {isActive && (
                        <button
                            onClick={handleCancel}
                            disabled={loading}
                            className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 disabled:opacity-50 transition-colors"
                        >
                            {loading ? "..." : "Cancel"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
