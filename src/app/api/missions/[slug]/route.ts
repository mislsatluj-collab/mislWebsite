import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongodb";
import Mission from "@/models/Mission";
import { verifyAdminAuth } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    let decodedSlug = slug;
    try {
      decodedSlug = decodeURIComponent(slug);
    } catch (e) {}

    const conn = await dbConnect();
    if (!conn) {
      return NextResponse.json({ success: false, error: "Database not connected" }, { status: 500 });
    }

    let mission = null;
    if (mongoose.Types.ObjectId.isValid(slug)) {
      mission = await Mission.findById(slug).lean();
    }
    if (!mission && mongoose.Types.ObjectId.isValid(decodedSlug)) {
      mission = await Mission.findById(decodedSlug).lean();
    }
    if (!mission) {
      mission = await Mission.findOne({ slug: decodedSlug }).lean();
    }
    if (!mission) {
      mission = await Mission.findOne({ slug }).lean();
    }
    
    if (!mission) {
      return NextResponse.json({ success: false, error: "Mission not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: mission });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Failed to fetch mission" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Enforce Backend Authentication
    const { authenticated } = await verifyAdminAuth(req);
    if (!authenticated) {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }

    const { slug } = await params;
    let decodedSlug = slug;
    try {
      decodedSlug = decodeURIComponent(slug);
    } catch (e) {}

    const body = await req.json();
    const conn = await dbConnect();
    
    if (!conn) {
      return NextResponse.json({ success: false, error: "Database not connected" }, { status: 500 });
    }
    
    let mission = null;
    if (mongoose.Types.ObjectId.isValid(slug)) {
      mission = await Mission.findByIdAndUpdate(slug, body, { returnDocument: 'after', runValidators: true });
    }
    if (!mission && mongoose.Types.ObjectId.isValid(decodedSlug)) {
      mission = await Mission.findByIdAndUpdate(decodedSlug, body, { returnDocument: 'after', runValidators: true });
    }
    if (!mission) {
      mission = await Mission.findOneAndUpdate({ slug: decodedSlug }, body, { returnDocument: 'after', runValidators: true });
    }
    if (!mission) {
      mission = await Mission.findOneAndUpdate({ slug }, body, { returnDocument: 'after', runValidators: true });
    }
    
    if (!mission) {
      return NextResponse.json({ success: false, error: "Mission not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: mission });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Failed to update mission" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Enforce Backend Authentication
    const { authenticated } = await verifyAdminAuth(req);
    if (!authenticated) {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }

    const { slug } = await params;
    let decodedSlug = slug;
    try {
      decodedSlug = decodeURIComponent(slug);
    } catch (e) {}

    const conn = await dbConnect();
    if (!conn) {
      return NextResponse.json({ success: false, error: "Database not connected" }, { status: 500 });
    }
    
    let mission = null;
    if (mongoose.Types.ObjectId.isValid(slug)) {
      mission = await Mission.findByIdAndDelete(slug);
    }
    if (!mission && mongoose.Types.ObjectId.isValid(decodedSlug)) {
      mission = await Mission.findByIdAndDelete(decodedSlug);
    }
    if (!mission) {
      mission = await Mission.findOneAndDelete({ slug: decodedSlug });
    }
    if (!mission) {
      mission = await Mission.findOneAndDelete({ slug });
    }
    
    if (!mission) {
      return NextResponse.json({ success: false, error: "Mission not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: "Mission deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Failed to delete mission" }, { status: 500 });
  }
}
