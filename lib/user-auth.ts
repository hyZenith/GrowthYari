import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { auth } from "@/lib/auth";

interface UserPayload {
  userId: string;
  role: string;
}

export async function getUser(): Promise<UserPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("user_token")?.value;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; role: string };
      return { userId: decoded.userId, role: decoded.role };
    } catch (e) {
      // ignore
    }
  }

  const session = await auth();
  if (session?.user) {
    return { userId: session.user.id, role: session.user.role };
  }

  return null;
}

export async function requireUser() {
  const user = await getUser();

  if (!user) {
    throw new Error("UNAUTHENTICATED");
  }

  if (user.role !== "USER") {
    throw new Error("FORBIDDEN");
  }

  return user;
}
