import { Hono } from "hono";
import { db } from "../db";
import { users, otpCodes } from "../db/schema";
import { eq, and, gt } from "drizzle-orm";
import * as crypto from "crypto";
import * as nodemailer from "nodemailer";

const authRouter = new Hono();

// Password hashing (simple SHA256 + salt — upgrade to bcrypt if needed)
function hashPassword(password: string, salt: string): string {
  return crypto.createHmac("sha256", salt).update(password).digest("hex");
}
function generateSalt(): string {
  return crypto.randomBytes(16).toString("hex");
}
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Simple JWT (replace with proper JWT library in production)
function signToken(payload: object): string {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const secret = process.env.APP_SECRET || "bicta_secret";
  const sig = crypto.createHmac("sha256", secret).update(data).digest("base64url");
  return `${data}.${sig}`;
}
function verifyToken(token: string): any {
  try {
    const [data, sig] = token.split(".");
    const secret = process.env.APP_SECRET || "bicta_secret";
    const expected = crypto.createHmac("sha256", secret).update(data).digest("base64url");
    if (sig !== expected) return null;
    return JSON.parse(Buffer.from(data, "base64url").toString());
  } catch { return null; }
}

// Email sender
async function sendOTP(email: string, otp: string, name: string) {
  if (!process.env.SMTP_HOST) {
    console.log(`[DEV] OTP for ${email}: ${otp}`);
    return;
  }
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  await transport.sendMail({
    from: `BICTA <${process.env.SMTP_FROM || "noreply@bicta.org"}>`,
    to: email,
    subject: "Your BICTA Verification Code",
    html: `<div style="font-family:sans-serif;max-width:500px;margin:0 auto;background:#141414;padding:32px;border-radius:12px;border:1px solid #2a2a2a">
      <h2 style="color:#c9a84c;font-family:Georgia,serif">BICTA Verification</h2>
      <p style="color:#e0ddd5">Hi ${name},</p>
      <p style="color:#8a8680">Your 2FA verification code for your Judge account:</p>
      <div style="background:#0a0a0a;border:1px solid #c9a84c33;padding:20px;text-align:center;margin:24px 0;border-radius:8px">
        <span style="font-size:36px;font-weight:bold;letter-spacing:0.3em;color:#c9a84c;font-family:monospace">${otp}</span>
      </div>
      <p style="color:#8a8680;font-size:12px">This code expires in 15 minutes. Do not share it with anyone.</p>
      <p style="color:#8a8680;font-size:12px">If you didn't request this, please contact support@bicta.org</p>
    </div>`,
  });
}

// POST /api/auth/register
authRouter.post("/register", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, firstName, lastName, role, phone, dateOfBirth,
      university, studentId, department, graduationYear,
      organization, title, bio, linkedIn } = body;

    if (!email || !password || !firstName || !lastName) {
      return c.json({ message: "Required fields missing" }, 400);
    }
    if (password.length < 8) {
      return c.json({ message: "Password must be at least 8 characters" }, 400);
    }

    // Check duplicate
    const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existing.length > 0) return c.json({ message: "Email already registered" }, 409);

    const salt = generateSalt();
    const passwordHash = hashPassword(password, salt);
    const dbRole = role === "judge" ? "student" : (role || "student"); // judges start as student until verified
    const name = `${firstName} ${lastName}`;

    const [inserted] = await db.insert(users).values({
      unionId: `email_${crypto.randomBytes(12).toString("hex")}`,
      email, name, phone,
      role: dbRole as any,
      organization: organization || university,
      title,
      bio,
      passwordHash,
      passwordSalt: salt,
      firstName, lastName,
      dateOfBirth: dateOfBirth || null,
      studentId: studentId || null,
      department: department || null,
      graduationYear: graduationYear || null,
      university: university || null,
      linkedIn: linkedIn || null,
      pendingRole: role === "judge" ? "judge" : null,
      emailVerified: role !== "judge",
      isActive: role !== "judge",
    });

    // Send OTP for judges
    if (role === "judge") {
      const otp = generateOTP();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
      await db.insert(otpCodes).values({ email, otp, expiresAt, purpose: "verify_judge" });
      await sendOTP(email, otp, name);
      return c.json({ success: true, message: "OTP sent to email", requiresOtp: true });
    }

    return c.json({ success: true, message: "Account created successfully" });
  } catch (err: any) {
    console.error("Register error:", err);
    return c.json({ message: err.message || "Registration failed" }, 500);
  }
});

// POST /api/auth/verify-2fa
authRouter.post("/verify-2fa", async (c) => {
  try {
    const { email, otp } = await c.req.json();
    const now = new Date();
    const codes = await db.select().from(otpCodes)
      .where(and(eq(otpCodes.email, email), eq(otpCodes.otp, otp), gt(otpCodes.expiresAt, now)))
      .limit(1);

    if (codes.length === 0) return c.json({ message: "Invalid or expired OTP" }, 400);

    // Activate judge account
    await db.update(users)
      .set({ role: "judge" as any, emailVerified: true, isActive: true, pendingRole: null })
      .where(eq(users.email, email));

    // Delete used OTP
    await db.delete(otpCodes).where(eq(otpCodes.email, email));

    return c.json({ success: true, message: "Account verified. You can now log in." });
  } catch (err: any) {
    return c.json({ message: err.message || "Verification failed" }, 500);
  }
});

// POST /api/auth/login
authRouter.post("/login", async (c) => {
  try {
    const { email, password } = await c.req.json();
    const rows = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (rows.length === 0) return c.json({ message: "Invalid email or password" }, 401);

    const user = rows[0];
    if (!user.isActive) return c.json({ message: "Account not yet activated. Check your email for verification code." }, 403);
    if (!user.passwordHash || !user.passwordSalt) return c.json({ message: "Please use your original sign-in method" }, 400);

    const hash = hashPassword(password, user.passwordSalt);
    if (hash !== user.passwordHash) return c.json({ message: "Invalid email or password" }, 401);

    const token = signToken({ id: user.id, email: user.email, role: user.role, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 });

    const res = c.json({ success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar } });
    (res as any).headers?.set("Set-Cookie", `bicta_token=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`);
    return res;
  } catch (err: any) {
    return c.json({ message: err.message || "Login failed" }, 500);
  }
});

// GET /api/auth/me
authRouter.get("/me", async (c) => {
  try {
    const cookie = c.req.header("cookie") || "";
    const tokenMatch = cookie.match(/bicta_token=([^;]+)/);
    if (!tokenMatch) return c.json({ user: null }, 401);
    const payload = verifyToken(tokenMatch[1]);
    if (!payload || payload.exp < Date.now()) return c.json({ user: null }, 401);
    const rows = await db.select().from(users).where(eq(users.id, payload.id)).limit(1);
    if (!rows.length) return c.json({ user: null }, 401);
    const u = rows[0];
    return c.json({ user: { id: u.id, name: u.name, email: u.email, role: u.role, avatar: u.avatar, university: u.university, organization: u.organization } });
  } catch { return c.json({ user: null }, 401); }
});

// POST /api/auth/logout
authRouter.post("/logout", (c) => {
  const res = c.json({ success: true });
  (res as any).headers?.set("Set-Cookie", "bicta_token=; HttpOnly; Path=/; Max-Age=0");
  return res;
});

export { authRouter };
