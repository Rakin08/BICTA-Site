"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Trophy,
  Users,
  Clock,
  Shield,
  Eye,
  Play,
  Settings,
  Plus,
  ChevronRight,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Competition {
  id: string;
  title: string;
  status: "draft" | "upcoming" | "live" | "completed";
  participants: number;
  startDate: string;
  endDate: string;
  duration: number;
  violations: number;
  submissions: number;
}

const demoCompetitions: Competition[] = [
  {
    id: "comp-1",
    title: "AI Olympiad 2026",
    status: "live",
    participants: 247,
    startDate: "2026-05-27T09:00:00Z",
    endDate: "2026-05-27T18:00:00Z",
    duration: 180,
    violations: 12,
    submissions: 203,
  },
  {
    id: "comp-2",
    title: "Datathon Series — Spring",
    status: "upcoming",
    participants: 0,
    startDate: "2026-06-15T10:00:00Z",
    endDate: "2026-06-15T16:00:00Z",
    duration: 360,
    violations: 0,
    submissions: 0,
  },
  {
    id: "comp-3",
    title: "AI for SDG Hackathon",
    status: "completed",
    participants: 156,
    startDate: "2026-04-10T09:00:00Z",
    endDate: "2026-04-10T18:00:00Z",
    duration: 540,
    violations: 8,
    submissions: 142,
  },
];

const statusConfig: Record<string, { label: string; className: string }> = {
  draft: { label: "Draft", className: "bg-bicta-subtle/10 text-bicta-subtle" },
  upcoming: { label: "Upcoming", className: "bg-bicta-gold/10 text-bicta-gold" },
  live: { label: "Live Now", className: "bg-emerald-500/10 text-emerald-400" },
  completed: { label: "Completed", className: "bg-blue-400/10 text-blue-400" },
};

export default function AdminCompetitionsPage() {
  const router = useRouter();
  const [competitions] = useState<Competition[]>(demoCompetitions);
  const [filter, setFilter] = useState<string>("all");

  const filtered =
    filter === "all"
      ? competitions
      : competitions.filter((c) => c.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-bicta-cream mb-1">
            Competitions
          </h1>
          <p className="font-body text-sm text-bicta-subtle">
            Manage competitions, monitor participants, and review violations.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-bicta-gold text-bicta-void font-body font-medium text-xs uppercase tracking-wider rounded-lg hover:shadow-cta-glow transition-all">
          <Plus size={14} /> New Competition
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Competitions", value: competitions.length, icon: Trophy, color: "text-bicta-gold" },
          { label: "Live Now", value: competitions.filter((c) => c.status === "live").length, icon: Play, color: "text-emerald-400" },
          { label: "Total Participants", value: competitions.reduce((s, c) => s + c.participants, 0), icon: Users, color: "text-blue-400" },
          { label: "Total Violations", value: competitions.reduce((s, c) => s + c.violations, 0), icon: Shield, color: "text-red-400" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-bicta-surface border border-bicta-border rounded-xl p-5"
          >
            <stat.icon size={16} className={stat.color} />
            <div className="font-mono text-2xl text-bicta-cream mt-2 mb-0.5">
              {stat.value}
            </div>
            <div className="font-body text-xs text-bicta-subtle uppercase tracking-wider">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {["all", "draft", "upcoming", "live", "completed"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-3 py-1.5 text-xs font-body font-medium uppercase tracking-wider rounded-md transition-all border",
              filter === f
                ? "bg-bicta-gold/10 border-bicta-gold/25 text-bicta-gold"
                : "bg-bicta-raised border-bicta-border text-bicta-subtle hover:text-bicta-muted"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Competition List */}
      <div className="space-y-3">
        {filtered.map((comp) => {
          const status = statusConfig[comp.status];
          return (
            <div
              key={comp.id}
              className="bg-bicta-surface border border-bicta-border rounded-xl p-6 hover:border-bicta-border-hover transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-bicta-gold/10 border border-bicta-gold/20 flex items-center justify-center shrink-0">
                    <Trophy size={22} className="text-bicta-gold" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-body font-medium text-bicta-cream">
                        {comp.title}
                      </h3>
                      <span
                        className={cn(
                          "text-[0.6rem] uppercase tracking-wider font-body px-2 py-0.5 rounded-full",
                          status.className
                        )}
                      >
                        {status.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-body text-bicta-subtle">
                      <span className="flex items-center gap-1">
                        <Users size={12} /> {comp.participants} participants
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {comp.duration} min
                      </span>
                      <span className="flex items-center gap-1">
                        <Shield size={12} /> {comp.violations} violations
                      </span>
                      <span className="flex items-center gap-1">
                        <BarChart3 size={12} /> {comp.submissions} submissions
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => router.push(`/admin/judge`)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-bicta-raised border border-bicta-border text-bicta-muted font-body text-xs rounded-lg hover:border-bicta-gold/30 hover:text-bicta-cream transition-all"
                  >
                    <Eye size={12} /> Judge
                  </button>
                  <button className="p-2 text-bicta-subtle hover:text-bicta-cream transition-colors rounded-lg hover:bg-bicta-raised">
                    <Settings size={14} />
                  </button>
                  <button className="p-2 text-bicta-subtle hover:text-bicta-cream transition-colors rounded-lg hover:bg-bicta-raised">
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
