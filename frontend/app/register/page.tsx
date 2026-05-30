"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Role = "participant" | "judge";
type Step = "form" | "otp";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole]         = useState<Role>("participant");
  const [step, setStep]         = useState<Step>("form");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [otpEmail, setOtpEmail] = useState("");
  const [otp, setOtp]           = useState("");

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", password: "", confirmPassword: "",
    university: "", studentId: "", department: "", graduationYear: "",
    organization: "", title: "", linkedIn: "",
  });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) { setError("Passwords do not match"); return; }
    if (form.password.length < 8) { setError("Password must be at least 8 characters"); return; }
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_BICTA_API_URL || "https://bicta-site-production.up.railway.app";
      const res = await fetch(`${apiUrl}/trpc/auth.register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ json: { ...form, role } }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message || "Registration failed");
      if (role === "judge") {
        setOtpEmail(form.email);
        setStep("otp");
      } else {
        router.push("/login?registered=1");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_BICTA_API_URL || "https://bicta-site-production.up.railway.app";
      const res = await fetch(`${apiUrl}/trpc/auth.verifyOtp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ json: { email: otpEmail, otp } }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message || "Invalid OTP");
      router.push("/login?registered=1");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "OTP verification failed");
    } finally {
      setLoading(false);
    }
  }

  if (step === "otp") {
    return (
      <div className="min-h-screen bg-bicta-void flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-bicta-surface border border-bicta-border rounded-2xl p-8">
          <h1 className="font-display text-2xl text-bicta-cream mb-2">Verify your email</h1>
          <p className="text-bicta-subtle text-sm mb-6">Enter the 6-digit OTP sent to <strong className="text-bicta-gold">{otpEmail}</strong></p>
          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
          <form onSubmit={handleOtp} className="space-y-4">
            <input type="text" maxLength={6} placeholder="000000" value={otp}
              onChange={e => setOtp(e.target.value)}
              className="w-full bg-bicta-raised border border-bicta-border rounded-lg px-4 py-3 text-bicta-cream text-center tracking-widest text-xl focus:outline-none focus:border-bicta-gold"
              required />
            <button type="submit" disabled={loading}
              className="w-full bg-bicta-gold text-bicta-void font-semibold py-3 rounded-lg hover:bg-bicta-gold-lt transition-colors disabled:opacity-50">
              {loading ? "Verifying…" : "Verify OTP"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bicta-void py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl text-bicta-cream mb-2">Join BICTA Elite</h1>
          <p className="text-bicta-subtle">Create your account to participate in competitions and events</p>
        </div>

        {/* Role selector */}
        <div className="flex gap-3 mb-8">
          {(["participant", "judge"] as Role[]).map(r => (
            <button key={r} onClick={() => setRole(r)}
              className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${
                role === r
                  ? "border-bicta-gold bg-bicta-gold/10 text-bicta-gold"
                  : "border-bicta-border text-bicta-subtle hover:border-bicta-gold/40"
              }`}>
              {r === "participant" ? "🎓 Participant" : "⚖️ Judge (requires email OTP)"}
            </button>
          ))}
        </div>

        <div className="bg-bicta-surface border border-bicta-border rounded-2xl p-8">
          {error && <p className="text-red-400 text-sm mb-4 bg-red-400/10 px-4 py-2 rounded-lg">{error}</p>}
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-bicta-subtle text-xs mb-1 block">First name</label>
                <input type="text" value={form.firstName} onChange={set("firstName")} required
                  className="w-full bg-bicta-raised border border-bicta-border rounded-lg px-3 py-2.5 text-bicta-cream text-sm focus:outline-none focus:border-bicta-gold" />
              </div>
              <div>
                <label className="text-bicta-subtle text-xs mb-1 block">Last name</label>
                <input type="text" value={form.lastName} onChange={set("lastName")} required
                  className="w-full bg-bicta-raised border border-bicta-border rounded-lg px-3 py-2.5 text-bicta-cream text-sm focus:outline-none focus:border-bicta-gold" />
              </div>
            </div>

            <div>
              <label className="text-bicta-subtle text-xs mb-1 block">Email</label>
              <input type="email" value={form.email} onChange={set("email")} required
                className="w-full bg-bicta-raised border border-bicta-border rounded-lg px-3 py-2.5 text-bicta-cream text-sm focus:outline-none focus:border-bicta-gold" />
            </div>

            {role === "participant" && (
              <>
                <div>
                  <label className="text-bicta-subtle text-xs mb-1 block">University</label>
                  <input type="text" value={form.university} onChange={set("university")}
                    className="w-full bg-bicta-raised border border-bicta-border rounded-lg px-3 py-2.5 text-bicta-cream text-sm focus:outline-none focus:border-bicta-gold" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-bicta-subtle text-xs mb-1 block">Department</label>
                    <input type="text" value={form.department} onChange={set("department")}
                      className="w-full bg-bicta-raised border border-bicta-border rounded-lg px-3 py-2.5 text-bicta-cream text-sm focus:outline-none focus:border-bicta-gold" />
                  </div>
                  <div>
                    <label className="text-bicta-subtle text-xs mb-1 block">Graduation year</label>
                    <input type="text" value={form.graduationYear} onChange={set("graduationYear")} placeholder="2026"
                      className="w-full bg-bicta-raised border border-bicta-border rounded-lg px-3 py-2.5 text-bicta-cream text-sm focus:outline-none focus:border-bicta-gold" />
                  </div>
                </div>
              </>
            )}

            {role === "judge" && (
              <>
                <div>
                  <label className="text-bicta-subtle text-xs mb-1 block">Organization</label>
                  <input type="text" value={form.organization} onChange={set("organization")} required
                    className="w-full bg-bicta-raised border border-bicta-border rounded-lg px-3 py-2.5 text-bicta-cream text-sm focus:outline-none focus:border-bicta-gold" />
                </div>
                <div>
                  <label className="text-bicta-subtle text-xs mb-1 block">Title / Position</label>
                  <input type="text" value={form.title} onChange={set("title")}
                    className="w-full bg-bicta-raised border border-bicta-border rounded-lg px-3 py-2.5 text-bicta-cream text-sm focus:outline-none focus:border-bicta-gold" />
                </div>
                <div>
                  <label className="text-bicta-subtle text-xs mb-1 block">LinkedIn URL</label>
                  <input type="url" value={form.linkedIn} onChange={set("linkedIn")}
                    className="w-full bg-bicta-raised border border-bicta-border rounded-lg px-3 py-2.5 text-bicta-cream text-sm focus:outline-none focus:border-bicta-gold" />
                </div>
              </>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-bicta-subtle text-xs mb-1 block">Password</label>
                <input type="password" value={form.password} onChange={set("password")} required minLength={8}
                  className="w-full bg-bicta-raised border border-bicta-border rounded-lg px-3 py-2.5 text-bicta-cream text-sm focus:outline-none focus:border-bicta-gold" />
              </div>
              <div>
                <label className="text-bicta-subtle text-xs mb-1 block">Confirm password</label>
                <input type="password" value={form.confirmPassword} onChange={set("confirmPassword")} required
                  className="w-full bg-bicta-raised border border-bicta-border rounded-lg px-3 py-2.5 text-bicta-cream text-sm focus:outline-none focus:border-bicta-gold" />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-bicta-gold text-bicta-void font-semibold py-3 rounded-xl hover:bg-bicta-gold-lt transition-colors disabled:opacity-50 mt-2">
              {loading ? "Creating account…" : role === "judge" ? "Register & get OTP" : "Create account"}
            </button>
          </form>
        </div>

        <p className="text-center text-bicta-subtle text-sm mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-bicta-gold hover:text-bicta-gold-lt">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
