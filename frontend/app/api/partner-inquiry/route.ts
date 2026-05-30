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
    const { name, email, company, partnershipType, message } = await req.json();

    if (!name || !email || !company) {
      return NextResponse.json({ error: "Name, email, and company are required" }, { status: 400 });
    }

    const apiUrl = process.env.BICTA_API_URL;
    if (apiUrl) {
      try {
        await fetch(`${apiUrl}/trpc/partner.submitInquiry`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ json: { name, email, company, partnershipType, message } }),
        });
      } catch { /* fallback to email */ }
    }

    await transporter.sendMail({
      from: `BICTA <${process.env.SMTP_USER || "tanjimmahmudrakin2@gmail.com"}>`,
      to: process.env.SMTP_USER || "tanjimmahmudrakin2@gmail.com",
      subject: `[BICTA Partner] New inquiry from ${company}`,
      html: `
        <h2>New Partnership Inquiry</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company}</p>
        <p><strong>Partnership type:</strong> ${partnershipType || "N/A"}</p>
        <hr/>
        <p>${(message || "").replace(/\n/g, "<br/>")}</p>
      `,
      replyTo: email,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Partner inquiry error:", e);
    return NextResponse.json({ error: "Failed to send inquiry" }, { status: 500 });
  }
}
