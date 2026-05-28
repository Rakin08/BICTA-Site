import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProgramBySlug, getPrograms } from "@/lib/api";
import PageHero from "@/components/layout/PageHero";
import SectionLabel from "@/components/ui/SectionLabel";
import CTASection from "@/components/CTASection";
import Image from "next/image";

export const revalidate = 3600; // 1 hour

export async function generateStaticParams() {
  try {
    const programs = await getPrograms();
    return programs.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const program = await getProgramBySlug(params.slug);
  if (!program) return { title: "Program Not Found" };

  return {
    title: program.title,
    description: program.summary || `${program.title} — BICTA program`,
  };
}

export default async function ProgramDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const program = await getProgramBySlug(params.slug);
  if (!program) notFound();

  return (
    <div className="min-h-screen bg-bicta-void">
      {/* Hero */}
      <PageHero
        badge={program.category}
        headline={program.title}
        subtext={program.summary || undefined}
      />

      {/* Content */}
      <section className="py-12 md:py-16">
        <div
          className="mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8"
          style={{ maxWidth: 1280 }}
        >
          {/* Main Content */}
          <div>
            {/* Image */}
            {program.imageUrl && (
              <div className="relative aspect-video rounded-xl overflow-hidden mb-8 border border-bicta-border">
                <Image
                  src={program.imageUrl}
                  alt={program.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  priority
                />
              </div>
            )}

            {/* Description */}
            {program.description && (
              <div className="mb-8">
                <SectionLabel className="mb-3">ABOUT THIS PROGRAM</SectionLabel>
                <div
                  className="prose prose-invert max-w-none font-body text-bicta-muted leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: program.description }}
                />
              </div>
            )}

            {/* Curriculum */}
            {program.curriculum && (
              <div className="mb-8">
                <SectionLabel className="mb-3">CURRICULUM</SectionLabel>
                <div
                  className="prose prose-invert max-w-none font-body text-bicta-muted leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: program.curriculum }}
                />
              </div>
            )}

            {/* Duration & Price */}
            <div className="flex flex-wrap gap-4">
              {program.duration && (
                <div className="bg-bicta-surface border border-bicta-border rounded-lg px-4 py-3">
                  <span className="text-[0.6875rem] uppercase tracking-wider text-bicta-subtle font-body block mb-0.5">
                    Duration
                  </span>
                  <span className="font-body text-sm text-bicta-cream">
                    {program.duration}
                  </span>
                </div>
              )}
              {program.price && (
                <div className="bg-bicta-surface border border-bicta-border rounded-lg px-4 py-3">
                  <span className="text-[0.6875rem] uppercase tracking-wider text-bicta-subtle font-body block mb-0.5">
                    Investment
                  </span>
                  <span className="font-body text-sm text-bicta-cream">
                    {program.price}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="bg-bicta-surface border border-bicta-border rounded-xl p-6 space-y-4">
              <h3 className="font-body font-medium text-sm uppercase tracking-wider text-bicta-gold mb-4">
                Program Details
              </h3>

              {program.duration && (
                <div>
                  <span className="text-[0.6875rem] uppercase tracking-wider text-bicta-subtle font-body block mb-0.5">
                    Duration
                  </span>
                  <span className="font-body text-sm text-bicta-cream">
                    {program.duration}
                  </span>
                </div>
              )}

              {program.price && (
                <div>
                  <span className="text-[0.6875rem] uppercase tracking-wider text-bicta-subtle font-body block mb-0.5">
                    Price
                  </span>
                  <span className="font-body text-sm text-bicta-cream">
                    {program.price}
                  </span>
                </div>
              )}

              <div>
                <span className="text-[0.6875rem] uppercase tracking-wider text-bicta-subtle font-body block mb-0.5">
                  Category
                </span>
                <span className="font-body text-sm text-bicta-cream">
                  {program.category}
                </span>
              </div>

              <hr className="border-bicta-border" />

              <a
                href="/events"
                className="block w-full text-center px-4 py-3 bg-bicta-gold text-bicta-void font-body font-medium text-sm uppercase tracking-wider hover:scale-[1.01] hover:shadow-cta-glow transition-all"
              >
                View Related Events
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        headline="Ready to join?"
        subtext="Explore upcoming events related to this program and secure your spot."
        primaryCta={{ label: "Explore Events", href: "/events" }}
        secondaryCta={{ label: "Contact Us", href: "/contact" }}
        variant="gold-border"
      />
    </div>
  );
}
