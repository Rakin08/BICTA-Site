"use client";

import { useState } from "react";
import { Palette, Type, Image, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import ColorPicker from "@/components/admin/ColorPicker";
import type { SiteColorConfig } from "@/types/competition";

const defaultColors: SiteColorConfig = {
  primary: "#c9a84c",
  primaryLight: "#e8d49a",
  background: "#0a0a0a",
  surface: "#141414",
  raised: "#1a1a1a",
  cream: "#faf8f3",
  muted: "#e0ddd5",
  subtle: "#8a8680",
  border: "rgba(201,168,76,0.08)",
  borderHover: "rgba(201,168,76,0.25)",
  success: "#10b981",
  error: "#ef4444",
};

const TABS = [
  { id: "colors", label: "Colors", icon: Palette },
  { id: "typography", label: "Typography", icon: Type },
  { id: "branding", label: "Branding", icon: Image },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function CMSPage() {
  const [activeTab, setActiveTab] = useState<TabId>("colors");
  const [colors, setColors] = useState<SiteColorConfig>(defaultColors);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // In production, POST to API to save colors
    console.log("Saving colors:", colors);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-bicta-cream mb-1">
            Site Customizer
          </h1>
          <p className="font-body text-sm text-bicta-subtle">
            Customize colors, typography, and branding across the entire site.
          </p>
        </div>
        <button
          onClick={handleSave}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 font-body font-medium text-xs uppercase tracking-wider rounded-lg transition-all",
            saved
              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"
              : "bg-bicta-gold text-bicta-void hover:shadow-cta-glow"
          )}
        >
          <Save size={14} />
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-bicta-border pb-0">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-3 font-body text-sm transition-all border-b-2 -mb-px",
              activeTab === tab.id
                ? "text-bicta-gold border-bicta-gold"
                : "text-bicta-subtle border-transparent hover:text-bicta-muted"
            )}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="py-4">
        {activeTab === "colors" && (
          <ColorPicker colors={colors} onChange={setColors} />
        )}

        {activeTab === "typography" && (
          <div className="space-y-6">
            <div className="bg-bicta-surface border border-bicta-border rounded-xl p-6">
              <h3 className="font-body font-medium text-sm text-bicta-cream mb-4">
                Font Preview
              </h3>
              <div className="space-y-4">
                <div>
                  <span className="text-[0.6rem] uppercase tracking-wider text-bicta-subtle font-body block mb-1">
                    Display Font (Playfair Display)
                  </span>
                  <p
                    className="text-2xl text-bicta-cream"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    The quick brown fox jumps over the lazy dog.
                  </p>
                </div>
                <div>
                  <span className="text-[0.6rem] uppercase tracking-wider text-bicta-subtle font-body block mb-1">
                    Body Font (Inter)
                  </span>
                  <p
                    className="text-sm text-bicta-muted leading-relaxed"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    BICTA bridges academia and industry through flagship national
                    programs. We create platforms where students, researchers,
                    and professionals connect with industry leaders.
                  </p>
                </div>
                <div>
                  <span className="text-[0.6rem] uppercase tracking-wider text-bicta-subtle font-body block mb-1">
                    Mono Font (JetBrains Mono)
                  </span>
                  <p
                    className="text-sm text-bicta-gold"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    const score = participants.filter(p =&gt; p.passed).length;
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "branding" && (
          <div className="space-y-6">
            <div className="bg-bicta-surface border border-bicta-border rounded-xl p-6">
              <h3 className="font-body font-medium text-sm text-bicta-cream mb-4">
                Site Branding
              </h3>
              <div className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-[0.65rem] uppercase tracking-wider text-bicta-subtle font-body mb-1.5">
                    Site Title
                  </label>
                  <input
                    defaultValue="BICTA — Bangladesh ICT Alliance"
                    className={cn(
                      "w-full bg-bicta-void border border-bicta-border text-bicta-cream",
                      "font-body text-sm px-3 py-2 rounded-lg outline-none",
                      "focus:border-bicta-gold transition-colors"
                    )}
                  />
                </div>
                <div>
                  <label className="block text-[0.65rem] uppercase tracking-wider text-bicta-subtle font-body mb-1.5">
                    Tagline
                  </label>
                  <input
                    defaultValue="Elevating Bangladesh's Tech Ecosystem"
                    className={cn(
                      "w-full bg-bicta-void border border-bicta-border text-bicta-cream",
                      "font-body text-sm px-3 py-2 rounded-lg outline-none",
                      "focus:border-bicta-gold transition-colors"
                    )}
                  />
                </div>
                <div>
                  <label className="block text-[0.65rem] uppercase tracking-wider text-bicta-subtle font-body mb-1.5">
                    Meta Description
                  </label>
                  <textarea
                    rows={3}
                    defaultValue="BICTA bridges academia and industry through flagship national programs: AI Olympiad, AI for SDG, and Datathon Series."
                    className={cn(
                      "w-full bg-bicta-void border border-bicta-border text-bicta-cream",
                      "font-body text-sm px-3 py-2 rounded-lg outline-none resize-none",
                      "focus:border-bicta-gold transition-colors"
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
