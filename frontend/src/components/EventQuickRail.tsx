"use client";

import { useState } from "react";
import { Calendar, MapPin, Monitor, Share2, Link as LinkIcon, CheckCircle } from "lucide-react";
import GoldButton from "@/components/ui/GoldButton";
import EventStatusBadge from "@/components/ui/EventStatusBadge";
import { formatEventDateRange } from "@/lib/utils";
import type { EventDetail } from "@/types";

interface EventQuickRailProps {
  event: EventDetail;
}

export default function EventQuickRail({ event }: EventQuickRailProps) {
  const [copied, setCopied] = useState(false);
  const dateRange = formatEventDateRange(event.startDate, event.endDate);

  const handleCopyLink = () => {
    const url = `${typeof window !== "undefined" ? window.location.origin : ""}/events/${event.slug}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const shareOnTwitter = () => {
    const url = `${typeof window !== "undefined" ? window.location.origin : ""}/events/${event.slug}`;
    const text = `Check out ${event.title} by BICTA!`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      "_blank"
    );
  };

  const shareOnLinkedIn = () => {
    const url = `${typeof window !== "undefined" ? window.location.origin : ""}/events/${event.slug}`;
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      "_blank"
    );
  };

  return (
    <div className="space-y-4">
      {/* Registration CTA */}
      {event.status === "registration_open" && event.registrationUrl && (
        <div className="bg-bicta-surface border border-bicta-border rounded-xl p-6">
          <GoldButton
            href={event.registrationUrl}
            external
            variant="solid"
            size="lg"
            className="w-full"
          >
            Register Now
          </GoldButton>
          <p className="mt-3 text-center text-xs text-bicta-subtle font-body">
            Registration is currently open
          </p>
        </div>
      )}

      {/* Key Details Card */}
      <div className="bg-bicta-surface border border-bicta-border rounded-xl p-6">
        <h3 className="font-body font-medium text-sm uppercase tracking-wider text-bicta-gold mb-4">
          Event Details
        </h3>

        <div className="space-y-4">
          {/* Status */}
          <div>
            <span className="text-[0.6875rem] uppercase tracking-wider text-bicta-subtle font-body block mb-1">
              Status
            </span>
            <EventStatusBadge status={event.status || "draft"} />
          </div>

          {/* Date */}
          {dateRange && (
            <div className="flex items-start gap-3">
              <Calendar size={16} className="text-bicta-gold mt-0.5 shrink-0" />
              <div>
                <span className="text-[0.6875rem] uppercase tracking-wider text-bicta-subtle font-body block mb-0.5">
                  Date
                </span>
                <span className="text-sm text-bicta-cream font-body">
                  {dateRange}
                </span>
              </div>
            </div>
          )}

          {/* Mode */}
          {event.mode && (
            <div className="flex items-start gap-3">
              <Monitor size={16} className="text-bicta-gold mt-0.5 shrink-0" />
              <div>
                <span className="text-[0.6875rem] uppercase tracking-wider text-bicta-subtle font-body block mb-0.5">
                  Mode
                </span>
                <span className="text-sm text-bicta-cream font-body capitalize">
                  {event.mode}
                </span>
              </div>
            </div>
          )}

          {/* Venue */}
          {event.venue && (
            <div className="flex items-start gap-3">
              <MapPin size={16} className="text-bicta-gold mt-0.5 shrink-0" />
              <div>
                <span className="text-[0.6875rem] uppercase tracking-wider text-bicta-subtle font-body block mb-0.5">
                  Venue
                </span>
                <span className="text-sm text-bicta-cream font-body">
                  {event.venue}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Share */}
      <div className="bg-bicta-surface border border-bicta-border rounded-xl p-6">
        <h3 className="font-body font-medium text-sm uppercase tracking-wider text-bicta-gold mb-4">
          Share
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={shareOnTwitter}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-bicta-raised border border-bicta-border rounded-md text-bicta-muted hover:text-bicta-cream hover:border-bicta-gold/30 transition-all"
          >
            <Share2 size={14} />
            <span className="text-xs font-body">X</span>
          </button>
          <button
            onClick={shareOnLinkedIn}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-bicta-raised border border-bicta-border rounded-md text-bicta-muted hover:text-bicta-cream hover:border-bicta-gold/30 transition-all"
          >
            <Share2 size={14} />
            <span className="text-xs font-body">LinkedIn</span>
          </button>
          <button
            onClick={handleCopyLink}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-bicta-raised border border-bicta-border rounded-md text-bicta-muted hover:text-bicta-cream hover:border-bicta-gold/30 transition-all"
          >
            {copied ? (
              <CheckCircle size={14} className="text-emerald-400" />
            ) : (
              <LinkIcon size={14} />
            )}
            <span className="text-xs font-body">
              {copied ? "Copied" : "Copy"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
