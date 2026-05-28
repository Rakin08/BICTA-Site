"use client";

import { useState } from "react";
import { Trophy, Medal, Award, Crown, ArrowLeft, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  totalPoints: number;
  percentage: number;
  time: string;
  violations: number;
  status: string;
}

const demoLeaderboard: LeaderboardEntry[] = [
  { rank: 1, name: "Rafi Ahmed", score: 28, totalPoints: 30, percentage: 93, time: "42:15", violations: 0, status: "Winner" },
  { rank: 2, name: "Nadia Rahman", score: 26, totalPoints: 30, percentage: 87, time: "38:42", violations: 1, status: "Runner-up" },
  { rank: 3, name: "Tasnim K", score: 24, totalPoints: 30, percentage: 80, time: "51:03", violations: 0, status: "Third Place" },
  { rank: 4, name: "Ahnaf S", score: 22, totalPoints: 30, percentage: 73, time: "45:28", violations: 2, status: "Completed" },
  { rank: 5, name: "Maliha R", score: 21, totalPoints: 30, percentage: 70, time: "39:55", violations: 0, status: "Completed" },
  { rank: 6, name: "Kamal H", score: 18, totalPoints: 30, percentage: 60, time: "55:12", violations: 1, status: "Completed" },
  { rank: 7, name: "Sumaiya I", score: 16, totalPoints: 30, percentage: 53, time: "48:37", violations: 0, status: "Completed" },
  { rank: 8, name: "Farhan M", score: 14, totalPoints: 30, percentage: 47, time: "52:44", violations: 3, status: "Completed" },
  { rank: 9, name: "Zara K", score: 12, totalPoints: 30, percentage: 40, time: "44:19", violations: 1, status: "Completed" },
  { rank: 10, name: "Imran S", score: 10, totalPoints: 30, percentage: 33, time: "58:01", violations: 2, status: "Completed" },
];

function getRankIcon(rank: number) {
  if (rank === 1) return <Crown size={18} className="text-bicta-gold" />;
  if (rank === 2) return <Medal size={18} className="text-gray-300" />;
  if (rank === 3) return <Award size={18} className="text-amber-600" />;
  return <span className="font-mono text-xs text-bicta-subtle w-[18px] text-center">{rank}</span>;
}

export default function CompetitionResultsPage() {
  const [filter, setFilter] = useState<"all" | "top3" | "completed">("all");

  const filtered =
    filter === "top3"
      ? demoLeaderboard.slice(0, 3)
      : filter === "completed"
        ? demoLeaderboard.filter((e) => e.status === "Completed")
        : demoLeaderboard;

  return (
    <div className="min-h-screen bg-bicta-void">
      {/* Header */}
      <div className="bg-bicta-surface border-b border-bicta-border">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6" style={{ maxWidth: 960 }}>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-body text-bicta-subtle hover:text-bicta-gold transition-colors mb-4"
          >
            <ArrowLeft size={14} /> Back to Home
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-bicta-gold/10 border border-bicta-gold/20 flex items-center justify-center">
              <Trophy size={24} className="text-bicta-gold" />
            </div>
            <div>
              <h1 className="font-display text-2xl text-bicta-cream">
                AI Olympiad 2026
              </h1>
              <p className="font-body text-xs text-bicta-subtle uppercase tracking-wider">
                Leaderboard · Final Results
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{ maxWidth: 960 }}>
        {/* Top 3 Podium */}
        <div className="flex items-end justify-center gap-4 md:gap-8 mb-12">
          {[
            { entry: demoLeaderboard[1], height: "h-32", order: "order-1" },
            { entry: demoLeaderboard[0], height: "h-44", order: "order-2" },
            { entry: demoLeaderboard[2], height: "h-28", order: "order-3" },
          ].map(({ entry, height, order }) => (
            <div
              key={entry.rank}
              className={cn("flex flex-col items-center", order)}
            >
              <div
                className={cn(
                  "w-16 h-16 rounded-full border-2 flex items-center justify-center mb-3",
                  entry.rank === 1
                    ? "border-bicta-gold bg-bicta-gold/10"
                    : entry.rank === 2
                      ? "border-gray-400 bg-gray-400/10"
                      : "border-amber-600 bg-amber-600/10"
                )}
              >
                {getRankIcon(entry.rank)}
              </div>
              <span className="font-body text-sm font-medium text-bicta-cream mb-0.5">
                {entry.name}
              </span>
              <span className="font-mono text-xs text-bicta-gold mb-2">
                {entry.percentage}%
              </span>
              <div
                className={cn(
                  "w-24 md:w-32 rounded-t-lg",
                  height,
                  entry.rank === 1
                    ? "bg-bicta-gold/15 border border-bicta-gold/25"
                    : entry.rank === 2
                      ? "bg-gray-400/10 border border-gray-400/20"
                      : "bg-amber-600/10 border border-amber-600/20"
                )}
              />
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {(["all", "top3", "completed"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-3 py-1.5 text-xs font-body font-medium uppercase tracking-wider rounded-md transition-all border",
                filter === f
                  ? "bg-bicta-gold/10 border-bicta-gold/25 text-bicta-gold"
                  : "bg-bicta-surface border-bicta-border text-bicta-subtle hover:text-bicta-muted"
              )}
            >
              {f === "all" ? "All" : f === "top3" ? "Top 3" : "Completed"}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-bicta-surface border border-bicta-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-bicta-border">
                {["Rank", "Name", "Score", "Accuracy", "Time", "Violations"].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left text-[0.6rem] uppercase tracking-wider text-bicta-subtle font-medium px-4 py-3"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry) => (
                <tr
                  key={entry.rank}
                  className={cn(
                    "border-b border-bicta-border/50 last:border-0",
                    entry.rank <= 3 && "bg-bicta-gold/[0.02]"
                  )}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center w-6">
                      {getRankIcon(entry.rank)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-body text-sm text-bicta-cream font-medium">
                      {entry.name}
                    </span>
                    {entry.rank <= 3 && (
                      <span className="ml-2 text-[0.6rem] uppercase tracking-wider text-bicta-gold">
                        {entry.status}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-sm text-bicta-cream">
                      {entry.score}/{entry.totalPoints}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-bicta-raised rounded-full overflow-hidden">
                        <div
                          className="h-full bg-bicta-gold rounded-full"
                          style={{ width: `${entry.percentage}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs text-bicta-subtle">
                        {entry.percentage}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 font-mono text-xs text-bicta-subtle">
                      <Clock size={12} /> {entry.time}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "font-mono text-xs",
                        entry.violations === 0
                          ? "text-emerald-400"
                          : entry.violations < 3
                            ? "text-bicta-gold"
                            : "text-red-400"
                      )}
                    >
                      {entry.violations}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
