"use client";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Send } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-foreground/5 py-20 border-b border-foreground/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-foreground mb-4"
          >
            ਮੈਂਬਰ ਬਣੋ (Contact Us)
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-foreground/70 max-w-2xl mx-auto"
          >
            ਸਾਡੇ ਨਾਲ ਜੁੜੋ ਅਤੇ ਪੰਜਾਬ ਦੀ ਬਿਹਤਰੀ ਲਈ ਆਪਣਾ ਯੋਗਦਾਨ ਪਾਓ
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold mb-8">ਸੰਪਰਕ ਜਾਣਕਾਰੀ</h2>
            
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 text-primary">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">ਮੁੱਖ ਦਫਤਰ</h3>
                  <p className="text-foreground/70 text-lg">
                    ਕਿਸਾਨ ਭਵਨ, ਸੈਕਟਰ 35<br />
                    ਚੰਡੀਗੜ੍ਹ, ਪੰਜਾਬ
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 text-primary">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">ਫੋਨ ਨੰਬਰ</h3>
                  <p className="text-foreground/70 text-lg">
                    +91 98147 54739<br />
                    +91 89686 17046
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 text-primary">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">ਈ-ਮੇਲ</h3>
                  <p className="text-foreground/70 text-lg">
                    info@mislsatluj.com
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-foreground/5 p-8 rounded-3xl shadow-xl border border-foreground/10"
          >
            <h2 className="text-2xl font-bold mb-6 text-center">ਮੈਂਬਰਸ਼ਿਪ ਫਾਰਮ</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">ਪੂਰਾ ਨਾਮ (Full Name)</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-primary outline-none transition-all"
                    placeholder="ਤੁਹਾਡਾ ਨਾਮ"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">ਫੋਨ ਨੰਬਰ (Phone)</label>
                  <input 
                    type="tel" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-primary outline-none transition-all"
                    placeholder="1234567890"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">ਪਿੰਡ/ਸ਼ਹਿਰ (Village/City)</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="ਤੁਹਾਡਾ ਪਿੰਡ ਜਾਂ ਸ਼ਹਿਰ"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">ਸੁਨੇਹਾ (Message)</label>
                <textarea 
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="ਤੁਸੀਂ ਇਸ ਮੁਹਿੰਮ ਵਿੱਚ ਕਿਵੇਂ ਸੇਵਾ ਕਰ ਸਕਦੇ ਹੋ..."
                ></textarea>
              </div>

              <button 
                type="button"
                className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                ਜਮ੍ਹਾਂ ਕਰੋ <Send size={20} />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
