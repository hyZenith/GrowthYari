"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth"; // Assuming auth export
import { revalidatePath } from "next/cache";

export async function toggleNetworking(available: boolean) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { networkingAvailable: available },
  });

  revalidatePath("/yariconnect");
  return { success: true };
}
