"use client"

import { useRouter } from "next/navigation"

export function EventTable({ events }: { events: any[] }) {
  const router = useRouter()

  async function cancelEvent(id: string) {
    await fetch(`/api/admin/events/${id}`, {
      method: "PATCH",
    })
    router.refresh()
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Status</th>
          <th>Mode</th>
          <th>Date</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {events.map((event) => (
          <tr key={event.id}>
            <td>{event.title}</td>
            <td>{event.status}</td>
            <td>{event.mode}</td>
            <td>
              {event.startDate
                ? new Date(event.startDate).toLocaleDateString()
                : new Date(event.date).toLocaleDateString()}
            </td>
            <td>
              <button
                onClick={() => cancelEvent(event.id)}
                disabled={event.status === "CANCELLED"}
              >
                Cancel
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
