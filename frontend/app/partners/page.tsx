import { Metadata } from "next";
import { sanityFetch } from "@/lib/sanity/client";
import { PARTNERS_QUERY } from "@/lib/sanity/queries";
import PageHero from "@/components/layout/PageHero";
import PartnerInquiryForm from "@/components/PartnerInquiryForm";
import LogoWall from "@/components/LogoWall";
import CTASection from "@/components/CTASection";
import SectionLabel from "@/components/ui/SectionLabel";
import { Users, Megaphone, Briefcase } from "lucide-react";
import type { SanityPartner } from "@/types";

export const metadata: Metadata = {
  title: "Partner With BICTA",
  description:
    "Co-create national programs, access talent, and build brand equity. Partner with BICTA to shape Bangladesh's tech ecosystem.",
};

const valueProps = [
  {
    icon: Users,
    title: "Access Talent",
    description:
      "Connect with Bangladesh's brightest students and early-career professionals through our competitions and events.",
  },
  {
    icon: Megaphone,
    title: "Brand Visibility",
    description:
      "Showcase your brand to thousands of engaged participants, educators, and industry stakeholders nationwide.",
  },
  {
    icon: Briefcase,
    title: "Recruitment Pipeline",
    description:
      "Identify and recruit top-performing talent directly from our flagship programs and competitions.",
  },
];

const tiers = [
  {
    name: "Ecosystem Partner",
    description: "Long-term strategic partnership with BICTA initiatives.",
    benefits: [
      "Logo on all event materials",
      "Booth space at flagship events",
      "Access to participant database",
      "Co-branded content opportunities",
      "Year-round brand presence",
    ],
  },
  {
    name: "Challenge Sponsor",
    description: "Sponsor a specific competition track or challenge.",
    benefits: [
      "Named challenge/track sponsorship",
      "Mentorship opportunities",
      "Recruitment access to finalists",
      "Speaking slot at award ceremony",
      "Social media features",
    ],
  },
  {
    name: "Title Sponsor",
    description: "Exclusive title sponsorship for flagship events.",
    benefits: [
      "Event named after your brand",
      "Premium booth placement",
      "Keynote speaking opportunity",
      "Full participant data access",
      "Exclusive media coverage",
      "VIP networking dinner",
    ],
  },
];

export default async function PartnersPage() {
  const partners = (await sanityFetch<SanityPartner[]>(
    PARTNERS_QUERY,
    undefined,
    ["partners"]
  )) || [];

  return (
    <div className="min-h-screen bg-bicta-void">
      {/* 1. Hero */}
      <PageHero
        badge="Partner With BICTA"
        headline="Build Bangladesh's Tech Ecosystem Together"
        subtext="Co-create national programs, access talent, and build brand equity."
      />

      {/* 2. Why Partner — Value Props */}
      <section className="py-16 md:py-24">
        <div
          className="mx-auto px-4 sm:px-6 lg:px-8"
          style={{ maxWidth: 1280 }}
        >
          <SectionLabel className="mb-4 text-center">WHY PARTNER</SectionLabel>
          <h2
            className="font-display font-medium text-bicta-cream text-center mb-12"
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              lineHeight: 0.95,
              letterSpacing: "-0.01em",
            }}
          >
            Partnership That Delivers
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {valueProps.map((prop) => (
              <div
                key={prop.title}
                className="bg-bicta-surface border border-bicta-border rounded-xl p-8 hover:border-bicta-border-hover transition-colors duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-bicta-gold/10 border border-bicta-gold/20 flex items-center justify-center mb-5">
                  <prop.icon size={22} className="text-bicta-gold" />
                </div>
                <h3 className="font-display font-medium text-bicta-cream text-lg mb-3">
                  {prop.title}
                </h3>
                <p className="font-body text-sm text-bicta-muted leading-relaxed">
                  {prop.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: 1280 }}>
        <div className="h-px bg-bicta-border" />
      </div>

      {/* 3. Partnership Tiers */}
      <section className="py-16 md:py-24">
        <div
          className="mx-auto px-4 sm:px-6 lg:px-8"
          style={{ maxWidth: 1280 }}
        >
          <SectionLabel className="mb-4 text-center">
            PARTNERSHIP TIERS
          </SectionLabel>
          <h2
            className="font-display font-medium text-bicta-cream text-center mb-12"
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              lineHeight: 0.95,
              letterSpacing: "-0.01em",
            }}
          >
            Choose Your Level
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tiers.map((tier, i) => (
              <div
                key={tier.name}
                className="bg-bicta-surface border border-bicta-border rounded-xl p-8 hover:border-bicta-border-hover transition-all duration-300 flex flex-col"
              >
                <h3 className="font-display font-medium text-bicta-gold text-xl mb-2">
                  {tier.name}
                </h3>
                <p className="font-body text-sm text-bicta-muted mb-6">
                  {tier.description}
                </p>
                <ul className="space-y-3 mb-8 flex-1">
                  {tier.benefits.map((benefit) => (
                    <li
                      key={benefit}
                      className="flex items-start gap-2 text-sm text-bicta-muted font-body"
                    >
                      <span className="text-bicta-gold mt-0.5 shrink-0">
                        ✓
                      </span>
                      {benefit}
                    </li>
                  ))}
                </ul>
                <a
                  href="#inquiry"
                  className="block w-full text-center px-4 py-3 border border-bicta-gold text-bicta-gold font-body font-medium text-sm uppercase tracking-wider hover:bg-bicta-gold hover:text-bicta-void transition-all"
                >
                  Get in Touch
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: 1280 }}>
        <div className="h-px bg-bicta-border" />
      </div>

      {/* 4. Inquiry Form */}
      <section id="inquiry" className="py-16 md:py-24">
        <div
          className="mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16"
          style={{ maxWidth: 1280 }}
        >
          <div>
            <SectionLabel className="mb-4">GET IN TOUCH</SectionLabel>
            <h2
              className="font-display font-medium text-bicta-cream mb-4"
              style={{
                fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
                lineHeight: 1.1,
              }}
            >
              Start the Conversation
            </h2>
            <p className="font-body text-bicta-muted leading-relaxed mb-8">
              Tell us about your organization and partnership goals. Our team
              will get back to you within 48 hours to explore how we can work
              together.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-bicta-gold/10 flex items-center justify-center">
                  <span className="text-bicta-gold text-xs">✓</span>
                </div>
                <span className="font-body text-sm text-bicta-muted">
                  Response within 48 hours
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-bicta-gold/10 flex items-center justify-center">
                  <span className="text-bicta-gold text-xs">✓</span>
                </div>
                <span className="font-body text-sm text-bicta-muted">
                  Customized partnership proposals
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-bicta-gold/10 flex items-center justify-center">
                  <span className="text-bicta-gold text-xs">✓</span>
                </div>
                <span className="font-body text-sm text-bicta-muted">
                  Dedicated relationship manager
                </span>
              </div>
            </div>
          </div>

          <div className="bg-bicta-surface border border-bicta-border rounded-xl p-6 md:p-8">
            <PartnerInquiryForm />
          </div>
        </div>
      </section>

      {/* 5. Featured Partners Logo Wall */}
      {partners.length > 0 && (
        <section className="pb-16">
          <div
            className="mx-auto px-4 sm:px-6 lg:px-8"
            style={{ maxWidth: 1280 }}
          >
            <SectionLabel className="mb-6 text-center">
              OUR PARTNERS
            </SectionLabel>
            <LogoWall partners={partners} variant="compact" />
          </div>
        </section>
      )}

      {/* 6. Bottom CTA */}
      <CTASection
        headline="Already a partner?"
        subtext="Connect with your relationship manager for exclusive updates and opportunities."
        primaryCta={{ label: "Contact Support", href: "mailto:partners@bicta.org", external: true }}
        variant="dark"
      />
    </div>
  );
}
