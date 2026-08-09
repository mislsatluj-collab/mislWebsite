import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { verifyAdminAuth } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);
    const conn = await dbConnect();
    
    if (!conn) {
      return NextResponse.json({ success: false, error: "Database not connected" }, { status: 500 });
    }

    const blog = await Blog.findOne({ $or: [{ slug: slug }, { slug: decodedSlug }] }).lean();
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
    // Enforce Backend Admin Authentication
    const { authenticated } = await verifyAdminAuth(req);
    if (!authenticated) {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }

    const { slug } = await params;
    const body = await req.json();
    if (body.publishedAt) {
      body.publishedAt = new Date(body.publishedAt);
    }
    const conn = await dbConnect();
    
    if (!conn) {
      return NextResponse.json({ success: false, error: "Database not connected" }, { status: 500 });
    }
    
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
    // Enforce Backend Admin Authentication
    const { authenticated } = await verifyAdminAuth(req);
    if (!authenticated) {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }

    const { slug } = await params;
    const conn = await dbConnect();
    
    if (!conn) {
      return NextResponse.json({ success: false, error: "Database not connected" }, { status: 500 });
    }
    
    const blog = await Blog.findByIdAndDelete(slug);
    if (!blog) {
      return NextResponse.json({ success: false, error: "Blog not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete blog" }, { status: 500 });
  }
}
