"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Settings, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (err) {
        console.error("Failed to fetch auth status", err);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      await signOut({ redirect: false });
      setUser(null);
      setDropdownOpen(false);
      router.refresh();
      router.push("/");
    } catch (error) {
      console.error("Failed to logout", error);
    }
  }

  return (
    <header className="sticky top-0 z-[100] w-full border-b border-slate-900/10 bg-white/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:gap-6 sm:px-6 lg:px-8">
        <a href="/" className="flex items-center gap-2">
          <img
            src="/images/logo.png"
            alt="GrowthYari logo"
            className="h-8 w-8 rounded-full object-cover sm:h-9 sm:w-9"
          />
          <span className="text-base font-semibold tracking-tight text-slate-900 sm:text-lg">
            GrowthYari
          </span>
        </a>

        <nav aria-label="Primary" className="hidden flex-1 md:flex">
          <div className="mx-auto flex items-center gap-8">
            <a
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-slate-500"
              >
                <path d="M3 10.5 12 3l9 7.5V21a1.5 1.5 0 0 1-1.5 1.5H4.5A1.5 1.5 0 0 1 3 21v-10.5Z" />
                <path d="M9 22.5V15a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 15v7.5" />
              </svg>
              Home
            </a>

            {/* <a
              href="/Dashboard"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-slate-500"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <path d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
              </svg>
              Dashboard
            </a> */}

            <a
              href="/events"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-slate-500"
              >
                <path d="M21 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
                <path d="M12 6v4l2.5 2.5" />
                <path d="M5.5 18.5 3 21" />
                <path d="M18.5 18.5 21 21" />
              </svg>
              Events
            </a>

            <a
              href="/about"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-slate-500"
              >
                <path d="M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18Z" />
                <path d="M12 8h.01" />
                <path d="M11 12h1v4h1" />
              </svg>
              About
            </a>

            <a
              href="/contact"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-slate-500"
              >
                <path d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
              </svg>
              Contact
            </a>
          </div>
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="ml-auto inline-flex items-center justify-center rounded-md p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 md:hidden"
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
        >
          <span className="sr-only">{mobileMenuOpen ? "Close menu" : "Open menu"}</span>
          {mobileMenuOpen ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          )}
        </button>

        {!loading && (
          user ? (
            <div className="hidden md:ml-auto md:block md:relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center justify-center h-10 w-10 rounded-full bg-emerald-100 ring-2 ring-emerald-600/20 text-emerald-800 font-semibold text-lg uppercase focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                {user.name ? user.name.charAt(0) : "U"}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-60 origin-top-right rounded-xl bg-white p-2 shadow-xl ring-1 ring-slate-200 focus:outline-none animate-in fade-in zoom-in-95 duration-100">
                  <div className="mb-2 flex items-center gap-3 rounded-lg bg-slate-50 p-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold">
                      {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div className="overflow-hidden">
                      <p className="truncate text-sm font-semibold text-slate-900">{user.name}</p>
                      <p className="truncate text-xs text-slate-500">{user.email}</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Link
                      href="/profile"
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-emerald-700 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      View Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-emerald-700 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>

                    <div className="my-1 h-px bg-slate-100" />

                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="md:ml-auto md:flex md:w-[160px] md:justify-end md:items-center">
              <Link
                href="/auth/login"
                className="group hidden items-center rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 sm:inline-flex sm:px-5 sm:py-2.5"
              >
                Get Started
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-0 overflow-hidden opacity-0 transition-all duration-300 group-hover:ml-2 group-hover:w-4 group-hover:opacity-100"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 10a.75.75 0 0 1 .75-.75h8.69L10.22 6.03a.75.75 0 1 1 1.06-1.06l4.5 4.5c.3.3.3.77 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06l3.22-3.22H4.75A.75.75 0 0 1 4 10Z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          )
        )}
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`border-t border-slate-900/10 bg-white/95 backdrop-blur-md md:hidden ${mobileMenuOpen ? "block" : "hidden"}`}
      >
        <div className="space-y-1 px-4 py-4">
          <a
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 text-slate-500"
            >
              <path d="M3 10.5 12 3l9 7.5V21a1.5 1.5 0 0 1-1.5 1.5H4.5A1.5 1.5 0 0 1 3 21v-10.5Z" />
              <path d="M9 22.5V15a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 15v7.5" />
            </svg>
            Home
          </a>
          {/* <a
            href="/Dashboard"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 text-slate-500"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <path d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
            </svg>
            Dashboard
          </a> */}
          <a
            href="/events"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 text-slate-500"
            >
              <path d="M21 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
              <path d="M12 6v4l2.5 2.5" />
              <path d="M5.5 18.5 3 21" />
              <path d="M18.5 18.5 21 21" />
            </svg>
            Events
          </a>
          <a
            href="/about"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 text-slate-500"
            >
              <path d="M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18Z" />
              <path d="M12 8h.01" />
              <path d="M11 12h1v4h1" />
            </svg>
            About
          </a>
          <a
            href="/contact"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 text-slate-500"
            >
              <path d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
            </svg>
            Contact
          </a>

          {!loading && (
            user ? (
              <div className="px-3 pt-3">
                <div className="flex w-full flex-col gap-2 rounded-lg bg-emerald-50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-200 text-emerald-800 font-bold">
                      {user.name ? user.name.charAt(0) : "U"}
                    </div>
                    <div className="flex flex-col">
                      <Link href="/profile" className="font-semibold text-emerald-900">{user.name}</Link>
                      <Link href="/profile" className="text-xs text-emerald-700">{user.email}</Link>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="mt-2 w-full rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <div className="pt-3">
                <Link
                  href="/auth/login"
                  className="flex w-full items-center justify-center rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-800"
                >
                  Get Started
                </Link>
              </div>
            )
          )}
        </div>
      </div>
    </header>
  );
}