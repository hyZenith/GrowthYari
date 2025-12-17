"use client";

export function Footer() {
  return (
    <footer className="relative isolate overflow-hidden border-t border-slate-900/10 bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Trusted by section */}
        <div className="text-center">
          <p className="text-sm text-slate-500">Trusted by professionals from</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {/* Google */}
            <div className="flex items-center">
              <span className="text-lg font-semibold text-slate-400 transition-colors hover:text-slate-600">
                Google
              </span>
            </div>
            {/* Microsoft */}
            <div className="flex items-center">
              <span className="text-lg font-semibold text-slate-400 transition-colors hover:text-slate-600">
                Microsoft
              </span>
            </div>
            {/* Amazon */}
            <div className="flex items-center">
              <span className="text-lg font-semibold text-slate-400 transition-colors hover:text-slate-600">
                Amazon
              </span>
            </div>
            {/* Meta */}
            <div className="flex items-center">
              <span className="text-lg font-semibold text-slate-400 transition-colors hover:text-slate-600">
                Meta
              </span>
            </div>
            {/* Startup India */}
            <div className="flex items-center">
              <span className="text-lg font-semibold text-slate-400 transition-colors hover:text-slate-600">
                Startup India
              </span>
            </div>
          </div>
        </div>

        {/* Footer content */}
        <div className="mt-16 border-t border-slate-900/10 pt-12">
          <div className="grid gap-8 md:grid-cols-4">
            {/* Brand */}
            <div className="md:col-span-1">
              <a href="/" className="flex items-center gap-2">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-700 text-lg font-semibold text-white">
                  G
                </span>
                <span className="text-lg font-semibold tracking-tight text-slate-900">
                  GrowthYari
                </span>
              </a>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                Professional networking, reimagined. Build meaningful relationships
                through 1:1 video conversations and curated offline events.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Quick Links</h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <a
                    href="#why-us"
                    className="text-sm text-slate-600 transition-colors hover:text-slate-900"
                  >
                    Why Us
                  </a>
                </li>
                <li>
                  <a
                    href="#yariconnect"
                    className="text-sm text-slate-600 transition-colors hover:text-slate-900"
                  >
                    YariConnect
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="text-sm text-slate-600 transition-colors hover:text-slate-900"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a
                    href="#events"
                    className="text-sm text-slate-600 transition-colors hover:text-slate-900"
                  >
                    Events
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Resources</h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-sm text-slate-600 transition-colors hover:text-slate-900"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-slate-600 transition-colors hover:text-slate-900"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-slate-600 transition-colors hover:text-slate-900"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-slate-600 transition-colors hover:text-slate-900"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Contact</h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <a
                    href="mailto:hello@growthyari.com"
                    className="text-sm text-slate-600 transition-colors hover:text-slate-900"
                  >
                    hello@growthyari.com
                  </a>
                </li>
                <li>
                  <a
                    href="#get-started"
                    className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
                  >
                    Get Started
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-4 w-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 10a.75.75 0 0 1 .75-.75h8.69L10.22 6.03a.75.75 0 1 1 1.06-1.06l4.5 4.5c.3.3.3.77 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06l3.22-3.22H4.75A.75.75 0 0 1 4 10Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-12 border-t border-slate-900/10 pt-8">
            <p className="text-center text-sm text-slate-500">
              © {new Date().getFullYear()} GrowthYari. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
