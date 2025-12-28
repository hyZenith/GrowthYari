"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function EventForm({ initialData }: { initialData?: any }) {
  const [title, setTitle] = useState(initialData?.title ?? "")
  const [description, setDescription] = useState(
    initialData?.description ?? ""
  )
  const [mode, setMode] = useState(initialData?.mode ?? "ONLINE")
  const [meetingUrl, setMeetingUrl] = useState(
    initialData?.meetingUrl ?? ""
  )
  const [location, setLocation] = useState(
    initialData?.location ?? ""
  )

  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    await fetch("/api/admin/events", {
      method: initialData ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        mode,
        meetingUrl,
        location,
      }),
    })

    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <select
        value={mode}
        onChange={(e) => setMode(e.target.value)}
      >
        <option value="ONLINE">Online</option>
        <option value="OFFLINE">Offline</option>
      </select>

      {mode === "ONLINE" && (
        <input
          placeholder="Meeting URL"
          value={meetingUrl}
          onChange={(e) => setMeetingUrl(e.target.value)}
          required
        />
      )}

      {mode === "OFFLINE" && (
        <input
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
      )}

      <button type="submit">
        {initialData ? "Update Event" : "Create Event"}
      </button>
    </form>
  )
}
