"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Linkedin, Twitter, Globe, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { urlFor } from "@/lib/sanity/image";
import type { SanityImage, AdvisorCategory } from "@/types";

interface PeopleCardProps {
  name: string;
  title: string;
  company?: string | null;
  bio?: string | null;
  image: SanityImage | null;
  expertise?: string[];
  linkedInUrl?: string | null;
  twitterUrl?: string | null;
  websiteUrl?: string | null;
  category?: AdvisorCategory | string;
  designation?: string;
  variant: "founder" | "advisor";
}

export default function PeopleCard({
  name,
  title,
  company,
  bio,
  image,
  expertise,
  linkedInUrl,
  twitterUrl,
  websiteUrl,
  category,
  designation,
  variant,
}: PeopleCardProps) {
  const [hovered, setHovered] = useState(false);

  const imgSize = variant === "founder" ? 96 : 80; // w-24 / w-20
  const tags = expertise || [];

  return (
    <div
      className={cn(
        "group relative bg-bicta-surface border border-bicta-border rounded-xl overflow-hidden",
        "transition-all duration-500",
        hovered && "border-bicta-border-hover -translate-y-1 shadow-card-hover"
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top accent line */}
      <div
        className={cn(
          "h-[2px] bg-gradient-to-r from-transparent via-bicta-gold to-transparent transition-opacity duration-500",
          hovered ? "opacity-100" : "opacity-30"
        )}
      />

      <div className="p-6 flex flex-col items-center text-center">
        {/* Avatar */}
        <div
          className={cn(
            "relative rounded-full flex items-center justify-center mb-4 transition-all duration-500 shrink-0",
            hovered
              ? "bg-gradient-to-br from-bicta-gold/20 to-bicta-gold/5 border-bicta-gold/40"
              : "bg-gradient-to-br from-bicta-gold/10 to-bicta-gold/[0.02] border-bicta-gold/15"
          )}
          style={{
            width: imgSize,
            height: imgSize,
            borderWidth: 2,
            borderStyle: "solid",
          }}
        >
          {image ? (
            <Image
              src={urlFor(image).width(imgSize).height(imgSize).url()}
              alt={name}
              width={imgSize}
              height={imgSize}
              className="rounded-full object-cover"
            />
          ) : (
            <Users
              size={variant === "founder" ? 32 : 28}
              className="text-bicta-gold opacity-60"
            />
          )}
          {/* Online indicator */}
          <div
            className="absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-bicta-surface"
            style={{ background: "#10b981" }}
          />
        </div>

        {/* Name */}
        <h3 className="font-display font-medium text-bicta-cream text-base mb-0.5 group-hover:text-bicta-gold-lt transition-colors duration-300">
          {name}
        </h3>

        {/* Title */}
        <p className="text-xs text-bicta-gold font-body font-medium uppercase tracking-wider mb-0.5">
          {title}
        </p>

        {/* Company */}
        {company && (
          <p className="text-xs text-bicta-subtle mb-3">{company}</p>
        )}

        {/* Designation (founder only) */}
        {variant === "founder" && designation && (
          <p className="text-xs text-bicta-muted mb-3 italic">{designation}</p>
        )}

        {/* Category chip (advisor only) */}
        {variant === "advisor" && category && (
          <span className="inline-block mb-3 px-2 py-0.5 text-[0.6rem] uppercase tracking-wider text-bicta-gold bg-bicta-gold/8 border border-bicta-gold/12 rounded-md">
            {category}
          </span>
        )}

        {/* Bio */}
        {bio && (
          <p className="text-xs text-bicta-subtle leading-relaxed mb-4 line-clamp-3">
            {bio}
          </p>
        )}

        {/* Expertise Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1.5 mb-4">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-[0.6rem] uppercase tracking-wider text-bicta-gold-lt bg-bicta-gold/8 border border-bicta-gold/12 rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Social Links */}
        <div className="flex items-center gap-3 mt-auto">
          {linkedInUrl && (
            <Link
              href={linkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-bicta-subtle hover:text-bicta-gold transition-colors duration-200 p-1.5 rounded-md hover:bg-bicta-gold/8"
              onClick={(e) => e.stopPropagation()}
            >
              <Linkedin size={14} />
            </Link>
          )}
          {twitterUrl && (
            <Link
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-bicta-subtle hover:text-bicta-gold transition-colors duration-200 p-1.5 rounded-md hover:bg-bicta-gold/8"
              onClick={(e) => e.stopPropagation()}
            >
              <Twitter size={14} />
            </Link>
          )}
          {websiteUrl && (
            <Link
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-bicta-subtle hover:text-bicta-gold transition-colors duration-200 p-1.5 rounded-md hover:bg-bicta-gold/8"
              onClick={(e) => e.stopPropagation()}
            >
              <Globe size={14} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
