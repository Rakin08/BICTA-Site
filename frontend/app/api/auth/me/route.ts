import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("bicta_token")?.value;
  if (!token) return NextResponse.json({ user: null }, { status: 401 });

  try {
    const apiUrl = process.env.BICTA_API_URL || "https://bicta-site-production.up.railway.app";
    const res = await fetch(`${apiUrl}/trpc/auth.me`, {
      headers: { Cookie: `bicta_token=${token}` },
      cache: "no-store",
    });
    if (!res.ok) return NextResponse.json({ user: null }, { status: 401 });
    const data = await res.json();
    return NextResponse.json({ user: data?.result?.data });
  } catch {
    // fallback: decode JWT payload
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return NextResponse.json({ user: payload });
    } catch {
      return NextResponse.json({ user: null }, { status: 401 });
    }
  }
}
