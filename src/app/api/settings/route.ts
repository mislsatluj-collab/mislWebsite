import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Settings from "@/models/Settings";
import { verifyAdminAuth } from "@/lib/auth";

const DEFAULT_SETTINGS = {
  heroImageUrl: "/images/scraped_1.jpg",
  aboutImageUrl: "/images/scraped_2.jpeg",
  officeAddress: "ਕਿਸਾਨ ਭਵਨ, ਸੈਕਟਰ 35\nਚੰਡੀਗੜ੍ਹ, ਪੰਜਾਬ",
  phoneNumbers: "+91 98147 54739\n+91 89686 17046",
  contactEmail: "info@mislsatluj.com",
  formRecipientEmail: "info@mislsatluj.com",
};

export async function GET() {
  try {
    const conn = await dbConnect();
    
    if (!conn) {
      return NextResponse.json({ success: true, data: DEFAULT_SETTINGS });
    }

    let settings = await Settings.findOne({ key: "site_settings" }).lean();
    if (!settings) {
      settings = await Settings.create({ key: "site_settings", ...DEFAULT_SETTINGS });
    }

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    // Enforce Backend Authentication
    const { authenticated } = await verifyAdminAuth(req);
    if (!authenticated) {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }

    const conn = await dbConnect();
    const body = await req.json();
    
    if (!conn) {
      return NextResponse.json({ success: false, error: "Database not connected" }, { status: 500 });
    }

    let settings = await Settings.findOneAndUpdate(
      { key: "site_settings" },
      { $set: body },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, data: settings });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Failed to update settings" }, { status: 500 });
  }
}
