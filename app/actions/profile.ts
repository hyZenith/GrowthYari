"use server";

import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/user-auth";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const userPayload = await getUser();

  if (!userPayload) {
    return { error: "Unauthorized", status: 401 };
  }
  const userId = userPayload.userId;

  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const bio = formData.get("bio") as string;

  if (!name) {
      return { error: "Name is required", success: false };
  }

  try {
      await prisma.user.update({
          where: { id: userId },
          data: {
              name,
              phone,
              bio
          }
      });

      revalidatePath("/profile");
      return { message: "Profile updated successfully.", success: true };

  } catch (e) {
      console.error(e);
      return { error: "Failed to update profile", success: false };
  }
}
