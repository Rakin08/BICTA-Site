"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Palette,
  Users,
  Trophy,
  Gavel,
  ChevronLeft,
  Settings,
  Image,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/cms", label: "Site Customizer", icon: Palette },
  { href: "/admin/events", label: "Event Banners", icon: Image },
  { href: "/admin/advisers", label: "Advisers", icon: Users },
  { href: "/admin/competitions", label: "Competitions", icon: Trophy },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/judge", label: "Judge Panel", icon: Gavel },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-bicta-surface border-r border-bicta-border z-40">
      <div className="p-4 border-b border-bicta-border">
        <Link href="/" className="flex items-center gap-2 group">
          <ChevronLeft size={16} className="text-bicta-gold" />
          <span className="font-body text-xs uppercase tracking-wider text-bicta-subtle group-hover:text-bicta-gold transition-colors">
            Back to Site
          </span>
        </Link>
        <div className="flex items-center gap-2 mt-3">
          <div className="w-8 h-8 rounded-lg bg-bicta-gold/10 border border-bicta-gold/20 flex items-center justify-center">
            <Settings size={14} className="text-bicta-gold" />
          </div>
          <span className="font-display text-sm text-bicta-cream">Admin</span>
        </div>
      </div>

      <nav className="p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg font-body text-sm transition-all",
                isActive
                  ? "bg-bicta-gold/10 text-bicta-gold border border-bicta-gold/15"
                  : "text-bicta-muted hover:text-bicta-cream hover:bg-bicta-raised"
              )}
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
