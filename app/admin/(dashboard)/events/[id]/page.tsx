import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { MapPin, Video, Calendar, Users, Globe, Edit } from "lucide-react";
import Link from "next/link";

export default async function EventDetailsPage({ params }: { params: { id: string } }) {
    const { id } = await params;

    const event = await prisma.event.findUnique({
        where: { id },
        include: {
            registrations: {
                include: {
                    user: true,
                },
                orderBy: { createdAt: "desc" },
            },
            _count: {
                select: { registrations: true },
            },
        },
    });

    if (!event) {
        notFound();
    }


    const activeRegistrations = event.registrations.filter(r => r.status === "ACTIVE");
    const cancelledRegistrations = event.registrations.filter(r => r.status === "CANCELLED");

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">{event.title}</h1>
                    <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-500">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${event.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-800' :
                            event.status === 'ONGOING' ? 'bg-green-100 text-green-800' :
                                event.status === 'UPCOMING' ? 'bg-purple-100 text-purple-800' :
                                    'bg-red-100 text-red-800'
                            }`}>
                            {event.status}
                        </span>
                        <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(event.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                            {event.mode === "ONLINE" ? <Video className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
                            {event.mode}
                        </span>
                        {event.capacity && (
                            <span className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                Max {event.capacity}
                            </span>
                        )}
                    </div>
                </div>

                <Link
                    href={`/admin/events/${id}/edit`}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 md:w-auto"
                >
                    <Edit className="h-4 w-4" />
                    Edit Event
                </Link>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Description</h2>
                        <div className="prose prose-sm max-w-none text-slate-600 space-y-2 whitespace-pre-wrap">
                            {event.description}
                        </div>
                    </div>

                    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Location & Access</h2>
                        <div className="space-y-4">
                            {event.mode === "ONLINE" && (
                                <div>
                                    <span className="block text-xs font-medium uppercase text-slate-500">Meeting URL</span>
                                    {event.meetingUrl ? (
                                        <a href={event.meetingUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline break-all">
                                            {event.meetingUrl}
                                        </a>
                                    ) : (
                                        <span className="text-slate-400">Not provided</span>
                                    )}
                                </div>
                            )}
                            {event.mode === "OFFLINE" && (
                                <div>
                                    <span className="block text-xs font-medium uppercase text-slate-500">Address</span>
                                    <span className="text-slate-900">{event.location || "Not provided"}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar / Registrations */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Active Registrations */}
                    <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
                        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
                            <h3 className="font-semibold text-slate-900">Active Registrations ({activeRegistrations.length})</h3>
                        </div>
                        <div className="max-h-[300px] overflow-y-auto p-0">
                            {activeRegistrations.length === 0 ? (
                                <div className="p-4 text-center text-sm text-slate-500">
                                    No active registrations.
                                </div>
                            ) : (
                                <ul className="divide-y divide-slate-100">
                                    {activeRegistrations.map((reg) => (
                                        <li key={reg.id} className="flex items-center justify-between p-4 hover:bg-slate-50">
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium text-slate-900">{reg.user.name}</p>
                                                <p className="truncate text-xs text-slate-500">{reg.user.email}</p>
                                            </div>
                                            <span className="ml-2 inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                                                ACTIVE
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    {/* Cancelled Registrations */}
                    {cancelledRegistrations.length > 0 && (
                        <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden opacity-75">
                            <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
                                <h3 className="font-semibold text-slate-700">Cancelled ({cancelledRegistrations.length})</h3>
                            </div>
                            <div className="max-h-[200px] overflow-y-auto p-0">
                                <ul className="divide-y divide-slate-100">
                                    {cancelledRegistrations.map((reg) => (
                                        <li key={reg.id} className="flex items-center justify-between p-4 hover:bg-slate-50">
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium text-slate-500">{reg.user.name}</p>
                                                <p className="truncate text-xs text-slate-400">{reg.user.email}</p>
                                            </div>
                                            <span className="ml-2 inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">
                                                CANCELLED
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
