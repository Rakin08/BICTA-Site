"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { AdvisorCategory, SanityAdvisor } from "@/types";
import PeopleCard from "@/components/PeopleCard";

const ALL_CATEGORIES: ("All" | AdvisorCategory)[] = [
  "All",
  "Industry",
  "Academia",
  "Policy",
  "Startup",
  "Technology",
];

interface AdvisorFilterProps {
  advisors: SanityAdvisor[];
}

export default function AdvisorFilter({ advisors }: AdvisorFilterProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filtered =
    activeCategory === "All"
      ? advisors
      : advisors.filter((a) => a.category === activeCategory);

  return (
    <div>
      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {ALL_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "px-4 py-2 text-xs font-body font-medium uppercase tracking-wider rounded-md transition-all duration-200 border",
              activeCategory === cat
                ? "bg-bicta-gold/10 border-bicta-gold/25 text-bicta-gold"
                : "bg-bicta-surface border-bicta-border text-bicta-subtle hover:border-bicta-border-hover hover:text-bicta-muted"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Advisor grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((advisor) => (
            <PeopleCard
              key={advisor._id}
              name={advisor.name}
              title={advisor.title}
              company={advisor.company}
              bio={advisor.bio}
              image={advisor.image}
              expertise={advisor.expertise}
              linkedInUrl={advisor.linkedInUrl}
              twitterUrl={advisor.twitterUrl}
              websiteUrl={advisor.websiteUrl}
              category={advisor.category}
              variant="advisor"
            />
          ))}
        </div>
      ) : (
        <p className="text-bicta-subtle text-sm font-body text-center py-12">
          No advisors in this category yet.
        </p>
      )}
    </div>
  );
}
