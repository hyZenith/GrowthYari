"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { User } from "lucide-react";
import { Toast, ToastType } from "@/components/ui/Toast";

interface UserData {
    name: string;
    email: string;
    phone: string | null;
    googleId?: string | null;
    linkedinId?: string | null;
    image?: string | null;
}

import { Suspense } from "react";

function SettingsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [user, setUser] = useState<UserData | null>(null);

    // Form state
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    // Toast state
    const [toast, setToast] = useState<{ message: string; type: ToastType; visible: boolean }>({
        message: "",
        type: "info",
        visible: false,
    });

    const showToast = (message: string, type: ToastType = "info") => {
        setToast({ message, type, visible: true });
    };

    const hideToast = () => {
        setToast((prev) => ({ ...prev, visible: false }));
    };

    // Toast logic for connection success
    useEffect(() => {
        const connectedProvider = searchParams.get("connected");
        if (connectedProvider) {
            // Remove the param from URL without refreshing
            const newUrl = window.location.pathname;
            window.history.replaceState({}, "", newUrl);

            const providerName = connectedProvider === "google" ? "Google" : "LinkedIn";
            showToast(`Your account is connected to ${providerName}`, "success");
        }
    }, [searchParams]);

    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await fetch("/api/auth/me");
                if (!res.ok) {
                    router.push("/auth/login");
                    return;
                }
                const data = await res.json();
                const u = data.user;
                setUser(u);
                setName(u.name || "");
                setEmail(u.email || "");
                setPhone(u.phone || "");
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
                showToast("Profile updated successfully!", "success");
            } else {
                showToast("Failed to update profile", "error");
            }
        } catch (error) {
            console.error("Error updating profile", error);
            showToast("An error occurred while updating profile", "error");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50">
                <div className="flex items-center justify-center py-32">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
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
                                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-2xl font-bold text-emerald-700 ring-4 ring-white shadow-sm overflow-hidden">
                                        {user?.image ? (
                                            <img src={user.image} alt={user.name} className="h-full w-full object-cover" />
                                        ) : (
                                            user?.name ? user.name.charAt(0).toUpperCase() : "U"
                                        )}
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

                        {/* Connected Accounts */}
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">
                                Connected Accounts
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Manage your connected social accounts.
                            </p>

                            <div className="mt-4 space-y-3">
                                {/* Google */}
                                <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">Google</p>
                                            <p className="text-xs text-slate-500">Connect your Google account</p>
                                        </div>
                                    </div>
                                    {user?.googleId ? (
                                        <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                                            Connected
                                        </span>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={async () => {
                                                const { signIn } = await import("next-auth/react");
                                                signIn("google", { callbackUrl: "/settings?connected=google" });
                                            }}
                                            className="text-sm font-medium text-emerald-600 hover:text-emerald-500"
                                        >
                                            Connect
                                        </button>
                                    )}
                                </div>

                                {/* LinkedIn */}
                                <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0077b5] text-white">
                                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">LinkedIn</p>
                                            <p className="text-xs text-slate-500">Connect your professional identity</p>
                                        </div>
                                    </div>
                                    {user?.linkedinId ? (
                                        <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                                            Connected
                                        </span>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={async () => {
                                                const { signIn } = await import("next-auth/react");
                                                signIn("linkedin", { callbackUrl: "/settings?connected=linkedin" });
                                            }}
                                            className="text-sm font-medium text-emerald-600 hover:text-emerald-500"
                                        >
                                            Connect
                                        </button>
                                    )}
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

            <Toast
                isVisible={toast.visible}
                message={toast.message}
                type={toast.type}
                onClose={hideToast}
            />
        </div>
    );
}

export default function SettingsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
                <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center py-32">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
                    </div>
                </main>
            </div>
        }>
            <SettingsContent />
        </Suspense>
    )
}
