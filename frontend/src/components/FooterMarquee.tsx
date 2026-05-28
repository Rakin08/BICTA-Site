"use client";

import Image from "next/image";
import { urlFor } from "@/lib/sanity/image";
import type { SanitySupportedByItem, SanityPartner } from "@/types";

interface FooterMarqueeProps {
  supporters: (SanitySupportedByItem | SanityPartner)[];
}

const FALLBACK_SUPPORTERS = [
  "Grameenphone",
  "bKash",
  "Microsoft",
  "Brain Station 23",
  "BASIS",
  "Robi",
];

export default function FooterMarquee({ supporters }: FooterMarqueeProps) {
  const hasSupporters = supporters && supporters.length > 0;

  // Normalize to display items
  const items = hasSupporters
    ? supporters.map((s) => {
        const name = "name" in s ? s.name : "";
        const logo = "logo" in s ? (s as SanityPartner).logo : null;
        return { name, logo };
      })
    : FALLBACK_SUPPORTERS.map((name) => ({ name, logo: null }));

  // Render a single supporter item
  const SupporterItem = ({
    name,
    logo,
  }: {
    name: string;
    logo: ReturnType<typeof urlFor> | null;
  }) => (
    <span className="inline-flex items-center gap-3 mx-4 shrink-0">
      {logo ? (
        <Image
          src={logo.height(24).format("png").url()}
          alt={name}
          width={100}
          height={24}
          className="object-contain opacity-50"
          style={{ height: 24 }}
        />
      ) : (
        <span className="font-body text-sm text-bicta-muted uppercase tracking-wider whitespace-nowrap">
          {name}
        </span>
      )}
      <span className="text-bicta-gold/40">·</span>
    </span>
  );

  return (
    <div
      className="w-full bg-bicta-raised border-t border-bicta-border-strong py-4 overflow-hidden"
      aria-label="Supported by companies"
    >
      <div className="flex items-center">
        {/* Static label on the left */}
        <span className="shrink-0 pl-6 pr-4 font-body text-[0.6875rem] uppercase tracking-[0.15em] text-bicta-subtle">
          Supported by
        </span>

        {/* Scrolling track */}
        <div className="flex-1 overflow-hidden relative">
          <div className="flex animate-marquee-scroll whitespace-nowrap">
            {/* First set */}
            {items.map((item, i) => (
              <SupporterItem
                key={`a-${i}`}
                name={item.name}
                logo={item.logo ? urlFor(item.logo) : null}
              />
            ))}
            {/* Duplicate set for seamless loop */}
            {items.map((item, i) => (
              <SupporterItem
                key={`b-${i}`}
                name={item.name}
                logo={item.logo ? urlFor(item.logo) : null}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
