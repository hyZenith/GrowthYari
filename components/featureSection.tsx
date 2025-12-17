export function FeatureSection() {
  return (
    <section
      id="why-us"
      className="relative isolate overflow-hidden bg-[#fbfaf7] py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="text-xs font-semibold tracking-[0.2em] text-emerald-700">
            THE PROBLEM
          </div>
          <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Networking Is{" "}
            <span className="font-serif italic text-slate-900">Broken</span>
          </h2>
          <p className="mt-5 text-pretty text-lg text-slate-600">
            Professional networking has become a numbers game—more connections,
            fewer relationships.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1 */}
          <div className="group relative rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/10">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-10 -top-10 h-36 w-36 rounded-full bg-emerald-200/50 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 ring-1 ring-emerald-900/10">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-emerald-700"
              >
                <path d="M16 11a4 4 0 1 0-8 0" />
                <path d="M12 14a6 6 0 0 0-6 6" />
                <path d="M12 14a6 6 0 0 1 6 6" />
                <path d="M18 8a3 3 0 1 0-2.7 4.3" />
              </svg>
            </div>
            <h3 className="mt-6 text-lg font-semibold text-slate-900">
              Superficial Connections
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              LinkedIn requests pile up, but genuine professional relationships
              remain elusive.
            </p>
          </div>

          {/* Card 2 */}
          <div className="group relative rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/10">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-10 -top-10 h-36 w-36 rounded-full bg-emerald-200/50 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 ring-1 ring-emerald-900/10">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-emerald-700"
              >
                <path d="M12 6v6l4 2" />
                <path d="M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z" />
              </svg>
            </div>
            <h3 className="mt-6 text-lg font-semibold text-slate-900">
              Time Wasted
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Hours spent at networking events, yet leaving with nothing but
              business cards.
            </p>
          </div>

          {/* Card 3 */}
          <div className="group relative rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/10">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-10 -top-10 h-36 w-36 rounded-full bg-emerald-200/50 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 ring-1 ring-emerald-900/10">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-emerald-700"
              >
                <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z" />
              </svg>
            </div>
            <h3 className="mt-6 text-lg font-semibold text-slate-900">
              No Real Conversations
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              DMs get ignored. Comments feel hollow. Where&apos;s the authentic
              dialogue?
            </p>
          </div>

          {/* Card 4 */}
          <div className="group relative rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/10">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-10 -top-10 h-36 w-36 rounded-full bg-emerald-200/50 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 ring-1 ring-emerald-900/10">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-emerald-700"
              >
                <path d="M21 7 9 19l-5.5-5.5" />
                <path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
            </div>
            <h3 className="mt-6 text-lg font-semibold text-slate-900">
              Missed Opportunities
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              The right mentor, co-founder, or client exists—but finding them
              feels impossible.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}