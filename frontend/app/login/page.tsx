"use client";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { LogIn, Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";

function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirect = searchParams.get("redirect") || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const apiUrl = process.env.NEXT_PUBLIC_BICTA_API_URL || "";
      const res = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      router.push(redirect);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bicta-void flex items-center justify-center px-4">
      <div className="bg-bicta-surface border border-bicta-border rounded-xl p-8 md:p-12 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-bicta-gold/10 border border-bicta-gold/20 flex items-center justify-center mx-auto mb-4">
            <LogIn size={24} className="text-bicta-gold" />
          </div>
          <h1 className="font-display text-2xl text-bicta-cream mb-1">Welcome Back</h1>
          <p className="text-bicta-subtle text-sm">Sign in to your BICTA account</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-sm">{error}</div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-bicta-muted text-xs uppercase tracking-wider mb-1.5">Email</label>
            <input
              type="email" required value={email} onChange={e => setEmail(e.target.value)}
              className="w-full bg-bicta-raised border border-bicta-border text-bicta-cream px-4 py-3 text-sm focus:outline-none focus:border-bicta-gold/60 rounded transition-colors"
              placeholder="you@university.ac.bd"
            />
          </div>
          <div>
            <label className="block text-bicta-muted text-xs uppercase tracking-wider mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"} required value={password} onChange={e => setPassword(e.target.value)}
                className="w-full bg-bicta-raised border border-bicta-border text-bicta-cream px-4 py-3 pr-10 text-sm focus:outline-none focus:border-bicta-gold/60 rounded transition-colors"
                placeholder="••••••••"
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-bicta-subtle hover:text-bicta-muted">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-bicta-gold text-bicta-void py-3 text-sm font-semibold uppercase tracking-wider hover:bg-bicta-gold-lt disabled:opacity-60 transition-colors rounded mt-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-bicta-subtle">
          Don't have an account?{" "}
          <Link href="/register" className="text-bicta-gold hover:underline">Register here</Link>
        </div>
        <div className="mt-2 text-center">
          <Link href="/forgot-password" className="text-xs text-bicta-subtle hover:text-bicta-muted">Forgot password?</Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return <Suspense fallback={<div className="min-h-screen bg-bicta-void" />}><LoginForm /></Suspense>;
}
