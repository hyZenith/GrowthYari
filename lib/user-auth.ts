import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: string;
  role: "USER" | "ADMIN";
}

export async function requireUser() {
    const cookieStore = await cookies();
  const token = cookieStore.get("user_token")?.value;

  if (!token) {
    throw new Error("UNAUTHENTICATED");
  }

  const payload = jwt.verify(
    token,
    process.env.JWT_SECRET!
  ) as JwtPayload;

  if (payload.role !== "USER") {
    throw new Error("FORBIDDEN");
  }

  return payload;
}
