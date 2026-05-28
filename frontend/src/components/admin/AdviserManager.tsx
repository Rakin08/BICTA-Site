"use client";

import { useState, useCallback } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Upload,
  X,
  Save,
  Search,
  Eye,
  EyeOff,
  GripVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AdviserFormData } from "@/types/competition";

const CATEGORIES = [
  "Industry",
  "Academia",
  "Policy",
  "Startup",
  "Technology",
  "Research",
  "Finance",
];

// Demo advisers
const demoAdvisers: AdviserFormData[] = [
  {
    id: "1",
    name: "Dr. Farhan Hussain",
    title: "Chief Strategy Advisor",
    company: "Former VP at Google APAC",
    bio: "20+ years in tech strategy, helped scale 3 unicorn startups across Southeast Asia.",
    expertise: ["Strategy", "Growth", "Venture Capital"],
    imageUrl: "",
    linkedInUrl: "https://linkedin.com/in/farhan",
    twitterUrl: "",
    websiteUrl: "",
    category: "Industry",
    displayOrder: 1,
    featured: true,
    published: true,
  },
  {
    id: "2",
    name: "Nadia Rahman",
    title: "Head of Engineering Mentorship",
    company: "Principal Engineer at Meta",
    bio: "Leading large-scale systems design with expertise in distributed architectures.",
    expertise: ["Systems Design", "AI/ML", "Leadership"],
    imageUrl: "",
    linkedInUrl: "https://linkedin.com/in/nadia",
    twitterUrl: "",
    websiteUrl: "",
    category: "Technology",
    displayOrder: 2,
    featured: true,
    published: true,
  },
  {
    id: "3",
    name: "Kamal Ahmed",
    title: "Advisor on Product Innovation",
    company: "CPO at Pathao",
    bio: "Product-led growth expert with multiple exits and a passion for emerging markets.",
    expertise: ["Product", "Growth", "UX"],
    imageUrl: "",
    linkedInUrl: "https://linkedin.com/in/kamal",
    twitterUrl: "",
    websiteUrl: "",
    category: "Startup",
    displayOrder: 3,
    featured: true,
    published: true,
  },
];

const emptyForm: AdviserFormData = {
  name: "",
  title: "",
  company: "",
  bio: "",
  expertise: [],
  imageUrl: "",
  linkedInUrl: "",
  twitterUrl: "",
  websiteUrl: "",
  category: "Industry",
  displayOrder: 0,
  featured: true,
  published: true,
};

export default function AdviserManager() {
  const [advisers, setAdvisers] = useState<AdviserFormData[]>(demoAdvisers);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AdviserFormData>({ ...emptyForm });
  const [expertiseInput, setExpertiseInput] = useState("");

  const filtered = advisers.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm });
    setExpertiseInput("");
    setShowForm(true);
  };

  const openEdit = (adviser: AdviserFormData) => {
    setEditingId(adviser.id || null);
    setForm({ ...adviser });
    setExpertiseInput(adviser.expertise.join(", "));
    setShowForm(true);
  };

  const handleSave = () => {
    const expertise = expertiseInput
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean);
    const data = { ...form, expertise };

    if (editingId) {
      setAdvisers((prev) =>
        prev.map((a) => (a.id === editingId ? { ...data, id: editingId } : a))
      );
    } else {
      setAdvisers((prev) => [
        ...prev,
        { ...data, id: `adv-${Date.now()}` },
      ]);
    }
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this adviser?")) {
      setAdvisers((prev) => prev.filter((a) => a.id !== id));
    }
  };

  const togglePublished = (id: string) => {
    setAdvisers((prev) =>
      prev.map((a) => (a.id === id ? { ...a, published: !a.published } : a))
    );
  };

  const toggleFeatured = (id: string) => {
    setAdvisers((prev) =>
      prev.map((a) => (a.id === id ? { ...a, featured: !a.featured } : a))
    );
  };

  const inputClasses = cn(
    "w-full bg-bicta-void border border-bicta-border text-bicta-cream",
    "font-body text-sm px-3 py-2 rounded-lg outline-none",
    "focus:border-bicta-gold transition-colors placeholder:text-bicta-subtle/40"
  );

  const labelClasses =
    "block font-body text-[0.65rem] uppercase tracking-[0.15em] text-bicta-subtle mb-1.5";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg text-bicta-cream mb-1">
            Advisers
          </h2>
          <p className="font-body text-xs text-bicta-subtle">
            Manage advisers shown on the frontend. {advisers.length} total.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-bicta-gold text-bicta-void font-body font-medium text-xs uppercase tracking-wider rounded-lg hover:shadow-cta-glow transition-all"
        >
          <Plus size={14} /> Add Adviser
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-bicta-subtle"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, title, or category..."
          className={cn(inputClasses, "pl-9")}
        />
      </div>

      {/* Adviser List */}
      <div className="space-y-3">
        {filtered.map((adviser) => (
          <div
            key={adviser.id}
            className="bg-bicta-surface border border-bicta-border rounded-xl p-4 hover:border-bicta-border-hover transition-colors"
          >
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-bicta-raised border border-bicta-border flex items-center justify-center shrink-0">
                {adviser.imageUrl ? (
                  <img
                    src={adviser.imageUrl}
                    alt={adviser.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="font-display text-lg text-bicta-gold">
                    {adviser.name.charAt(0)}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-body text-sm font-medium text-bicta-cream">
                    {adviser.name}
                  </span>
                  {!adviser.published && (
                    <span className="text-[0.6rem] uppercase tracking-wider bg-bicta-raised text-bicta-subtle px-1.5 py-0.5 rounded">
                      Draft
                    </span>
                  )}
                  {adviser.featured && (
                    <span className="text-[0.6rem] uppercase tracking-wider bg-bicta-gold/10 text-bicta-gold px-1.5 py-0.5 rounded">
                      Featured
                    </span>
                  )}
                </div>
                <p className="font-body text-xs text-bicta-muted mb-1">
                  {adviser.title}
                  {adviser.company && ` · ${adviser.company}`}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-[0.6rem] uppercase tracking-wider bg-bicta-raised text-bicta-subtle px-1.5 py-0.5 rounded">
                    {adviser.category}
                  </span>
                  <div className="flex gap-1">
                    {adviser.expertise.slice(0, 3).map((e) => (
                      <span
                        key={e}
                        className="text-[0.6rem] text-bicta-gold bg-bicta-gold/8 border border-bicta-gold/12 px-1.5 py-0.5 rounded"
                      >
                        {e}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => togglePublished(adviser.id!)}
                  className="p-1.5 text-bicta-subtle hover:text-bicta-gold transition-colors rounded hover:bg-bicta-raised"
                  title={adviser.published ? "Hide" : "Publish"}
                >
                  {adviser.published ? (
                    <Eye size={14} />
                  ) : (
                    <EyeOff size={14} />
                  )}
                </button>
                <button
                  onClick={() => openEdit(adviser)}
                  className="p-1.5 text-bicta-subtle hover:text-bicta-gold transition-colors rounded hover:bg-bicta-raised"
                  title="Edit"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => handleDelete(adviser.id!)}
                  className="p-1.5 text-bicta-subtle hover:text-red-400 transition-colors rounded hover:bg-red-500/5"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-bicta-subtle font-body text-sm">
            No advisers match your search.
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-bicta-void/80 flex items-center justify-center p-4">
          <div className="bg-bicta-surface border border-bicta-border rounded-2xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl text-bicta-cream">
                {editingId ? "Edit Adviser" : "Add Adviser"}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="p-1.5 text-bicta-subtle hover:text-bicta-cream transition-colors rounded hover:bg-bicta-raised"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>
                  Name <span className="text-red-400">*</span>
                </label>
                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  placeholder="Full name"
                  className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>
                  Title <span className="text-red-400">*</span>
                </label>
                <input
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                  placeholder="e.g. Chief Strategy Advisor"
                  className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>Company</label>
                <input
                  value={form.company}
                  onChange={(e) =>
                    setForm({ ...form, company: e.target.value })
                  }
                  placeholder="e.g. Google"
                  className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>Category</label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className={inputClasses}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className={labelClasses}>Bio</label>
                <textarea
                  value={form.bio}
                  onChange={(e) =>
                    setForm({ ...form, bio: e.target.value })
                  }
                  rows={3}
                  placeholder="Short biography"
                  className={cn(inputClasses, "resize-none")}
                />
              </div>
              <div className="md:col-span-2">
                <label className={labelClasses}>
                  Expertise (comma-separated)
                </label>
                <input
                  value={expertiseInput}
                  onChange={(e) => setExpertiseInput(e.target.value)}
                  placeholder="Strategy, Growth, AI/ML"
                  className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>Image URL</label>
                <input
                  value={form.imageUrl}
                  onChange={(e) =>
                    setForm({ ...form, imageUrl: e.target.value })
                  }
                  placeholder="https://..."
                  className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>LinkedIn URL</label>
                <input
                  value={form.linkedInUrl}
                  onChange={(e) =>
                    setForm({ ...form, linkedInUrl: e.target.value })
                  }
                  placeholder="https://linkedin.com/in/..."
                  className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>Display Order</label>
                <input
                  type="number"
                  value={form.displayOrder}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      displayOrder: parseInt(e.target.value) || 0,
                    })
                  }
                  className={inputClasses}
                />
              </div>
              <div className="flex items-center gap-6 md:col-span-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) =>
                      setForm({ ...form, featured: e.target.checked })
                    }
                    className="accent-bicta-gold"
                  />
                  <span className="font-body text-sm text-bicta-muted">
                    Featured on homepage
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={(e) =>
                      setForm({ ...form, published: e.target.checked })
                    }
                    className="accent-bicta-gold"
                  />
                  <span className="font-body text-sm text-bicta-muted">
                    Published
                  </span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 px-4 py-2.5 border border-bicta-border text-bicta-muted font-body text-sm rounded-lg hover:border-bicta-gold/30 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!form.name || !form.title}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-bicta-gold text-bicta-void",
                  "font-body font-medium text-sm rounded-lg transition-all",
                  "disabled:opacity-50 disabled:pointer-events-none",
                  "hover:shadow-cta-glow"
                )}
              >
                <Save size={14} /> Save Adviser
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
