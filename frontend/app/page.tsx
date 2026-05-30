import { Metadata } from "next";
import { sanityFetch } from "@/lib/sanity/client";
import { HOMEPAGE_QUERY, SUPPORTERS_QUERY } from "@/lib/sanity/queries";
import { getEvents, getPrograms, getImpactMetrics } from "@/lib/api";
import HomeHero from "@/sections/HomeHero";
import ProgramsOverview from "@/sections/ProgramsOverview";
import EventCard from "@/components/EventCard";
import ImpactMetricsSection from "@/components/ImpactMetricsSection";
import LogoWall from "@/components/LogoWall";
import CTASection from "@/components/CTASection";
import SectionLabel from "@/components/ui/SectionLabel";
import type { SanitySiteSettings, SanityPartner } from "@/types";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await sanityFetch<SanitySiteSettings>(
    HOMEPAGE_QUERY, undefined, ["sanity", "homepage"]
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
      sanityFetch<SanitySiteSettings>(HOMEPAGE_QUERY, undefined, [
        "sanity",
        "homepage",
      ]),
      getEvents({ featured: true, limit: 3 }),
      getPrograms(true),
      getImpactMetrics(),
      sanityFetch<SanityPartner[]>(SUPPORTERS_QUERY, undefined, [
        "supporters",
      ]),
    ]);

  const siteSettings =
    settings.status === "fulfilled" ? settings.value : null;
  const featuredEvents =
    eventsRes.status === "fulfilled"
      ? (eventsRes.value?.events || []).slice(0, 3)
      : [];
  const programList =
    (programs.status === "fulfilled" ? programs.value : null) || [];
  const impactMetrics =
    (metrics.status === "fulfilled" ? metrics.value : null) || [];
  const partnerSupporters =
    (supporters.status === "fulfilled" ? supporters.value : null) || [];

  return (
    <>
      <HomeHero
        headline={siteSettings?.heroHeadline}
        subcopy={siteSettings?.heroSubcopy}
        primaryCta={siteSettings?.heroPrimaryCta}
        secondaryCta={siteSettings?.heroSecondaryCta}
      />

      <section
        id="events"
        className="relative bg-bicta-void"
        style={{ padding: "clamp(60px, 10vw, 100px) 0" }}
      >
        <div
          className="mx-auto px-4 sm:px-6 lg:px-8"
          style={{ maxWidth: 1280 }}
        >
          <SectionLabel className="mb-4">UPCOMING EVENTS</SectionLabel>
          <h2
            className="font-display font-medium text-bicta-cream mb-12"
            style={{
              fontSize: "clamp(2rem, 5vw, 4rem)",
              lineHeight: 1.05,
            }}
          >
            {"What's "}
            <em style={{ fontStyle: "italic", color: "#c9a84c" }}>
              Happening
            </em>
          </h2>
          {featuredEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredEvents.map((event, i) => (
                <EventCard key={event.id} event={event} priority={i === 0} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-bicta-subtle font-body text-sm">
                No featured events at the moment. Check back soon.
              </p>
            </div>
          )}
        </div>
      </section>

      <ProgramsOverview programs={programList} />
      <ImpactMetricsSection metrics={impactMetrics} />

      {partnerSupporters.length > 0 && (
        <section className="bg-bicta-void py-8">
          <div
            className="mx-auto px-4 sm:px-6 lg:px-8"
            style={{ maxWidth: 1280 }}
          >
            <SectionLabel className="mb-6 text-center">SUPPORTED BY</SectionLabel>
            <LogoWall partners={partnerSupporters} variant="compact" />
          </div>
        </section>
      )}

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
