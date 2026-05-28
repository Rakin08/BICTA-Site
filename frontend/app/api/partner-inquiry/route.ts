import { NextResponse } from "next/server";
import { z } from "zod";

const inquirySchema = z.object({
  organizationName: z.string().min(1, "Organization name is required"),
  contactName: z.string().min(1, "Contact name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  interestType: z.enum([
    "sponsor",
    "university_partner",
    "media_partner",
    "ecosystem_partner",
    "other",
  ]),
  notes: z.string().optional(),
});

export type PartnerInquiryInput = z.infer<typeof inquirySchema>;

/**
 * POST /api/partner-inquiry
 * Proxies partner inquiry submissions to the tRPC backend.
 * Validates input with Zod before forwarding.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate input
    const result = inquirySchema.safeParse(body);
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

    const trpcRes = await fetch(`${apiUrl}/trpc/partner.submit`, {
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
