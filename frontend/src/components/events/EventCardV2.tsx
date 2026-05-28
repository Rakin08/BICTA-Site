"use client";

import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, ArrowRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatEventDateRange } from "@/lib/utils";
import type { EventBannerConfig } from "@/types/event-banner";

interface EventCardV2Props {
  banner: EventBannerConfig;
  size?: "large" | "medium" | "small";
}

export default function EventCardV2({ banner, size = "medium" }: EventCardV2Props) {
  const dateRange = banner.showDate
    ? formatEventDateRange(banner.startDate, banner.endDate)
    : null;

  const isLarge = size === "large";

  return (
    <Link
      href={`/events/${banner.eventId}`}
      className={cn(
        "group block relative bg-bicta-surface border border-bicta-border rounded-xl overflow-hidden transition-all duration-500",
        "hover:border-bicta-border-hover hover:-translate-y-1 hover:shadow-card-hover"
      )}
    >
      {/* Banner Image */}
      <div
        className={cn(
          "relative overflow-hidden",
          isLarge ? "aspect-[16/9]" : "aspect-[16/10]"
        )}
      >
        {banner.backgroundImage ? (
          <Image
            src={banner.backgroundImage}
            alt={banner.headline}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes={isLarge ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
          />
        ) : (
          <div
            className="w-full h-full"
            style={{
              background: banner.backgroundColor
                ? banner.backgroundColor
                : "linear-gradient(135deg, #1a1a1a, #141414)",
            }}
          />
        )}

        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-bicta-void via-bicta-void/40 to-transparent" />

        {/* Badge */}
        {banner.showBadge && banner.badgeText && (
          <div className="absolute top-3 left-3">
            <span
              className="px-2.5 py-1 rounded-full text-[0.6rem] uppercase tracking-wider font-body font-medium"
              style={{
                background: banner.badgeColor + "20",
                color: banner.badgeColor,
                border: `1px solid ${banner.badgeColor}40`,
                backdropFilter: "blur(8px)",
              }}
            >
              {banner.badgeText}
            </span>
          </div>
        )}

        {/* Date badge on image */}
        {dateRange && (
          <div className="absolute top-3 right-3">
            <div className="bg-bicta-void/80 backdrop-blur-sm border border-bicta-border rounded-lg px-2.5 py-1.5 text-center">
              <Calendar size={12} className="text-bicta-gold mx-auto mb-0.5" />
              <span className="block font-mono text-[0.6rem] text-bicta-cream uppercase">
                {dateRange}
              </span>
            </div>
          </div>
        )}

        {/* Bottom overlay content */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3
            className={cn(
              "font-display font-medium text-bicta-cream group-hover:text-bicta-gold-lt transition-colors duration-300 line-clamp-2",
              isLarge ? "text-xl md:text-2xl" : "text-base md:text-lg"
            )}
          >
            {banner.headline}
          </h3>
          {banner.subheadline && (
            <p className="text-xs text-bicta-muted font-body mt-1 line-clamp-1">
              {banner.subheadline}
            </p>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        {/* Location */}
        {banner.showLocation && banner.location && (
          <div className="flex items-center gap-1.5 mb-2">
            <MapPin size={12} className="text-bicta-gold shrink-0" />
            <span className="text-xs text-bicta-muted font-body line-clamp-1">
              {banner.location}
            </span>
          </div>
        )}

        {/* Description */}
        {banner.description && (
          <p className="text-xs text-bicta-subtle font-body line-clamp-2 mb-3 leading-relaxed">
            {banner.description}
          </p>
        )}

        {/* CTA row */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-xs font-body font-medium uppercase tracking-wider text-bicta-gold group-hover:gap-2.5 transition-all">
            View Event
            <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
          </span>
          <Clock size={12} className="text-bicta-subtle" />
        </div>
      </div>
    </Link>
  );
}
