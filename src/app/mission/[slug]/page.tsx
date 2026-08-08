import { Metadata } from "next";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongodb";
import Mission from "@/models/Mission";
import Link from "next/link";
import { ArrowLeft, Target } from "lucide-react";
import { notFound } from "next/navigation";
import Image from "next/image";

// Mock data for fallback
const MOCK_MISSIONS = [
  {
    _id: "m1",
    title: "ਨਵੀਂ ਲੀਡਰਸ਼ਿਪ",
    slug: "new-leadership",
    desc: "ਪੰਜਾਬ ਵਿੱਚ ਨਵੀਂ ਨੌਜਵਾਨ ਲੀਡਰਸ਼ਿਪ ਪੈਦਾ ਕਰਨ ਲਈ ਯਤਨਸ਼ੀਲ",
    content: "ਪੰਜਾਬ ਦੀ ਰਾਜਨੀਤੀ ਵਿੱਚ ਇੱਕ ਨਵੀਂ ਸਵੇਰ ਲਿਆਉਣ ਲਈ ਨੌਜਵਾਨਾਂ ਨੂੰ ਅੱਗੇ ਆਉਣਾ ਪਵੇਗਾ। ਮਿਸਲ ਸਤਲੁਜ ਦਾ ਮੁੱਖ ਉਦੇਸ਼ ਨੌਜਵਾਨਾਂ ਨੂੰ ਸਿਆਸੀ ਅਤੇ ਸਮਾਜਿਕ ਤੌਰ ਤੇ ਜਾਗਰੂਕ ਕਰਨਾ ਹੈ।\n\nਅਸੀਂ ਪਿੰਡ-ਪਿੰਡ ਜਾ ਕੇ ਨੌਜਵਾਨਾਂ ਨੂੰ ਇਕੱਠਾ ਕਰ ਰਹੇ ਹਾਂ ਅਤੇ ਉਨ੍ਹਾਂ ਨੂੰ ਆਪਣੀ ਜ਼ਿੰਮੇਵਾਰੀ ਦਾ ਅਹਿਸਾਸ ਕਰਵਾ ਰਹੇ ਹਾਂ।",
    iconUrl: "users",
    order: 1
  },
  {
    _id: "m2",
    title: "ਪੰਥਕ ਮਸਲੇ",
    slug: "panthak-masle",
    desc: "ਪੰਥਕ ਅਤੇ ਪੰਜਾਬ ਦੇ ਮਸਲਿਆਂ ਬਾਰੇ ਲੋਕਾਂ ਨੂੰ ਚੇਤਨ ਕਰਵਾਉਣਾ",
    content: "ਸਾਡੇ ਪੰਜਾਬ ਅਤੇ ਪੰਥ ਦੇ ਬਹੁਤ ਸਾਰੇ ਮਸਲੇ ਅਜੇ ਵੀ ਅਣਸੁਲਝੇ ਹਨ। ਬੰਦੀ ਸਿੰਘਾਂ ਦੀ ਰਿਹਾਈ, ਪਾਣੀਆਂ ਦਾ ਮਸਲਾ ਅਤੇ ਕੇਂਦਰ ਸਰਕਾਰ ਦੀਆਂ ਪੰਜਾਬ ਵਿਰੋਧੀ ਨੀਤੀਆਂ ਬਾਰੇ ਆਮ ਲੋਕਾਂ ਨੂੰ ਜਾਗਰੂਕ ਕਰਨਾ ਬਹੁਤ ਜ਼ਰੂਰੀ ਹੈ।\n\nਮਿਸਲ ਸਤਲੁਜ ਇਨ੍ਹਾਂ ਮੁੱਦਿਆਂ ਤੇ ਲਗਾਤਾਰ ਸੰਘਰਸ਼ ਕਰ ਰਹੀ ਹੈ।",
    iconUrl: "shield",
    order: 2
  },
  {
    _id: "m3",
    title: "ਸਿੱਖੀ ਸਿਧਾਂਤ",
    slug: "sikhi-sidhant",
    desc: "ਨਸ਼ਿਆਂ ਤੋਂ ਮੁਕਤ ਹੋ ਕੇ ਸਿੱਖੀ ਸਿਧਾਂਤਾਂ ਨਾਲ ਜੁੜਨ ਦੀ ਪ੍ਰੇਰਨਾ",
    content: "ਪੰਜਾਬ ਦੀ ਜਵਾਨੀ ਨੂੰ ਨਸ਼ਿਆਂ ਦੀ ਦਲਦਲ ਵਿੱਚੋਂ ਕੱਢਣ ਲਈ ਸਾਨੂੰ ਉਨ੍ਹਾਂ ਨੂੰ ਆਪਣੇ ਗੌਰਵਮਈ ਇਤਿਹਾਸ ਅਤੇ ਸਿੱਖੀ ਸਿਧਾਂਤਾਂ ਨਾਲ ਜੋੜਨਾ ਪਵੇਗਾ।\n\nਗੁਰੂ ਸਾਹਿਬਾਨ ਦੁਆਰਾ ਦਰਸਾਏ ਮਾਰਗ ਤੇ ਚੱਲ ਕੇ ਹੀ ਅਸੀਂ ਇੱਕ ਤੰਦਰੁਸਤ ਅਤੇ ਖੁਸ਼ਹਾਲ ਪੰਜਾਬ ਦੀ ਸਿਰਜਣਾ ਕਰ ਸਕਦੇ ਹਾਂ।",
    iconUrl: "book-open",
    order: 3
  },
];

async function getMission(rawSlug: string) {
  const conn = await dbConnect();
  
  let decodedSlug = rawSlug;
  try {
    decodedSlug = decodeURIComponent(rawSlug);
  } catch (e) {}

  let encodedSlug = rawSlug;
  try {
    encodedSlug = encodeURIComponent(decodedSlug);
  } catch (e) {}

  if (!conn) {
    return MOCK_MISSIONS.find(m => m.slug === decodedSlug || m.slug === rawSlug || m._id === rawSlug);
  }

  // 1. Try decoded slug (e.g. "ਸੰਗਠਨ-ਸੇਵਾ-ਤੇ-ਸਫ਼ਲਤਾ-8l89")
  let mission = await Mission.findOne({ slug: decodedSlug });

  // 2. Try raw slug
  if (!mission) {
    mission = await Mission.findOne({ slug: rawSlug });
  }

  // 3. Try encoded slug
  if (!mission && encodedSlug !== rawSlug) {
    mission = await Mission.findOne({ slug: encodedSlug });
  }

  // 4. Try MongoDB ObjectId
  if (!mission && mongoose.Types.ObjectId.isValid(rawSlug)) {
    mission = await Mission.findById(rawSlug);
  }
  if (!mission && mongoose.Types.ObjectId.isValid(decodedSlug)) {
    mission = await Mission.findById(decodedSlug);
  }

  // 5. Fallback regex search for Punjabi title or slug match
  if (!mission) {
    const safeRegex = decodedSlug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    mission = await Mission.findOne({
      $or: [
        { slug: { $regex: new RegExp(`^${safeRegex}$`, 'i') } },
        { title: decodedSlug }
      ]
    });
  }

  return mission;
}

// Generate Dynamic SEO Metadata
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const mission = await getMission(slug);
  
  if (!mission) {
    return {
      title: "Mission Not Found | Misl Satluj",
      description: "The requested mission could not be found."
    };
  }

  return {
    title: `${mission.title} | Misl Satluj Mission`,
    description: mission.desc,
    openGraph: {
      title: mission.title,
      description: mission.desc,
      type: "article",
    },
    twitter: {
      card: "summary",
      title: mission.title,
      description: mission.desc,
    }
  };
}

function renderFormattedText(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index} className="font-bold text-primary">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

function renderContentBlocks(content: string) {
  if (!content) return null;
  const lines = content.split('\n');

  return lines.map((line, i) => {
    const trimmed = line.trim();
    if (!trimmed) return <div key={i} className="h-2" />;

    // Image URL check: line starts with http://, https://, or /images/
    if (trimmed.match(/^(https?:\/\/|\/images\/)[^\s]+$/i)) {
      return (
        <div key={i} className="my-6">
          <img
            src={trimmed}
            alt="Mission Content Image"
            className="w-full max-h-[500px] object-cover rounded-2xl shadow-md border border-foreground/10"
          />
        </div>
      );
    }

    if (trimmed.startsWith('# ')) {
      return <h1 key={i} className="text-3xl font-bold my-5 text-foreground leading-tight">{renderFormattedText(trimmed.slice(2))}</h1>;
    }
    if (trimmed.startsWith('## ')) {
      return <h2 key={i} className="text-2xl font-bold my-4 text-foreground leading-tight">{renderFormattedText(trimmed.slice(3))}</h2>;
    }
    if (trimmed.startsWith('### ')) {
      return <h3 key={i} className="text-xl font-bold my-3 text-primary leading-tight">{renderFormattedText(trimmed.slice(4))}</h3>;
    }

    if (trimmed.startsWith('• ') || trimmed.startsWith('- ')) {
      return (
        <li key={i} className="ml-6 list-disc mb-2 text-foreground/90 leading-relaxed font-medium">
          {renderFormattedText(trimmed.slice(2))}
        </li>
      );
    }

    return (
      <p key={i} className="mb-4 text-lg text-foreground/90 leading-relaxed font-normal">
        {renderFormattedText(trimmed)}
      </p>
    );
  });
}

export default async function MissionPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const mission = await getMission(slug);

  if (!mission) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link href="/" className="inline-flex items-center gap-2 text-foreground/60 hover:text-primary transition-colors mb-8 font-medium">
          <ArrowLeft size={20} /> ਹੋਮ ਪੇਜ ਵੱਲ ਵਾਪਸ ਜਾਓ (Back to Home)
        </Link>

        <article className="bg-white/80 dark:bg-black/20 backdrop-blur-md rounded-3xl overflow-hidden shadow-xl border border-white/20">
          
          <div className="p-8 md:p-12">
            <div className="flex items-center gap-2 text-primary font-bold mb-6">
              <Target size={24} />
              <span className="uppercase tracking-widest text-sm">Mission (ਸਾਡਾ ਉਦੇਸ਼)</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
              {mission.title}
            </h1>
            
            <div className="w-20 h-1 bg-accent mb-8"></div>
            
            <p className="text-xl text-foreground/80 font-medium mb-10 leading-relaxed not-italic border-l-4 border-accent pl-6">
              {mission.desc}
            </p>

            {mission.iconUrl && mission.iconUrl.startsWith('http') && (
               <div className="my-10">
                 <img src={mission.iconUrl} alt={mission.title} className="w-full h-auto rounded-2xl object-cover max-h-[400px] border border-foreground/10" />
               </div>
            )}
            
            <div className="max-w-none text-foreground">
              {renderContentBlocks(mission.content)}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
