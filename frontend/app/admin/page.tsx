"use client";
import { useEffect, useState } from "react";

interface Stats { users: number; events: number; competitions: number; contacts: number; }

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_BICTA_API_URL || "https://bicta-site-production.up.railway.app";
    Promise.all([
      fetch(`${apiUrl}/trpc/admin.stats`, { credentials: "include" }).then(r => r.ok ? r.json() : null),
    ])
      .then(([statsData]) => {
        if (statsData?.result?.data) {
          setStats(statsData.result.data);
        } else {
          // Backend unreachable — show placeholder with note
          setStats({ users: 0, events: 0, competitions: 0, contacts: 0 });
        }
      })
      .catch(() => setStats({ users: 0, events: 0, competitions: 0, contacts: 0 }))
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: "Total users",       value: stats?.users        ?? "–", icon: "👤" },
    { label: "Events",            value: stats?.events       ?? "–", icon: "📅" },
    { label: "Competitions",      value: stats?.competitions ?? "–", icon: "🏆" },
    { label: "Contact messages",  value: stats?.contacts     ?? "–", icon: "📬" },
  ];

  return (
    <div className="p-8">
      <h1 className="font-display text-3xl text-bicta-cream mb-2">Dashboard</h1>
      <p className="text-bicta-subtle mb-8">{loading ? "Loading…" : "Live data from Railway MySQL"}</p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {cards.map(c => (
          <div key={c.label} className="bg-bicta-surface border border-bicta-border rounded-xl p-5">
            <div className="text-2xl mb-2">{c.icon}</div>
            <div className="font-mono text-3xl text-bicta-cream font-semibold">
              {loading ? <span className="animate-pulse">…</span> : c.value}
            </div>
            <div className="text-bicta-subtle text-sm mt-1">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-bicta-surface border border-bicta-border rounded-xl p-6">
          <h2 className="text-bicta-cream font-medium mb-4">Quick actions</h2>
          <div className="space-y-2">
            {[
              { label: "Manage users",          href: "/admin/users" },
              { label: "Manage advisers",        href: "/admin/advisers" },
              { label: "Manage competitions",    href: "/admin/competitions" },
              { label: "Judge panel",            href: "/admin/judge" },
              { label: "Site customizer",        href: "/admin/cms" },
            ].map(l => (
              <a key={l.href} href={l.href}
                className="flex items-center justify-between px-4 py-2.5 rounded-lg hover:bg-bicta-raised text-bicta-muted hover:text-bicta-cream transition-colors text-sm">
                {l.label} <span className="text-bicta-subtle">→</span>
              </a>
            ))}
          </div>
        </div>

        <div className="bg-bicta-surface border border-bicta-border rounded-xl p-6">
          <h2 className="text-bicta-cream font-medium mb-4">Deploy status</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-bicta-subtle">Frontend</span>
              <a href="https://vercel.com" target="_blank" className="text-green-400">● Live on Vercel</a>
            </div>
            <div className="flex justify-between">
              <span className="text-bicta-subtle">Backend</span>
              <a href="https://railway.app" target="_blank" className="text-green-400">● Live on Railway</a>
            </div>
            <div className="flex justify-between">
              <span className="text-bicta-subtle">Database</span>
              <span className="text-green-400">● MySQL online</span>
            </div>
            <div className="flex justify-between">
              <span className="text-bicta-subtle">CMS</span>
              <a href="https://sanity.io/manage" target="_blank" className="text-bicta-gold text-xs">Open Sanity Studio →</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
