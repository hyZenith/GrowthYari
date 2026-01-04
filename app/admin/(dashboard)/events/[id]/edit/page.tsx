import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditEventForm from "./EditEventForm";

export default async function EditEventPage({ params }: { params: { id: string } }) {
    const { id } = await params;

    const event = await prisma.event.findUnique({
        where: { id },
        include: { tickets: true },
    });

    if (!event) {
        notFound();
    }

    // Serialize Dates for client component
    const serializedEvent = {
        ...event,
        date: event.date.toISOString().slice(0, 16), // Format for datetime-local
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Edit Event</h1>
                <p className="text-slate-500">Update details for "{event.title}".</p>
            </div>

            <EditEventForm event={serializedEvent} />
        </div>
    );
}
