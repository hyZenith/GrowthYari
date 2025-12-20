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
      className="relative isolate overflow-hidden bg-[#fbfaf7] py-16 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="text-xs font-semibold tracking-[0.2em] text-emerald-700">
            HOW IT WORKS
          </div>
          <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
            Four Steps to{" "}
            <span className="font-serif italic text-emerald-700">
              Meaningful Connections
            </span>
          </h2>
          <p className="mt-4 text-pretty text-base text-slate-600 sm:mt-5 sm:text-lg">
            Building your professional network shouldn&apos;t be complicated.
            Here&apos;s how GrowthYari makes it effortless.
          </p>
        </div>

        <div className="relative mx-auto mt-10 max-w-5xl sm:mt-16">
          {/* center line - dotted circular - hidden on mobile */}
          <div className="group/line pointer-events-auto absolute left-1/2 top-0 bottom-0 -translate-x-1/2 cursor-pointer hidden md:block">
            <div className="relative h-full flex flex-col justify-start items-center gap-4 py-2">
              {/* Background hollow circular dots */}
              {Array.from({ length: 30 }).map((_, i) => (
                <div
                  key={`bg-${i}`}
                  className="rounded-full border-2 border-slate-300 bg-transparent transition-all duration-300 group-hover/line:scale-150"
                  style={{
                    width: "10px",
                    height: "10px",
                  }}
                />
              ))}
              
              {/* Animated progress filled dots overlay */}
              <div
                className="absolute left-0 top-0 w-full flex flex-col justify-start items-center gap-4 py-2 overflow-hidden"
                style={{
                  height: `${progress * 100}%`,
                }}
              >
                {Array.from({ length: 30 }).map((_, i) => (
                  <div
                    key={`progress-${i}`}
                    className="rounded-full bg-emerald-600 transition-all duration-300 group-hover/line:scale-150"
                    style={{
                      width: "10px",
                      height: "10px",
                      boxShadow: '0 0 12px rgba(5, 150, 105, 0.8)',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-10 sm:gap-14">
            {/* Step 1 - left */}
            <div className="group grid items-center gap-4 sm:gap-8 md:grid-cols-[1fr_auto_1fr]">
              <div className="order-2 md:order-1 relative text-left transition-transform duration-300 group-hover:scale-105">
                <div className="pointer-events-none absolute -left-2 -top-8 text-6xl font-bold text-emerald-600/20 sm:text-7xl md:text-5xl md:font-semibold md:text-emerald-900/10">
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

              <div className="order-1 md:order-2 relative z-10 mx-auto hidden md:flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-900/10 transition-all duration-300 group-hover:scale-125 group-hover:shadow-xl group-hover:shadow-emerald-500/50 sm:h-14 sm:w-14 md:mx-0">
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

              <div className="hidden md:block order-3" />
            </div>

            {/* Step 2 - right */}
            <div className="group grid items-center gap-4 sm:gap-8 md:grid-cols-[1fr_auto_1fr]">
              <div className="hidden md:block" />

              <div className="order-1 relative z-10 mx-auto hidden md:flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-900/10 transition-all duration-300 group-hover:scale-125 group-hover:shadow-xl group-hover:shadow-emerald-500/50 sm:h-14 sm:w-14 md:mx-0">
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

              <div className="order-2 relative text-right md:col-start-3 md:text-right transition-transform duration-300 group-hover:scale-105">
                <div className="pointer-events-none absolute -right-2 -top-8 text-6xl font-bold text-emerald-600/20 sm:text-7xl md:hidden">
                  02
                </div>
                <div className="hidden md:block pointer-events-none absolute -right-2 -top-8 text-5xl font-semibold text-emerald-900/10 sm:text-6xl">
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
            <div className="group grid items-center gap-4 sm:gap-8 md:grid-cols-[1fr_auto_1fr]">
              <div className="order-2 md:order-1 relative text-left transition-transform duration-300 group-hover:scale-105">
                <div className="pointer-events-none absolute -left-2 -top-8 text-6xl font-bold text-emerald-600/20 sm:text-7xl md:text-5xl md:font-semibold md:text-emerald-900/10">
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

              <div className="order-1 md:order-2 relative z-10 mx-auto hidden md:flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-900/10 transition-all duration-300 group-hover:scale-125 group-hover:shadow-xl group-hover:shadow-emerald-500/50 sm:h-14 sm:w-14 md:mx-0">
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

              <div className="hidden md:block order-3" />
            </div>

            {/* Step 4 - right */}
            <div className="group grid items-center gap-4 sm:gap-8 md:grid-cols-[1fr_auto_1fr]">
              <div className="hidden md:block" />

              <div className="order-1 relative z-10 mx-auto hidden md:flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-900/10 transition-all duration-300 group-hover:scale-125 group-hover:shadow-xl group-hover:shadow-emerald-500/50 sm:h-14 sm:w-14 md:mx-0">
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

              <div className="order-2 relative text-right md:col-start-3 md:text-right transition-transform duration-300 group-hover:scale-105">
                <div className="pointer-events-none absolute -right-2 -top-8 text-6xl font-bold text-emerald-600/20 sm:text-7xl md:hidden">
                  04
                </div>
                <div className="hidden md:block pointer-events-none absolute -right-2 -top-8 text-5xl font-semibold text-emerald-900/10 sm:text-6xl">
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