"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionLabel from "@/components/ui/SectionLabel";
import type { ImpactMetricItem } from "@/types";

gsap.registerPlugin(ScrollTrigger);

interface ImpactMetricsSectionProps {
  metrics: ImpactMetricItem[];
}

function CountUpNumber({
  value,
  suffix,
  inView,
}: {
  value: number;
  suffix?: string | null;
  inView: boolean;
}) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!inView) return;

    const obj = { val: 0 };
    const tween = gsap.to(obj, {
      val: value,
      duration: 2,
      ease: "power2.out",
      onUpdate: () => {
        setDisplay(Math.round(obj.val));
      },
    });

    return () => {
      tween.kill();
    };
  }, [inView, value]);

  return (
    <span ref={ref} className="font-mono">
      {display.toLocaleString()}
      {suffix && <span className="text-bicta-gold ml-0.5">{suffix}</span>}
    </span>
  );
}

export default function ImpactMetricsSection({
  metrics,
}: ImpactMetricsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Entrance animation for the grid
      if (gridRef.current) {
        const cards = gridRef.current.children;
        gsap.from(Array.from(cards), {
          y: 50,
          opacity: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        });
      }

      // Trigger count-up when in view
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 75%",
        once: true,
        onEnter: () => setInView(true),
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [metrics]);

  if (!metrics || metrics.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-16 md:py-24 bg-bicta-void"
    >
      {/* Section glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: 600,
          height: 600,
          background:
            "radial-gradient(circle, rgba(201,168,76,0.03) 0%, transparent 70%)",
        }}
      />

      <div
        className="relative mx-auto px-4 sm:px-6 lg:px-8"
        style={{ maxWidth: 1280 }}
      >
        <SectionLabel className="mb-4">IMPACT AT A GLANCE</SectionLabel>
        <h2
          className="font-display font-medium text-bicta-cream mb-12"
          style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            lineHeight: 0.95,
            letterSpacing: "-0.01em",
          }}
        >
          Numbers That Matter
        </h2>

        <div
          ref={gridRef}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {metrics.map((metric) => (
            <div
              key={metric.id}
              className="bg-bicta-surface border border-bicta-border rounded-xl p-6 md:p-8 text-center hover:border-bicta-border-hover transition-colors duration-300"
            >
              <div
                className="font-mono text-4xl md:text-5xl font-medium text-bicta-cream mb-2"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                <CountUpNumber
                  value={metric.value}
                  suffix={metric.suffix}
                  inView={inView}
                />
              </div>
              <div className="font-body text-sm text-bicta-subtle uppercase tracking-wider">
                {metric.label}
              </div>
              {metric.description && (
                <p className="mt-2 text-xs text-bicta-muted font-body leading-relaxed">
                  {metric.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
