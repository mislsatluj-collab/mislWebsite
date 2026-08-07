"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { title: "ਮਿਸਲ ਸਤਲੁਜ", href: "/" },
    { title: "ਸਾਡੇ ਬਾਰੇ (About)", href: "/about" },
    { title: "ਮੀਡੀਆ ਸੈਂਟਰ (Media)", href: "/media" },
    { title: "ਮੈਂਬਰ ਬਣੋ (Contact)", href: "/contact" },
  ];

  return (
    <nav className="fixed w-full z-50 bg-[#1d2ccf]/90 backdrop-blur-xl border-b border-white/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center gap-2">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-12 h-12 relative rounded-full overflow-hidden shadow-md bg-white">
                <Image src="/logo.jpg" alt="Misl Satluj Logo" fill className="object-cover" />
              </div>
              <span className="font-bold text-2xl tracking-tight text-white drop-shadow-sm hidden sm:block">Misl Satluj</span>
            </Link>
          </div>
          
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="text-white/90 hover:text-accent transition-colors font-medium px-3 py-2 rounded-md hover:bg-white/10"
              >
                {link.title}
              </Link>
            ))}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-accent focus:outline-none"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#1d2ccf]/95 backdrop-blur-xl border-b border-white/10 overflow-hidden shadow-xl"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-4 text-base font-medium text-white hover:text-accent hover:bg-white/10 rounded-md transition-colors"
                >
                  {link.title}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
