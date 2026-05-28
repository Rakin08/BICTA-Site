"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import { cn } from "@/lib/utils";

const statusFilters = [
  { value: "", label: "All Status" },
  { value: "registration_open", label: "Registration Open" },
  { value: "scheduled", label: "Upcoming" },
  { value: "live", label: "Live Now" },
  { value: "completed", label: "Completed" },
];

const typeFilters = [
  { value: "", label: "All Types" },
  { value: "competition", label: "Competition" },
  { value: "datathon", label: "Datathon" },
  { value: "workshop", label: "Workshop" },
  { value: "olympiad", label: "Olympiad" },
  { value: "summit", label: "Summit" },
];

const modeFilters = [
  { value: "", label: "All Modes" },
  { value: "online", label: "Online" },
  { value: "offline", label: "Offline" },
  { value: "hybrid", label: "Hybrid" },
];

export default function EventFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentStatus = searchParams.get("status") || "";
  const currentType = searchParams.get("type") || "";
  const currentMode = searchParams.get("mode") || "";

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      // Reset pagination on filter change
      params.delete("page");
      return params.toString();
    },
    [searchParams]
  );

  const updateFilter = (name: string, value: string) => {
    const query = createQueryString(name, value);
    router.push(`${pathname}${query ? `?${query}` : ""}`);
  };

  const hasActiveFilters = currentStatus || currentType || currentMode;

  const resetFilters = () => {
    router.push(pathname);
  };

  const FilterSelect = ({
    label,
    options,
    value,
    onChange,
  }: {
    label: string;
    options: { value: string; label: string }[];
    value: string;
    onChange: (val: string) => void;
  }) => (
    <div className="flex flex-col gap-1.5">
      <label className="font-body text-[0.6875rem] uppercase tracking-[0.15em] text-bicta-subtle">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "bg-bicta-surface border border-bicta-border text-bicta-cream",
          "font-body text-sm px-3 py-2.5 rounded-md outline-none",
          "focus:border-bicta-gold transition-colors cursor-pointer",
          "appearance-none pr-8"
        )}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238a8680' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 10px center",
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 mb-8">
      <div className="flex flex-col sm:flex-row gap-4 flex-1">
        <FilterSelect
          label="Status"
          options={statusFilters}
          value={currentStatus}
          onChange={(val) => updateFilter("status", val)}
        />
        <FilterSelect
          label="Type"
          options={typeFilters}
          value={currentType}
          onChange={(val) => updateFilter("type", val)}
        />
        <FilterSelect
          label="Mode"
          options={modeFilters}
          value={currentMode}
          onChange={(val) => updateFilter("mode", val)}
        />
      </div>

      {hasActiveFilters && (
        <button
          onClick={resetFilters}
          className="font-body text-sm text-bicta-gold hover:text-bicta-gold-lt underline underline-offset-4 transition-colors"
        >
          Reset Filters
        </button>
      )}
    </div>
  );
}
