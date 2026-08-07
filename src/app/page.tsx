"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Users, Shield, BookOpen, Calendar } from "lucide-react";
import axios from "axios";

export default function Home() {
  const [missions, setMissions] = useState<any[]>([]);
  const [missionsLoading, setMissionsLoading] = useState(true);

  const [recentBlogs, setRecentBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecentBlogs() {
      try {
        const res = await axios.get("/api/blogs");
        if (res.data.success) {
          // Get only top 3
          setRecentBlogs(res.data.data.slice(0, 3));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    async function fetchMissions() {
      try {
        const res = await axios.get("/api/missions");
        if (res.data.success) {
          setMissions(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setMissionsLoading(false);
      }
    }
    fetchRecentBlogs();
    fetchMissions();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/scraped_1.jpg"
            alt="Misl Satluj Gathering"
            fill
            className="object-cover brightness-[0.4]"
            priority
          />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
          >
            ਪੰਜਾਬ ਅਤੇ ਪੰਜਾਬੀਅਤ ਦੀ ਆਵਾਜ਼
            <br />
            <span className="text-accent">ਮਿਸਲ ਸਤਲੁਜ</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto"
          >
            ਗੱਲ ਪੰਥ ਦੀ, ਗੱਲ ਪੰਜਾਬ ਦੀ
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link 
              href="/about"
              className="px-8 py-4 bg-accent text-accent-foreground rounded-full font-semibold text-lg hover:bg-accent/90 transition-all shadow-lg hover:shadow-accent/50 flex items-center justify-center gap-2"
            >
              ਸਾਡੇ ਬਾਰੇ ਜਾਣੋ <ArrowRight size={20} />
            </Link>
            <Link 
              href="/contact"
              className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-full font-semibold text-lg hover:bg-white/20 transition-all flex items-center justify-center"
            >
              ਮੈਂਬਰ ਬਣੋ
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-bold mb-6 text-foreground"
            >
              ਸਾਡਾ ਉਦੇਸ਼
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-xl text-foreground/70 max-w-4xl mx-auto leading-relaxed"
            >
              ਮਿਸਲ ਸਤਲੁਜ ਇੱਕ ਸਮਾਜਿਕ ਅਤੇ ਰਾਜਨੀਤਿਕ ਜਥੇਬੰਦੀ ਹੈ ਜੋ ਪੰਜਾਬ ਕੇਂਦਰਿਤ ਰਾਜਨੀਤੀ ਖੜੀ ਕਰਨ ਲਈ ਵਚਨਬੱਧ ਹੈ। ਇਹ ਜਥੇਬੰਦੀ ਪੰਜਾਬ ਵਿੱਚ ਨਵੀਂ ਨੌਜਵਾਨ ਲੀਡਰਸ਼ਿਪ ਪੈਦਾ ਕਰਨ ਲਈ ਯਤਨਸ਼ੀਲ ਹੈ ਜਿਸ ਲਈ ਸ਼ਹਿਰ, ਕਸਬਾ, ਪਿੰਡ ਪੱਧਰ ਤੇ ਮੁਹਿੰਮ ਨਾਲ ਜੁੜਨ ਦਾ ਹੋਕਾ ਦਿੰਦੀ ਹੈ।
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {missionsLoading ? (
               <div className="col-span-full flex justify-center py-12">
                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
               </div>
            ) : missions.map((mission, index) => (
              <Link href={`/mission/${mission.slug}`} key={mission._id} className="block group">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-foreground/5 p-8 rounded-3xl border border-foreground/10 group-hover:border-primary/50 group-hover:shadow-lg transition-all h-full flex flex-col"
                >
                  <div className="bg-background w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm overflow-hidden p-2">
                    {mission.iconUrl && mission.iconUrl.startsWith('http') ? (
                      <img src={mission.iconUrl} alt="icon" className="w-full h-full object-contain" />
                    ) : (
                      <BookOpen className="w-8 h-8 text-primary" />
                    )}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">{mission.title}</h3>
                  <p className="text-foreground/70 text-lg leading-relaxed flex-grow">{mission.desc}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Updates Preview */}
      <section className="py-24 bg-foreground/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold text-foreground">ਤਾਜ਼ਾ ਖ਼ਬਰਾਂ</h2>
              <p className="text-foreground/60 mt-4 text-lg">ਸਾਡੀਆਂ ਤਾਜ਼ਾ ਸਰਗਰਮੀਆਂ ਅਤੇ ਪ੍ਰੋਗਰਾਮ</p>
            </div>
            <Link href="/media" className="hidden md:flex items-center gap-2 text-primary font-semibold hover:underline">
              ਸਾਰੇ ਦੇਖੋ <ArrowRight size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-full flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : recentBlogs.map((blog, index) => (
              <motion.div
                key={blog._id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group cursor-pointer bg-background rounded-3xl overflow-hidden shadow-sm border border-foreground/5 hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <Link href={`/media/${blog.slug}`} className="block relative h-64 overflow-hidden bg-foreground/10">
                  {blog.imageUrl ? (
                    <Image
                      src={blog.imageUrl}
                      alt={blog.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-foreground/30">
                      No Image
                    </div>
                  )}
                </Link>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 text-sm text-primary font-semibold mb-3">
                    <Calendar size={14} />
                    {new Date(blog.publishedAt).toLocaleDateString('pa-IN')}
                  </div>
                  <Link href={`/media/${blog.slug}`}>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {blog.title}
                    </h3>
                  </Link>
                  <p className="text-foreground/70 line-clamp-3 mb-4 flex-grow">
                    {blog.excerpt}
                  </p>
                  <Link 
                    href={`/media/${blog.slug}`}
                    className="text-primary font-bold hover:underline flex items-center gap-2 mt-auto text-sm"
                  >
                    ਪੂਰਾ ਪੜ੍ਹੋ (Read More) <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-10 text-center md:hidden">
            <Link href="/media" className="inline-flex items-center gap-2 text-primary font-semibold border border-primary px-6 py-3 rounded-full hover:bg-primary/5">
              ਸਾਰੇ ਦੇਖੋ <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
