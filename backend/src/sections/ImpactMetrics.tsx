import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { trpc } from '@/providers/trpc';

gsap.registerPlugin(ScrollTrigger);

const fallbackMetrics = [
  { value: 1000, suffix: '+', label: 'Graduates', description: 'Professionals who have completed BICTA Elite programs' },
  { value: 93, suffix: '%', label: 'Placement Rate', description: 'Graduates placed in senior roles within 6 months' },
  { value: 250, suffix: '+', label: 'Corporate Partners', description: 'Leading companies in the BICTA Elite network' },
  { value: 50, suffix: 'M+', label: 'BDT in Scholarships', description: 'Financial support awarded to deserving professionals' },
];

export default function ImpactMetrics() {
  const sectionRef = useRef<HTMLElement>(null);
  const numbersRef = useRef<(HTMLDivElement | null)[]>([]);
  const labelsRef = useRef<(HTMLDivElement | null)[]>([]);

  const { data: dbMetrics } = trpc.metrics.list.useQuery(undefined, { retry: false });

  const metrics = dbMetrics && dbMetrics.length > 0
    ? dbMetrics.map((m) => ({
        value: m.value,
        suffix: m.suffix || '',
        label: m.label,
        description: m.description || '',
      }))
    : fallbackMetrics;

  useEffect(() => {
    const ctx = gsap.context(() => {
      metrics.forEach((metric, i) => {
        const numEl = numbersRef.current[i];
        const labelEl = labelsRef.current[i];
        if (!numEl || !labelEl) return;

        const obj = { val: 0 };
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        });

        tl.to(obj, {
          val: metric.value,
          duration: 1.5,
          ease: 'power2.out',
          onUpdate: () => {
            const v = Math.round(obj.val);
            if (metric.value >= 1000) {
              numEl.textContent = v.toLocaleString() + metric.suffix;
            } else {
              numEl.textContent = v + metric.suffix;
            }
          },
        });

        tl.from(labelEl, {
          opacity: 0,
          y: 20,
          duration: 0.6,
          ease: 'power3.out',
        }, '-=0.8');
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [metrics]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#0a0a0a]"
      style={{
        padding: 'clamp(60px, 10vw, 120px) 0',
        borderTop: '1px solid rgba(201,168,76,0.2)',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 clamp(1.5rem, 4vw, 3rem)' }}>
        <div className="font-body font-medium text-[0.6875rem] uppercase tracking-[0.15em] text-[#8a8680] mb-4">
          THE NUMBERS
        </div>
        <h2
          className="font-display font-medium text-[#faf8f3] mb-16"
          style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', lineHeight: 0.95, letterSpacing: '-0.01em' }}
        >
          A Track Record of Transformation
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
          {metrics.map((metric, i) => (
            <div key={metric.label}>
              <div
                ref={(el) => { numbersRef.current[i] = el; }}
                className="font-mono font-normal text-[#c9a84c]"
                style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', lineHeight: 1, letterSpacing: '-0.03em' }}
              >
                0{metric.suffix}
              </div>
              <div ref={(el) => { labelsRef.current[i] = el; }}>
                <div className="font-body font-medium text-[0.875rem] uppercase tracking-[0.05em] text-[#faf8f3] mt-3">
                  {metric.label}
                </div>
                <div className="font-body font-normal text-[0.875rem] text-[#8a8680] mt-1" style={{ lineHeight: 1.6 }}>
                  {metric.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
