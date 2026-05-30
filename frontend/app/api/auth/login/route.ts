import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const apiUrl = process.env.BICTA_API_URL || "https://bicta-site-production.up.railway.app";
    const upstream = await fetch(`${apiUrl}/trpc/auth.login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ json: { email, password } }),
    });

    if (!upstream.ok) {
      const err = await upstream.json().catch(() => ({}));
      return NextResponse.json(
        { error: err?.error?.message || "Invalid credentials" },
        { status: 401 }
      );
    }

    const data = await upstream.json();
    const token = data?.result?.data?.token;
    const user  = data?.result?.data?.user;

    if (!token) {
      return NextResponse.json({ error: "Login failed — no token returned" }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true, user });
    response.cookies.set("bicta_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });
    return response;
  } catch (e) {
    console.error("Login error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
