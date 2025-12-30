"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase-client";
import { createClient } from "@supabase/supabase-js";


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
  revalidatePath("/events");
  redirect("/admin/events");
}

export async function updateEvent(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const dateStr = formData.get("date") as string;
  const mode = formData.get("mode") as "ONLINE" | "OFFLINE";
  const location = formData.get("location") as string;
  const meetingUrl = formData.get("meetingUrl") as string;
  const capacityStr = formData.get("capacity") as string;
  const status = formData.get("status") as "SCHEDULED" | "ONGOING" | "UPCOMING" | "CANCELLED";
  const priceStr = formData.get("price") as string;

  if (!title || !description || !dateStr || !mode) {
    throw new Error("Missing required fields");
  }

  const date = new Date(dateStr);
  const capacity = capacityStr ? parseInt(capacityStr) : null;
  const price = priceStr ? parseFloat(priceStr) : 0;
  
  // Basic slug generation (only if title changed)
  const currentEvent = await prisma.event.findUnique({ where: { id } });
  if (!currentEvent) throw new Error("Event not found");

  let slug = currentEvent.slug;
  if (title !== currentEvent.title) {
    slug = title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
    const existing = await prisma.event.findFirst({ where: { slug, id: { not: id } } });
    if (existing) {
        slug = `${slug}-${Date.now()}`;
    }
  }

  await prisma.event.update({
    where: { id },
    data: {
      title,
      slug,
      description,
      date,
      mode,
      price,
      imageUrl: formData.get("imageUrl") as string || null,
      status: status || "SCHEDULED",
      location: mode === "OFFLINE" ? location : null,
      meetingUrl: mode === "ONLINE" ? meetingUrl : null,
      capacity,
    },
  });

  revalidatePath("/admin/events");
  revalidatePath(`/admin/events/${id}`);
  revalidatePath("/events");
  revalidatePath(`/events/${slug}`);
  redirect("/admin/events");
}


export async function deleteEvent(id: string) {
  try {
    const event = await prisma.event.findUnique({
      where: { id },
      select: { imageUrl: true },
    });

    if (event?.imageUrl) {
      // Use Service Role Key if available for admin privileges (bypasses RLS)
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      
      let storageClient = supabase;

      if (supabaseUrl && serviceRoleKey) {
        storageClient = createClient(supabaseUrl, serviceRoleKey);
      }

      // Extract file path from URL
      const urlParts = event.imageUrl.split("/events/");
      if (urlParts.length > 1) {
        const filePath = urlParts[1]; // Should be "folder/filename" or just "filename" inside the bucket
        
        console.log(`[deleteEvent] Attempting to delete image: ${filePath}`);

        if (filePath) {
            const { error: storageError } = await storageClient.storage.from("events").remove([filePath]);
            if (storageError) {
                 console.error("[deleteEvent] Failed to delete image from Supabase:", storageError);
            } else {
                 console.log("[deleteEvent] Image deleted successfully");
            }
        }
      } else {
          console.warn("[deleteEvent] Could not parse file path from URL:", event.imageUrl);
      }
    }

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
