import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  const event = await prisma.event.findFirst({
    where: {
      slug: params.slug,
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
