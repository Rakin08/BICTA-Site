import { Metadata } from "next";
import { getPrograms, getImpactMetrics } from "@/lib/api";
import HomeHero from "@/sections/HomeHero";
import ProgramsOverview from "@/sections/ProgramsOverview";
import ImpactMetricsSection from "@/components/ImpactMetricsSection";
import CTASection from "@/components/CTASection";
import SectionLabel from "@/components/ui/SectionLabel";
import NewsTicker from "@/components/NewsTicker";
import EventsScrollSection from "@/components/EventsScrollSection";
import CoreMembersSection from "@/components/CoreMembersSection";

export const metadata: Metadata = {
  title: "BICTA — Bangladesh ICT Alliance",
  description: "Bangladesh ICT Alliance — bridging academia and industry.",
};

export default async function HomePage() {
  const [programs, metrics] = await Promise.allSettled([
    getPrograms(true),
    getImpactMetrics(),
  ]);

  const programList =
    programs.status === "fulfilled" ? programs.value || [] : [];
  const impactMetrics =
    metrics.status === "fulfilled" ? metrics.value || [] : [];

  return (
    <>
      <HomeHero />
      <NewsTicker />

      <section style={{ background: "#070706", padding: "72px 0 56px" }}>
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto 36px",
            padding: "0 clamp(24px,5vw,64px)",
          }}
        >
          <SectionLabel className="mb-3">UPCOMING EVENTS</SectionLabel>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
            }}
          >
            <h2
              className="font-display text-bicta-cream"
              style={{ fontSize: "clamp(1.75rem,4vw,3rem)", lineHeight: 1.1 }}
            >
              {"What's "}
              <em style={{ fontStyle: "italic", color: "#c9a84c" }}>
                Happening
              </em>
            </h2>
            <a
              href="/events"
              style={{
                fontSize: 11,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#3a3835",
                textDecoration: "none",
                paddingBottom: 4,
              }}
            >
              View All →
            </a>
          </div>
        </div>
        <EventsScrollSection />
      </section>

      <ProgramsOverview programs={programList} />
      <ImpactMetricsSection metrics={impactMetrics} />
      <CoreMembersSection />

      <CTASection
        headline="Join the Movement"
        subtext="Whether you're a student, educator, or industry leader — there's a place for you in the BICTA ecosystem."
        primaryCta={{ label: "Become a Partner", href: "/partners" }}
        secondaryCta={{ label: "Explore Programs", href: "/programs" }}
        variant="gold-border"
      />
    </>
  );
}
