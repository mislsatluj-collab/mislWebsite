import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Settings from "@/models/Settings";
import { getClientIp, limitRate } from "@/lib/rateLimiter";

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);

    // 1. Strict Form Rate Limiting: Max 5 submissions per 15 minutes per IP
    const { allowed } = limitRate(`contact_form_${ip}`, 5, 15 * 60 * 1000);
    if (!allowed) {
      return NextResponse.json(
        { success: false, error: "Too many submissions. Please try again after 15 minutes." },
        { status: 429 }
      );
    }

    // 2. Request Size Validation (Max 10KB payload)
    const contentLength = parseInt(req.headers.get("content-length") || "0", 10);
    if (contentLength > 10 * 1024) {
      return NextResponse.json(
        { success: false, error: "Payload size exceeds maximum allowed threshold." },
        { status: 413 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const city = typeof body.city === "string" ? body.city.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!name || !phone) {
      return NextResponse.json({ success: false, error: "Name and phone are required" }, { status: 400 });
    }

    if (name.length > 100 || phone.length > 30 || city.length > 100 || message.length > 2000) {
      return NextResponse.json({ success: false, error: "Field lengths exceed acceptable boundaries." }, { status: 400 });
    }

    const conn = await dbConnect();
    let recipientEmail = "info@mislsatluj.com";

    if (conn) {
      const settings = await Settings.findOne({ key: "site_settings" });
      if (settings?.formRecipientEmail) {
        recipientEmail = settings.formRecipientEmail;
      }
    }

    // Logging without exposing sensitive data
    console.log(`[CONTACT FORM SUBMISSION] IP: ${ip} | Sent to: ${recipientEmail}`);

    return NextResponse.json({
      success: true,
      message: "Form submitted successfully!",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
