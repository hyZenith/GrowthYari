import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin-auth"

export async function POST(req: Request) {
  try {
    // 🔒 Protect route
    requireAdmin()

    const body = await req.json()

    const event = await prisma.event.create({
      data: {
        title: body.title,
        slug: body.slug,
        description: body.description,

        mode: body.mode,
        status: "UPCOMING",

        meetingUrl: body.meetingUrl ?? null,
        location: body.location ?? null,

        date: new Date(body.date),
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),

        capacity: body.capacity ?? null,
        includeGst: body.includeGst ?? false,
      },
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    if (error.message === "FORBIDDEN") {
      return NextResponse.json(
        { message: "Forbidden" },
        { status: 403 }
      )
    }

    console.error("ADMIN_EVENT_ERROR:", error)
    return NextResponse.json(
      { message: "Failed to create event" },
      { status: 500 }
    )
  }
}
