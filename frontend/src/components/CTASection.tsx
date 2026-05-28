import GoldButton from "@/components/ui/GoldButton";
import { cn } from "@/lib/utils";

interface CTASectionProps {
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
  variant?: "dark" | "gold-border";
  className?: string;
}

export default function CTASection({
  headline,
  subtext,
  primaryCta,
  secondaryCta,
  variant = "dark",
  className,
}: CTASectionProps) {
  return (
    <section
      className={cn(
        "relative w-full py-16 md:py-24",
        variant === "dark" && "bg-bicta-void",
        variant === "gold-border" && "bg-bicta-void",
        className
      )}
    >
      {/* Variant-specific border accents */}
      {variant === "gold-border" && (
        <>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-bicta-gold/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-bicta-gold/30 to-transparent" />
        </>
      )}
      {variant === "dark" && (
        <div
          className="absolute left-0 top-0 bottom-0 w-1"
          style={{
            background:
              "linear-gradient(to bottom, transparent, #c9a84c, transparent)",
          }}
        />
      )}

      <div
        className="relative mx-auto px-4 sm:px-6 lg:px-8 text-center"
        style={{ maxWidth: 800 }}
      >
        <h2
          className="font-display font-medium text-bicta-cream"
          style={{
            fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
            lineHeight: 1.1,
            letterSpacing: "-0.01em",
          }}
        >
          {headline}
        </h2>

        {subtext && (
          <p
            className="mt-5 font-body font-light text-bicta-subtle mx-auto"
            style={{ fontSize: "1rem", lineHeight: 1.7, maxWidth: 560 }}
          >
            {subtext}
          </p>
        )}

        {(primaryCta || secondaryCta) && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
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
