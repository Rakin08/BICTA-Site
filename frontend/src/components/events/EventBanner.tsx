"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, MapPin, Clock, Users, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatEventDateRange } from "@/lib/utils";
import type { EventBannerConfig } from "@/types/event-banner";

interface EventBannerProps {
  config: EventBannerConfig;
  variant?: "hero" | "compact" | "card";
}

const iconMap: Record<string, React.ElementType> = {
  Users,
  Clock,
  Calendar,
  Trophy,
  MapPin,
};

function getOverlayStyle(overlayType: string, opacity: number): string {
  const o = opacity / 100;
  switch (overlayType) {
    case "gradient-dark":
      return `linear-gradient(to right, rgba(10,10,10,${Math.min(o + 0.2, 0.95)}) 0%, rgba(10,10,10,${Math.min(o, 0.7)}) 50%, rgba(10,10,10,${o * 0.3}) 100%)`;
    case "gradient-gold":
      return `linear-gradient(135deg, rgba(201,168,76,${o * 0.3}) 0%, rgba(10,10,10,${o + 0.2}) 50%, rgba(201,168,76,${o * 0.15}) 100%)`;
    case "solid-dark":
      return `rgba(10,10,10,${o})`;
    case "blur":
      return `rgba(10,10,10,${o * 0.5})`;
    default:
      return "transparent";
  }
}

export default function EventBanner({ config, variant = "hero" }: EventBannerProps) {
  const dateRange = config.showDate
    ? formatEventDateRange(config.startDate, config.endDate)
    : null;

  // COMPACT variant — for inline card usage
  if (variant === "compact") {
    return (
      <div className="relative w-full h-48 md:h-64 rounded-xl overflow-hidden group cursor-pointer">
        {config.backgroundImage ? (
          <Image
            src={config.backgroundImage}
            alt={config.headline}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="100vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-bicta-raised to-bicta-surface" />
        )}
        <div
          className="absolute inset-0"
          style={{ background: getOverlayStyle(config.overlayType, config.overlayOpacity) }}
        />
        <div className="absolute inset-0 flex flex-col justify-end p-5">
          {config.showBadge && config.badgeText && (
            <span
              className="self-start px-2.5 py-1 rounded-full text-[0.6rem] uppercase tracking-wider font-body font-medium mb-2"
              style={{ background: config.badgeColor + "20", color: config.badgeColor, border: `1px solid ${config.badgeColor}40` }}
            >
              {config.badgeText}
            </span>
          )}
          <h3 className="font-display text-lg md:text-xl text-bicta-cream group-hover:text-bicta-gold-lt transition-colors line-clamp-2">
            {config.headline}
          </h3>
          {dateRange && (
            <span className="flex items-center gap-1.5 text-xs text-bicta-muted font-body mt-1">
              <Calendar size={12} className="text-bicta-gold" /> {dateRange}
            </span>
          )}
        </div>
      </div>
    );
  }

  // CARD variant — small teaser
  if (variant === "card") {
    return (
      <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden group cursor-pointer">
        {config.backgroundImage ? (
          <Image
            src={config.backgroundImage}
            alt={config.headline}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="w-full h-full bg-bicta-raised" />
        )}
        <div
          className="absolute inset-0"
          style={{ background: getOverlayStyle("gradient-dark", 60) }}
        />
        <div className="absolute inset-0 flex flex-col justify-end p-4">
          <h3 className="font-display text-sm text-bicta-cream group-hover:text-bicta-gold-lt transition-colors line-clamp-1">
            {config.headline}
          </h3>
        </div>
      </div>
    );
  }

  // HERO variant — full layout inspired by P@SHA + CEPIS + BIIN
  return (
    <section
      className={cn(
        "relative w-full overflow-hidden",
        config.layoutType === "floating-stats" ? "pb-24 md:pb-28" : "pb-0"
      )}
      style={{ minHeight: config.layoutType === "split" ? "70vh" : "85vh" }}
    >
      {/* Background */}
      {config.backgroundImage ? (
        <Image
          src={config.backgroundImage}
          alt={config.headline}
          fill
          className="object-cover"
          priority
          sizes="100vw"
          quality={90}
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background: config.backgroundColor
              ? config.backgroundColor
              : "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #141414 100%)",
          }}
        />
      )}

      {/* Overlay */}
      {config.overlayType !== "none" && (
        <div
          className={cn(
            "absolute inset-0",
            config.overlayType === "blur" && "backdrop-blur-sm"
          )}
          style={{
            background: getOverlayStyle(config.overlayType, config.overlayOpacity),
          }}
        />
      )}

      {/* Gold accent line at top */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-bicta-gold to-transparent" />

      {/* Content */}
      <div
        className={cn(
          "relative z-10 h-full flex",
          config.layoutType === "split"
            ? "items-center"
            : "items-center justify-center",
          config.layoutType === "floating-stats" && "items-center pb-0"
        )}
        style={{ minHeight: config.layoutType === "split" ? "70vh" : "85vh" }}
      >
        <div
          className={cn(
            "w-full px-4 sm:px-6 lg:px-8 py-16 md:py-24",
            config.layoutType === "split"
              ? "mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
              : config.textAlign === "center"
                ? "mx-auto text-center"
                : "mx-auto",
            (config.textAlign === "center" || config.layoutType === "split") && "max-w-6xl"
          )}
        >
          {/* Left: Text Content */}
          <div
            className={cn(
              config.layoutType === "split" ? "" : config.textAlign === "center" ? "mx-auto" : "",
              config.textAlign === "center" && "max-w-3xl mx-auto"
            )}
          >
            {/* Badge */}
            {config.showBadge && config.badgeText && (
              <span
                className={cn(
                  "inline-block mb-4 px-3 py-1.5 rounded-full text-[0.6875rem] uppercase tracking-[0.15em] font-body font-medium",
                  config.textAlign === "center" && "mx-auto"
                )}
                style={{
                  background: config.badgeColor + "18",
                  color: config.badgeColor,
                  border: `1px solid ${config.badgeColor}30`,
                }}
              >
                {config.badgeText}
              </span>
            )}

            {/* Date row */}
            {dateRange && (
              <div
                className={cn(
                  "flex items-center gap-2 mb-4",
                  config.textAlign === "center" && "justify-center"
                )}
              >
                <Calendar
                  size={14}
                  style={{ color: config.accentColor || "#c9a84c" }}
                />
                <span
                  className="font-body text-sm font-medium uppercase tracking-wider"
                  style={{ color: config.accentColor || "#c9a84c" }}
                >
                  {dateRange}
                </span>
                {config.showLocation && config.location && (
                  <>
                    <span className="text-bicta-subtle">·</span>
                    <MapPin size={14} className="text-bicta-subtle" />
                    <span className="font-body text-sm text-bicta-muted">
                      {config.location}
                    </span>
                  </>
                )}
              </div>
            )}

            {/* Headline */}
            <h1
              className="font-display font-medium leading-[0.95] mb-4"
              style={{
                fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
                letterSpacing: "-0.02em",
                color: config.textColor || "#faf8f3",
              }}
            >
              {config.headline}
            </h1>

            {/* Subheadline */}
            {config.subheadline && (
              <h2
                className="font-display text-xl md:text-2xl mb-5"
                style={{
                  color: config.accentColor || "#c9a84c",
                  letterSpacing: "-0.01em",
                }}
              >
                {config.subheadline}
              </h2>
            )}

            {/* Description */}
            {config.description && (
              <p
                className="font-body font-light leading-relaxed mb-8 max-w-2xl"
                style={{
                  fontSize: "1.05rem",
                  color: "#8a8680",
                }}
              >
                {config.description}
              </p>
            )}

            {/* CTAs */}
            <div
              className={cn(
                "flex flex-col sm:flex-row gap-3",
                config.textAlign === "center" && "justify-center"
              )}
            >
              {config.primaryCtaLabel && (
                <Link
                  href={config.primaryCtaUrl || "#"}
                  className={cn(
                    "inline-flex items-center justify-center gap-2 px-8 py-4 font-body font-medium text-sm uppercase tracking-[0.08em] transition-all hover:scale-[1.02]",
                    "bg-bicta-gold text-bicta-void hover:shadow-cta-glow"
                  )}
                >
                  {config.primaryCtaLabel}
                  <ArrowRight size={16} />
                </Link>
              )}
              {config.showSecondaryCta && config.secondaryCtaLabel && (
                <Link
                  href={config.secondaryCtaUrl || "#"}
                  className={cn(
                    "inline-flex items-center justify-center gap-2 px-8 py-4 font-body font-medium text-sm uppercase tracking-[0.08em] transition-all",
                    "border border-bicta-gold text-bicta-gold hover:bg-bicta-gold/5 hover:text-bicta-gold-lt"
                  )}
                >
                  {config.secondaryCtaLabel}
                </Link>
              )}
            </div>
          </div>

          {/* Right: Visual (split layout only) */}
          {config.layoutType === "split" && config.backgroundImage && (
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-bicta-border shadow-card-hover">
                <Image
                  src={config.backgroundImage}
                  alt={config.headline}
                  fill
                  className="object-cover"
                  sizes="50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bicta-void/60 to-transparent" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Stats (BIIN style) */}
      {config.layoutType === "floating-stats" && config.stats.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 z-20 translate-y-1/2">
          <div
            className="mx-auto px-4 sm:px-6 lg:px-8"
            style={{ maxWidth: 1200 }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {config.stats.map((stat, i) => {
                const IconComp = iconMap[stat.icon || ""] || Trophy;
                return (
                  <div
                    key={i}
                    className="bg-bicta-surface border border-bicta-border rounded-xl p-4 md:p-5 text-center hover:border-bicta-border-hover transition-all"
                  >
                    <div className="w-10 h-10 rounded-lg bg-bicta-gold/10 border border-bicta-gold/20 flex items-center justify-center mx-auto mb-3">
                      <IconComp size={18} className="text-bicta-gold" />
                    </div>
                    <div className="font-mono text-2xl text-bicta-cream mb-1">
                      {stat.value}
                    </div>
                    <div className="font-body text-[0.65rem] uppercase tracking-wider text-bicta-subtle">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
