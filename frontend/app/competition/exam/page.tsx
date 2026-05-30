"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import ExamInterface from "@/components/competition/ExamInterface";

export default function ExamPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login?next=/competition/exam");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bicta-void flex items-center justify-center">
        <div className="text-bicta-subtle text-sm">Verifying identity…</div>
      </div>
    );
  }

  if (!user) return null;

  return <ExamInterface />;
}
