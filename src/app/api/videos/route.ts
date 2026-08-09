import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import MediaVideo from "@/models/MediaVideo";
import { verifyAdminAuth } from "@/lib/auth";

const MOCK_VIDEOS = [
  {
    _id: "v1",
    title: "ਮਿਸਲ ਸਤਲੁਜ ਪ੍ਰੈਸ ਕਾਨਫਰੰਸ (Press Conference)",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    description: "ਪੰਜਾਬ ਦੇ ਅਹਿਮ ਮੁੱਦਿਆਂ ਤੇ ਵਿਸ਼ੇਸ਼ ਚਰਚਾ ਅਤੇ ਪ੍ਰੈਸ ਵਾਰਤਾ।",
    publishedAt: new Date().toISOString()
  }
];

export async function GET() {
  try {
    const conn = await dbConnect();
    
    if (!conn) {
      return NextResponse.json({ success: true, data: MOCK_VIDEOS });
    }

    const videos = await MediaVideo.find({}).sort({ publishedAt: -1 }).lean();
    return NextResponse.json({ success: true, data: videos });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch media videos" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // Enforce Backend Authentication
    const { authenticated } = await verifyAdminAuth(req);
    if (!authenticated) {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }

    const conn = await dbConnect();
    if (!conn) {
      return NextResponse.json({ success: false, error: "Database not connected" }, { status: 500 });
    }

    const body = await req.json();
    if (!body.title || !body.youtubeUrl) {
      return NextResponse.json({ success: false, error: "Title and YouTube URL are required" }, { status: 400 });
    }

    const video = await MediaVideo.create(body);
    return NextResponse.json({ success: true, data: video }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Failed to create video" }, { status: 400 });
  }
}
