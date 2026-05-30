"use client";
import { useEffect, useState } from "react";
import PageHero from "@/components/layout/PageHero";

interface Entry { rank: number; name: string; university: string; score: number; competition: string; }

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_BICTA_API_URL || "https://bicta-site-production.up.railway.app";
    fetch(`${apiUrl}/trpc/competition.leaderboard`)
      .then(r => r.ok ? r.json() : null)
      .then(d => d?.result?.data && setEntries(d.result.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const medals = ["🥇","🥈","🥉"];

  return (
    <>
      <PageHero label="Competition" title="National Leaderboard" subtitle="Top performers across all BICTA competitions." />
      <section className="py-16 px-6 max-w-4xl mx-auto">
        {loading ? (
          <div className="text-bicta-subtle text-sm text-center py-20">Loading rankings…</div>
        ) : entries.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-bicta-subtle">No results published yet.</p>
            <p className="text-bicta-subtle text-sm mt-2">Check back after the next competition ends.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {entries.map((e, i) => (
              <div key={i} className={`flex items-center gap-4 px-5 py-4 rounded-xl border ${
                i === 0 ? "border-bicta-gold bg-bicta-gold/5" : "border-bicta-border bg-bicta-surface"
              }`}>
                <span className="text-2xl w-8 text-center">{medals[i] ?? `#${e.rank}`}</span>
                <div className="flex-1">
                  <p className="text-bicta-cream font-medium">{e.name}</p>
                  <p className="text-bicta-subtle text-xs">{e.university} · {e.competition}</p>
                </div>
                <span className="font-mono text-bicta-gold font-semibold">{e.score} pts</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
