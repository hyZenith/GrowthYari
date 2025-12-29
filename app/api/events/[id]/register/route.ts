import { NextResponse } from "next/server";
import { getUser } from "@/lib/user-auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id: eventId } = await context.params;

  const userPayload = await getUser();

  if (!userPayload) {
    return NextResponse.json(
      { error: "UNAUTHENTICATED" },
      { status: 401 }
    );
  }

  /**
   * IMPORTANT:
   * We must NEVER create a duplicate row.
   * We either:
   * - reactivate an existing registration
   * - or create it once
   */

  const existing = await prisma.eventRegistration.findUnique({
    where: {
      userId_eventId: {
        userId: userPayload.userId,
        eventId,
      },
    },
  });

  // Case 1: Already ACTIVE → do nothing (idempotent)
  if (existing && existing.status === "ACTIVE") {
    return NextResponse.json({ success: true });
  }

  // Case 2: Exists but CANCELLED → reactivate
  if (existing && existing.status === "CANCELLED") {
    await prisma.eventRegistration.update({
      where: { id: existing.id },
      data: { status: "ACTIVE" },
    });

    return NextResponse.json({ success: true });
  }

  // Case 3: Does not exist → create once
  await prisma.eventRegistration.create({
    data: {
      userId: userPayload.userId,
      eventId,
      status: "ACTIVE",
    },
  });

  return NextResponse.json({ success: true });
}
