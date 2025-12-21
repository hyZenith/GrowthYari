import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GrowthYari",
  description:
    "Discover the path to healthy minds with GrowthYari — a mindset-building platform to enhance resilience and positivity in young adults.",
  keywords: [
    "growth",
    "mindset",
    "personal development",
    "resilience",
    "wellbeing",
    "GrowthYari",
  ],
  openGraph: {
    title: "GrowthYari",
    description:
      "Discover the path to healthy minds with GrowthYari — a mindset-building platform to enhance resilience and positivity in young adults.",
    type: "website",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.growthyari.com/",
    siteName: "GrowthYari",
    images: [
      {
        url:
          (process.env.NEXT_PUBLIC_SITE_URL || "https://www.growthyari.com/") +
          "/images/logo.png",
        width: 1200,
        height: 630,
        alt: "GrowthYari logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GrowthYari",
    description:
      "Discover the path to healthy minds with GrowthYari — a mindset-building platform to enhance resilience and positivity in young adults.",
    images: [
      (process.env.NEXT_PUBLIC_SITE_URL || "https://www.growthyari.com/") +
        "/images/logo.png",
    ],
  },
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || "https://www.growthyari.com/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.growthyari.com/";
  const logoUrl = `${siteUrl}/images/logo.png`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "GrowthYari",
    url: siteUrl,
    logo: logoUrl,
    sameAs: [],
  };

  return (
    <html lang="en">
      <head>
        <link rel="canonical" href={siteUrl} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
