"use client";
import { useState } from "react";
import Image from "next/image";
import { Linkedin, Twitter, Globe, ChevronRight } from "lucide-react";

interface Member {
  _id?: string;
  id?: number;
  name: string;
  title: string;
  company?: string;
  category?: string;
  bio?: string;
  expertise?: string;
  imageUrl?: string;
  image?: { asset: { _ref: string } };
  linkedInUrl?: string;
  twitterUrl?: string;
  websiteUrl?: string;
  featured?: boolean;
}

interface CoreMembersSectionProps {
  founders?: Member[];
  advisors?: Member[];
  title?: string;
  subtitle?: string;
}

function MemberCard({ member, variant = "advisor" }: { member: Member; variant?: "founder" | "advisor" }) {
  const [expanded, setExpanded] = useState(false);
  const imgSrc = member.imageUrl || (member.image ? `https://cdn.sanity.io/images/ouj7m9p4/production/${member.image.asset._ref.replace("image-", "").replace("-jpg", ".jpg").replace("-png", ".png").replace("-webp", ".webp")}` : null);

  return (
    <div className={`group relative bg-bicta-surface border border-bicta-border rounded-xl p-6 hover:border-bicta-gold/40 hover:shadow-card-hover transition-all duration-300 ${variant === "founder" ? "md:p-8" : ""}`}>
      {/* Gold accent line */}
      <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-bicta-gold/40 to-transparent" />

      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className={`relative flex-shrink-0 ${variant === "founder" ? "w-16 h-16" : "w-12 h-12"} rounded-full overflow-hidden bg-bicta-raised border-2 border-bicta-gold/20 group-hover:border-bicta-gold/50 transition-all`}>
          {imgSrc ? (
            <Image src={imgSrc} alt={member.name} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-display text-bicta-gold font-bold text-lg">{member.name[0]}</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-bicta-cream font-semibold text-base leading-tight mb-0.5">{member.name}</h3>
          <p className="font-body text-bicta-gold text-xs font-medium uppercase tracking-wide">{member.title}</p>
          {member.company && <p className="font-body text-bicta-subtle text-xs mt-0.5">{member.company}</p>}

          {/* Category badge */}
          {member.category && (
            <span className="inline-block mt-2 px-2 py-0.5 bg-bicta-gold/10 border border-bicta-gold/20 rounded text-bicta-gold text-[10px] font-medium uppercase tracking-wider">
              {member.category}
            </span>
          )}
        </div>
      </div>

      {/* Expertise tags */}
      {member.expertise && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {member.expertise.split(",").map((tag, i) => (
            <span key={i} className="px-2 py-0.5 bg-bicta-raised border border-bicta-border text-bicta-subtle text-[10px] rounded">
              {tag.trim()}
            </span>
          ))}
        </div>
      )}

      {/* Bio */}
      {member.bio && (
        <div className="mt-3">
          <p className={`font-body text-bicta-muted text-xs leading-relaxed ${!expanded ? "line-clamp-2" : ""}`}>
            {member.bio}
          </p>
          {member.bio.length > 100 && (
            <button onClick={() => setExpanded(!expanded)} className="text-bicta-gold text-[10px] mt-1 flex items-center gap-0.5 hover:underline">
              {expanded ? "Show less" : "Read more"} <ChevronRight size={10} className={expanded ? "rotate-90" : ""} />
            </button>
          )}
        </div>
      )}

      {/* Social links */}
      {(member.linkedInUrl || member.twitterUrl || member.websiteUrl) && (
        <div className="mt-4 flex gap-3 pt-3 border-t border-bicta-border">
          {member.linkedInUrl && member.linkedInUrl !== "#" && (
            <a href={member.linkedInUrl} target="_blank" rel="noopener noreferrer" className="text-bicta-subtle hover:text-bicta-gold transition-colors">
              <Linkedin size={14} />
            </a>
          )}
          {member.twitterUrl && member.twitterUrl !== "#" && (
            <a href={member.twitterUrl} target="_blank" rel="noopener noreferrer" className="text-bicta-subtle hover:text-bicta-gold transition-colors">
              <Twitter size={14} />
            </a>
          )}
          {member.websiteUrl && (
            <a href={member.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-bicta-subtle hover:text-bicta-gold transition-colors">
              <Globe size={14} />
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default function CoreMembersSection({ founders = [], advisors = [], title, subtitle }: CoreMembersSectionProps) {
  const [activeTab, setActiveTab] = useState<"founders" | "advisors">("founders");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const categories = ["All", ...Array.from(new Set(advisors.map(a => a.category).filter(Boolean)))] as string[];
  const filteredAdvisors = categoryFilter === "All" ? advisors : advisors.filter(a => a.category === categoryFilter);

  const showFounders = founders.length > 0;
  const showAdvisors = advisors.length > 0;

  if (!showFounders && !showAdvisors) return null;

  return (
    <section className="py-24 px-6 bg-bicta-void relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,168,76,0.04),transparent_60%)]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-bicta-gold/20 to-transparent" />

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 border border-bicta-gold/30 text-bicta-gold text-xs font-medium uppercase tracking-[0.2em] mb-4">
            Our People
          </span>
          <h2 className="font-display text-3xl md:text-4xl text-bicta-cream mb-4">
            {title || "The Minds Behind BICTA"}
          </h2>
          <p className="font-body text-bicta-muted text-base max-w-2xl mx-auto">
            {subtitle || "World-class founders and advisors guiding Bangladesh's ICT and AI ecosystem."}
          </p>
        </div>

        {/* Tabs */}
        {showFounders && showAdvisors && (
          <div className="flex justify-center gap-2 mb-12">
            {(["founders", "advisors"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 text-sm font-medium uppercase tracking-wider transition-all ${
                  activeTab === tab
                    ? "bg-bicta-gold text-bicta-void"
                    : "border border-bicta-border text-bicta-subtle hover:border-bicta-gold/40 hover:text-bicta-cream"
                }`}
              >
                {tab === "founders" ? `Founders (${founders.length})` : `Advisors (${advisors.length})`}
              </button>
            ))}
          </div>
        )}

        {/* Category filter for advisors */}
        {(!showFounders || activeTab === "advisors") && categories.length > 2 && (
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-1.5 text-xs font-medium uppercase tracking-wider rounded transition-all ${
                  categoryFilter === cat
                    ? "bg-bicta-gold/20 border border-bicta-gold/50 text-bicta-gold"
                    : "border border-bicta-border text-bicta-subtle hover:border-bicta-gold/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Founders grid */}
        {(activeTab === "founders" || !showAdvisors) && showFounders && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {founders.map((m, i) => <MemberCard key={m._id || m.id || i} member={m} variant="founder" />)}
          </div>
        )}

        {/* Advisors grid */}
        {(activeTab === "advisors" || !showFounders) && showAdvisors && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredAdvisors.map((m, i) => <MemberCard key={m._id || m.id || i} member={m} variant="advisor" />)}
          </div>
        )}
      </div>
    </section>
  );
}
