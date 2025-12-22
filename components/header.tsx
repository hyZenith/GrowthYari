"use client";

import { useState } from "react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-900/10 bg-white/70 backdrop-blur-md">
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

            <a
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
            </a>

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

        <a
          href="#get-started"
          className="group hidden items-center rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 sm:inline-flex sm:px-5 sm:py-2.5 md:ml-auto"
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
        </a>
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
          <a
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
          </a>
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
          <div className="pt-3">
            <a
              href="#get-started"
              className="flex w-full items-center justify-center rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-800"
            >
              Get Started
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}