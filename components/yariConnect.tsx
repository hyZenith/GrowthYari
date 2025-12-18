import { LiquidButton } from "./ui/shadcn-io/liquid-button";

export function YariConnect() {
  return (
    <section
      id="yariconnect"
      className="relative isolate overflow-hidden bg-[#fbfaf7] py-24"
    >
      {/* subtle background glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-16 h-[520px] w-[520px] -translate-x-[70%] rounded-full bg-emerald-200/35 blur-3xl" />
        <div className="absolute left-1/2 top-28 h-[520px] w-[520px] -translate-x-[-5%] rounded-full bg-orange-200/35 blur-3xl" />
        <div className="absolute inset-0 bg-linear-to-b from-[#fbfaf7]/80 via-[#fbfaf7]/40 to-[#fbfaf7]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* left */}
          <div>
            <div className="text-xs font-semibold tracking-[0.2em] text-emerald-700">
              YARICONNECT PLATFORM
            </div>

            <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              1:1 Video Networking{"\u00A0"}That{" "}
              <span className="font-serif italic text-emerald-700">
                Actually Works
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-pretty text-lg text-slate-600">
              Skip the small talk. Our intelligent matching connects you with
              professionals who can genuinely impact your career—and vice versa.
            </p>

            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 ring-1 ring-emerald-900/10">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 text-emerald-700"
                  >
                    <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    Smart Matching
                  </div>
                  <div className="mt-1 text-sm leading-6 text-slate-600">
                    Our algorithm analyzes your profile, goals, and preferences
                    to suggest the most relevant connections.
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 ring-1 ring-emerald-900/10">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 text-emerald-700"
                  >
                    <path d="M15 10 21 6v12l-6-4" />
                    <rect x="3" y="7" width="12" height="10" rx="2" ry="2" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    1:1 Video Calls
                  </div>
                  <div className="mt-1 text-sm leading-6 text-slate-600">
                    High-quality video sessions with integrated tools for
                    note-taking and follow-up scheduling.
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 ring-1 ring-emerald-900/10">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 text-emerald-700"
                  >
                    <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    Conversation Starters
                  </div>
                  <div className="mt-1 text-sm leading-6 text-slate-600">
                    AI-generated talking points and ice-breakers tailored to
                    each match&apos;s background.
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 ring-1 ring-emerald-900/10">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 text-emerald-700"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    Community Access
                  </div>
                  <div className="mt-1 text-sm leading-6 text-slate-600">
                    Join exclusive groups based on industry, role, or interest
                    for ongoing discussions.
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <LiquidButton
                href="#start"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-7 py-3 text-sm font-semibold text-emerald-700 hover:text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-800 hover:shadow-lg hover:shadow-emerald-700/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 border-2 border-emerald-700"

              >
                Try YariConnect Free
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
              </LiquidButton>
            </div>
          </div>

          {/* right mock */}
          <div className="relative">
            <div className="group relative rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-900/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/10">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-emerald-200/50 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />

              <div className="flex min-h-[340px] flex-col justify-center rounded-2xl bg-[#efece6] p-10">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-200/60">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-7 w-7 text-emerald-800"
                  >
                    <path d="M15 10 21 6v12l-6-4" />
                    <rect x="3" y="7" width="12" height="10" rx="2" ry="2" />
                  </svg>
                </div>
                <div className="mt-6 text-center text-sm font-medium text-slate-600">
                  Live Video Session
                </div>

                <div className="mt-14 flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-900/10">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    You
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-900/10">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Sarah K.
                  </span>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-[#f4f2ee] p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-700 text-sm font-semibold text-white">
                    SK
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">
                      Sarah Kim
                    </div>
                    <div className="text-xs text-slate-600">
                      Product Lead at Stripe
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}