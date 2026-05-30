"use client";
import { useState } from "react";
import { ADVISORS, FOUNDERS } from "@/lib/static-data";
import PeopleCard from "./PeopleCard";

type Tab = "founders" | "advisors";
type Category = "All" | "Industry" | "Technology" | "Academia" | "Policy" | "Startup";

export default function CoreMembersSection() {
  const [tab, setTab]         = useState<Tab>("founders");
  const [category, setCategory] = useState<Category>("All");

  const publishedAdvisors = ADVISORS.filter(a => a.published);
  const categories: Category[] = ["All", "Industry", "Technology", "Academia", "Policy", "Startup"];
  const filtered = category === "All" ? publishedAdvisors : publishedAdvisors.filter(a => a.category === category);

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-bicta-gold text-xs font-mono tracking-widest uppercase">Our People</span>
          <h2 className="font-display text-4xl text-bicta-cream mt-2">The Minds Behind BICTA</h2>
          <p className="text-bicta-subtle mt-3 max-w-xl mx-auto">Founders, advisors, and industry leaders shaping Bangladesh&apos;s AI future.</p>
        </div>

        {/* Tab selector */}
        <div className="flex gap-2 justify-center mb-10">
          {(["founders", "advisors"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-6 py-2 rounded-full text-sm font-medium border transition-all ${
                tab === t
                  ? "bg-bicta-gold text-bicta-void border-bicta-gold"
                  : "border-bicta-border text-bicta-subtle hover:border-bicta-gold/40"
              }`}>
              {t === "founders" ? "Founders" : "Advisors"}
            </button>
          ))}
        </div>

        {tab === "advisors" && (
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {categories.map(c => (
              <button key={c} onClick={() => setCategory(c)}
                className={`px-4 py-1.5 rounded-full text-xs border transition-all ${
                  category === c
                    ? "bg-bicta-gold/20 text-bicta-gold border-bicta-gold/40"
                    : "border-bicta-border text-bicta-subtle hover:border-bicta-gold/30"
                }`}>
                {c}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tab === "founders"
            ? FOUNDERS.map(f => (
                <PeopleCard key={f.id} name={f.name} role={f.designation} bio={f.bio}
                  imageUrl={f.imageUrl} linkedInUrl={f.linkedInUrl} />
              ))
            : filtered.map(a => (
                <PeopleCard key={a.id} name={a.name} role={`${a.title} — ${a.company}`}
                  bio={a.expertise} imageUrl={a.imageUrl} linkedInUrl={a.linkedIn} />
              ))
          }
          {tab === "advisors" && filtered.length === 0 && (
            <p className="col-span-3 text-center text-bicta-subtle py-12">No advisors in this category yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}
