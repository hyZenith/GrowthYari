import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

interface JwtPayload {
  userId: string;
}

export async function POST(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id: eventId } = await context.params;

  const cookieStore = await cookies();
  const token = cookieStore.get("user_token")?.value;

  if (!token) {
    return NextResponse.json(
      { error: "UNAUTHENTICATED" },
      { status: 401 }
    );
  }

  let payload: JwtPayload;
  try {
    payload = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload;
  } catch {
    return NextResponse.json(
      { error: "INVALID_TOKEN" },
      { status: 401 }
    );
  }

  const registration =
    await prisma.eventRegistration.findFirst({
      where: {
        userId: payload.userId,
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
