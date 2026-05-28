import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { trpc } from '@/providers/trpc';
import { Linkedin, Twitter, Globe, Award, Users, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface Adviser {
  id: number;
  name: string;
  title: string;
  company: string | null;
  bio: string | null;
  expertise: string | null;
  imageUrl: string | null;
  linkedInUrl: string | null;
  twitterUrl: string | null;
  websiteUrl: string | null;
  featured: boolean | null;
  displayOrder: number | null;
}

const fallbackAdvisers: Adviser[] = [
  {
    id: 1, name: 'Dr. Farhan Hussain', title: 'Chief Strategy Advisor', company: 'Former VP at Google APAC',
    bio: '20+ years in tech strategy, helped scale 3 unicorn startups across Southeast Asia.',
    expertise: JSON.stringify(['Strategy', 'Growth', 'Venture Capital']),
    imageUrl: null, linkedInUrl: '#', twitterUrl: null, websiteUrl: null, featured: true, displayOrder: 1,
  },
  {
    id: 2, name: 'Nadia Rahman', title: 'Head of Engineering Mentorship', company: 'Principal Engineer at Meta',
    bio: 'Leading large-scale systems design with expertise in distributed architectures.',
    expertise: JSON.stringify(['Systems Design', 'AI/ML', 'Leadership']),
    imageUrl: null, linkedInUrl: '#', twitterUrl: null, websiteUrl: null, featured: true, displayOrder: 2,
  },
  {
    id: 3, name: 'Kamal Ahmed', title: 'Advisor on Product Innovation', company: 'CPO at Pathao',
    bio: 'Product-led growth expert with multiple exits and a passion for emerging markets.',
    expertise: JSON.stringify(['Product', 'Growth', 'UX']),
    imageUrl: null, linkedInUrl: '#', twitterUrl: null, websiteUrl: null, featured: true, displayOrder: 3,
  },
  {
    id: 4, name: 'Dr. Ayesha Siddiqa', title: 'Research Advisor', company: 'Professor at MIT',
    bio: 'Pioneering researcher in human-computer interaction and accessibility tech.',
    expertise: JSON.stringify(['Research', 'HCI', 'Accessibility']),
    imageUrl: null, linkedInUrl: '#', twitterUrl: null, websiteUrl: null, featured: true, displayOrder: 4,
  },
];

function parseExpertise(expertise: string | null): string[] {
  if (!expertise) return [];
  try {
    const parsed = JSON.parse(expertise);
    if (Array.isArray(parsed)) return parsed;
  } catch { /* not JSON */ }
  return expertise.split(',').map((s) => s.trim()).filter(Boolean);
}

export default function AdviserPanel() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const { data: dbAdvisers, isLoading } = trpc.adviser.list.useQuery(
    { featured: true, limit: 50 },
    { retry: false }
  );

  const advisers: Adviser[] = (dbAdvisers && dbAdvisers.length > 0)
    ? dbAdvisers as Adviser[]
    : fallbackAdvisers;

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headingRef.current) {
        const children = headingRef.current.children;
        gsap.from(Array.from(children), {
          y: 50,
          opacity: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        });
      }
      if (gridRef.current) {
        const cards = gridRef.current.children;
        gsap.from(Array.from(cards), {
          y: 60,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 85%',
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [advisers]);

  return (
    <section
      ref={sectionRef}
      id="advisers"
      className="relative bg-[#0a0a0a] overflow-hidden"
      style={{ padding: 'clamp(60px, 12vw, 160px) 0' }}
    >
      {/* Subtle background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: 600,
          height: 600,
          background: 'radial-gradient(circle, rgba(201,168,76,0.03) 0%, transparent 70%)',
        }}
      />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 clamp(1.5rem, 4vw, 3rem)' }}>
        {/* Header */}
        <div ref={headingRef} className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles size={14} className="text-[#c9a84c]" />
            <span className="font-body font-medium text-[0.6875rem] uppercase tracking-[0.2em] text-[#c9a84c]">
              Board of Advisors
            </span>
            <Sparkles size={14} className="text-[#c9a84c]" />
          </div>

          <h2
            className="font-display font-medium text-[#faf8f3] mb-5"
            style={{
              fontSize: 'clamp(2rem, 5vw, 4rem)',
              lineHeight: 0.95,
              letterSpacing: '-0.01em',
            }}
          >
            Guided by Visionaries
          </h2>

          <p
            className="font-body font-light text-[#8a8680] mx-auto"
            style={{ fontSize: '1rem', lineHeight: 1.7, maxWidth: 560 }}
          >
            Our advisory board comprises industry pioneers who shape the direction
            of BICTA Elite and mentor the next generation of leaders.
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-[#141414] border border-[rgba(201,168,76,0.06)] rounded-xl p-6 animate-pulse">
                <div className="w-20 h-20 rounded-full bg-[rgba(201,168,76,0.06)] mx-auto mb-4" />
                <div className="h-4 bg-[rgba(201,168,76,0.06)] rounded w-3/4 mx-auto mb-2" />
                <div className="h-3 bg-[rgba(201,168,76,0.06)] rounded w-1/2 mx-auto mb-3" />
                <div className="h-3 bg-[rgba(201,168,76,0.06)] rounded w-full mx-auto" />
              </div>
            ))}
          </div>
        )}

        {/* Adviser Grid */}
        {!isLoading && (
          <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {advisers.map((adviser) => {
              const expertise = parseExpertise(adviser.expertise);
              const isHovered = hoveredId === adviser.id;

              return (
                <div
                  key={adviser.id}
                  className="group relative bg-[#141414] border border-[rgba(201,168,76,0.08)] hover:border-[rgba(201,168,76,0.25)] rounded-xl overflow-hidden transition-all duration-500"
                  style={{
                    transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                    boxShadow: isHovered
                      ? '0 20px 40px rgba(0,0,0,0.4), 0 0 60px rgba(201,168,76,0.06)'
                      : '0 4px 12px rgba(0,0,0,0.2)',
                  }}
                  onMouseEnter={() => setHoveredId(adviser.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Top gold accent line */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[2px] transition-all duration-500"
                    style={{
                      background: 'linear-gradient(90deg, transparent, #c9a84c, transparent)',
                      opacity: isHovered ? 1 : 0.3,
                    }}
                  />

                  <div className="p-6 flex flex-col items-center text-center">
                    {/* Avatar */}
                    <div
                      className="relative w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-all duration-500"
                      style={{
                        background: isHovered
                          ? 'linear-gradient(135deg, rgba(201,168,76,0.2), rgba(201,168,76,0.05))'
                          : 'linear-gradient(135deg, rgba(201,168,76,0.1), rgba(201,168,76,0.02))',
                        border: `2px solid ${isHovered ? 'rgba(201,168,76,0.4)' : 'rgba(201,168,76,0.15)'}`,
                      }}
                    >
                      {adviser.imageUrl ? (
                        <img
                          src={adviser.imageUrl}
                          alt={adviser.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <Users size={28} className="text-[#c9a84c] opacity-60" />
                      )}
                      {/* Online indicator */}
                      <div
                        className="absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-[#141414]"
                        style={{ background: '#10b981' }}
                      />
                    </div>

                    {/* Name */}
                    <h3 className="font-display font-medium text-[#faf8f3] text-base mb-1 group-hover:text-[#e8d49a] transition-colors duration-300">
                      {adviser.name}
                    </h3>

                    {/* Title */}
                    <p className="text-xs text-[#c9a84c] font-medium uppercase tracking-wider mb-1">
                      {adviser.title}
                    </p>

                    {/* Company */}
                    {adviser.company && (
                      <p className="text-xs text-[#8a8680] mb-4">
                        {adviser.company}
                      </p>
                    )}

                    {/* Bio */}
                    {adviser.bio && (
                      <p className="text-xs text-[#8a8680] leading-relaxed mb-4 line-clamp-3">
                        {adviser.bio}
                      </p>
                    )}

                    {/* Expertise Tags */}
                    {expertise.length > 0 && (
                      <div className="flex flex-wrap justify-center gap-1.5 mb-4">
                        {expertise.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 text-[0.6rem] uppercase tracking-wider text-[#e8d49a] bg-[rgba(201,168,76,0.08)] border border-[rgba(201,168,76,0.12)] rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Social Links */}
                    <div className="flex items-center gap-3 mt-auto">
                      {adviser.linkedInUrl && (
                        <a
                          href={adviser.linkedInUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#8a8680] hover:text-[#c9a84c] transition-colors duration-200 p-1.5 rounded-md hover:bg-[rgba(201,168,76,0.08)]"
                        >
                          <Linkedin size={14} />
                        </a>
                      )}
                      {adviser.twitterUrl && (
                        <a
                          href={adviser.twitterUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#8a8680] hover:text-[#c9a84c] transition-colors duration-200 p-1.5 rounded-md hover:bg-[rgba(201,168,76,0.08)]"
                        >
                          <Twitter size={14} />
                        </a>
                      )}
                      {adviser.websiteUrl && (
                        <a
                          href={adviser.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#8a8680] hover:text-[#c9a84c] transition-colors duration-200 p-1.5 rounded-md hover:bg-[rgba(201,168,76,0.08)]"
                        >
                          <Globe size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div
            className="inline-flex items-center gap-3 px-6 py-3 bg-[#141414] border border-[rgba(201,168,76,0.12)] hover:border-[rgba(201,168,76,0.25)] rounded-xl transition-all duration-300 cursor-pointer group"
          >
            <Award size={16} className="text-[#c9a84c] group-hover:scale-110 transition-transform" />
            <span className="text-xs text-[#8a8680] group-hover:text-[#e0ddd5] transition-colors">
              Interested in joining our advisory board?
            </span>
            <a
              href="mailto:advisors@bicta.org"
              className="text-xs text-[#c9a84c] hover:text-[#e8d49a] font-medium uppercase tracking-wider transition-colors"
            >
              Apply Now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
