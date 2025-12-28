// admin-auth.ts
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: string;
  role: "ADMIN" | "USER";
}

export async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (!token) throw new Error("Unauthorized");

  const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

  if (payload.role !== "ADMIN") {
    throw new Error("FORBIDDEN");
  }

  return payload;
}
