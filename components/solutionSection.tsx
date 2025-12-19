import SpotlightCard from "./SpotlightCard";

export function SolutionSection() {
  return (
    <section
      id="our-solution"
      className="relative isolate overflow-hidden bg-white py-16 sm:py-24"
    >
      {/* soft background glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-12 h-[360px] w-[360px] -translate-x-[75%] rounded-full bg-emerald-200/40 blur-3xl sm:h-[560px] sm:w-[560px]" />
        <div className="absolute left-1/2 top-20 h-[400px] w-[400px] -translate-x-[-5%] rounded-full bg-emerald-100/40 blur-3xl sm:h-[620px] sm:w-[620px]" />
        <div className="absolute inset-0 bg-linear-to-b from-white/70 via-white/30 to-white" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="text-xs font-semibold tracking-[0.2em] text-emerald-700">
            OUR SOLUTION
          </div>
          <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
            A{" "}
            <span className="font-serif italic text-emerald-700">Hybrid</span>{" "}
            Approach to Real
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>Networking
          </h2>
          <p className="mt-4 text-pretty text-base text-slate-600 sm:mt-5 sm:text-lg">
            GrowthYari combines the best of online and offline networking to
            help you build meaningful professional relationships.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:mt-14 sm:gap-8 lg:grid-cols-2">
          {/* Card: YariConnect */}
          <SpotlightCard
           className="group relative rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/10 border-none sm:p-10"
          spotlightColor="rgba(16, 185, 129, 0.2)">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-200/50 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-700 text-white shadow-sm">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-7 w-7"
              >
                <path d="M15 10 21 6v12l-6-4" />
                <rect x="3" y="7" width="12" height="10" rx="2" ry="2" />
              </svg>
            </div>

            <h3 className="mt-6 text-2xl font-semibold text-slate-900">
              YariConnect
            </h3>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Our AI-powered 1:1 live video platform matches you with
              professionals who share your goals, industry, or interests. No
              awkward cold calls—just meaningful conversations.
            </p>

            <ul className="mt-8 space-y-3 text-sm text-slate-700">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 ring-1 ring-emerald-900/10">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-3.5 w-3.5 text-emerald-700"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.2 7.25a1 1 0 0 1-1.42 0l-3.8-3.83a1 1 0 1 1 1.42-1.408l3.09 3.11 6.49-6.536a1 1 0 0 1 1.414-.006Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                Smart matching algorithm
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 ring-1 ring-emerald-900/10">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-3.5 w-3.5 text-emerald-700"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.2 7.25a1 1 0 0 1-1.42 0l-3.8-3.83a1 1 0 1 1 1.42-1.408l3.09 3.11 6.49-6.536a1 1 0 0 1 1.414-.006Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                15-min focused sessions
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 ring-1 ring-emerald-900/10">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-3.5 w-3.5 text-emerald-700"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.2 7.25a1 1 0 0 1-1.42 0l-3.8-3.83a1 1 0 1 1 1.42-1.408l3.09 3.11 6.49-6.536a1 1 0 0 1 1.414-.006Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                Built-in conversation guides
              </li>
            </ul>
          </SpotlightCard>

          {/* Card: Clarity Connect */}
          <SpotlightCard
           className="group relative rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/10 border-none sm:p-10"
           spotlightColor="rgba(237, 137, 54, 0.2)">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-orange-200/55 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-sm">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-7 w-7"
              >
                <rect x="3" y="5" width="18" height="16" rx="2" />
                <path d="M16 3v4" />
                <path d="M8 3v4" />
                <path d="M3 11h18" />
              </svg>
            </div>

            <h3 className="mt-6 text-2xl font-semibold text-slate-900">
              Clarity Connect
            </h3>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Curated offline events and workshops designed for deep
              connections. From intimate roundtables to skill-building
              sessions—real networking, in person.
            </p>

            <ul className="mt-8 space-y-3 text-sm text-slate-700">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-orange-50 ring-1 ring-orange-900/10">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-3.5 w-3.5 text-orange-600"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.2 7.25a1 1 0 0 1-1.42 0l-3.8-3.83a1 1 0 1 1 1.42-1.408l3.09 3.11 6.49-6.536a1 1 0 0 1 1.414-.006Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                Curated attendee lists
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-orange-50 ring-1 ring-orange-900/10">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-3.5 w-3.5 text-orange-600"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.2 7.25a1 1 0 0 1-1.42 0l-3.8-3.83a1 1 0 1 1 1.42-1.408l3.09 3.11 6.49-6.536a1 1 0 0 1 1.414-.006Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                Topic-focused workshops
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-orange-50 ring-1 ring-orange-900/10">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-3.5 w-3.5 text-orange-600"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.2 7.25a1 1 0 0 1-1.42 0l-3.8-3.83a1 1 0 1 1 1.42-1.408l3.09 3.11 6.49-6.536a1 1 0 0 1 1.414-.006Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                Premium venues
              </li>
            </ul>
          </SpotlightCard>
        </div>
      </div>
    </section>
  );
}