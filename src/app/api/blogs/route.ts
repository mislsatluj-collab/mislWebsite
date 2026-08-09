import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { verifyAdminAuth } from "@/lib/auth";

const MOCK_BLOGS = [
  {
    _id: "1",
    title: "ਸ. ਅਮਰਿੰਦਰ ਸਿੰਘ ਤੁੜ ਨੂੰ ਪੂਰਾ ਪੰਜਾਬ ਲਹਿਰ ਦਾ ਕਨਵੀਨਰ ਲਗਾਇਆ ਗਿਆ",
    slug: "amrinder-singh-tur-appointed-convener",
    excerpt: "ਟਕਸਾਲੀ ਅਕਾਲੀ ਪਰਿਵਾਰ ਮਰਹੂਮ ਜੱਥੇਦਾਰ ਸ੍ਰੀ ਅਕਾਲ ਤਖ਼ਤ ਸਾਹਿਬ ਅਤੇ ਸ਼੍ਰੋਮਣੀ ਅਕਾਲੀ ਦਲ ਦੇ ਸਾਬਕਾ ਪ੍ਰਧਾਨ ਮੋਹਨ ਸਿੰਘ ਤੁੜ ਜੀ ਪੋਤਰੇ ਅਮਰਿੰਦਰ ਸਿੰਘ ਤੁੜ ਕੌਮੀ ਕਨਵੀਨਰ ਨਿਯੁਕਤ।",
    content: "ਪੂਰਾ ਕੰਟੈਂਟ ਇੱਥੇ ਆਵੇਗਾ...",
    imageUrl: "/images/scraped_2.jpeg",
    publishedAt: new Date().toISOString()
  }
];

function generateSlug(title: string) {
  let cleaned = title.trim().replace(/\s+/g, '-').replace(/[?|!.,'"#@^&%*()\[\]{}+=<>]/g, '');
  const encoded = encodeURIComponent(cleaned);
  const randomStr = Math.random().toString(36).substring(2, 6);
  return `${encoded}-${randomStr}`;
}

export async function GET() {
  try {
    const conn = await dbConnect();
    if (!conn) {
      return NextResponse.json({ success: true, data: MOCK_BLOGS });
    }

    const blogs = await Blog.find({}).sort({ publishedAt: -1 }).lean();
    return NextResponse.json({ success: true, data: blogs });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch blogs" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // Backend Authorization Enforcement
    const { authenticated } = await verifyAdminAuth(req);
    if (!authenticated) {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }

    const conn = await dbConnect();
    if (!conn) {
      return NextResponse.json({ success: false, error: "Database not connected" }, { status: 500 });
    }

    const body = await req.json();
    if (!body.title || !body.content) {
      return NextResponse.json({ success: false, error: "Title and content are required" }, { status: 400 });
    }

    if (!body.slug && body.title) {
      body.slug = generateSlug(body.title);
    }

    if (body.publishedAt) {
      body.publishedAt = new Date(body.publishedAt);
    }

    const blog = await Blog.create(body);
    return NextResponse.json({ success: true, data: blog }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Failed to create blog" }, { status: 400 });
  }
}
