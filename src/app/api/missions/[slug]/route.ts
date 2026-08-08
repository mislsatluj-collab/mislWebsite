import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongodb";
import Mission from "@/models/Mission";

// Mock data for fallback
const MOCK_MISSIONS = [
  {
    _id: "m1",
    title: "ਪੰਥਕ ਮਸਲੇ",
    slug: "panthak-masle",
    desc: "ਪੰਥਕ ਮਸਲੇ: ਸ਼੍ਰੋਮਣੀ ਗੁਰਦੁਆਰਾ ਪਰਬੰਧਕ ਕਮੇਟੀ ਦੀ ਖੁਦ-ਮੁਖਤਿਆਰੀ, ਧਰਮ ਵਿੱਚ ਸਰਕਾਰੀ ਦਖਲ-ਅੰਦਾਜੀ ਤੇ ਰੋਕ, ਆਰਟੀਕਲ 25 ਅਤੇ ਬੰਦੀ ਸਿੰਘਾਂ ਦੀ ਰਿਹਾਈ।",
    content: `ਪੰਥਕ ਮਸਲੇ

ੳ. ਸ਼੍ਰੋਮਣੀ ਗੁਰਦੁਆਰਾ ਪਰਬੰਧਕ ਕਮੇਟੀ ਦੀ ਖੁਦ-ਮੁਖਤਿਆਰੀ
ਸਿੱਖਾਂ ਨੇ, ਸਮੇਂ ਦੇ ਹਲਾਤ ਅਤੇ ਲੋੜਾਂ ਨੂੰ ਵੇਖਦੇ ਹੋਏ ਸ਼੍ਰੋਮਣੀ ਗੁਰਦੁਆਰਾ ਪ੍ਰਬੰਧਕ ਕਮੇਟੀ ਦਾ ਗਠਨ ਕਰਾਉਣ ਲਈ ਲੰਮਾ ਸੰਘਰਸ਼ ਕੀਤਾ। 
ਗੁਰਦੁਆਰੇ ਅਜੇ ਵੀ ਸਰਕਾਰ ਅਧੀਨ ਹੀ ਹਨ। ਕਮੇਟੀ ਦੇ ਸੰਵਿਧਾਨ ਵਿੱਚ ਕਿਸੇ ਵੀ ਤਰ੍ਹਾਂ ਦੀ ਸੋਧ ਕਰਨ ਦਾ ਹੱਕ ਭਾਰਤ ਸਰਕਾਰ ਕੋਲ ਹੀ ਹੈ।
ਮੰਗ: ਸ਼੍ਰੋਮਣੀ ਗੁਰਦੁਆਰਾ ਪ੍ਰਬੰਧਕ ਕਮੇਟੀ ਪੂਰਨ ਤੌਰ ਤੇ ਖੁਦਮੁਖਤਿਆਰ ਸੰਸਥਾ ਹੋਵੇ ਅਤੇ ਇਸ ਦਾ ਪ੍ਰਬੰਧ ਸਿੱਖੀ ਦੀਆਂ ਕਦਰਾਂ ਕੀਮਤਾਂ ਅਨੁਸਾਰ ਚਲਦਾ ਹੋਵੇ।

ਅ. ਧਰਮ ਵਿੱਚ ਸਰਕਾਰੀ ਦਖਲ-ਅੰਦਾਜੀ ਤੇ ਰੋਕ
ਸਿੱਖ ਮਸਲਿਆਂ ਸਬੰਧੀ ਕੇਂਦਰ ਅਤੇ ਸੂਬਾ ਸਰਕਾਰਾਂ ਵੱਲੋਂ ਦਖਲ ਅੰਦਾਜੀ ਰੋਕਣ ਲਈ 1959 ਵਿੱਚ ਇੱਕ ਸਮਝੌਤਾ ਕੀਤਾ ਗਿਆ ਸੀ, ਜਿਸ ਨੂੰ "ਨੇਹਰੂ-ਤਾਰਾ ਸਿੰਘ ਪੈਕਟ" ਕਿਹਾ ਜਾਂਦਾ ਹੈ।
ਮੰਗ: ਇਸ ਦਖਲ-ਅੰਦਾਜੀ ਨੂੰ ਰੋਕਣ ਲਈ ਨੇਹਰੂ-ਤਾਰਾ ਸਿੰਘ ਪੈਕਟ ਨੂੰ ਸੰਵਿਧਾਨਕ ਮਾਨਤਾ ਦਿੱਤੀ ਜਾਵੇ।

ੲ. ਸਿੱਖਾਂ ਨੂੰ ਆਪਣੇ ਆਪ ਨੂੰ ਪਰਿਭਾਸ਼ਿਤ ਕਰਨ ਦਾ ਹੱਕ
ਸ਼ੁਰੂ ਤੋਂ ਹੀ ਸਿੱਖਾਂ ਨੇ ਸੰਵਿਧਾਨ ਦੇ ਆਰਟੀਕਲ 25 ਵਿੱਚ ਸਿੱਖਾਂ ਨੂੰ ਹਿੰਦੂ ਦੱਸੇ ਜਾਣ ਦਾ ਵਿਰੋਧ ਕੀਤਾ ਹੈ।
ਮੰਗ: ਸਿੱਖਾਂ ਨੂੰ ਆਪਣੇ ਆਪ ਨੂੰ ਪ੍ਰਭਾਸ਼ਿਤ ਕਰਨ ਦਾ ਹੱਕ ਦਿੱਤਾ ਜਾਵੇ ਅਤੇ ਆਰਟੀਕਲ 25 ਵਿੱਚ ਸੋਧ ਕਰ ਕੇ ਸਿੱਖ ਧਰਮ ਨੂੰ ਇੱਕ ਵੱਖਰਾ ਧਰਮ ਮੰਨਿਆ ਜਾਵੇ।

ਸ. ਪੰਜਾਬ ਤੋਂ ਬਾਹਰ ਰਹਿਣ ਵਾਲੇ ਸਿੱਖਾਂ ਨੂੰ ਸਹੂਲਤਾਂ
• ਸੰਵਿਧਾਨਕ ਨਾਮਜਦਗੀ: ਲੋਕ ਸਭਾ ਅਤੇ ਵਿਧਾਨ ਸਭਾਵਾਂ ਵਿੱਚ ਨਾਮਜਦਗੀ।
• SGPC 'ਚ ਨੁਮਾਇੰਦਗੀ (Co-Opted Members)।

ਹ. ਸ਼੍ਰੀ ਨਨਕਾਣਾ ਸਾਹਿਬ ਅਤੇ ਹੋਰ ਗੁਰਧਾਮਾਂ ਦੇ ਖੁੱਲ੍ਹੇ ਦਰਸ਼ਨ ਦੀਦਾਰ
• ਰੋਜ਼ਾਨਾ ਬਿਨਾਂ ਕਿਸੇ ਰੋਕ-ਟੋਕ, ਦਸਤਾਵੇਜ਼ੀ ਕਾਰਵਾਈ ਅਤੇ ਫ਼ੀਸ ਦੇ ਖੁੱਲ੍ਹੇ ਦਰਸ਼ਨ ਦੀਦਾਰ ਦੀ ਸਹੂਲਤ।`,
    iconUrl: "shield",
    order: 1
  },
  {
    _id: "m2",
    title: "ਮਿਸਲ ਸਤਲੁਜ ਮਨੋਰਥ ਤੇ ਟੀਚਾ",
    slug: "misl-satluj-manorath-te-teacha",
    desc: "ਮਿਸਲ ਸਤਲੁਜ ਦਾ ਮੁੱਖ ਮਨੋਰਥ ਤੇ ਟੀਚਾ: ਪੰਜਾਬ ਦੀ ਸਵੈ-ਨਿਰਣੇ ਦੀ ਪ੍ਰਭੂਸੱਤਾ, ਆਰਥਿਕ ਬਹਾਲੀ, ਖੇਤੀਬਾੜੀ, ਸਿੱਖਿਆ ਅਤੇ ਸਨਅਤੀ ਇਨਕਲਾਬ।",
    content: `ਮਿਸਲ ਸਤਲੁਜ ਮਨੋਰਥ ਤੇ ਟੀਚਾ

1. ਵਿਸ਼ੇਸ਼ ਅਧਿਕਾਰ ਤੇ ਸੁਰੱਖਿਆ:
• ਰੁਜ਼ਗਾਰ ਸੁਰੱਖਿਆ: ਆਰਟੀਕਲ 16(3) ਤਹਿਤ ਸਰਕਾਰੀ ਤੇ ਅਰਧ-ਸਰਕਾਰੀ ਨੌਕਰੀਆਂ ਪੰਜਾਬੀਆਂ ਲਈ ਰਾਖਵੀਆਂ ਹੋਣ।
• ਜਨਸੰਖਿਆ ਸੁਰੱਖਿਆ: ਬਾਹਰੀ ਆਵਾਸ ਨੂੰ ਰੋਕਣ ਲਈ ਸਿਰਫ਼ ਪੰਜਾਬੀ ਮੂਲ ਦਾ ਵਸਨੀਕ ਹੀ ਵੋਟਰ ਬਣ ਸਕੇ।
• ਜ਼ਮੀਨੀ ਮਲਕੀਅਤ: ਖੇਤੀਬਾੜੀ ਜ਼ਮੀਨ ਖ਼ਰੀਦਣ ਦਾ ਹੱਕ ਸਿਰਫ਼ ਪੰਜਾਬੀ ਮੂਲ ਦੇ ਵਿਅਕਤੀਆਂ ਕੋਲ ਹੋਵੇ।
• ਟੋਲ ਟੈਕਸ ਤੋਂ ਛੋਟ: ਪੰਜਾਬ ਦੀਆਂ ਗੱਡੀਆਂ ਤੋਂ ਟੋਲ ਟੈਕਸ ਨਾ ਲਿਆ ਜਾਵੇ।

2. ਵਿੱਤੀ ਬਹਾਲੀ ਲਈ ਸਹਿਯੋਗ:
• Special Category State (SCS) ਦਾ ਦਰਜਾ ਦਿੱਤਾ ਜਾਵੇ ਅਤੇ 10 ਸਾਲਾਂ ਲਈ ਕਰਜ਼ਾ ਮੋੜਨ ਤੋਂ ਛੋਟ।

3. ਖੇਤੀਬਾੜੀ ਨੀਤੀ (Farm to Fork Strategy):
• ਮਾਰਕਫੈੱਡ ਅਤੇ ਪੰਜਾਬ ਐਗਰੋ ਨੂੰ ਮੁੜ ਸੁਰਜੀਤ ਕਰਕੇ "Farm to Fork" ਨੈੱਟਵਰਕ ਤਿਆਰ ਕੀਤਾ ਜਾਵੇ।

4. ਸਨਅਤ ਅਤੇ ਵਪਾਰ:
• Data, Analytics, AI ਅਤੇ ਸਾਈਬਰ ਸੁਰੱਖਿਆ ਵਰਗੀਆਂ ਤਕਨੀਕਾਂ ਨਾਲ ਚੌਥੇ ਸਨਅਤੀ ਇਨਕਲਾਬ ਵੱਲ ਵਧਣਾ।

5. ਸਿੱਖਿਆ ਮਾਡਲ & ਪੰਜਾਬੀ ਭਾਸ਼ਾ:
• ਪੰਜਾਬੀ ਭਾਸ਼ਾ ਅਤੇ ਗੁਰਮੁਖੀ ਲਿਪੀ ਦੀ ਵਰਤੋਂ ਅਤੇ ਵਿਕਾਸ ਨੂੰ ਜ਼ਮੀਨੀ ਪੱਧਰ 'ਤੇ ਤੁਰੰਤ ਲਾਗੂ ਕਰਨਾ।

6. ਦਰਿਆਈ ਪਾਣੀ, ਵਾਤਾਵਰਣ ਅਤੇ ਸਰਹੱਦੀ ਸਹੂਲਤਾਂ:
• ਪੰਜਾਬ ਦੇ ਦਰਿਆਈ ਪਾਣੀਆਂ ਦਾ ਪ੍ਰਬੰਧ ਪੰਜਾਬ ਦੇ ਆਪਣੇ ਹੱਥਾਂ ਵਿੱਚ ਹੋਵੇ।
• 4 ਕੌਮਾਂਤਰੀ ਲਾਂਘੇ ਖੋਲ੍ਹੇ ਜਾਣ (ਹੁਸੈਨੀਵਾਲਾ, ਵਾਘਾ, ਸੁਲੇਮਾਨਕੀ, ਹਿੰਦੁਸਤਾਨ ਤਿੱਬਤ ਹਾਈਵੇ ਰੋਡ)।

7. ਬੰਦੀ ਸਿੰਘਾਂ ਦੀ ਰਿਹਾਈ:
• ਜੇਲ੍ਹਾਂ ਵਿੱਚ ਬੰਦ 'ਬੰਦੀ ਸਿੱਖਾਂ' ਨੂੰ ਰਾਜਨੀਤਿਕ ਕੈਦੀ (Political Prisoners) ਵਜੋਂ ਪ੍ਰਮਾਣਿਤ ਕਰਕੇ ਤੁਰੰਤ ਅਤੇ ਬਿਨਾਂ ਸ਼ਰਤ ਰਿਹਾਅ ਕੀਤਾ ਜਾਵੇ।`,
    iconUrl: "book-open",
    order: 2
  }
];

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
      const mission = MOCK_MISSIONS.find(m => m.slug === decodedSlug || m.slug === slug || m._id === slug);
      if (!mission) {
        return NextResponse.json({ success: false, error: "Mission not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: mission });
    }

    let mission = null;
    if (mongoose.Types.ObjectId.isValid(slug)) {
      mission = await Mission.findById(slug);
    }
    if (!mission && mongoose.Types.ObjectId.isValid(decodedSlug)) {
      mission = await Mission.findById(decodedSlug);
    }
    if (!mission) {
      mission = await Mission.findOne({ slug: decodedSlug });
    }
    if (!mission) {
      mission = await Mission.findOne({ slug });
    }
    
    if (!mission) {
      return NextResponse.json({ success: false, error: "Mission not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: mission });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "Failed to fetch mission" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    let decodedSlug = slug;
    try {
      decodedSlug = decodeURIComponent(slug);
    } catch (e) {}

    const body = await req.json();
    const conn = await dbConnect();
    
    if (!conn) {
      return NextResponse.json({ success: true, data: body }); // Fake success for mock
    }
    
    let mission = null;
    if (mongoose.Types.ObjectId.isValid(slug)) {
      mission = await Mission.findByIdAndUpdate(slug, body, { new: true, runValidators: true });
    }
    if (!mission && mongoose.Types.ObjectId.isValid(decodedSlug)) {
      mission = await Mission.findByIdAndUpdate(decodedSlug, body, { new: true, runValidators: true });
    }
    if (!mission) {
      mission = await Mission.findOneAndUpdate({ slug: decodedSlug }, body, { new: true, runValidators: true });
    }
    if (!mission) {
      mission = await Mission.findOneAndUpdate({ slug }, body, { new: true, runValidators: true });
    }
    
    if (!mission) {
      return NextResponse.json({ success: false, error: "Mission not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: mission });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "Failed to update mission" }, { status: 500 });
  }
}

export async function DELETE(
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
      return NextResponse.json({ success: true }); // Fake success for mock
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
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "Failed to delete mission" }, { status: 500 });
  }
}
