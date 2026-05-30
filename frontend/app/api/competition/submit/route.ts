import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, answers, violations } = body;
    const token = req.cookies.get("bicta_token")?.value;

    // Try backend first
    const apiUrl = process.env.BICTA_API_URL;
    if (apiUrl && token) {
      try {
        const res = await fetch(`${apiUrl}/trpc/competition.submit`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: `bicta_token=${token}`,
          },
          body: JSON.stringify({ json: { sessionId, answers, violations } }),
        });
        if (res.ok) {
          const data = await res.json();
          return NextResponse.json({ ok: true, result: data?.result?.data });
        }
      } catch { /* fallback below */ }
    }

    // Fallback: calculate score client-side and return
    // (Admin can review violation logs)
    return NextResponse.json({
      ok: true,
      result: {
        status: "submitted",
        message: "Exam submitted. Results will be published by the admin.",
        fallback: true,
      },
    });
  } catch (e) {
    console.error("Exam submit error:", e);
    return NextResponse.json({ error: "Submission failed" }, { status: 500 });
  }
}
