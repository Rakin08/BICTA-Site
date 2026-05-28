"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  Grid3X3,
  LayoutList,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import EventBanner from "@/components/events/EventBanner";
import EventCardV2 from "@/components/events/EventCardV2";
import SectionLabel from "@/components/ui/SectionLabel";
import type { EventBannerConfig } from "@/types/event-banner";

// Demo event banners — in production fetched from CMS API
const demoBanners: EventBannerConfig[] = [
  {
    id: "banner-1",
    eventId: "ai-olympiad-2026",
    eventTitle: "AI Olympiad 2026",
    headline: "AI Olympiad 2026",
    subheadline: "Bangladesh's Premier AI Competition",
    description:
      "Push the boundaries of artificial intelligence. Compete with the nation's brightest minds in machine learning, deep learning, and generative AI challenges. Win mentorship from industry leaders and cash prizes up to ৳5,00,000.",
    backgroundImage: "",
    backgroundColor: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
    overlayType: "gradient-gold",
    overlayOpacity: 40,
    layoutType: "floating-stats",
    textAlign: "left",
    textColor: "#faf8f3",
    accentColor: "#c9a84c",
    showDate: true,
    startDate: "2026-08-15T09:00:00Z",
    endDate: "2026-08-17T18:00:00Z",
    dateLabel: "Registration Open",
    location: "Dhaka, Bangladesh + Virtual",
    showLocation: true,
    primaryCtaLabel: "Register Now",
    primaryCtaUrl: "/competition/exam",
    secondaryCtaLabel: "Learn More",
    secondaryCtaUrl: "#",
    showSecondaryCta: true,
    stats: [
      { label: "Participants", value: "2,400+", icon: "Users" },
      { label: "Prize Pool", value: "৳5L", icon: "Trophy" },
      { label: "Rounds", value: "3", icon: "Calendar" },
      { label: "Duration", value: "72h", icon: "Clock" },
    ],
    badgeText: "Registration Open",
    badgeColor: "#10b981",
    showBadge: true,
    metaTitle: "AI Olympiad 2026 — BICTA",
    metaDescription: "Bangladesh's premier AI competition",
    published: true,
    displayOrder: 1,
    createdAt: "2026-05-01",
    updatedAt: "2026-05-27",
  },
  {
    id: "banner-2",
    eventId: "datathon-spring-2026",
    eventTitle: "Datathon Spring 2026",
    headline: "Datathon Spring 2026",
    subheadline: "Data-Driven Innovation Challenge",
    description:
      "Transform raw data into actionable insights. Work with real-world datasets from Bangladesh's leading organizations. Build predictive models, create stunning visualizations, and present your findings to industry judges.",
    backgroundImage: "",
    backgroundColor: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    overlayType: "gradient-dark",
    overlayOpacity: 50,
    layoutType: "centered",
    textAlign: "center",
    textColor: "#faf8f3",
    accentColor: "#c9a84c",
    showDate: true,
    startDate: "2026-09-20T10:00:00Z",
    endDate: "2026-09-22T16:00:00Z",
    dateLabel: "Coming Soon",
    location: "Dhaka, Bangladesh",
    showLocation: true,
    primaryCtaLabel: "Pre-Register",
    primaryCtaUrl: "#",
    secondaryCtaLabel: "",
    secondaryCtaUrl: "",
    showSecondaryCta: false,
    stats: [],
    badgeText: "Upcoming",
    badgeColor: "#c9a84c",
    showBadge: true,
    metaTitle: "Datathon Spring 2026 — BICTA",
    metaDescription: "Data-driven innovation challenge",
    published: true,
    displayOrder: 2,
    createdAt: "2026-05-01",
    updatedAt: "2026-05-27",
  },
  {
    id: "banner-3",
    eventId: "ai-for-sdg-2026",
    eventTitle: "AI for SDG 2026",
    headline: "AI for SDG 2026",
    subheadline: "Technology for Social Good",
    description:
      "Build AI solutions addressing the UN Sustainable Development Goals. From climate action to quality education, use your skills to create technology that makes a real difference in communities across Bangladesh.",
    backgroundImage: "",
    backgroundColor: "linear-gradient(135deg, #0a0a0a 0%, #1a3a2a 50%, #0a2a1a 100%)",
    overlayType: "gradient-gold",
    overlayOpacity: 35,
    layoutType: "split",
    textAlign: "left",
    textColor: "#faf8f3",
    accentColor: "#10b981",
    showDate: true,
    startDate: "2026-10-05T09:00:00Z",
    endDate: "2026-10-07T17:00:00Z",
    dateLabel: "Opens Oct 5",
    location: "Multi-City + Virtual",
    showLocation: true,
    primaryCtaLabel: "Get Notified",
    primaryCtaUrl: "#",
    secondaryCtaLabel: "View SDG Tracks",
    secondaryCtaUrl: "#",
    showSecondaryCta: true,
    stats: [],
    badgeText: "SDG Focus",
    badgeColor: "#10b981",
    showBadge: true,
    metaTitle: "AI for SDG 2026 — BICTA",
    metaDescription: "AI solutions for sustainable development",
    published: true,
    displayOrder: 3,
    createdAt: "2026-05-01",
    updatedAt: "2026-05-27",
  },
];

const CATEGORIES = ["All", "Competition", "Datathon", "Workshop", "Summit", "Hackathon"];
const STATUSES = ["All", "Registration Open", "Upcoming", "Ongoing", "Completed"];

export default function EventsHubPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  const featured = demoBanners[0];
  const others = demoBanners.slice(1);

  const filtered = others.filter((b) => {
    const matchesSearch =
      !search ||
      b.headline.toLowerCase().includes(search.toLowerCase()) ||
      b.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === "All" || b.badgeText === status;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-bicta-void">
      {/* Featured Event Hero Banner */}
      <EventBanner config={featured} variant="hero" />

      {/* Upcoming Events Section */}
      <section className="py-16 md:py-24">
        <div
          className="mx-auto px-4 sm:px-6 lg:px-8"
          style={{ maxWidth: 1280 }}
        >
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <SectionLabel className="mb-3">UPCOMING EVENTS</SectionLabel>
              <h2
                className="font-display font-medium text-bicta-cream"
                style={{
                  fontSize: "clamp(2rem, 5vw, 3.5rem)",
                  lineHeight: 0.95,
                  letterSpacing: "-0.01em",
                }}
              >
                More Events
              </h2>
            </div>

            {/* Search + Filters */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-bicta-subtle"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search events..."
                  className={cn(
                    "w-48 md:w-64 bg-bicta-surface border border-bicta-border text-bicta-cream",
                    "font-body text-sm pl-9 pr-3 py-2.5 rounded-lg outline-none",
                    "focus:border-bicta-gold transition-colors placeholder:text-bicta-subtle/40"
                  )}
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  "p-2.5 rounded-lg border transition-all",
                  showFilters
                    ? "bg-bicta-gold/10 border-bicta-gold/25 text-bicta-gold"
                    : "bg-bicta-surface border-bicta-border text-bicta-subtle hover:text-bicta-muted"
                )}
              >
                <SlidersHorizontal size={16} />
              </button>
              <div className="hidden sm:flex bg-bicta-surface border border-bicta-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "p-2.5 transition-colors",
                    viewMode === "grid"
                      ? "text-bicta-gold bg-bicta-gold/10"
                      : "text-bicta-subtle hover:text-bicta-muted"
                  )}
                >
                  <Grid3X3 size={16} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "p-2.5 transition-colors",
                    viewMode === "list"
                      ? "text-bicta-gold bg-bicta-gold/10"
                      : "text-bicta-subtle hover:text-bicta-muted"
                  )}
                >
                  <LayoutList size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Filter Row */}
          {showFilters && (
            <div className="flex flex-wrap gap-3 mb-8 pb-6 border-b border-bicta-border">
              <div className="flex flex-wrap gap-2">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatus(s)}
                    className={cn(
                      "px-3 py-1.5 text-xs font-body font-medium uppercase tracking-wider rounded-md transition-all border",
                      status === s
                        ? "bg-bicta-gold/10 border-bicta-gold/25 text-bicta-gold"
                        : "bg-bicta-raised border-bicta-border text-bicta-subtle hover:text-bicta-muted"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Events Grid */}
          {filtered.length > 0 ? (
            <div
              className={cn(
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              )}
            >
              {filtered.map((banner) => (
                <EventCardV2
                  key={banner.id}
                  banner={banner}
                  size={viewMode === "list" ? "large" : "medium"}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Calendar size={40} className="text-bicta-subtle/20 mx-auto mb-4" />
              <p className="font-body text-sm text-bicta-subtle">
                No events match your filters.
              </p>
            </div>
          )}

          {/* View All Link */}
          <div className="mt-12 text-center">
            <Link
              href="/events/archive"
              className="inline-flex items-center gap-2 font-body text-sm text-bicta-gold hover:text-bicta-gold-lt transition-colors"
            >
              View Past Events
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="relative border-t border-bicta-border"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.03) 0%, transparent 70%)",
        }}
      >
        <div
          className="mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center"
          style={{ maxWidth: 640 }}
        >
          <h2 className="font-display text-2xl text-bicta-cream mb-3">
            Want to host an event with BICTA?
          </h2>
          <p className="font-body text-sm text-bicta-muted mb-6">
            Partner with us to organize world-class competitions, workshops, and
            summits that shape Bangladesh's tech future.
          </p>
          <Link
            href="/partners"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-bicta-gold text-bicta-void font-body font-medium text-sm uppercase tracking-[0.08em] hover:shadow-cta-glow transition-all hover:scale-[1.02]"
          >
            Become a Partner
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
