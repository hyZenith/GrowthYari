"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Lock, CheckCircle2, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";

function ResetPasswordContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const token = searchParams.get("token");
    const email = searchParams.get("email");

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!token || !email) {
            setError("Invalid reset link. Please request a new one.");
        }
    }, [token, email]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (newPassword.length < 8) {
            setError("Password must be at least 8 characters long");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, token, newPassword }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to reset password");
            }

            setSubmitted(true);
            // Automatically redirect after a few seconds
            setTimeout(() => {
                router.push("/auth/login");
            }, 3000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full max-w-sm">
            {!submitted ? (
                <>
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                            Create New Password
                        </h1>
                        <p className="mt-2 text-sm text-slate-500">
                            Set a strong password for your account.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700">
                                New Password
                            </label>
                            <div className="relative">
                                <Input
                                    id="newPassword"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="bg-white pl-10 pr-10"
                                />
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="bg-white pl-10"
                                />
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
                                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                                <p>{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || !!error && !token}
                            className="w-full rounded-md bg-emerald-700 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Updating password..." : "Reset Password"}
                        </button>
                    </form>
                </>
            ) : (
                <div className="text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 mb-6 border-4 border-emerald-50">
                        <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Password reset successful</h2>
                    <p className="text-sm text-slate-500 mb-8">
                        Your password has been securely updated. You'll be redirected to the login page in a few seconds.
                    </p>
                    <Link
                        href="/auth/login"
                        className="w-full inline-flex items-center justify-center rounded-md bg-emerald-700 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800 transition-all"
                    >
                        Sign in now
                    </Link>
                </div>
            )}
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="flex min-h-screen w-full bg-white font-sans text-slate-900">
            {/* Sidebar background */}
            <div className="hidden w-1/2 flex-col justify-between bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-12 lg:flex xl:p-16">
                <Link href="/" className="flex items-center gap-3 w-fit hover:opacity-80 transition-opacity">
                    <Image
                        alt="GrowthYari"
                        src="/images/logo.png"
                        width={48}
                        height={48}
                        className="h-10 w-10 rounded-full object-cover"
                    />
                    <span className="font-serif text-xl italic text-emerald-800">
                        GrowthYari
                    </span>
                </Link>

                <div className="max-w-md">
                    <h2 className="text-4xl font-bold text-emerald-900 leading-tight">
                        Security first. Professional always.
                    </h2>
                    <p className="mt-4 text-emerald-800/70 text-lg">
                        Choose a new password to keep your profile and connections safe.
                    </p>
                </div>

                <div className="text-sm text-emerald-800/60">
                    © 2024 GrowthYari. All rights reserved.
                </div>
            </div>

            {/* Main Content */}
            <div className="flex w-full flex-col items-center justify-center p-8 lg:w-1/2">
                <Suspense fallback={<div className="animate-pulse flex space-x-4"><div className="rounded-full bg-emerald-100 h-10 w-10"></div></div>}>
                    <ResetPasswordContent />
                </Suspense>
            </div>
        </div>
    );
}
