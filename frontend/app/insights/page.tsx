import { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import CTASection from "@/components/CTASection";

export const metadata: Metadata = {
  title: "Insights",
  description: "News, articles, and thought leadership from BICTA.",
};

export default function InsightsPage() {
  return (
    <div className="min-h-screen bg-bicta-void">
      <PageHero
        badge="Insights"
        headline="News & Thought Leadership"
        subtext="Stay updated with the latest from BICTA — event announcements, success stories, and industry perspectives."
      />

      <section className="py-20">
        <div
          className="mx-auto px-4 sm:px-6 lg:px-8 text-center"
          style={{ maxWidth: 640 }}
        >
          <div className="w-16 h-16 rounded-full bg-bicta-surface border border-bicta-border flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">📝</span>
          </div>
          <h2 className="font-display text-2xl text-bicta-cream mb-3">
            Coming Soon
          </h2>
          <p className="font-body text-sm text-bicta-muted leading-relaxed">
            Our editorial hub is under construction. Soon you&apos;ll find
            articles, event recaps, and thought leadership pieces from the BICTA
            community.
          </p>
        </div>
      </section>

      <CTASection
        headline="Have a story to share?"
        subtext="We're always looking for contributors from the Bangladesh tech community."
        primaryCta={{ label: "Contact Us", href: "/contact" }}
        variant="dark"
      />
    </div>
  );
}
