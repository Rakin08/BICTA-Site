"use client";

const ITEMS = [
  "🏆 AI Olympiad 2026 Registration Open",
  "📊 847 Spots Remaining — Datathon 2026",
  "🎯 New Program: AI for SDG Track",
  "🤝 Microsoft joins as Gold Partner",
  "📅 Next Event: June 15, 2026 · Dhaka",
];

export default function NewsTicker({ items = ITEMS }: { items?: string[] }) {
  const doubled = [...items, ...items];
  return (
    <div className="bg-bicta-gold overflow-hidden py-2.5">
      <div className="news-ticker-track">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="text-bicta-void text-[11px] font-medium tracking-[0.1em] uppercase whitespace-nowrap flex items-center gap-3"
          >
            {item}
            <span className="w-1 h-1 rounded-full bg-bicta-void opacity-30" />
          </span>
        ))}
      </div>
    </div>
  );
}
