"use client";
import { useState, useEffect, useCallback } from "react";

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  role: "admin" | "participant" | "judge" | "partner";
}

export function useAuth() {
  const [user, setUser]       = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then(r => r.ok ? r.json() : { user: null })
      .then(d => setUser(d.user ?? null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setUser(null);
    window.location.href = "/login";
  }, []);

  return { user, loading, logout, isAdmin: user?.role === "admin" };
}
