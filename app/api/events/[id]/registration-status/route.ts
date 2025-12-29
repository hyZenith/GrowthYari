import { NextResponse } from "next/server";
import { getUser } from "@/lib/user-auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id: eventId } = await context.params;

  const userPayload = await getUser();

  if (!userPayload) {
    return NextResponse.json({ registered: false });
  }

  const registration =
    await prisma.eventRegistration.findFirst({
      where: {
        userId: userPayload.userId,
        eventId,
        status: "ACTIVE",
      },
    });

  return NextResponse.json({
    registered: Boolean(registration),
  });
}
