"use client";
import Image from "next/image";
import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary/5 py-20 border-b border-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-foreground mb-4"
          >
            ਸਾਡੇ ਬਾਰੇ (About Us)
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-foreground/70 max-w-2xl mx-auto"
          >
            ਜਾਣੋ ਮਿਸਲ ਸਤਲੁਜ ਦੇ ਇਤਿਹਾਸ ਅਤੇ ਉਦੇਸ਼ਾਂ ਬਾਰੇ
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl"
          >
            <Image
              src="/images/scraped_2.jpeg"
              alt="Misl Satluj History"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <div className="text-white font-semibold text-xl border-l-4 border-primary pl-4">
                "ਗੱਲ ਪੰਥ ਦੀ, ਗੱਲ ਪੰਜਾਬ ਦੀ"
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-3xl font-bold mb-6 text-primary">ਸਾਡੀ ਵਿਚਾਰਧਾਰਾ</h2>
              <p className="text-lg text-foreground/80 leading-relaxed">
                ਮਿਸਲ ਸਤਲੁਜ ਇੱਕ ਸਮਾਜਿਕ ਅਤੇ ਰਾਜਨੀਤਿਕ ਜਥੇਬੰਦੀ ਹੈ| ਜੋ ਪੰਜਾਬ ਕੇਂਦਰਿਤ ਰਾਜਨੀਤੀ ਖੜੀ ਕਰਨ ਲਈ ਵਚਨਬੱਧ ਹੈ| ਇਹ ਜਥੇਬੰਦੀ ਪੰਜਾਬ ਵਿੱਚ ਨਵੀਂ ਨੌਜਵਾਨ ਲੀਡਰਸ਼ਿਪ ਪੈਦਾ ਕਰਨ ਲਈ ਯਤਨਸ਼ੀਲ ਹੈ ਜਿਸ ਲਈ ਸ਼ਹਿਰ, ਕਸਬਾ, ਪਿੰਡ, ਯੂਨੀਵਰਸਿਟੀ, ਕਾਲਜ ਅਤੇ ਸਕੂਲ ਪੱਧਰ ਤੇ “ਗੱਲ ਪੰਥ ਦੀ, ਗੱਲ ਪੰਜਾਬ ਦੀ” ਮੁਹਿੰਮ ਨਾਲ ਜੁੜਨ ਦਾ ਹੋਕਾ ਦਿੰਦੀ ਹੈ।
              </p>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold mb-4">ਸਾਡੇ ਮੁੱਖ ਕਾਰਜ</h3>
              <ul className="space-y-4">
                {[
                  "ਪੰਥਕ ਅਤੇ ਪੰਜਾਬ ਦੇ ਮਸਲਿਆਂ ਬਾਰੇ ਲੋਕਾਂ ਨੂੰ ਚੇਤਨ ਕਰਵਾਉਣਾ",
                  "ਸਿੱਖ ਨੌਜਵਾਨੀ ਨੂੰ ਨਸ਼ਿਆਂ ਤੋਂ ਮੁਕਤ ਕਰਨਾ",
                  "ਸਿੱਖੀ ਸਿਧਾਂਤਾਂ ਨਾਲ ਜੁੜ ਕੇ ਪੰਜਾਬ ਦੇ ਹਿੱਤਾਂ ਲਈ ਕੰਮ ਕਰਨਾ",
                  "ਪੰਜਾਬ ਦੇ ਪਾਣੀਆਂ ਅਤੇ ਵਾਤਾਵਰਣ ਦੀ ਰਾਖੀ",
                  "ਸਮਰੱਥ ਪੰਜਾਬ ਸਿਰਜਣ ਲਈ ਰਾਜਨੀਤਿਕ ਚੇਤਨਾ"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-lg text-foreground/80">
                    <span className="text-primary mt-1">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
