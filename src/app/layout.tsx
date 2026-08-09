import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PunjabWatermark from "@/components/PunjabWatermark";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mislsatluj.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Misl Satluj | Punjab Politics, News & Youth Movement",
    template: "%s | Misl Satluj",
  },
  description: "ਮਿਸਲ ਸਤਲੁਜ ਇੱਕ ਸਮਾਜਿਕ ਅਤੇ ਰਾਜਨੀਤਿਕ ਜਥੇਬੰਦੀ ਹੈ ਜੋ ਪੰਜਾਬ ਕੇਂਦਰਿਤ ਰਾਜਨੀਤੀ ਖੜੀ ਕਰਨ ਅਤੇ ਨੌਜਵਾਨ ਲੀਡਰਸ਼ਿਪ ਪੈਦਾ ਕਰਨ ਲਈ ਵਚਨਬੱਧ ਹੈ।",
  keywords: [
    "Misl Satluj",
    "Punjab Politics",
    "Sikh Youth Movement",
    "Panthic News",
    "ਮਿਸਲ ਸਤਲੁਜ",
    "ਪੰਜਾਬ ਰਾਜਨੀਤੀ",
    "ਗੱਲ ਪੰਥ ਦੀ ਗੱਲ ਪੰਜਾਬ ਦੀ"
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/logo.jpg", type: "image/jpeg" },
      { url: "/favicon.ico" }
    ],
    shortcut: "/logo.jpg",
    apple: "/logo.jpg",
  },
  openGraph: {
    type: "website",
    locale: "pa_IN",
    url: siteUrl,
    title: "Misl Satluj | Punjab Politics & News",
    description: "ਮਿਸਲ ਸਤਲੁਜ ਇੱਕ ਸਮਾਜਿਕ ਅਤੇ ਰਾਜਨੀਤਿਕ ਜਥੇਬੰਦੀ ਹੈ ਜੋ ਪੰਜਾਬ ਕੇਂਦਰਿਤ ਰਾਜਨੀਤੀ ਖੜੀ ਕਰਨ ਲਈ ਵਚਨਬੱਧ ਹੈ।",
    siteName: "Misl Satluj",
    images: [
      {
        url: "/logo.jpg",
        width: 1200,
        height: 630,
        alt: "Misl Satluj Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Misl Satluj | Punjab Politics & News",
    description: "ਮਿਸਲ ਸਤਲੁਜ ਇੱਕ ਸਮਾਜਿਕ ਅਤੇ ਰਾਜਨੀਤਿਕ ਜਥੇਬੰਦੀ ਹੈ ਜੋ ਪੰਜਾਬ ਕੇਂਦਰਿਤ ਰਾਜਨੀਤੀ ਖੜੀ ਕਰਨ ਲਈ ਵਚਨਬੱਧ ਹੈ।",
    images: ["/logo.jpg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Misl Satluj",
  "alternateName": "ਮਿਸਲ ਸਤਲੁਜ",
  "url": siteUrl,
  "logo": `${siteUrl}/logo.jpg`,
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+91-9814754739",
    "contactType": "customer service",
    "areaServed": "IN",
    "availableLanguage": ["Punjabi", "English"]
  },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Kisan Bhawan, Sector 35",
    "addressLocality": "Chandigarh",
    "addressRegion": "Punjab",
    "addressCountry": "IN"
  },
  "sameAs": [
    "https://facebook.com",
    "https://instagram.com"
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pa"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#f5c03b] text-[#1d2ccf] relative overflow-x-hidden">
        {/* Continuous Punjab Background Image Watermark */}
        <PunjabWatermark />
        
        <Navbar />
        <main className="flex-grow pt-20 relative z-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
