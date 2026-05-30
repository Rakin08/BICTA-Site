"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Events", href: "/events" },
  { label: "Programs", href: "/programs" },
  { label: "Partners", href: "/partners" },
  { label: "About", href: "/about" },
  { label: "Alumni", href: "/alumni" },
];

export default function SiteNav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAdmin, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-bicta-raised/90 backdrop-blur-md"
            : "bg-transparent"
        )}
      >
        <div
          className="mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8"
          style={{ maxWidth: 1280, height: 64 }}
        >
          {/* Wordmark */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
          >
            <span className="font-display font-medium text-bicta-cream text-xl tracking-tight transition-all duration-300 group-hover:tracking-wider">
              BICTA
            </span>
            <span className="w-px h-4 bg-bicta-gold" />
            <span className="font-body font-medium text-[0.6875rem] uppercase tracking-[0.15em] text-bicta-gold">
              ELITE
            </span>
          </Link>

          {/* Center Links — Desktop */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative font-body font-medium text-[0.8125rem] uppercase tracking-[0.05em] transition-colors duration-200 group",
                  pathname === link.href
                    ? "text-bicta-gold"
                    : "text-bicta-muted hover:text-bicta-gold"
                )}
              >
                {link.label}
                <span
                  className={cn(
                    "absolute left-0 bottom-[-4px] h-[2px] w-full bg-bicta-gold origin-left transition-transform duration-200",
                    pathname === link.href
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  )}
                />
              </Link>
            ))}
            {isAdmin && (
              <Link
                href="/admin"
                className="relative font-body font-medium text-[0.8125rem] uppercase tracking-[0.05em] text-bicta-gold hover:text-bicta-gold-lt transition-colors duration-200 flex items-center gap-1.5"
              >
                <Shield size={13} /> CMS
              </Link>
            )}
          </div>

          {/* Right — Auth */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-[0.6875rem] text-bicta-muted">
                  {user?.name || user?.email}
                </span>
                <button
                  onClick={logout}
                  className="font-body font-medium text-[0.75rem] uppercase tracking-[0.05em] text-bicta-subtle hover:text-bicta-gold transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="font-body font-medium text-[0.875rem] uppercase tracking-[0.08em] text-bicta-gold border border-bicta-gold px-6 py-2.5 transition-all duration-250 hover:bg-bicta-gold hover:text-bicta-void"
              >
                Login
              </Link>
            )}
          </div>

          {/* Hamburger — Mobile */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={cn(
                "block w-6 h-px bg-bicta-cream transition-all duration-300",
                mobileOpen && "rotate-45 translate-y-[3.5px]"
              )}
            />
            <span
              className={cn(
                "block w-6 h-px bg-bicta-cream transition-all duration-300",
                mobileOpen && "-rotate-45 -translate-y-[3.5px]"
              )}
            />
          </button>
        </div>
      </nav>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-bicta-raised flex flex-col items-center justify-center gap-8 md:hidden">
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "font-display font-normal text-[2rem] transition-colors duration-200",
                pathname === link.href
                  ? "text-bicta-gold"
                  : "text-bicta-cream hover:text-bicta-gold"
              )}
              style={{
                animation: `fadeInUp 0.4s ease forwards`,
                animationDelay: `${i * 0.05}s`,
                opacity: 0,
              }}
            >
              {link.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin"
              className="font-display font-normal text-[2rem] text-bicta-gold hover:text-bicta-gold-lt transition-colors duration-200 flex items-center gap-2"
              style={{
                animation: `fadeInUp 0.4s ease forwards`,
                animationDelay: `${navLinks.length * 0.05}s`,
                opacity: 0,
              }}
            >
              <Shield size={20} /> CMS
            </Link>
          )}
          {isAuthenticated ? (
            <button
              onClick={logout}
              className="font-display font-normal text-[1.5rem] text-bicta-subtle hover:text-red-400 transition-colors duration-200"
              style={{
                animation: `fadeInUp 0.4s ease forwards`,
                animationDelay: `${(navLinks.length + 1) * 0.05}s`,
                opacity: 0,
              }}
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="font-display font-normal text-[1.5rem] text-bicta-gold hover:text-bicta-gold-lt transition-colors duration-200"
              style={{
                animation: `fadeInUp 0.4s ease forwards`,
                animationDelay: `${(navLinks.length + 1) * 0.05}s`,
                opacity: 0,
              }}
            >
              Login
            </Link>
          )}
          <style>{`
            @keyframes fadeInUp {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </div>
      )}
    </>
  );
}
