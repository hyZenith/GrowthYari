"use client";

import { useEffect, useRef, useState } from "react";

export function ConnectionSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0); // 0..1

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const viewportH = window.innerHeight || 1;
      
      const sectionTop = rect.top;
      const sectionBottom = rect.bottom;
      const sectionHeight = rect.height;
      
      // Start filling when section top reaches 30% from top of viewport
      // Finish when section bottom reaches 70% from top of viewport
      const startTrigger = viewportH * 0.3;
      const endTrigger = viewportH * 0.7;
      
      // Calculate progress: 0 when section enters trigger zone, 1 when it exits
      if (sectionBottom < startTrigger) {
        // Section hasn't reached trigger yet
        setProgress(0);
        return;
      }
      
      if (sectionTop > endTrigger) {
        // Section has passed trigger zone
        setProgress(1);
        return;
      }
      
      // Calculate progress based on how much of section has scrolled through trigger zone
      // The effective scroll range is from when top hits startTrigger to when bottom hits endTrigger
      const scrollableDistance = sectionHeight + (endTrigger - startTrigger);
      const distanceScrolled = startTrigger - sectionTop;
      
      const p = Math.max(0, Math.min(1, distanceScrolled / scrollableDistance));
      setProgress(p);
    };

    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="relative isolate overflow-hidden bg-[#fbfaf7] py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="text-xs font-semibold tracking-[0.2em] text-emerald-700">
            HOW IT WORKS
          </div>
          <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Four Steps to{" "}
            <span className="font-serif italic text-emerald-700">
              Meaningful Connections
            </span>
          </h2>
          <p className="mt-5 text-pretty text-lg text-slate-600">
            Building your professional network shouldn&apos;t be complicated.
            Here&apos;s how GrowthYari makes it effortless.
          </p>
        </div>

        <div className="relative mx-auto mt-16 max-w-5xl">
          {/* center line */}
          <div className="pointer-events-none absolute left-1/2 top-0 bottom-0 -translate-x-1/2">
            <div className="relative h-full w-px bg-slate-200">
              <div
                aria-hidden="true"
                className="absolute left-1/2 top-0 -translate-x-1/2 rounded-full bg-emerald-600 shadow-[0_0_24px_rgba(16,185,129,0.65)] transition-all duration-150"
                style={{
                  width: "3px",
                  height: `${progress * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="grid gap-14">
            {/* Step 1 - left */}
            <div className="group grid items-center gap-8 md:grid-cols-[1fr_auto_1fr]">
              <div className="relative text-left transition-transform duration-300 group-hover:scale-105">
                <div className="pointer-events-none absolute -left-2 -top-8 text-6xl font-semibold text-emerald-900/10">
                  01
                </div>
                <div className="text-lg font-semibold text-slate-900">
                  Create Your Profile
                </div>
                <div className="mt-2 text-sm leading-6 text-slate-600">
                  Tell us about your professional background, goals, and what
                  kind of connections you&apos;re seeking.
                </div>
              </div>

              <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-900/10 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-emerald-500/30">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-emerald-700 transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
                  <path d="M19 8v6" />
                  <path d="M16 11h6" />
                </svg>
              </div>

              <div className="hidden md:block" />
            </div>

            {/* Step 2 - right */}
            <div className="group grid items-center gap-8 md:grid-cols-[1fr_auto_1fr]">
              <div className="hidden md:block" />

              <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-900/10 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-emerald-500/30">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-emerald-700 transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                >
                  <circle cx="12" cy="12" r="9" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>

              <div className="relative text-right md:text-left transition-transform duration-300 group-hover:scale-105">
                <div className="pointer-events-none absolute -right-2 -top-8 text-6xl font-semibold text-emerald-900/10 md:static md:hidden">
                  02
                </div>
                <div className="hidden md:block pointer-events-none absolute -right-2 -top-8 text-6xl font-semibold text-emerald-900/10">
                  02
                </div>
                <div className="text-lg font-semibold text-slate-900">
                  Get Matched
                </div>
                <div className="mt-2 text-sm leading-6 text-slate-600">
                  Our algorithm finds professionals whose goals align with
                  yours—whether it&apos;s mentorship, collaboration, or knowledge
                  sharing.
                </div>
              </div>
            </div>

            {/* Step 3 - left */}
            <div className="group grid items-center gap-8 md:grid-cols-[1fr_auto_1fr]">
              <div className="relative text-left transition-transform duration-300 group-hover:scale-105">
                <div className="pointer-events-none absolute -left-2 -top-8 text-6xl font-semibold text-emerald-900/10">
                  03
                </div>
                <div className="text-lg font-semibold text-slate-900">
                  Connect Live
                </div>
                <div className="mt-2 text-sm leading-6 text-slate-600">
                  Schedule a 15-minute video call at a time that works for both.
                  We provide conversation guides to break the ice.
                </div>
              </div>

              <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-900/10 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-emerald-500/30">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-emerald-700 transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                >
                  <path d="M15 10 21 6v12l-6-4" />
                  <rect x="3" y="7" width="12" height="10" rx="2" ry="2" />
                </svg>
              </div>

              <div className="hidden md:block" />
            </div>

            {/* Step 4 - right */}
            <div className="group grid items-center gap-8 md:grid-cols-[1fr_auto_1fr]">
              <div className="hidden md:block" />

              <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-900/10 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-emerald-500/30">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-emerald-700 transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                >
                  <path d="M21 12a9 9 0 0 1-15 6.7L3 21l2.3-3A9 9 0 1 1 21 12Z" />
                  <path d="M8 12h8" />
                  <path d="M12 8v8" />
                </svg>
              </div>

              <div className="relative text-right md:text-left transition-transform duration-300 group-hover:scale-105">
                <div className="hidden md:block pointer-events-none absolute -right-2 -top-8 text-6xl font-semibold text-emerald-900/10">
                  04
                </div>
                <div className="text-lg font-semibold text-slate-900">
                  Grow Your Network
                </div>
                <div className="mt-2 text-sm leading-6 text-slate-600">
                  Rate your connections, refine your preferences, and watch your
                  professional network flourish organically.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}