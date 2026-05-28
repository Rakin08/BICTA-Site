import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import StarFieldCanvas from '../components/StarField';

gsap.registerPlugin(ScrollTrigger);

export default function AboutPhilosophy() {
  const sectionRef = useRef<HTMLElement>(null);
  const textContentRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const textEls = textContentRef.current?.children;
      if (textEls) {
        gsap.from(Array.from(textEls), {
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        });
      }

      if (canvasContainerRef.current) {
        gsap.from(canvasContainerRef.current, {
          scale: 0.95,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative bg-[#1a1a1a]"
      style={{ padding: 'clamp(60px, 12vw, 160px) 0' }}
    >
      <div
        className="mx-auto grid grid-cols-1 lg:grid-cols-[55%_45%] gap-12 lg:gap-16 items-center"
        style={{ maxWidth: 1280, padding: '0 clamp(1.5rem, 4vw, 3rem)' }}
      >
        {/* Text Content */}
        <div ref={textContentRef}>
          <div className="font-body font-medium text-[0.6875rem] uppercase tracking-[0.15em] text-[#8a8680] mb-4">
            OUR PHILOSOPHY
          </div>

          <h2
            className="font-display font-medium text-[#faf8f3] mb-8"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: 0.95, letterSpacing: '-0.01em' }}
          >
            We Build More Than Careers — We Build Legacies
          </h2>

          {/* Pull Quote */}
          <div className="flex gap-4 mb-8">
            <div className="w-0.5 bg-[#c9a84c] shrink-0 self-stretch" style={{ minHeight: 40 }} />
            <p
              className="font-display italic text-[#c9a84c]"
              style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', lineHeight: 1.35 }}
            >
              In a world of noise, mastery is the only signal that matters.
            </p>
          </div>

          {/* Body paragraphs */}
          <p className="font-body font-light text-[#e0ddd5] mb-6" style={{ fontSize: '1rem', lineHeight: 1.8 }}>
            BICTA Elite was founded on a singular belief: that Bangladesh's brightest minds deserve access to world-class professional development. In an era where technology reshapes industries overnight, the gap between potential and mastery has never been wider — and more urgent to close.
          </p>

          <p className="font-body font-light text-[#e0ddd5] mb-8" style={{ fontSize: '1rem', lineHeight: 1.8 }}>
            Our programs are not courses. They are transformations — designed by industry veterans, refined through real-world application, and delivered with an uncompromising commitment to excellence. Every graduate leaves not just with skills, but with a network, a vision, and a competitive edge.
          </p>

          {/* Founder */}
          <div className="flex items-center gap-4">
            <img
              src="/images/founder-portrait.jpg"
              alt="Founder"
              className="w-14 h-14 rounded-full object-cover"
              style={{ border: '2px solid rgba(201,168,76,0.4)' }}
            />
            <span className="font-display italic text-[#c9a84c] text-lg">
              — BICTA Elite
            </span>
          </div>
        </div>

        {/* Starfield Canvas */}
        <div ref={canvasContainerRef} className="order-first lg:order-last">
          <StarFieldCanvas />
        </div>
      </div>
    </section>
  );
}
