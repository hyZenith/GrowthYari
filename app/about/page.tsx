"use client";

import { useRef } from "react";
import Image from "next/image";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import dynamic from 'next/dynamic';
import { LiquidButton } from "@/components/ui/shadcn-io/liquid-button";
import { ArrowRight } from "lucide-react";

// Dynamically import VariableProximity
const VariableProximity = dynamic(
    () => import("@/components/ui/shadcn-io/variable-proximity"),
    { ssr: false }
);

export default function AboutPage() {
    const containerRef = useRef(null);

    return (
        <main className="min-h-screen bg-white font-sans text-slate-900">
            <Header />

            {/* Load Roboto Flex for VariableProximity */}
            <link
                href="https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wght@8..144,100..1000&display=swap"
                rel="stylesheet"
            />

            {/* Hero Section - Vertical Layout */}
            <section className="relative w-full">
                <div className="flex flex-col">

                    {/* Top Section: Gradient & Animation */}
                    <div
                        ref={containerRef}
                        className="relative flex min-h-[60vh] flex-col items-center justify-center overflow-hidden bg-linear-to-br from-emerald-50 via-teal-50 to-emerald-100 p-10 lg:p-20 text-center"
                    >
                        {/* Decorative blob */}
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-emerald-200/20 blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-96 w-96 rounded-full bg-teal-200/20 blur-3xl"></div>

                        {/* Top Label */}
                        <div className="relative z-10 mb-8">
                            <div className="inline-flex items-center gap-2 rounded-full bg-white/40 backdrop-blur-md px-3 py-1 text-sm font-medium text-emerald-800 ring-1 ring-emerald-900/10">
                                <span className="flex h-2 w-2 rounded-full bg-emerald-600"></span>
                                About Us
                            </div>
                        </div>

                        {/* Animated Headline */}
                        <div className="relative z-10 flex flex-col items-center justify-center gap-2">
                            <div className="cursor-default text-6xl font-bold tracking-tight text-slate-900 sm:text-7xl md:text-8xl lg:text-9xl flex flex-col gap-2 items-center">
                                <VariableProximity
                                    label={'We build'}
                                    className={'tracking-tight leading-none'}
                                    fromFontVariationSettings="'wght' 400, 'opsz' 8"
                                    toFontVariationSettings="'wght' 900, 'opsz' 144"
                                    containerRef={containerRef}
                                    radius={200}
                                    falloff='linear'
                                />
                                <VariableProximity
                                    label={'Relationships'}
                                    className={'tracking-tight leading-none'}
                                    fromFontVariationSettings="'wght' 700, 'opsz' 8"
                                    toFontVariationSettings="'wght' 900, 'opsz' 144"
                                    containerRef={containerRef}
                                    radius={200}
                                    falloff='linear'
                                />
                            </div>
                        </div>

                        {/* Bottom detail */}
                        <div className="relative z-10 mt-12">
                            <p className="text-xl font-medium text-emerald-900">
                                GrowthYari. Since 2024.
                            </p>
                        </div>
                    </div>

                    {/* Bottom Section: Intro Text */}
                    <div className="flex flex-col items-center justify-center bg-white p-10 lg:p-24">
                        <div className="mx-auto w-full max-w-2xl text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                                Not just a platform. <br />A movement.
                            </h2>
                            <p className="mt-6 text-lg leading-8 text-slate-600">
                                We are on a mission to redefine professional networking. Stop collecting connections—start building relationships that facilitate growth, resilience, and success.
                            </p>
                            <p className="mt-6 text-base leading-7 text-slate-600">
                                We believe that true growth happens when people connect on a deeper level—sharing not just their wins, but their challenges, aspirations, and stories.
                            </p>
                            <div className="mt-10 flex justify-center">
                                <LiquidButton
                                    href="#our-mission"
                                    className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-700/60 bg-white/60 px-6 py-2.5 text-sm font-semibold text-emerald-800 shadow-sm backdrop-blur transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
                                >
                                    <ArrowRight className="h-4 w-4" />
                                    Read Our Mission
                                </LiquidButton>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section id="our-mission" className="py-24 sm:py-32 bg-white">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl lg:text-center">
                        <h2 className="text-base font-semibold leading-7 text-emerald-600">Our Mission</h2>
                        <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl text-balance">
                            Real Networks. Real Conversations.
                        </p>
                        <p className="mt-6 text-lg leading-8 text-slate-600 text-pretty">
                            Whether through our AI-driven 1:1 video matches in <span className="font-semibold text-emerald-700">YariConnect</span> or our curated offline experiences in <span className="font-semibold text-orange-600">Clarity Connect</span>, we provide the spaces where founders and professionals can truly belong.
                        </p>
                    </div>

                    {/* Stats */}
                    <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-3 bg-slate-900/5">
                        <div className="flex flex-col bg-white p-8">
                            <dt className="text-sm font-semibold leading-6 text-slate-600">Active Members</dt>
                            <dd className="order-first text-3xl font-semibold tracking-tight text-emerald-600">2,000+</dd>
                        </div>
                        <div className="flex flex-col bg-white p-8">
                            <dt className="text-sm font-semibold leading-6 text-slate-600">Curated Events</dt>
                            <dd className="order-first text-3xl font-semibold tracking-tight text-emerald-600">50+</dd>
                        </div>
                        <div className="flex flex-col bg-white p-8">
                            <dt className="text-sm font-semibold leading-6 text-slate-600">Connections Made</dt>
                            <dd className="order-first text-3xl font-semibold tracking-tight text-emerald-600">10k+</dd>
                        </div>
                    </dl>
                </div>
            </section>

            <Footer />
        </main>
    );
}
