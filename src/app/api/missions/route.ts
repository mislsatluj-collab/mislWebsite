import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Mission from "@/models/Mission";
import { verifyAdminAuth } from "@/lib/auth";

const MOCK_MISSIONS = [
  {
    _id: "m1",
    title: "ਪੰਥਕ ਮਸਲੇ",
    slug: "panthak-masle",
    desc: "ਪੰਥਕ ਮਸਲੇ: ਸ਼੍ਰੋਮਣੀ ਗੁਰਦੁਆਰਾ ਪਰਬੰਧਕ ਕਮੇਟੀ ਦੀ ਖੁਦ-ਮੁਖਤਿਆਰੀ, ਧਰਮ ਵਿੱਚ ਸਰਕਾਰੀ ਦਖਲ-ਅੰਦਾਜੀ ਤੇ ਰੋਕ, ਆਰਟੀਕਲ 25 ਅਤੇ ਬੰਦੀ ਸਿੰਘਾਂ ਦੀ ਰਿਹਾਈ।",
    iconUrl: "shield",
    order: 1
  }
];

function generateSlug(title: string) {
  let slug = title.trim().replace(/\s+/g, '-').replace(/[?|!.,'"#@^&%*()\[\]{}+=<>]/g, '');
  const randomStr = Math.random().toString(36).substring(2, 6);
  return `${slug}-${randomStr}`;
}

export async function GET() {
  try {
    const conn = await dbConnect();
    if (!conn) {
      return NextResponse.json({ success: true, data: MOCK_MISSIONS });
    }

    const missions = await Mission.find({}).sort({ order: 1, createdAt: 1 }).lean();
    return NextResponse.json({ success: true, data: missions });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch missions" }, { status: 500 });
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
    if (!body.title || !body.desc) {
      return NextResponse.json({ success: false, error: "Title and description are required" }, { status: 400 });
    }

    if (!body.slug && body.title) {
      body.slug = generateSlug(body.title);
    }

    const mission = await Mission.create(body);
    return NextResponse.json({ success: true, data: mission }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Failed to create mission" }, { status: 400 });
  }
}
