import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEventBySlug, getAllEventSlugs, getEvents } from "@/lib/api";
import PageHero from "@/components/layout/PageHero";
import EventQuickRail from "@/components/EventQuickRail";
import EventCard from "@/components/EventCard";
import FAQAccordion from "@/components/FAQAccordion";
import PeopleCard from "@/components/PeopleCard";
import SectionLabel from "@/components/ui/SectionLabel";
import type { EventDetail } from "@/types";

// ─── ISR ─────────────────────────────────────────────────────

export const revalidate = 300; // 5 minutes

export async function generateStaticParams() {
  try {
    const slugs = await getAllEventSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

// ─── Metadata ────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const event = await getEventBySlug(params.slug);
  if (!event) {
    return { title: "Event Not Found" };
  }

  return {
    title: event.metaTitle || event.title,
    description:
      event.metaDescription || event.summary || "BICTA event details",
    openGraph: event.coverImageUrl
      ? { images: [{ url: event.coverImageUrl }] }
      : undefined,
  };
}

// ─── JSON-LD Helper ──────────────────────────────────────────

function generateEventJsonLd(event: EventDetail): Record<string, unknown> {
  const attendanceModeMap: Record<string, string> = {
    online: "https://schema.org/OnlineEventAttendanceMode",
    offline: "https://schema.org/OfflineEventAttendanceMode",
    hybrid: "https://schema.org/MixedEventAttendanceMode",
  };

  const statusMap: Record<string, string> = {
    scheduled: "https://schema.org/EventScheduled",
    live: "https://schema.org/EventInProgress",
    completed: "https://schema.org/EventEnded",
    cancelled: "https://schema.org/EventCancelled",
    postponed: "https://schema.org/EventPostponed",
    registration_open: "https://schema.org/EventScheduled",
    registration_closed: "https://schema.org/EventScheduled",
    draft: "https://schema.org/EventScheduled",
  };

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.summary || undefined,
    startDate: event.startDate || undefined,
    endDate: event.endDate || undefined,
    eventStatus: statusMap[event.status || "draft"],
    eventAttendanceMode: attendanceModeMap[event.mode || "offline"],
    location:
      event.venue && event.mode !== "online"
        ? {
            "@type": "Place",
            name: event.venue,
            address: event.venueAddress
              ? { "@type": "PostalAddress", streetAddress: event.venueAddress }
              : undefined,
          }
        : event.mode === "online"
          ? {
              "@type": "VirtualLocation",
              url: event.registrationUrl || undefined,
            }
          : undefined,
    organizer: {
      "@type": "Organization",
      name: "BICTA",
      url: "https://bicta.org",
    },
    url: `https://bicta.org/events/${event.slug}`,
    image: event.coverImageUrl || event.imageUrl || undefined,
    offers: event.registrationUrl
      ? {
          "@type": "Offer",
          url: event.registrationUrl,
          availability:
            event.status === "registration_open"
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
        }
      : undefined,
  };
}

// ─── Agenda Parser ───────────────────────────────────────────

function parseAgenda(agendaJson: string | null): Array<{
  time: string;
  title: string;
  speaker?: string;
}> {
  if (!agendaJson) return [];
  try {
    const parsed = JSON.parse(agendaJson);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch {
    return [];
  }
}

function parseFaq(faqJson: string | null): Array<{
  question: string;
  answer: string;
}> {
  if (!faqJson) return [];
  try {
    const parsed = JSON.parse(faqJson);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch {
    return [];
  }
}

// ─── Page ────────────────────────────────────────────────────

export default async function EventDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const event = await getEventBySlug(params.slug);
  if (!event) notFound();

  const jsonLd = generateEventJsonLd(event);
  const agenda = parseAgenda(event.agenda);
  const faq = parseFaq(event.faq);
  const hasSpeakers = event.speakers && event.speakers.length > 0;

  // Fetch related events (same type, excluding current)
  let relatedEvents: EventDetail[] = [];
  try {
    const result = await getEvents({
      eventType: event.eventType || undefined,
      published: true,
      limit: 3,
    });
    relatedEvents = result.events.filter((e) => e.id !== event.id).slice(0, 3);
  } catch {
    // Non-critical
  }

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-bicta-void">
        {/* Hero */}
        <PageHero
          statusBadge={event.status || "draft"}
          headline={event.title}
          subtext={event.summary || undefined}
          primaryCta={
            event.status === "registration_open" && event.registrationUrl
              ? { label: "Register Now", href: event.registrationUrl, external: true }
              : undefined
          }
        />

        {/* Two-column layout */}
        <section className="py-12 md:py-16">
          <div
            className="mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8"
            style={{ maxWidth: 1280 }}
          >
            {/* LEFT COLUMN */}
            <div>
              {/* Tabs navigation — Overview · Agenda · FAQ */}
              {(event.body || agenda.length > 0 || faq.length > 0) && (
                <div className="flex gap-1 mb-6 bg-bicta-surface p-1 rounded-lg border border-bicta-border">
                  {event.body && (
                    <a
                      href="#overview"
                      className="flex-1 px-4 py-2 text-xs font-medium uppercase tracking-wider rounded-md text-center bg-bicta-gold/10 text-bicta-gold border border-bicta-gold/15"
                    >
                      Overview
                    </a>
                  )}
                  {agenda.length > 0 && (
                    <a
                      href="#agenda"
                      className="flex-1 px-4 py-2 text-xs font-medium uppercase tracking-wider rounded-md text-center text-bicta-subtle hover:text-bicta-cream"
                    >
                      Agenda
                    </a>
                  )}
                  {faq.length > 0 && (
                    <a
                      href="#faq"
                      className="flex-1 px-4 py-2 text-xs font-medium uppercase tracking-wider rounded-md text-center text-bicta-subtle hover:text-bicta-cream"
                    >
                      FAQ
                    </a>
                  )}
                </div>
              )}

              {/* Overview Tab */}
              {event.body && (
                <div id="overview" className="mb-10">
                  <SectionLabel className="mb-3">OVERVIEW</SectionLabel>
                  <div
                    className="prose prose-invert max-w-none font-body text-bicta-muted leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: event.body }}
                  />
                </div>
              )}

              {/* Agenda Tab */}
              {agenda.length > 0 && (
                <div id="agenda" className="mb-10">
                  <SectionLabel className="mb-3">AGENDA</SectionLabel>
                  <div className="space-y-3">
                    {agenda.map((item, i) => (
                      <div
                        key={i}
                        className="flex gap-4 p-4 bg-bicta-surface border border-bicta-border rounded-lg hover:border-bicta-border-hover transition-colors"
                      >
                        <div className="shrink-0">
                          <span className="font-mono text-sm text-bicta-gold">
                            {item.time}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-body font-medium text-bicta-cream text-sm">
                            {item.title}
                          </h4>
                          {item.speaker && (
                            <p className="text-xs text-bicta-subtle mt-0.5">
                              {item.speaker}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FAQ Tab */}
              {faq.length > 0 && (
                <div id="faq" className="mb-10">
                  <SectionLabel className="mb-3">FREQUENTLY ASKED</SectionLabel>
                  <FAQAccordion items={faq} />
                </div>
              )}

              {/* Speakers Section */}
              {hasSpeakers && event.speakers && (
                <div className="mb-10">
                  <SectionLabel className="mb-3">MEET THE PANEL</SectionLabel>
                  <h2 className="font-display font-medium text-bicta-cream text-2xl mb-6">
                    Speakers & Judges
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {event.speakers.map((speaker) => (
                      <PeopleCard
                        key={speaker.id}
                        name={speaker.name}
                        title={speaker.title || "Speaker"}
                        company={speaker.company}
                        image={null}
                        linkedInUrl={speaker.linkedInUrl}
                        variant="advisor"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN — Sticky Rail */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <EventQuickRail event={event} />
            </div>
          </div>
        </section>

        {/* Related Events */}
        {relatedEvents.length > 0 && (
          <section className="pb-16">
            <div
              className="mx-auto px-4 sm:px-6 lg:px-8"
              style={{ maxWidth: 1280 }}
            >
              <SectionLabel className="mb-3">YOU MAY ALSO LIKE</SectionLabel>
              <h2 className="font-display font-medium text-bicta-cream text-2xl mb-8">
                Related Events
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedEvents.map((evt) => (
                  <EventCard key={evt.id} event={evt} />
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
