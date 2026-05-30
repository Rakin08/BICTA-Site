import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || "tanjimmahmudrakin2@gmail.com",
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 });
    }

    // Try to save to backend DB
    const apiUrl = process.env.BICTA_API_URL;
    if (apiUrl) {
      try {
        await fetch(`${apiUrl}/trpc/contact.submit`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ json: { name, email, subject, message } }),
        });
      } catch { /* backend offline — email fallback below */ }
    }

    // Always send email notification
    await transporter.sendMail({
      from: `BICTA Contact <${process.env.SMTP_USER || "tanjimmahmudrakin2@gmail.com"}>`,
      to: process.env.SMTP_USER || "tanjimmahmudrakin2@gmail.com",
      subject: `[BICTA Contact] ${subject || "New message"} — from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject || "N/A"}</p>
        <hr/>
        <p>${message.replace(/\n/g, "<br/>")}</p>
      `,
      replyTo: email,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Contact form error:", e);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
