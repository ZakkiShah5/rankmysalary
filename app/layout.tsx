import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const SITE_URL = "https://salary-percentile.vercel.app";
const OG_IMAGE = `${SITE_URL}/opengraph-image`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: "Salary Percentile Calculator — See Where You Rank by Job & State (2024 BLS Data)",
  description:
    "Free salary percentile calculator using official BLS data. Enter your salary, job category, and state to instantly see what percentile you're in nationally and in your state. Covers 116 occupations across all 50 US states.",
  keywords: [
    "salary percentile calculator",
    "salary percentile by occupation",
    "where does my salary rank",
    "salary comparison by state",
    "BLS salary data",
    "am I paid fairly",
    "salary benchmark calculator",
  ],

  openGraph: {
    title: "Salary Percentile Calculator | See Where You Rank",
    description:
      "Free tool using BLS data. See what percentile your salary is in nationally and in your state across 116 occupations.",
    type: "website",
    url: SITE_URL,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Salary Percentile Calculator" }],
    siteName: "Salary Percentile Calculator",
  },

  twitter: {
    card: "summary_large_image",
    title: "Is Your Salary Above Average? Find Out Free",
    description:
      "Enter your salary and job to see your percentile rank using official BLS data",
    images: [OG_IMAGE],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },

  alternates: { canonical: SITE_URL },

  verification: {
    google: "4yYCc4UhI_s5Urqtehissopxqu2WlKjEdBqhikuRnpQ",
  },

  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} h-full antialiased`}>
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2091517942236891"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Salary Percentile Calculator",
              description: "Free salary percentile calculator using BLS OES data",
              applicationCategory: "FinanceApplication",
              operatingSystem: "Web",
              url: SITE_URL,
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              creator: {
                "@type": "Organization",
                name: "Salary Percentile Calculator",
              },
            }),
          }}
        />
      </head>
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
