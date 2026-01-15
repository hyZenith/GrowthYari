"use server";

import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/user-auth";
import { revalidatePath } from "next/cache";
import { sendEventRegistrationEmail } from "@/lib/emails";

export async function registerForEvent(eventId: string, ticketId?: string | null) {
  // ...
  // (Assuming context lines match lines 8+)
  

  // 1. Get User ID from cookie (mock auth or real auth)
  // For now, assuming you have a way to get the user, or we parse the 'token'
  // If no auth, return error.
  
  const userPayload = await getUser();

  if (!userPayload) {
    return { error: "Unauthorized", status: 401 };
  }
  const userId = userPayload.userId;

  // Verify user exists in DB to prevent foreign key errors (stale session)
  const userExists = await prisma.user.findUnique({ 
    where: { id: userId },
    select: { id: true, email: true, name: true }
  });
  if (!userExists) {
      return { error: "Invalid session or user not found. Please log in again.", status: 401 };
  }

  try {
     const event = await prisma.event.findUnique({
        where: { id: eventId },
        include: {
            _count: {
                select: { registrations: { where: { status: "ACTIVE" } } }
            }
        }
     });

     if (!event) return { error: "Event not found", status: 404 };

     if (!event.isFree && !ticketId) {
         // Should we block? If it's strictly paid, we need payment? 
         // But this action handles direct registration for free events.
         // If it's paid, we expect them to go through payment flow separately?
         // Or this action generates the pending registration?
         // Actually, this action is usually simpler. 
         // Original code: if (event.price > 0) return error.
         // New code: if (!event.isFree) return error (go pay first).
        return { error: "This is a paid event. Please complete payment to register.", status: 402 };
     }

     if (event.capacity && event._count.registrations >= event.capacity) {
         return { error: "Event is fully booked", status: 400 };
     }

     const existing = await prisma.eventRegistration.findUnique({
        where: {
            userId_eventId: {
                userId,
                eventId
            }
        }
     });

     if (existing) {
         if (existing.status === "CANCELLED") {
             // Re-register if cancelled - Check capacity again? Yes, already done above.
             await prisma.eventRegistration.update({
                 where: { id: existing.id },
                 data: { status: "ACTIVE" }
             });
             revalidatePath(`/events`);
             revalidatePath(`/events/${event.slug}`);
             return { message: "Welcome back! You have successfully re-registered.", success: true };
         }
         return { message: "Already registered", success: true };
     }

     // SECURITY: If ticketId provided, verify it belongs to this event
     if (ticketId) {
         const ticket = await prisma.ticket.findUnique({
             where: { id: ticketId },
             select: { eventId: true, price: true }
         });
         
         if (!ticket || ticket.eventId !== eventId) {
             return { error: "Invalid ticket for this event", status: 400 };
         }
         
         // For free event registration, ticket price should be 0
         if (ticket.price > 0) {
             return { error: "This ticket requires payment", status: 402 };
         }
     }

     const newRegistration = await prisma.eventRegistration.create({
         data: {
             userId,
             eventId,
             status: "ACTIVE",
             ticketId: ticketId || null
         }
     });

     // Send Email
     if (userExists.email) {
       await sendEventRegistrationEmail({
         email: userExists.email,
         name: userExists.name || "User",
         eventTitle: event.title,
         eventDate: event.date,
         eventLocation: event.location || "Online",
         ticketId: newRegistration.id
       });
     }
     
     revalidatePath(`/events`); // Revalidate lists
     revalidatePath(`/events/${event.slug}`); 
     
     return { message: "Thank you Registering for This event", success: true };

  } catch (e) {
      console.error(e);
      return { error: "Registration failed", status: 500 };
  }
}

export async function cancelRegistration(eventId: string) {
  const userPayload = await getUser();

  if (!userPayload) return { error: "Unauthorized", status: 401 };
  const userId = userPayload.userId;

  try {
      // Find existing registration
      const existing = await prisma.eventRegistration.findUnique({
          where: { userId_eventId: { userId, eventId } }
      });

      if (!existing || existing.status === "CANCELLED") {
          return { message: "Not registered or already cancelled", success: false };
      }

      await prisma.eventRegistration.update({
          where: { id: existing.id },
          data: { status: "CANCELLED" }
      });

      const event = await prisma.event.findUnique({
          where: { id: eventId },
          select: { slug: true }
      });

      revalidatePath(`/events`);
      if (event?.slug) {
         revalidatePath(`/events/${event.slug}`);
      }

      return { message: "Registration cancelled. Seat vacated.", success: true };

  } catch (e) {
      console.error(e);
      return { error: "Cancellation failed", status: 500 };
  }
}
