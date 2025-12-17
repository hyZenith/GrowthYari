export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-900/10 bg-white/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        <a href="/" className="flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-700 text-lg font-semibold text-white">
            G
          </span>
          <span className="text-lg font-semibold tracking-tight text-slate-900">
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
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <path d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
              </svg>
              Dashboard
            </a>

            <a
              href="/services"
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
          </div>
        </nav>

        <a
          href="#get-started"
          className="ml-auto inline-flex items-center gap-2 rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
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
      </div>
    </header>
  );
}