import { Metadata } from "next";
import { sanityFetch } from "@/lib/sanity/client";
import { HOMEPAGE_QUERY, SUPPORTERS_QUERY } from "@/lib/sanity/queries";
import { getPrograms, getImpactMetrics } from "@/lib/api";
import HomeHero from "@/sections/HomeHero";
import ProgramsOverview from "@/sections/ProgramsOverview";
import ImpactMetricsSection from "@/components/ImpactMetricsSection";
import CTASection from "@/components/CTASection";
import SectionLabel from "@/components/ui/SectionLabel";
import NewsTicker from "@/components/NewsTicker";
import EventsScrollSection from "@/components/EventsScrollSection";
import CoreMembersSection from "@/components/CoreMembersSection";
import type { SanitySiteSettings, SanityPartner } from "@/types";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await sanityFetch<SanitySiteSettings>(HOMEPAGE_QUERY, undefined, ["sanity","homepage"]);
  return {
    title: settings?.siteTitle || "BICTA — Bangladesh ICT Alliance",
    description: settings?.siteDescription || "BICTA bridges academia and industry through flagship national programs.",
  };
}

export default async function HomePage() {
  const [settings, programs, metrics] = await Promise.allSettled([
    sanityFetch<SanitySiteSettings>(HOMEPAGE_QUERY, undefined, ["sanity","homepage"]),
    getPrograms(true),
    getImpactMetrics(),
  ]);

  const siteSettings = settings.status === "fulfilled" ? settings.value : null;
  const programList = (programs.status === "fulfilled" ? programs.value : null) || [];
  const impactMetrics = (metrics.status === "fulfilled" ? metrics.value : null) || [];

  return (
    <>
      <HomeHero
        headline={siteSettings?.heroHeadline}
        subcopy={siteSettings?.heroSubcopy}
        primaryCta={siteSettings?.heroPrimaryCta}
        secondaryCta={siteSettings?.heroSecondaryCta}
      />

      <NewsTicker />

      {/* Events — Gen Z drag scroll with live countdowns */}
      <section style={{ background:"#070706", padding:"72px 0 56px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto 36px", padding:"0 clamp(24px,5vw,64px)" }}>
          <SectionLabel className="mb-3">UPCOMING EVENTS</SectionLabel>
          <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between" }}>
            <h2 className="font-display text-bicta-cream reveal" style={{ fontSize:"clamp(1.75rem,4vw,3rem)", lineHeight:1.1 }}>
              What&apos;s{" "}<em style={{ fontStyle:"italic", color:"#c9a84c" }}>Happening</em>
            </h2>
            <a href="/events" style={{ fontSize:11, letterSpacing:"0.1em", textTransform:"uppercase", color:"#3a3835", textDecoration:"none", display:"flex", alignItems:"center", gap:5, transition:"color .2s", paddingBottom:4 }}
              onMouseEnter={e=>(e.target as HTMLElement).style.color="#c9a84c"}
              onMouseLeave={e=>(e.target as HTMLElement).style.color="#3a3835"}>View All →</a>
          </div>
        </div>
        <EventsScrollSection />
      </section>

      {/* Programs */}
      <ProgramsOverview programs={programList} />

      {/* Impact Metrics */}
      <ImpactMetricsSection metrics={impactMetrics} />

      {/* Core Members & Advisors */}
      <CoreMembersSection />

      {/* CTA */}
      <CTASection
        headline="Join the Movement"
        subtext="Whether you're a student, educator, or industry leader — there's a place for you in the BICTA ecosystem."
        primaryCta={{ label:"Become a Partner", href:"/partners" }}
        secondaryCta={{ label:"Explore Programs", href:"/programs" }}
        variant="gold-border"
      />
    </>
  );
}
