"use client";
import { useEffect, useState } from "react";
import PageHero from "@/components/layout/PageHero";

interface Alumni { id: number; name: string; university: string; cohort: string; currentRole: string; featured: boolean; }

export default function AlumniPage() {
  const [alumni, setAlumni]   = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_BICTA_API_URL || "https://bicta-site-production.up.railway.app";
    fetch(`${apiUrl}/trpc/alumni.list`)
      .then(r => r.ok ? r.json() : null)
      .then(d => d?.result?.data && setAlumni(d.result.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHero label="Community" title="BICTA Alumni" subtitle="Where are our graduates now? A growing network of Bangladesh's top tech talent." />
      <section className="py-16 px-6 max-w-6xl mx-auto">
        {loading ? (
          <div className="text-bicta-subtle text-sm text-center py-20">Loading…</div>
        ) : alumni.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-bicta-subtle">Alumni profiles coming soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {alumni.map(a => (
              <div key={a.id} className="bg-bicta-surface border border-bicta-border rounded-xl p-5">
                <div className="w-10 h-10 rounded-full bg-bicta-gold/20 flex items-center justify-center text-bicta-gold font-semibold text-sm mb-3">
                  {a.name.split(" ").map(n => n[0]).join("").slice(0,2)}
                </div>
                <p className="text-bicta-cream font-medium">{a.name}</p>
                <p className="text-bicta-subtle text-xs mt-0.5">{a.currentRole}</p>
                <div className="flex gap-2 mt-3">
                  <span className="text-xs bg-bicta-raised text-bicta-subtle px-2 py-0.5 rounded-full">{a.university}</span>
                  <span className="text-xs bg-bicta-raised text-bicta-subtle px-2 py-0.5 rounded-full">Cohort {a.cohort}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
