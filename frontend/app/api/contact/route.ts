import { NextResponse } from "next/server";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  subject: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: result.error.issues },
        { status: 400 }
      );
    }

    const apiUrl = process.env.BICTA_API_URL;
    if (!apiUrl) {
      return NextResponse.json(
        { error: "BICTA_API_URL not configured" },
        { status: 500 }
      );
    }

    const trpcRes = await fetch(`${apiUrl}/trpc/contact.submit`, {
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

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error", detail: String(error) },
      { status: 500 }
    );
  }
}
