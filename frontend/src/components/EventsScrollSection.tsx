"use client";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";

interface EventCard {
  id: string;
  slug: string;
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

const DEMO: EventCard[] = [
  { id:"1", slug:"ai-olympiad-2026", title:"AI Olympiad 2026 — National Finals", description:"Bangladesh's most prestigious AI competition. Three rounds, one champion. Your shot at representing the nation internationally.", type:"Featured Competition", date:"June 15–20, 2026", location:"Dhaka", prize:"৳5,00,000", spotsLeft:400, spotsTotal:2400, status:"featured", color:"gold", daysLeft:16 },
  { id:"2", slug:"national-datathon-series", title:"National Data Science Challenge", type:"Datathon", date:"Jul 02 · Online + Dhaka", spotsLeft:847, spotsTotal:3000, status:"open", color:"purple", daysLeft:34 },
  { id:"3", slug:"ai-for-sdg-2026", title:"AI for Sustainable Bangladesh", type:"AI Track", date:"Aug 10 · Chittagong", spotsLeft:430, spotsTotal:1000, status:"open", color:"blue", daysLeft:72 },
  { id:"4", slug:"founders-summit-2026", title:"Tech Founders Summit 2026", type:"Summit", date:"Sep 05 · Dhaka", spotsLeft:38, spotsTotal:200, status:"closing", color:"pink", daysLeft:98 },
];

const CLRS = {
  purple: { a:"#a78bfa", bg:"rgba(139,92,246,0.1)",  bd:"rgba(139,92,246,0.18)", hbd:"rgba(139,92,246,0.5)" },
  blue:   { a:"#60a5fa", bg:"rgba(59,130,246,0.1)",   bd:"rgba(59,130,246,0.18)",  hbd:"rgba(59,130,246,0.5)" },
  pink:   { a:"#f472b6", bg:"rgba(236,72,153,0.1)",   bd:"rgba(236,72,153,0.18)",  hbd:"rgba(236,72,153,0.5)" },
  gold:   { a:"#c9a84c", bg:"rgba(201,168,76,0.06)",  bd:"rgba(201,168,76,0.15)",  hbd:"rgba(201,168,76,0.4)" },
};

function Countdown({ days, color }: { days: number; color: string }) {
  const [s, setS] = useState(Math.floor(Math.random() * 3600));
  useEffect(() => { const t = setInterval(() => setS(x => x > 0 ? x - 1 : 59), 1000); return () => clearInterval(t); }, []);
  const h = Math.floor(s / 3600) % 24, m = Math.floor(s / 60) % 60, sec = s % 60;
  return (
    <div style={{ display:"flex", gap:6, marginTop:10 }}>
      {[[days,"Days"],[h,"Hrs"],[m,"Min"],[sec,"Sec"]].map(([v,l]) => (
        <div key={String(l)} style={{ textAlign:"center" }}>
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:18, fontWeight:500, color, lineHeight:1 }}>{String(v).padStart(2,"0")}</div>
          <div style={{ fontSize:8, letterSpacing:"0.1em", textTransform:"uppercase", color:"#3a3835", marginTop:2 }}>{String(l)}</div>
        </div>
      ))}
    </div>
  );
}

export default function EventsScrollSection({ events = DEMO }: { events?: EventCard[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const down = useRef(false), sx = useRef(0), sl = useRef(0);
  const onMD = (e: React.MouseEvent) => { down.current=true; sx.current=e.pageX-ref.current!.offsetLeft; sl.current=ref.current!.scrollLeft; };
  const onML = () => { down.current=false; };
  const onMU = () => { down.current=false; };
  const onMM = (e: React.MouseEvent) => { if(!down.current) return; e.preventDefault(); ref.current!.scrollLeft=sl.current-(e.pageX-ref.current!.offsetLeft-sx.current)*1.5; };
  const featured = events.find(e => e.status==="featured");
  const others = events.filter(e => e.status!=="featured");
  return (
    <div ref={ref} style={{ display:"flex", gap:14, padding:"0 clamp(24px,5vw,64px)", overflowX:"auto", scrollbarWidth:"none", cursor:"grab" }}
      onMouseDown={onMD} onMouseLeave={onML} onMouseUp={onMU} onMouseMove={onMM}>
      <style>{`.events-scroll::-webkit-scrollbar{display:none}`}</style>

      {featured && (
        <Link href={`/events/${featured.slug}`} style={{ textDecoration:"none", color:"inherit", display:"block", minWidth:360, flexShrink:0 }}>
          <div style={{ background:"#0d0c0b", border:"1px solid rgba(255,255,255,0.07)", padding:28, position:"relative", overflow:"hidden", height:"100%", transition:"border-color .3s" }}
            onMouseEnter={e=>(e.currentTarget as HTMLElement).style.borderColor="rgba(201,168,76,0.35)"}
            onMouseLeave={e=>(e.currentTarget as HTMLElement).style.borderColor="rgba(255,255,255,0.07)"}>
            <div style={{ position:"absolute", top:-40, right:-40, width:180, height:180, background:"radial-gradient(circle,rgba(201,168,76,0.14) 0,transparent 70%)", pointerEvents:"none" }} />
            <div style={{ display:"inline-flex", alignItems:"center", gap:6, fontSize:9, letterSpacing:"0.14em", textTransform:"uppercase", marginBottom:14, padding:"4px 10px", border:"1px solid rgba(74,222,128,0.25)", background:"rgba(74,222,128,0.07)", color:"#4ade80" }}>
              <span style={{ width:5, height:5, background:"#4ade80", borderRadius:"50%", animation:"livePulse 1.5s ease-in-out infinite" }} />Registration Open
            </div>
            <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:24, fontWeight:700, lineHeight:1.15, marginBottom:8, color:"#f0ede8" }}>{featured.title}</h3>
            {featured.description && <p style={{ fontSize:13, color:"#6b6865", lineHeight:1.6, marginBottom:16 }}>{featured.description}</p>}
            <div style={{ display:"flex", flexWrap:"wrap", gap:12, marginBottom:16 }}>
              {featured.location && <span style={{ fontSize:11, color:"#3a3835" }}>📍 {featured.location}</span>}
              <span style={{ fontSize:11, color:"#3a3835" }}>📅 {featured.date}</span>
              {featured.spotsTotal && featured.spotsLeft && <span style={{ fontSize:11, color:"#3a3835" }}>👥 {featured.spotsTotal - featured.spotsLeft} registered</span>}
            </div>
            {featured.prize && <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:18, color:"#c9a84c", fontWeight:500, marginBottom:16 }}>{featured.prize} Prize Pool</div>}
            <div style={{ background:"#c9a84c", color:"#070706", padding:"9px 20px", fontSize:11, fontWeight:500, letterSpacing:"0.08em", textTransform:"uppercase", display:"inline-block" }}>Register Now →</div>
          </div>
        </Link>
      )}

      {others.map((ev, i) => {
        const c = CLRS[ev.color || "purple"];
        const pct = ev.spotsTotal ? Math.round(((ev.spotsTotal - (ev.spotsLeft||0)) / ev.spotsTotal) * 100) : 0;
        return (
          <Link key={ev.id} href={`/events/${ev.slug}`} style={{ textDecoration:"none", color:"inherit", display:"block", minWidth:248, flexShrink:0 }}>
            <div style={{ background:`linear-gradient(135deg,${c.bg} 0,#0d0c0b 65%)`, border:`1px solid ${c.bd}`, height:"100%", position:"relative", overflow:"hidden", transition:"all .3s, transform .3s" }}
              onMouseEnter={e=>{ const el=e.currentTarget as HTMLElement; el.style.borderColor=c.hbd; el.style.transform="translateY(-5px)"; el.style.boxShadow=`0 12px 30px rgba(0,0,0,0.4)`; }}
              onMouseLeave={e=>{ const el=e.currentTarget as HTMLElement; el.style.borderColor=c.bd; el.style.transform=""; el.style.boxShadow=""; }}>
              <div style={{ position:"absolute", top:12, right:12, fontFamily:"'Playfair Display',serif", fontSize:52, fontWeight:700, lineHeight:.9, opacity:.12, color:c.a, pointerEvents:"none" }}>0{i+1}</div>
              <div style={{ padding:22 }}>
                <div style={{ display:"flex", gap:5, marginBottom:12, flexWrap:"wrap" }}>
                  <span style={{ fontSize:9, padding:"3px 9px", letterSpacing:"0.1em", textTransform:"uppercase", fontWeight:500, background:`${c.a}18`, border:`1px solid ${c.a}40`, color:c.a }}>{ev.type}</span>
                  {ev.status==="closing" && <span style={{ fontSize:9, padding:"3px 9px", letterSpacing:"0.1em", textTransform:"uppercase", fontWeight:500, background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)", color:"#f87171" }}>🔥 Closing</span>}
                </div>
                <div style={{ fontSize:15, fontWeight:500, lineHeight:1.3, marginBottom:6, color:"#f0ede8" }}>{ev.title}</div>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:"#3a3835", marginBottom:10 }}>{ev.date}</div>
                {ev.spotsLeft !== undefined && (
                  <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:10, color:c.a }}>
                    {ev.spotsLeft} spots left
                    <div style={{ flex:1, height:2, background:"rgba(255,255,255,0.07)", borderRadius:1, overflow:"hidden" }}>
                      <div style={{ height:"100%", background:c.a, width:`${pct}%`, transition:"width .8s" }} />
                    </div>
                  </div>
                )}
                {ev.daysLeft && <div style={{ color:c.a }}><Countdown days={ev.daysLeft} color={c.a} /></div>}
              </div>
            </div>
          </Link>
        );
      })}
      <style>{`@keyframes livePulse{0%,100%{opacity:.5;transform:scale(1)}50%{opacity:1;transform:scale(1.2)}}`}</style>
    </div>
  );
}
