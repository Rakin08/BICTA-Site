import { Metadata } from "next";
import { getPrograms } from "@/lib/api";
import PageHero from "@/components/layout/PageHero";
import SectionLabel from "@/components/ui/SectionLabel";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Programs",
  description:
    "Explore BICTA's flagship programs — AI Olympiad, Datathon, workshops, and professional development initiatives.",
};

export default async function ProgramsPage() {
  const programs = (await getPrograms()) || [];

  return (
    <div className="min-h-screen bg-bicta-void">
      {/* Hero */}
      <PageHero
        badge="Programs"
        headline="Flagship Programs & Competitions"
        subtext="Discover initiatives designed to accelerate Bangladesh's journey toward becoming a global tech hub."
      />

      {/* Programs Grid */}
      <section className="py-16 md:py-24">
        <div
          className="mx-auto px-4 sm:px-6 lg:px-8"
          style={{ maxWidth: 1280 }}
        >
          <SectionLabel className="mb-4">WHAT WE OFFER</SectionLabel>
          <h2
            className="font-display font-medium text-bicta-cream mb-12"
            style={{
              fontSize: "clamp(2rem, 5vw, 4rem)",
              lineHeight: 0.95,
              letterSpacing: "-0.01em",
            }}
          >
            Where Ambition Meets Mastery
          </h2>

          {programs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {programs.map((program, i) => (
                <Link
                  href={`/programs/${program.slug}`}
                  key={program.id}
                  className={cn(
                    "group relative bg-bicta-raised overflow-hidden cursor-pointer transition-shadow duration-500 hover:shadow-card-hover block"
                  )}
                  style={{
                    transform: i === 1 ? "translateY(40px)" : undefined,
                  }}
                >
                  <div
                    className="relative overflow-hidden"
                    style={{ aspectRatio: "3/4", maxHeight: "65%" }}
                  >
                    {program.imageUrl ? (
                      <Image
                        src={program.imageUrl}
                        alt={program.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="w-full h-full bg-bicta-surface flex items-center justify-center">
                        <span className="font-display text-bicta-subtle/30 text-4xl">
                          {program.title.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-bicta-gold" />
                  </div>
                  <div className="p-6">
                    <div className="font-body font-medium text-[0.6875rem] uppercase tracking-[0.15em] text-bicta-subtle mb-2">
                      {program.category}
                    </div>
                    <h3 className="font-display font-normal text-[1.5rem] text-bicta-cream mb-2 group-hover:text-bicta-gold-lt transition-colors">
                      {program.title}
                    </h3>
                    {program.summary && (
                      <p
                        className="font-body font-normal text-[0.875rem] text-bicta-muted line-clamp-2 mb-4"
                        style={{ lineHeight: 1.6 }}
                      >
                        {program.summary}
                      </p>
                    )}
                    <span className="inline-flex items-center gap-2 font-body font-medium text-[0.8125rem] uppercase text-bicta-gold">
                      Learn More
                      <ArrowRight
                        size={16}
                        className="transition-transform duration-200 group-hover:translate-x-1"
                      />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-full bg-bicta-surface border border-bicta-border flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-bicta-subtle">📋</span>
              </div>
              <h3 className="font-display text-xl text-bicta-cream mb-2">
                Programs coming soon
              </h3>
              <p className="text-sm text-bicta-subtle font-body max-w-md mx-auto">
                We&apos;re preparing exciting programs for the upcoming season.
                Check back soon or subscribe to our newsletter.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <div
        className="mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24"
        style={{ maxWidth: 1280 }}
      >
        <div className="bg-bicta-surface border border-bicta-border rounded-xl p-8 md:p-12 text-center">
          <h3 className="font-display font-medium text-bicta-cream text-xl mb-3">
            Want to propose a program?
          </h3>
          <p className="font-body text-sm text-bicta-muted mb-6 max-w-lg mx-auto">
            We&apos;re always open to collaborations. If you have an idea for a
            workshop, competition, or initiative, we&apos;d love to hear from
            you.
          </p>
          <a
            href="/partners"
            className="inline-flex items-center gap-2 px-6 py-3 bg-bicta-gold text-bicta-void font-body font-medium text-sm uppercase tracking-[0.08em] hover:scale-[1.02] hover:shadow-cta-glow transition-all"
          >
            Partner With Us
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}
