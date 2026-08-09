import { Metadata } from "next";
import dbConnect from "@/lib/mongodb";
import Blog from "@/models/Blog";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import { notFound } from "next/navigation";

// Fallback mock data in case MongoDB isn't running
const MOCK_BLOGS = [
  {
    _id: "1",
    title: "ਸ. ਅਮਰਿੰਦਰ ਸਿੰਘ ਤੁੜ ਨੂੰ ਪੂਰਾ ਪੰਜਾਬ ਲਹਿਰ ਦਾ ਕਨਵੀਨਰ ਲਗਾਇਆ ਗਿਆ",
    slug: "amrinder-singh-tur-appointed-convener",
    excerpt: "ਟਕਸਾਲੀ ਅਕਾਲੀ ਪਰਿਵਾਰ ਮਰਹੂਮ ਜੱਥੇਦਾਰ ਸ੍ਰੀ ਅਕਾਲ ਤਖ਼ਤ ਸਾਹਿਬ ਅਤੇ ਸ਼੍ਰੋਮਣੀ ਅਕਾਲੀ ਦਲ ਦੇ ਸਾਬਕਾ ਪ੍ਰਧਾਨ ਮੋਹਨ ਸਿੰਘ ਤੁੜ ਜੀ ਪੋਤਰੇ ਅਮਰਿੰਦਰ ਸਿੰਘ ਤੁੜ ਕੌਮੀ ਕਨਵੀਨਰ ਨਿਯੁਕਤ।",
    content: "ਪੂਰਾ ਕੰਟੈਂਟ ਇੱਥੇ ਆਵੇਗਾ...\n\nਇਹ ਬਹੁਤ ਹੀ ਮਾਣ ਵਾਲੀ ਗੱਲ ਹੈ ਕਿ ਸ. ਅਮਰਿੰਦਰ ਸਿੰਘ ਤੁੜ ਨੂੰ ਇਹ ਜ਼ਿੰਮੇਵਾਰੀ ਸੌਂਪੀ ਗਈ ਹੈ।",
    imageUrl: "/images/scraped_2.jpeg",
    publishedAt: new Date().toISOString()
  },
  {
    _id: "2",
    title: "ਮਾਘੀ ਦੇ ਪਵਿੱਤਰ ਦਿਹਾੜੇ ਤੇ ਸ੍ਰੀ ਮੁਕਤਸਰ ਸਾਹਿਬ ਪੜਾਅ",
    slug: "maghi-diwas-sri-muktsar-sahib",
    excerpt: "ਚਾਲੀ ਮੁਕਤਿਆਂ ਦੀ ਧਰਤੀ ਸ੍ਰੀ ਮੁਕਤਸਰ ਸਾਹਿਬ ਵਿਖੇ ਮਾਘੀ ਦੇ ਪਾਵਨ ਦਿਵਸ ਤੇ ਮਿਸਲ ਸਤਲੁਜ ਵਲੋਂ ਪੰਜਾਬ ਦੇ ਅਸਲ ਮੁੱਦਿਆਂ ਤੇ ਹੱਕੀ ਮੰਗਾਂ ਪ੍ਰਤੀ ਸੰਗਤਾਂ ਨੂੰ ਜਾਗਰੂਕ ਕਰਨ ਲਈ ਪੜਾਅ ਲਾਇਆ ਗਿਆ।",
    content: "ਪੂਰਾ ਕੰਟੈਂਟ ਇੱਥੇ ਆਵੇਗਾ...\n\nਸ੍ਰੀ ਮੁਕਤਸਰ ਸਾਹਿਬ ਵਿਖੇ ਸੰਗਤਾਂ ਦਾ ਭਾਰੀ ਇਕੱਠ ਵੇਖਣ ਨੂੰ ਮਿਲਿਆ।",
    imageUrl: "/images/scraped_3.jpeg",
    publishedAt: new Date(Date.now() - 86400000).toISOString()
  }
];

async function getBlog(slug: string) {
  const decodedSlug = decodeURIComponent(slug);
  const conn = await dbConnect();
  if (!conn) {
    return MOCK_BLOGS.find(b => b.slug === slug || b.slug === decodedSlug || b._id === slug);
  }
  return await Blog.findOne({
    $or: [
      { slug: slug },
      { slug: decodedSlug },
      ...(slug.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: slug }] : [])
    ]
  });
}

// Generate Dynamic SEO Metadata automatically
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlog(slug);
  
  if (!blog) {
    return {
      title: "Blog Not Found | Misl Satluj",
      description: "The requested blog post could not be found."
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mislsatluj.org";
  const canonicalUrl = `${siteUrl}/media/${encodeURIComponent(blog.slug || slug)}`;
  const publishDate = blog.publishedAt ? new Date(blog.publishedAt).toISOString() : new Date().toISOString();

  return {
    title: `${blog.title} | Misl Satluj (ਮਿਸਲ ਸਤਲੁਜ)`,
    description: blog.excerpt,
    keywords: [
      blog.title,
      "Misl Satluj",
      "ਮਿਸਲ ਸਤਲੁਜ",
      "Punjab News",
      "ਪੰਜਾਬ ਖ਼ਬਰਾਂ",
      "Panthak News"
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      url: canonicalUrl,
      siteName: "Misl Satluj",
      locale: "pa_IN",
      type: "article",
      publishedTime: publishDate,
      images: blog.imageUrl ? [{ url: blog.imageUrl, alt: blog.title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.excerpt,
      images: blog.imageUrl ? [blog.imageUrl] : [],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link href="/media" className="inline-flex items-center gap-2 text-foreground/60 hover:text-primary transition-colors mb-8 font-medium">
          <ArrowLeft size={20} /> ਮੀਡੀਆ ਸੈਂਟਰ ਵੱਲ ਵਾਪਸ ਜਾਓ (Back to Media)
        </Link>

        <article className="bg-white/80 dark:bg-black/20 backdrop-blur-md rounded-3xl overflow-hidden shadow-xl border border-white/20">
          {blog.imageUrl && (
            <div className="relative w-full h-[400px]">
              <Image 
                src={blog.imageUrl}
                alt={blog.title}
                fill
                priority
                className="object-cover"
              />
            </div>
          )}
          
          <div className="p-8 md:p-12">
            <div className="flex items-center gap-2 text-primary font-bold mb-6">
              <Calendar size={20} />
              <time dateTime={new Date(blog.publishedAt).toISOString()}>
                {new Date(blog.publishedAt).toLocaleDateString('pa-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
              {blog.title}
            </h1>
            
            <div className="w-20 h-1 bg-accent mb-8"></div>
            
            <p className="text-xl text-foreground/80 font-medium mb-10 leading-relaxed italic border-l-4 border-accent pl-6">
              {blog.excerpt}
            </p>
            
            <div className="prose prose-lg dark:prose-invert max-w-none prose-p:leading-loose">
              {blog.content.split('\n').map((paragraph: string, i: number) => (
                <p key={i} className="mb-6">{paragraph}</p>
              ))}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
