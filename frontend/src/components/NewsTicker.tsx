"use client";

const DEFAULT_ITEMS = [
  "🏆 AI Olympiad 2026 Registration Open",
  "📊 847 Spots Remaining — Datathon 2026",
  "🎯 New Program: AI for SDG Track",
  "🤝 Microsoft joins as Gold Partner",
  "📅 Next Event: June 15, 2026 · Dhaka",
];

export default function NewsTicker({ items = DEFAULT_ITEMS }: { items?: string[] }) {
  const doubled = [...items, ...items];
  return (
    <div style={{ background: "#c9a84c", overflow: "hidden", padding: "9px 0", position: "relative", zIndex: 10 }}>
      <div style={{ display: "flex", gap: 44, animation: "newsTickerMove 16s linear infinite", width: "max-content" }}>
        {doubled.map((item, i) => (
          <span key={i} style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#070706", whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", gap: 10 }}>
            {item}
            <span style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(7,7,6,0.35)", display: "inline-block" }} />
          </span>
        ))}
      </div>
      <style>{`@keyframes newsTickerMove { from{transform:translateX(0)} to{transform:translateX(-50%)} }`}</style>
    </div>
  );
}
