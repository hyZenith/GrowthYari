import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { getIceServers } from "@/lib/turn-credentials";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("user_token")?.value || cookieStore.get("admin_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    let userId: string;
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      userId = decoded.userId;
    } catch (e) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const iceServers = getIceServers(userId);
    return NextResponse.json({ iceServers });

  } catch (error) {
    console.error("Error fetching ICE servers:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
