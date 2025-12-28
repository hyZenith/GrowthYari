"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const cookieStore = await cookies();
  const token = cookieStore.get("user_token")?.value;

  if (!token) {
    return { error: "Unauthorized", status: 401 };
  }

  let userId: string;
  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
      userId = decoded.userId;
  } catch (err) {
      return { error: "Invalid session", status: 401 };
  }

  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;

  if (!name) {
      return { error: "Name is required", success: false };
  }

  try {
      await prisma.user.update({
          where: { id: userId },
          data: {
              name,
              phone
          }
      });

      revalidatePath("/profile");
      return { message: "Profile updated successfully.", success: true };

  } catch (e) {
      console.error(e);
      return { error: "Failed to update profile", success: false };
  }
}
