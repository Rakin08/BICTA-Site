import { NextResponse } from "next/server";
import { z } from "zod";

const submissionSchema = z.object({
  sessionId: z.string(),
  competitionId: z.string(),
  userId: z.string(),
  userName: z.string(),
  answers: z.record(z.union([z.string(), z.array(z.string())])),
  timeSpent: z.number(), // seconds
  violations: z.array(
    z.object({
      type: z.string(),
      timestamp: z.string(),
      details: z.string().optional(),
    })
  ),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = submissionSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: result.error.issues },
        { status: 400 }
      );
    }

    // Forward to tRPC backend
    const apiUrl = process.env.BICTA_API_URL;
    if (!apiUrl) {
      return NextResponse.json(
        { error: "BICTA_API_URL not configured" },
        { status: 500 }
      );
    }

    const trpcRes = await fetch(`${apiUrl}/trpc/competition.submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ json: result.data }),
    });

    if (!trpcRes.ok) {
      const errText = await trpcRes.text();
      return NextResponse.json(
        { error: "Backend submission failed", detail: errText },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, sessionId: result.data.sessionId });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error", detail: String(error) },
      { status: 500 }
    );
  }
}
