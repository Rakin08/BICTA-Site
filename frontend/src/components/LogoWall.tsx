"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { urlFor } from "@/lib/sanity/image";
import type { SanityPartner } from "@/types";

interface LogoWallProps {
  partners: SanityPartner[];
  variant?: "compact" | "large";
  className?: string;
}

export default function LogoWall({
  partners,
  variant = "compact",
  className,
}: LogoWallProps) {
  if (!partners || partners.length === 0) return null;

  const imgHeight = variant === "compact" ? 32 : 48;
  const gridCols =
    variant === "compact"
      ? "grid-cols-3 sm:grid-cols-4 md:grid-cols-6"
      : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4";

  return (
    <div
      className={cn(
        "border-t border-b border-bicta-border-strong py-8",
        className
      )}
    >
      <div className={cn("grid gap-8 items-center justify-items-center", gridCols)}>
        {partners.map((partner) => {
          const logoUrl = partner.logo
            ? urlFor(partner.logo).height(imgHeight).format("png").url()
            : null;

          const content = (
            <div
              className={cn(
                "flex items-center justify-center transition-all duration-300",
                variant === "compact" && "grayscale hover:grayscale-0 opacity-60 hover:opacity-100"
              )}
            >
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={partner.name}
                  width={160}
                  height={imgHeight}
                  className="object-contain max-w-[140px]"
                  style={{ height: imgHeight }}
                />
              ) : (
                <span className="font-body text-sm text-bicta-subtle uppercase tracking-wider">
                  {partner.name}
                </span>
              )}
            </div>
          );

          if (partner.websiteUrl) {
            return (
              <Link
                key={partner._id}
                href={partner.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-105 transition-transform duration-200"
              >
                {content}
              </Link>
            );
          }

          return <div key={partner._id}>{content}</div>;
        })}
      </div>
    </div>
  );
}
