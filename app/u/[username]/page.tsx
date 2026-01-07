
import { getPublicUserProfile } from "@/app/actions/profile";
import { getUser } from "@/lib/user-auth";
import { Calendar, MapPin, Link as LinkIcon, Twitter, Linkedin, Globe, Clock, Share2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
    const { username } = await params;
    const user = await getPublicUserProfile(username);

    if (!user) {
        notFound();
    }

    const currentUser = await getUser();
    const isOwnProfile = currentUser?.userId === user.id;

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">

            {/* Hero / Cover */}
            <div className="relative h-64 w-full overflow-hidden bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100">
                <div className="absolute inset-0 bg-black/10"></div>
                {/* Abstract Pattern */}
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            </div>

            <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10 -mt-24">

                {/* Profile Card */}
                <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl overflow-hidden">
                    <div className="p-6 sm:p-10 flex flex-col md:flex-row gap-8 items-start">

                        {/* Avatar */}
                        <div className="shrink-0 flex flex-col items-center">
                            <div className="h-32 w-32 sm:h-40 sm:w-40 rounded-full border-4 border-white shadow-lg overflow-hidden bg-slate-200">
                                {user.image ? (
                                    <img src={user.image} alt={user.name} className="h-full w-full object-cover" />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center bg-slate-100 text-slate-300">
                                        <span className="text-4xl font-bold uppercase">{user.name.charAt(0)}</span>
                                    </div>
                                )}
                            </div>
                            {/* Edit Button for Owner */}

                        </div>

                        {/* Info */}
                        <div className="flex-1 space-y-4 w-full">
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                <div>
                                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">{user.name}</h1>
                                    <p className="text-lg text-slate-500 font-medium">@{user.username}</p>
                                </div>
                                {/* Share Button (Mock) */}
                                <button className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors" aria-label="Share Profile">
                                    <Share2 className="h-5 w-5" />
                                </button>
                            </div>

                            {user.headline && (
                                <p className="text-xl text-slate-700 font-medium">{user.headline}</p>
                            )}

                            <div className="flex flex-wrap gap-4 text-slate-500 text-sm">
                                {user.location && (
                                    <div className="flex items-center gap-1.5">
                                        <MapPin className="h-4 w-4" />
                                        {user.location}
                                    </div>
                                )}
                                <div className="flex items-center gap-1.5">
                                    <Clock className="h-4 w-4" />
                                    Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                </div>
                            </div>

                            {/* Bio */}
                            {user.bio && (
                                <div className="mt-6 pt-6 border-t border-slate-200/60">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">About</h3>
                                    <p className="text-slate-700 leading-relaxed whitespace-pre-line text-lg">
                                        {user.bio}
                                    </p>
                                </div>
                            )}

                            {/* Social Links */}
                            {(user.linkedinUrl || user.twitterUrl || user.websiteUrl) && (
                                <div className="flex gap-3 pt-4">
                                    {user.linkedinUrl && (
                                        <a href={user.linkedinUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-blue-50 text-[#0077b5] rounded-full hover:bg-blue-100 transition-colors">
                                            <Linkedin className="h-5 w-5" />
                                        </a>
                                    )}
                                    {user.twitterUrl && (
                                        <a href={user.twitterUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-sky-50 text-sky-500 rounded-full hover:bg-sky-100 transition-colors">
                                            <Twitter className="h-5 w-5" />
                                        </a>
                                    )}
                                    {user.websiteUrl && (
                                        <a href={user.websiteUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-emerald-50 text-emerald-600 rounded-full hover:bg-emerald-100 transition-colors">
                                            <Globe className="h-5 w-5" />
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Activity Section */}
                {user.registrations.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold text-slate-800 mb-6">Recent Activity</h2>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {user.registrations.map((reg: any, idx: number) => (
                                <div key={idx} className="group relative bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                                    <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-100 mb-4 relative">
                                        {reg.event.imageUrl ? (
                                            <img src={reg.event.imageUrl} alt={reg.event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400">
                                                <Calendar className="h-8 w-8" />
                                            </div>
                                        )}
                                        <div className="absolute top-2 right-2 px-2 py-1 bg-white/90 backdrop-blur rounded-lg text-xs font-bold text-slate-800 shadow-sm">
                                            {reg.event.mode}
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">{reg.event.title}</h3>
                                    <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                                        <Calendar className="h-4 w-4" />
                                        {new Date(reg.event.date).toLocaleDateString()}
                                    </div>
                                    {reg.event.location && (
                                        <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                                            <MapPin className="h-4 w-4" />
                                            {reg.event.location}
                                        </div>
                                    )}
                                    <Link href={`/events/${reg.event.slug}`} className="absolute inset-0">
                                        <span className="sr-only">View Event</span>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}
