import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Mission from "@/models/Mission";

// Mock data for fallback
const MOCK_MISSIONS = [
  {
    _id: "m1",
    title: "ਨਵੀਂ ਲੀਡਰਸ਼ਿਪ",
    slug: "new-leadership",
    desc: "ਪੰਜਾਬ ਵਿੱਚ ਨਵੀਂ ਨੌਜਵਾਨ ਲੀਡਰਸ਼ਿਪ ਪੈਦਾ ਕਰਨ ਲਈ ਯਤਨਸ਼ੀਲ",
    content: "ਪੰਜਾਬ ਦੀ ਰਾਜਨੀਤੀ ਵਿੱਚ ਇੱਕ ਨਵੀਂ ਸਵੇਰ ਲਿਆਉਣ ਲਈ ਨੌਜਵਾਨਾਂ ਨੂੰ ਅੱਗੇ ਆਉਣਾ ਪਵੇਗਾ। ਮਿਸਲ ਸਤਲੁਜ ਦਾ ਮੁੱਖ ਉਦੇਸ਼ ਨੌਜਵਾਨਾਂ ਨੂੰ ਸਿਆਸੀ ਅਤੇ ਸਮਾਜਿਕ ਤੌਰ ਤੇ ਜਾਗਰੂਕ ਕਰਨਾ ਹੈ।\n\nਅਸੀਂ ਪਿੰਡ-ਪਿੰਡ ਜਾ ਕੇ ਨੌਜਵਾਨਾਂ ਨੂੰ ਇਕੱਠਾ ਕਰ ਰਹੇ ਹਾਂ ਅਤੇ ਉਨ੍ਹਾਂ ਨੂੰ ਆਪਣੀ ਜ਼ਿੰਮੇਵਾਰੀ ਦਾ ਅਹਿਸਾਸ ਕਰਵਾ ਰਹੇ ਹਾਂ।",
    iconUrl: "users",
    order: 1
  },
  {
    _id: "m2",
    title: "ਪੰਥਕ ਮਸਲੇ",
    slug: "panthak-masle",
    desc: "ਪੰਥਕ ਅਤੇ ਪੰਜਾਬ ਦੇ ਮਸਲਿਆਂ ਬਾਰੇ ਲੋਕਾਂ ਨੂੰ ਚੇਤਨ ਕਰਵਾਉਣਾ",
    content: "ਸਾਡੇ ਪੰਜਾਬ ਅਤੇ ਪੰਥ ਦੇ ਬਹੁਤ ਸਾਰੇ ਮਸਲੇ ਅਜੇ ਵੀ ਅਣਸੁਲਝੇ ਹਨ। ਬੰਦੀ ਸਿੰਘਾਂ ਦੀ ਰਿਹਾਈ, ਪਾਣੀਆਂ ਦਾ ਮਸਲਾ ਅਤੇ ਕੇਂਦਰ ਸਰਕਾਰ ਦੀਆਂ ਪੰਜਾਬ ਵਿਰੋਧੀ ਨੀਤੀਆਂ ਬਾਰੇ ਆਮ ਲੋਕਾਂ ਨੂੰ ਜਾਗਰੂਕ ਕਰਨਾ ਬਹੁਤ ਜ਼ਰੂਰੀ ਹੈ।\n\nਮਿਸਲ ਸਤਲੁਜ ਇਨ੍ਹਾਂ ਮੁੱਦਿਆਂ ਤੇ ਲਗਾਤਾਰ ਸੰਘਰਸ਼ ਕਰ ਰਹੀ ਹੈ।",
    iconUrl: "shield",
    order: 2
  },
  {
    _id: "m3",
    title: "ਸਿੱਖੀ ਸਿਧਾਂਤ",
    slug: "sikhi-sidhant",
    desc: "ਨਸ਼ਿਆਂ ਤੋਂ ਮੁਕਤ ਹੋ ਕੇ ਸਿੱਖੀ ਸਿਧਾਂਤਾਂ ਨਾਲ ਜੁੜਨ ਦੀ ਪ੍ਰੇਰਨਾ",
    content: "ਪੰਜਾਬ ਦੀ ਜਵਾਨੀ ਨੂੰ ਨਸ਼ਿਆਂ ਦੀ ਦਲਦਲ ਵਿੱਚੋਂ ਕੱਢਣ ਲਈ ਸਾਨੂੰ ਉਨ੍ਹਾਂ ਨੂੰ ਆਪਣੇ ਗੌਰਵਮਈ ਇਤਿਹਾਸ ਅਤੇ ਸਿੱਖੀ ਸਿਧਾਂਤਾਂ ਨਾਲ ਜੋੜਨਾ ਪਵੇਗਾ।\n\nਗੁਰੂ ਸਾਹਿਬਾਨ ਦੁਆਰਾ ਦਰਸਾਏ ਮਾਰਗ ਤੇ ਚੱਲ ਕੇ ਹੀ ਅਸੀਂ ਇੱਕ ਤੰਦਰੁਸਤ ਅਤੇ ਖੁਸ਼ਹਾਲ ਪੰਜਾਬ ਦੀ ਸਿਰਜਣਾ ਕਰ ਸਕਦੇ ਹਾਂ।",
    iconUrl: "book-open",
    order: 3
  },
];

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const conn = await dbConnect();
    
    if (!conn) {
      const mission = MOCK_MISSIONS.find(m => m.slug === slug);
      if (!mission) {
        return NextResponse.json({ success: false, error: "Mission not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: mission });
    }

    const mission = await Mission.findOne({ slug });
    
    if (!mission) {
      return NextResponse.json({ success: false, error: "Mission not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: mission });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch mission" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await req.json();
    const conn = await dbConnect();
    
    if (!conn) {
      return NextResponse.json({ success: true, data: body }); // Fake success for mock
    }
    
    // In edit mode, 'slug' is actually the '_id' passed from the frontend
    const mission = await Mission.findByIdAndUpdate(slug, body, { new: true });
    
    if (!mission) {
      return NextResponse.json({ success: false, error: "Mission not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: mission });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update mission" }, { status: 500 });
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
    
    // In edit mode, 'slug' is actually the '_id' passed from the frontend
    const mission = await Mission.findByIdAndDelete(slug);
    
    if (!mission) {
      return NextResponse.json({ success: false, error: "Mission not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete mission" }, { status: 500 });
  }
}
