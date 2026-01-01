"use client";

import { Linkedin, Mail, Instagram } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative isolate overflow-hidden border-t border-slate-900/10 bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Footer content */}
        <div className=" border-t border-slate-900/10 pt-8 sm:pt-12">
          <div className="grid gap-8 sm:gap-12 md:grid-cols-3 lg:gap-16">
            {/* logo*/}
            <div className="md:col-span-1">
              <Link href="/" className="flex items-center gap-2">
                <img
                  src="/images/logo.png"
                  alt="GrowthYari logo"
                  className="h-8 w-8 rounded-full object-cover sm:h-9 sm:w-9"
                />
                <span className="text-base font-semibold tracking-tight text-slate-900 sm:text-lg">
                  GrowthYari
                </span>
              </Link>
              <p className="mt-3 text-sm leading-6 text-slate-600 sm:mt-4">
                Real networks built through real conversations. Making professional networking accessible and meaningful.
              </p>
              <div className="mt-5 flex gap-4 sm:mt-6">
                <a
                  href="https://www.linkedin.com/company/growthyari"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 transition-colors hover:text-slate-900"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a
                  href="https://x.com/growthyari"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 transition-colors hover:text-slate-900"
                  aria-label="X (formerly Twitter)"
                >
                  <FaXTwitter className="h-5 w-5" />
                </a>
                <a
                  href="mailto:contact@growthyari.com"
                  className="text-slate-600 transition-colors hover:text-slate-900"
                  aria-label="Email"
                >
                  <Mail className="h-5 w-5" />
                </a>
                <a
                  href="https://instagram.com/growthyari"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 transition-colors hover:text-slate-900"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Products and Company in a row on mobile */}
            <div className="grid grid-cols-2 gap-8 sm:col-span-2 md:col-span-2">
              {/* Products */}
              <div className="md:pl-25">
                <h3 className="text-sm font-semibold text-slate-900">Products</h3>
                <ul className="mt-3 space-y-2.5 sm:mt-4 sm:space-y-3">
                  <li>
                    <Link
                      href="/#yariconnect"
                      className="text-sm text-slate-600 transition-colors hover:text-slate-900"
                    >
                      YariConnect
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/#clarity-connect"
                      className="text-sm text-slate-600 transition-colors hover:text-slate-900"
                    >
                      Clarity Connect
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/#pricing"
                      className="text-sm text-slate-600 transition-colors hover:text-slate-900"
                    >
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/#for-teams"
                      className="text-sm text-slate-600 transition-colors hover:text-slate-900"
                    >
                      For Teams
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Company */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Company</h3>
                <ul className="mt-3 space-y-2.5 sm:mt-4 sm:space-y-3">
                  <li>
                    <Link
                      href="/about"
                      className="text-sm text-slate-600 transition-colors hover:text-slate-900"
                    >
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/#blog"
                      className="text-sm text-slate-600 transition-colors hover:text-slate-900"
                    >
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/#careers"
                      className="text-sm text-slate-600 transition-colors hover:text-slate-900"
                    >
                      Careers
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      className="text-sm text-slate-600 transition-colors hover:text-slate-900"
                    >
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-10 border-t border-slate-900/10 pt-6 sm:mt-12 sm:pt-8">
            <p className="text-center text-xs text-slate-500 sm:text-sm">
              © {new Date().getFullYear()} GrowthYari. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
