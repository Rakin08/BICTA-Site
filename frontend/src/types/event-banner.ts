// ═══════════════════════════════════════════════════════════════
//  Customizable Event Banner Types
// ═══════════════════════════════════════════════════════════════

export type BannerOverlayType =
  | "gradient-dark"
  | "gradient-gold"
  | "solid-dark"
  | "blur"
  | "none";

export type BannerLayoutType =
  | "full-bleed"      // Full-width background image (CEPIS style)
  | "split"           // Left text, right image (BIIN style)
  | "centered"        // Centered text on bg (P@SHA style)
  | "floating-stats"; // With stat cards floating at bottom (BIIN style)

export type BannerTextAlign = "left" | "center" | "right";

export interface EventBannerConfig {
  id: string;
  eventId: string;
  eventTitle: string;

  // Hero content
  headline: string;
  subheadline: string;
  description: string;

  // Background
  backgroundImage: string;
  backgroundColor: string;
  overlayType: BannerOverlayType;
  overlayOpacity: number; // 0-100

  // Layout
  layoutType: BannerLayoutType;
  textAlign: BannerTextAlign;
  textColor: string;
  accentColor: string;

  // Date & Location
  showDate: boolean;
  startDate: string;
  endDate: string;
  dateLabel: string;
  location: string;
  showLocation: boolean;

  // CTAs
  primaryCtaLabel: string;
  primaryCtaUrl: string;
  secondaryCtaLabel: string;
  secondaryCtaUrl: string;
  showSecondaryCta: boolean;

  // Floating stats (for floating-stats layout)
  stats: Array<{
    label: string;
    value: string;
    icon?: string;
  }>;

  // Badge
  badgeText: string;
  badgeColor: string;
  showBadge: boolean;

  // SEO
  metaTitle: string;
  metaDescription: string;

  // Visibility
  published: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface EventBannerFormData
  extends Omit<
    EventBannerConfig,
    "id" | "eventId" | "createdAt" | "updatedAt"
  > {
  id?: string;
  eventId?: string;
}
