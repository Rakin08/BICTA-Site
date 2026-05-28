"use client";

import {
  LayoutDashboard,
  Users,
  Trophy,
  Gavel,
  Palette,
  Image,
  TrendingUp,
  Activity,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";

const cards = [
  {
    title: "Site Customizer",
    desc: "Change colors, branding, and site-wide settings",
    href: "/admin/cms",
    icon: Palette,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    border: "border-purple-400/20",
  },
  {
    title: "Event Banners",
    desc: "Create and customize event banners for the frontend",
    href: "/admin/events",
    icon: Image,
    color: "text-pink-400",
    bg: "bg-pink-400/10",
    border: "border-pink-400/20",
  },
  {
    title: "Advisers",
    desc: "Manage advisers displayed on the frontend",
    href: "/admin/advisers",
    icon: Users,
    color: "text-bicta-gold",
    bg: "bg-bicta-gold/10",
    border: "border-bicta-gold/20",
  },
  {
    title: "Competitions",
    desc: "Manage competitions, rules, and participants",
    href: "/admin/competitions",
    icon: Trophy,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
  },
  {
    title: "Judge Panel",
    desc: "Score submissions and declare winners",
    href: "/admin/judge",
    icon: Gavel,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20",
  },
];

const stats = [
  { label: "Total Advisers", value: "6", icon: Users, color: "text-bicta-gold" },
  { label: "Active Competitions", value: "1", icon: Trophy, color: "text-emerald-400" },
  { label: "Pending Reviews", value: "2", icon: Gavel, color: "text-blue-400" },
  { label: "Violations Today", value: "0", icon: AlertTriangle, color: "text-red-400" },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl text-bicta-cream mb-1">
          Dashboard
        </h1>
        <p className="font-body text-sm text-bicta-subtle">
          Manage your BICTA platform from one place.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-bicta-surface border border-bicta-border rounded-xl p-5"
          >
            <div className="flex items-center gap-2 mb-3">
              <div
                className={`w-8 h-8 rounded-lg ${stat.color.replace("text-", "bg-").replace("400", "400/10")} border ${stat.color.replace("text-", "border-").replace("400", "400/20")} flex items-center justify-center`}
              >
                <stat.icon size={14} className={stat.color} />
              </div>
            </div>
            <div className="font-mono text-2xl text-bicta-cream mb-0.5">
              {stat.value}
            </div>
            <div className="font-body text-xs text-bicta-subtle uppercase tracking-wider">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group bg-bicta-surface border border-bicta-border rounded-xl p-6 hover:border-bicta-border-hover transition-all"
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-xl ${card.bg} border ${card.border} flex items-center justify-center shrink-0`}
              >
                <card.icon size={22} className={card.color} />
              </div>
              <div>
                <h3 className="font-body font-medium text-bicta-cream mb-1 group-hover:text-bicta-gold-lt transition-colors">
                  {card.title}
                </h3>
                <p className="font-body text-xs text-bicta-subtle">
                  {card.desc}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-bicta-surface border border-bicta-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Activity size={16} className="text-bicta-gold" />
          <h2 className="font-body font-medium text-sm text-bicta-cream">
            Recent Activity
          </h2>
        </div>
        <div className="space-y-3">
          {[
            { action: "New submission", detail: "Rafi Ahmed — AI Olympiad", time: "10 min ago" },
            { action: "Score updated", detail: "Nadia Rahman — Q3 Essay", time: "25 min ago" },
            { action: "Adviser added", detail: "Dr. Farhan Hussain", time: "1 hour ago" },
            { action: "Competition started", detail: "AI Olympiad 2026", time: "3 hours ago" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-2 border-b border-bicta-border/50 last:border-0"
            >
              <div>
                <span className="font-body text-xs text-bicta-cream block">
                  {item.action}
                </span>
                <span className="font-body text-xs text-bicta-subtle">
                  {item.detail}
                </span>
              </div>
              <span className="font-mono text-[0.65rem] text-bicta-subtle">
                {item.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
