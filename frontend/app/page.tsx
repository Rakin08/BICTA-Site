import { Metadata } from "next";
import { sanityFetch } from "@/lib/sanity/client";
import { HOMEPAGE_QUERY, SUPPORTERS_QUERY } from "@/lib/sanity/queries";
import { getEvents, getPrograms, getImpactMetrics } from "@/lib/api";
import HomeHero from "@/sections/HomeHero";
import ProgramsOverview from "@/sections/ProgramsOverview";
import ImpactMetricsSection from "@/components/ImpactMetricsSection";
import LogoWall from "@/components/LogoWall";
import CTASection from "@/components/CTASection";
import SectionLabel from "@/components/ui/SectionLabel";
import NewsTicker from "@/components/NewsTicker";
import EventsScrollSection from "@/components/EventsScrollSection";
import CoreMembersSection from "@/components/CoreMembersSection";
import type { SanitySiteSettings, SanityPartner } from "@/types";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await sanityFetch<SanitySiteSettings>(
    HOMEPAGE_QUERY,
    undefined,
    ["sanity", "homepage"]
  );
  return {
    title: settings?.siteTitle || "BICTA — Bangladesh ICT Alliance",
    description:
      settings?.siteDescription ||
      "BICTA bridges academia and industry through flagship national programs.",
  };
}

export default async function HomePage() {
  const [settings, eventsRes, programs, metrics, supporters] =
    await Promise.allSettled([
      sanityFetch<SanitySiteSettings>(HOMEPAGE_QUERY, undefined, ["sanity", "homepage"]),
      getEvents({ featured: true, limit: 3 }),
      getPrograms(true),
      getImpactMetrics(),
      sanityFetch<SanityPartner[]>(SUPPORTERS_QUERY, undefined, ["supporters"]),
    ]);

  const siteSettings = settings.status === "fulfilled" ? settings.value : null;
  const programList = (programs.status === "fulfilled" ? programs.value : null) || [];
  const impactMetrics = (metrics.status === "fulfilled" ? metrics.value : null) || [];
  const partnerSupporters = (supporters.status === "fulfilled" ? supporters.value : null) || [];

  return (
    <>
      {/* Hero */}
      <HomeHero
        headline={siteSettings?.heroHeadline}
        subcopy={siteSettings?.heroSubcopy}
        primaryCta={siteSettings?.heroPrimaryCta}
        secondaryCta={siteSettings?.heroSecondaryCta}
      />

      {/* News Ticker */}
      <NewsTicker />

      {/* Gen Z Events */}
      <section className="bg-bicta-void" style={{ padding: "80px 0 64px" }}>
        <div className="px-4 sm:px-6 lg:px-8 mb-10" style={{ maxWidth: 1280, margin: "0 auto 40px" }}>
          <SectionLabel className="mb-3">UPCOMING EVENTS</SectionLabel>
          <h2
            className="font-display text-bicta-cream"
            style={{ fontSize: "clamp(1.75rem,4vw,3rem)", lineHeight: 1.1 }}
          >
            What&apos;s{" "}
            <em style={{ fontStyle: "italic", color: "#c9a84c" }}>Happening</em>
          </h2>
        </div>
        <EventsScrollSection />
      </section>

      {/* Programs Overview */}
      <ProgramsOverview programs={programList} />

      {/* Impact Metrics */}
      <ImpactMetricsSection metrics={impactMetrics} />

      {/* Core Members & Advisors */}
      <CoreMembersSection
        founders={[]}
        advisors={[]}
        title="The Minds Behind BICTA"
        subtitle="World-class founders and advisors guiding Bangladesh's ICT and AI ecosystem."
      />

      {/* Partner Logo Wall */}
      {partnerSupporters.length > 0 && (
        <section className="bg-bicta-void py-8">
          <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: 1280 }}>
            <SectionLabel className="mb-6 text-center">SUPPORTED BY</SectionLabel>
            <LogoWall partners={partnerSupporters} variant="compact" />
          </div>
        </section>
      )}

      {/* CTA */}
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
