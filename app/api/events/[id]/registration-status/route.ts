import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

interface JwtPayload {
  userId: string;
}

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id: eventId } = await context.params;

  const cookieStore = await cookies();
  const token = cookieStore.get("user_token")?.value;

  if (!token) {
    return NextResponse.json({ registered: false });
  }

  let payload: JwtPayload;
  try {
    payload = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload;
  } catch {
    return NextResponse.json({ registered: false });
  }

  const registration =
    await prisma.eventRegistration.findFirst({
      where: {
        userId: payload.userId,
        eventId,
        status: "ACTIVE",
      },
    });

  return NextResponse.json({
    registered: Boolean(registration),
  });
}
