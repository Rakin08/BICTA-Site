import { trpc } from "@/providers/trpc";
import { useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { LOGIN_PATH } from "@/const";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
  requireAdmin?: boolean;
};

export function useAuth(options?: UseAuthOptions) {
  const {
    redirectOnUnauthenticated = false,
    redirectPath = LOGIN_PATH,
    requireAdmin = false,
  } = options ?? {};

  const navigate = useNavigate();
  const utils = trpc.useUtils();

  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = trpc.auth.me.useQuery(undefined, {
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: async () => {
      await utils.invalidate();
      navigate(redirectPath);
    },
  });

  const logout = useCallback(() => logoutMutation.mutate(), [logoutMutation]);

  const isAdmin = user?.role === "admin";
  const isStudent = user?.role === "student";
  const isPartner = user?.role === "partner";

  useEffect(() => {
    if (redirectOnUnauthenticated && !isLoading && !user) {
      const currentPath = window.location.pathname;
      if (currentPath !== redirectPath) {
        navigate(redirectPath);
      }
    }
    if (requireAdmin && !isLoading && user && !isAdmin) {
      navigate("/");
    }
  }, [redirectOnUnauthenticated, isLoading, user, navigate, redirectPath, requireAdmin, isAdmin]);

  return useMemo(
    () => ({
      user: user ?? null,
      isAuthenticated: !!user,
      isAdmin,
      isStudent,
      isPartner,
      role: user?.role ?? null,
      isLoading: isLoading || logoutMutation.isPending,
      error,
      logout,
      refresh: refetch,
    }),
    [user, isAdmin, isStudent, isPartner, isLoading, logoutMutation.isPending, error, logout, refetch],
  );
}
