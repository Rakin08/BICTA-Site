"use client";
import { useState } from "react";
import { Linkedin, Twitter } from "lucide-react";
import Link from "next/link";
import { ADVISORS, FOUNDERS, type Advisor, type Founder } from "@/lib/static-data";

const CAT_COLORS: Record<string, string> = {
  Industry: "rgba(201,168,76,0.12)",
  Technology: "rgba(139,92,246,0.1)",
  Academia: "rgba(59,130,246,0.1)",
  Policy: "rgba(34,197,94,0.1)",
  Startup: "rgba(236,72,153,0.1)",
};
const CAT_TEXT: Record<string, string> = {
  Industry: "#c9a84c",
  Technology: "#a78bfa",
  Academia: "#60a5fa",
  Policy: "#4ade80",
  Startup: "#f472b6",
};

function PersonCard({ name, title, company, category, expertise, bio, imageUrl, linkedIn }: {
  name: string; title: string; company: string; category?: string;
  expertise?: string; bio?: string; imageUrl?: string; linkedIn?: string;
}) {
  const initials = name.split(" ").map(n => n[0]).slice(0, 2).join("");
  const accent = category ? CAT_TEXT[category] || "#c9a84c" : "#c9a84c";
  const bgAccent = category ? CAT_COLORS[category] || "rgba(201,168,76,0.1)" : "rgba(201,168,76,0.1)";
  return (
    <div style={{
      background: "#0d0c0b",
      border: "1px solid rgba(255,255,255,0.06)",
      padding: "22px",
      cursor: "pointer",
      position: "relative",
      overflow: "hidden",
      transition: "transform .3s, border-color .3s",
    }}
    className="group hover:-translate-y-1"
    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,168,76,0.25)"; }}
    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)"; }}
    >
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${accent},transparent)`, transform: "scaleX(0)", transition: "transform .3s" }}
        className="group-hover:scale-x-100" />
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 12 }}>
        <div style={{
          width: 46, height: 46, borderRadius: "50%",
          background: bgAccent,
          border: `1px solid ${accent}30`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Playfair Display',serif", fontSize: 16,
          color: accent, fontWeight: 700, flexShrink: 0,
          transition: "box-shadow .3s",
        }}>
          {imageUrl
            ? <img src={imageUrl} alt={name} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
            : initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, fontWeight: 700, marginBottom: 2, color: "#f0ede8" }}>{name}</div>
          <div style={{ fontSize: 10, color: accent, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 2 }}>{title}</div>
          <div style={{ fontSize: 11, color: "#3a3835" }}>{company}</div>
        </div>
      </div>
      {category && (
        <span style={{ fontSize: 9, padding: "2px 8px", background: bgAccent, border: `1px solid ${accent}30`, color: accent, letterSpacing: "0.08em", textTransform: "uppercase", display: "inline-block", marginBottom: 10 }}>{category}</span>
      )}
      {expertise && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {expertise.split(",").slice(0, 3).map(e => (
            <span key={e} style={{ fontSize: 9, padding: "2px 7px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "#5a5855", letterSpacing: "0.06em", textTransform: "uppercase" }}>{e.trim()}</span>
          ))}
        </div>
      )}
      {linkedIn && linkedIn !== "#" && (
        <a href={linkedIn} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", marginTop: 10, color: "#3a3835", transition: "color .2s" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = accent; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#3a3835"; }}>
          <Linkedin size={13} />
        </a>
      )}
    </div>
  );
}

const CATS = ["All", "Industry", "Technology", "Academia", "Policy", "Startup"];

export default function CoreMembersSection({
  founders = FOUNDERS,
  advisors = ADVISORS,
  title = "The Minds Behind BICTA",
  subtitle = "World-class founders and advisors guiding Bangladesh's ICT and AI ecosystem.",
}: {
  founders?: any[];
  advisors?: any[];
  title?: string;
  subtitle?: string;
}) {
  const [tab, setTab] = useState<"founders" | "advisors">("founders");
  const [cat, setCat] = useState("All");

  const showAdvisors = tab === "advisors";
  const displayAdvisors = cat === "All" ? advisors.filter(a => a.published !== false) : advisors.filter(a => a.published !== false && a.category === cat);
  const displayFounders = founders;

  return (
    <section style={{ padding: "80px clamp(24px,5vw,64px)", background: "#0a0908", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -80, right: -80, width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle,rgba(201,168,76,0.05) 0,transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "#c9a84c", marginBottom: 14, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 20, height: 1, background: "#c9a84c", display: "inline-block" }} />
          Our People
        </div>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(28px,4vw,48px)", lineHeight: 1.1, marginBottom: 10, color: "#f0ede8" }}>
          {title.split("BICTA")[0]}<em style={{ fontStyle: "italic", color: "#c9a84c" }}>BICTA</em>{title.split("BICTA")[1]}
        </h2>
        <p style={{ color: "#6b6865", fontSize: 15, marginBottom: 40, lineHeight: 1.6, maxWidth: 480 }}>{subtitle}</p>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, borderBottom: "1px solid rgba(255,255,255,0.06)", width: "fit-content", marginBottom: 32 }}>
          {(["founders", "advisors"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: "9px 22px", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase",
              cursor: "pointer", color: tab === t ? "#c9a84c" : "#3a3835",
              borderBottom: tab === t ? "2px solid #c9a84c" : "2px solid transparent",
              background: "none", borderTop: "none", borderLeft: "none", borderRight: "none",
              transition: "color .2s",
            }}>{t === "founders" ? `Founders (${displayFounders.length})` : `Advisors (${advisors.filter(a => a.published !== false).length})`}</button>
          ))}
        </div>

        {/* Category filter for advisors */}
        {showAdvisors && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 28 }}>
            {CATS.map(c => (
              <button key={c} onClick={() => setCat(c)} style={{
                padding: "4px 14px", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase",
                cursor: "pointer",
                background: cat === c ? "rgba(201,168,76,0.12)" : "transparent",
                border: cat === c ? "1px solid rgba(201,168,76,0.4)" : "1px solid rgba(255,255,255,0.06)",
                color: cat === c ? "#c9a84c" : "#3a3835",
                transition: "all .2s",
              }}>{c}</button>
            ))}
          </div>
        )}

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 12 }}>
          {(showAdvisors ? displayAdvisors : displayFounders).map((p: any, i: number) => (
            <PersonCard
              key={p.id || i}
              name={p.name}
              title={p.title || p.designation}
              company={p.company || p.bio || ""}
              category={p.category}
              expertise={p.expertise}
              bio={p.bio}
              imageUrl={p.imageUrl}
              linkedIn={p.linkedIn || p.linkedInUrl}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
