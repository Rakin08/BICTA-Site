"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import SectionLabel from "@/components/ui/SectionLabel";
import type { ProgramItem } from "@/types";

gsap.registerPlugin(ScrollTrigger);

const fallbackPrograms: ProgramItem[] = [
  {
    id: 1,
    category: "Professional Training",
    slug: "executive-mastery",
    title: "Executive Mastery",
    summary:
      "Intensive programs designed for senior professionals seeking to elevate their leadership capabilities.",
    imageUrl: "/images/program-training.jpg",
    featured: true,
  },
  {
    id: 2,
    category: "Corporate Innovation",
    slug: "innovation-labs",
    title: "Innovation Labs",
    summary:
      "Immersive workshops that drive digital transformation and foster cutting-edge thinking.",
    imageUrl: "/images/program-innovation.jpg",
    featured: true,
  },
  {
    id: 3,
    category: "Leadership Summit",
    slug: "annual-summit",
    title: "Annual Summit",
    summary:
      "A gathering of visionaries, thought leaders, and change-makers shaping the future.",
    imageUrl: "/images/program-summit.jpg",
    featured: true,
  },
];

interface ProgramsOverviewProps {
  programs?: ProgramItem[];
}

export default function ProgramsOverview({
  programs,
}: ProgramsOverviewProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const displayPrograms =
    programs && programs.length > 0 ? programs : fallbackPrograms;

  useEffect(() => {
    const cards = cardsRef.current.filter(Boolean);
    if (cards.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.from(cards, {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [displayPrograms]);

  return (
    <section
      ref={sectionRef}
      id="programs"
      className="relative bg-bicta-void"
      style={{ padding: "clamp(60px, 10vw, 120px) 0" }}
    >
      <div
        className="mx-auto px-4 sm:px-6 lg:px-8"
        style={{ maxWidth: 1280 }}
      >
        <SectionLabel className="mb-4">WHAT WE OFFER</SectionLabel>
        <h2
          className="font-display font-medium text-bicta-cream mb-16"
          style={{
            fontSize: "clamp(2rem, 5vw, 4rem)",
            lineHeight: 0.95,
            letterSpacing: "-0.01em",
          }}
        >
          Where Ambition Meets Mastery
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayPrograms.map((program, i) => (
            <Link
              href={`/programs/${program.slug}`}
              key={program.id}
              ref={(el) => {
                cardsRef.current[i] = el;
              }}
              className="group relative bg-bicta-raised overflow-hidden cursor-pointer transition-shadow duration-500 hover:shadow-card-hover block"
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
                <h3 className="font-display font-normal text-[1.5rem] text-bicta-cream mb-2">
                  {program.title}
                </h3>
                <p
                  className="font-body font-normal text-[0.875rem] text-bicta-muted line-clamp-2 mb-4"
                  style={{ lineHeight: 1.6 }}
                >
                  {program.summary}
                </p>
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
      </div>
    </section>
  );
}
