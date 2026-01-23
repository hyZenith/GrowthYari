"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Something went wrong");
            }

            setSubmitted(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

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
                        Forgot your password? No worries.
                    </h2>
                    <p className="mt-4 text-emerald-800/70 text-lg">
                        We'll send you a secure link to reset it and get you back into your professional growth journey.
                    </p>
                </div>

                <div className="text-sm text-emerald-800/60">
                    © 2024 GrowthYari. All rights reserved.
                </div>
            </div>

            {/* Main Content */}
            <div className="flex w-full flex-col items-center justify-center p-8 lg:w-1/2">
                <div className="w-full max-w-sm">
                    {!submitted ? (
                        <>
                            <div className="mb-8">
                                <Link
                                    href="/auth/login"
                                    className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-600 transition-colors mb-6"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    Back to login
                                </Link>
                                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                                    Reset Password
                                </h1>
                                <p className="mt-2 text-sm text-slate-500">
                                    Enter your email address and we'll send you a link to reset your password.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-1.5">
                                    <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="name@example.com"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="bg-white pl-10"
                                        />
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    </div>
                                </div>

                                {error && <p className="text-sm text-red-600">{error}</p>}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full rounded-md bg-emerald-700 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? "Sending link..." : "Send Reset Link"}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 mb-6">
                                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Check your email</h2>
                            <p className="text-sm text-slate-500 mb-8">
                                If an account exists for <span className="font-semibold text-slate-900">{email}</span>, you will receive a password reset link shortly.
                            </p>
                            <Link
                                href="/auth/login"
                                className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-500"
                            >
                                Return to login
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
