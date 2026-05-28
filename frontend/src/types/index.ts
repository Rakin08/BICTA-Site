// ═══════════════════════════════════════════════════════════════
//  BICTA — Complete TypeScript Type Definitions
// ═══════════════════════════════════════════════════════════════

// ─── tRPC / Drizzle (operational) ─────────────────────────────

export type EventStatus =
  | "draft"
  | "scheduled"
  | "registration_open"
  | "registration_closed"
  | "live"
  | "completed"
  | "cancelled"
  | "postponed";

export type EventType =
  | "competition"
  | "datathon"
  | "workshop"
  | "olympiad"
  | "summit"
  | "webinar"
  | "conference"
  | "hackathon";

export type EventMode = "online" | "offline" | "hybrid";

export interface EventListItem {
  id: number;
  title: string;
  slug: string;
  summary: string | null;
  eventType: EventType | null;
  mode: EventMode | null;
  status: EventStatus | null;
  startDate: string | null;
  endDate: string | null;
  venue: string | null;
  imageUrl: string | null;
  featured: boolean | null;
  registrationLimit: number | null;
  published: boolean | null;
  createdAt: Date;
}

export interface EventDetail extends EventListItem {
  body: string | null;
  agenda: string | null;
  faq: string | null;
  venueAddress: string | null;
  registrationUrl: string | null;
  coverImageUrl: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  speakers?: SpeakerRef[];
}

export interface SpeakerRef {
  id: number;
  name: string;
  title: string | null;
  company: string | null;
  imageUrl: string | null;
  linkedInUrl: string | null;
  role: "speaker" | "judge" | "mentor" | "host" | "panelist";
}

export interface ProgramItem {
  id: number;
  title: string;
  slug: string;
  category: string;
  summary: string | null;
  imageUrl: string | null;
  featured: boolean | null;
}

export interface ImpactMetricItem {
  id: number;
  label: string;
  value: number;
  suffix: string | null;
  description: string | null;
  displayOrder: number | null;
}

export interface PartnerInquiryPayload {
  organizationName: string;
  contactName: string;
  email: string;
  phone?: string;
  interestType:
    | "sponsor"
    | "university_partner"
    | "media_partner"
    | "ecosystem_partner"
    | "other";
  notes?: string;
}

// ─── Sanity (editorial) ───────────────────────────────────────

export interface SanityImage {
  _type: "image";
  asset: { _ref: string; _type: "reference" };
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  alt?: string;
}

export interface SanityFounder {
  _id: string;
  name: string;
  designation: string;
  bio: string;
  image: SanityImage | null;
  linkedInUrl: string | null;
  twitterUrl: string | null;
  displayOrder: number;
}

export type AdvisorCategory =
  | "Industry"
  | "Academia"
  | "Policy"
  | "Startup"
  | "Technology";

export interface SanityAdvisor {
  _id: string;
  name: string;
  title: string;
  company: string;
  category: AdvisorCategory;
  bio: string;
  expertise: string[];
  image: SanityImage | null;
  linkedInUrl: string | null;
  twitterUrl: string | null;
  websiteUrl: string | null;
  featured: boolean;
  displayOrder: number;
}

export interface SanityPartner {
  _id: string;
  name: string;
  logo: SanityImage | null;
  websiteUrl: string | null;
  category: string;
  featured: boolean;
  isSupporter: boolean;
  displayOrder: number;
}

export interface SanitySupportedByItem {
  name: string;
  logo: SanityImage | null;
  url: string | null;
  displayOrder: number;
}

export interface SanitySiteSettings {
  siteTitle: string;
  heroHeadline: string;
  heroSubcopy: string;
  heroPrimaryCta: string;
  heroSecondaryCta: string;
  supportedBy: SanitySupportedByItem[];
}

export interface SanityAboutPage {
  heroHeadline: string;
  heroSubcopy: string;
  missionTitle: string;
  missionBody: PortableTextBlock[];
  visionTitle: string;
  visionBody: PortableTextBlock[];
  governanceNote: PortableTextBlock[] | null;
}

export interface PortableTextBlock {
  _type: "block";
  _key: string;
  style: string;
  children: Array<{
    _type: "span";
    _key: string;
    text: string;
    marks: string[];
  }>;
  markDefs: unknown[];
}
