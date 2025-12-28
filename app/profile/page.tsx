import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";
import { Header } from "@/components/header";
import { ProfileActions } from "@/components/profile/ProfileActions";
import { Calendar, MapPin, Video, User } from "lucide-react";
import Link from "next/link";
import { cancelRegistration } from "@/app/actions/events"; // We'll need a client wrapper for cancel button if we want interactivity in list

// We need a small client component for the Cancel button in the list to handle "Are you sure?" 
// For now, I'll inline a simple form or reuse the logic. 
// Actually, let's create a Client Component for the Registration Card to handle cancellation state.
import { RegistrationCard } from "@/components/profile/RegistrationCard";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("user_token")?.value;

  if (!token) {
    redirect("/auth/login");
  }

  let userId: string;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    userId = decoded.userId;
  } catch (err) {
    redirect("/auth/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      registrations: {
        include: {
          event: true
        },
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!user) redirect("/auth/login");

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Header />

      <main className="mx-auto max-w-5xl px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-3">

          {/* Left Column: User Profile */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 text-3xl font-bold text-emerald-800 ring-4 ring-white shadow-md">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <h1 className="mt-4 text-xl font-bold text-slate-900">{user.name}</h1>
                <p className="text-sm text-slate-500">{user.email}</p>

                <div className="mt-6 w-full space-y-4 border-t border-slate-100 pt-6 text-left">
                  <div>
                    <label className="text-xs font-semibold uppercase text-slate-500">Phone</label>
                    <p className="text-slate-900">{user.phone || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase text-slate-500">Member Since</label>
                    <p className="text-slate-900">
                      Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="mt-6 w-full">
                  <ProfileActions user={{ name: user.name, email: user.email, phone: user.phone }} />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Registrations */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">My Registrations</h2>

            {user.registrations.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50">
                  <Calendar className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900">No events found</h3>
                <p className="mt-2 text-slate-500">You haven't registered for any events yet.</p>
                <Link href="/events" className="mt-6 inline-block rounded-lg bg-emerald-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 transition-colors">
                  Explore Events
                </Link>
              </div>
            ) : (
              <div className="grid gap-4">
                {user.registrations.map(reg => (
                  <RegistrationCard key={reg.id} registration={reg} />
                ))}
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
