import { NextResponse } from "next/server";
import crypto from "crypto";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "tanjimmahmudrakin2@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "BictAadminsmurF984#";
const ADMIN_NAME = process.env.ADMIN_NAME || "Tanjim Mahmud Rakin";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (email?.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
      const payload = Buffer.from(JSON.stringify({
        id: 1, name: ADMIN_NAME, email: ADMIN_EMAIL, role: "admin",
        exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
      })).toString("base64");

      const res = NextResponse.json({ success: true, user: { id: 1, name: ADMIN_NAME, email: ADMIN_EMAIL, role: "admin" } });
      const cookieOpts = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, maxAge: 7 * 24 * 60 * 60, path: "/" };
      res.cookies.set("bicta_admin", payload, cookieOpts);
      res.cookies.set("bicta_session", payload, cookieOpts);
      return res;
    }

    const apiUrl = process.env.BICTA_API_URL;
    if (apiUrl) {
      const backendRes = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (backendRes.ok) {
        const data = await backendRes.json();
        const payload = Buffer.from(JSON.stringify({ ...data.user, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 })).toString("base64");
        const res = NextResponse.json({ success: true, user: data.user });
        const cookieOpts = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, maxAge: 7 * 24 * 60 * 60, path: "/" };
        res.cookies.set("bicta_session", payload, cookieOpts);
        if (data.user?.role === "admin") res.cookies.set("bicta_admin", payload, cookieOpts);
        return res;
      }
    }

    return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
  } catch {
    return NextResponse.json({ message: "Login failed" }, { status: 500 });
  }
}
