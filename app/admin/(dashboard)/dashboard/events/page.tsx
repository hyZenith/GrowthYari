import { EventTable } from "./EventTable"

async function getEvents() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/events`,
    { cache: "no-store" }
  )

  if (!res.ok) {
    throw new Error("Failed to fetch events")
  }

  return res.json()
}

export default async function AdminEventsPage() {
  const events = await getEvents()

  return (
    <div>
      <h1>Events</h1>
      <EventTable events={events} />
    </div>
  )
}
