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

  const hostedBy = formData.get("hostedBy") as string || "GrowthYari";
  
  let categories: string[] = [];
  const categoriesJson = formData.get("categories") as string;
  if (categoriesJson) {
      try {
          categories = JSON.parse(categoriesJson);
      } catch (e) {
          console.error("Failed to parse categories:", e);
      }
  }

  let tickets: any[] = [];
  const ticketsJson = formData.get("tickets") as string;
  if (ticketsJson) {
      try {
          tickets = JSON.parse(ticketsJson);
      } catch (e) {
          console.error("Failed to parse tickets:", e);
      }
  }

  if (!title || !description || !dateStr || !mode) {
    throw new Error("Missing required fields");
  }

  const date = new Date(dateStr);
  const capacity = capacityStr ? parseInt(capacityStr) : null;
  
  // Set isFree based on tickets array. If tickets exist, it's NOT free.
  // Actually the form should pass isFree explicitly or we deduce:
  // We can trust the form to send "isFree" boolean? Or just check tickets logic?
  // Let's deduce: If tickets array is empty, it MUST be free? 
  // User wants "Paid or Free" option. 
  // Let's accept "isFree" from formData for clarity.
  const isFreeStr = formData.get("isFree") as string;
  const isFree = isFreeStr === "true";

  if (!isFree && tickets.length === 0) {
      throw new Error("Paid events must have at least one ticket type.");
  }

  const includeGstStr = formData.get("includeGst") as string;
  const includeGst = includeGstStr === "true";

  // Basic slug generation
  let slug = title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
  // Ensure uniqueness
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
      isFree,
      includeGst,
      categories,
      hostedBy,
      tickets: {
        create: tickets.map((t: any) => ({
          title: t.title,
          description: t.description,
          price: parseFloat(t.price),
        })),
      },
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

  const hostedBy = formData.get("hostedBy") as string || "GrowthYari";

  let categories: string[] = [];
  const categoriesJson = formData.get("categories") as string;
  if (categoriesJson) {
      try {
          categories = JSON.parse(categoriesJson);
      } catch (e) {
          console.error("Failed to parse categories:", e);
      }
  }

  if (!title || !description || !dateStr || !mode) {
    throw new Error("Missing required fields");
  }

  const date = new Date(dateStr);
  const capacity = capacityStr ? parseInt(capacityStr) : null;

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

  // Determine isFree
  const isFreeStr = formData.get("isFree") as string;
  const isFree = isFreeStr === "true";

  const includeGstStr = formData.get("includeGst") as string;
  const includeGst = includeGstStr === "true";

  let tickets: any[] = [];
  const ticketsJson = formData.get("tickets") as string;
  if (ticketsJson) {
      try {
          tickets = JSON.parse(ticketsJson);
      } catch (e) {
          console.error("Failed to parse tickets:", e);
      }
  }

  // Validate Paid Events
  if (!isFree && tickets.length === 0) {
      throw new Error("Paid events must have at least one ticket type.");
  }


  // Transaction to handle tickets sync
  await prisma.$transaction(async (tx) => {
      // 1. Update basic event details
      await tx.event.update({
          where: { id },
          data: {
              title,
              slug,
              description,
              date,
              mode,
              isFree,
              includeGst,
              categories,
              hostedBy,
              imageUrl: formData.get("imageUrl") as string || null,
              status: status || "SCHEDULED",
              location: mode === "OFFLINE" ? location : null,
              meetingUrl: mode === "ONLINE" ? meetingUrl : null,
              capacity,
          },
      });

      // 2. Handle Tickets
      if (isFree) {
          // If event is now free, delete all tickets? 
          // Safer to delete them since free events shouldn't have priced tickets.
          // Check for registrations first? For simplicity in this iteration: delete tickets.
          // Note: If registrations exist, this might fail if RESTRICT is on.
          // If we want to keep registrations, we might need to soft-delete or keep tickets but ignore them.
          // Let's attempt deleteMany.
           await tx.ticket.deleteMany({
              where: { eventId: id }
           });
      } else {
          // Paid Event: Sync tickets
          
          // Get IDs of tickets coming from form
          const incomingTicketIds = tickets.map((t: any) => t.id).filter(Boolean);
          
          // Delete tickets not in the incoming list (removed by user)
          await tx.ticket.deleteMany({
              where: {
                  eventId: id,
                  id: { notIn: incomingTicketIds }
              }
          });

          // Upsert tickets
          for (const t of tickets) {
              if (t.id) {
                  // Update existing
                  await tx.ticket.update({
                      where: { id: t.id },
                      data: {
                          title: t.title,
                          description: t.description,
                          price: parseFloat(t.price),
                      }
                  });
              } else {
                  // Create new
                  await tx.ticket.create({
                      data: {
                          title: t.title,
                          description: t.description,
                          price: parseFloat(t.price),
                          eventId: id,
                      }
                  });
              }
          }
      }
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
