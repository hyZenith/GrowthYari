import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/user-auth";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { auth } from "@/lib/auth";

export async function PUT(req: Request) {
  try {
    const { name, phone } = await req.json();

    // 1. Get User ID from custom JWT or NextAuth
    const cookieStore = await cookies();
    const token = cookieStore.get("user_token")?.value;
    let userId: string | null = null;

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
        userId = decoded.userId;
      } catch (err) {
        // Token invalid
      }
    }

    if (!userId) {
      const session = await auth();
      if (session?.user?.email) {
        const user = await prisma.user.findUnique({
          where: { email: session.user.email },
          select: { id: true },
        });
        userId = user?.id || null;
      }
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Update User
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, phone },
      select: { id: true, name: true, email: true, phone: true },
    });

    return NextResponse.json({ success: true, user: updatedUser });

  } catch (error) {
    console.error("Profile Update API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
