import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "super-secret-misl-satluj-key-12345");

export async function verifyAdminAuth(req: Request): Promise<{ authenticated: boolean; user?: any }> {
  try {
    const cookieHeader = req.headers.get("cookie");
    let token = "";

    if (cookieHeader) {
      const match = cookieHeader.match(/admin_token=([^;]+)/);
      if (match) {
        token = match[1];
      }
    }

    if (!token) {
      const authHeader = req.headers.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return { authenticated: false };
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (payload && payload.role === "admin") {
      return { authenticated: true, user: payload };
    }

    return { authenticated: false };
  } catch (error) {
    return { authenticated: false };
  }
}
