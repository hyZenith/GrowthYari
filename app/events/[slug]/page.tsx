import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getUser } from "@/lib/user-auth";
import { Header } from "@/components/header"; // Assuming header is reusable
import { EventRegistration } from "@/components/events/EventRegistration";
import { Calendar, MapPin, Video, Clock } from "lucide-react";

export default async function EventDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;

  const event = await prisma.event.findUnique({
    where: { slug },
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
    // Check if not cancelled
    isRegistered = !!registration && registration.status === "ACTIVE";
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-12">

        {/* Breadcrumb / Status */}
        <div className="mb-6 flex items-center gap-4">
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${event.status === 'ONGOING' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
            }`}>
            {event.status}
          </span>
        </div>

        {event.imageUrl && (
          <div className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm">
            <div className="relative aspect-video w-full">
              <img
                src={event.imageUrl}
                alt={event.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </div>
        )}

        <h1 className="text-4xl font-bold text-slate-900">{event.title}</h1>

        <div className="mt-6 flex flex-wrap gap-6 text-sm text-slate-500 border-b border-slate-200 pb-8">
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
            {event.mode === "ONLINE" ? <Video className="h-5 w-5 text-slate-400" /> : <MapPin className="h-5 w-5 text-slate-400" />}
            {event.mode === "ONLINE" ? "Online Event" : event.location || "Location TBD"}
          </div>
        </div>

        <div className="mt-8 grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">About the Event</h2>
              <div className="prose prose-slate max-w-none whitespace-pre-wrap text-slate-600">
                {event.description}
              </div>
            </div>

            {event.mode === "ONLINE" && isRegistered && event.meetingUrl && (
              <div className="rounded-lg bg-blue-50 p-4 text-blue-800">
                <p className="font-semibold">Join the meeting:</p>
                <a href={event.meetingUrl} className="underline break-all hover:text-blue-600">{event.meetingUrl}</a>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Registration</h3>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Price</span>
                  <span className="font-medium text-slate-900">
                    {event.price > 0 ? `₹${event.price}` : "Free"}
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
                  price={event.price}
                  userDetails={userDetails}
                />
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
