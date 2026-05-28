"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

interface AuthUser {
  id: number;
  name: string | null;
  email: string | null;
  avatar: string | null;
  role: "admin" | "student" | "partner";
}

interface UseAuthOptions {
  redirectOnUnauthenticated?: boolean;
  requireAdmin?: boolean;
}

export function useAuth(options?: UseAuthOptions) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_BICTA_API_URL || "";
      const res = await fetch(`${apiUrl}/trpc/auth.me`, {
        credentials: "include",
      });
      if (res.ok) {
        const json = await res.json();
        setUser(json.result?.data ?? null);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const logout = useCallback(async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_BICTA_API_URL || "";
      await fetch(`${apiUrl}/trpc/auth.logout`, {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setUser(null);
      window.location.href = "/";
    }
  }, []);

  useEffect(() => {
    if (isLoading) return;

    if (options?.redirectOnUnauthenticated && !user) {
      const loginUrl = `/login?redirect=${encodeURIComponent(pathname)}`;
      router.push(loginUrl);
    }

    if (options?.requireAdmin && user && user.role !== "admin") {
      router.push("/");
    }
  }, [
    isLoading,
    user,
    options?.redirectOnUnauthenticated,
    options?.requireAdmin,
    router,
    pathname,
  ]);

  return {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isStudent: user?.role === "student",
    isPartner: user?.role === "partner",
    isLoading,
    logout,
    refresh: checkAuth,
  };
}
