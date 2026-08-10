"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { Calendar, Video, FileText, X } from "lucide-react";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  imageUrl: string;
  publishedAt: string;
}

interface MediaVideoItem {
  _id: string;
  title: string;
  youtubeUrl: string;
  description: string;
  publishedAt: string;
}

// Helper function to extract YouTube Embed URL or ID
function getYoutubeEmbedUrl(url: string) {
  if (!url) return "";
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}`;
  }
  return url;
}

export default function Media() {
  const [activeTab, setActiveTab] = useState<"blogs" | "media">("blogs");
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [videos, setVideos] = useState<MediaVideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [blogsRes, videosRes] = await Promise.all([
          axios.get("/api/blogs"),
          axios.get("/api/videos")
        ]);

        if (blogsRes.data.success) {
          setBlogs(blogsRes.data.data);
        }
        if (videosRes.data.success) {
          setVideos(videosRes.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch media center data", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header Banner */}
      <div className="bg-primary/5 py-16 border-b border-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-foreground mb-4"
          >
            ਮੀਡੀਆ ਸੈਂਟਰ (Media Center)
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-foreground/70 max-w-2xl mx-auto mb-8"
          >
            ਸਾਡੀਆਂ ਵੀਡੀਓਜ਼, ਸਰਗਰਮੀਆਂ ਅਤੇ ਖ਼ਬਰਾਂ
          </motion.p>

          {/* Toggle Switch between Blog Posts (Left) and Media Videos (Right) */}
          <div className="inline-flex p-1.5 rounded-2xl bg-foreground/10 backdrop-blur-md border border-foreground/10">
            <button
              onClick={() => setActiveTab("blogs")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-base transition-all duration-300 ${
                activeTab === "blogs"
                  ? "bg-primary text-white shadow-lg shadow-primary/30"
                  : "text-foreground/70 hover:text-foreground hover:bg-foreground/5"
              }`}
            >
              <FileText className="w-5 h-5" />
              ਖ਼ਬਰਾਂ ਤੇ ਬਲਾਗ (Blog Posts)
            </button>
            <button
              onClick={() => setActiveTab("media")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-base transition-all duration-300 ${
                activeTab === "media"
                  ? "bg-primary text-white shadow-lg shadow-primary/30"
                  : "text-foreground/70 hover:text-foreground hover:bg-foreground/5"
              }`}
            >
              <Video className="w-5 h-5" />
              ਵੀਡੀਓ (Media Videos)
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : activeTab === "blogs" ? (
          /* Blog Posts Grid */
          blogs.length === 0 ? (
            <div className="text-center text-foreground/50 text-xl py-20">
              ਕੋਈ ਖ਼ਬਰ ਨਹੀਂ ਮਿਲੀ (No blog posts found)
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog, index) => (
                <motion.div
                  key={blog._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedBlog(blog)}
                  className="bg-white dark:bg-foreground/5 rounded-3xl overflow-hidden shadow-lg border border-foreground/5 hover:shadow-2xl transition-all group flex flex-col cursor-pointer"
                >
                  <div className="block relative h-64 overflow-hidden bg-foreground/10">
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
                  </div>
                  <div className="p-8 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 text-primary text-sm font-semibold mb-4">
                      <Calendar size={16} />
                      {new Date(blog.publishedAt).toLocaleDateString('pa-IN')}
                    </div>
                    <h3 className="text-2xl font-bold mb-4 line-clamp-2 hover:text-primary transition-colors">{blog.title}</h3>
                    <p className="text-foreground/70 mb-6 line-clamp-3 leading-relaxed flex-grow">
                      {blog.excerpt}
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedBlog(blog);
                      }}
                      className="text-primary font-bold hover:underline flex items-center gap-2 mt-auto text-left"
                    >
                      ਪੂਰਾ ਪੜ੍ਹੋ (Read More)
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )
        ) : (
          /* Media YouTube Videos Grid */
          videos.length === 0 ? (
            <div className="text-center text-foreground/50 text-xl py-20">
              ਕੋਈ ਵੀਡੀਓ ਨਹੀਂ ਮਿਲੀ (No YouTube videos found)
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {videos.map((video, index) => (
                <motion.div
                  key={video._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-foreground/5 rounded-3xl overflow-hidden shadow-lg border border-foreground/5 hover:shadow-2xl transition-all group flex flex-col"
                >
                  <div className="relative aspect-video w-full bg-black">
                    <iframe
                      src={getYoutubeEmbedUrl(video.youtubeUrl)}
                      title={video.title}
                      className="absolute inset-0 w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 text-primary text-sm font-semibold mb-3">
                      <Calendar size={16} />
                      {new Date(video.publishedAt).toLocaleDateString('pa-IN')}
                    </div>
                    <h3 className="text-xl font-bold mb-3 line-clamp-2">{video.title}</h3>
                    {video.description && (
                      <p className="text-foreground/70 text-sm line-clamp-3 leading-relaxed">
                        {video.description}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )
        )}
      </div>

      {/* Big Popup Window / Modal for Blog Post Details */}
      <AnimatePresence>
        {selectedBlog && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBlog(null)}
              className="fixed inset-0 bg-black/75 backdrop-blur-md"
            />

            {/* Modal Dialog Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-background text-foreground rounded-3xl shadow-2xl border border-foreground/10 overflow-y-auto z-10 flex flex-col"
            >
              {/* Sticky Header with Close Button */}
              <div className="sticky top-0 z-20 flex items-center justify-between p-4 md:p-6 bg-background/90 backdrop-blur-md border-b border-foreground/10">
                <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-primary">
                  ਖ਼ਬਰਾਂ ਤੇ ਬਲਾਗ (Blog Post)
                </span>
                <button
                  onClick={() => setSelectedBlog(null)}
                  className="p-2 rounded-full hover:bg-foreground/10 text-foreground/70 hover:text-foreground transition-colors"
                  aria-label="Close"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 md:p-10 space-y-6">
                {selectedBlog.imageUrl && (
                  <div className="relative w-full h-[280px] sm:h-[380px] md:h-[450px] rounded-2xl overflow-hidden shadow-md">
                    <Image
                      src={selectedBlog.imageUrl}
                      alt={selectedBlog.title}
                      fill
                      priority
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="flex items-center gap-2 text-primary font-bold text-sm md:text-base">
                  <Calendar size={18} />
                  <time dateTime={new Date(selectedBlog.publishedAt).toISOString()}>
                    {new Date(selectedBlog.publishedAt).toLocaleDateString('pa-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                </div>

                <h2 className="text-2xl md:text-4xl font-bold leading-tight">
                  {selectedBlog.title}
                </h2>

                <div className="w-20 h-1 bg-primary rounded-full"></div>

                {selectedBlog.excerpt && (
                  <p className="text-lg md:text-xl text-foreground/80 font-medium leading-relaxed italic border-l-4 border-primary pl-4 md:pl-6 bg-primary/5 py-3 rounded-r-xl">
                    {selectedBlog.excerpt}
                  </p>
                )}

                {selectedBlog.content && (
                  <div className="prose prose-lg dark:prose-invert max-w-none prose-p:leading-loose text-foreground/90 space-y-4 pt-2">
                    {selectedBlog.content.split('\n').map((paragraph: string, i: number) => (
                      paragraph.trim() ? <p key={i} className="text-base md:text-lg leading-relaxed">{paragraph}</p> : null
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

