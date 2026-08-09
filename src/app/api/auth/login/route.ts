import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import { checkRateLimit, recordFailedAttempt, resetLoginAttempts } from "@/lib/rateLimiter";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "super-secret-misl-satluj-key-12345");

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
    const body = await req.json().catch(() => ({}));
    const username = (body.username || "").trim();
    const password = body.password || "";

    const rateLimitKey = `${ip}:${username.toLowerCase()}`;

    // 1. Check Rate Limit / Lockout Status
    const { isLocked, remainingMinutes } = checkRateLimit(rateLimitKey);
    if (isLocked) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many failed attempts. Account locked temporarily for ${remainingMinutes} minute(s).`,
        },
        { status: 429 }
      );
    }

    // 2. Validate Credentials
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // SUCCESS: Reset failed attempts counter immediately
      resetLoginAttempts(rateLimitKey);

      // Create JWT token
      const token = await new SignJWT({ role: "admin", username })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("24h")
        .sign(JWT_SECRET);

      const response = NextResponse.json({ success: true, token });

      // Set Secure, HTTP-Only Cookie
      response.cookies.set({
        name: "admin_token",
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24, // 24 hours
      });

      return response;
    }

    // 3. FAILED LOGIN: Increment counter
    const { count, locked } = recordFailedAttempt(rateLimitKey);
    
    if (locked) {
      const lockoutMins = process.env.ADMIN_LOCKOUT_MINUTES || "15";
      return NextResponse.json(
        {
          success: false,
          error: `Maximum login attempts reached. Locked out for ${lockoutMins} minutes.`,
        },
        { status: 429 }
      );
    }

    const remainingAttempts = 4 - count;
    return NextResponse.json(
      {
        success: false,
        error: `Invalid credentials. ${remainingAttempts} attempt(s) remaining before temporary lockout.`,
      },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
