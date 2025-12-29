import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Plus, MapPin, Video, User } from "lucide-react";
import { DeleteEventButton } from "@/components/admin/DeleteEventButton";


export default async function EventsPage() {
    const events = await prisma.event.findMany({
        orderBy: { date: "desc" },
        include: {
            _count: {
                select: {
                    registrations: {
                        where: { status: "ACTIVE" }
                    }
                },
            },
        },
    });

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Events</h1>
                    <p className="text-slate-500">Manage your events and registrations.</p>
                </div>
                <Link
                    href="/admin/events/create"
                    className="flex items-center gap-2 rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    Add Event
                </Link>
            </div>

            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-500">
                        <thead className="bg-slate-50 text-xs uppercase text-slate-700">
                            <tr>
                                <th scope="col" className="px-6 py-3 font-semibold">Title</th>
                                <th scope="col" className="px-6 py-3 font-semibold">Date & Time</th>
                                <th scope="col" className="px-6 py-3 font-semibold">Mode</th>
                                <th scope="col" className="px-6 py-3 font-semibold">Status</th>
                                <th scope="col" className="px-6 py-3 font-semibold">Registrants</th>
                                <th scope="col" className="px-6 py-3 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 border-t border-slate-200">
                            {events.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                        No events found. Click "Add Event" to create one.
                                    </td>
                                </tr>
                            ) : (
                                events.map((event) => (
                                    <tr key={event.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-4 font-medium text-slate-900">
                                            {event.title}
                                        </td>
                                        <td className="px-6 py-4">
                                            {new Date(event.date).toLocaleDateString('en-US', {
                                                weekday: 'short',
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: 'numeric',
                                                minute: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="flex items-center gap-1.5">
                                                {event.mode === "ONLINE" ? (
                                                    <>
                                                        <Video className="h-3.5 w-3.5" />
                                                        Online
                                                    </>
                                                ) : (
                                                    <>
                                                        <MapPin className="h-3.5 w-3.5" />
                                                        Offline
                                                    </>
                                                )}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${event.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-800' :
                                                event.status === 'ONGOING' ? 'bg-green-100 text-green-800' :
                                                    event.status === 'UPCOMING' ? 'bg-purple-100 text-purple-800' :
                                                        'bg-red-100 text-red-800'
                                                }`}>
                                                {event.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="flex items-center gap-1">
                                                <User className="h-3.5 w-3.5" />
                                                {event._count.registrations}
                                                {event.capacity ? ` / ${event.capacity}` : ''}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <Link
                                                    href={`/admin/events/${event.id}`}
                                                    className="font-medium text-slate-600 hover:text-slate-900"
                                                >
                                                    View
                                                </Link>
                                                <Link
                                                    href={`/admin/events/${event.id}/edit`}
                                                    className="font-medium text-emerald-600 hover:text-emerald-500"
                                                >
                                                    Edit
                                                </Link>
                                                <DeleteEventButton eventId={event.id} eventTitle={event.title} />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
