import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Blog from "@/models/Blog";

// Mock data for when MongoDB is not configured
const MOCK_BLOGS = [
  {
    _id: "1",
    title: "ਸ. ਅਮਰਿੰਦਰ ਸਿੰਘ ਤੁੜ ਨੂੰ ਪੂਰਾ ਪੰਜਾਬ ਲਹਿਰ ਦਾ ਕਨਵੀਨਰ ਲਗਾਇਆ ਗਿਆ",
    slug: "amrinder-singh-tur-appointed-convener",
    excerpt: "ਟਕਸਾਲੀ ਅਕਾਲੀ ਪਰਿਵਾਰ ਮਰਹੂਮ ਜੱਥੇਦਾਰ ਸ੍ਰੀ ਅਕਾਲ ਤਖ਼ਤ ਸਾਹਿਬ ਅਤੇ ਸ਼੍ਰੋਮਣੀ ਅਕਾਲੀ ਦਲ ਦੇ ਸਾਬਕਾ ਪ੍ਰਧਾਨ ਮੋਹਨ ਸਿੰਘ ਤੁੜ ਜੀ ਪੋਤਰੇ ਅਮਰਿੰਦਰ ਸਿੰਘ ਤੁੜ ਕੌਮੀ ਕਨਵੀਨਰ ਨਿਯੁਕਤ।",
    content: "ਪੂਰਾ ਕੰਟੈਂਟ ਇੱਥੇ ਆਵੇਗਾ...",
    imageUrl: "/images/scraped_2.jpeg",
    publishedAt: new Date().toISOString()
  },
  {
    _id: "2",
    title: "ਮਾਘੀ ਦੇ ਪਵਿੱਤਰ ਦਿਹਾੜੇ ਤੇ ਸ੍ਰੀ ਮੁਕਤਸਰ ਸਾਹਿਬ ਪੜਾਅ",
    slug: "maghi-diwas-sri-muktsar-sahib",
    excerpt: "ਚਾਲੀ ਮੁਕਤਿਆਂ ਦੀ ਧਰਤੀ ਸ੍ਰੀ ਮੁਕਤਸਰ ਸਾਹਿਬ ਵਿਖੇ ਮਾਘੀ ਦੇ ਪਾਵਨ ਦਿਵਸ ਤੇ ਮਿਸਲ ਸਤਲੁਜ ਵਲੋਂ ਪੰਜਾਬ ਦੇ ਅਸਲ ਮੁੱਦਿਆਂ ਤੇ ਹੱਕੀ ਮੰਗਾਂ ਪ੍ਰਤੀ ਸੰਗਤਾਂ ਨੂੰ ਜਾਗਰੂਕ ਕਰਨ ਲਈ ਪੜਾਅ ਲਾਇਆ ਗਿਆ।",
    content: "ਪੂਰਾ ਕੰਟੈਂਟ ਇੱਥੇ ਆਵੇਗਾ...",
    imageUrl: "/images/scraped_3.jpeg",
    publishedAt: new Date(Date.now() - 86400000).toISOString()
  }
];

function generateSlug(title: string) {
  // Simple slugifier that supports unicode (Punjabi/Gurmukhi) by just replacing spaces and removing basic punctuation
  let slug = title.trim().replace(/\s+/g, '-').replace(/[?|!.,'"#@^&%*()\[\]{}+=<>]/g, '');
  // Append a small random string to ensure uniqueness if titles are same
  const randomStr = Math.random().toString(36).substring(2, 6);
  return `${slug}-${randomStr}`;
}

export async function GET() {
  try {
    const conn = await dbConnect();
    
    if (!conn) {
      // Fallback to mock data if no DB connection
      return NextResponse.json({ success: true, data: MOCK_BLOGS });
    }

    const blogs = await Blog.find({}).sort({ publishedAt: -1 });
    return NextResponse.json({ success: true, data: blogs });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch blogs" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const conn = await dbConnect();
    
    if (!conn) {
      return NextResponse.json({ success: false, error: "Database not configured" }, { status: 500 });
    }

    const body = await req.json();
    
    // Generate a unique slug based on title
    if (!body.slug && body.title) {
      body.slug = generateSlug(body.title);
    }

    const blog = await Blog.create(body);
    
    return NextResponse.json({ success: true, data: blog }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
