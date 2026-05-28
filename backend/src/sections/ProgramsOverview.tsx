import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { trpc } from '@/providers/trpc';

gsap.registerPlugin(ScrollTrigger);

const fallbackPrograms = [
  {
    category: 'Professional Training',
    name: 'Executive Mastery',
    summary: 'Intensive programs designed for senior professionals seeking to elevate their leadership capabilities.',
    imageUrl: '/images/program-training.jpg',
  },
  {
    category: 'Corporate Innovation',
    name: 'Innovation Labs',
    summary: 'Immersive workshops that drive digital transformation and foster cutting-edge thinking.',
    imageUrl: '/images/program-innovation.jpg',
  },
  {
    category: 'Leadership Summit',
    name: 'Annual Summit',
    summary: 'A gathering of visionaries, thought leaders, and change-makers shaping the future.',
    imageUrl: '/images/program-summit.jpg',
  },
];

export default function ProgramsOverview() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const { data: programs } = trpc.program.featured.useQuery(undefined, {
    retry: false,
  });

  const displayPrograms = programs && programs.length > 0
    ? programs.map((p) => ({
        category: p.category,
        name: p.title,
        summary: p.summary || '',
        imageUrl: p.imageUrl || '/images/program-training.jpg',
      }))
    : fallbackPrograms;

  useEffect(() => {
    const cards = cardsRef.current.filter(Boolean);
    if (cards.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.from(cards, {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [displayPrograms]);

  return (
    <section
      ref={sectionRef}
      id="programs"
      className="relative bg-[#0a0a0a]"
      style={{ padding: 'clamp(60px, 10vw, 120px) 0' }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 clamp(1.5rem, 4vw, 3rem)' }}>
        <div className="font-body font-medium text-[0.6875rem] uppercase tracking-[0.15em] text-[#8a8680] mb-4">
          WHAT WE OFFER
        </div>
        <h2
          className="font-display font-medium text-[#faf8f3] mb-16"
          style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', lineHeight: 0.95, letterSpacing: '-0.01em' }}
        >
          Where Ambition Meets Mastery
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayPrograms.map((program, i) => (
            <div
              key={program.name}
              ref={(el) => { cardsRef.current[i] = el; }}
              className="group relative bg-[#1a1a1a] overflow-hidden cursor-pointer transition-shadow duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
              style={{ transform: i === 1 ? 'translateY(40px)' : undefined }}
            >
              <div className="relative overflow-hidden" style={{ aspectRatio: '3/4', maxHeight: '65%' }}>
                <img
                  src={program.imageUrl}
                  alt={program.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute bottom-0 left-0 right-0 h-px bg-[#c9a84c]" />
              </div>
              <div className="p-6">
                <div className="font-body font-medium text-[0.6875rem] uppercase tracking-[0.15em] text-[#8a8680] mb-2">
                  {program.category}
                </div>
                <h3 className="font-display font-normal text-[1.5rem] text-[#faf8f3] mb-2">
                  {program.name}
                </h3>
                <p className="font-body font-normal text-[0.875rem] text-[#e0ddd5] line-clamp-2 mb-4" style={{ lineHeight: 1.6 }}>
                  {program.summary}
                </p>
                <span className="inline-flex items-center gap-2 font-body font-medium text-[0.8125rem] uppercase text-[#c9a84c] group/link">
                  Learn More
                  <svg className="w-4 h-4 transition-transform duration-200 group-hover/link:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
