"use client";

import { useState, useCallback } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  GripVertical,
  Save,
  X,
  ImageIcon,
  Layout,
  Type,
  Palette,
  Settings,
  Search,
  Copy,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import EventBanner from "@/components/events/EventBanner";
import type {
  EventBannerConfig,
  EventBannerFormData,
} from "@/types/event-banner";

const OVERLAY_OPTIONS = [
  { value: "gradient-dark", label: "Dark Gradient" },
  { value: "gradient-gold", label: "Gold Gradient" },
  { value: "solid-dark", label: "Solid Dark" },
  { value: "blur", label: "Blur" },
  { value: "none", label: "None" },
];

const LAYOUT_OPTIONS = [
  { value: "full-bleed", label: "Full Bleed", desc: "Full-width background image" },
  { value: "split", label: "Split", desc: "Left text, right image" },
  { value: "centered", label: "Centered", desc: "Centered text overlay" },
  { value: "floating-stats", label: "Floating Stats", desc: "Stats at bottom" },
];

const ALIGN_OPTIONS = [
  { value: "left", label: "Left" },
  { value: "center", label: "Center" },
  { value: "right", label: "Right" },
];

const ICON_OPTIONS = ["Users", "Clock", "Calendar", "Trophy", "MapPin"];

const emptyForm: EventBannerFormData = {
  headline: "",
  subheadline: "",
  description: "",
  backgroundImage: "",
  backgroundColor: "#0a0a0a",
  overlayType: "gradient-dark",
  overlayOpacity: 50,
  layoutType: "full-bleed",
  textAlign: "left",
  textColor: "#faf8f3",
  accentColor: "#c9a84c",
  showDate: true,
  startDate: "",
  endDate: "",
  dateLabel: "",
  location: "",
  showLocation: true,
  primaryCtaLabel: "Register Now",
  primaryCtaUrl: "",
  secondaryCtaLabel: "Learn More",
  secondaryCtaUrl: "",
  showSecondaryCta: false,
  stats: [],
  badgeText: "",
  badgeColor: "#c9a84c",
  showBadge: false,
  metaTitle: "",
  metaDescription: "",
  published: true,
  displayOrder: 0,
};

// Demo banners
const demoBanners: EventBannerConfig[] = [
  {
    id: "b1",
    eventId: "ai-olympiad-2026",
    eventTitle: "AI Olympiad 2026",
    headline: "AI Olympiad 2026",
    subheadline: "Bangladesh's Premier AI Competition",
    description: "Push the boundaries of artificial intelligence.",
    backgroundImage: "",
    backgroundColor: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
    overlayType: "gradient-gold",
    overlayOpacity: 40,
    layoutType: "floating-stats",
    textAlign: "left",
    textColor: "#faf8f3",
    accentColor: "#c9a84c",
    showDate: true,
    startDate: "2026-08-15",
    endDate: "2026-08-17",
    dateLabel: "Registration Open",
    location: "Dhaka + Virtual",
    showLocation: true,
    primaryCtaLabel: "Register Now",
    primaryCtaUrl: "/competition/exam",
    secondaryCtaLabel: "Learn More",
    secondaryCtaUrl: "#",
    showSecondaryCta: true,
    stats: [
      { label: "Participants", value: "2,400+", icon: "Users" },
      { label: "Prize Pool", value: "৳5L", icon: "Trophy" },
    ],
    badgeText: "Registration Open",
    badgeColor: "#10b981",
    showBadge: true,
    metaTitle: "",
    metaDescription: "",
    published: true,
    displayOrder: 1,
    createdAt: "",
    updatedAt: "",
  },
];

export default function AdminEventsPage() {
  const [banners, setBanners] = useState<EventBannerConfig[]>(demoBanners);
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<EventBannerFormData>({ ...emptyForm });
  const [activeTab, setActiveTab] = useState<"content" | "design" | "settings">("content");
  const [previewMode, setPreviewMode] = useState(false);
  const [search, setSearch] = useState("");

  // Build a preview config from form
  const previewConfig: EventBannerConfig = {
    id: "preview",
    eventId: form.eventId || "preview",
    eventTitle: form.eventTitle || form.headline,
    ...form,
    createdAt: "",
    updatedAt: "",
  };

  const filtered = banners.filter(
    (b) =>
      !search ||
      b.headline.toLowerCase().includes(search.toLowerCase()) ||
      b.eventTitle.toLowerCase().includes(search.toLowerCase())
  );

  const updateForm = useCallback(
    (updates: Partial<EventBannerFormData>) => {
      setForm((prev) => ({ ...prev, ...updates }));
    },
    []
  );

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm });
    setPreviewMode(false);
    setShowBuilder(true);
  };

  const openEdit = (banner: EventBannerConfig) => {
    setEditingId(banner.id);
    setForm({
      headline: banner.headline,
      subheadline: banner.subheadline,
      description: banner.description,
      backgroundImage: banner.backgroundImage,
      backgroundColor: banner.backgroundColor,
      overlayType: banner.overlayType,
      overlayOpacity: banner.overlayOpacity,
      layoutType: banner.layoutType,
      textAlign: banner.textAlign,
      textColor: banner.textColor,
      accentColor: banner.accentColor,
      showDate: banner.showDate,
      startDate: banner.startDate,
      endDate: banner.endDate,
      dateLabel: banner.dateLabel,
      location: banner.location,
      showLocation: banner.showLocation,
      primaryCtaLabel: banner.primaryCtaLabel,
      primaryCtaUrl: banner.primaryCtaUrl,
      secondaryCtaLabel: banner.secondaryCtaLabel,
      secondaryCtaUrl: banner.secondaryCtaUrl,
      showSecondaryCta: banner.showSecondaryCta,
      stats: banner.stats.map((s) => ({ ...s })),
      badgeText: banner.badgeText,
      badgeColor: banner.badgeColor,
      showBadge: banner.showBadge,
      metaTitle: banner.metaTitle,
      metaDescription: banner.metaDescription,
      published: banner.published,
      displayOrder: banner.displayOrder,
    });
    setPreviewMode(false);
    setShowBuilder(true);
  };

  const handleSave = () => {
    if (!form.headline) return;

    const data: EventBannerConfig = {
      ...form,
      id: editingId || `banner-${Date.now()}`,
      eventId: form.eventId || `event-${Date.now()}`,
      eventTitle: form.eventTitle || form.headline,
      createdAt: editingId
        ? banners.find((b) => b.id === editingId)?.createdAt || ""
        : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (editingId) {
      setBanners((prev) =>
        prev.map((b) => (b.id === editingId ? data : b))
      );
    } else {
      setBanners((prev) => [...prev, data]);
    }
    setShowBuilder(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this event banner?")) {
      setBanners((prev) => prev.filter((b) => b.id !== id));
    }
  };

  const handleDuplicate = (banner: EventBannerConfig) => {
    const dup: EventBannerConfig = {
      ...banner,
      id: `banner-${Date.now()}`,
      headline: banner.headline + " (Copy)",
      displayOrder: banners.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setBanners((prev) => [...prev, dup]);
  };

  const addStat = () => {
    setForm((prev) => ({
      ...prev,
      stats: [...prev.stats, { label: "", value: "", icon: "Users" }],
    }));
  };

  const removeStat = (i: number) => {
    setForm((prev) => ({
      ...prev,
      stats: prev.stats.filter((_, idx) => idx !== i),
    }));
  };

  const updateStat = (i: number, key: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      stats: prev.stats.map((s, idx) =>
        idx === i ? { ...s, [key]: value } : s
      ),
    }));
  };

  const inputClasses = cn(
    "w-full bg-bicta-void border border-bicta-border text-bicta-cream",
    "font-body text-sm px-3 py-2 rounded-lg outline-none",
    "focus:border-bicta-gold transition-colors placeholder:text-bicta-subtle/40"
  );
  const labelClasses =
    "block font-body text-[0.65rem] uppercase tracking-[0.15em] text-bicta-subtle mb-1.5";
  const sectionTitle =
    "font-body text-xs font-medium text-bicta-cream uppercase tracking-wider mb-4";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-bicta-cream mb-1">
            Event Banners
          </h1>
          <p className="font-body text-sm text-bicta-subtle">
            Create and manage customizable event banners for the frontend.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-bicta-gold text-bicta-void font-body font-medium text-xs uppercase tracking-wider rounded-lg hover:shadow-cta-glow transition-all"
        >
          <Plus size={14} /> Create Banner
        </button>
      </div>

      {/* Banner List */}
      {!showBuilder && (
        <>
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-bicta-subtle"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search banners..."
              className={cn(inputClasses, "pl-9")}
            />
          </div>

          <div className="space-y-3">
            {filtered.map((banner) => (
              <div
                key={banner.id}
                className="bg-bicta-surface border border-bicta-border rounded-xl p-4 hover:border-bicta-border-hover transition-colors"
              >
                <div className="flex items-start gap-4">
                  {/* Preview thumbnail */}
                  <div
                    className="w-20 h-14 rounded-lg border border-bicta-border shrink-0 overflow-hidden"
                    style={{
                      background: banner.backgroundImage
                        ? undefined
                        : banner.backgroundColor,
                    }}
                  >
                    {banner.backgroundImage && (
                      <img
                        src={banner.backgroundImage}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-body text-sm font-medium text-bicta-cream">
                        {banner.headline}
                      </span>
                      {!banner.published && (
                        <span className="text-[0.6rem] uppercase tracking-wider bg-bicta-raised text-bicta-subtle px-1.5 py-0.5 rounded">
                          Draft
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs font-body text-bicta-subtle">
                      <span>Layout: {banner.layoutType}</span>
                      <span>Overlay: {banner.overlayType}</span>
                      <span>Order: {banner.displayOrder}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => openEdit(banner)}
                      className="p-1.5 text-bicta-subtle hover:text-bicta-gold transition-colors rounded hover:bg-bicta-raised"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDuplicate(banner)}
                      className="p-1.5 text-bicta-subtle hover:text-bicta-gold transition-colors rounded hover:bg-bicta-raised"
                    >
                      <Copy size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(banner.id)}
                      className="p-1.5 text-bicta-subtle hover:text-red-400 transition-colors rounded hover:bg-red-500/5"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Banner Builder */}
      {showBuilder && (
        <div className="space-y-6">
          {/* Builder Header */}
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl text-bicta-cream">
              {editingId ? "Edit Banner" : "Create Banner"}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className={cn(
                  "px-3 py-1.5 text-xs font-body font-medium uppercase tracking-wider rounded-lg border transition-all",
                  previewMode
                    ? "bg-bicta-gold/10 border-bicta-gold/25 text-bicta-gold"
                    : "bg-bicta-raised border-bicta-border text-bicta-subtle"
                )}
              >
                {previewMode ? "Hide Preview" : "Live Preview"}
              </button>
              <button
                onClick={() => setShowBuilder(false)}
                className="p-1.5 text-bicta-subtle hover:text-bicta-cream transition-colors rounded hover:bg-bicta-raised"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-bicta-border pb-0">
            {[
              { id: "content" as const, label: "Content", icon: Type },
              { id: "design" as const, label: "Design", icon: Palette },
              { id: "settings" as const, label: "Settings", icon: Settings },
            ].map((tab) => (
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

          {/* Live Preview */}
          {previewMode && (
            <div className="border border-bicta-border rounded-xl overflow-hidden">
              <div className="bg-bicta-raised px-4 py-2 border-b border-bicta-border">
                <span className="text-[0.6rem] uppercase tracking-wider text-bicta-subtle font-body">
                  Live Preview
                </span>
              </div>
              <div className="max-h-[500px] overflow-hidden">
                <EventBanner config={previewConfig} variant="hero" />
              </div>
            </div>
          )}

          {/* Tab Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Form */}
            <div className="space-y-6">
              {/* CONTENT TAB */}
              {activeTab === "content" && (
                <>
                  <div>
                    <h3 className={sectionTitle}>Event Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className={labelClasses}>Event Title</label>
                        <input
                          value={form.eventTitle}
                          onChange={(e) =>
                            updateForm({ eventTitle: e.target.value })
                          }
                          placeholder="AI Olympiad 2026"
                          className={inputClasses}
                        />
                      </div>
                      <div>
                        <label className={labelClasses}>
                          Headline <span className="text-red-400">*</span>
                        </label>
                        <input
                          value={form.headline}
                          onChange={(e) =>
                            updateForm({ headline: e.target.value })
                          }
                          placeholder="Main banner headline"
                          className={inputClasses}
                        />
                      </div>
                      <div>
                        <label className={labelClasses}>Subheadline</label>
                        <input
                          value={form.subheadline}
                          onChange={(e) =>
                            updateForm({ subheadline: e.target.value })
                          }
                          placeholder="Short tagline below headline"
                          className={inputClasses}
                        />
                      </div>
                      <div>
                        <label className={labelClasses}>Description</label>
                        <textarea
                          value={form.description}
                          onChange={(e) =>
                            updateForm({ description: e.target.value })
                          }
                          rows={3}
                          placeholder="Event description..."
                          className={cn(inputClasses, "resize-none")}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className={sectionTitle}>Date & Location</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelClasses}>Start Date</label>
                        <input
                          type="date"
                          value={form.startDate}
                          onChange={(e) =>
                            updateForm({ startDate: e.target.value })
                          }
                          className={inputClasses}
                        />
                      </div>
                      <div>
                        <label className={labelClasses}>End Date</label>
                        <input
                          type="date"
                          value={form.endDate}
                          onChange={(e) =>
                            updateForm({ endDate: e.target.value })
                          }
                          className={inputClasses}
                        />
                      </div>
                    </div>
                    <div className="mt-3">
                      <label className={labelClasses}>Location</label>
                      <input
                        value={form.location}
                        onChange={(e) =>
                          updateForm({ location: e.target.value })
                        }
                        placeholder="Dhaka, Bangladesh"
                        className={inputClasses}
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className={sectionTitle}>Call to Action</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelClasses}>Primary CTA Label</label>
                        <input
                          value={form.primaryCtaLabel}
                          onChange={(e) =>
                            updateForm({ primaryCtaLabel: e.target.value })
                          }
                          placeholder="Register Now"
                          className={inputClasses}
                        />
                      </div>
                      <div>
                        <label className={labelClasses}>Primary CTA URL</label>
                        <input
                          value={form.primaryCtaUrl}
                          onChange={(e) =>
                            updateForm({ primaryCtaUrl: e.target.value })
                          }
                          placeholder="/events/ai-olympiad"
                          className={inputClasses}
                        />
                      </div>
                    </div>
                    <label className="flex items-center gap-2 mt-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.showSecondaryCta}
                        onChange={(e) =>
                          updateForm({ showSecondaryCta: e.target.checked })
                        }
                        className="accent-bicta-gold"
                      />
                      <span className="font-body text-sm text-bicta-muted">
                        Show secondary CTA
                      </span>
                    </label>
                    {form.showSecondaryCta && (
                      <div className="grid grid-cols-2 gap-3 mt-3">
                        <div>
                          <label className={labelClasses}>
                            Secondary CTA Label
                          </label>
                          <input
                            value={form.secondaryCtaLabel}
                            onChange={(e) =>
                              updateForm({
                                secondaryCtaLabel: e.target.value,
                              })
                            }
                            placeholder="Learn More"
                            className={inputClasses}
                          />
                        </div>
                        <div>
                          <label className={labelClasses}>
                            Secondary CTA URL
                          </label>
                          <input
                            value={form.secondaryCtaUrl}
                            onChange={(e) =>
                              updateForm({
                                secondaryCtaUrl: e.target.value,
                              })
                            }
                            placeholder="#details"
                            className={inputClasses}
                        />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Badge */}
                  <div>
                    <h3 className={sectionTitle}>Badge</h3>
                    <label className="flex items-center gap-2 mb-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.showBadge}
                        onChange={(e) =>
                          updateForm({ showBadge: e.target.checked })
                        }
                        className="accent-bicta-gold"
                      />
                      <span className="font-body text-sm text-bicta-muted">
                        Show badge
                      </span>
                    </label>
                    {form.showBadge && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={labelClasses}>Badge Text</label>
                          <input
                            value={form.badgeText}
                            onChange={(e) =>
                              updateForm({ badgeText: e.target.value })
                            }
                            placeholder="Registration Open"
                            className={inputClasses}
                          />
                        </div>
                        <div>
                          <label className={labelClasses}>Badge Color</label>
                          <input
                            type="color"
                            value={form.badgeColor}
                            onChange={(e) =>
                              updateForm({ badgeColor: e.target.value })
                            }
                            className="w-full h-9 rounded-lg cursor-pointer"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  <div>
                    <h3 className={sectionTitle}>Floating Stats</h3>
                    <div className="space-y-2">
                      {form.stats.map((stat, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 bg-bicta-raised rounded-lg p-2"
                        >
                          <input
                            value={stat.label}
                            onChange={(e) =>
                              updateStat(i, "label", e.target.value)
                            }
                            placeholder="Label"
                            className={cn(inputClasses, "flex-1")}
                          />
                          <input
                            value={stat.value}
                            onChange={(e) =>
                              updateStat(i, "value", e.target.value)
                            }
                            placeholder="Value"
                            className={cn(inputClasses, "w-20")}
                          />
                          <select
                            value={stat.icon}
                            onChange={(e) =>
                              updateStat(i, "icon", e.target.value)
                            }
                            className={cn(inputClasses, "w-24")}
                          >
                            {ICON_OPTIONS.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => removeStat(i)}
                            className="p-1.5 text-bicta-subtle hover:text-red-400 transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={addStat}
                        className="flex items-center gap-1.5 text-xs font-body text-bicta-gold hover:text-bicta-gold-lt transition-colors"
                      >
                        <Plus size={12} /> Add Stat
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* DESIGN TAB */}
              {activeTab === "design" && (
                <>
                  <div>
                    <h3 className={sectionTitle}>Background</h3>
                    <div className="space-y-3">
                      <div>
                        <label className={labelClasses}>
                          Background Image URL
                        </label>
                        <input
                          value={form.backgroundImage}
                          onChange={(e) =>
                            updateForm({ backgroundImage: e.target.value })
                          }
                          placeholder="https://..."
                          className={inputClasses}
                        />
                      </div>
                      <div>
                        <label className={labelClasses}>
                          Background Color / Gradient
                        </label>
                        <input
                          value={form.backgroundColor}
                          onChange={(e) =>
                            updateForm({ backgroundColor: e.target.value })
                          }
                          placeholder="linear-gradient(...) or #hex"
                          className={inputClasses}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className={sectionTitle}>Layout</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {LAYOUT_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() =>
                            updateForm({
                              layoutType: opt.value as EventBannerFormData["layoutType"],
                            })
                          }
                          className={cn(
                            "p-3 rounded-lg border text-left transition-all",
                            form.layoutType === opt.value
                              ? "bg-bicta-gold/10 border-bicta-gold/25"
                              : "bg-bicta-raised border-bicta-border hover:border-bicta-border-hover"
                          )}
                        >
                          <Layout
                            size={16}
                            className={
                              form.layoutType === opt.value
                                ? "text-bicta-gold"
                                : "text-bicta-subtle"
                            }
                          />
                          <span
                            className={cn(
                              "block text-xs font-body mt-1",
                              form.layoutType === opt.value
                                ? "text-bicta-cream"
                                : "text-bicta-muted"
                            )}
                          >
                            {opt.label}
                          </span>
                          <span className="block text-[0.6rem] text-bicta-subtle">
                            {opt.desc}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className={sectionTitle}>Overlay</h3>
                    <div className="space-y-3">
                      <div>
                        <label className={labelClasses}>Overlay Type</label>
                        <div className="grid grid-cols-2 gap-2">
                          {OVERLAY_OPTIONS.map((opt) => (
                            <button
                              key={opt.value}
                              onClick={() =>
                                updateForm({
                                  overlayType: opt.value as EventBannerFormData["overlayType"],
                                })
                              }
                              className={cn(
                                "px-3 py-2 rounded-lg border text-xs font-body transition-all",
                                form.overlayType === opt.value
                                  ? "bg-bicta-gold/10 border-bicta-gold/25 text-bicta-gold"
                                  : "bg-bicta-raised border-bicta-border text-bicta-muted"
                              )}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className={labelClasses}>
                          Overlay Opacity: {form.overlayOpacity}%
                        </label>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={form.overlayOpacity}
                          onChange={(e) =>
                            updateForm({
                              overlayOpacity: parseInt(e.target.value),
                            })
                          }
                          className="w-full accent-bicta-gold"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className={sectionTitle}>Colors</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelClasses}>Text Color</label>
                        <input
                          type="color"
                          value={form.textColor}
                          onChange={(e) =>
                            updateForm({ textColor: e.target.value })
                          }
                          className="w-full h-9 rounded-lg cursor-pointer"
                        />
                      </div>
                      <div>
                        <label className={labelClasses}>Accent Color</label>
                        <input
                          type="color"
                          value={form.accentColor}
                          onChange={(e) =>
                            updateForm({ accentColor: e.target.value })
                          }
                          className="w-full h-9 rounded-lg cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className={sectionTitle}>Text Alignment</h3>
                    <div className="flex gap-2">
                      {ALIGN_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() =>
                            updateForm({
                              textAlign: opt.value as EventBannerFormData["textAlign"],
                            })
                          }
                          className={cn(
                            "flex-1 px-3 py-2 rounded-lg border text-xs font-body transition-all",
                            form.textAlign === opt.value
                              ? "bg-bicta-gold/10 border-bicta-gold/25 text-bicta-gold"
                              : "bg-bicta-raised border-bicta-border text-bicta-muted"
                          )}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* SETTINGS TAB */}
              {activeTab === "settings" && (
                <>
                  <div>
                    <h3 className={sectionTitle}>Visibility</h3>
                    <div className="space-y-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.published}
                          onChange={(e) =>
                            updateForm({ published: e.target.checked })
                          }
                          className="accent-bicta-gold"
                        />
                        <span className="font-body text-sm text-bicta-muted">
                          Published (visible on frontend)
                        </span>
                      </label>
                      <div>
                        <label className={labelClasses}>Display Order</label>
                        <input
                          type="number"
                          value={form.displayOrder}
                          onChange={(e) =>
                            updateForm({
                              displayOrder:
                                parseInt(e.target.value) || 0,
                            })
                          }
                          className={inputClasses}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className={sectionTitle}>SEO</h3>
                    <div className="space-y-3">
                      <div>
                        <label className={labelClasses}>Meta Title</label>
                        <input
                          value={form.metaTitle}
                          onChange={(e) =>
                            updateForm({ metaTitle: e.target.value })
                          }
                          className={inputClasses}
                        />
                      </div>
                      <div>
                        <label className={labelClasses}>
                          Meta Description
                        </label>
                        <textarea
                          value={form.metaDescription}
                          onChange={(e) =>
                            updateForm({
                              metaDescription: e.target.value,
                            })
                          }
                          rows={3}
                          className={cn(inputClasses, "resize-none")}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Right: Mini Preview (always visible) */}
            <div className="hidden lg:block">
              <div className="sticky top-8 space-y-4">
                <div className="bg-bicta-surface border border-bicta-border rounded-xl overflow-hidden">
                  <div className="bg-bicta-raised px-4 py-2 border-b border-bicta-border flex items-center justify-between">
                    <span className="text-[0.6rem] uppercase tracking-wider text-bicta-subtle font-body">
                      Mini Preview
                    </span>
                    <span className="text-[0.6rem] font-body text-bicta-subtle">
                      {form.layoutType} · {form.overlayType}
                    </span>
                  </div>
                  <div
                    className="h-64 overflow-hidden"
                    style={{
                      background: form.backgroundImage
                        ? undefined
                        : form.backgroundColor,
                    }}
                  >
                    {form.backgroundImage ? (
                      <img
                        src={form.backgroundImage}
                        alt=""
                        className="w-full h-full object-cover opacity-60"
                      />
                    ) : null}
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(to top, rgba(10,10,10,0.9) 0%, transparent 60%)`,
                      }}
                    />
                    <div className="relative h-full flex flex-col justify-end p-4">
                      {form.showBadge && form.badgeText && (
                        <span
                          className="self-start px-2 py-0.5 rounded-full text-[0.5rem] uppercase tracking-wider font-body mb-2"
                          style={{
                            background: form.badgeColor + "20",
                            color: form.badgeColor,
                          }}
                        >
                          {form.badgeText}
                        </span>
                      )}
                      <h4
                        className="font-display text-sm mb-0.5"
                        style={{ color: form.textColor }}
                      >
                        {form.headline || "Your Headline"}
                      </h4>
                      {form.subheadline && (
                        <p
                          className="text-[0.6rem] mb-1"
                          style={{ color: form.accentColor }}
                        >
                          {form.subheadline}
                        </p>
                      )}
                      {form.primaryCtaLabel && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-bicta-gold text-bicta-void text-[0.5rem] uppercase tracking-wider font-body">
                          {form.primaryCtaLabel}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Save / Cancel */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowBuilder(false)}
                    className="flex-1 px-4 py-2.5 border border-bicta-border text-bicta-muted font-body text-sm rounded-lg hover:border-bicta-gold/30 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={!form.headline}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-bicta-gold text-bicta-void",
                      "font-body font-medium text-sm rounded-lg transition-all",
                      "disabled:opacity-50 disabled:pointer-events-none",
                      "hover:shadow-cta-glow"
                    )}
                  >
                    <Save size={14} />
                    {editingId ? "Update Banner" : "Create Banner"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
