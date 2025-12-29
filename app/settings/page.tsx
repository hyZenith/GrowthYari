"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { User } from "lucide-react";

interface UserData {
    name: string;
    email: string;
    phone: string | null;
}

export default function SettingsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [user, setUser] = useState<UserData | null>(null);

    // Form state
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await fetch("/api/auth/me");
                if (!res.ok) {
                    router.push("/auth/login");
                    return;
                }
                const data = await res.json();
                setUser(data.user);
                setName(data.user.name || "");
                setEmail(data.user.email || "");
                setPhone(data.user.phone || "");
            } catch (error) {
                console.error("Failed to fetch user", error);
                router.push("/auth/login");
            } finally {
                setLoading(false);
            }
        }
        fetchUser();
    }, [router]);

    async function handleSaveChanges(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch("/api/user/update", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, phone }),
            });

            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
                alert("Profile updated successfully!");
            } else {
                alert("Failed to update profile");
            }
        } catch (error) {
            console.error("Error updating profile", error);
            alert("An error occurred while updating profile");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50">
                <Header />
                <div className="flex items-center justify-center py-32">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            <Header />

            <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        Account Settings
                    </h1>
                    <p className="mt-2 text-sm text-slate-600">
                        Manage your personal information and account preferences.
                    </p>
                </div>

                {/* Settings Card */}
                <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                    <form onSubmit={handleSaveChanges} className="space-y-8">
                        {/* Profile Section */}
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">
                                Personal Information
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Update your personal details here.
                            </p>

                            <div className="mt-6 space-y-5">
                                {/* Profile Picture */}
                                <div className="flex items-center gap-6">
                                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-2xl font-bold text-emerald-700 ring-4 ring-white shadow-sm">
                                        {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-700">Profile Picture</p>
                                        <p className="mt-0.5 text-xs text-slate-500">
                                            This will be displayed on your profile
                                        </p>
                                    </div>
                                </div>

                                {/* Full Name */}
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="block text-sm font-medium text-slate-700"
                                    >
                                        Full Name
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 shadow-sm transition-colors focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                                        placeholder="Enter your full name"
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium text-slate-700"
                                    >
                                        Email Address
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        disabled
                                        className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-500 shadow-sm cursor-not-allowed"
                                    />
                                    <p className="mt-1.5 text-xs text-slate-500">
                                        Email cannot be changed. Contact support if you need assistance.
                                    </p>
                                </div>

                                {/* Phone Number */}
                                <div>
                                    <label
                                        htmlFor="phone"
                                        className="block text-sm font-medium text-slate-700"
                                    >
                                        Phone Number
                                    </label>
                                    <input
                                        id="phone"
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 shadow-sm transition-colors focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                                        placeholder="Enter your phone number"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-slate-200" />

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => router.push("/profile")}
                                className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <User className="h-4 w-4" />
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Account Information */}
                <div className="mt-6 rounded-xl border border-slate-200 bg-white px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-700">Member Since</p>
                            <p className="mt-0.5 text-xs text-slate-500">
                                Your account was created and is active
                            </p>
                        </div>
                        <div className="rounded-lg bg-emerald-50 px-3 py-1.5">
                            <p className="text-sm font-semibold text-emerald-700">Active</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
