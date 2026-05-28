"use client";

import Link from "next/link";
import { Linkedin, Twitter, Facebook, Youtube } from "lucide-react";
import FooterMarquee from "@/components/FooterMarquee";
import type { SanitySupportedByItem, SanityPartner } from "@/types";

interface SiteFooterProps {
  supporters?: (SanitySupportedByItem | SanityPartner)[];
}

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "Events", href: "/events" },
  { label: "Programs", href: "/programs" },
  { label: "Partners", href: "/partners" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const socialLinks = [
  { label: "LinkedIn", href: "#", icon: Linkedin },
  { label: "X", href: "#", icon: Twitter },
  { label: "Facebook", href: "#", icon: Facebook },
  { label: "YouTube", href: "#", icon: Youtube },
];

export default function SiteFooter({ supporters }: SiteFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative w-full">
      {/* Supporter Marquee */}
      <FooterMarquee supporters={supporters ?? []} />

      {/* Main Footer */}
      <div
        className="bg-bicta-raised"
        style={{ borderTop: "1px solid rgba(201,168,76,0.3)" }}
      >
        <div
          className="mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20"
          style={{ maxWidth: 1280 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* Column 1 — Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="font-display font-medium text-bicta-cream text-xl tracking-tight">
                  BICTA
                </span>
                <span className="w-px h-4 bg-bicta-gold" />
                <span className="font-body font-medium text-[0.6875rem] uppercase tracking-[0.15em] text-bicta-gold">
                  ELITE
                </span>
              </div>
              <p className="font-body font-light text-[0.875rem] text-bicta-subtle mb-6">
                Elevating Bangladesh&apos;s Tech Ecosystem
              </p>
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-bicta-subtle hover:text-bicta-gold transition-colors duration-200"
                    title={social.label}
                  >
                    <social.icon size={20} strokeWidth={1.5} />
                  </a>
                ))}
              </div>
            </div>

            {/* Column 2 — Navigation */}
            <div>
              <div className="font-body font-medium text-[0.6875rem] uppercase tracking-[0.15em] text-bicta-gold mb-4">
                Navigation
              </div>
              <div className="flex flex-col gap-3">
                {footerLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="font-body font-normal text-[0.875rem] text-bicta-cream hover:text-bicta-gold transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Column 3 — Contact */}
            <div>
              <div className="font-body font-medium text-[0.6875rem] uppercase tracking-[0.15em] text-bicta-gold mb-4">
                Contact
              </div>
              <Link
                href="mailto:info@bicta.org"
                className="block font-body font-normal text-[0.875rem] text-bicta-cream hover:text-bicta-gold transition-colors duration-200 mb-2"
              >
                info@bicta.org
              </Link>
              <div className="font-body font-normal text-[0.875rem] text-bicta-subtle">
                Dhaka, Bangladesh
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div
            className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6"
            style={{ borderTop: "1px solid rgba(138,134,128,0.2)" }}
          >
            <div className="font-body font-normal text-[0.75rem] text-bicta-subtle">
              &copy; {currentYear} BICTA Elite. All rights reserved.
            </div>
            <div className="font-body font-normal text-[0.75rem] text-bicta-subtle">
              Crafted with precision
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
