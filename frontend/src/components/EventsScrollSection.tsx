"use client";
import { useRef, useEffect, useState } from "react";

interface Event {
  id: string;
  title: string;
  description?: string;
  type: string;
  date: string;
  location?: string;
  prize?: string;
  spotsLeft?: number;
  spotsTotal?: number;
  status: "open" | "closing" | "upcoming" | "featured";
  color?: "purple" | "blue" | "pink" | "gold";
  daysLeft?: number;
}

const DEMO_EVENTS: Event[] = [
  {
    id: "ai-olympiad-2026",
    title: "AI Olympiad 2026 — National Finals",
    description: "Bangladesh's most prestigious AI competition. Three elimination rounds, 1 national champion. Your shot at representing the nation internationally.",
    type: "Featured Competition",
    date: "June 15–20, 2026",
    location: "Dhaka",
    prize: "৳5,00,000",
    spotsLeft: 400,
    spotsTotal: 2400,
    status: "featured",
    color: "gold",
    daysLeft: 16,
  },
  {
    id: "datathon-2026",
    title: "National Data Science Challenge",
    type: "Datathon",
    date: "Jul 02 · Online + Dhaka",
    spotsLeft: 847,
    spotsTotal: 3000,
    status: "open",
    color: "purple",
    daysLeft: 34,
  },
  {
    id: "ai-sdg",
    title: "AI for Sustainable Bangladesh",
    type: "AI Track",
    date: "Aug 10 · Chittagong",
    spotsLeft: 430,
    spotsTotal: 1000,
    status: "open",
    color: "blue",
    daysLeft: 72,
  },
  {
    id: "founders-summit",
    title: "Tech Founders Summit 2026",
    type: "Summit",
    date: "Sep 05 · Dhaka",
    spotsLeft: 38,
    spotsTotal: 200,
    status: "closing",
    color: "pink",
    daysLeft: 98,
  },
];

const COLOR_MAP = {
  purple: { accent: "#a78bfa", bg: "rgba(139,92,246,0.1)", border: "rgba(139,92,246,0.18)", hoverBorder: "rgba(139,92,246,0.5)", badgeBg: "rgba(139,92,246,0.12)", badgeBorder: "rgba(139,92,246,0.3)" },
  blue:   { accent: "#60a5fa", bg: "rgba(59,130,246,0.1)",  border: "rgba(59,130,246,0.18)",  hoverBorder: "rgba(59,130,246,0.5)",  badgeBg: "rgba(59,130,246,0.1)",  badgeBorder: "rgba(59,130,246,0.3)" },
  pink:   { accent: "#f472b6", bg: "rgba(236,72,153,0.1)",  border: "rgba(236,72,153,0.18)",  hoverBorder: "rgba(236,72,153,0.5)",  badgeBg: "rgba(236,72,153,0.1)",  badgeBorder: "rgba(236,72,153,0.3)" },
  gold:   { accent: "#c9a84c", bg: "rgba(201,168,76,0.06)", border: "rgba(201,168,76,0.15)",  hoverBorder: "rgba(201,168,76,0.4)",  badgeBg: "rgba(201,168,76,0.1)",  badgeBorder: "rgba(201,168,76,0.3)" },
};

function Countdown({ days }: { days: number }) {
  const [secs, setSecs] = useState(Math.floor(Math.random() * 3600));
  useEffect(() => {
    const t = setInterval(() => setSecs((s) => (s > 0 ? s - 1 : 59)), 1000);
    return () => clearInterval(t);
  }, []);
  const h = Math.floor(secs / 3600) % 24;
  const m = Math.floor(secs / 60) % 60;
  const s = secs % 60;
  return (
    <div className="flex gap-2 mt-3">
      {[{v:days,l:"Days"},{v:h,l:"Hours"},{v:m,l:"Mins"},{v:s,l:"Secs"}].map(({v,l},i)=>(
        <div key={l} className="text-center">
          <div style={{fontFamily:"JetBrains Mono,monospace",fontSize:18,fontWeight:500,color:"inherit",lineHeight:1}}>{String(v).padStart(2,"0")}</div>
          <div style={{fontSize:8,letterSpacing:"0.1em",textTransform:"uppercase",color:"#3a3835",marginTop:2}}>{l}</div>
        </div>
      ))}
    </div>
  );
}

export default function EventsScrollSection({ events = DEMO_EVENTS }: { events?: Event[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onMouseDown = (e: React.MouseEvent) => { isDown.current = true; startX.current = e.pageX - scrollRef.current!.offsetLeft; scrollLeft.current = scrollRef.current!.scrollLeft; };
  const onMouseLeave = () => { isDown.current = false; };
  const onMouseUp = () => { isDown.current = false; };
  const onMouseMove = (e: React.MouseEvent) => { if (!isDown.current) return; e.preventDefault(); const x = e.pageX - scrollRef.current!.offsetLeft; scrollRef.current!.scrollLeft = scrollLeft.current - (x - startX.current) * 1.5; };

  const featured = events.find((ev) => ev.status === "featured");
  const others = events.filter((ev) => ev.status !== "featured");

  return (
    <div
      ref={scrollRef}
      className="events-scroll"
      onMouseDown={onMouseDown}
      onMouseLeave={onMouseLeave}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
    >
      {featured && (
        <div
          style={{ minWidth:380, background:"#0d0c0b", border:"1px solid rgba(255,255,255,0.07)", padding:32, position:"relative", overflow:"hidden", flexShrink:0, cursor:"pointer", transition:"border-color .3s" }}
          className="hover:border-bicta-gold/30"
        >
          <div style={{ position:"absolute", top:-40, right:-40, width:180, height:180, background:"radial-gradient(circle,rgba(201,168,76,0.14) 0,transparent 70%)", pointerEvents:"none" }} />
          <div style={{ display:"inline-flex", alignItems:"center", gap:6, fontSize:9, letterSpacing:"0.14em", textTransform:"uppercase", marginBottom:16, padding:"4px 10px", border:"1px solid rgba(74,222,128,0.25)", background:"rgba(74,222,128,0.07)", color:"#4ade80" }}>
            <span className="live-indicator" />Registration Open
          </div>
          <div style={{ fontFamily:"Playfair Display,serif", fontSize:26, fontWeight:700, lineHeight:1.15, marginBottom:10 }}>{featured.title}</div>
          {featured.description && <div style={{ fontSize:13, color:"#6b6865", lineHeight:1.6, marginBottom:20 }}>{featured.description}</div>}
          <div style={{ display:"flex", flexWrap:"wrap", gap:14, marginBottom:20 }}>
            {featured.location && <span style={{ fontSize:11, color:"#3a3835" }}>📍 {featured.location}</span>}
            <span style={{ fontSize:11, color:"#3a3835" }}>📅 {featured.date}</span>
            {featured.spotsLeft && <span style={{ fontSize:11, color:"#3a3835" }}>👥 {(featured.spotsTotal||0)-(featured.spotsLeft||0)} registered</span>}
          </div>
          {featured.prize && <div style={{ fontFamily:"JetBrains Mono,monospace", fontSize:20, color:"#c9a84c", fontWeight:500, marginBottom:20 }}>{featured.prize} Prize Pool</div>}
          <button className="btn-slide" style={{ background:"#c9a84c", color:"#070706", padding:"10px 22px", fontSize:11, fontWeight:500, letterSpacing:"0.08em", textTransform:"uppercase", border:"none", cursor:"pointer" }}>Register Now →</button>
        </div>
      )}

      {others.map((ev, i) => {
        const clr = COLOR_MAP[ev.color || "purple"];
        const pct = ev.spotsTotal ? Math.round(((ev.spotsTotal - (ev.spotsLeft||0)) / ev.spotsTotal) * 100) : 0;
        return (
          <div
            key={ev.id}
            style={{ minWidth:255, background:`linear-gradient(135deg,${clr.bg} 0,#0d0c0b 60%)`, border:`1px solid ${clr.border}`, flexShrink:0, cursor:"pointer", transition:"all .3s", position:"relative", overflow:"hidden" }}
            className="hover:-translate-y-1.5"
          >
            <div style={{ position:"absolute", top:14, right:14, fontFamily:"Playfair Display,serif", fontSize:52, fontWeight:700, lineHeight:.9, opacity:.13, color:clr.accent, pointerEvents:"none" }}>0{i+1}</div>
            <div style={{ padding:24 }}>
              <div style={{ display:"flex", gap:5, marginBottom:14, flexWrap:"wrap" }}>
                <span style={{ fontSize:9, padding:"3px 9px", letterSpacing:"0.1em", textTransform:"uppercase", fontWeight:500, background:clr.badgeBg, border:`1px solid ${clr.badgeBorder}`, color:clr.accent }}>{ev.type}</span>
                {ev.status==="closing" && <span style={{ fontSize:9, padding:"3px 9px", letterSpacing:"0.1em", textTransform:"uppercase", fontWeight:500, background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)", color:"#f87171" }}>🔥 Closing Soon</span>}
              </div>
              <div style={{ fontSize:16, fontWeight:500, lineHeight:1.3, marginBottom:8 }}>{ev.title}</div>
              <div style={{ fontFamily:"JetBrains Mono,monospace", fontSize:10, color:"#3a3835", marginBottom:12 }}>{ev.date}</div>
              {ev.spotsLeft !== undefined && (
                <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:10, color:clr.accent }}>
                  {ev.spotsLeft} spots left
                  <div style={{ flex:1, height:2, background:"rgba(255,255,255,0.07)", borderRadius:1, overflow:"hidden" }}>
                    <div style={{ height:"100%", background:clr.accent, borderRadius:1, width:`${pct}%`, transition:"width .8s ease" }} />
                  </div>
                </div>
              )}
              {ev.daysLeft && (
                <div style={{ color: clr.accent }}>
                  <Countdown days={ev.daysLeft} />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
