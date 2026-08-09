import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import MediaVideo from "@/models/MediaVideo";
import { verifyAdminAuth } from "@/lib/auth";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Enforce Backend Authentication
    const { authenticated } = await verifyAdminAuth(req);
    if (!authenticated) {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }

    const conn = await dbConnect();
    const { id } = await params;
    if (!conn) {
      return NextResponse.json({ success: false, error: "Database not connected" }, { status: 500 });
    }

    const body = await req.json();
    const video = await MediaVideo.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    
    if (!video) {
      return NextResponse.json({ success: false, error: "Video not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: video });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Failed to update video" }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Enforce Backend Authentication
    const { authenticated } = await verifyAdminAuth(req);
    if (!authenticated) {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }

    const conn = await dbConnect();
    const { id } = await params;
    if (!conn) {
      return NextResponse.json({ success: false, error: "Database not connected" }, { status: 500 });
    }

    const video = await MediaVideo.findByIdAndDelete(id);
    
    if (!video) {
      return NextResponse.json({ success: false, error: "Video not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Video deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Failed to delete video" }, { status: 400 });
  }
}
