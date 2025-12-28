"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


export async function createEvent(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const dateStr = formData.get("date") as string;
  const mode = formData.get("mode") as "ONLINE" | "OFFLINE";
  const location = formData.get("location") as string;
  const meetingUrl = formData.get("meetingUrl") as string;
  const capacityStr = formData.get("capacity") as string;
  const status = formData.get("status") as "SCHEDULED" | "ONGOING" | "UPCOMING" | "CANCELLED";
  const priceStr = formData.get("price") as string; // Added priceStr extraction

  if (!title || !description || !dateStr || !mode) {
    throw new Error("Missing required fields");
  }

  const date = new Date(dateStr);
  const capacity = capacityStr ? parseInt(capacityStr) : null;
  const price = priceStr ? parseFloat(priceStr) : 0; // Added price parsing
  
  // Basic slug generation
  let slug = title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
  // Ensure uniqueness (simple check, for production might want a loop or UUID fallback)
  const existing = await prisma.event.findUnique({ where: { slug } });
  if (existing) {
      slug = `${slug}-${Date.now()}`;
  }

  await prisma.event.create({
    data: {
      title,
      slug,
      description,
      date,
      mode,
      price, // Added price to data
      imageUrl: formData.get("imageUrl") as string || null,
      status: status || "SCHEDULED",
      location: mode === "OFFLINE" ? location : null,
      meetingUrl: mode === "ONLINE" ? meetingUrl : null,
      capacity,
    },
  });

  revalidatePath("/admin/events");
  redirect("/admin/events");
}

export async function deleteEvent(id: string) {
  try {
    // Delete registrations first if cascading isn't set up, but Prisma usually handles it or throws.
    // Ideally use onCascade: delete in schema, but for safety lets try explicit delete.
    // Actually, schema relation allows cascade usually or we can just try delete event.
    // Let's assume standard cascading or simple deletion for now.
    
    // Deleting the event. If there are foreign key constraints without cascade, this might fail.
    // But standard Prisma relation definition usually defaults or User can assume Cascade behavior if configured.
    // Looking at schema: registrations EventRegistration[]
    // If we need to delete registrations manually:
    await prisma.eventRegistration.deleteMany({
      where: { eventId: id }
    });

    await prisma.event.delete({
      where: { id },
    });

    revalidatePath("/admin/events");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete event:", error);
    return { success: false, error: "Failed to delete event" };
  }
}
