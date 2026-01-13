"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Calendar, LogOut, History, Menu, X } from "lucide-react";
import Image from "next/image";

export function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = async (e: React.MouseEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/admin/logout", {
                method: "POST",
            });
            if (res.ok) {
                router.push("/admin/login");
            }
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const navigation = [
        { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        { name: "Events", href: "/admin/events", icon: Calendar },
        { name: "Past Events", href: "/admin/past-events", icon: History },
    ];

    const closeMobileMenu = () => setMobileMenuOpen(false);

    return (
        <>
            {/* Mobile Header */}
            <div className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 md:hidden">
                <div className="flex items-center gap-2">
                    <Image
                        src="/images/logo.png"
                        alt="GrowthYari"
                        width={32}
                        height={32}
                        className="h-8 w-8 rounded-full"
                    />
                    <span className="font-serif text-lg italic text-emerald-600">
                        GrowthYari
                    </span>
                </div>
                <button
                    onClick={() => setMobileMenuOpen(true)}
                    className="rounded-md p-2 text-slate-700 hover:bg-slate-100"
                    aria-label="Open menu"
                >
                    <Menu className="h-6 w-6" />
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 z-50 bg-slate-900/50 md:hidden"
                    onClick={closeMobileMenu}
                />
            )}

            {/* Mobile Slide-out Menu */}
            <div
                className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white transition-transform duration-300 ease-in-out md:hidden ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">
                    <div className="flex items-center gap-2">
                        <Image
                            src="/images/logo.png"
                            alt="GrowthYari"
                            width={32}
                            height={32}
                            className="h-8 w-8 rounded-full"
                        />
                        <span className="font-serif text-lg italic text-emerald-600">
                            GrowthYari
                        </span>
                    </div>
                    <button
                        onClick={closeMobileMenu}
                        className="rounded-md p-2 text-slate-700 hover:bg-slate-100"
                        aria-label="Close menu"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <nav className="flex-1 space-y-1 px-4 py-6">
                    {navigation.map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={closeMobileMenu}
                                className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium ${isActive
                                        ? "bg-emerald-50 text-emerald-700"
                                        : "text-slate-700 hover:bg-slate-50 hover:text-emerald-600"
                                    }`}
                            >
                                <item.icon
                                    className={`mr-3 h-5 w-5 flex-shrink-0 ${isActive
                                            ? "text-emerald-600"
                                            : "text-slate-400 group-hover:text-emerald-600"
                                        }`}
                                />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="border-t border-slate-200 p-4">
                    <button
                        onClick={(e) => {
                            handleLogout(e);
                            closeMobileMenu();
                        }}
                        className="group flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-red-50 hover:text-red-600"
                    >
                        <LogOut className="mr-3 h-5 w-5 text-slate-400 group-hover:text-red-500" />
                        Log Out
                    </button>
                </div>
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden w-64 flex-col bg-white border-r border-slate-200 md:flex">
                <div className="flex h-16 items-center gap-2 border-b border-slate-200 px-6">
                    <Image
                        src="/images/logo.png"
                        alt="GrowthYari"
                        width={32}
                        height={32}
                        className="h-8 w-8 rounded-full"
                    />
                    <span className="font-serif text-lg italic text-emerald-600">
                        GrowthYari
                    </span>
                </div>

                <nav className="flex-1 space-y-1 px-4 py-6">
                    {navigation.map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium ${isActive
                                        ? "bg-emerald-50 text-emerald-700"
                                        : "text-slate-700 hover:bg-slate-50 hover:text-emerald-600"
                                    }`}
                            >
                                <item.icon
                                    className={`mr-3 h-5 w-5 flex-shrink-0 ${isActive
                                            ? "text-emerald-600"
                                            : "text-slate-400 group-hover:text-emerald-600"
                                        }`}
                                />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="border-t border-slate-200 p-4">
                    <button
                        onClick={handleLogout}
                        className="group flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-red-50 hover:text-red-600"
                    >
                        <LogOut className="mr-3 h-5 w-5 text-slate-400 group-hover:text-red-500" />
                        Log Out
                    </button>
                </div>
            </div>
        </>
    );
}
