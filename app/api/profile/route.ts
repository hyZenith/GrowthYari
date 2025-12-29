import { NextResponse } from "next/server";
import { getUser } from "@/lib/user-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const userPayload = await getUser();

  if (!userPayload) {
    return NextResponse.json(
      { error: "UNAUTHENTICATED" },
      { status: 401 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: userPayload.userId },
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
