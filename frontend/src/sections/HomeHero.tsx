"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";
import ParticleCanvas from "@/components/ParticleCanvas";

interface HomeHeroProps {
  headline?: string;
  subcopy?: string;
  primaryCta?: string;
  secondaryCta?: string;
}

const FLOATING_EVENTS = [
  { tag: "🏆 Featured Competition", title: "AI Olympiad 2026 — National Finals", status: "Live Registration", statusColor: "#4ade80", date: "Jun 15" },
  { tag: "📊 Datathon Series", title: "National Data Science Challenge", status: "847 spots left", statusColor: "#f59e0b", date: "Jul 02" },
  { tag: "🌍 AI for SDG", title: "AI for Sustainable Bangladesh", status: "Applications open", statusColor: "#a78bfa", date: "Aug 10" },
];

export default function HomeHero({
  headline = "Where Elite Minds Shape Bangladesh's Digital Future",
  subcopy = "The nation's most exclusive platform connecting top universities, industry leaders, and AI pioneers through world-class competitions.",
  primaryCta = "Apply for Membership",
  secondaryCta = "Explore Programs",
}: HomeHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.2 });
    if (leftRef.current) {
      tl.fromTo(leftRef.current.children,
        { opacity: 0, y: 32 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: "power3.out" }
      );
    }
    if (rightRef.current) {
      tl.fromTo(Array.from(rightRef.current.children),
        { opacity: 0, x: 32 },
        { opacity: 1, x: 0, duration: 0.7, stagger: 0.1, ease: "power3.out" },
        "-=0.5"
      );
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        minHeight: "95vh",
        position: "relative",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        alignItems: "center",
        padding: "0 clamp(24px,5vw,64px)",
        gap: 40,
        overflow: "hidden",
        background: "#070706",
      }}
    >
      {/* Particle bg */}
      <ParticleCanvas />

      {/* Dot grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(circle,rgba(255,255,255,0.055) 1px,transparent 1px)",
        backgroundSize: "30px 30px",
        pointerEvents: "none", zIndex: 0,
      }} />

      {/* Orb glows */}
      <div style={{ position:"absolute", top:-80, right:-60, width:480, height:480, borderRadius:"50%", background:"radial-gradient(circle,rgba(201,168,76,0.1) 0,transparent 70%)", filter:"blur(60px)", pointerEvents:"none", zIndex:0, animation:"orb 14s ease-in-out infinite" }} />
      <div style={{ position:"absolute", bottom:-80, left:"5%", width:300, height:300, borderRadius:"50%", background:"radial-gradient(circle,rgba(201,168,76,0.07) 0,transparent 70%)", filter:"blur(50px)", pointerEvents:"none", zIndex:0, animation:"orb 18s 4s ease-in-out infinite" }} />

      {/* Left content */}
      <div ref={leftRef} style={{ position:"relative", zIndex:2 }}>
        {/* Pill label */}
        <div style={{
          display:"inline-flex", alignItems:"center", gap:8,
          border:"1px solid rgba(201,168,76,0.25)", padding:"5px 14px",
          fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase",
          color:"#c9a84c", marginBottom:24,
          background:"rgba(201,168,76,0.05)",
        }}>
          <span style={{ width:5, height:5, background:"#c9a84c", borderRadius:"50%", animation:"pulse 2s ease-in-out infinite" }} />
          Bangladesh ICT Alliance · Est. 2021
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily:"'Playfair Display',serif",
          fontSize:"clamp(40px,5.5vw,70px)",
          lineHeight:1.06,
          fontWeight:700,
          marginBottom:20,
          color:"#f0ede8",
        }}>
          Where <em style={{fontStyle:"italic",color:"#c9a84c"}}>Elite</em><br />
          Minds Shape<br />
          Bangladesh&apos;s<br />
          <em style={{fontStyle:"italic",color:"#c9a84c"}}>Digital Future</em>
        </h1>

        {/* Subcopy */}
        <p style={{ fontSize:16, color:"#6b6865", lineHeight:1.7, maxWidth:420, marginBottom:32, fontWeight:300 }}>
          {subcopy}
        </p>

        {/* CTAs */}
        <div style={{ display:"flex", gap:10, marginBottom:36 }}>
          <Link href="/events" style={{
            background:"#c9a84c", color:"#070706",
            padding:"12px 26px", fontSize:12, fontWeight:500,
            letterSpacing:"0.08em", textTransform:"uppercase",
            textDecoration:"none", display:"inline-block",
            transition:"opacity .2s, transform .2s",
          }}
          onMouseEnter={e=>{(e.target as HTMLElement).style.opacity="0.85";(e.target as HTMLElement).style.transform="translateY(-2px)"}}
          onMouseLeave={e=>{(e.target as HTMLElement).style.opacity="1";(e.target as HTMLElement).style.transform="translateY(0)"}}>
            {primaryCta}
          </Link>
          <Link href="/programs" style={{
            background:"transparent", color:"#c9a84c",
            padding:"12px 26px", fontSize:12,
            letterSpacing:"0.08em", textTransform:"uppercase",
            border:"1px solid rgba(201,168,76,0.35)",
            textDecoration:"none", display:"inline-block",
            transition:"all .2s",
          }}
          onMouseEnter={e=>{(e.target as HTMLElement).style.background="rgba(201,168,76,0.08)";(e.target as HTMLElement).style.borderColor="#c9a84c"}}
          onMouseLeave={e=>{(e.target as HTMLElement).style.background="transparent";(e.target as HTMLElement).style.borderColor="rgba(201,168,76,0.35)"}}>
            {secondaryCta} →
          </Link>
        </div>

        {/* Trust pills */}
        <div style={{ display:"flex", gap:20 }}>
          {[["25K+","Members"],["50+","Universities"],["30+","Partners"]].map(([v,l])=>(
            <div key={l} style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:"#3a3835" }}>
              <span style={{ color:"#c9a84c", fontSize:14, fontWeight:500 }}>{v}</span> {l}
            </div>
          ))}
        </div>
      </div>

      {/* Right floating event cards */}
      <div ref={rightRef} style={{ position:"relative", zIndex:2, display:"flex", flexDirection:"column", gap:12 }}>
        {FLOATING_EVENTS.map((ev, i) => (
          <div key={i} style={{
            background:"rgba(18,17,16,0.85)",
            border:"1px solid rgba(255,255,255,0.07)",
            padding:"18px 22px",
            backdropFilter:"blur(16px)",
            position:"relative",
            overflow:"hidden",
            cursor:"pointer",
            transition:"transform .3s, border-color .3s",
            marginLeft: i === 1 ? 24 : i === 2 ? 8 : 0,
            animation: `float ${7 + i * 1.5}s ${i * 1.2}s ease-in-out infinite`,
          }}
          onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform="translateX(-6px)";(e.currentTarget as HTMLElement).style.borderColor="rgba(201,168,76,0.35)"}}
          onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform="";(e.currentTarget as HTMLElement).style.borderColor="rgba(255,255,255,0.07)"}}>
            {/* Top shimmer line */}
            <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:"linear-gradient(90deg,transparent,rgba(201,168,76,0.45),transparent)" }} />
            <div style={{ fontSize:9, letterSpacing:"0.15em", textTransform:"uppercase", color:"#c9a84c", marginBottom:8 }}>{ev.tag}</div>
            <div style={{ fontSize:14, fontWeight:500, marginBottom:8, lineHeight:1.3 }}>{ev.title}</div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:10, color:ev.statusColor }}>
                <span style={{ width:5, height:5, background:ev.statusColor, borderRadius:"50%", animation:"pulse 1.5s ease-in-out infinite" }} />
                {ev.status}
              </div>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:"#c9a84c" }}>{ev.date}</div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.1)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes orb { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(30px,-20px) scale(1.1)} }
      `}</style>
    </section>
  );
}
