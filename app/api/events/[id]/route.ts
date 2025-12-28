import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  _req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params
  const event = await prisma.event.findFirst({
    where: {
      slug: params.id,
      status: {
        in: ["UPCOMING", "ONGOING"],
      },
    },
  })

  if (!event) {
    return NextResponse.json(
      { error: "Event not found" },
      { status: 404 }
    )
  }

  return NextResponse.json(event, {
    headers: {
      "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
    },
  })
}
