"use client";

import { Linkedin, Mail, Instagram } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";

export function Footer() {
  return (
    <footer className="relative isolate overflow-hidden border-t border-slate-900/10 bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Footer content */}
        <div className=" border-t border-slate-900/10 pt-12">
          <div className="grid gap-12 md:grid-cols-3 lg:gap-16">
            {/* logo*/}
            <div className="md:col-span-1">
              <a href="/" className="flex items-center gap-2">
                <img
                  src="/images/logo.png"
                  alt="GrowthYari logo"
                  className="h-9 w-9 rounded-full object-cover"
                />
                <span className="text-lg font-semibold tracking-tight text-slate-900">
                  GrowthYari
                </span>
              </a>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                Real networks built through real conversations. Making professional networking accessible and meaningful.
              </p>
              <div className="mt-6 flex gap-4">
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

            {/* Products */}
            <div className="pl-25">
              <h3 className="text-sm font-semibold text-slate-900">Products</h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <a
                    href="#yariconnect"
                    className="text-sm text-slate-600 transition-colors hover:text-slate-900"
                  >
                    YariConnect
                  </a>
                </li>
                <li>
                  <a
                    href="#clarity-connect"
                    className="text-sm text-slate-600 transition-colors hover:text-slate-900"
                  >
                    Clarity Connect
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="text-sm text-slate-600 transition-colors hover:text-slate-900"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#for-teams"
                    className="text-sm text-slate-600 transition-colors hover:text-slate-900"
                  >
                    For Teams
                  </a>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Company</h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <a
                    href="#about-us"
                    className="text-sm text-slate-600 transition-colors hover:text-slate-900"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#blog"
                    className="text-sm text-slate-600 transition-colors hover:text-slate-900"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#careers"
                    className="text-sm text-slate-600 transition-colors hover:text-slate-900"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="text-sm text-slate-600 transition-colors hover:text-slate-900"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-12 border-t border-slate-900/10 pt-8">
            <p className="text-center text-sm text-slate-500">
              © {new Date().getFullYear()} GrowthYari. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
