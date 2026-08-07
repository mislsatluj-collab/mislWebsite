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

export const metadata: Metadata = {
  title: "Misl Satluj | Punjab Politics & News",
  description: "ਮਿਸਲ ਸਤਲੁਜ ਇੱਕ ਸਮਾਜਿਕ ਅਤੇ ਰਾਜਨੀਤਿਕ ਜਥੇਬੰਦੀ ਹੈ ਜੋ ਪੰਜਾਬ ਕੇਂਦਰਿਤ ਰਾਜਨੀਤੀ ਖੜੀ ਕਰਨ ਲਈ ਵਚਨਬੱਧ ਹੈ।",
  icons: {
    icon: [
      { url: "/logo.jpg", type: "image/jpeg" },
      { url: "/favicon.ico" }
    ],
    shortcut: "/logo.jpg",
    apple: "/logo.jpg",
  },
  openGraph: {
    title: "Misl Satluj | Punjab Politics & News",
    description: "ਮਿਸਲ ਸਤਲੁਜ ਇੱਕ ਸਮਾਜਿਕ ਅਤੇ ਰਾਜਨੀਤਿਕ ਜਥੇਬੰਦੀ ਹੈ ਜੋ ਪੰਜਾਬ ਕੇਂਦਰਿਤ ਰਾਜਨੀਤੀ ਖੜੀ ਕਰਨ ਲਈ ਵਚਨਬੱਧ ਹੈ।",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
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
