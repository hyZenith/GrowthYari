import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/user-auth";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { auth } from "@/lib/auth";

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { name, username, phone, bio, location, headline, linkedinUrl, websiteUrl, twitterUrl, networkingAvailable, industry, experienceLevel, interests, skills } = body;

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

    // Validate Username if provided
    if (username) {
      if (username.length < 3) {
        return NextResponse.json({ error: "Username must be at least 3 characters long" }, { status: 400 });
      }
      const usernameRegex = /^[a-zA-Z0-9_-]+$/;
      if (!usernameRegex.test(username)) {
        return NextResponse.json({ error: "Username can only contain letters, numbers, underscores, and dashes." }, { status: 400 });
      }

      // Check uniqueness
      const existingUser = await prisma.user.findUnique({
        where: { username }
      });
      if (existingUser && existingUser.id !== userId) {
        return NextResponse.json({ error: "Username is already taken." }, { status: 400 });
      }
    }

    // 2. Update User
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        username,
        phone,
        bio,
        location,
        headline,
        linkedinUrl,
        websiteUrl,
        twitterUrl,
        networkingAvailable,
        industry,
        experienceLevel,
        interests,
        skills
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        phone: true,
        bio: true,
        location: true,
        headline: true,
        linkedinUrl: true,
        websiteUrl: true,
        twitterUrl: true,
        networkingAvailable: true,
        industry: true,
        experienceLevel: true,
        interests: true,
        skills: true
      },
    });

    return NextResponse.json({ success: true, user: updatedUser });

  } catch (error) {
    console.error("Profile Update API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
