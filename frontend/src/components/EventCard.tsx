"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import EventStatusBadge from "@/components/ui/EventStatusBadge";
import { formatEventDateRange } from "@/lib/utils";
import type { EventListItem } from "@/types";

interface EventCardProps {
  event: EventListItem;
  priority?: boolean;
}

export default function EventCard({ event, priority = false }: EventCardProps) {
  const dateRange = formatEventDateRange(event.startDate, event.endDate);

  return (
    <Link
      href={`/events/${event.slug}`}
      className="group block bg-bicta-surface border border-bicta-border rounded-xl overflow-hidden transition-all duration-500 hover:border-bicta-border-hover hover:-translate-y-1 hover:shadow-card-hover"
    >
      {/* Top accent line */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-bicta-gold to-transparent opacity-30 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Image */}
      {event.imageUrl ? (
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        </div>
      ) : (
        <div className="aspect-video bg-bicta-raised flex items-center justify-center">
          <span className="font-display text-bicta-subtle/30 text-3xl">
            {event.eventType?.charAt(0).toUpperCase() || "E"}
          </span>
        </div>
      )}

      {/* Body */}
      <div className="p-5 flex flex-col gap-3">
        {/* Row 1: Status + Type */}
        <div className="flex items-center gap-2 flex-wrap">
          {event.status && <EventStatusBadge status={event.status} />}
          {event.eventType && (
            <span className="text-[0.6875rem] uppercase tracking-[0.15em] text-bicta-subtle font-body">
              {event.eventType.replace(/_/g, " ")}
            </span>
          )}
        </div>

        {/* Row 2: Title */}
        <h3 className="font-display font-medium text-bicta-cream text-[1.25rem] leading-tight group-hover:text-bicta-gold-lt transition-colors duration-300">
          {event.title}
        </h3>

        {/* Row 3: Date + Mode */}
        <div className="flex items-center gap-2 text-sm text-bicta-muted font-body">
          {dateRange && <span>{dateRange}</span>}
          {event.mode && (
            <>
              <span className="text-bicta-gold/40">·</span>
              <span className="text-[0.6875rem] uppercase tracking-wider text-bicta-subtle">
                {event.mode}
              </span>
            </>
          )}
        </div>

        {/* Row 4: Venue */}
        {event.venue && (
          <p className="text-sm text-bicta-subtle font-body">{event.venue}</p>
        )}

        {/* Row 5: CTA */}
        <div className="mt-1 flex items-center gap-1.5 text-bicta-gold font-body text-[0.6875rem] uppercase tracking-wider font-medium group/link">
          <span>View Event</span>
          <ArrowRight
            size={12}
            className="transition-transform duration-200 group-hover/link:translate-x-1"
          />
        </div>
      </div>
    </Link>
  );
}
