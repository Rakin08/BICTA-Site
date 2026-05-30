import type { Metadata } from "next";
import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import SiteNav from "@/components/layout/SiteNav";
import SiteFooter from "@/components/layout/SiteFooter";
import Providers from "@/components/Providers";
import ChatBotWrapper from "@/components/chatbot/ChatBotWrapper";
import { sanityFetch } from "@/lib/sanity/client";
import { SUPPORTERS_QUERY } from "@/lib/sanity/queries";
import type { SanityPartner } from "@/types";
import "@/app/globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: {
    default: "BICTA — Bangladesh ICT Alliance",
    template: "%s — BICTA",
  },
  description:
    "BICTA bridges academia and industry through flagship national programs: AI Olympiad, AI for SDG, and Datathon Series.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "BICTA",
  },
  twitter: {
    card: "summary_large_image",
  },
};

async function FooterWithData() {
  const supporters = (await sanityFetch<SanityPartner[]>(
    SUPPORTERS_QUERY,
    undefined,
    ["supporters"]
  )) || [];
  return <SiteFooter supporters={supporters} />;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${jetbrains.variable}`}
    >
      <body className="min-h-screen bg-bicta-void text-bicta-cream antialiased">
        <Providers>
          <SiteNav />
          <main>{children}</main>
          <FooterWithData />
          <ChatBotWrapper />
        </Providers>
        <SpeedInsights />
      </body>
    </html>
  );
}
