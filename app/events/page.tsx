import { prisma } from "@/lib/prisma";
import { EventsView, Event } from "@/components/events/EventsView";

// Force dynamic because we might have ongoing/upcoming status changes based on time,
// or new events added.
export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const eventsData = await prisma.event.findMany({
    where: {
      status: {
        in: ["UPCOMING", "ONGOING"],
      },
    },
    orderBy: {
      startDate: "asc",
      // fallback to date if startDate is null? Prisma sorts by the field.
      // If mixed, might need custom sort or just sort by 'date' which is always present?
      // Schema says date is DateTime, startDate is String? 
      // Let's check schema/types from previous files. 
      // In route.ts: orderBy: { startDate: "asc" }. So let's stick to that.
      // But wait, schema might have `date` as the main field. 
      // In route.ts it was `orderBy: { startDate: "asc" }` in Step 164.
    },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      mode: true,
      status: true,
      date: true,
      startDate: true,
      endDate: true,
      meetingUrl: true,
      location: true,
      imageUrl: true,
    },
  });

  // Transform data to Serialized Event type (Dates to strings)
  const events: Event[] = eventsData.map((ev) => ({
    ...ev,
    status: ev.status as Event["status"],
    date: ev.date.toISOString(),
    startDate: ev.startDate ? new Date(ev.startDate).toISOString() : null,
    endDate: ev.endDate ? new Date(ev.endDate).toISOString() : null,
  }));

  return <EventsView initialEvents={events} />;
}
