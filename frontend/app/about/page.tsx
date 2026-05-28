import { Metadata } from "next";
import { sanityFetch } from "@/lib/sanity/client";
import {
  ABOUT_QUERY,
  FOUNDERS_QUERY,
  ADVISORS_QUERY,
  PARTNERS_QUERY,
} from "@/lib/sanity/queries";
import PageHero from "@/components/layout/PageHero";
import SectionLabel from "@/components/ui/SectionLabel";
import PortableText from "@/components/PortableText";
import PeopleCard from "@/components/PeopleCard";
import AdvisorFilter from "@/components/AdvisorFilter";
import LogoWall from "@/components/LogoWall";
import type {
  SanityAboutPage,
  SanityFounder,
  SanityAdvisor,
  SanityPartner,
} from "@/types";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about BICTA's mission, vision, and the people driving Bangladesh's ICT revolution.",
};

export default async function AboutPage() {
  // Fetch all Sanity data in parallel
  const [aboutData, founders, advisors, partners] = await Promise.allSettled([
    sanityFetch<SanityAboutPage>(ABOUT_QUERY, undefined, ["sanity", "about"]),
    sanityFetch<SanityFounder[]>(FOUNDERS_QUERY, undefined, [
      "sanity",
      "founders",
    ]),
    sanityFetch<SanityAdvisor[]>(ADVISORS_QUERY, undefined, [
      "sanity",
      "advisors",
    ]),
    sanityFetch<SanityPartner[]>(PARTNERS_QUERY, undefined, [
      "sanity",
      "partners",
    ]),
  ]);

  const about =
    aboutData.status === "fulfilled" ? aboutData.value : null;
  const founderList =
    (founders.status === "fulfilled" ? founders.value : null) || [];
  const advisorList =
    (advisors.status === "fulfilled" ? advisors.value : null) || [];
  const partnerList =
    (partners.status === "fulfilled" ? partners.value : null) || [];

  return (
    <div className="min-h-screen bg-bicta-void">
      {/* 1. Page Hero */}
      <PageHero
        badge="About BICTA"
        headline={about?.heroHeadline || "About BICTA"}
        subtext={
          about?.heroSubcopy ||
          "Learn about our mission, vision, and the people driving Bangladesh's ICT revolution."
        }
      />

      {/* 2. Mission & Vision */}
      <section className="py-16 md:py-24">
        <div
          className="mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16"
          style={{ maxWidth: 1280 }}
        >
          {/* Mission */}
          <div>
            <SectionLabel className="mb-3">
              {about?.missionTitle || "OUR MISSION"}
            </SectionLabel>
            <h2
              className="font-display font-medium text-bicta-cream mb-6"
              style={{
                fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
                lineHeight: 1.1,
              }}
            >
              Bridging the Gap
            </h2>
            {about?.missionBody ? (
              <PortableText value={about.missionBody} />
            ) : (
              <p className="font-body text-bicta-muted leading-relaxed">
                BICTA exists to bridge the gap between academia and industry in
                Bangladesh. We create platforms where students, researchers, and
                professionals can connect with industry leaders, access
                cutting-edge knowledge, and contribute to the nation's
                technological advancement.
              </p>
            )}
          </div>

          {/* Vision */}
          <div>
            <SectionLabel className="mb-3">
              {about?.visionTitle || "OUR VISION"}
            </SectionLabel>
            <h2
              className="font-display font-medium text-bicta-cream mb-6"
              style={{
                fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
                lineHeight: 1.1,
              }}
            >
              A Thriving Tech Ecosystem
            </h2>
            {about?.visionBody ? (
              <PortableText value={about.visionBody} />
            ) : (
              <p className="font-body text-bicta-muted leading-relaxed">
                We envision a Bangladesh where world-class tech talent is
                nurtured at home, where research drives innovation, and where
                every student has the opportunity to become a leader in the
                global technology landscape.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: 1280 }}>
        <div className="h-px bg-bicta-border" />
      </div>

      {/* 3. Founders Section */}
      <section className="py-16 md:py-24">
        <div
          className="mx-auto px-4 sm:px-6 lg:px-8"
          style={{ maxWidth: 1280 }}
        >
          <SectionLabel className="mb-3">OUR FOUNDERS</SectionLabel>
          <h2
            className="font-display font-medium text-bicta-cream mb-12"
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              lineHeight: 0.95,
              letterSpacing: "-0.01em",
            }}
          >
            The People Behind BICTA
          </h2>

          {founderList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {founderList.map((founder) => (
                <PeopleCard
                  key={founder._id}
                  name={founder.name}
                  title={founder.designation}
                  bio={founder.bio}
                  image={founder.image}
                  linkedInUrl={founder.linkedInUrl}
                  twitterUrl={founder.twitterUrl}
                  variant="founder"
                />
              ))}
            </div>
          ) : (
            <p className="text-bicta-subtle text-sm font-body text-center py-12">
              Founder information coming soon.
            </p>
          )}
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: 1280 }}>
        <div className="h-px bg-bicta-border" />
      </div>

      {/* 4. Advisors Section */}
      <section className="py-16 md:py-24">
        <div
          className="mx-auto px-4 sm:px-6 lg:px-8"
          style={{ maxWidth: 1280 }}
        >
          <SectionLabel className="mb-3">OUR ADVISORS</SectionLabel>
          <h2
            className="font-display font-medium text-bicta-cream mb-8"
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              lineHeight: 0.95,
              letterSpacing: "-0.01em",
            }}
          >
            Guided by Visionaries
          </h2>

          {advisorList.length > 0 ? (
            <AdvisorFilter advisors={advisorList} />
          ) : (
            <p className="text-bicta-subtle text-sm font-body text-center py-12">
              Advisor information coming soon.
            </p>
          )}
        </div>
      </section>

      {/* 5. Supported By */}
      {partnerList.length > 0 && (
        <section className="pb-16 md:pb-24">
          <div
            className="mx-auto px-4 sm:px-6 lg:px-8"
            style={{ maxWidth: 1280 }}
          >
            <SectionLabel className="mb-6 text-center">
              SUPPORTED BY
            </SectionLabel>
            <LogoWall partners={partnerList} variant="large" />
          </div>
        </section>
      )}

      {/* 6. Governance / Values Block */}
      {about?.governanceNote && (
        <section className="pb-16 md:pb-24">
          <div
            className="mx-auto px-4 sm:px-6 lg:px-8"
            style={{ maxWidth: 1280 }}
          >
            <div className="border-l-2 border-bicta-gold pl-6 py-2">
              <PortableText value={about.governanceNote} />
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
