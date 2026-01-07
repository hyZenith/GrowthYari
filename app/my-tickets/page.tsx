
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/user-auth";
import Link from "next/link";
import { RegistrationCard } from "@/components/profile/RegistrationCard";
import { Calendar, Ticket } from "lucide-react";

export default async function MyTicketsPage() {
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
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20 pt-24">
            <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">My Tickets</h1>
                        <p className="mt-1 text-sm text-slate-500">Manage your event registrations and tickets</p>
                    </div>
                    <Link
                        href="/events"
                        className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition-colors"
                    >
                        <Calendar className="h-4 w-4" />
                        Browse Events
                    </Link>
                </div>

                {user.registrations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-24 text-center">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-50">
                            <Ticket className="h-7 w-7 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900">No tickets found</h3>
                        <p className="mt-2 text-slate-500 max-w-sm">
                            You haven't registered for any events yet. Browse our upcoming events to join in!
                        </p>
                        <Link
                            href="/events"
                            className="mt-6 rounded-full bg-slate-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
                        >
                            Explore Events
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {user.registrations.map((reg) => (
                            <RegistrationCard key={reg.id} registration={reg} userName={user.name} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
