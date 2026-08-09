"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Send } from "lucide-react";
import axios from "axios";

export default function Contact() {
  const [settings, setSettings] = useState({
    officeAddress: "ਕਿਸਾਨ ਭਵਨ, ਸੈਕਟਰ 35\nਚੰਡੀਗੜ੍ਹ, ਪੰਜਾਬ",
    phoneNumbers: "+91 98147 54739\n+91 89686 17046",
    contactEmail: "info@mislsatluj.com",
  });

  const [formData, setFormData] = useState({ name: "", phone: "", city: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submittedMsg, setSubmittedMsg] = useState("");

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await axios.get("/api/settings");
        if (res.data.success) {
          setSettings(res.data.data);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert("ਪੂਰਾ ਨਾਮ ਅਤੇ ਫੋਨ ਨੰਬਰ ਜ਼ਰੂਰੀ ਹੈ (Name & Phone required)");
      return;
    }
    setSubmitting(true);
    setSubmittedMsg("");

    try {
      const res = await axios.post("/api/contact", formData);
      if (res.data.success) {
        setSubmittedMsg("ਤੁਹਾਡਾ ਫਾਰਮ ਸਫਲਤਾਪੂਰਵਕ ਜਮ੍ਹਾਂ ਹੋ ਗਿਆ ਹੈ! (Submitted successfully!)");
        setFormData({ name: "", phone: "", city: "", message: "" });
      }
    } catch (err: any) {
      alert("ਫਾਰਮ ਜਮ੍ਹਾਂ ਕਰਨ ਵਿੱਚ ਸਮੱਸਿਆ ਆਈ (Submission failed)");
    } finally {
      setSubmitting(false);
    }
  };

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
                  <div className="text-foreground/70 text-lg whitespace-pre-line">
                    {settings.officeAddress}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 text-primary">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">ਫੋਨ ਨੰਬਰ</h3>
                  <div className="text-foreground/70 text-lg whitespace-pre-line">
                    {settings.phoneNumbers}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 text-primary">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">ਈ-ਮੇਲ</h3>
                  <div className="text-foreground/70 text-lg whitespace-pre-line">
                    {settings.contactEmail}
                  </div>
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
            {submittedMsg && (
              <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 text-green-600 font-bold rounded-2xl text-center">
                {submittedMsg}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">ਪੂਰਾ ਨਾਮ (Full Name)</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-primary outline-none transition-all"
                    placeholder="ਤੁਹਾਡਾ ਨਾਮ"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">ਫੋਨ ਨੰਬਰ (Phone)</label>
                  <input 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-primary outline-none transition-all"
                    placeholder="1234567890"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">ਪਿੰਡ/ਸ਼ਹਿਰ (Village/City)</label>
                <input 
                  type="text" 
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="ਤੁਹਾਡਾ ਪਿੰਡ ਜਾਂ ਸ਼ਹਿਰ"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">ਸੁਨੇਹਾ (Message)</label>
                <textarea 
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="ਤੁਸੀਂ ਇਸ ਮੁਹਿੰਮ ਵਿੱਚ ਕਿਵੇਂ ਸੇਵਾ ਕਰ ਸਕਦੇ ਹੋ..."
                ></textarea>
              </div>

              <button 
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? "ਜਮ੍ਹਾਂ ਹੋ ਰਿਹਾ ਹੈ..." : "ਜਮ੍ਹਾਂ ਕਰੋ"} <Send size={20} />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
