import { NextResponse } from "next/server";
import { z } from "zod";

const violationSchema = z.object({
  sessionId: z.string(),
  type: z.enum([
    "tab_switch",
    "fullscreen_exit",
    "copy_paste",
    "right_click",
    "camera_off",
    "face_not_visible",
    "multiple_faces",
    "screenshot",
    "window_blur",
  ]),
  timestamp: z.string(),
  details: z.string().optional(),
  count: z.number().default(1),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = violationSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: result.error.issues },
        { status: 400 }
      );
    }

    // Forward to tRPC backend for logging
    const apiUrl = process.env.BICTA_API_URL;
    if (apiUrl) {
      await fetch(`${apiUrl}/trpc/competition.logViolation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ json: result.data }),
      }).catch(() => {
        // Non-critical — violation logged locally if backend fails
      });
    }

    return NextResponse.json({ logged: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error", detail: String(error) },
      { status: 500 }
    );
  }
}
