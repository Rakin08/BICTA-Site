"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { LogIn } from "lucide-react";

function LoginForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const handleLogin = () => {
    const apiUrl = process.env.NEXT_PUBLIC_BICTA_API_URL || "";
    const loginUrl = `${apiUrl}/auth/login?redirect=${encodeURIComponent(redirect)}`;
    window.location.href = loginUrl;
  };

  return (
    <div className="min-h-screen bg-bicta-void flex items-center justify-center px-4">
      <div className="bg-bicta-surface border border-bicta-border rounded-xl p-8 md:p-12 text-center max-w-md w-full">
        <div className="w-16 h-16 rounded-full bg-bicta-gold/10 border border-bicta-gold/20 flex items-center justify-center mx-auto mb-6">
          <LogIn size={28} className="text-bicta-gold" />
        </div>
        <h1 className="font-display text-2xl text-bicta-cream mb-2">
          Welcome Back
        </h1>
        <p className="font-body text-sm text-bicta-muted mb-8">
          Sign in to your BICTA account to access your dashboard and
          registrations.
        </p>
        <button
          onClick={handleLogin}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-bicta-gold text-bicta-void font-body font-medium text-sm uppercase tracking-[0.08em] hover:scale-[1.01] hover:shadow-cta-glow transition-all"
        >
          <LogIn size={16} />
          Sign In with Kimi
        </button>
        <p className="mt-6 text-xs text-bicta-subtle font-body">
          By signing in, you agree to our terms of service and privacy policy.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-bicta-void flex items-center justify-center">
        <div className="text-bicta-muted">Loading...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
