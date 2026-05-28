import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenis } from '@/hooks/useLenis';
import Navigation from '@/sections/Navigation';
import Hero from '@/sections/Hero';
import ProgramsOverview from '@/sections/ProgramsOverview';
import ImpactMetrics from '@/sections/ImpactMetrics';
import AboutPhilosophy from '@/sections/AboutPhilosophy';
import FeaturedAlumni from '@/sections/FeaturedAlumni';
import VisionCTA from '@/sections/VisionCTA';
import AdviserPanel from '@/sections/AdviserPanel';
import Contact from '@/sections/Contact';
import Footer from '@/sections/Footer';

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  const [loaded, setLoaded] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  useLenis();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (loaderRef.current) {
        gsap.to(loaderRef.current, {
          opacity: 0,
          duration: 0.5,
          ease: 'power2.out',
          onComplete: () => setLoaded(true),
        });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleNavigate = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <>
      {!loaded && (
        <div ref={loaderRef} className="fixed inset-0 z-[100] bg-[#0a0a0a] flex items-center justify-center">
          <div className="flex items-center gap-2">
            <span className="font-display font-medium text-[#faf8f3] text-2xl tracking-tight">BICTA</span>
            <span className="w-px h-5 bg-[#c9a84c]" />
            <span className="font-body font-medium text-[0.6875rem] uppercase tracking-[0.15em] text-[#c9a84c]">ELITE</span>
          </div>
        </div>
      )}
      <Navigation onNavigate={handleNavigate} />
      <div>
        <Hero onNavigate={handleNavigate} />
        <ProgramsOverview />
        <ImpactMetrics />
        <AboutPhilosophy />
        <FeaturedAlumni />
        <VisionCTA onNavigate={handleNavigate} />
        <AdviserPanel />
        <Contact />
        <Footer />
      </div>
    </>
  );
}
