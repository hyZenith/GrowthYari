import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { getIceServers } from "@/lib/turn-credentials";

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
      } catch (error) {
        console.warn("YariConnect /ice-servers - Header token verification failed:", error);
      }
    }

    // 2. Fallback to Cookie
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
        } catch (error) {
          console.error("YariConnect /ice-servers - Cookie token verification failed:", error);
        }
      }
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const iceServers = getIceServers(userId);
    return NextResponse.json({ iceServers });

  } catch (error) {
    console.error("Error fetching ICE servers:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
