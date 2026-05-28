import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { trpc } from '@/providers/trpc';
import VerticalShuffleCarousel from '../components/ShuffleCarousel';

gsap.registerPlugin(ScrollTrigger);

const fallbackAlumni = [
  { name: 'Tahsin Rafi', role: 'Senior Product Manager', company: 'Pathao' },
  { name: 'Nabila Islam', role: 'Engineering Lead', company: 'bKash' },
  { name: 'Rafiq Hasan', role: 'CTO', company: 'Chaldal' },
  { name: 'Samira Akter', role: 'Director of AI', company: 'SSL Wireless' },
  { name: 'Tanvir Hossain', role: 'VP Engineering', company: 'Robi Axiata' },
  { name: 'Priya Saha', role: 'Principal Designer', company: 'Uber Bangladesh' },
];

export default function FeaturedAlumni() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);

  const { data: dbAlumni } = trpc.alumni.list.useQuery(
    { featured: true, limit: 6 },
    { retry: false }
  );

  const alumni = dbAlumni && dbAlumni.length > 0
    ? dbAlumni.map((a) => ({ name: a.name, role: a.role, company: a.company }))
    : fallbackAlumni;

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headingRef.current) {
        gsap.from(headingRef.current, {
          y: 40, opacity: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        });
      }
      if (carouselRef.current) {
        gsap.from(carouselRef.current, {
          y: 40, opacity: 0, duration: 0.8, delay: 0.2, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        });
      }
      if (quoteRef.current) {
        gsap.from(quoteRef.current, {
          y: 30, opacity: 0, duration: 0.8, delay: 0.4, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 60%' },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [alumni]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#0a0a0a]"
      style={{ padding: 'clamp(60px, 10vw, 120px) 0' }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 clamp(1.5rem, 4vw, 3rem)' }}>
        <div ref={headingRef}>
          <div className="font-body font-medium text-[0.6875rem] uppercase tracking-[0.15em] text-[#8a8680] mb-4">
            PROOF OF EXCELLENCE
          </div>
          <h2
            className="font-display font-medium text-[#faf8f3] mb-12"
            style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', lineHeight: 0.95, letterSpacing: '-0.01em' }}
          >
            Voices of Achievement
          </h2>
        </div>

        <div ref={carouselRef}>
          <VerticalShuffleCarousel items={alumni} />
        </div>

        <div ref={quoteRef} className="mt-16 text-center">
          <p
            className="font-display italic text-[#e0ddd5] mx-auto"
            style={{
              fontSize: 'clamp(1.25rem, 2vw, 1.75rem)',
              lineHeight: 1.5,
              maxWidth: 700,
            }}
          >
            "BICTA Elite didn't just advance my career — it transformed how I see my potential in the global tech landscape."
          </p>
        </div>
      </div>
    </section>
  );
}
