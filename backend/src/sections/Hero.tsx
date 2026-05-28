import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface HeroProps {
  onNavigate: (id: string) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const titleLine1Ref = useRef<HTMLDivElement>(null);
  const titleLine2Ref = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.3 });

    tl.to(labelRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power3.out',
    })
    .to(titleLine1Ref.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
    }, '-=0.3')
    .to(titleLine2Ref.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
    }, '-=0.68')
    .to(subtitleRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
    }, '-=0.4')
    .to(ctaRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
    }, '-=0.5')
    .to(scrollIndicatorRef.current, {
      opacity: 1,
      duration: 0.5,
    }, '-=0.3');

    // Fade out scroll indicator on first scroll
    const handleScroll = () => {
      if (window.scrollY > 50 && scrollIndicatorRef.current) {
        gsap.to(scrollIndicatorRef.current, { opacity: 0, duration: 0.3 });
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      tl.kill();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex flex-col items-center justify-center"
      style={{
        minHeight: '100dvh',
        background: 'radial-gradient(ellipse at 50% 40%, #1a1a1a 0%, #0a0a0a 70%)',
      }}
    >
      {/* Label */}
      <div
        ref={labelRef}
        className="font-body font-medium text-[0.6875rem] uppercase tracking-[0.15em] text-[#c9a84c] mb-6 opacity-0"
        style={{ transform: 'translateY(20px)' }}
      >
        #1 Professional Development Platform in Bangladesh
      </div>

      {/* Title */}
      <h1 className="text-center" style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', lineHeight: 0.9, letterSpacing: '-0.02em' }}>
        <div
          ref={titleLine1Ref}
          className="font-display font-normal text-[#faf8f3] opacity-0"
          style={{ transform: 'translateY(40px)' }}
        >
          Excellence
        </div>
        <div
          ref={titleLine2Ref}
          className="font-display font-normal text-[#faf8f3] opacity-0"
          style={{ transform: 'translateY(40px)' }}
        >
          in Action
        </div>
      </h1>

      {/* Subtitle */}
      <p
        ref={subtitleRef}
        className="font-body font-light text-center text-[#e0ddd5] mt-8 opacity-0"
        style={{
          fontSize: 'clamp(1rem, 2vw, 1.25rem)',
          lineHeight: 1.7,
          maxWidth: 640,
          transform: 'translateY(20px)',
        }}
      >
        Elevating Bangladesh's tech ecosystem through world-class professional development, elite education, and meaningful connections.
      </p>

      {/* CTAs */}
      <div
        ref={ctaRef}
        className="flex flex-col sm:flex-row items-center gap-4 mt-10 opacity-0"
        style={{ transform: 'translateY(20px)' }}
      >
        <button
          onClick={() => onNavigate('programs')}
          className="font-body font-medium text-[0.875rem] uppercase tracking-[0.08em] bg-[#c9a84c] text-[#0a0a0a] px-8 py-3.5 transition-all duration-250 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(201,168,76,0.3)]"
        >
          Explore Programs
        </button>
        <button
          onClick={() => onNavigate('vision')}
          className="font-body font-medium text-[0.875rem] uppercase tracking-[0.08em] text-[#c9a84c] border border-[#c9a84c] px-8 py-3.5 transition-all duration-250 hover:text-[#e8d49a] hover:border-[#e8d49a]"
        >
          Our Vision
        </button>
      </div>

      {/* Scroll Indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0"
      >
        <div className="w-px h-10 bg-[#c9a84c] relative overflow-hidden">
          <div
            className="absolute top-0 left-0 w-full h-2 bg-[#e8d49a]"
            style={{
              animation: 'scrollPulse 1.5s ease-in-out infinite',
            }}
          />
        </div>
        <style>{`
          @keyframes scrollPulse {
            0% { transform: translateY(-8px); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateY(40px); opacity: 0; }
          }
        `}</style>
      </div>
    </section>
  );
}
