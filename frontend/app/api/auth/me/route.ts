import { NextResponse } from "next/server";
import { cookies } from "next/headers";
export async function GET() {
  const session = (await cookies()).get("bicta_session");
  if (!session?.value) return NextResponse.json({ user: null }, { status: 401 });
  try {
    const user = JSON.parse(Buffer.from(session.value, "base64").toString());
    if (user.exp < Date.now()) return NextResponse.json({ user: null }, { status: 401 });
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
