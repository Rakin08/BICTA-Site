"use client";
import { useState, useEffect } from "react";

interface Adviser {
  id: number;
  name: string;
  title: string;
  company: string;
  category: string;
  bio: string;
  imageUrl: string;
  linkedIn: string;
  published: boolean;
  featured: boolean;
}

const EMPTY: Omit<Adviser, "id"> = {
  name: "", title: "", company: "", category: "Industry",
  bio: "", imageUrl: "", linkedIn: "", published: true, featured: false,
};

export default function AdviserManager() {
  const [advisers, setAdvisers] = useState<Adviser[]>([]);
  const [editing, setEditing]   = useState<Adviser | null>(null);
  const [form, setForm]         = useState(EMPTY);
  const [loading, setLoading]   = useState(false);
  const [msg, setMsg]           = useState("");
  const apiUrl = process.env.NEXT_PUBLIC_BICTA_API_URL || "https://bicta-site-production.up.railway.app";

  const load = () => {
    fetch(`${apiUrl}/trpc/adviser.list`, { credentials: "include" })
      .then(r => r.ok ? r.json() : null)
      .then(d => d?.result?.data && setAdvisers(d.result.data))
      .catch(() => {});
  };

  useEffect(load, []);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value }));

  const startEdit = (a: Adviser) => { setEditing(a); setForm({ ...a }); };
  const startNew  = () => { setEditing(null); setForm(EMPTY); };

  const save = async () => {
    setLoading(true); setMsg("");
    const endpoint = editing ? "adviser.update" : "adviser.create";
    const payload  = editing ? { id: editing.id, ...form } : form;
    try {
      const res = await fetch(`${apiUrl}/trpc/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ json: payload }),
      });
      if (!res.ok) throw new Error("Save failed");
      setMsg(editing ? "Updated!" : "Created!");
      setEditing(null); setForm(EMPTY); load();
    } catch (e) {
      setMsg("Error saving — check backend connection");
    } finally {
      setLoading(false);
    }
  };

  const del = async (id: number) => {
    if (!confirm("Delete this adviser?")) return;
    await fetch(`${apiUrl}/trpc/adviser.delete`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      credentials: "include", body: JSON.stringify({ json: { id } }),
    });
    load();
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-display text-3xl text-bicta-cream">Advisers</h1>
        <button onClick={startNew} className="bg-bicta-gold text-bicta-void text-sm font-semibold px-4 py-2 rounded-lg hover:bg-bicta-gold-lt transition-colors">
          + Add adviser
        </button>
      </div>

      {msg && <p className="text-sm mb-4 text-bicta-gold">{msg}</p>}

      {(editing !== null || form !== EMPTY) && (
        <div className="bg-bicta-surface border border-bicta-border rounded-xl p-6 mb-8">
          <h2 className="text-bicta-cream font-medium mb-4">{editing ? "Edit adviser" : "New adviser"}</h2>
          <div className="grid grid-cols-2 gap-4">
            {(["name","title","company","imageUrl","linkedIn"] as const).map(k => (
              <div key={k}>
                <label className="text-bicta-subtle text-xs mb-1 block capitalize">{k.replace(/([A-Z])/g, " $1")}</label>
                <input type="text" value={(form as Record<string,string>)[k]} onChange={set(k)}
                  className="w-full bg-bicta-raised border border-bicta-border rounded-lg px-3 py-2 text-bicta-cream text-sm focus:outline-none focus:border-bicta-gold" />
              </div>
            ))}
            <div>
              <label className="text-bicta-subtle text-xs mb-1 block">Category</label>
              <select value={form.category} onChange={set("category")}
                className="w-full bg-bicta-raised border border-bicta-border rounded-lg px-3 py-2 text-bicta-cream text-sm">
                {["Industry","Technology","Academia","Policy","Startup"].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="text-bicta-subtle text-xs mb-1 block">Bio / Expertise</label>
            <textarea value={form.bio} onChange={set("bio")} rows={3}
              className="w-full bg-bicta-raised border border-bicta-border rounded-lg px-3 py-2 text-bicta-cream text-sm resize-none focus:outline-none focus:border-bicta-gold" />
          </div>
          <div className="flex gap-6 mt-4">
            <label className="flex items-center gap-2 text-sm text-bicta-muted cursor-pointer">
              <input type="checkbox" checked={form.published} onChange={set("published")} className="accent-bicta-gold" />
              Published
            </label>
            <label className="flex items-center gap-2 text-sm text-bicta-muted cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={set("featured")} className="accent-bicta-gold" />
              Featured on homepage
            </label>
          </div>
          <div className="flex gap-3 mt-5">
            <button onClick={save} disabled={loading}
              className="bg-bicta-gold text-bicta-void text-sm font-semibold px-5 py-2 rounded-lg hover:bg-bicta-gold-lt disabled:opacity-50">
              {loading ? "Saving…" : "Save"}
            </button>
            <button onClick={() => { setEditing(null); setForm(EMPTY); }}
              className="border border-bicta-border text-bicta-subtle text-sm px-5 py-2 rounded-lg hover:text-bicta-cream">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {advisers.length === 0 && (
          <p className="text-bicta-subtle text-sm">No advisers yet. Add your first one above.</p>
        )}
        {advisers.map(a => (
          <div key={a.id} className="flex items-center justify-between bg-bicta-surface border border-bicta-border rounded-xl px-4 py-3">
            <div>
              <span className="text-bicta-cream text-sm font-medium">{a.name}</span>
              <span className="text-bicta-subtle text-xs ml-3">{a.title} · {a.company} · {a.category}</span>
              {!a.published && <span className="ml-2 text-xs text-bicta-subtle bg-bicta-raised px-2 py-0.5 rounded-full">Hidden</span>}
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(a)} className="text-xs text-bicta-gold border border-bicta-gold/30 px-3 py-1 rounded-lg hover:bg-bicta-gold/10">Edit</button>
              <button onClick={() => del(a.id)} className="text-xs text-red-400 border border-red-400/30 px-3 py-1 rounded-lg hover:bg-red-400/10">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
