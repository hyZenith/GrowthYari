"use client"

import { useRef } from "react";
import VariableProximity from "./ui/shadcn-io/variable-proximity";
import { LiquidButton } from "./ui/shadcn-io/liquid-button";
import SplashCursor from "./SplashCursor";

export function HeroSection() {
  const containerRef = useRef(null);
  return (
    <section className="relative isolate overflow-hidden bg-white">
      {/* Splash Cursor Effect - scoped to hero section */}
      <SplashCursor 
        DENSITY_DISSIPATION={2}
        VELOCITY_DISSIPATION={1.5}
        SPLAT_FORCE={4000}
        SPLAT_RADIUS={0.15}
      />
      
      {/* background bubbles */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-white/40" />

        <div className="gy-bubble-a absolute left-1/2 top-10 h-[420px] w-[420px] -translate-x-[85%] rounded-full bg-emerald-300/80 blur-3xl" />
        <div className="gy-bubble-b absolute left-1/2 top-28 h-[520px] w-[520px] -translate-x-[10%] rounded-full bg-orange-300/80 blur-3xl" />

        <div className="absolute inset-0 bg-linear-to-b from-white/60 via-white/30 to-white" />
      </div>

      {/* content */}
      <div className="relative mx-auto flex min-h-[calc(100vh-64px)] max-w-7xl flex-col items-center justify-center px-4 pb-20 pt-24 text-center sm:px-6 lg:px-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-800">
          <span className="h-2 w-2 rounded-full bg-emerald-600" />
          Real Networks. Real Conversations.
        </div>

        <div className="mt-8 text-balance text-4xl font-semibold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
          <div>
            <link
              href="https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wght@8..144,100..1000&display=swap"
              rel="stylesheet"
            />
            <div
              ref={containerRef}
              className="text-[100px] font-semibold"
            >
              <VariableProximity
                label={'Professional Networking'}
                className={'text-center '}
                fromFontVariationSettings="'wght' 400, 'opsz' 12"
                toFontVariationSettings="'wght' 700, 'opsz' 144"
                containerRef={containerRef}
                radius={120}
                falloff='linear'
              />

            </div>
          </div>
          <span className="font-serif italic text-emerald-700">Reimagined</span>
        </div>

        <p className="mt-6 max-w-2xl text-pretty text-lg text-slate-600 sm:text-xl">
          Stop collecting connections. Start building relationships through
          meaningful 1:1 video conversations and curated offline events.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#start"
            className="group inline-flex w-full items-center justify-center rounded-full bg-emerald-700 px-7 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 sm:w-auto"
          >
            Start Connecting Free
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

          <LiquidButton
            href="#how-it-works"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-emerald-700/60 bg-white/60 px-7 py-3 text-sm font-semibold text-emerald-800 shadow-sm backdrop-blur transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 sm:w-auto"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4"
            >
              <path d="M6.5 5.75A.75.75 0 0 1 7.25 5h.57c.31 0 .6.12.82.34l5.02 5.02c.37.37.37.98 0 1.35l-5.02 5.02c-.22.22-.51.34-.82.34h-.57a.75.75 0 0 1-.75-.75V5.75Z" />
            </svg>
            Watch How It Works
          </LiquidButton>
        </div>

        <div className="mt-14 text-2xl text-slate-500">Trusted by professionals </div>
        {/* <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-sm font-semibold text-slate-400">
          <span>Google</span>
          <span>Microsoft</span>
          <span>Amazon</span>
          <span>Meta</span>
          <span>Startup India</span>
        </div> */}
      </div>
    </section>
  );
}