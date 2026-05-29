"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Eye, EyeOff, Loader2, Shield, Mail, Phone } from "lucide-react";
import Link from "next/link";

type Role = "participant" | "judge";

const ROLES: { value: Role; label: string; description: string; icon: any }[] = [
  { value: "participant", label: "Participant", description: "Register for competitions, submit entries, track results.", icon: UserPlus },
  { value: "judge", label: "Judge / Mentor", description: "Evaluate submissions, score participants, requires 2FA verification.", icon: Shield },
];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<"role" | "details" | "verify">("role");
  const [role, setRole] = useState<Role>("participant");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [registeredEmail, setRegisteredEmail] = useState("");

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    dateOfBirth: "", university: "", studentId: "",
    department: "", graduationYear: "",
    organization: "", title: "",
    password: "", confirmPassword: "",
    bio: "", linkedIn: "",
  });

  const u = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return setError("Passwords do not match");
    setLoading(true); setError("");
    try {
      const apiUrl = process.env.NEXT_PUBLIC_BICTA_API_URL || "";
      const res = await fetch(`${apiUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");
      setRegisteredEmail(form.email);
      if (role === "judge") {
        setStep("verify");
        setOtpSent(true);
      } else {
        router.push("/login?message=registered");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const apiUrl = process.env.NEXT_PUBLIC_BICTA_API_URL || "";
      const res = await fetch(`${apiUrl}/api/auth/verify-2fa`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: registeredEmail, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Verification failed");
      router.push("/login?message=verified");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ label, name, type = "text", placeholder = "", required = false }: any) => (
    <div>
      <label className="block text-bicta-muted text-xs uppercase tracking-wider mb-1.5">{label}{required && " *"}</label>
      <input
        type={type} value={(form as any)[name]} onChange={e => u(name, e.target.value)}
        required={required} placeholder={placeholder}
        className="w-full bg-bicta-raised border border-bicta-border text-bicta-cream px-4 py-3 text-sm focus:outline-none focus:border-bicta-gold/60 rounded transition-colors"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-bicta-void flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {["role", "details", role === "judge" ? "verify" : ""].filter(Boolean).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              {i > 0 && <div className="w-8 h-px bg-bicta-border" />}
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                step === s ? "bg-bicta-gold text-bicta-void" : "bg-bicta-surface border border-bicta-border text-bicta-subtle"
              }`}>{i + 1}</div>
            </div>
          ))}
        </div>

        <div className="bg-bicta-surface border border-bicta-border rounded-xl p-8">
          {/* STEP 1: Choose role */}
          {step === "role" && (
            <>
              <h1 className="font-display text-2xl text-bicta-cream text-center mb-2">Join BICTA</h1>
              <p className="text-bicta-subtle text-sm text-center mb-8">Choose how you want to participate</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {ROLES.map(r => (
                  <button key={r.value} onClick={() => setRole(r.value)}
                    className={`p-5 rounded-lg border text-left transition-all ${
                      role === r.value ? "border-bicta-gold bg-bicta-gold/10" : "border-bicta-border hover:border-bicta-gold/40"
                    }`}
                  >
                    <r.icon size={20} className={role === r.value ? "text-bicta-gold mb-2" : "text-bicta-subtle mb-2"} />
                    <div className={`font-semibold text-sm mb-1 ${role === r.value ? "text-bicta-gold" : "text-bicta-cream"}`}>{r.label}</div>
                    <div className="text-bicta-subtle text-xs">{r.description}</div>
                  </button>
                ))}
              </div>
              <button onClick={() => setStep("details")}
                className="w-full bg-bicta-gold text-bicta-void py-3 text-sm font-semibold uppercase tracking-wider hover:bg-bicta-gold-lt transition-colors rounded"
              >
                Continue as {ROLES.find(r => r.value === role)?.label}
              </button>
              <p className="mt-4 text-center text-sm text-bicta-subtle">Already have an account? <Link href="/login" className="text-bicta-gold hover:underline">Sign in</Link></p>
            </>
          )}

          {/* STEP 2: Registration details */}
          {step === "details" && (
            <form onSubmit={handleRegister}>
              <h2 className="font-display text-xl text-bicta-cream mb-6">Your Details — {ROLES.find(r => r.value === role)?.label}</h2>
              {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-sm">{error}</div>}

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="First Name" name="firstName" required placeholder="Arif" />
                  <Field label="Last Name" name="lastName" required placeholder="Hossain" />
                </div>
                <Field label="Email Address" name="email" type="email" required placeholder="you@university.ac.bd" />
                <Field label="Phone Number" name="phone" type="tel" required placeholder="+880 1XXX-XXXXXX" />
                <Field label="Date of Birth" name="dateOfBirth" type="date" required />

                {role === "participant" && (
                  <>
                    <Field label="University / Institution" name="university" required placeholder="BUET, DU, BRAC University..." />
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Student ID" name="studentId" placeholder="2021-1-60-XXX" />
                      <Field label="Department" name="department" placeholder="CSE, EEE..." />
                    </div>
                    <Field label="Graduation Year" name="graduationYear" placeholder="2025" />
                  </>
                )}

                {role === "judge" && (
                  <>
                    <Field label="Organization" name="organization" required placeholder="Company or University" />
                    <Field label="Title / Position" name="title" required placeholder="Professor, Senior Engineer..." />
                    <Field label="LinkedIn Profile" name="linkedIn" placeholder="https://linkedin.com/in/..." />
                    <div>
                      <label className="block text-bicta-muted text-xs uppercase tracking-wider mb-1.5">Bio (optional)</label>
                      <textarea value={form.bio} onChange={e => u("bio", e.target.value)} rows={3}
                        className="w-full bg-bicta-raised border border-bicta-border text-bicta-cream px-4 py-3 text-sm focus:outline-none focus:border-bicta-gold/60 rounded resize-none"
                        placeholder="Brief professional bio..."
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-bicta-muted text-xs uppercase tracking-wider mb-1.5">Password *</label>
                  <div className="relative">
                    <input type={showPw ? "text" : "password"} required value={form.password} onChange={e => u("password", e.target.value)}
                      className="w-full bg-bicta-raised border border-bicta-border text-bicta-cream px-4 py-3 pr-10 text-sm focus:outline-none focus:border-bicta-gold/60 rounded" placeholder="Min 8 characters"
                    />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-bicta-subtle">
                      {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
                    </button>
                  </div>
                </div>
                <Field label="Confirm Password" name="confirmPassword" type="password" required placeholder="Repeat password" />

                {role === "judge" && (
                  <div className="p-3 bg-bicta-gold/10 border border-bicta-gold/30 rounded text-bicta-gold text-xs flex items-start gap-2">
                    <Shield size={14} className="flex-shrink-0 mt-0.5" />
                    <span>Judge accounts require 2FA verification via email OTP code. You'll receive a code at your email address after registration.</span>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setStep("role")} className="px-6 py-3 border border-bicta-border text-bicta-muted text-sm rounded hover:border-bicta-gold/40 transition-colors">
                  Back
                </button>
                <button type="submit" disabled={loading} className="flex-1 flex items-center justify-center gap-2 bg-bicta-gold text-bicta-void py-3 text-sm font-semibold uppercase tracking-wider hover:bg-bicta-gold-lt disabled:opacity-60 transition-colors rounded">
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
                  {loading ? "Creating account..." : role === "judge" ? "Register & Send OTP" : "Create Account"}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: 2FA for judges */}
          {step === "verify" && (
            <form onSubmit={handleVerify}>
              <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-full bg-bicta-gold/10 border border-bicta-gold/20 flex items-center justify-center mx-auto mb-4">
                  <Mail size={24} className="text-bicta-gold" />
                </div>
                <h2 className="font-display text-xl text-bicta-cream mb-2">Verify Your Email</h2>
                <p className="text-bicta-subtle text-sm">We sent a 6-digit code to <span className="text-bicta-gold">{registeredEmail}</span></p>
              </div>

              {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-sm">{error}</div>}

              <div className="mb-6">
                <label className="block text-bicta-muted text-xs uppercase tracking-wider mb-2">6-Digit Code</label>
                <input
                  type="text" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  required maxLength={6} className="w-full bg-bicta-raised border border-bicta-border text-bicta-cream px-4 py-4 text-2xl text-center tracking-[0.5em] focus:outline-none focus:border-bicta-gold/60 rounded"
                  placeholder="000000"
                />
              </div>

              <button type="submit" disabled={loading || otp.length !== 6}
                className="w-full flex items-center justify-center gap-2 bg-bicta-gold text-bicta-void py-3 text-sm font-semibold uppercase tracking-wider hover:bg-bicta-gold-lt disabled:opacity-60 transition-colors rounded"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Shield size={16} />}
                {loading ? "Verifying..." : "Verify & Activate Account"}
              </button>

              <p className="mt-4 text-center text-xs text-bicta-subtle">
                Didn't receive the code? Check your spam folder or contact <span className="text-bicta-gold">support@bicta.org</span>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
