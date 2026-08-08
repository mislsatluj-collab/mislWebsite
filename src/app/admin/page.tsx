"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { LogIn, Plus, LogOut, Upload, Trash2, Pencil, X, Eye, Image as ImageIcon, Video } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Admin() {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [activeTab, setActiveTab] = useState<'blogs' | 'videos' | 'missions'>('blogs');

  // ================= BLOGS STATE =================
  const [blogs, setBlogs] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  // ================= VIDEOS STATE =================
  const [videos, setVideos] = useState<any[]>([]);
  const [videoTitle, setVideoTitle] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [videoDesc, setVideoDesc] = useState("");
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);

  // ================= MISSIONS STATE =================
  const [missions, setMissions] = useState<any[]>([]);
  const [missionTitle, setMissionTitle] = useState("");
  const [missionDesc, setMissionDesc] = useState("");
  const [missionContent, setMissionContent] = useState("");
  const [missionIconUrl, setMissionIconUrl] = useState("");
  const [editingMissionId, setEditingMissionId] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("admin_token");
    if (savedToken) {
      setToken(savedToken);
      fetchBlogs();
      fetchVideos();
      fetchMissions();
    }
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get("/api/blogs");
      if (res.data.success) {
        setBlogs(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchVideos = async () => {
    try {
      const res = await axios.get("/api/videos");
      if (res.data.success) {
        setVideos(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMissions = async () => {
    try {
      const res = await axios.get("/api/missions");
      if (res.data.success) {
        setMissions(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("/api/auth/login", { username, password });
      if (res.data.success) {
        setToken(res.data.token);
        localStorage.setItem("admin_token", res.data.token);
        fetchBlogs();
        fetchVideos();
        fetchMissions();
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("admin_token");
  };

  // ================= UTILS & FORMATTING =================
  const insertFormatting = (setter: React.Dispatch<React.SetStateAction<string>>, currentText: string, textToInsert: string) => {
    const spacing = currentText.length > 0 && !currentText.endsWith('\n') ? '\n' : '';
    setter(currentText + spacing + textToInsert);
  };

  const validateImageDimensions = (url: string, targetWidth: number, targetHeight: number): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!url) {
        resolve(true);
        return;
      }
      
      if (url.startsWith('/')) {
        resolve(true); 
        return;
      }

      const img = new window.Image();
      img.onload = () => {
        if (img.width === targetWidth && img.height === targetHeight) {
          resolve(true);
        } else {
          alert(`ERROR: Image dimensions must be exactly ${targetWidth}x${targetHeight}px.\n\nThe image you provided is ${img.width}x${img.height}px.\n\nPlease resize the image to exactly match the given dimensions and try again.`);
          resolve(false);
        }
      };
      img.onerror = () => {
        alert("Failed to load image to check dimensions. Please ensure the URL is valid, publicly accessible, and ends in an image extension like .jpg or .png.");
        resolve(false);
      };
      img.src = url;
    });
  };

  // ================= BLOGS HANDLERS =================
  const handleEditClick = (blog: any) => {
    setEditingId(blog._id);
    setTitle(blog.title);
    setExcerpt(blog.excerpt);
    setContent(blog.content);
    setImageUrl(blog.imageUrl || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTitle("");
    setExcerpt("");
    setContent("");
    setImageUrl("");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    try {
      await axios.delete(`/api/blogs/${id}`);
      fetchBlogs();
    } catch (err) {
      alert("Failed to delete blog.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (imageUrl) {
      const isValid = await validateImageDimensions(imageUrl, 1280, 720);
      if (!isValid) return;
    }

    setLoading(true);
    
    try {
      if (editingId) {
        await axios.put(`/api/blogs/${editingId}`, { title, excerpt, content, imageUrl });
        alert("Blog updated successfully!");
      } else {
        await axios.post("/api/blogs", { title, excerpt, content, imageUrl });
        alert("Blog created successfully!");
      }
      cancelEdit();
      fetchBlogs();
    } catch (err: any) {
      alert("Failed to save blog. " + (err.response?.data?.error || ""));
    } finally {
      setLoading(false);
    }
  };

  // ================= VIDEOS HANDLERS =================
  const handleVideoEditClick = (video: any) => {
    setEditingVideoId(video._id);
    setVideoTitle(video.title);
    setYoutubeUrl(video.youtubeUrl);
    setVideoDesc(video.description || "");
  };

  const cancelVideoEdit = () => {
    setEditingVideoId(null);
    setVideoTitle("");
    setYoutubeUrl("");
    setVideoDesc("");
  };

  const handleVideoDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this YouTube video?")) return;
    try {
      await axios.delete(`/api/videos/${id}`);
      fetchVideos();
    } catch (err) {
      alert("Failed to delete video.");
    }
  };

  const handleVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        title: videoTitle,
        youtubeUrl,
        description: videoDesc,
      };

      if (editingVideoId) {
        await axios.put(`/api/videos/${editingVideoId}`, payload);
        alert("Video updated successfully!");
      } else {
        await axios.post("/api/videos", payload);
        alert("Video added successfully!");
      }
      cancelVideoEdit();
      fetchVideos();
    } catch (err: any) {
      alert("Failed to save video. " + (err.response?.data?.error || ""));
    } finally {
      setLoading(false);
    }
  };

  // ================= MISSIONS HANDLERS =================
  const handleMissionEditClick = (mission: any) => {
    setEditingMissionId(mission._id);
    setMissionTitle(mission.title);
    setMissionDesc(mission.desc);
    setMissionContent(mission.content);
    setMissionIconUrl(mission.iconUrl || "");
  };

  const cancelMissionEdit = () => {
    setEditingMissionId(null);
    setMissionTitle("");
    setMissionDesc("");
    setMissionContent("");
    setMissionIconUrl("");
  };

  const handleMissionDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this mission feature?")) return;
    try {
      await axios.delete(`/api/missions/${id}`);
      fetchMissions();
    } catch (err) {
      alert("Failed to delete mission.");
    }
  };

  const handleMissionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (missionIconUrl) {
      const isValid = await validateImageDimensions(missionIconUrl, 512, 512);
      if (!isValid) return;
    }

    setLoading(true);
    
    try {
      const payload = {
        title: missionTitle,
        desc: missionDesc,
        content: missionContent,
        iconUrl: missionIconUrl,
      };

      if (editingMissionId) {
        await axios.put(`/api/missions/${editingMissionId}`, payload);
        alert("Mission updated successfully!");
      } else {
        await axios.post("/api/missions", payload);
        alert("Mission created successfully!");
      }
      cancelMissionEdit();
      fetchMissions();
    } catch (err: any) {
      alert("Failed to save mission. " + (err.response?.data?.error || ""));
    } finally {
      setLoading(false);
    }
  };


  if (!token) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-foreground/5 p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-background p-8 rounded-3xl shadow-xl w-full max-w-md border border-foreground/10"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">Admin Panel</h1>
            <p className="text-foreground/60">Log in to manage content</p>
          </div>

          {error && (
            <div className="bg-red-500/10 text-red-500 p-4 rounded-xl mb-6 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-primary outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-primary outline-none"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"} <LogIn size={20} />
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-foreground/5 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-foreground">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors flex items-center gap-2"
          >
            Logout <LogOut size={18} />
          </button>
        </div>

        {/* TABS */}
        <div className="flex gap-4 mb-8 flex-wrap">
          <button 
            onClick={() => setActiveTab('blogs')}
            className={`px-6 py-3 rounded-xl font-bold transition-colors ${activeTab === 'blogs' ? 'bg-primary text-white shadow-lg' : 'bg-background border border-foreground/10 text-foreground hover:bg-foreground/5'}`}
          >
            Manage Blogs
          </button>
          <button 
            onClick={() => setActiveTab('videos')}
            className={`px-6 py-3 rounded-xl font-bold transition-colors flex items-center gap-2 ${activeTab === 'videos' ? 'bg-primary text-white shadow-lg' : 'bg-background border border-foreground/10 text-foreground hover:bg-foreground/5'}`}
          >
            <Video size={18} /> Manage Media Videos (YouTube)
          </button>
          <button 
            onClick={() => setActiveTab('missions')}
            className={`px-6 py-3 rounded-xl font-bold transition-colors ${activeTab === 'missions' ? 'bg-primary text-white shadow-lg' : 'bg-background border border-foreground/10 text-foreground hover:bg-foreground/5'}`}
          >
            Manage Missions (Home Features)
          </button>
        </div>

        {/* ================= BLOGS TAB ================= */}
        {activeTab === 'blogs' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Create Blog Form */}
            <div className="lg:col-span-1">
              <div className="bg-background p-6 rounded-3xl shadow-md border border-foreground/10 sticky top-24">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold flex items-center gap-2 text-primary">
                    {editingId ? <Pencil size={24} /> : <Plus size={24} />} 
                    {editingId ? "Edit Blog" : "New Blog"}
                  </h2>
                  {editingId && (
                    <button onClick={cancelEdit} className="text-foreground/50 hover:text-red-500 transition-colors">
                      <X size={24} />
                    </button>
                  )}
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-primary outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Image URL <span className="text-red-500 font-bold ml-2">(Required Dimensions: 1280x720)</span></label>
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="/images/scraped_1.jpg"
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-primary outline-none"
                    />
                    <div className="text-xs text-foreground/70 mt-2 p-3 bg-foreground/5 rounded-lg border border-foreground/10">
                      <p className="font-bold mb-1 text-primary">How to upload images:</p>
                      <ul className="list-disc pl-4 space-y-1">
                        <li>Upload your image to an image hosting service (like Imgur, AWS S3, Cloudinary, etc).</li>
                        <li>Copy the <strong>Direct Image Link</strong> (it must end in .jpg, .png, etc).</li>
                        <li>Paste that link into the box above.</li>
                        <li>The system will strictly verify if the image is exactly <strong>1280x720</strong> pixels.</li>
                      </ul>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Excerpt</label>
                    <textarea
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      rows={2}
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-primary outline-none"
                      required
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-sm font-medium">Content</label>
                      <div className="flex gap-1 flex-wrap text-xs">
                        <button
                          type="button"
                          onClick={() => insertFormatting(setContent, content, '**ਬੋਲਡ ਅੱਖਰ (Bold)**')}
                          className="px-2 py-1 bg-primary/10 text-primary font-bold rounded hover:bg-primary/20 transition-colors"
                          title="Add Bold Text"
                        >
                          B (Bold)
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormatting(setContent, content, '# ਵੱਡਾ ਹੈਡਿੰਗ (Heading 1)')}
                          className="px-2 py-1 bg-primary/10 text-primary font-bold rounded hover:bg-primary/20 transition-colors"
                          title="Large Heading"
                        >
                          H1
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormatting(setContent, content, '## ਮੱਧਮ ਹੈਡਿੰਗ (Heading 2)')}
                          className="px-2 py-1 bg-primary/10 text-primary font-bold rounded hover:bg-primary/20 transition-colors"
                          title="Medium Heading"
                        >
                          H2
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormatting(setContent, content, '### ਛੋਟਾ ਹੈਡਿੰਗ (Heading 3)')}
                          className="px-2 py-1 bg-primary/10 text-primary font-bold rounded hover:bg-primary/20 transition-colors"
                          title="Small Heading"
                        >
                          H3
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormatting(setContent, content, '• ਸੂਚੀ ਬਿੰਦੂ (Bullet Item)')}
                          className="px-2 py-1 bg-primary/10 text-primary font-bold rounded hover:bg-primary/20 transition-colors"
                          title="Bullet List Item"
                        >
                          • List
                        </button>
                      </div>
                    </div>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={6}
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-primary outline-none"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <Upload size={18} /> {loading ? "Saving..." : editingId ? "Update Blog" : "Publish Blog"}
                  </button>
                </form>
              </div>
            </div>

            {/* Blog List */}
            <div className="lg:col-span-2">
              <div className="bg-background p-6 rounded-3xl shadow-md border border-foreground/10">
                <h2 className="text-2xl font-bold mb-6">Recent Blogs</h2>
                <div className="space-y-4">
                  {blogs.length === 0 ? (
                    <p className="text-foreground/50 text-center py-8">No blogs found</p>
                  ) : (
                    blogs.map((blog) => (
                      <div key={blog._id} className="flex gap-4 items-center p-4 rounded-xl border border-foreground/10 hover:bg-foreground/5 transition-colors">
                        {blog.imageUrl && (
                          <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 relative bg-foreground/10">
                            <img src={blog.imageUrl} alt={blog.title} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex-grow">
                          <h3 className="font-bold text-lg line-clamp-1">{blog.title}</h3>
                          <p className="text-sm text-foreground/60">{new Date(blog.publishedAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleEditClick(blog)}
                            className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Pencil size={20} />
                          </button>
                          <button 
                            onClick={() => handleDelete(blog._id)}
                            className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors" 
                            title="Delete"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= VIDEOS TAB ================= */}
        {activeTab === 'videos' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Create/Edit Video Form */}
            <div className="lg:col-span-1">
              <div className="bg-background p-6 rounded-3xl shadow-md border border-foreground/10 sticky top-24">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold flex items-center gap-2 text-primary">
                    {editingVideoId ? <Pencil size={24} /> : <Plus size={24} />} 
                    {editingVideoId ? "Edit Media Video" : "Add New Media Video"}
                  </h2>
                  {editingVideoId && (
                    <button onClick={cancelVideoEdit} className="text-foreground/50 hover:text-red-500 transition-colors">
                      <X size={24} />
                    </button>
                  )}
                </div>
                <form onSubmit={handleVideoSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Video Title</label>
                    <input
                      type="text"
                      value={videoTitle}
                      onChange={(e) => setVideoTitle(e.target.value)}
                      placeholder="e.g. ਮਿਸਲ ਸਤਲੁਜ ਪ੍ਰੈਸ ਕਾਨਫਰੰਸ"
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-primary outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">YouTube URL / Link</label>
                    <input
                      type="text"
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-primary outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description (Optional)</label>
                    <textarea
                      value={videoDesc}
                      onChange={(e) => setVideoDesc(e.target.value)}
                      rows={3}
                      placeholder="Short description of the video content..."
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <Upload size={18} /> {loading ? "Saving..." : editingVideoId ? "Update Video" : "Publish Video"}
                  </button>
                </form>
              </div>
            </div>

            {/* Video List */}
            <div className="lg:col-span-2">
              <div className="bg-background p-6 rounded-3xl shadow-md border border-foreground/10">
                <h2 className="text-2xl font-bold mb-6">Media Center YouTube Videos</h2>
                <div className="space-y-4">
                  {videos.length === 0 ? (
                    <p className="text-foreground/50 text-center py-8">No videos found</p>
                  ) : (
                    videos.map((video) => (
                      <div key={video._id} className="flex gap-4 items-center p-4 rounded-xl border border-foreground/10 hover:bg-foreground/5 transition-colors">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                          <Video size={24} />
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-bold text-lg line-clamp-1">{video.title}</h3>
                          <p className="text-xs text-primary font-mono truncate">{video.youtubeUrl}</p>
                          <p className="text-xs text-foreground/60 mt-1">{new Date(video.publishedAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleVideoEditClick(video)}
                            className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Pencil size={20} />
                          </button>
                          <button 
                            onClick={() => handleVideoDelete(video._id)}
                            className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors" 
                            title="Delete"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= MISSIONS TAB WITH LIVE PREVIEW ================= */}
        {activeTab === 'missions' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Side: Form */}
            <div className="bg-background p-6 rounded-3xl shadow-md border border-foreground/10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2 text-primary">
                  {editingMissionId ? <Pencil size={24} /> : <Plus size={24} />} 
                  {editingMissionId ? "Edit Mission Feature" : "New Mission Feature"}
                </h2>
                {editingMissionId && (
                  <button onClick={cancelMissionEdit} className="text-foreground/50 hover:text-red-500 transition-colors">
                    <X size={24} />
                  </button>
                )}
              </div>
              <form onSubmit={handleMissionSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title (e.g. ਨਵੀਂ ਲੀਡਰਸ਼ਿਪ)</label>
                  <input
                    type="text"
                    value={missionTitle}
                    onChange={(e) => setMissionTitle(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-primary outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Card Icon URL <span className="text-red-500 font-bold ml-2">(Required Dimensions: 512x512)</span></label>
                  <input
                    type="text"
                    value={missionIconUrl}
                    onChange={(e) => setMissionIconUrl(e.target.value)}
                    placeholder="https://example.com/icon.png"
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-primary outline-none"
                  />
                  <div className="text-xs text-foreground/70 mt-2 p-3 bg-foreground/5 rounded-lg border border-foreground/10">
                      <p className="font-bold mb-1 text-primary">How to upload images:</p>
                      <ul className="list-disc pl-4 space-y-1">
                        <li>Upload your image to an image hosting service (like Imgur, AWS S3, Cloudinary, etc).</li>
                        <li>Copy the <strong>Direct Image Link</strong> (it must end in .jpg, .png, etc).</li>
                        <li>Paste that link into the box above.</li>
                        <li>The system will strictly verify if the image is exactly <strong>512x512</strong> pixels.</li>
                      </ul>
                  </div>
                  <p className="text-xs text-foreground/50 mt-2">If left empty, a default vector icon will be used.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Short Description (for the Yellow Card)</label>
                  <textarea
                    value={missionDesc}
                    onChange={(e) => setMissionDesc(e.target.value)}
                    rows={2}
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-primary outline-none"
                    required
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium">Full Detailed Content (for specific page)</label>
                    <div className="flex gap-1 flex-wrap text-xs">
                      <button
                        type="button"
                        onClick={() => insertFormatting(setMissionContent, missionContent, '**ਬੋਲਡ ਅੱਖਰ (Bold)**')}
                        className="px-2 py-1 bg-primary/10 text-primary font-bold rounded hover:bg-primary/20 transition-colors"
                        title="Add Bold Text"
                      >
                        B (Bold)
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting(setMissionContent, missionContent, '# ਵੱਡਾ ਹੈਡਿੰਗ (Heading 1)')}
                        className="px-2 py-1 bg-primary/10 text-primary font-bold rounded hover:bg-primary/20 transition-colors"
                        title="Large Heading"
                      >
                        H1
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting(setMissionContent, missionContent, '## ਮੱਧਮ ਹੈਡਿੰਗ (Heading 2)')}
                        className="px-2 py-1 bg-primary/10 text-primary font-bold rounded hover:bg-primary/20 transition-colors"
                        title="Medium Heading"
                      >
                        H2
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting(setMissionContent, missionContent, '### ਛੋਟਾ ਹੈਡਿੰਗ (Heading 3)')}
                        className="px-2 py-1 bg-primary/10 text-primary font-bold rounded hover:bg-primary/20 transition-colors"
                        title="Small Heading"
                      >
                        H3
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting(setMissionContent, missionContent, '• ਸੂਚੀ ਬਿੰਦੂ (Bullet Item)')}
                        className="px-2 py-1 bg-primary/10 text-primary font-bold rounded hover:bg-primary/20 transition-colors"
                        title="Bullet List Item"
                      >
                        • List
                      </button>
                    </div>
                  </div>
                  <textarea
                    value={missionContent}
                    onChange={(e) => setMissionContent(e.target.value)}
                    rows={8}
                    placeholder="Enter full article here. Use toolbar buttons above to bold text, change font sizes, or paste image links starting with 'http' on new lines."
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-primary outline-none"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  <Upload size={18} /> {loading ? "Saving..." : editingMissionId ? "Update Mission" : "Publish Mission"}
                </button>
              </form>

              <hr className="my-8 border-foreground/10" />

              {/* LIST OF MISSIONS TO EDIT */}
              <h3 className="font-bold text-xl mb-4">Existing Missions</h3>
              <div className="space-y-3">
                {missions.length === 0 ? (
                  <p className="text-foreground/50">No missions found</p>
                ) : (
                  missions.map(mission => (
                    <div key={mission._id} className="flex justify-between items-center p-3 rounded-xl border border-foreground/10 hover:bg-foreground/5 transition-colors">
                      <span className="font-bold">{mission.title}</span>
                      <div className="flex gap-1">
                        <button onClick={() => handleMissionEditClick(mission)} className="p-2 text-primary hover:bg-primary/10 rounded-lg"><Pencil size={18} /></button>
                        <button onClick={() => handleMissionDelete(mission._id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"><Trash2 size={18} /></button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right Side: LIVE PREVIEW */}
            <div>
              <div className="sticky top-24 space-y-6">
                <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <Eye size={24} /> Live Card Preview
                </h3>
                <div className="p-8 bg-background border border-foreground/10 rounded-3xl">
                  {/* Exactly how it looks on the Home Page */}
                  <div className="bg-foreground/5 p-8 rounded-3xl border border-foreground/10 hover:border-primary/50 transition-colors max-w-sm mx-auto">
                    <div className="bg-background w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm overflow-hidden p-2">
                      {missionIconUrl && missionIconUrl.startsWith('http') ? (
                        <img src={missionIconUrl} alt="icon" className="w-full h-full object-contain" />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-primary" />
                      )}
                    </div>
                    <h3 className="text-2xl font-bold mb-4">{missionTitle || "Title Goes Here"}</h3>
                    <p className="text-foreground/70 text-lg leading-relaxed">{missionDesc || "Description will appear here in the live preview."}</p>
                  </div>
                </div>

                <div className="p-6 bg-primary/5 border border-primary/20 rounded-3xl mt-6">
                  <h4 className="font-bold text-primary mb-2">Pro-Tip for Detailed Page</h4>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    The <strong>Detailed Content</strong> will be shown when the user clicks the card. 
                    If you want to add an image inside the content, just paste an image link (starting with `http`) on a brand new line. The page will automatically convert it into a beautiful embedded image!
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
