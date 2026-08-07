import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import MediaVideo from "@/models/MediaVideo";

const MOCK_VIDEOS = [
  {
    _id: "v1",
    title: "ਮਿਸਲ ਸਤਲੁਜ ਪ੍ਰੈਸ ਕਾਨਫਰੰਸ (Press Conference)",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    description: "ਪੰਜਾਬ ਦੇ ਅਹਿਮ ਮੁੱਦਿਆਂ ਤੇ ਵਿਸ਼ੇਸ਼ ਚਰਚਾ ਅਤੇ ਪ੍ਰੈਸ ਵਾਰਤਾ।",
    publishedAt: new Date().toISOString()
  },
  {
    _id: "v2",
    title: "ਪੂਰਾ ਪੰਜਾਬ ਲਹਿਰ - ਸੋਸ਼ਲ ਮੀਡੀਆ ਸੁਨੇਹਾ",
    youtubeUrl: "https://www.youtube.com/watch?v=3JZ_D3ELwOQ",
    description: "ਨੌਜਵਾਨੀ ਨੂੰ ਪੰਜਾਬ ਦੇ ਹੱਕੀ ਮੁੱਦਿਆਂ ਨਾਲ ਜੋੜਨ ਦੀ ਵਿਸ਼ੇਸ਼ ਵੀਡੀਓ।",
    publishedAt: new Date(Date.now() - 86400000).toISOString()
  }
];

export async function GET() {
  try {
    const conn = await dbConnect();
    
    if (!conn) {
      return NextResponse.json({ success: true, data: MOCK_VIDEOS });
    }

    const videos = await MediaVideo.find({}).sort({ publishedAt: -1 });
    return NextResponse.json({ success: true, data: videos });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch media videos" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const conn = await dbConnect();
    
    if (!conn) {
      return NextResponse.json({ success: false, error: "Database not configured" }, { status: 500 });
    }

    const body = await req.json();
    if (!body.title || !body.youtubeUrl) {
      return NextResponse.json({ success: false, error: "Title and YouTube URL are required" }, { status: 400 });
    }

    const video = await MediaVideo.create(body);
    return NextResponse.json({ success: true, data: video }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
