import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

/**
 * GET /api/yariconnect/members
 * 
 * Fetches all users who have networkingAvailable = true
 * Returns full profile data for display on /yariconnect page
 * 
 * Authentication: Required (JWT from cookies)
 */
export async function GET(request: NextRequest) {
  try {
    // 1. Try Authorization Header (Realtime Token)
    const authHeader = request.headers.get("Authorization");
    const headerToken = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;
    const REALTIME_SECRET = process.env.REALTIME_SECRET || "super-secret-key_CHANGE_ME";

    let userId: string | null = null;

    if (headerToken) {
      try {
        const decoded = jwt.verify(headerToken, REALTIME_SECRET) as { id: string };
        userId = decoded.id; // Realtime token uses 'id' instead of 'userId'
        console.log("YariConnect /members - Header token verified for user:", userId);
      } catch (error) {
        console.warn("YariConnect /members - Header token verification failed:", error);
      }
    }

    // 2. Fallback to Cookie (Legacy/Admin Flow)
    if (!userId) {
      const cookieStore = await cookies();
      const userToken = cookieStore.get("user_token")?.value;
      const adminToken = cookieStore.get("admin_token")?.value;
      const token = userToken || adminToken;
      const JWT_SECRET = process.env.JWT_SECRET;

      if (token && JWT_SECRET) {
        try {
          const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
          userId = decoded.userId;
          console.log("YariConnect /members - Cookie token verified for user:", userId);
        } catch (error) {
          console.error("YariConnect /members - Cookie token verification failed:", error);
        }
      }
    }

    if (!userId) {
      console.error("YariConnect /members - No valid authentication found (Header or Cookie)");
      return NextResponse.json(
        { error: "Unauthorized - Please log in to access this resource." },
        { status: 401 }
      );
    }

    // Fetch all YariConnect members (networkingAvailable = true)
    const members = await prisma.user.findMany({
      where: {
        networkingAvailable: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        location: true,
        headline: true,
        industry: true,
        experienceLevel: true,
        interests: true,
        skills: true,
        // Exclude sensitive fields (password, googleId, linkedinId)
      },
      orderBy: {
        name: "asc",
      },
    });

    console.log(`YariConnect /members - Found ${members.length} members with networkingAvailable=true`);

    // Filter out the current user from the results
    const filteredMembers = members.filter(member => member.id !== userId);

    console.log(`YariConnect /members - Returning ${filteredMembers.length} members (excluded current user)`);

    return NextResponse.json({
      members: filteredMembers,
      count: filteredMembers.length,
    });

  } catch (error) {
    console.error("Error fetching YariConnect members:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
