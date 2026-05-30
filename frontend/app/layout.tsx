import type { Metadata } from "next";
import "@/app/globals.css";
import SiteNav from "@/components/layout/SiteNav";
import SiteFooter from "@/components/layout/SiteFooter";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: { default: "BICTA — Bangladesh ICT Alliance", template: "%s | BICTA" },
  description: "Bridging academia and industry through flagship national programs.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <SiteNav />
        <main>{children}</main>
        <SiteFooter />
        <ScrollReveal />
      </body>
    </html>
  );
}
