"use client";

import { useState, useCallback } from "react";
import { Copy, Check, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SiteColorConfig } from "@/types/competition";

const DEFAULT_COLORS: SiteColorConfig = {
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

const COLOR_LABELS: Record<keyof SiteColorConfig, string> = {
  primary: "Primary / Gold",
  primaryLight: "Primary Light / Hover",
  background: "Page Background",
  surface: "Card Background",
  raised: "Elevated Surface",
  cream: "Primary Text",
  muted: "Secondary Text",
  subtle: "Tertiary Text",
  border: "Default Border",
  borderHover: "Hover Border",
  success: "Success / Green",
  error: "Error / Red",
};

const COLOR_DESCRIPTIONS: Record<keyof SiteColorConfig, string> = {
  primary: "Main brand accent — CTAs, highlights, active states",
  primaryLight: "Lighter gold for hover states and emphasis",
  background: "Main page background color",
  surface: "Card and panel backgrounds",
  raised: "Elevated sections (hero, footer)",
  cream: "Primary text color — headings, important text",
  muted: "Secondary text — descriptions, labels",
  subtle: "Tertiary/caption text — metadata, hints",
  border: "Default card and section borders",
  borderHover: "Border color on hover/focus",
  success: "Success states, positive indicators",
  error: "Error states, warnings, disqualification",
};

interface ColorPickerProps {
  colors: SiteColorConfig;
  onChange: (colors: SiteColorConfig) => void;
}

export default function ColorPicker({ colors, onChange }: ColorPickerProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const handleColorChange = useCallback(
    (key: keyof SiteColorConfig, value: string) => {
      onChange({ ...colors, [key]: value });
    },
    [colors, onChange]
  );

  const handleReset = useCallback(() => {
    if (confirm("Reset all colors to defaults?")) {
      onChange({ ...DEFAULT_COLORS });
    }
  }, [onChange]);

  const copyToClipboard = useCallback((value: string, key: string) => {
    navigator.clipboard.writeText(value);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  }, []);

  const colorKeys = Object.keys(colors) as (keyof SiteColorConfig)[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg text-bicta-cream mb-1">
            Site Colors
          </h2>
          <p className="font-body text-xs text-bicta-subtle">
            Customize the color scheme of your entire site. Changes are
            reflected immediately.
          </p>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-3 py-2 border border-bicta-border text-bicta-subtle font-body text-xs uppercase tracking-wider rounded-lg hover:border-bicta-gold/30 hover:text-bicta-muted transition-all"
        >
          <RotateCcw size={12} /> Reset Defaults
        </button>
      </div>

      {/* Live Preview */}
      <div className="bg-bicta-raised border border-bicta-border rounded-xl p-6">
        <span className="text-[0.6rem] uppercase tracking-wider text-bicta-subtle font-body block mb-4">
          Live Preview
        </span>
        <div
          className="rounded-lg p-6 space-y-4"
          style={{ background: colors.background }}
        >
          <h3 style={{ color: colors.cream, fontFamily: "'Playfair Display', serif" }}>
            Sample Heading
          </h3>
          <p style={{ color: colors.muted, fontFamily: "'Inter', sans-serif" }}>
            This is secondary body text to preview muted colors.
          </p>
          <div className="flex gap-3">
            <span
              className="px-4 py-2 text-xs font-medium uppercase tracking-wider rounded"
              style={{ background: colors.primary, color: colors.background }}
            >
              Primary Button
            </span>
            <span
              className="px-4 py-2 text-xs font-medium uppercase tracking-wider rounded border"
              style={{ borderColor: colors.primary, color: colors.primary }}
            >
              Outline Button
            </span>
          </div>
          <div
            className="rounded-lg p-4"
            style={{ background: colors.surface, border: `1px solid ${colors.border}` }}
          >
            <span style={{ color: colors.cream }}>Card Title</span>
            <p style={{ color: colors.subtle, fontSize: "0.75rem" }}>
              Card description text in subtle color.
            </p>
          </div>
        </div>
      </div>

      {/* Color Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {colorKeys.map((key) => {
          const isRgba = colors[key].startsWith("rgba");
          return (
            <div
              key={key}
              className="bg-bicta-surface border border-bicta-border rounded-xl p-4 hover:border-bicta-border-hover transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-10 h-10 rounded-lg border border-bicta-border shrink-0"
                  style={{ background: colors[key] }}
                />
                <div className="flex-1 min-w-0">
                  <label className="font-body text-xs font-medium text-bicta-cream block">
                    {COLOR_LABELS[key]}
                  </label>
                  <span className="font-body text-[0.6rem] text-bicta-subtle">
                    {COLOR_DESCRIPTIONS[key]}
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(colors[key], key)}
                  className="text-bicta-subtle hover:text-bicta-gold transition-colors p-1"
                >
                  {copied === key ? (
                    <Check size={14} className="text-emerald-400" />
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  type={isRgba ? "text" : "color"}
                  value={colors[key]}
                  onChange={(e) => handleColorChange(key, e.target.value)}
                  className={cn(
                    "h-8 rounded cursor-pointer",
                    isRgba
                      ? "flex-1 bg-bicta-raised border border-bicta-border text-bicta-cream font-mono text-xs px-2"
                      : "w-8 p-0 border-0"
                  )}
                />
                {!isRgba && (
                  <input
                    type="text"
                    value={colors[key]}
                    onChange={(e) => handleColorChange(key, e.target.value)}
                    className="flex-1 bg-bicta-raised border border-bicta-border text-bicta-cream font-mono text-xs px-2 rounded h-8"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
