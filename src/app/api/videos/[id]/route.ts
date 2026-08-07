import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import MediaVideo from "@/models/MediaVideo";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const conn = await dbConnect();
    const { id } = await params;
    if (!conn) {
      return NextResponse.json({ success: false, error: "Database not configured" }, { status: 500 });
    }

    const body = await req.json();
    const video = await MediaVideo.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    
    if (!video) {
      return NextResponse.json({ success: false, error: "Video not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: video });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const conn = await dbConnect();
    const { id } = await params;
    if (!conn) {
      return NextResponse.json({ success: false, error: "Database not configured" }, { status: 500 });
    }

    const video = await MediaVideo.findByIdAndDelete(id);
    
    if (!video) {
      return NextResponse.json({ success: false, error: "Video not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
