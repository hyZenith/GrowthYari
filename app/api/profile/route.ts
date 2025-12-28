import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

interface JwtPayload {
  userId: string;
}

export async function GET() {
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

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      createdAt: true,
      registrations: {
        where: { status: "ACTIVE" }, // ✅ FIX
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          event: {
            select: {
              id: true,
              title: true,
              slug: true,
              date: true,
              mode: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    return NextResponse.json(
      { error: "USER_NOT_FOUND" },
      { status: 404 }
    );
  }

  return NextResponse.json(user);
}
