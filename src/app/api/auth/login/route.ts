import { NextResponse } from "next/server";
import { SignJWT } from "jose";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "super-secret-misl-satluj-key-12345");

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Create JWT token
      const token = await new SignJWT({ role: "admin" })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("24h")
        .sign(JWT_SECRET);

      return NextResponse.json({ success: true, token });
    }

    return NextResponse.json(
      { success: false, error: "Invalid credentials" },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
