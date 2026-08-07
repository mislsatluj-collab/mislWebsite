import Link from "next/link";
import { Globe, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#1E3A8A] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <h3 className="text-2xl font-bold text-primary mb-4">Misl Satluj</h3>
            <p className="text-gray-400 mb-6 max-w-sm">
              ਮਿਸਲ ਸਤਲੁਜ ਇੱਕ ਸਮਾਜਿਕ ਅਤੇ ਰਾਜਨੀਤਿਕ ਜਥੇਬੰਦੀ ਹੈ| ਜੋ ਪੰਜਾਬ ਕੇਂਦਰਿਤ ਰਾਜਨੀਤੀ ਖੜੀ ਕਰਨ ਲਈ ਵਚਨਬੱਧ ਹੈ|
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Globe size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <MessageCircle size={24} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/media" className="text-gray-400 hover:text-white transition-colors">Media Center</Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact / Join</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-xl font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-gray-400">
              <li>Punjab, India</li>
              <li>info@mislsatluj.com</li>
              <li>+91 98765 43210</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Misl Satluj. All rights reserved.</p>
          <p className="mt-4 md:mt-0">Developed with precision & care.</p>
        </div>
      </div>
    </footer>
  );
}
