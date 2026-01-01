"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { FaGoogle } from "react-icons/fa6";

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Signup failed");
      return;
    }

    // Auto-login happens via cookie
    router.push("/events");
  }

  return (
    <div className="flex min-h-screen w-full bg-white font-sans text-slate-900">
      {/* Left Panel: Content & Steps (Matching Login Page) */}
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

        <div className="flex flex-col gap-12 max-w-lg mx-auto">
          {/* Step 1 - Left */}
          <div className="relative text-left">
            <div className="pointer-events-none absolute -left-4 -top-8 text-8xl font-bold text-emerald-600/10 select-none">
              01
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-slate-900">
                Create Profile
              </h3>
              <p className="mt-1 text-sm text-slate-600 max-w-[250px]">
                Share your background and goals.
              </p>
            </div>
          </div>

          {/* Step 2 - Right */}
          <div className="relative text-right self-end">
            <div className="pointer-events-none absolute -right-4 -top-8 text-8xl font-bold text-emerald-600/10 select-none">
              02
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-slate-900">
                Get Matched
              </h3>
              <p className="mt-1 text-sm text-slate-600 max-w-[250px] ml-auto">
                Our algorithm finds aligned professionals.
              </p>
            </div>
          </div>

          {/* Step 3 - Left */}
          <div className="relative text-left">
            <div className="pointer-events-none absolute -left-4 -top-8 text-8xl font-bold text-emerald-600/10 select-none">
              03
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-slate-900">
                Connect Live
              </h3>
              <p className="mt-1 text-sm text-slate-600 max-w-[250px]">
                Schedule 15-minute intro calls.
              </p>
            </div>
          </div>

          {/* Step 4 - Right */}
          <div className="relative text-right self-end">
            <div className="pointer-events-none absolute -right-4 -top-8 text-8xl font-bold text-emerald-600/10 select-none">
              04
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-slate-900">
                Grow Network
              </h3>
              <p className="mt-1 text-sm text-slate-600 max-w-[250px] ml-auto">
                Build relationships that facilitate growth.
              </p>
            </div>
          </div>
        </div>

        <div className="text-sm text-emerald-800/60">
          © 2024 GrowthYari. All rights reserved.
        </div>
      </div>

      {/* Right Panel: Signup Form */}
      <div className="flex w-full flex-col items-center justify-center p-8 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center lg:text-left">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Create an account
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Join thousands of professionals growing together.
            </p>
          </div>

          <div className="space-y-4">
            <button
              type="button"
              onClick={async () => {
                const { signIn } = await import("next-auth/react");
                signIn("google", { callbackUrl: "/events" });
              }}
              className="flex w-full items-center justify-center gap-3 rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400"
            >
              <FaGoogle className="h-4 w-4" />
              Sign up with Google
            </button>
            <button
              type="button"
              onClick={async () => {
                const { signIn } = await import("next-auth/react");
                signIn("linkedin", { callbackUrl: "/events" });
              }}
              className="flex w-full items-center justify-center gap-3 rounded-md border border-slate-200 bg-[#0077b5] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#006097] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0077b5]"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              Sign up with LinkedIn
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-500">
                  Or sign up with email
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-slate-700"
                >
                  Full Name
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  required
                  onChange={handleChange}
                  className="bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-700"
                >
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  onChange={handleChange}
                  className="bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-slate-700"
                >
                  Phone Number
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  required
                  onChange={handleChange}
                  className="bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700"
                >
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    required
                    onChange={handleChange}
                    className="bg-white pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-emerald-700 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating account..." : "Sign up"}
              </button>
            </form>
          </div>

          <p className="mt-8 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="font-semibold text-emerald-600 hover:text-emerald-500 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
