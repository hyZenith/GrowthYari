import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getUser } from "@/lib/user-auth";
import { EventRegistration } from "@/components/events/EventRegistration";
import { Calendar, MapPin, Video, Clock } from "lucide-react";
import { EventMap } from "@/components/events/EventMap";

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const event = await prisma.event.findUnique({
    where: { slug },
    include: { tickets: true },
  });

  if (!event) {
    notFound();
  }

  // Auth & Registration Check
  const userPayload = await getUser();

  let userId: string | null = null;
  let userDetails: { name: string; email: string; phone: string } | null = null;

  if (userPayload) {
    try {
      userId = userPayload.userId;

      // Fetch user details for Razorpay prefill
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, email: true, phone: true }
      });

      if (user) {
        userDetails = {
          name: user.name,
          email: user.email,
          phone: user.phone || ""
        };
      }

    } catch (e) {
      // invalid token
    }
  }

  const isLoggedIn = !!userId;

  let isRegistered = false;
  if (userId) {
    const registration = await prisma.eventRegistration.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId: event.id
        }
      }
    });
    // Check if not cancelled AND payment is complete (or event is free)
    // For paid events, paymentStatus must be COMPLETED
    // For free events, just checking status === ACTIVE is enough
    if (registration && registration.status === "ACTIVE") {
      if (event.isFree) {
        isRegistered = true;
      } else {
        // Paid event - must have completed payment
        isRegistered = registration.paymentStatus === "COMPLETED";
      }
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <main className="mx-auto max-w-6xl px-4 py-12">

        {/* Main Two-Column Layout: Image Left, Details Right */}
        <div className="grid gap-10 lg:grid-cols-2">

          {/* Left Column - Event Image & Registration */}
          <div className="flex flex-col space-y-6">
            {event.imageUrl && (
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm">
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-auto object-contain"
                />
              </div>
            )}

            {/* Registration Card (Moved to Left Column) */}
            <div className="rounded-xl bg-white p-5 shadow-sm border border-slate-200 w-full">
              <h3 className="text-base font-semibold text-slate-900 mb-3">Registration</h3>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Price</span>
                  <span className="font-medium text-slate-900">
                    {event.isFree ? "Free" : "Price varies by ticket"}
                  </span>
                </div>
                {event.capacity && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Capacity</span>
                    <span className="font-medium text-slate-900">{event.capacity} seats</span>
                  </div>
                )}

                <hr className="border-slate-100" />

                <EventRegistration
                  eventId={event.id}
                  isRegistered={isRegistered}
                  isLoggedIn={isLoggedIn}
                  userDetails={userDetails}
                  tickets={event.tickets || []}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Event Details */}
          <div className="flex flex-col space-y-6">
            {/* Status Badge */}
            <div className="flex items-center gap-4">
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${event.status === 'ONGOING' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                }`}>
                {event.status}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900">{event.title}</h1>

            {/* Event Meta Info */}
            <div className="flex flex-wrap gap-4 text-sm text-slate-500 border-b border-slate-200 pb-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-slate-400" />
                {new Date(event.date).toLocaleDateString(undefined, {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-slate-400" />
                {new Date(event.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Hosted by</span>
                <span className="font-semibold text-slate-700">{event.hostedBy || "GrowthYari"}</span>
              </div>
              <div className="flex items-center gap-2">
                {event.mode === "ONLINE" ? <Video className="h-5 w-5 text-slate-400" /> : <MapPin className="h-5 w-5 text-slate-400" />}
                {event.mode === "ONLINE" ? "Online Event" : event.location || "Location TBD"}
              </div>
            </div>

            {/* Categories */}
            {event.categories && event.categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {event.categories.map((category) => (
                  <span
                    key={category}
                    className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10"
                  >
                    {category}
                  </span>
                ))}
              </div>
            )}

            {/* About Section */}
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-3">About the Event</h2>
              <div className="prose prose-slate max-w-none whitespace-pre-wrap text-slate-600 text-sm leading-relaxed">
                {event.description}
              </div>
            </div>

            {/* Location Map (for Offline Events) */}
            {event.mode === "OFFLINE" && event.location && (
              <div className="pt-4 border-t border-slate-100">
                <EventMap location={event.location} />
              </div>
            )}

            {/* Online Meeting Link (if registered) */}
            {event.mode === "ONLINE" && isRegistered && event.meetingUrl && (
              <div className="rounded-lg bg-blue-50 p-4 text-blue-800">
                <p className="font-semibold">Join the meeting:</p>
                <a href={event.meetingUrl} className="underline break-all hover:text-blue-600">{event.meetingUrl}</a>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}
