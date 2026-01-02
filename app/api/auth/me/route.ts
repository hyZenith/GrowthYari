
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("user_token")?.value

    // 1. Check Custom JWT (Email/Password login)
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

        const user = await prisma.user.findUnique({
          where: { id: decoded.userId },
          select: { id: true, name: true, email: true, role: true, phone: true, googleId: true, linkedinId: true, image: true },
        });

        if (user) {
          return NextResponse.json({ authenticated: true, user });
        }
      } catch (err) {
        // Token invalid, continue to check NextAuth
      }
    }

    // 2. Check NextAuth Session (Google login)
    const session = await auth();
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true, name: true, email: true, role: true, phone: true, googleId: true, linkedinId: true, image: true },
      });

      if (user) {
        return NextResponse.json({ authenticated: true, user });
      }
    }

    return NextResponse.json({ authenticated: false }, { status: 401 });

  } catch (error) {
    console.error("Auth Check Error:", error);
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
