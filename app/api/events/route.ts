import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const events = await prisma.event.findMany({
    where: {
      status: {
        in: ["UPCOMING", "ONGOING"],
      },
    },
    orderBy: {
      startDate: "asc",
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
  })

  return NextResponse.json(events, {
    headers: {
      "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
    },
  })
}
