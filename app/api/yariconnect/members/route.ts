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
    // Get JWT token from cookies (user_token or admin_token)
    const cookieStore = await cookies();
    const userToken = cookieStore.get("user_token")?.value;
    const adminToken = cookieStore.get("admin_token")?.value;
    const token = userToken || adminToken;

    console.log("YariConnect /members request - has user_token:", !!userToken, "has admin_token:", !!adminToken);

    if (!token) {
      console.error("YariConnect /members - No token found in cookies");
      return NextResponse.json(
        { error: "Unauthorized - No authentication token found. Please log in again." },
        { status: 401 }
      );
    }

    // Verify token
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      console.error("JWT_SECRET not configured");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    let userId: string;
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      userId = decoded.userId;
      console.log("YariConnect /members - Token verified for user:", userId);
    } catch (error) {
      console.error("YariConnect /members - Token verification failed:", error);
      return NextResponse.json(
        { error: "Unauthorized - Invalid or expired token. Please log in again." },
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
