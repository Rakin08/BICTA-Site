import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

const REVALIDATE_SECRET = process.env.SANITY_REVALIDATE_SECRET || "";

/**
 * POST /api/revalidate
 * Triggered by Sanity webhook on document publish/unpublish.
 * Revalidates Next.js cache tags based on document type.
 */
export async function POST(req: Request) {
  // Validate secret
  const secret = req.headers.get("x-sanity-secret");
  if (!REVALIDATE_SECRET || secret !== REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const docType: string = body._type;

    // Map Sanity document types to cache tags
    const tagMap: Record<string, string[]> = {
      siteSettings: ["sanity", "homepage"],
      aboutPage: ["sanity", "about"],
      founder: ["sanity", "about", "founders"],
      advisor: ["sanity", "about", "advisors"],
      partner: ["sanity", "partners", "supporters"],
    };

    const tags = tagMap[docType] || ["sanity"];

    // Revalidate all relevant tags
    for (const tag of tags) {
      await revalidateTag(tag);
    }

    return NextResponse.json({
      revalidated: true,
      tags,
      docType,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body", detail: String(error) },
      { status: 400 }
    );
  }
}
