import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/user-auth";
import { ProfileActions } from "@/components/profile/ProfileActions";
import { ProfilePictureUpload } from "@/components/profile/ProfilePictureUpload";
import { Calendar, MapPin, Video, User as UserIcon, Clock, Mail, Globe } from "lucide-react";
import Link from "next/link";
import { MotionDiv } from "@/components/ui/MotionWrapper";

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

        {/* Helper to check completion */}
        {(() => {
          // Define fields to track for completion
          const fields = [
            { key: 'image', filled: !!user.image },
            { key: 'bio', filled: !!user.bio },
            { key: 'location', filled: !!user.location },
            { key: 'headline', filled: !!user.headline },
            { key: 'industry', filled: !!user.industry },
            { key: 'experienceLevel', filled: !!user.experienceLevel },
            { key: 'skills', filled: (user.skills && user.skills.length > 0) },
            { key: 'interests', filled: (user.interests && user.interests.length > 0) },
          ];

          const completedCount = fields.filter(f => f.filled).length;
          const totalCount = fields.length;
          const progress = Math.round((completedCount / totalCount) * 100);

          if (progress < 100) {
            return (
              <MotionDiv
                className="fixed bottom-6 right-6 z-50 w-80"
                delay={1}
              >
                <div className="rounded-xl border border-slate-200 bg-white/95 backdrop-blur-sm p-5 shadow-2xl shadow-slate-200/50">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-slate-900">Complete your profile</h3>
                    <span className="text-sm font-bold text-emerald-600">{progress}%</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <p className="mt-3 text-sm text-slate-500 leading-normal">
                    Get better matches by completing your profile details.
                  </p>

                  <Link
                    href="/settings"
                    className="mt-3 block w-full rounded-lg bg-emerald-900 py-2 text-center text-sm font-medium text-white hover:bg-slate-800 transition-colors"
                  >
                    Continue Setup
                  </Link>
                </div>
              </MotionDiv>
            );
          }
          return null;
        })()}

        {/* Profile Header Block */}
        <div className="relative -mt-16 sm:-mt-20 mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:gap-6">
          <MotionDiv delay={0.1} className="shrink-0">
            <ProfilePictureUpload
              currentImage={user.image}
              name={user.name}
              size="xl"
            />
          </MotionDiv>

          <MotionDiv delay={0.2} className="flex-1 pt-2 sm:pb-2">
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{user.name}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600">
              <div className="flex items-center gap-1">
                <Mail className="h-4 w-4 text-slate-400" />
                {user.email}
              </div>
              <div className="flex items-center gap-1 text-slate-500">
                <Clock className="h-4 w-4 text-slate-400" />
                Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </div>
            </div>
          </MotionDiv>

          <MotionDiv delay={0.3} className="mb-4 sm:mb-2 flex items-center">
            <div className="mr-4">
              <ProfileActions user={{
                name: user.name,
                email: user.email,
                phone: user.phone,
                bio: user.bio,
                location: user.location,
                headline: user.headline,
                linkedinUrl: user.linkedinUrl,
                websiteUrl: user.websiteUrl,
                twitterUrl: user.twitterUrl,
                username: user.username
              }} />
            </div>
            {user.username && (
              <Link
                href={`/u/${user.username}`}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
              >
                <Globe className="h-4 w-4" />
                View Public Profile
              </Link>
            )}
          </MotionDiv>
        </div>


        {/* Content Grid */}
        <div className="mx-auto max-w-3xl space-y-6">

          {/* Stats Card */}
          <MotionDiv delay={0.4} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">Activity</h3>
            <div className="flex items-center justify-between">
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-600">{user.registrations.length}</p>
                <p className="text-xs font-medium text-slate-500">Events Joined</p>
              </div>
              {/* Can add more stats here later */}
              <Link href="/my-tickets" className="text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:underline">
                View My Tickets →
              </Link>
            </div>
          </MotionDiv>

          {/* Bio & Details Card */}
          <MotionDiv delay={0.5} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">

            {/* Headline & Location */}
            <div>
              {user.headline && (
                <h2 className="text-lg font-medium text-slate-900">{user.headline}</h2>
              )}
              {user.location && (
                <div className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  {user.location}
                </div>
              )}
            </div>

            {/* Bio */}
            <div>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-500">About</h3>
              {user.bio ? (
                <p className="text-slate-700 leading-relaxed whitespace-pre-line">{user.bio}</p>
              ) : (
                <p className="text-sm text-slate-500 italic">No bio added yet.</p>
              )}
            </div>

            {/* Contact & Socials */}
            <div className="pt-6 border-t border-slate-100 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400">PHONE</label>
                <p className="text-sm font-medium text-slate-900">{user.phone || "Not provided"}</p>
              </div>

              {(user.linkedinUrl || user.websiteUrl || user.twitterUrl) && (
                <div>
                  <label className="text-xs font-semibold text-slate-400">CONNECT</label>
                  <div className="mt-2 flex flex-wrap gap-3">
                    {user.linkedinUrl && (
                      <a href={user.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-[#0077b5] transition-colors">
                        <span className="sr-only">LinkedIn</span>
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </a>
                    )}
                    {user.twitterUrl && (
                      <a href={user.twitterUrl} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-sky-500 transition-colors">
                        <span className="sr-only">Twitter</span>
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                        </svg>
                      </a>
                    )}
                    {user.websiteUrl && (
                      <a href={user.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-emerald-600 transition-colors">
                        <span className="sr-only">Website</span>
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </MotionDiv>

        </div>
      </main>
    </div>
  );
}
