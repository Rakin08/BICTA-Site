import { NextResponse } from "next/server";

/**
 * Chat conversation logger
 * Stores chat sessions for admin analytics
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sessionId, messages, metadata } = body;

    // Log to console for now - can be connected to database later
    console.log("[Chat Log]", {
      sessionId,
      messageCount: messages?.length,
      timestamp: new Date().toISOString(),
      metadata,
    });

    // TODO: Store in database when backend is connected
    // const apiUrl = process.env.BICTA_API_URL;
    // if (apiUrl) {
    //   await fetch(`${apiUrl}/trpc/chat.log`, { ... });
    // }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to log chat", detail: String(error) },
      { status: 500 }
    );
  }
}
