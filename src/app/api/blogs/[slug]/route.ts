import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Blog from "@/models/Blog";

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

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);
    const conn = await dbConnect();
    
    if (!conn) {
      // Return mock data if MongoDB is not connected
      const blog = MOCK_BLOGS.find(b => b.slug === slug || b.slug === decodedSlug);
      if (!blog) {
        return NextResponse.json({ success: false, error: "Blog not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: blog });
    }

    const blog = await Blog.findOne({ $or: [{ slug: slug }, { slug: decodedSlug }] });
    
    if (!blog) {
      return NextResponse.json({ success: false, error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: blog });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch blog" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await req.json();
    if (body.publishedAt) {
      body.publishedAt = new Date(body.publishedAt);
    }
    const conn = await dbConnect();
    
    if (!conn) {
      return NextResponse.json({ success: true, data: body }); // Fake success for mock
    }
    
    // In edit mode, 'slug' here is actually the '_id' passed from the frontend
    const blog = await Blog.findByIdAndUpdate(slug, body, { new: true });
    
    if (!blog) {
      return NextResponse.json({ success: false, error: "Blog not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: blog });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update blog" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const conn = await dbConnect();
    
    if (!conn) {
      return NextResponse.json({ success: true }); // Fake success for mock
    }
    
    // In edit mode, 'slug' here is actually the '_id' passed from the frontend
    const blog = await Blog.findByIdAndDelete(slug);
    
    if (!blog) {
      return NextResponse.json({ success: false, error: "Blog not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete blog" }, { status: 500 });
  }
}
