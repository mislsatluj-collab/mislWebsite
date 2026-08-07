"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import axios from "axios";
import { Calendar, Video, FileText } from "lucide-react";
import Link from "next/link";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
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
  const [activeTab, setActiveTab] = useState<"media" | "blogs">("media");
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [videos, setVideos] = useState<MediaVideoItem[]>([]);
  const [loading, setLoading] = useState(true);

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

          {/* Toggle Switch between Media Videos and Blog Posts */}
          <div className="inline-flex p-1.5 rounded-2xl bg-foreground/10 backdrop-blur-md border border-foreground/10">
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
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : activeTab === "media" ? (
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
        ) : (
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
                  className="bg-white dark:bg-foreground/5 rounded-3xl overflow-hidden shadow-lg border border-foreground/5 hover:shadow-2xl transition-all group flex flex-col"
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
                  <div className="p-8 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 text-primary text-sm font-semibold mb-4">
                      <Calendar size={16} />
                      {new Date(blog.publishedAt).toLocaleDateString('pa-IN')}
                    </div>
                    <Link href={`/media/${blog.slug}`}>
                      <h3 className="text-2xl font-bold mb-4 line-clamp-2 hover:text-primary transition-colors">{blog.title}</h3>
                    </Link>
                    <p className="text-foreground/70 mb-6 line-clamp-3 leading-relaxed flex-grow">
                      {blog.excerpt}
                    </p>
                    <Link 
                      href={`/media/${blog.slug}`}
                      className="text-primary font-bold hover:underline flex items-center gap-2 mt-auto"
                    >
                      ਪੂਰਾ ਪੜ੍ਹੋ (Read More)
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
