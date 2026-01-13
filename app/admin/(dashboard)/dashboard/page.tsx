import { prisma } from "@/lib/prisma";
import { Calendar, Users, Globe, TrendingUp, Shield, Activity } from "lucide-react";
import Link from "next/link";

async function getStats() {
    const now = new Date();

    const [totalEvents, totalRegistrations, upcomingEvents, pastEvents] = await Promise.all([
        prisma.event.count(),
        prisma.eventRegistration.count(),
        prisma.event.count({ where: { status: "UPCOMING" } }),
        prisma.event.count({
            where: {
                OR: [
                    { endDate: { lt: now } },
                    { endDate: null, date: { lt: now } },
                ],
            },
        }),
    ]);

    return {
        totalEvents,
        totalRegistrations,
        upcomingEvents,
        pastEvents,
    };
}

export default async function AdminDashboard() {
    const stats = await getStats();

    return (
        <div className="space-y-8 md:space-y-12">
            {/* Header Section with Meaningful Gradient */}
            <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-[#E0F7FA] via-[#E8F5E9] to-[#F3F4F6] p-6 md:p-10 lg:p-14">
                <div className="relative z-10 max-w-2xl">
                    <h1 className="font-serif text-3xl font-medium text-slate-900 md:text-4xl lg:text-5xl">
                        Hello, Admin.
                    </h1>
                    <p className="mt-3 md:mt-4 text-base md:text-lg text-slate-600 font-light max-w-md">
                        Here&apos;s what&apos;s happening in your workspace today.
                    </p>

                    <div className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <Link href="/admin/events/create" className="rounded-full bg-slate-900 px-5 md:px-6 py-2.5 md:py-3 text-sm font-semibold text-white transition-transform hover:scale-105 text-center">
                            Create Event
                        </Link>
                        <button className="rounded-full border border-slate-900 px-5 md:px-6 py-2.5 md:py-3 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50">
                            View Reports
                        </button>
                    </div>
                </div>

                {/* Decorative Abstract Shapes */}
                <div className="absolute top-0 right-0 -mt-10 -mr-10 h-48 w-48 md:h-64 md:w-64 rounded-full bg-blue-200/20 blur-3xl"></div>
                <div className="absolute bottom-0 right-10 md:right-20 h-32 w-32 md:h-40 md:w-40 rounded-full bg-emerald-200/20 blur-2xl"></div>
            </div>

            {/* Stats Cards - Minimal & Clean */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {/* Total Admins */}
                <div className="group relative overflow-hidden rounded-2xl bg-white p-6 transition-all hover:shadow-lg border border-slate-100/50 hover:border-slate-200">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Total Admins</p>
                            <h3 className="mt-2 text-4xl font-light text-slate-900">4</h3>
                        </div>
                        <div className="rounded-full bg-slate-50 p-3 text-slate-400 transition-colors group-hover:bg-slate-900 group-hover:text-white">
                            <Users className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                            <TrendingUp className="h-3 w-3" />
                            +12%
                        </span>
                    </div>
                </div>

                {/* Active Events */}
                <div className="group relative overflow-hidden rounded-2xl bg-white p-6 transition-all hover:shadow-lg border border-slate-100/50 hover:border-slate-200">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Active Events</p>
                            <h3 className="mt-2 text-4xl font-light text-slate-900">{stats.upcomingEvents}</h3>
                        </div>
                        <div className="rounded-full bg-slate-50 p-3 text-slate-400 transition-colors group-hover:bg-slate-900 group-hover:text-white">
                            <Calendar className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                            <TrendingUp className="h-3 w-3" />
                            +8%
                        </span>
                    </div>
                </div>

                {/* Websites */}
                <div className="group relative overflow-hidden rounded-2xl bg-white p-6 transition-all hover:shadow-lg border border-slate-100/50 hover:border-slate-200">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Websites</p>
                            <h3 className="mt-2 text-4xl font-light text-slate-900">4</h3>
                        </div>
                        <div className="rounded-full bg-slate-50 p-3 text-slate-400 transition-colors group-hover:bg-slate-900 group-hover:text-white">
                            <Globe className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                            <TrendingUp className="h-3 w-3" />
                            +2%
                        </span>
                    </div>
                </div>

                {/* Total Visitors */}
                <div className="group relative overflow-hidden rounded-2xl bg-white p-6 transition-all hover:shadow-lg border border-slate-100/50 hover:border-slate-200">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Total Visitors</p>
                            <h3 className="mt-2 text-4xl font-light text-slate-900">91.8k</h3>
                        </div>
                        <div className="rounded-full bg-slate-50 p-3 text-slate-400 transition-colors group-hover:bg-slate-900 group-hover:text-white">
                            <Activity className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                            <TrendingUp className="h-3 w-3" />
                            +24%
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-3">
                {/* Quick Overview - Minimal List */}
                <div className="lg:col-span-2 rounded-2xl md:rounded-3xl bg-white p-6 md:p-8 shadow-sm border border-slate-100">
                    <h2 className="mb-6 md:mb-8 font-serif text-xl md:text-2xl text-slate-900">Overview</h2>
                    <div className="space-y-4 md:space-y-6">
                        <div className="flex items-center justify-between border-b border-slate-50 pb-4 md:pb-6 last:border-0 last:pb-0">
                            <div className="flex items-center gap-3 md:gap-4">
                                <div className="h-9 w-9 md:h-10 md:w-10 rounded-full bg-[#E0F7FA] flex items-center justify-center text-cyan-700">
                                    <Calendar className="h-4 w-4 md:h-5 md:w-5" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-sm md:text-base text-slate-900">Upcoming Events</h4>
                                    <p className="text-xs md:text-sm text-slate-500">Scheduled for this month</p>
                                </div>
                            </div>
                            <span className="text-xl md:text-2xl font-light text-slate-900">{stats.upcomingEvents}</span>
                        </div>
                        <div className="flex items-center justify-between border-b border-slate-50 pb-4 md:pb-6 last:border-0 last:pb-0">
                            <div className="flex items-center gap-3 md:gap-4">
                                <div className="h-9 w-9 md:h-10 md:w-10 rounded-full bg-[#E8F5E9] flex items-center justify-center text-emerald-700">
                                    <Users className="h-4 w-4 md:h-5 md:w-5" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-sm md:text-base text-slate-900">Total Registrations</h4>
                                    <p className="text-xs md:text-sm text-slate-500">All time event signups</p>
                                </div>
                            </div>
                            <span className="text-xl md:text-2xl font-light text-slate-900">{stats.totalRegistrations}</span>
                        </div>
                        <div className="flex items-center justify-between border-b border-slate-50 pb-4 md:pb-6 last:border-0 last:pb-0">
                            <div className="flex items-center gap-3 md:gap-4">
                                <div className="h-9 w-9 md:h-10 md:w-10 rounded-full bg-[#FEF3C7] flex items-center justify-center text-amber-700">
                                    <Calendar className="h-4 w-4 md:h-5 md:w-5" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-sm md:text-base text-slate-900">Past Events</h4>
                                    <p className="text-xs md:text-sm text-slate-500">Completed events</p>
                                </div>
                            </div>
                            <span className="text-xl md:text-2xl font-light text-slate-900">{stats.pastEvents}</span>
                        </div>
                        <div className="flex items-center justify-between border-b border-slate-50 pb-4 md:pb-6 last:border-0 last:pb-0">
                            <div className="flex items-center gap-3 md:gap-4">
                                <div className="h-9 w-9 md:h-10 md:w-10 rounded-full bg-[#F3F4F6] flex items-center justify-center text-slate-700">
                                    <Shield className="h-4 w-4 md:h-5 md:w-5" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-sm md:text-base text-slate-900">Active Admins</h4>
                                    <p className="text-xs md:text-sm text-slate-500">Team members online</p>
                                </div>
                            </div>
                            <span className="text-xl md:text-2xl font-light text-slate-900">3</span>
                        </div>
                    </div>
                </div>

                {/* Recent Activity - Timeline */}
                <div className="rounded-2xl md:rounded-3xl bg-slate-900 p-6 md:p-8 text-white shadow-lg">
                    <h2 className="mb-6 md:mb-8 font-serif text-xl md:text-2xl">Activity</h2>
                    <div className="space-y-6 md:space-y-8">
                        <div className="relative pl-6 border-l border-slate-700">
                            <div className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-emerald-400"></div>
                            <p className="text-sm font-medium">Sarah M. <span className="text-xs text-slate-400">Admin</span></p>
                            <p className="text-xs text-slate-400 mt-1">2 hours ago</p>
                        </div>
                        <div className="relative pl-6 border-l border-slate-700">
                            <div className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-blue-400"></div>
                            <p className="text-sm font-medium">New Event Created</p>
                            <p className="text-xs text-slate-400 mt-1">5 hours ago</p>
                        </div>
                        <div className="relative pl-6 border-l border-slate-700">
                            <div className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-cyan-400"></div>
                            <p className="text-sm font-medium">Website Updated</p>
                            <p className="text-xs text-slate-400 mt-1">1 day ago</p>
                        </div>
                        <div className="relative pl-6 border-l border-slate-700 border-0">
                            <div className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-orange-400"></div>
                            <p className="text-sm font-medium">Security Check</p>
                            <p className="text-xs text-slate-400 mt-1">2 days ago</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}