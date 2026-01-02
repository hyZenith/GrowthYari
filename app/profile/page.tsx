import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/user-auth";
import { ProfileActions } from "@/components/profile/ProfileActions";
import { ProfilePictureUpload } from "@/components/profile/ProfilePictureUpload";
import { Calendar, MapPin, Video, User as UserIcon, Clock, Mail } from "lucide-react";
import Link from "next/link";
import { RegistrationCard } from "@/components/profile/RegistrationCard";

export default async function ProfilePage() {
  const userPayload = await getUser();

  if (!userPayload) {
    redirect("/auth/login");
  }

  const userId = userPayload.userId;

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
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">

      {/* Banner Section */}
      <div className="relative h-48 w-full overflow-hidden bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 sm:h-64">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]"></div>
        {/* Abstract shapes or pattern could go here */}
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl"></div>
        <div className="absolute top-0 left-0 h-full w-full bg-[url('/images/grid.svg')] opacity-10"></div>
      </div>

      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

        {/* Profile Header Block */}
        <div className="relative -mt-16 sm:-mt-20 mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:gap-6">

          {/* Profile Picture */}
          <div className="shrink-0">
            <ProfilePictureUpload
              currentImage={user.image}
              name={user.name}
              size="xl"
            />
          </div>

          {/* User Info */}
          <div className="flex-1 pt-2 sm:pb-2">
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{user.name}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600">
              <div className="flex items-center gap-1">
                <Mail className="h-4 w-4 text-slate-400" />
                {user.email}
              </div>
              <div className="flex items-center gap-1 text-slate-500">
                <Clock className="h-4 w-4 text-slate-400" />
                Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mb-4 sm:mb-2">
            <ProfileActions user={{
              name: user.name,
              email: user.email,
              phone: user.phone,
              bio: user.bio
            }} />
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid gap-8 lg:grid-cols-3">

          {/* Left Column: Bio & Stats */}
          <div className="space-y-6 lg:col-span-1">

            {/* Bio Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">About</h3>
              {user.bio ? (
                <p className="text-slate-700 leading-relaxed whitespace-pre-line">{user.bio}</p>
              ) : (
                <div className="text-center py-6 text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                  <p className="text-sm">No bio added yet.</p>
                </div>
              )}

              <div className="mt-6 space-y-3 pt-6 border-t border-slate-100">
                <div>
                  <label className="text-xs font-semibold text-slate-400">PHONE</label>
                  <p className="text-sm font-medium text-slate-900">{user.phone || "Not provided"}</p>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">Activity</h3>
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-600">{user.registrations.length}</p>
                  <p className="text-xs font-medium text-slate-500">Events Joined</p>
                </div>
                {/* Can add more stats here later */}
              </div>
            </div>

          </div>

          {/* Right Column: Registrations */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Registered Events</h2>
              <Link href="/events" className="text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:underline">
                Browse Events →
              </Link>
            </div>

            {user.registrations.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 py-16 text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                  <Calendar className="h-6 w-6 text-slate-400" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">No events yet</h3>
                <p className="mt-1 text-sm text-slate-500 max-w-xs">Looks like you haven't registered for any events. Check out what's coming up!</p>
                <Link href="/events" className="mt-6 rounded-full bg-emerald-600 px-6 py-2 text-sm font-medium text-white hover:bg-emerald-700">
                  Explore Events
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {user.registrations.map(reg => (
                  <RegistrationCard key={reg.id} registration={reg} userName={user.name} />
                ))}
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
