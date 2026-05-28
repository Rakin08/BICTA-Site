"use client";

import { cn } from "@/lib/utils";
import type { EventStatus } from "@/types";

const statusConfig: Record<
  EventStatus,
  { label: string; className: string; pulse?: boolean }
> = {
  registration_open: {
    label: "Registration Open",
    className: "bg-emerald-500/12 text-emerald-400 border border-emerald-400/20",
  },
  scheduled: {
    label: "Upcoming",
    className: "bg-bicta-gold/12 text-bicta-gold border border-bicta-gold/20",
  },
  live: {
    label: "Live Now",
    className: "bg-red-500/12 text-red-400 border border-red-400/20",
    pulse: true,
  },
  registration_closed: {
    label: "Applications Closed",
    className: "bg-bicta-subtle/12 text-bicta-subtle border border-bicta-subtle/20",
  },
  completed: {
    label: "Completed",
    className: "bg-bicta-subtle/12 text-bicta-subtle border border-bicta-subtle/20",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-500/12 text-red-400 border border-red-400/20",
  },
  postponed: {
    label: "Postponed",
    className: "bg-red-500/12 text-red-400 border border-red-400/20",
  },
  draft: {
    label: "Coming Soon",
    className: "bg-bicta-gold/6 text-bicta-subtle border border-bicta-gold/10",
  },
};

interface EventStatusBadgeProps {
  status: EventStatus;
  className?: string;
}

export default function EventStatusBadge({
  status,
  className,
}: EventStatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.draft;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-body font-medium",
        "text-[0.6875rem] uppercase tracking-[0.15em] px-3 py-1 rounded-full",
        config.className,
        className
      )}
    >
      {config.pulse && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-400" />
        </span>
      )}
      {config.label}
    </span>
  );
}
