import EventStatusBadge from "@/components/ui/EventStatusBadge";
import GoldButton from "@/components/ui/GoldButton";
import { cn } from "@/lib/utils";
import type { EventStatus } from "@/types";

interface PageHeroProps {
  badge?: string;
  headline: string;
  subtext?: string;
  primaryCta?: {
    label: string;
    href: string;
    external?: boolean;
  };
  secondaryCta?: {
    label: string;
    href: string;
    external?: boolean;
  };
  statusBadge?: EventStatus;
  className?: string;
}

/**
 * Full-width page hero used on all sub-pages (events, about, partners, programs).
 * bg-bicta-raised (NOT the animated homepage hero).
 */
export default function PageHero({
  badge,
  headline,
  subtext,
  primaryCta,
  secondaryCta,
  statusBadge,
  className,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative w-full bg-bicta-raised border-b border-bicta-border-strong",
        "py-16 md:py-24",
        className
      )}
    >
      {/* Subtle gold glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.04) 0%, transparent 70%)",
        }}
      />

      <div
        className="relative mx-auto px-4 sm:px-6 lg:px-8"
        style={{ maxWidth: 1280 }}
      >
        {/* Badge */}
        {badge && (
          <span className="inline-block mb-4 px-3 py-1 bg-bicta-gold/8 border border-bicta-gold/15 rounded-full text-bicta-gold font-body font-medium text-[0.6875rem] uppercase tracking-[0.15em]">
            {badge}
          </span>
        )}
        {statusBadge && (
          <div className="mb-4">
            <EventStatusBadge status={statusBadge} />
          </div>
        )}

        {/* Headline */}
        <h1
          className="font-display font-medium text-bicta-cream"
          style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            lineHeight: 0.95,
            letterSpacing: "-0.01em",
          }}
        >
          {headline}
        </h1>

        {/* Subtext */}
        {subtext && (
          <p
            className="mt-5 font-body font-light text-bicta-subtle"
            style={{
              fontSize: "1rem",
              lineHeight: 1.7,
              maxWidth: 640,
            }}
          >
            {subtext}
          </p>
        )}

        {/* CTAs */}
        {(primaryCta || secondaryCta) && (
          <div className="flex flex-col sm:flex-row items-start gap-4 mt-8">
            {primaryCta && (
              <GoldButton
                href={primaryCta.href}
                external={primaryCta.external}
                variant="solid"
                size="md"
              >
                {primaryCta.label}
              </GoldButton>
            )}
            {secondaryCta && (
              <GoldButton
                href={secondaryCta.href}
                external={secondaryCta.external}
                variant="outline"
                size="md"
              >
                {secondaryCta.label}
              </GoldButton>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
