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

  const registration =
    await prisma.eventRegistration.findFirst({
      where: {
        userId: userPayload.userId,
        eventId,
        status: "ACTIVE",
      },
    });

  if (!registration) {
    return NextResponse.json({ success: true });
  }

  await prisma.eventRegistration.update({
    where: { id: registration.id },
    data: { status: "CANCELLED" },
  });

  return NextResponse.json({ success: true });
}
