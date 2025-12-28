"use client";

import { useState, useRef } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Input } from "@/components/ui/Input";
import { Linkedin, Mail, Instagram, MapPin, Phone, Send } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import dynamic from 'next/dynamic';
import { LiquidButton } from "@/components/ui/shadcn-io/liquid-button";

// Dynamically import VariableProximity to avoid SSR issues with window/document
const VariableProximity = dynamic(
    () => import("@/components/ui/shadcn-io/variable-proximity"),
    { ssr: false }
);

export default function ContactPage() {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const containerRef = useRef(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        // Simulate form submission
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setLoading(false);
        setSubmitted(true);
    }

    return (
        <main className="min-h-screen bg-white font-sans text-slate-900">
            <Header />

            {/* Load Roboto Flex for VariableProximity */}
            <link
                href="https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wght@8..144,100..1000&display=swap"
                rel="stylesheet"
            />

            <section className="relative w-full">
                <div className="grid min-h-[calc(100vh-64px)] grid-cols-1 lg:grid-cols-2">

                    {/* Left Column: Gradient & Animation */}
                    <div
                        ref={containerRef}
                        className="relative flex flex-col justify-between overflow-hidden bg-linear-to-br from-emerald-50 via-teal-50 to-emerald-100 p-10 lg:p-20"
                    >
                        {/* Decorative blob */}
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-emerald-200/20 blur-3xl"></div>

                        {/* Top content (optional, e.g. logo if not using global header) */}
                        <div className="relative z-10 hidden sm:block">
                            <div className="inline-flex items-center gap-2 rounded-full bg-white/40 backdrop-blur-md px-3 py-1 text-sm font-medium text-emerald-800 ring-1 ring-emerald-900/10">
                                <span className="flex h-2 w-2 rounded-full bg-emerald-600"></span>
                                Contact Us
                            </div>
                        </div>

                        {/* Animated Headline */}
                        <div className="relative z-10 mt-10 lg:mt-0 flex flex-col items-start justify-center">
                            <div className="cursor-default text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl md:text-7xl lg:text-8xl flex flex-col gap-2">
                                <VariableProximity
                                    label={'Let’s work'}
                                    className={'tracking-tight leading-none'}
                                    fromFontVariationSettings="'wght' 400, 'opsz' 8"
                                    toFontVariationSettings="'wght' 900, 'opsz' 144"
                                    containerRef={containerRef}
                                    radius={200}
                                    falloff='linear'
                                />
                                <VariableProximity
                                    label={'together'}
                                    className={'tracking-tight leading-none'}
                                    fromFontVariationSettings="'wght' 400, 'opsz' 8"
                                    toFontVariationSettings="'wght' 900, 'opsz' 144"
                                    containerRef={containerRef}
                                    radius={200}
                                    falloff='linear'
                                />
                            </div>
                            <p className="mt-6 max-w-md text-lg text-slate-600">
                                We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                            </p>
                        </div>

                        {/* Contact Details */}
                        <div className="relative z-10 mt-12 space-y-6 lg:mt-0">
                            <div>
                                <a href="mailto:contact@growthyari.com" className="text-xl font-medium text-slate-900 hover:underline hover:text-emerald-700 transition-colors">
                                    contact@growthyari.com
                                </a>
                            </div>
                            <div className="text-base text-slate-600">
                                <p>New Delhi, India</p>
                                <a href="tel:+919999999999" className="hover:text-emerald-700 transition-colors">+91 99999 99999</a>
                            </div>
                            <div className="flex gap-4">
                                <a href="https://www.linkedin.com/company/growthyari" target="_blank" rel="noopener noreferrer" className="rounded-full bg-white/50 p-2 text-slate-600 hover:bg-white hover:text-emerald-700 transition-all">
                                    <Linkedin className="h-5 w-5" />
                                </a>
                                <a href="https://x.com/growthyari" target="_blank" rel="noopener noreferrer" className="rounded-full bg-white/50 p-2 text-slate-600 hover:bg-white hover:text-emerald-700 transition-all">
                                    <FaXTwitter className="h-5 w-5" />
                                </a>
                                <a href="https://instagram.com/growthyari" target="_blank" rel="noopener noreferrer" className="rounded-full bg-white/50 p-2 text-slate-600 hover:bg-white hover:text-emerald-700 transition-all">
                                    <Instagram className="h-5 w-5" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Form */}
                    <div className="flex flex-col justify-center bg-white p-10 lg:p-24">
                        <div className="mx-auto w-full max-w-lg">
                            {submitted ? (
                                <div className="text-center">
                                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 mb-6">
                                        <Mail className="h-8 w-8 text-emerald-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900">Message Sent!</h3>
                                    <p className="mt-3 text-slate-600">Thanks for reaching out! We'll get back to you within 24 hours.</p>
                                    <button
                                        onClick={() => setSubmitted(false)}
                                        className="mt-8 text-sm font-semibold text-emerald-600 hover:text-emerald-500 underline"
                                    >
                                        Send another message
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-8">
                                    <div className="space-y-1">
                                        <label htmlFor="fullname" className="block text-sm font-medium text-slate-900">
                                            Full Name
                                        </label>
                                        <Input
                                            id="fullname"
                                            name="fullname"
                                            type="text"
                                            placeholder="John Doe"
                                            required
                                            className="border-0 border-b border-slate-200 px-0 rounded-none focus-visible:ring-0 focus-visible:border-emerald-600 bg-transparent placeholder:text-slate-400"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label htmlFor="email" className="block text-sm font-medium text-slate-900">
                                            Email Address
                                        </label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="john@example.com"
                                            required
                                            className="border-0 border-b border-slate-200 px-0 rounded-none focus-visible:ring-0 focus-visible:border-emerald-600 bg-transparent placeholder:text-slate-400"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label htmlFor="phone" className="block text-sm font-medium text-slate-900">
                                            Phone (Optional)
                                        </label>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            placeholder="+91..."
                                            className="border-0 border-b border-slate-200 px-0 rounded-none focus-visible:ring-0 focus-visible:border-emerald-600 bg-transparent placeholder:text-slate-400"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label htmlFor="message" className="block text-sm font-medium text-slate-900">
                                            Message
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            rows={3}
                                            placeholder="Tell us about your inquiry..."
                                            required
                                            className="min-h-[100px] w-full resize-none border-0 border-b border-slate-200 bg-transparent px-0 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-0"
                                        />
                                    </div>

                                    <div className="pt-4">
                                        <LiquidButton
                                            type="submit"
                                            disabled={loading}
                                            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-emerald-700/60 bg-white/60 px-6 py-2.5 text-sm font-semibold text-emerald-800 shadow-sm backdrop-blur transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
                                        >
                                            <Send className="h-4 w-4" />
                                            {loading ? "Sending..." : "Send Message"}
                                        </LiquidButton>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
